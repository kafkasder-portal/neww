-- Create system admin user for seed data
-- This creates the default admin user referenced in seed data

-- Insert system admin user profile
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    status,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin@system.local',
    'System Administrator',
    'super_admin',
    'active',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Ensure the admin user has proper permissions
UPDATE public.user_profiles 
SET role = 'super_admin', status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000000';