-- Fix Tables and RLS Policies - Manual SQL Commands
-- Bu komutları Supabase Dashboard > SQL Editor'da çalıştırın

-- =============================================
-- 1. DISABLE RLS TEMPORARILY
-- =============================================

-- Disable RLS on all tables to fix infinite recursion
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.aid_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.in_kind_aids DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_agenda DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. DROP EXISTING POLICIES
-- =============================================

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view meetings they organize or participate in" ON meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON meetings;
DROP POLICY IF EXISTS "Meeting organizers can update their meetings" ON meetings;
DROP POLICY IF EXISTS "Meeting organizers can delete their meetings" ON meetings;

DROP POLICY IF EXISTS "Users can view participants of meetings they're involved in" ON meeting_attendees;
DROP POLICY IF EXISTS "Meeting organizers can manage participants" ON meeting_attendees;
DROP POLICY IF EXISTS "Users can update their own participation status" ON meeting_attendees;

DROP POLICY IF EXISTS "Users can view agenda for meetings they're involved in" ON meeting_agenda;
DROP POLICY IF EXISTS "Meeting organizers can manage agenda items" ON meeting_agenda;

DROP POLICY IF EXISTS "Users can view notes for meetings they're involved in" ON meeting_minutes;
DROP POLICY IF EXISTS "Meeting participants can create notes" ON meeting_minutes;
DROP POLICY IF EXISTS "Note creators can update their notes" ON meeting_minutes;

-- =============================================
-- 3. CREATE SIMPLE RLS POLICIES
-- =============================================

-- Enable RLS with simple policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.in_kind_aids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Simple policies for authenticated users
CREATE POLICY "Authenticated users can access all data" ON public.user_profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.beneficiaries
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.family_members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.applications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.aid_records
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.payments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.in_kind_aids
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.meetings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.meeting_attendees
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.meeting_agenda
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.meeting_minutes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.documents
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access all data" ON public.notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 4. CREATE ERROR_LOGS TABLE IF MISSING
-- =============================================

CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES public.user_profiles(id),
    request_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can access all data" ON public.error_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 5. GRANT PERMISSIONS
-- =============================================

-- Grant permissions for error_logs table
GRANT ALL PRIVILEGES ON public.error_logs TO anon;
GRANT ALL PRIVILEGES ON public.error_logs TO authenticated;
GRANT ALL PRIVILEGES ON public.error_logs TO service_role;

-- =============================================
-- 6. VERIFY TABLES
-- =============================================

-- Check if all tables are accessible
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'beneficiaries', 'family_members', 'applications',
    'aid_records', 'payments', 'in_kind_aids', 'meetings', 'meeting_attendees',
    'meeting_agenda', 'meeting_minutes', 'documents', 'notifications', 'error_logs'
)
ORDER BY table_name;
