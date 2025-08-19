import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Supabase configuration
console.log('Environment variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

// Temporary hardcoded values until environment loading is fixed
const supabaseUrl = 'https://ibqhfgpdgzrhvyfpgjxx.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTEwOTc0NywiZXhwIjoyMDcwNjg1NzQ3fQ.pdtymoazJOqnW4pjfBFEApFBQmmouAB-5eyCpSZv07g';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;
