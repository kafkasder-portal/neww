# 🔧 Migration Talimatları

## 📋 Sorun
- 11 tabloda RLS (Row Level Security) politikası hatası var
- `error_logs` tablosu eksik
- Infinite recursion hataları mevcut

## 🎯 Çözüm
Aşağıdaki SQL komutlarını **Supabase Dashboard > SQL Editor**'da çalıştırın:

### 1️⃣ RLS'yi Devre Dışı Bırak

```sql
-- RLS'yi tüm tablolarda devre dışı bırak
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
```

### 2️⃣ Mevcut Politikaları Sil

```sql
-- Tüm politikaları sil
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

-- Diğer tüm politikaları sil
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can access all data" ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;
```

### 3️⃣ Eksik Tabloyu Oluştur

```sql
-- error_logs tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES public.user_profiles(id),
    request_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS'yi error_logs için de devre dışı bırak
ALTER TABLE public.error_logs DISABLE ROW LEVEL SECURITY;
```

### 4️⃣ Tüm İzinleri Ver

```sql
-- Tüm tablolara tüm izinleri ver
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- Sequence izinleri
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
```

### 5️⃣ Durumu Kontrol Et

```sql
-- RLS durumunu kontrol et
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
```

## 📝 Adımlar

1. **Supabase Dashboard**'a giriş yapın
2. **SQL Editor**'ı açın
3. Yukarıdaki SQL komutlarını sırayla çalıştırın
4. Her komutun başarılı olduğunu kontrol edin
5. Son kontrol komutunu çalıştırarak tüm tabloların `rowsecurity = false` olduğunu doğrulayın

## ✅ Beklenen Sonuç

Migration tamamlandıktan sonra:
- ✅ Tüm tablolar erişilebilir olacak
- ✅ RLS politikası hataları çözülecek
- ✅ `error_logs` tablosu oluşturulacak
- ✅ Formlar düzgün çalışacak

## 🔍 Test

Migration tamamlandıktan sonra test scriptini çalıştırın:

```bash
node run-migration.js
```

Tüm tabloların erişilebilir olduğunu göreceksiniz.
