import type { AppError } from '../contexts/ErrorContext';
import { ZodError } from 'zod';

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export type ErrorSeverityType = typeof ErrorSeverity[keyof typeof ErrorSeverity];

// Error categories
export const ErrorCategory = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
} as const;

export type ErrorCategoryType = typeof ErrorCategory[keyof typeof ErrorCategory];

// Standard error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  AUTH_ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED',
  
  // Authorization errors
  AUTHZ_INSUFFICIENT_PERMISSIONS: 'AUTHZ_INSUFFICIENT_PERMISSIONS',
  AUTHZ_RESOURCE_FORBIDDEN: 'AUTHZ_RESOURCE_FORBIDDEN',
  AUTHZ_ROLE_REQUIRED: 'AUTHZ_ROLE_REQUIRED',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_OUT_OF_RANGE: 'VALIDATION_OUT_OF_RANGE',
  VALIDATION_DUPLICATE_VALUE: 'VALIDATION_DUPLICATE_VALUE',
  VALIDATION_INVALID_FILE_TYPE: 'VALIDATION_INVALID_FILE_TYPE',
  VALIDATION_FILE_TOO_LARGE: 'VALIDATION_FILE_TOO_LARGE',
  
  // Network errors
  NETWORK_CONNECTION_FAILED: 'NETWORK_CONNECTION_FAILED',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  NETWORK_DNS_ERROR: 'NETWORK_DNS_ERROR',
  
  // Server errors
  SERVER_INTERNAL_ERROR: 'SERVER_INTERNAL_ERROR',
  SERVER_DATABASE_ERROR: 'SERVER_DATABASE_ERROR',
  SERVER_SERVICE_UNAVAILABLE: 'SERVER_SERVICE_UNAVAILABLE',
  SERVER_MAINTENANCE: 'SERVER_MAINTENANCE',
  
  // Client errors
  CLIENT_INVALID_REQUEST: 'CLIENT_INVALID_REQUEST',
  CLIENT_RESOURCE_NOT_FOUND: 'CLIENT_RESOURCE_NOT_FOUND',
  CLIENT_CONFLICT: 'CLIENT_CONFLICT',
  CLIENT_RATE_LIMITED: 'CLIENT_RATE_LIMITED',
  
  // Business logic errors
  BUSINESS_INSUFFICIENT_FUNDS: 'BUSINESS_INSUFFICIENT_FUNDS',
  BUSINESS_QUOTA_EXCEEDED: 'BUSINESS_QUOTA_EXCEEDED',
  BUSINESS_OPERATION_NOT_ALLOWED: 'BUSINESS_OPERATION_NOT_ALLOWED',
  BUSINESS_DEADLINE_PASSED: 'BUSINESS_DEADLINE_PASSED'
} as const;

// Error messages in Turkish
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Kullanıcı adı veya şifre hatalı.',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Geçersiz oturum. Lütfen tekrar giriş yapın.',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Hesabınız kilitlenmiş. Lütfen yönetici ile iletişime geçin.',
  [ERROR_CODES.AUTH_ACCOUNT_DISABLED]: 'Hesabınız devre dışı bırakılmış.',
  
  [ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS]: 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.',
  [ERROR_CODES.AUTHZ_RESOURCE_FORBIDDEN]: 'Bu kaynağa erişim izniniz yok.',
  [ERROR_CODES.AUTHZ_ROLE_REQUIRED]: 'Bu işlem için gerekli rol yetkiniz bulunmuyor.',
  
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Bu alan zorunludur.',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'Geçersiz format.',
  [ERROR_CODES.VALIDATION_OUT_OF_RANGE]: 'Değer geçerli aralık dışında.',
  [ERROR_CODES.VALIDATION_DUPLICATE_VALUE]: 'Bu değer zaten kullanılıyor.',
  [ERROR_CODES.VALIDATION_INVALID_FILE_TYPE]: 'Geçersiz dosya türü.',
  [ERROR_CODES.VALIDATION_FILE_TOO_LARGE]: 'Dosya boyutu çok büyük.',
  
  [ERROR_CODES.NETWORK_CONNECTION_FAILED]: 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'İstek zaman aşımına uğradı.',
  [ERROR_CODES.NETWORK_OFFLINE]: 'İnternet bağlantısı yok.',
  [ERROR_CODES.NETWORK_DNS_ERROR]: 'DNS hatası oluştu.',
  
  [ERROR_CODES.SERVER_INTERNAL_ERROR]: 'Sunucu hatası oluştu.',
  [ERROR_CODES.SERVER_DATABASE_ERROR]: 'Veritabanı hatası oluştu.',
  [ERROR_CODES.SERVER_SERVICE_UNAVAILABLE]: 'Servis geçici olarak kullanılamıyor.',
  [ERROR_CODES.SERVER_MAINTENANCE]: 'Sistem bakımda.',
  
  [ERROR_CODES.CLIENT_INVALID_REQUEST]: 'Geçersiz istek.',
  [ERROR_CODES.CLIENT_RESOURCE_NOT_FOUND]: 'Kaynak bulunamadı.',
  [ERROR_CODES.CLIENT_CONFLICT]: 'İşlem çakışması oluştu.',
  [ERROR_CODES.CLIENT_RATE_LIMITED]: 'Çok fazla istek. Lütfen bekleyin.',
  
  [ERROR_CODES.BUSINESS_INSUFFICIENT_FUNDS]: 'Yetersiz bakiye.',
  [ERROR_CODES.BUSINESS_QUOTA_EXCEEDED]: 'Kota aşıldı.',
  [ERROR_CODES.BUSINESS_OPERATION_NOT_ALLOWED]: 'Bu işlem şu anda gerçekleştirilemez.',
  [ERROR_CODES.BUSINESS_DEADLINE_PASSED]: 'Son başvuru tarihi geçmiş.'
} as const;

