/**
 * Supabase connection utilities
 */

import { supabase } from '@lib/supabase'
import { env } from '@lib/env'

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !env.SUPABASE_URL.includes('placeholder') && 
         !env.SUPABASE_ANON_KEY.includes('placeholder') &&
         env.SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         env.SUPABASE_ANON_KEY !== 'placeholder-anon-key'
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    // Try a simple query to test connection
    const { error } = await supabase.from('beneficiaries').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

/**
 * Create a safe query wrapper that handles connection issues
 */
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T,
  errorContext: string = 'Database query'
): Promise<{ data: T; error: boolean; errorMessage?: string }> {
  
  if (!isSupabaseConfigured()) {
    return {
      data: fallbackData,
      error: false // Don't treat missing config as error
    }
  }

  try {
    const result = await queryFn()
    
    if (result.error) {
      let errorMessage = 'Veritabanı hatası oluştu'
      
      if (result.error.message) {
        if (result.error.message.includes('relation') || 
            result.error.message.includes('table') || 
            result.error.message.includes('does not exist')) {
          errorMessage = 'Veritabanı tabloları bulunamadı. Lütfen sistem yöneticisine başvurun.'
        } else if (result.error.message.includes('connection') || 
                   result.error.message.includes('network')) {
          errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
        } else {
          errorMessage = `${errorContext}: ${result.error.message}`
        }
      }
      
      return {
        data: fallbackData,
        error: true,
        errorMessage
      }
    }

    return {
      data: result.data || fallbackData,
      error: false
    }
  } catch (error) {
    console.error(`${errorContext} error:`, error)
    return {
      data: fallbackData,
      error: true,
      errorMessage: `${errorContext} sırasında beklenmeyen hata oluştu`
    }
  }
}

/**
 * Generate mock data based on environment
 */
export function shouldUseMockData(): boolean {
  return !isSupabaseConfigured() || env.APP_ENVIRONMENT === 'demo'
}

/**
 * Get connection status message
 */
export function getConnectionStatusMessage(): string {
  if (!isSupabaseConfigured()) {
    return 'Demo mod - Veritabanı bağlantısı yapılandırılmamış'
  }
  return 'Veritabanına bağlı'
}
