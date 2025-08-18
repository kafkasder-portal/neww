import { Router, type Request, type Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';
import { generateCSRFToken } from '../middleware/security.js';
import { asyncHandler } from '../middleware/errorHandler.js';

dotenv.config();

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  department: z.string().optional(),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  'https://ibqhfgpdgzrhvyfpgjxx.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDk3NDcsImV4cCI6MjA3MDY4NTc0N30.1vSikm9_Dn978BctKWXhoOfPCKztLaBNgr8OEIVIXNg',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Regular Supabase client for user operations
const supabase = createClient(
  'https://ibqhfgpdgzrhvyfpgjxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDk3NDcsImV4cCI6MjA3MDY4NTc0N30.1vSikm9_Dn978BctKWXhoOfPCKztLaBNgr8OEIVIXNg'
);

/**
 * Get CSRF Token
 * GET /api/auth/csrf-token
 */
router.get('/csrf-token', (req: Request, res: Response): void => {
  const sessionToken = req.headers['x-session-token'] as string || 'default-session';
  const csrfToken = generateCSRFToken(sessionToken);
  
  res.json({
    csrfToken,
    sessionToken
  });
});

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', validateRequest(registerSchema), asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, full_name, department, phone } = req.body;

  // Validate required fields
  if (!email || !password || !full_name) {
    res.status(400).json({ error: 'Email, password, and full name are required' });
    return;
  }

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(user => user.email === email);
  
  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  // Create user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      department,
      phone
    }
  });

  if (authError) {
    console.error('User creation error:', authError);
    res.status(400).json({ 
      error: authError.message || 'Failed to create user' 
    });
    return;
  }

  if (!authData.user) {
    res.status(500).json({ error: 'User creation failed' });
    return;
  }

  // Create user profile in our database
  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      full_name,
      department,
      phone,
      role: 'viewer', // Default role
      is_active: true,
      created_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    // Try to delete the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    res.status(500).json({ error: 'Failed to create user profile' });
    return;
  }

  // Sign in the user to get session
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error('Auto sign-in error:', signInError);
    res.status(201).json({
      message: 'User created successfully. Please sign in.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name
      }
    });
    return;
  }

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: authData.user.id,
      email: authData.user.email,
      full_name,
      role: 'viewer'
    }
  });
}));

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', validateRequest(loginSchema), asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  // Sign in with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Login error:', authError);
    res.status(401).json({ 
      error: authError.message || 'Invalid credentials' 
    });
    return;
  }

  if (!authData.user || !authData.session) {
    res.status(401).json({ error: 'Login failed' });
    return;
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    // Create profile if it doesn't exist
    const { error: createError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        full_name: authData.user.user_metadata?.full_name || 'User',
        role: 'viewer',
        is_active: true
      });

    if (createError) {
      console.error('Profile creation error:', createError);
    }
  }

  // Check if user is active
  if (profile && !profile.is_active) {
    res.status(403).json({ error: 'Account is deactivated' });
    return;
  }

  // Update last seen
  await supabaseAdmin
    .from('user_profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', authData.user.id);

  res.json({
    message: 'Login successful',
    user: {
      id: authData.user.id,
      email: authData.user.email,
      full_name: profile?.full_name || authData.user.user_metadata?.full_name,
      role: profile?.role || 'viewer',
      department: profile?.department,
      phone: profile?.phone,
      avatar_url: profile?.avatar_url,
      is_active: profile?.is_active ?? true
    },
    session: authData.session
  });
}));

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    // Sign out from Supabase
    const { error } = await supabase.auth.admin.signOut(token);
    
    if (error) {
      console.error('Logout error:', error);
      // Don't fail the request if logout fails - client should clear token anyway
    }
  }

  res.json({ message: 'Logout successful' });
}));

/**
 * Get Current User
 * GET /api/auth/me
 */
router.get('/me', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    res.status(500).json({ error: 'Failed to fetch user profile' });
    return;
  }

  // Check if user is active
  if (!profile.is_active) {
    res.status(403).json({ error: 'Account is deactivated' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      role: profile.role,
      department: profile.department,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      is_active: profile.is_active,
      last_seen_at: profile.last_seen_at,
      created_at: profile.created_at
    }
  });
}));

/**
 * Update User Profile
 * PUT /api/auth/profile
 */
router.put('/profile', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const { full_name, department, phone, avatar_url } = req.body;

  const updateData: any = {};
  if (full_name !== undefined) updateData.full_name = full_name;
  if (department !== undefined) updateData.department = department;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
  
  updateData.updated_at = new Date().toISOString();

  const { data: profile, error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('Profile update error:', updateError);
    res.status(500).json({ error: 'Failed to update profile' });
    return;
  }

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      role: profile.role,
      department: profile.department,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      is_active: profile.is_active
    }
  });
}));

/**
 * Change Password
 * POST /api/auth/change-password
 */
router.post('/change-password', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    res.status(400).json({ error: 'Current password and new password are required' });
    return;
  }

  if (new_password.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long' });
    return;
  }

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: current_password
  });

  if (verifyError) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: new_password
  });

  if (updateError) {
    console.error('Password update error:', updateError);
    res.status(500).json({ error: 'Failed to update password' });
    return;
  }

  res.json({ message: 'Password updated successfully' });
}));

/**
 * Request Password Reset
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`
  });

  if (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
    return;
  }

  res.json({ 
    message: 'If an account with that email exists, a password reset link has been sent' 
  });
}));

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ error: 'Token and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ error: 'Invalid or expired reset token' });
    return;
  }

  res.json({ message: 'Password reset successfully' });
}));

export default router;
