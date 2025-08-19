# 🚨 ACİL YAPILMASI GEREKENLER - KAFKAS PANEL

**Kritik Seviye:** 🔴 Yüksek  
**Tahmini Süre:** 2-3 Hafta (2 Developer)

---

## 📋 HAFTA 1: DATABASE & API

### Pazartesi-Salı: Donations Database
```sql
-- [ ] 1. Donations modülü tabloları oluştur
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES public.donors(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    donation_type TEXT CHECK (donation_type IN ('cash', 'bank', 'credit_card', 'online')),
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE,
    receipt_number TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [ ] 2. Donors tablosu
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    identity_number TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'TR',
    donor_type TEXT DEFAULT 'individual' CHECK (donor_type IN ('individual', 'corporate', 'anonymous')),
    is_recurring BOOLEAN DEFAULT false,
    preferred_contact TEXT CHECK (preferred_contact IN ('phone', 'email', 'sms', 'none')),
    total_donated DECIMAL(10,2) DEFAULT 0,
    last_donation_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [ ] 3. Payment transactions tablosu
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID REFERENCES public.donations(id),
    gateway TEXT NOT NULL CHECK (gateway IN ('iyzico', 'paytr', 'stripe', 'manual')),
    gateway_transaction_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    status TEXT NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [ ] 4. Donation categories tablosu
CREATE TABLE public.donation_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    target_amount DECIMAL(10,2),
    collected_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Çarşamba-Perşembe: API Endpoints
```typescript
// [ ] 5. api/routes/donations.ts oluştur
// [ ] 6. api/routes/donors.ts oluştur
// [ ] 7. api/routes/payments.ts oluştur

// [ ] 8. Temel CRUD operations:
// GET    /api/donations
// POST   /api/donations
// GET    /api/donations/:id
// PUT    /api/donations/:id
// DELETE /api/donations/:id

// GET    /api/donors
// POST   /api/donors
// GET    /api/donors/:id
// PUT    /api/donors/:id

// POST   /api/payments/process
// GET    /api/payments/status/:id
// POST   /api/payments/webhook
```

### Cuma: Scholarship & Fund Tables
```sql
-- [ ] 9. Scholarship tables
CREATE TABLE public.scholarship_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES public.beneficiaries(id),
    student_number TEXT UNIQUE,
    school_name TEXT,
    department TEXT,
    grade_level TEXT,
    gpa DECIMAL(3,2),
    scholarship_amount DECIMAL(10,2),
    payment_frequency TEXT CHECK (payment_frequency IN ('monthly', 'quarterly', 'yearly')),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [ ] 10. Fund management tables
CREATE TABLE public.fund_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name TEXT NOT NULL,
    account_type TEXT CHECK (account_type IN ('income', 'expense', 'asset', 'liability')),
    balance DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'TRY',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📋 HAFTA 2: PAYMENT & MESSAGING

### Pazartesi-Salı: Payment Gateway
```javascript
// [ ] 11. İyzico hesabı aç (test & prod keys)
// [ ] 12. Payment service oluştur

// src/services/paymentService.ts
class PaymentService {
  // [ ] 13. processPayment method
  // [ ] 14. handle3DSecure method
  // [ ] 15. handleWebhook method
  // [ ] 16. refundPayment method
}
```

### Çarşamba: Email Service
```javascript
// [ ] 17. SendGrid hesabı aç
// [ ] 18. Email service oluştur

// src/services/emailService.ts
class EmailService {
  // [ ] 19. sendEmail method
  // [ ] 20. sendBulkEmail method
  // [ ] 21. sendTemplateEmail method
}
```

### Perşembe: SMS Service
```javascript
// [ ] 22. NetGSM veya Twilio hesabı
// [ ] 23. SMS service oluştur

// src/services/smsService.ts
class SMSService {
  // [ ] 24. sendSMS method
  // [ ] 25. sendBulkSMS method
  // [ ] 26. getDeliveryReport method
}
```

### Cuma: Testing & Security
```bash
# [ ] 27. API endpoint testleri yaz
# [ ] 28. Payment flow testi
# [ ] 29. Security audit (basic)
# [ ] 30. Rate limiting ekle
```

---

## 📋 HAFTA 3: INTEGRATION & DEPLOYMENT

### Pazartesi-Salı: Frontend Integration
```typescript
// [ ] 31. Donations sayfalarını API'ye bağla
// [ ] 32. Payment form entegrasyonu
// [ ] 33. Donor management UI
// [ ] 34. Receipt generation
```

### Çarşamba: Testing
```bash
# [ ] 35. Unit test coverage %70+
# [ ] 36. Integration tests
# [ ] 37. E2E critical paths
# [ ] 38. Load testing
```

### Perşembe: Production Setup
```bash
# [ ] 39. Environment variables
# [ ] 40. Database migrations
# [ ] 41. Backup strategy
# [ ] 42. Monitoring setup
```

### Cuma: Go Live
```bash
# [ ] 43. Final security check
# [ ] 44. Performance optimization
# [ ] 45. Deploy to production
# [ ] 46. Post-deployment tests
```

---

## 🔧 HEMEN KURULACAK ARAÇLAR

### Development Tools
```bash
# Database GUI
brew install --cask tableplus

# API Testing
brew install --cask postman

# Monitoring
npm install -g @sentry/cli
```

### Accounts to Create
1. [ ] İyzico - Payment Gateway
2. [ ] SendGrid - Email Service
3. [ ] NetGSM - SMS Service
4. [ ] Sentry - Error Tracking
5. [ ] UptimeRobot - Monitoring

### Environment Variables
```env
# Payment
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=

# Email
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# SMS
NETGSM_USERNAME=
NETGSM_PASSWORD=
NETGSM_HEADER=

# Monitoring
SENTRY_DSN=
```

---

## 📞 DESTEK KAYNAKLARI

### Documentation
- [İyzico Docs](https://dev.iyzipay.com)
- [SendGrid Docs](https://docs.sendgrid.com)
- [Supabase Docs](https://supabase.com/docs)

### Test Cards
```
Success: 5528790000000008
3D Secure: 5504720000000003
Failure: 5406670000000009
```

---

## ⚡ QUICK START COMMANDS

```bash
# 1. Database migration oluştur
supabase migration new add_donations_module

# 2. API endpoint test
curl -X POST http://localhost:3001/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 100, "donor_id": "..."}'

# 3. Frontend development
npm run dev

# 4. Run tests
npm test

# 5. Build for production
npm run build
```

---

**NOT:** Bu checklist'i günlük olarak takip edin ve tamamlanan maddeleri işaretleyin. Her gün sonunda progress'i paylaşın.
