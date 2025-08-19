# 🚀 İletişim Modülü Deployment Rehberi

Bu rehber, yeni implement edilen iletişim modülünü production'a deploy etmek için gerekli adımları içerir.

---

## 📋 **Deployment Checklist**

### ✅ **1. Database Migration**

Supabase Dashboard'a gidin ve SQL Editor'da şu dosyayı çalıştırın:
```sql
-- Dosya: manual-communication-migration.sql
-- Bu dosyayı kopyalayıp Supabase SQL Editor'da çalıştırın
```

**Alternatif olarak:**
```bash
# Eğer Docker çalışıyorsa
npx supabase db push

# Manuel olarak migration dosyasını çalıştır
# Supabase Dashboard > SQL Editor > manual-communication-migration.sql
```

### ✅ **2. Environment Variables Ayarlama**

Production environment için `.env.production` dosyası oluşturun:

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Production API
VITE_API_BASE_URL=https://your-api-domain.com
NODE_ENV=production

# NetGSM Production
NETGSM_USERNAME=kafkasder_prod_user
NETGSM_PASSWORD=your_production_password
NETGSM_SENDER=KAFKASDER

# SMTP Production (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=your_email@yourdomain.com
SMTP_PASSWORD=your_production_email_password
SMTP_FROM_NAME=KAFKASDER
SMTP_FROM_EMAIL=noreply@yourdomain.com

# WhatsApp Business Production
WHATSAPP_PHONE_NUMBER_ID=your_prod_phone_id
WHATSAPP_ACCESS_TOKEN=your_prod_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_prod_verify_token
```

### ✅ **3. External Services Setup**

#### **A. NetGSM Hesap Kurulumu**
1. [NetGSM](https://www.netgsm.com.tr) hesabı açın
2. SMS paketi satın alın
3. API bilgilerinizi alın:
   - Username (Kullanıcı adı)
   - Password (Şifre)
   - Sender (Gönderici adı)

#### **B. Hostinger SMTP Email Kurulumu**
```bash
# Hostinger Email Server Settings:
# - SMTP Host: smtp.hostinger.com
# - SMTP Port: 465 (SSL/TLS)
# - IMAP Host: imap.hostinger.com
# - IMAP Port: 993 (SSL/TLS)
# - POP Host: pop.hostinger.com
# - POP Port: 995 (SSL/TLS)

# Environment Variables:
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=your_email@yourdomain.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_NAME=KAFKASDER
SMTP_FROM_EMAIL=noreply@yourdomain.com

# Test your configuration:
node test-hostinger-email.js
```

#### **C. WhatsApp Business API Setup**
1. [Meta Business](https://business.facebook.com) hesabı açın
2. WhatsApp Business API başvurusu yapın
3. Phone Number ID ve Access Token alın
4. Webhook URL'i ayarlayın: `https://your-api.com/api/whatsapp/webhook`

### ✅ **4. Vercel Deployment**

```bash
# Environment variables'ları Vercel'e ekleyin
vercel env add NETGSM_USERNAME
vercel env add NETGSM_PASSWORD
vercel env add SMTP_USERNAME
vercel env add SMTP_PASSWORD
vercel env add WHATSAPP_ACCESS_TOKEN

# Deploy
vercel --prod
```

### ✅ **5. Backend API Deployment**

API için environment variables:
```bash
# Backend .env dosyası
NODE_ENV=production
PORT=3002

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SMS
NETGSM_USERNAME=your_username
NETGSM_PASSWORD=your_password
NETGSM_SENDER=KAFKASDER

# Email (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=your_email@yourdomain.com
SMTP_PASSWORD=your_password
SMTP_FROM_NAME=KAFKASDER
SMTP_FROM_EMAIL=noreply@yourdomain.com

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

---

## 🧪 **Testing & Verification**

### **1. Database Test**
```sql
-- Supabase SQL Editor'da çalıştırın
SELECT 
    'SMS Templates' as service,
    COUNT(*) as count
