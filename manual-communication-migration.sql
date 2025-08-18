-- ======================================================
-- İLETİŞİM MODÜLÜ DATABASE MİGRATION
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ======================================================

-- Extensions (zaten mevcut olabilir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. SMS SİSTEMİ TABLOLARI
-- =============================================

-- SMS Templates Table
CREATE TABLE IF NOT EXISTS public.sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    category VARCHAR(100) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS Logs Table
CREATE TABLE IF NOT EXISTS public.sms_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    credits_used DECIMAL(10,2) DEFAULT 0,
    sent_by UUID REFERENCES public.user_profiles(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. EMAIL SİSTEMİ TABLOLARI
-- =============================================

-- Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    variables TEXT[] DEFAULT '{}',
    category VARCHAR(100) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to VARCHAR(255) NOT NULL,
    cc TEXT[],
    bcc TEXT[],
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_by UUID REFERENCES public.user_profiles(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. WHATSAPP SİSTEMİ TABLOLARI
-- =============================================

-- WhatsApp Logs Table
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_by UUID REFERENCES public.user_profiles(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Templates Table
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    variables TEXT[] DEFAULT '{}',
    category VARCHAR(100) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. GENEL AYARLAR TABLOSU
-- =============================================

-- Communication Settings Table
CREATE TABLE IF NOT EXISTS public.communication_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. INDEXES (PERFORMANS İÇİN)
-- =============================================

-- SMS indexes
CREATE INDEX IF NOT EXISTS idx_sms_logs_to ON public.sms_logs(to);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON public.sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_at ON public.sms_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_by ON public.sms_logs(sent_by);

-- Email indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_to ON public.email_logs(to);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_by ON public.email_logs(sent_by);

-- WhatsApp indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_to ON public.whatsapp_logs(to);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_status ON public.whatsapp_logs(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_at ON public.whatsapp_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent_by ON public.whatsapp_logs(sent_by);

-- =============================================
-- 6. TRIGGERS (OTOMATIK GÜNCELLEME)
-- =============================================

-- Update trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER IF NOT EXISTS update_sms_templates_updated_at 
    BEFORE UPDATE ON sms_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_whatsapp_templates_updated_at 
    BEFORE UPDATE ON whatsapp_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_communication_settings_updated_at 
    BEFORE UPDATE ON communication_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS) POLİCİES
-- =============================================

-- Enable RLS
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_settings ENABLE ROW LEVEL SECURITY;

-- SMS Templates policies
CREATE POLICY "sms_templates_select_policy" ON sms_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sms_templates_manage_policy" ON sms_templates FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'manager')
    )
);

-- SMS Logs policies
CREATE POLICY "sms_logs_select_policy" ON sms_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sms_logs_insert_policy" ON sms_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Email Templates policies
CREATE POLICY "email_templates_select_policy" ON email_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "email_templates_manage_policy" ON email_templates FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'manager')
    )
);

-- Email Logs policies
CREATE POLICY "email_logs_select_policy" ON email_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "email_logs_insert_policy" ON email_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- WhatsApp Templates policies
CREATE POLICY "whatsapp_templates_select_policy" ON whatsapp_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "whatsapp_templates_manage_policy" ON whatsapp_templates FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'manager')
    )
);

-- WhatsApp Logs policies
CREATE POLICY "whatsapp_logs_select_policy" ON whatsapp_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "whatsapp_logs_insert_policy" ON whatsapp_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Communication Settings policies
CREATE POLICY "communication_settings_select_policy" ON communication_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "communication_settings_manage_policy" ON communication_settings FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
    )
);

-- =============================================
-- 8. DEFAULT DATA (BAŞLANGIÇ VERİLERİ)
-- =============================================

