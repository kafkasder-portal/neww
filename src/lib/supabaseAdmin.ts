import { createClient } from '@supabase/supabase-js'
import { env } from './env'

/**
 * Admin Supabase client using service role key
 * This client has elevated privileges for admin operations
 * Should only be used for server-side or admin operations
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Type-safe admin client export
export default supabaseAdmin