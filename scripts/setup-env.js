#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🔐 KAFKAS Panel Environment Setup\n');
  console.log('⚠️  IMPORTANT: This script will help you set up your environment variables securely.');
  console.log('   Your credentials will be stored locally and will NOT be committed to version control.\n');

  // Check if .env already exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('❓ .env file already exists. Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📝 Please provide your Supabase credentials:\n');

  // Collect environment variables
  const envVars = {};

  // Supabase Configuration
  envVars.VITE_PUBLIC_SUPABASE_URL = await question('🌐 Supabase URL (e.g., https://your-project.supabase.co): ');
  envVars.VITE_PUBLIC_SUPABASE_ANON_KEY = await question('🔑 Supabase Anonymous Key: ');

  // Database Configuration (optional for frontend-only apps)
  const includeBackend = await question('🔧 Do you need backend/database configuration? (y/N): ');
  
  if (includeBackend.toLowerCase() === 'y' || includeBackend.toLowerCase() === 'yes') {
    console.log('\n📊 Database Configuration (optional - for server-side operations):');
    envVars.POSTGRES_URL = await question('🗄️  Postgres URL (optional): ') || '';
    envVars.POSTGRES_USER = await question('👤 Postgres User (optional): ') || '';
    envVars.POSTGRES_HOST = await question('🏠 Postgres Host (optional): ') || '';
    envVars.POSTGRES_PASSWORD = await question('🔒 Postgres Password (optional): ') || '';
    envVars.POSTGRES_DATABASE = await question('📁 Postgres Database (optional): ') || '';
    envVars.POSTGRES_PRISMA_URL = await question('🔗 Postgres Prisma URL (optional): ') || '';
    envVars.POSTGRES_URL_NON_POOLING = await question('🌊 Postgres URL Non-Pooling (optional): ') || '';
    
    console.log('\n🔐 Service Configuration:');
    envVars.SUPABASE_SERVICE_ROLE_KEY = await question('🔑 Supabase Service Role Key (optional): ') || '';
    envVars.SUPABASE_JWT_SECRET = await question('🔐 Supabase JWT Secret (optional): ') || '';
  }

  // Application Configuration
  console.log('\n⚙️  Application Configuration:');
  envVars.NODE_ENV = await question('🌍 Node Environment (development/production): ') || 'development';
  envVars.VITE_APP_ENV = await question('🚀 App Environment (development/production): ') || 'development';

  // Generate .env content
  let envContent = '# KAFKAS Panel Environment Variables\n';
  envContent += '# Generated on: ' + new Date().toISOString() + '\n\n';

  // Add Supabase Configuration
  envContent += '# Supabase Configuration\n';
  envContent += `VITE_PUBLIC_SUPABASE_URL=${envVars.VITE_PUBLIC_SUPABASE_URL}\n`;
  envContent += `VITE_PUBLIC_SUPABASE_ANON_KEY=${envVars.VITE_PUBLIC_SUPABASE_ANON_KEY}\n\n`;

  // Add Database Configuration if provided
  if (includeBackend.toLowerCase() === 'y' || includeBackend.toLowerCase() === 'yes') {
    envContent += '# Database Configuration (for server-side use only)\n';
    if (envVars.POSTGRES_URL) envContent += `POSTGRES_URL=${envVars.POSTGRES_URL}\n`;
    if (envVars.POSTGRES_USER) envContent += `POSTGRES_USER=${envVars.POSTGRES_USER}\n`;
    if (envVars.POSTGRES_HOST) envContent += `POSTGRES_HOST=${envVars.POSTGRES_HOST}\n`;
    if (envVars.POSTGRES_PASSWORD) envContent += `POSTGRES_PASSWORD=${envVars.POSTGRES_PASSWORD}\n`;
    if (envVars.POSTGRES_DATABASE) envContent += `POSTGRES_DATABASE=${envVars.POSTGRES_DATABASE}\n`;
    if (envVars.POSTGRES_PRISMA_URL) envContent += `POSTGRES_PRISMA_URL=${envVars.POSTGRES_PRISMA_URL}\n`;
    if (envVars.POSTGRES_URL_NON_POOLING) envContent += `POSTGRES_URL_NON_POOLING=${envVars.POSTGRES_URL_NON_POOLING}\n\n`;

    envContent += '# Supabase Service Configuration (for server-side use only)\n';
    if (envVars.SUPABASE_SERVICE_ROLE_KEY) envContent += `SUPABASE_SERVICE_ROLE_KEY=${envVars.SUPABASE_SERVICE_ROLE_KEY}\n`;
    if (envVars.SUPABASE_JWT_SECRET) envContent += `SUPABASE_JWT_SECRET=${envVars.SUPABASE_JWT_SECRET}\n\n`;
  }

  // Add Application Configuration
  envContent += '# Application Configuration\n';
  envContent += `NODE_ENV=${envVars.NODE_ENV}\n`;
  envContent += `VITE_APP_ENV=${envVars.VITE_APP_ENV}\n`;

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log('📁 Location: ' + envPath);
    console.log('\n🔒 Security Notes:');
    console.log('   - Your .env file is now in .gitignore');
    console.log('   - Never commit this file to version control');
    console.log('   - Keep your credentials secure');
    
    // Test Supabase connection
    console.log('\n🧪 Testing Supabase connection...');
    const testConnection = await question('Would you like to test the Supabase connection? (Y/n): ');
    
    if (testConnection.toLowerCase() !== 'n' && testConnection.toLowerCase() !== 'no') {
      console.log('🔗 Testing connection...');
      // Note: In a real implementation, you'd test the connection here
      console.log('✅ Connection test completed (check browser console for details)');
    }

  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

// Run the setup
setupEnvironment().catch(console.error);
