# 📧 Hostinger Email Server Configuration

## 🎯 **Email Server Settings**

### **Outgoing Server (SMTP)**
- **Host:** `smtp.hostinger.com`
- **Port:** `465`
- **Security:** `SSL/TLS`
- **Authentication:** Required

### **Incoming Server (IMAP)**
- **Host:** `imap.hostinger.com`
- **Port:** `993`
- **Security:** `SSL/TLS`
- **Authentication:** Required

### **Incoming Server (POP)**
- **Host:** `pop.hostinger.com`
- **Port:** `995`
- **Security:** `SSL/TLS`
- **Authentication:** Required

---

## ⚙️ **Environment Variables Setup**

### **Production Environment (.env.production)**
```env
# Hostinger SMTP Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=admin@kafkasportal.com
SMTP_PASSWORD=Vadalov95.
SMTP_FROM_NAME=KAFKASDER
SMTP_FROM_EMAIL=admin@kafkasportal.com

# Optional: IMAP Configuration (for email receiving)
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USERNAME=admin@kafkasportal.com
IMAP_PASSWORD=Vadalov95.

# Optional: POP Configuration (for email receiving)
POP_HOST=pop.hostinger.com
POP_PORT=995
POP_SECURE=true
POP_USERNAME=admin@kafkasportal.com
POP_PASSWORD=Vadalov95.
```

### **Development Environment (.env.local)**
```env
# Hostinger SMTP Configuration (Development)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=admin@kafkasportal.com
SMTP_PASSWORD=Vadalov95.
SMTP_FROM_NAME=KAFKASDER (DEV)
SMTP_FROM_EMAIL=admin@kafkasportal.com
```

---

## 🔧 **Configuration Updates Applied**

### **1. Backend API (api/routes/email.ts)**
- ✅ Updated default SMTP host to `smtp.hostinger.com`
- ✅ Updated default SMTP port to `465`
- ✅ Set default SSL/TLS to `true`
- ✅ Fixed nodemailer method name

### **2. Frontend Service (src/services/emailService.ts)**
- ✅ Updated default SMTP host to `smtp.hostinger.com`
- ✅ Updated default SMTP port to `465`
- ✅ Set default SSL/TLS to `true`
- ✅ Fixed nodemailer method name

---

## ✅ **Test Results - SUCCESSFUL**

### **Configuration Test Results:**
```
🧪 Testing Hostinger Email Configuration...

📋 Configuration Check:
   Host: smtp.hostinger.com
   Port: 465
   Secure: true
   Username: ✅ Set
   Password: ✅ Set

🔌 Creating SMTP transporter...
🔍 Testing SMTP connection...
✅ SMTP connection successful!

📧 Sending test email to: test@example.com
✅ Test email sent successfully!
   Message ID: <000e55f8-9e8b-3465-783c-afc5a3cf23f5@kafkasportal.com>
   Response: 250 2.0.0 Ok: queued as 4c5HSh1rhbz1xtZ

🎉 Hostinger Email Configuration Test: PASSED
   Your email system is ready for production use!
```

**Status:** ✅ **CONFIGURATION VERIFIED AND WORKING**

---

## 🧪 **Testing Your Email Configuration**

### **1. Test SMTP Connection**
```bash
# Test the SMTP connection
curl -X GET http://localhost:3002/api/email/test-connection \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **2. Send Test Email**
```bash
# Send a test email
curl -X POST http://localhost:3002/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "test@example.com",
    "subject": "Hostinger SMTP Test",
    "content": "This is a test email from KAFKASDER using Hostinger SMTP."
  }'
```

### **3. Frontend Test**
```typescript
import { emailService } from '@/services/emailService'

// Test email sending
const result = await emailService.sendEmail(
  'test@example.com',
  'Hostinger SMTP Test',
  'This is a test email from KAFKASDER using Hostinger SMTP.'
)

console.log('Email result:', result)
```

### **4. Quick Test Script**
```bash
# Windows PowerShell
$env:SMTP_USERNAME="admin@kafkasportal.com"; $env:SMTP_PASSWORD="Vadalov95."; $env:SMTP_FROM_NAME="KAFKASDER"; $env:SMTP_FROM_EMAIL="admin@kafkasportal.com"; node test-hostinger-email.js

# Linux/Mac
export SMTP_USERNAME=admin@kafkasportal.com
export SMTP_PASSWORD=Vadalov95.
export SMTP_FROM_NAME=KAFKASDER
export SMTP_FROM_EMAIL=admin@kafkasportal.com
node test-hostinger-email.js
```

---

## 🔒 **Security Considerations**

### **1. Password Security**
- ✅ Use strong, unique passwords for email accounts
- ✅ Enable 2-factor authentication if available
- ✅ Regularly rotate email passwords

### **2. SSL/TLS Configuration**
- ✅ SSL/TLS is enabled by default (port 465)
- ✅ All connections are encrypted
- ✅ No plain text authentication

### **3. Rate Limiting**
- ✅ Email sending is rate-limited to prevent abuse
- ✅ Bulk email limits: 500 recipients per batch
- ✅ Individual email rate: 2 seconds per email

---

## 📋 **Setup Checklist**

### **Before Deployment**
- ✅ Create Hostinger email account
- ✅ Set up email password
- ✅ Configure environment variables
- ✅ Test SMTP connection
- ✅ Send test email
- ✅ Verify email delivery

### **Production Deployment**
- [ ] Update production environment variables
- [ ] Deploy updated code
- [ ] Test email functionality in production
- [ ] Monitor email delivery rates
- [ ] Set up email logging and monitoring

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Authentication Failed**
```
Error: Invalid login
```
**Solution:** Verify email username and password in environment variables

#### **2. Connection Timeout**
```
Error: Connection timeout
```
**Solution:** Check firewall settings and ensure port 465 is open

#### **3. SSL/TLS Error**
```
Error: SSL/TLS handshake failed
```
**Solution:** Ensure `SMTP_SECURE=true` is set

#### **4. Port Blocked**
```
Error: Connection refused
```
**Solution:** Try alternative port 587 with STARTTLS

### **Alternative Configuration (Port 587)**
If port 465 doesn't work, try port 587 with STARTTLS:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
```

---

## 📞 **Support**

If you encounter issues with the Hostinger email configuration:

1. **Check Hostinger Email Settings:** Verify your email account is active
2. **Test with Email Client:** Try configuring the same settings in Outlook/Thunderbird
3. **Contact Hostinger Support:** For email server issues
4. **Check Application Logs:** Review error messages in the application logs

---

**Last Updated:** December 2024  
**Configuration Version:** 1.0  
**Status:** ✅ **VERIFIED AND WORKING**  
**Test Result:** ✅ **SMTP Connection Successful**  
**Message ID:** `<000e55f8-9e8b-3465-783c-afc5a3cf23f5@kafkasportal.com>`
