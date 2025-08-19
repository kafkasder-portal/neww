#!/usr/bin/env node

/**
 * Hostinger Email Configuration Test Script
 * 
 * This script tests the Hostinger SMTP configuration
 * Run with: node test-hostinger-email.js
 */

import nodemailer from 'nodemailer';

// Hostinger SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USERNAME || '',
    pass: process.env.SMTP_PASSWORD || ''
  }
};

async function testHostingerEmail() {
  console.log('🧪 Testing Hostinger Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Configuration Check:');
  console.log(`   Host: ${SMTP_CONFIG.host}`);
  console.log(`   Port: ${SMTP_CONFIG.port}`);
  console.log(`   Secure: ${SMTP_CONFIG.secure}`);
  console.log(`   Username: ${SMTP_CONFIG.auth.user ? '✅ Set' : '❌ Not set'}`);
  console.log(`   Password: ${SMTP_CONFIG.auth.pass ? '✅ Set' : '❌ Not set'}\n`);

  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    console.log('❌ Error: SMTP_USERNAME and SMTP_PASSWORD environment variables must be set');
    console.log('   Set them with: export SMTP_USERNAME=your_email@domain.com');
    console.log('   Set them with: export SMTP_PASSWORD=your_password');
    process.exit(1);
  }

  try {
    // Create transporter
    console.log('🔌 Creating SMTP transporter...');
    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    // Test connection
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    console.log(`📧 Sending test email to: ${testEmail}`);
    
    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME || 'KAFKASDER'} <${process.env.SMTP_FROM_EMAIL || SMTP_CONFIG.auth.user}>`,
      to: testEmail,
      subject: 'Hostinger SMTP Test - KAFKASDER',
      text: `This is a test email sent from KAFKASDER using Hostinger SMTP.

Configuration Details:
- Host: ${SMTP_CONFIG.host}
- Port: ${SMTP_CONFIG.port}
- Secure: ${SMTP_CONFIG.secure}
- Sent at: ${new Date().toISOString()}

If you receive this email, your Hostinger SMTP configuration is working correctly!`,
      html: `
        <h2>Hostinger SMTP Test - KAFKASDER</h2>
        <p>This is a test email sent from KAFKASDER using Hostinger SMTP.</p>
        
        <h3>Configuration Details:</h3>
        <ul>
          <li><strong>Host:</strong> ${SMTP_CONFIG.host}</li>
          <li><strong>Port:</strong> ${SMTP_CONFIG.port}</li>
          <li><strong>Secure:</strong> ${SMTP_CONFIG.secure}</li>
          <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
        </ul>
        
        <p><strong>✅ If you receive this email, your Hostinger SMTP configuration is working correctly!</strong></p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}\n`);

    console.log('🎉 Hostinger Email Configuration Test: PASSED');
    console.log('   Your email system is ready for production use!');

  } catch (error) {
    console.error('❌ Email test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Error - Check your credentials:');
      console.log('   - Verify SMTP_USERNAME and SMTP_PASSWORD');
      console.log('   - Ensure your Hostinger email account is active');
      console.log('   - Check if 2-factor authentication is enabled');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection Error - Check your network:');
      console.log('   - Verify internet connection');
      console.log('   - Check firewall settings');
      console.log('   - Ensure port 465 is not blocked');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Timeout Error - Try alternative configuration:');
      console.log('   - Try port 587 with STARTTLS');
      console.log('   - Set SMTP_SECURE=false for port 587');
    }
    
    process.exit(1);
  }
}

// Alternative configuration test (port 587)
async function testAlternativeConfig() {
  console.log('\n🔄 Testing alternative configuration (port 587)...\n');
  
  const altConfig = {
    ...SMTP_CONFIG,
    port: 587,
    secure: false
  };

  try {
    const transporter = nodemailer.createTransport(altConfig);
    await transporter.verify();
    console.log('✅ Alternative configuration (port 587) works!');
    console.log('   You can use this configuration if port 465 fails.');
  } catch (error) {
    console.log('❌ Alternative configuration also failed');
    console.log(`   Error: ${error.message}`);
  }
}

// Main execution
async function main() {
  try {
    await testHostingerEmail();
    
    // Ask if user wants to test alternative config
    if (process.argv.includes('--test-alt')) {
      await testAlternativeConfig();
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