-- Insert default SMS templates
INSERT INTO public.sms_templates (name, content, variables, category, is_active) VALUES
('Hoş Geldin Mesajı', 'Merhaba {{name}}! KAFKASDER ailesine hoş geldiniz. Yardımlarınız için teşekkür ederiz.', ARRAY['name'], 'welcome', true),
('Bağış Teşekkürü', 'Sayın {{name}}, {{amount}} TL bağışınız için teşekkür ederiz. Bağış no: {{donation_id}}', ARRAY['name', 'amount', 'donation_id'], 'donation', true),
('Toplantı Hatırlatması', 'Sayın {{name}}, {{date}} tarihinde {{time}} saatinde {{location}} konumunda toplantımız var.', ARRAY['name', 'date', 'time', 'location'], 'meeting', true),
('Ödeme Bildirimi', 'Sayın {{name}}, {{amount}} TL yardım ödemeniz hesabınıza geçmiştir. Ref: {{ref_no}}', ARRAY['name', 'amount', 'ref_no'], 'payment', true),
('Başvuru Durumu', 'Sayın {{name}}, {{application_type}} başvurunuz {{status}} durumuna geçmiştir.', ARRAY['name', 'application_type', 'status'], 'application', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, content, html_content, variables, category, is_active) VALUES
(
    'Hoş Geldin E-postası',
    'KAFKASDER Ailesine Hoş Geldiniz',
    'Merhaba {{name}},

KAFKASDER ailesine hoş geldiniz! Kaydınız başarıyla tamamlanmıştır.

Hesap bilgileriniz:
- E-posta: {{email}}
- Kayıt tarihi: {{date}}

Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.

Saygılarımızla,
KAFKASDER Ekibi',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hoş Geldiniz</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Merhaba {{name}}!</h2>
        <p>KAFKASDER ailesine hoş geldiniz! Kaydınız başarıyla tamamlanmıştır.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Hesap Bilgileriniz:</h3>
            <ul>
                <li><strong>E-posta:</strong> {{email}}</li>
                <li><strong>Kayıt tarihi:</strong> {{date}}</li>
            </ul>
        </div>
        
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        
        <p style="margin-top: 30px;">
            Saygılarımızla,<br>
            <strong>KAFKASDER Ekibi</strong>
        </p>
    </div>
</body>
</html>',
    ARRAY['name', 'email', 'date'],
    'welcome',
    true
),
(
    'Bağış Makbuzu',
    'Bağış Makbuzunuz - {{donation_id}}',
    'Sayın {{donor_name}},

{{amount}} TL tutarındaki bağışınız için teşekkür ederiz.

Bağış Detayları:
- Bağış No: {{donation_id}}
- Tutar: {{amount}} TL
- Tarih: {{date}}
- Ödeme Yöntemi: {{payment_method}}

Bu makbuz vergi indirimi için kullanılabilir.

KAFKASDER',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bağış Makbuzu</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">KAFKASDER</h1>
            <h2 style="color: #666;">Bağış Makbuzu</h2>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Bağış Detayları:</h3>
            <table style="width: 100%;">
                <tr><td><strong>Bağışçı:</strong></td><td>{{donor_name}}</td></tr>
                <tr><td><strong>Bağış No:</strong></td><td>{{donation_id}}</td></tr>
                <tr><td><strong>Tutar:</strong></td><td>{{amount}} TL</td></tr>
                <tr><td><strong>Tarih:</strong></td><td>{{date}}</td></tr>
                <tr><td><strong>Ödeme Yöntemi:</strong></td><td>{{payment_method}}</td></tr>
            </table>
        </div>
        
        <p><strong>Not:</strong> Bu makbuz vergi indirimi için kullanılabilir.</p>
        
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
            <p>KAFKASDER - Çeçen Kafkas Muhacirleri Yardımlaşma ve Dayanışma Derneği</p>
        </div>
    </div>
</body>
</html>',
    ARRAY['donor_name', 'amount', 'donation_id', 'date', 'payment_method'],
    'donation',
    true
),
(
    'Toplantı Daveti',
    'Toplantı Daveti - {{meeting_title}}',
    'Sayın {{name}},

{{meeting_title}} konulu toplantımıza davetlisiniz.

Toplantı Detayları:
- Tarih: {{date}}
- Saat: {{time}}
- Konum: {{location}}
- Süre: {{duration}}

Katılım durumunuzu bildirmenizi rica ederiz.

Saygılarımızla,
KAFKASDER',
    null,
    ARRAY['name', 'meeting_title', 'date', 'time', 'location', 'duration'],
    'meeting',
    true
)
ON CONFLICT (name) DO NOTHING;

