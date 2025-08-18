-- Add status column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' 
CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

-- First insert into auth.users (system user)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@system.local',
    crypt('system_admin_password', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Administrator"}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Then insert or update system admin user profile
INSERT INTO public.user_profiles (
    id,
    full_name,
    display_name,
    email,
    role,
    status,
    is_active,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'System Administrator',
    'System Admin',
    'admin@system.local',
    'super_admin',
    'active',
    true,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active,
    updated_at = now();