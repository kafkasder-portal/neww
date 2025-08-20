import type { Session, User } from '@supabase/supabase-js'
import { toast } from 'sonner'

// Demo user profiles for testing when Supabase is not available
const DEMO_USERS = [
  {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    password: 'admin123',
    user_metadata: {
      full_name: 'Demo Admin',
      role: 'admin'
    },
    profile: {
      id: 'demo-admin-1',
      full_name: 'Demo Admin',
      role: 'admin' as const,
      department: 'Administration',
      phone: '+90 555 000 0001',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-manager-1',
    email: 'manager@demo.com',
    password: 'manager123',
    user_metadata: {
      full_name: 'Demo Manager',
      role: 'manager'
    },
    profile: {
      id: 'demo-manager-1',
      full_name: 'Demo Manager',
      role: 'manager' as const,
      department: 'Operations',
      phone: '+90 555 000 0002',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-user-1',
    email: 'user@demo.com',
    password: 'user123',
    user_metadata: {
      full_name: 'Demo User',
      role: 'user'
    },
    profile: {
      id: 'demo-user-1',
      full_name: 'Demo User',
      role: 'user' as const,
      department: 'General',
      phone: '+90 555 000 0003',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
]

export class DemoAuthService {
  private static instance: DemoAuthService
  private currentUser: any = null
  private session: Session | null = null

  private constructor() {}

  static getInstance(): DemoAuthService {
    if (!DemoAuthService.instance) {
      DemoAuthService.instance = new DemoAuthService()
    }
    return DemoAuthService.instance
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const demoUser = DEMO_USERS.find(
      user => user.email === credentials.email && user.password === credentials.password
    )

    if (!demoUser) {
      throw new Error('Invalid email or password. Try: admin@demo.com / admin123')
    }

    // Create mock session
    this.session = {
      access_token: `demo-token-${demoUser.id}`,
      refresh_token: `demo-refresh-${demoUser.id}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {
        id: demoUser.id,
        email: demoUser.email,
        user_metadata: demoUser.user_metadata,
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as User
    } as Session

    this.currentUser = {
      ...this.session.user,
      profile: demoUser.profile
    }

    return {
      data: {
        user: this.session.user,
        session: this.session
      },
      error: null
    }
  }

  async signUp(credentials: { 
    email: string; 
    password: string; 
    options?: { data?: any } 
  }) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check if user already exists
    const existingUser = DEMO_USERS.find(user => user.email === credentials.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Create new demo user
    const newUser = {
      id: `demo-user-${Date.now()}`,
      email: credentials.email,
      user_metadata: {
        full_name: credentials.options?.data?.full_name || 'New User',
        role: 'user'
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User

    return {
      data: {
        user: newUser,
        session: null
      },
      error: null
    }
  }

  async signOut() {
    this.currentUser = null
    this.session = null
    return { error: null }
  }

  async getSession() {
    return {
      data: { session: this.session },
      error: null
    }
  }

  async getUser() {
    return {
      data: { user: this.currentUser },
      error: null
    }
  }

  async resetPasswordForEmail(email: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const user = DEMO_USERS.find(user => user.email === email)
    if (!user) {
      throw new Error('No user found with this email address')
    }

    return { error: null }
  }

  async updateUser(updates: any) {
    if (!this.currentUser) {
      throw new Error('No user logged in')
    }

    // Update current user
    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updated_at: new Date().toISOString()
    }

    return {
      data: { user: this.currentUser },
      error: null
    }
  }

  // Auth state change listener (simplified)
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    // Store callback for later use
    return {
      data: { subscription: { unsubscribe: () => {} } },
      error: null
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  getSession() {
    return this.session
  }

  isAuthenticated() {
    return !!this.session && !!this.currentUser
  }
}

export const demoAuth = DemoAuthService.getInstance()

// Helper function to check if we should use demo auth
export const shouldUseDemoAuth = () => {
  return import.meta.env.VITE_MOCK_API === 'true' || 
         import.meta.env.VITE_USE_DEMO_AUTH === 'true'
}

// Demo credentials info
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@demo.com', password: 'admin123' },
  manager: { email: 'manager@demo.com', password: 'manager123' },
  user: { email: 'user@demo.com', password: 'user123' }
}
