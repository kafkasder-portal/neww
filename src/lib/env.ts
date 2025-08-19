// Helper function to validate and provide fallback for URLs
function getValidUrl(envVar: string, fallback: string): string {
  const value = envVar?.trim();
  
  // Check for placeholder patterns
  const placeholderPatterns = [
    /^YOUR_.*_URL$/i,
    /^PLACEHOLDER/i,
    /^REPLACE_WITH/i,
    /^\[.*\]$/,
    /^<.*>$/,
    /^\{.*\}$/,
    /^undefined$/i,
    /^null$/i,
    /^\s*$/
  ];
  
  if (!value || placeholderPatterns.some(pattern => pattern.test(value))) {
    return fallback;
  }
  
  try {
    // Test if URL is valid
    new URL(value);
    return value;
  } catch {
    return fallback;
  }
}

// Environment configuration helper
export const env = {
  // Supabase
  VITE_PUBLIC_SUPABASE_URL: getValidUrl(
    import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    'https://ibqhfgpdgzrhvyfpgjxx.supabase.co'
  ),
  VITE_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDk3NDcsImV4cCI6MjA3MDY4NTc0N30.1vSikm9_Dn978BctKWXhoOfPCKztLaBNgr8OEIVIXNg',
  SUPABASE_SERVICE_ROLE_KEY: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Dernek Yönetim Paneli',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Security
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600'),
  ENABLE_2FA: import.meta.env.VITE_ENABLE_2FA === 'true',
  
  // Features
  ENABLE_REALTIME: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
  
  // External Services
  WHATSAPP_API_KEY: import.meta.env.VITE_WHATSAPP_API_KEY || '',
  SMS_API_KEY: import.meta.env.VITE_SMS_API_KEY || '',
  EMAIL_SERVICE_ID: import.meta.env.VITE_EMAIL_SERVICE_ID || '',
  
  // Development with URL validation
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  SOCKET_URL: getValidUrl(
    import.meta.env.VITE_SOCKET_URL,
    'http://localhost:3002'
  ),
  
  // External Domain Configuration with URL validation
  EXTERNAL_DOMAIN: import.meta.env.VITE_EXTERNAL_DOMAIN || 'localhost',
  WEB_URL: getValidUrl(
    import.meta.env.VITE_WEB_URL,
    'http://localhost:5173'
  ),
  
  // Computed values
  get isDevelopment() { return this.APP_ENVIRONMENT === 'development' },
  get isProduction() { return this.APP_ENVIRONMENT === 'production' },
  get isTest() { return this.APP_ENVIRONMENT === 'test' }
}

// Validation function
export const validateEnv = () => {
  const missing = ['VITE_PUBLIC_SUPABASE_URL', 'VITE_PUBLIC_SUPABASE_ANON_KEY'].filter(k => {
    const value = env[k as keyof typeof env] as string;
    return !value || value.includes('placeholder') || value.includes('your_');
  });

  if (missing.length) {
    const errorMessage = `⚠️ CONFIGURATION ERROR: Missing or invalid environment variables: ${missing.join(', ')}\n\n` +
      `This app requires Supabase configuration. Please:\n` +
      `1. Connect to Supabase: https://supabase.com\n` +
      `2. Update your .env file with valid credentials\n` +
      `3. Or enable VITE_MOCK_API=true for development\n\n` +
      `See SETUP.md for detailed instructions.`;

    console.error(errorMessage);

    if (!env.isDevelopment) {
      throw new Error(errorMessage);
    }
  }

  if (env.DEBUG_MODE) {
    console.log('🔧 Environment loaded:', {
      APP_NAME: env.APP_NAME,
      APP_VERSION: env.APP_VERSION,
      APP_ENVIRONMENT: env.APP_ENVIRONMENT,
      SUPABASE_CONFIGURED: !env.VITE_PUBLIC_SUPABASE_URL.includes('placeholder'),
      API_BASE_URL: env.API_BASE_URL
    });
  }
}

export default env