// Error factory functions
export const createError = (
  message: string,
  type: AppError['type'] = 'unknown',
  code?: string,
  details?: Record<string, unknown>
): Omit<AppError, 'id' | 'timestamp'> => {
  const error: Omit<AppError, 'id' | 'timestamp'> = {
    message,
    type,
    code,
    retryable: isRetryableError(code)
  };
  
  if (details) {
    error.details = details;
  }
  
  return error;
};

export const createValidationError = (
  message: string,
  field?: string
): Omit<AppError, 'id' | 'timestamp'> => {
  return createError(
    message,
    'validation',
    ERROR_CODES.VALIDATION_INVALID_FORMAT,
    { field }
  );
};

export const createNetworkError = (
  message: string,
  url?: string,
  method?: string
): Omit<AppError, 'id' | 'timestamp'> => {
  return createError(
    message,
    'network',
    ERROR_CODES.NETWORK_CONNECTION_FAILED,
    { url, method }
  );
};

export const createAuthError = (
  code: string = ERROR_CODES.AUTH_INVALID_CREDENTIALS
): Omit<AppError, 'id' | 'timestamp'> => {
  return createError(
    ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || 'Kimlik doğrulama hatası',
    'authentication',
    code
  );
};

export const createAuthzError = (
  code: string = ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS
): Omit<AppError, 'id' | 'timestamp'> => {
  return createError(
    ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || 'Yetkilendirme hatası',
    'authorization',
    code
  );
};

export const createServerError = (
  message: string = 'Sunucu hatası oluştu',
  code: string = ERROR_CODES.SERVER_INTERNAL_ERROR
): Omit<AppError, 'id' | 'timestamp'> => {
  return createError(message, 'server', code);
};

// Error parsing functions
export const parseZodError = (error: ZodError): Omit<AppError, 'id' | 'timestamp'> => {
  const firstIssue = error.issues[0];
  const field = firstIssue.path.join('.');
  const message = getZodErrorMessage(firstIssue);
  
  return createValidationError(message, field);
};

export const parseApiError = (error: { response?: { status: number; data?: { message?: string; code?: string } }; request?: unknown; config?: { url?: string; method?: string }; message?: string }): Omit<AppError, 'id' | 'timestamp'> => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || getErrorMessageByStatus(status);
    const code = data?.code || getErrorCodeByStatus(status);
    
    return createError(
      message,
      getErrorTypeByStatus(status),
      code,
      {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: data
      }
    );
  }
  
  if (error.request) {
    return createNetworkError(
      'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.',
      error.config?.url,
      error.config?.method
    );
  }
  
  return createError(error.message || 'Bilinmeyen hata oluştu');
};

// Utility functions
export const isRetryableError = (code?: string): boolean => {
  if (!code) return false;
  
  const retryableCodes = [
    ERROR_CODES.NETWORK_CONNECTION_FAILED,
    ERROR_CODES.NETWORK_TIMEOUT,
    ERROR_CODES.SERVER_INTERNAL_ERROR,
    ERROR_CODES.SERVER_SERVICE_UNAVAILABLE,
    ERROR_CODES.CLIENT_RATE_LIMITED
  ] as string[]
  
  return retryableCodes.includes(code)
}

export const getErrorSeverity = (error: Omit<AppError, 'id' | 'timestamp'>): ErrorSeverityType => {
  switch (error.type) {
    case 'authentication':
    case 'authorization':
      return ErrorSeverity.HIGH;
    case 'server':
      return ErrorSeverity.CRITICAL;
    case 'network':
      return ErrorSeverity.MEDIUM;
    case 'validation':
      return ErrorSeverity.LOW;
    default:
      return ErrorSeverity.MEDIUM;
  }
};

