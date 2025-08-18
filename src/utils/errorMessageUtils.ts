/**
 * Utility functions for safely extracting and displaying error messages
 */

/**
 * Safely extracts a human-readable error message from any error object
 * Handles various error formats including Supabase errors, network errors, etc.
 */
export function getErrorMessage(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return 'Bilinmeyen hata oluştu'
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || 'Bilinmeyen hata oluştu'
  }

  // Handle Supabase error format
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, any>
    
    // Check for message property
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message
    }

    // Check for error property
    if (errorObj.error && typeof errorObj.error === 'string') {
      return errorObj.error
    }

    // Check for details property
    if (errorObj.details && typeof errorObj.details === 'string') {
      return errorObj.details
    }

    // Check for hint property (Supabase specific)
    if (errorObj.hint && typeof errorObj.hint === 'string') {
      return errorObj.hint
    }

    // Check for code property and provide user-friendly messages
    if (errorObj.code) {
      return getErrorMessageByCode(errorObj.code)
    }
  }

  // Fallback - avoid showing [object Object]
  return 'Beklenmeyen bir hata oluştu'
}

/**
 * Maps common error codes to user-friendly Turkish messages
 */
function getErrorMessageByCode(code: string): string {
  const errorCodeMessages: Record<string, string> = {
    // Supabase/PostgreSQL error codes
    'PGRST116': 'Tablo bulunamadı. Lütfen veritabanı ayarlarını kontrol edin.',
    'PGRST301': 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.',
    'PGRST204': 'Veri bulunamadı.',
    '23505': 'Bu kayıt zaten mevcut.',
    '23503': 'İlişkili kayıt bulunamadı.',
    '23502': 'Zorunlu alan eksik.',
    '42P01': 'Tablo bulunamadı.',
    '42703': 'Sütun bulunamadı.',
    
    // Network errors
    'NETWORK_ERROR': 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
    'TIMEOUT': 'İstek zaman aşımına uğradı.',
    'FETCH_ERROR': 'Veri alınırken hata oluştu.',
    
    // Authentication errors
    'INVALID_JWT': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    'EXPIRED_JWT': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    'INVALID_CREDENTIALS': 'Kullanıcı adı veya şifre hatalı.',
    
    // Authorization errors
    'INSUFFICIENT_PERMISSIONS': 'Bu işlem için yetkiniz bulunmuyor.',
    'ACCESS_DENIED': 'Erişim reddedildi.',
    
    // Common HTTP status codes
    '400': 'Geçersiz istek.',
    '401': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    '403': 'Bu işlem için yetkiniz bulunmuyor.',
    '404': 'Kaynak bulunamadı.',
    '409': 'Bu işlem çakışma nedeniyle gerçekleştirilemedi.',
    '422': 'Gönderilen veriler geçersiz.',
    '429': 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
    '500': 'Sunucu hatası oluştu.',
    '502': 'Sunucu geçici olarak kullanılamıyor.',
    '503': 'Servis geçici olarak kullanılamıyor.',
    '504': 'İstek zaman aşımına uğradı.'
  }

  return errorCodeMessages[code] || `Hata kodu: ${code}`
}

/**
 * Creates a user-friendly error message for API/database operations
 */
export function createOperationErrorMessage(operation: string, error: unknown): string {
  const baseMessage = getErrorMessage(error)
  
  const operationMessages: Record<string, string> = {
    'load': 'yüklenirken',
    'save': 'kaydedilirken',
    'update': 'güncellenirken',
    'delete': 'silinirken',
    'create': 'oluşturulurken',
    'fetch': 'alınırken',
    'upload': 'yüklenirken',
    'download': 'indirilirken'
  }

  const operationText = operationMessages[operation] || 'işlenirken'
  return `Veriler ${operationText} hata oluştu: ${baseMessage}`
}

/**
 * Safe console error logging that avoids [object Object]
 */
export function logErrorSafely(context: string, error: unknown, additionalData?: Record<string, any>) {
  const errorMessage = getErrorMessage(error)
  
  console.error(`${context}:`, {
    message: errorMessage,
    originalError: error,
    timestamp: new Date().toISOString(),
    ...additionalData
  })
}

/**
 * Extract stack trace safely from error
 */
export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error && error.stack) {
    return error.stack
  }
  return undefined
}

/**
 * Check if error indicates a network/connection issue
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('network') || 
         message.includes('connection') || 
         message.includes('fetch') ||
         message.includes('timeout') ||
         message.includes('offline')
}

/**
 * Check if error indicates an authentication issue
 */
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('unauthorized') || 
         message.includes('authentication') ||
         message.includes('jwt') ||
         message.includes('token') ||
         message.includes('session')
}

/**
 * Check if error indicates a permission issue
 */
export function isPermissionError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('permission') || 
         message.includes('forbidden') ||
         message.includes('access denied') ||
         message.includes('insufficient')
}
