-- ⚠️  GÜVENLIK UYARISI - Bu dosya devre dışı bırakılmıştır
-- =============================================
-- 🚨 KRİTİK GÜVENLİK AÇIĞI - KULLANMAYIN!
-- =============================================
--
-- Bu dosya tüm RLS (Row Level Security) korumasını kaldırır ve
-- VERİ GÜVENLİĞİNİ CİDDİ RİSKE ATAR!
--
-- ❌ YAPMAYINIZ:
-- - RLS'yi tamamen devre dışı bırakmak
-- - Anonim kullanıcılara tam erişim vermek
-- - Production'da bu dosyayı kullanmak
--
-- ✅ BUNUN YERİNE:
-- - enable-rls-secure.sql dosyasını kullanın
-- - Güvenli RLS policy'leri uygulayın
-- - Principle of least privilege'ı takip edin
--
-- Bu dosya güvenlik nedeniyle devre dışı bırakılmıştır.

-- UYARI: Bu komutları çalıştırmayın!
-- Eğer RLS'yi yeniden aktifleştirmek istiyorsanız:
-- 1. enable-rls-secure.sql dosyasını kullanın
-- 2. Her tablo için uygun policy'ler oluşturun
-- 3. Authenticated kullanıcılara minimum gerekli izinleri verin

-- G��VENLİ ALTERNATİF:
-- \i enable-rls-secure.sql

-- =============================================
-- DROP ALL EXISTING POLICIES
-- =============================================

-- Drop all policies from all tables
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

-- Drop any other policies that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can access all data" ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- =============================================
-- CREATE ERROR_LOGS TABLE IF MISSING
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

-- Disable RLS for error_logs too
ALTER TABLE public.error_logs DISABLE ROW LEVEL SECURITY;

-- =============================================
-- GRANT ALL PERMISSIONS
-- =============================================

-- Grant all permissions to all roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =============================================
-- VERIFY CHANGES
-- =============================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_profiles', 'beneficiaries', 'family_members', 'applications',
    'aid_records', 'payments', 'in_kind_aids', 'meetings', 'meeting_attendees',
    'meeting_agenda', 'meeting_minutes', 'documents', 'notifications', 'error_logs'
)
ORDER BY tablename;
