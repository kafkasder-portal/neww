#!/bin/bash

# Hostinger Email Configuration Setup Script
# This script helps you set up environment variables for Hostinger email

echo "📧 Hostinger Email Configuration Setup"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    touch .env
fi

# Function to read input with default value
read_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n "$prompt [$default]: "
    read input
    local value="${input:-$default}"
    echo "$var_name=$value" >> .env
    echo "✅ Set $var_name=$value"
}

# Function to read secure input
read_secure() {
    local prompt="$1"
    local var_name="$2"
    
    echo -n "$prompt: "
    read -s input
    echo ""
    echo "$var_name=$input" >> .env
    echo "✅ Set $var_name (hidden)"
}

echo "🔧 Configuring Hostinger Email Settings..."
echo ""

# Clear existing email settings from .env
sed -i '/^SMTP_/d' .env
sed -i '/^IMAP_/d' .env
sed -i '/^POP_/d' .env

# Add Hostinger email configuration
echo "" >> .env
echo "# Hostinger Email Configuration" >> .env
echo "SMTP_HOST=smtp.hostinger.com" >> .env
echo "SMTP_PORT=465" >> .env
echo "SMTP_SECURE=true" >> .env

# Get user input for email settings
read_with_default "Enter your Hostinger email address" "your_email@yourdomain.com" "SMTP_USERNAME"
read_secure "Enter your email password" "SMTP_PASSWORD"
read_with_default "Enter sender name" "KAFKASDER" "SMTP_FROM_NAME"
read_with_default "Enter from email address" "noreply@yourdomain.com" "SMTP_FROM_EMAIL"

echo ""
echo "📋 Optional IMAP/POP Configuration"
echo "=================================="
echo ""

# Ask if user wants to configure IMAP/POP
echo -n "Do you want to configure IMAP/POP for email receiving? (y/N): "
read configure_imap

if [[ $configure_imap =~ ^[Yy]$ ]]; then
    echo ""
    echo "📥 IMAP Configuration"
    echo "IMAP_HOST=imap.hostinger.com" >> .env
    echo "IMAP_PORT=993" >> .env
    echo "IMAP_SECURE=true" >> .env
    echo "IMAP_USERNAME=$SMTP_USERNAME" >> .env
    echo "IMAP_PASSWORD=$SMTP_PASSWORD" >> .env
    
    echo ""
    echo "📥 POP Configuration"
    echo "POP_HOST=pop.hostinger.com" >> .env
    echo "POP_PORT=995" >> .env
    echo "POP_SECURE=true" >> .env
    echo "POP_USERNAME=$SMTP_USERNAME" >> .env
    echo "POP_PASSWORD=$SMTP_PASSWORD" >> .env
    
    echo "✅ IMAP and POP configuration added"
fi

echo ""
echo "🎯 Configuration Summary"
echo "========================"
echo "✅ SMTP Host: smtp.hostinger.com"
echo "✅ SMTP Port: 465"
echo "✅ SMTP Security: SSL/TLS"
echo "✅ Username: $SMTP_USERNAME"
echo "✅ From Name: $SMTP_FROM_NAME"
echo "✅ From Email: $SMTP_FROM_EMAIL"

echo ""
echo "🧪 Testing Configuration"
echo "========================"
echo "To test your email configuration, run:"
echo "  node test-hostinger-email.js"
echo ""
echo "Or test with a specific email address:"
echo "  TEST_EMAIL=your-test@example.com node test-hostinger-email.js"
echo ""

echo "📝 Next Steps"
echo "============="
echo "1. Test your email configuration"
echo "2. Deploy to production with updated environment variables"
echo "3. Monitor email delivery in your application"
echo ""

echo "✅ Hostinger email configuration setup complete!"
echo "   Check your .env file for the configuration details."
