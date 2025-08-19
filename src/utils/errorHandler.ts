/**
 * Error handling utilities for better error messages and logging
 */

export interface SerializableError {
  message: string
  code?: string
  details?: any
  name?: string
}

/**
 * Converts any error object into a readable string message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }
    
    if ('details' in error && typeof error.details === 'string') {
      return error.details
    }
    
    // For Supabase errors
    if ('code' in error && 'message' in error) {
      return `[${error.code}] ${error.message}`
    }
  }
  
  // Fallback to JSON stringify but limit length
  try {
    const jsonStr = JSON.stringify(error)
    return jsonStr.length > 200 ? jsonStr.substring(0, 200) + '...' : jsonStr
  } catch {
    return 'Bilinmeyen hata oluştu'
  }
}

/**
 * Serializes an error for logging purposes
 */
export function serializeError(error: unknown): SerializableError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      details: error.stack
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: error.message as string,
      code: 'code' in error ? error.code as string : undefined,
      details: error
    }
  }
  
  return {
    message: getErrorMessage(error),
    details: error
  }
}

/**
 * Logs an error with context
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, any>) {
  const serializedError = serializeError(error)
  
  console.error(`${context}:`, {
    error: serializedError,
    timestamp: new Date().toISOString(),
    ...additionalInfo
  })
}

/**
 * Common error messages for specific scenarios
 */
export const ErrorMessages = {
  NETWORK_ERROR: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  DATABASE_ERROR: 'Veritabanı bağlantısı hatası. Lütfen daha sonra tekrar deneyin.',
  PERMISSION_ERROR: 'Bu işlem için yetkiniz bulunmuyor.',
  VALIDATION_ERROR: 'Girilen bilgiler geçersiz.',
  NOT_FOUND: 'İstenen kayıt bulunamadı.',
  GENERIC_ERROR: 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
}

/**
 * Determines if an error is a Supabase table not found error
 */
export function isTableNotFoundError(error: any): boolean {
  return error?.message?.includes('relation') && 
         error?.message?.includes('does not exist')
}

/**
 * Determines if an error is a network/connection error
 */
export function isNetworkError(error: any): boolean {
  return error?.message?.includes('fetch') || 
         error?.code === 'NETWORK_ERROR' ||
         error?.name === 'NetworkError'
}

/**
 * Determines if an error is related to missing permissions
 */
export function isPermissionError(error: any): boolean {
  return error?.message?.includes('permission') ||
         error?.message?.includes('unauthorized') ||
         error?.code === '401' ||
         error?.code === '403'
}
