@echo off
setlocal enabledelayedexpansion

echo 📧 Hostinger Email Configuration Setup
echo ======================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file...
    type nul > .env
)

echo 🔧 Configuring Hostinger Email Settings...
echo.

REM Clear existing email settings from .env
powershell -Command "(Get-Content .env) | Where-Object { $_ -notmatch '^SMTP_' -and $_ -notmatch '^IMAP_' -and $_ -notmatch '^POP_' } | Set-Content .env"

REM Add Hostinger email configuration
echo. >> .env
echo # Hostinger Email Configuration >> .env
echo SMTP_HOST=smtp.hostinger.com >> .env
echo SMTP_PORT=465 >> .env
echo SMTP_SECURE=true >> .env

REM Get user input for email settings
set /p smtp_username="Enter your Hostinger email address [your_email@yourdomain.com]: "
if "!smtp_username!"=="" set smtp_username=your_email@yourdomain.com
echo SMTP_USERNAME=!smtp_username! >> .env
echo ✅ Set SMTP_USERNAME=!smtp_username!

set /p smtp_password="Enter your email password: "
echo SMTP_PASSWORD=!smtp_password! >> .env
echo ✅ Set SMTP_PASSWORD (hidden)

set /p smtp_from_name="Enter sender name [KAFKASDER]: "
if "!smtp_from_name!"=="" set smtp_from_name=KAFKASDER
echo SMTP_FROM_NAME=!smtp_from_name! >> .env
echo ✅ Set SMTP_FROM_NAME=!smtp_from_name!

set /p smtp_from_email="Enter from email address [noreply@yourdomain.com]: "
if "!smtp_from_email!"=="" set smtp_from_email=noreply@yourdomain.com
echo SMTP_FROM_EMAIL=!smtp_from_email! >> .env
echo ✅ Set SMTP_FROM_EMAIL=!smtp_from_email!

echo.
echo 📋 Optional IMAP/POP Configuration
echo ==================================
echo.

REM Ask if user wants to configure IMAP/POP
set /p configure_imap="Do you want to configure IMAP/POP for email receiving? (y/N): "

if /i "!configure_imap!"=="y" (
    echo.
    echo 📥 IMAP Configuration
    echo IMAP_HOST=imap.hostinger.com >> .env
    echo IMAP_PORT=993 >> .env
    echo IMAP_SECURE=true >> .env
    echo IMAP_USERNAME=!smtp_username! >> .env
    echo IMAP_PASSWORD=!smtp_password! >> .env
    
    echo.
    echo 📥 POP Configuration
    echo POP_HOST=pop.hostinger.com >> .env
    echo POP_PORT=995 >> .env
    echo POP_SECURE=true >> .env
    echo POP_USERNAME=!smtp_username! >> .env
    echo POP_PASSWORD=!smtp_password! >> .env
    
    echo ✅ IMAP and POP configuration added
)

echo.
echo 🎯 Configuration Summary
echo ========================
echo ✅ SMTP Host: smtp.hostinger.com
echo ✅ SMTP Port: 465
echo ✅ SMTP Security: SSL/TLS
echo ✅ Username: !smtp_username!
echo ✅ From Name: !smtp_from_name!
echo ✅ From Email: !smtp_from_email!

echo.
echo 🧪 Testing Configuration
echo ========================
echo To test your email configuration, run:
echo   node test-hostinger-email.js
echo.
echo Or test with a specific email address:
echo   set TEST_EMAIL=your-test@example.com ^&^& node test-hostinger-email.js
echo.

echo 📝 Next Steps
echo =============
echo 1. Test your email configuration
echo 2. Deploy to production with updated environment variables
echo 3. Monitor email delivery in your application
echo.

echo ✅ Hostinger email configuration setup complete!
echo    Check your .env file for the configuration details.

pause