-- Insert default WhatsApp templates
INSERT INTO public.whatsapp_templates (name, content, variables, category, is_active) VALUES
('Hoş Geldin Mesajı', 'Merhaba {{name}}! 🎉 KAFKASDER ailesine hoş geldiniz! Yardımlarınız için teşekkür ederiz. 🙏', ARRAY['name'], 'welcome', true),
('Bağış Teşekkürü', 'Sayın {{name}}, {{amount}} TL bağışınız için çok teşekkür ederiz! 💝 Bağış no: {{donation_id}}', ARRAY['name', 'amount', 'donation_id'], 'donation', true),
('Toplantı Hatırlatması', '📅 Sayın {{name}}, {{date}} tarihinde {{time}} saatinde toplantımız var. Konum: {{location}}', ARRAY['name', 'date', 'time', 'location'], 'meeting', true),
('Acil Bilgilendirme', '🚨 ÖNEMLİ: {{message}} - KAFKASDER', ARRAY['message'], 'urgent', true),
('Ödeme Bildirimi', '💰 Sayın {{name}}, {{amount}} TL ödemeniz hesabınıza geçmiştir. İşlem no: {{ref_no}}', ARRAY['name', 'amount', 'ref_no'], 'payment', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default communication settings
INSERT INTO public.communication_settings (setting_key, setting_value, setting_type, description) VALUES
('sms_provider', 'netgsm', 'string', 'SMS service provider'),
('sms_sender_name', 'KAFKASDER', 'string', 'Default SMS sender name'),
('email_provider', 'smtp', 'string', 'Email service provider'),
('email_from_name', 'KAFKASDER', 'string', 'Default email sender name'),
('whatsapp_enabled', 'false', 'boolean', 'WhatsApp service enabled'),
('max_bulk_sms_recipients', '1000', 'number', 'Maximum recipients for bulk SMS'),
('max_bulk_email_recipients', '500', 'number', 'Maximum recipients for bulk email'),
('sms_rate_limit_delay', '1000', 'number', 'Delay between SMS sends (ms)'),
('email_rate_limit_delay', '2000', 'number', 'Delay between email sends (ms)')
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================
-- 9. STATISTICS FUNCTION
-- =============================================

-- Create function to get communication stats
CREATE OR REPLACE FUNCTION get_communication_stats(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'sms', json_build_object(
            'total', COALESCE((SELECT COUNT(*) FROM sms_logs WHERE sent_at BETWEEN start_date AND end_date), 0),
            'sent', COALESCE((SELECT COUNT(*) FROM sms_logs WHERE status = 'sent' AND sent_at BETWEEN start_date AND end_date), 0),
            'delivered', COALESCE((SELECT COUNT(*) FROM sms_logs WHERE status = 'delivered' AND sent_at BETWEEN start_date AND end_date), 0),
            'failed', COALESCE((SELECT COUNT(*) FROM sms_logs WHERE status = 'failed' AND sent_at BETWEEN start_date AND end_date), 0)
        ),
        'email', json_build_object(
            'total', COALESCE((SELECT COUNT(*) FROM email_logs WHERE sent_at BETWEEN start_date AND end_date), 0),
            'sent', COALESCE((SELECT COUNT(*) FROM email_logs WHERE status = 'sent' AND sent_at BETWEEN start_date AND end_date), 0),
            'delivered', COALESCE((SELECT COUNT(*) FROM email_logs WHERE status = 'delivered' AND sent_at BETWEEN start_date AND end_date), 0),
            'opened', COALESCE((SELECT COUNT(*) FROM email_logs WHERE opened_at IS NOT NULL AND sent_at BETWEEN start_date AND end_date), 0),
            'clicked', COALESCE((SELECT COUNT(*) FROM email_logs WHERE clicked_at IS NOT NULL AND sent_at BETWEEN start_date AND end_date), 0),
            'failed', COALESCE((SELECT COUNT(*) FROM email_logs WHERE status = 'failed' AND sent_at BETWEEN start_date AND end_date), 0)
        ),
        'whatsapp', json_build_object(
            'total', COALESCE((SELECT COUNT(*) FROM whatsapp_logs WHERE sent_at BETWEEN start_date AND end_date), 0),
            'sent', COALESCE((SELECT COUNT(*) FROM whatsapp_logs WHERE status = 'sent' AND sent_at BETWEEN start_date AND end_date), 0),
            'delivered', COALESCE((SELECT COUNT(*) FROM whatsapp_logs WHERE status = 'delivered' AND sent_at BETWEEN start_date AND end_date), 0),
            'read', COALESCE((SELECT COUNT(*) FROM whatsapp_logs WHERE status = 'read' AND sent_at BETWEEN start_date AND end_date), 0),
            'failed', COALESCE((SELECT COUNT(*) FROM whatsapp_logs WHERE status = 'failed' AND sent_at BETWEEN start_date AND end_date), 0)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- MİGRATION TAMAMLANDI! ✅
-- =============================================

-- Test query to verify tables created
SELECT 
    'SMS Templates' as service,
    COUNT(*) as default_templates
FROM sms_templates
UNION ALL
SELECT 
    'Email Templates' as service,
    COUNT(*) as default_templates
FROM email_templates
UNION ALL
SELECT 
    'WhatsApp Templates' as service,
    COUNT(*) as default_templates
FROM whatsapp_templates;

-- Show all communication tables
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename LIKE '%sms%' 
   OR tablename LIKE '%email%' 
   OR tablename LIKE '%whatsapp%'
   OR tablename = 'communication_settings'
ORDER BY tablename;
