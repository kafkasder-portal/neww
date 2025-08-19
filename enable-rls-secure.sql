-- Enable RLS Securely - Critical Security Fix
-- Bu komutları Supabase Dashboard > SQL Editor'da çalıştırın

-- =============================================
-- GÜVENLI RLS POLİCY AKTİVE ET
-- =============================================

-- 1. İlk olarak anonim erişimi kaldır
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- =============================================
-- RLS'Yİ TÜM TABLOLARDA YENİDEN AKTİFLEŞTİR
-- =============================================

-- Core user tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.in_kind_aids ENABLE ROW LEVEL SECURITY;

-- Meeting tables
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;

-- System tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TEMEL GÜVENLİ POLİCY'LER OLUŞTUR
-- =============================================

-- User Profiles - Kullanıcılar sadece kendi profillerini görebilir
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Beneficiaries - Sadece authenticated users
CREATE POLICY "Authenticated users can view beneficiaries" ON beneficiaries
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can manage beneficiaries" ON beneficiaries
    FOR ALL 
    TO authenticated 
    USING (true);

-- Family Members - Beneficiary ile ilişkili
CREATE POLICY "Authenticated users can manage family members" ON family_members
    FOR ALL 
    TO authenticated 
    USING (true);

-- Applications - Authenticated access
CREATE POLICY "Authenticated users can manage applications" ON applications
    FOR ALL 
    TO authenticated 
    USING (true);

-- Aid Records - Authenticated access
CREATE POLICY "Authenticated users can manage aid records" ON aid_records
    FOR ALL 
    TO authenticated 
    USING (true);

-- Payments - Authenticated access with audit trail
CREATE POLICY "Authenticated users can view payments" ON payments
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can create payments" ON payments
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- In-Kind Aids - Authenticated access
CREATE POLICY "Authenticated users can manage in_kind_aids" ON in_kind_aids
    FOR ALL 
    TO authenticated 
    USING (true);

-- Meetings - Meeting organizerları ve katılımcılar
CREATE POLICY "Users can view meetings they organize or participate in" ON meetings
    FOR SELECT 
    TO authenticated
    USING (
        organized_by = auth.uid() OR 
        id IN (
            SELECT meeting_id FROM meeting_attendees 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create meetings" ON meetings
    FOR INSERT 
    TO authenticated 
    WITH CHECK (organized_by = auth.uid());

CREATE POLICY "Meeting organizers can update their meetings" ON meetings
    FOR UPDATE 
    TO authenticated 
    USING (organized_by = auth.uid());

-- Meeting Attendees - Meeting'e katılan kullanıcılar
CREATE POLICY "Users can view participants of meetings they're involved in" ON meeting_attendees
    FOR SELECT 
    TO authenticated
    USING (
        user_id = auth.uid() OR 
        meeting_id IN (
            SELECT id FROM meetings 
            WHERE organized_by = auth.uid()
        )
    );

CREATE POLICY "Meeting organizers can manage participants" ON meeting_attendees
    FOR ALL 
    TO authenticated 
    USING (
        meeting_id IN (
            SELECT id FROM meetings 
            WHERE organized_by = auth.uid()
        )
    );

-- Documents - Authenticated access
CREATE POLICY "Authenticated users can manage documents" ON documents
    FOR ALL 
    TO authenticated 
    USING (true);

-- Notifications - Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT 
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Error Logs - Sadece service role erişebilir
CREATE POLICY "Service role can manage error logs" ON error_logs
    FOR ALL 
    TO service_role 
    USING (true);

-- =============================================
-- AUTHENTICATED KULLANICILARA UYGUN İZİNLER
-- =============================================

-- Authenticated kullanıcılar için gerekli izinler
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beneficiaries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aid_records TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.in_kind_aids TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_attendees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_agenda TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_minutes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;

-- Service role için error logs
GRANT ALL ON public.error_logs TO service_role;

-- Sequence'ler için izinler
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- VERİFİKASYON
-- =============================================

-- RLS durumunu kontrol et
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_profiles', 'beneficiaries', 'family_members', 'applications',
    'aid_records', 'payments', 'in_kind_aids', 'meetings', 'meeting_attendees',
    'meeting_agenda', 'meeting_minutes', 'documents', 'notifications', 'error_logs'
)
ORDER BY tablename;

-- Policy'leri kontrol et
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