FROM sms_templates
UNION ALL
SELECT 
    'Email Templates' as service,
    COUNT(*) as count
FROM email_templates;

-- Sonuç:
-- SMS Templates: 5
-- Email Templates: 3
```

### **2. API Endpoint Tests**
```bash
# SMS Test
curl -X POST https://your-api.com/api/sms/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to": "905551234567", "message": "Test SMS"}'

# Email Test
curl -X POST https://your-api.com/api/email/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "content": "Test email"}'

# WhatsApp Test
curl -X GET https://your-api.com/api/whatsapp/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Frontend Integration Test**
```bash
# Development server'ı başlatın
npm run dev

# Test mesaj gönderimleri:
# 1. /messages sayfasına gidin
# 2. SMS gönderimi test edin
# 3. Email gönderimi test edin
# 4. Template'ları test edin
```

---

## 📊 **Monitoring & Analytics**

### **Dashboard Metrics**
Sisteme giriş yaptıktan sonra kontrol edin:

1. **Messages Analytics** (`/messages/analytics`)
   - SMS gönderim oranları
   - Email açılma oranları
   - WhatsApp delivery rates

2. **Communication Stats API**
   ```bash
   GET /api/whatsapp/communication-stats
   ```

3. **Balance Monitoring**
   ```bash
   GET /api/sms/balance  # NetGSM kredi kontrolü
   ```

### **Log Monitoring**
```sql
-- Son 24 saat SMS logları
SELECT COUNT(*), status 
FROM sms_logs 
WHERE sent_at > NOW() - INTERVAL '24 hours'
GROUP BY status;

-- Email istatistikleri
SELECT COUNT(*), status 
FROM email_logs 
WHERE sent_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

---

## ⚠️ **Production Notes**

### **Rate Limiting**
- **SMS**: 1 saniye/mesaj (NetGSM limiti)
- **Email**: 2 saniye/email (SMTP koruması)
- **WhatsApp**: 3 saniye/mesaj (Meta limiti)

### **Cost Estimates**
- **NetGSM SMS**: ~0.05 TL/SMS
- **Email SMTP**: Ücretsiz (kendi sunucu) veya ~$10/ay
- **WhatsApp Business**: İlk 1000 mesaj/ay ücretsiz

### **Security**
- ✅ Input validation
- ✅ Rate limiting
- ✅ Authentication required
- ✅ Role-based permissions
- ✅ XSS/CSRF protection

### **Backup & Recovery**
```sql
-- Communication data backup
pg_dump -t sms_logs -t email_logs -t whatsapp_logs > communication_backup.sql
```

---

## 🆘 **Troubleshooting**

### **SMS Gönderilmiyor**
1. NetGSM kredilerini kontrol edin
2. Telefon numarası formatını kontrol edin
3. API error loglarını inceleyin

### **Email Gönderilmiyor**
1. SMTP bağlantısını test edin: `GET /api/email/test-connection`
2. Gmail ise App Password kullandığınızdan emin olun
3. Firewall/port ayarlarını kontrol edin

### **WhatsApp Çalışmıyor**
1. Access Token'ın geçerli olduğundan emin olun
2. Phone Number ID'nin doğru olduğunu kontrol edin
3. Webhook URL'inin erişilebilir olduğunu test edin

### **Database Issues**
```sql
-- RLS policies kontrol
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE '%sms%' OR tablename LIKE '%email%';

-- Table permissions kontrol
SELECT table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name IN ('sms_logs', 'email_logs', 'whatsapp_logs');
```

---

## 🎯 **Success Criteria**

Migration başarılı ise:
- ✅ Database'de yeni tablolar görünür
- ✅ API endpoints çalışır
- ✅ Test mesajları gönderilir
- ✅ Loglar database'e kaydedilir
- ✅ Template'lar çalışır

**Sistem artık production kullanımına hazır!** 🎉