export const shouldLogError = (error: AppError): boolean => {
  const severity = getErrorSeverity(error);
  return severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL;
};

export const shouldNotifyUser = (error: AppError): boolean => {
  // Don't notify for validation errors (they're usually shown inline)
  return error.type !== 'validation';
};

// Helper functions
const getZodErrorMessage = (issue: { code: string; expected?: unknown; received?: unknown; validation?: unknown; type?: string; minimum?: number | bigint; maximum?: number | bigint; options?: unknown[]; message?: string }): string => {
  switch (issue.code) {
    case 'invalid_type':
      return `Geçersiz veri türü. ${String(issue.expected)} bekleniyor, ${String(issue.received)} alındı.`;
    case 'invalid_string':
      if (issue.validation === 'email') {
        return 'Geçerli bir e-posta adresi giriniz.';
      }
      if (issue.validation === 'url') {
        return 'Geçerli bir URL giriniz.';
      }
      return 'Geçersiz metin formatı.';
    case 'too_small':
      if (issue.type === 'string') {
        return `En az ${String(issue.minimum)} karakter olmalıdır.`;
      }
      if (issue.type === 'number') {
        return `En az ${String(issue.minimum)} olmalıdır.`;
      }
      if (issue.type === 'array') {
        return `En az ${String(issue.minimum)} öğe seçmelisiniz.`;
      }
      return 'Değer çok küçük.';
    case 'too_big':
      if (issue.type === 'string') {
        return `En fazla ${String(issue.maximum)} karakter olabilir.`;
      }
      if (issue.type === 'number') {
        return `En fazla ${String(issue.maximum)} olabilir.`;
      }
      if (issue.type === 'array') {
        return `En fazla ${String(issue.maximum)} öğe seçebilirsiniz.`;
      }
      return 'Değer çok büyük.';
    case 'invalid_enum_value':
      return `Geçerli değerler: ${issue.options?.map(String).join(', ') || 'belirtilmemiş'}`;
    case 'invalid_date':
      return 'Geçerli bir tarih giriniz.';
    case 'custom':
      return issue.message || 'Geçersiz değer.';
    default:
      return issue.message || 'Geçersiz değer.';
  }
};

const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
    case 401:
      return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
    case 403:
      return 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.';
    case 404:
      return 'Aradığınız kaynak bulunamadı.';
    case 409:
      return 'Bu işlem çakışma nedeniyle gerçekleştirilemedi.';
    case 422:
      return 'Gönderilen veriler geçersiz.';
    case 429:
      return 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.';
    case 500:
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    case 502:
      return 'Sunucu geçici olarak kullanılamıyor.';
    case 503:
      return 'Servis geçici olarak kullanılamıyor.';
    case 504:
      return 'İstek zaman aşımına uğradı.';
    default:
      return 'Beklenmeyen bir hata oluştu.';
  }
};

const getErrorCodeByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_CODES.CLIENT_INVALID_REQUEST;
    case 401:
      return ERROR_CODES.AUTH_TOKEN_EXPIRED;
    case 403:
      return ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS;
    case 404:
      return ERROR_CODES.CLIENT_RESOURCE_NOT_FOUND;
    case 409:
      return ERROR_CODES.CLIENT_CONFLICT;
    case 422:
      return ERROR_CODES.VALIDATION_INVALID_FORMAT;
    case 429:
      return ERROR_CODES.CLIENT_RATE_LIMITED;
    case 500:
      return ERROR_CODES.SERVER_INTERNAL_ERROR;
    case 502:
    case 503:
      return ERROR_CODES.SERVER_SERVICE_UNAVAILABLE;
    case 504:
      return ERROR_CODES.NETWORK_TIMEOUT;
    default:
      return ERROR_CODES.SERVER_INTERNAL_ERROR;
  }
};

const getErrorTypeByStatus = (status: number): AppError['type'] => {
  if (status === 401) return 'authentication';
  if (status === 403) return 'authorization';
  if (status >= 400 && status < 500) return 'validation';
  if (status >= 500) return 'server';
  return 'network';
};

// Error logging function (can be extended to send to external services)
export const logError = (error: AppError, context?: string): void => {
  const logData = {
    ...error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData);
  }
  
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, or your own logging endpoint
  if (process.env.NODE_ENV === 'production' && shouldLogError(error)) {
    // Example: Send to error tracking service
    // errorTrackingService.captureError(logData);
  }
};

// Retry mechanism
export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
  retryCondition?: (error: any) => boolean;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    retryCondition = (error) => isRetryableError(error?.code)
  } = options;
  
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error;
      }
      
      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};