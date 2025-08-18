// Standard error messages in Turkish
export const ERROR_MESSAGES = {
  // Required field errors
  REQUIRED: 'Bu alan zorunludur',
  REQUIRED_FIELD: (field: string) => `${field} alanı zorunludur`,
  
  // String validation errors
  STRING_TOO_SHORT: (min: number) => `En az ${min} karakter olmalıdır`,
  STRING_TOO_LONG: (max: number) => `En fazla ${max} karakter olabilir`,
  STRING_LENGTH: (min: number, max: number) => `${min}-${max} karakter arasında olmalıdır`,
  STRING_PATTERN: 'Geçersiz format',
  STRING_EMPTY: 'Bu alan boş bırakılamaz',
  
  // Number validation errors
  NUMBER_TOO_SMALL: (min: number) => `En az ${min} olmalıdır`,
  NUMBER_TOO_BIG: (max: number) => `En fazla ${max} olabilir`,
  NUMBER_NOT_INTEGER: 'Tam sayı olmalıdır',
  NUMBER_NOT_FINITE: 'Geçerli bir sayı olmalıdır',
  NUMBER_POSITIVE: 'Pozitif bir sayı olmalıdır',
  NUMBER_NEGATIVE: 'Negatif bir sayı olmalıdır',
  NUMBER_RANGE: (min: number, max: number) => `${min}-${max} arasında olmalıdır`,
  
  // Date validation errors
  DATE_INVALID: 'Geçerli bir tarih giriniz',
  DATE_TOO_EARLY: (date: string) => `${date} tarihinden sonra olmalıdır`,
  DATE_TOO_LATE: (date: string) => `${date} tarihinden önce olmalıdır`,
  DATE_FUTURE: 'Gelecek bir tarih olmalıdır',
  DATE_PAST: 'Geçmiş bir tarih olmalıdır',
  DATE_TODAY_OR_FUTURE: 'Bugün veya gelecek bir tarih olmalıdır',
  DATE_TODAY_OR_PAST: 'Bugün veya geçmiş bir tarih olmalıdır',
  
  // Email validation errors
  EMAIL_INVALID: 'Geçerli bir e-posta adresi giriniz',
  EMAIL_DOMAIN_INVALID: 'Geçersiz e-posta domain',
  EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi zaten kullanılıyor',
  
  // Phone validation errors
  PHONE_INVALID: 'Geçerli bir telefon numarası giriniz',
  PHONE_INVALID_FORMAT: 'Telefon numarası formatı geçersiz',
  PHONE_TOO_SHORT: 'Telefon numarası çok kısa',
  PHONE_TOO_LONG: 'Telefon numarası çok uzun',
  
  // Password validation errors
  PASSWORD_TOO_SHORT: (min: number) => `Şifre en az ${min} karakter olmalıdır`,
  PASSWORD_TOO_LONG: (max: number) => `Şifre en fazla ${max} karakter olabilir`,
  PASSWORD_NO_UPPERCASE: 'Şifre en az bir büyük harf içermelidir',
  PASSWORD_NO_LOWERCASE: 'Şifre en az bir küçük harf içermelidir',
  PASSWORD_NO_NUMBER: 'Şifre en az bir rakam içermelidir',
  PASSWORD_NO_SYMBOL: 'Şifre en az bir özel karakter içermelidir',
  PASSWORD_WEAK: 'Şifre çok zayıf',
  PASSWORD_MISMATCH: 'Şifreler eşleşmiyor',
  PASSWORD_SAME_AS_OLD: 'Yeni şifre eski şifre ile aynı olamaz',
  
  // URL validation errors
  URL_INVALID: 'Geçerli bir URL giriniz',
  URL_PROTOCOL_REQUIRED: 'URL protokol içermelidir (http:// veya https://)',
  
  // File validation errors
  FILE_TOO_LARGE: (maxSize: string) => `Dosya boyutu ${maxSize} değerini aşamaz`,
  FILE_INVALID_TYPE: (allowedTypes: string[]) => `Geçerli dosya türleri: ${allowedTypes.join(', ')}`,
  FILE_REQUIRED: 'Dosya seçimi zorunludur',
  FILE_UPLOAD_FAILED: 'Dosya yükleme başarısız',
  
  // Array validation errors
  ARRAY_TOO_SHORT: (min: number) => `En az ${min} öğe seçmelisiniz`,
  ARRAY_TOO_LONG: (max: number) => `En fazla ${max} öğe seçebilirsiniz`,
  ARRAY_EMPTY: 'En az bir öğe seçmelisiniz',
  
  // Selection validation errors
  OPTION_INVALID: 'Geçersiz seçenek',
  OPTION_REQUIRED: 'Bir seçenek seçmelisiniz',
  
  // Turkish specific validation errors
  TC_KIMLIK_INVALID: 'Geçerli bir TC Kimlik No giriniz',
  TC_KIMLIK_LENGTH: 'TC Kimlik No 11 haneli olmalıdır',
  IBAN_INVALID: 'Geçerli bir IBAN giriniz',
  IBAN_COUNTRY_INVALID: 'Türkiye IBAN formatında olmalıdır',
  
  // Business validation errors
  DUPLICATE_ENTRY: 'Bu kayıt zaten mevcut',
  RECORD_NOT_FOUND: 'Kayıt bulunamadı',
  OPERATION_NOT_ALLOWED: 'Bu işlem gerçekleştirilemez',
  INSUFFICIENT_PERMISSIONS: 'Bu işlem için yetkiniz bulunmuyor',
  QUOTA_EXCEEDED: 'Kota aşıldı',
  DEADLINE_PASSED: 'Son başvuru tarihi geçmiş',
  
  // Network errors
  NETWORK_ERROR: 'Ağ bağlantısı hatası',
  SERVER_ERROR: 'Sunucu hatası oluştu',
  TIMEOUT_ERROR: 'İstek zaman aşımına uğradı',
  CONNECTION_LOST: 'Bağlantı kesildi',
  
  // Authentication errors
  LOGIN_FAILED: 'Giriş başarısız',
  SESSION_EXPIRED: 'Oturum süresi doldu',
  UNAUTHORIZED: 'Yetkisiz erişim',
  ACCOUNT_LOCKED: 'Hesap kilitli',
  ACCOUNT_DISABLED: 'Hesap devre dışı',
  
  // Form errors
  FORM_INVALID: 'Form geçersiz. Lütfen hataları düzeltin',
  FORM_SUBMISSION_FAILED: 'Form gönderimi başarısız',
  FORM_SAVE_FAILED: 'Kaydetme işlemi başarısız',
  
  // Generic errors
  UNKNOWN_ERROR: 'Bilinmeyen hata oluştu',
  OPERATION_FAILED: 'İşlem başarısız',
  TRY_AGAIN: 'Lütfen tekrar deneyin',
  CONTACT_SUPPORT: 'Destek ekibi ile iletişime geçin'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  // CRUD operations
  CREATED: 'Başarıyla oluşturuldu',
  UPDATED: 'Başarıyla güncellendi',
  DELETED: 'Başarıyla silindi',
  SAVED: 'Başarıyla kaydedildi',
  
  // Authentication
  LOGIN_SUCCESS: 'Giriş başarılı',
  LOGOUT_SUCCESS: 'Çıkış başarılı',
  PASSWORD_CHANGED: 'Şifre başarıyla değiştirildi',
  PASSWORD_RESET: 'Şifre sıfırlama e-postası gönderildi',
  
  // File operations
  FILE_UPLOADED: 'Dosya başarıyla yüklendi',
  FILE_DOWNLOADED: 'Dosya başarıyla indirildi',
  
  // Email operations
  EMAIL_SENT: 'E-posta başarıyla gönderildi',
  EMAIL_VERIFIED: 'E-posta adresi doğrulandı',
  
  // Form operations
  FORM_SUBMITTED: 'Form başarıyla gönderildi',
  CHANGES_SAVED: 'Değişiklikler kaydedildi',
  
  // Generic success
  OPERATION_SUCCESS: 'İşlem başarılı',
  ACTION_COMPLETED: 'İşlem tamamlandı'
} as const;

// Warning messages
export const WARNING_MESSAGES = {
  // Data warnings
  UNSAVED_CHANGES: 'Kaydedilmemiş değişiklikler var',
  DATA_WILL_BE_LOST: 'Veriler kaybolacak',
  IRREVERSIBLE_ACTION: 'Bu işlem geri alınamaz',
  
  // Security warnings
  WEAK_PASSWORD: 'Şifre zayıf',
  SUSPICIOUS_ACTIVITY: 'Şüpheli aktivite tespit edildi',
  
  // System warnings
  MAINTENANCE_MODE: 'Sistem bakımda',
  LIMITED_FUNCTIONALITY: 'Sınırlı işlevsellik',
  QUOTA_WARNING: (percentage: number) => `Kotanızın %${percentage}'i kullanıldı`,
  
  // Generic warnings
  PROCEED_WITH_CAUTION: 'Dikkatli ilerleyin',
  CHECK_INFORMATION: 'Bilgileri kontrol edin'
} as const;

// Info messages
export const INFO_MESSAGES = {
  // Loading states
  LOADING: 'Yükleniyor...',
  PROCESSING: 'İşleniyor...',
  SAVING: 'Kaydediliyor...',
  UPLOADING: 'Yükleniyor...',
  DOWNLOADING: 'İndiriliyor...',
  
  // Status updates
  NO_DATA: 'Veri bulunamadı',
  EMPTY_LIST: 'Liste boş',
  NO_RESULTS: 'Sonuç bulunamadı',
  
  // Instructions
  FILL_REQUIRED_FIELDS: 'Zorunlu alanları doldurun',
  SELECT_OPTION: 'Bir seçenek seçin',
  UPLOAD_FILE: 'Dosya yükleyin',
  
  // Generic info
  PLEASE_WAIT: 'Lütfen bekleyin',
  COMING_SOON: 'Yakında'
} as const;

// Message type enum
export const MessageType = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export type MessageTypeValue = typeof MessageType[keyof typeof MessageType];

// Message severity enum
export const MessageSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export type MessageSeverityType = typeof MessageSeverity[keyof typeof MessageSeverity];

// Message interface
export interface Message {
  id?: string;
  type: MessageTypeValue;
  severity?: MessageSeverityType;
  title?: string;
  message: string;
  details?: string;
  timestamp?: Date;
  dismissible?: boolean;
  autoHide?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Message factory functions
export const createErrorMessage = (
  message: string,
  details?: string,
  severity: MessageSeverityType = MessageSeverity.MEDIUM
): Message => ({
  type: MessageType.ERROR,
  severity,
  message,
  details,
  timestamp: new Date(),
  dismissible: true,
  autoHide: false
});

export const createSuccessMessage = (
  message: string,
  autoHide = true,
  duration = 3000
): Message => ({
  type: MessageType.SUCCESS,
  severity: MessageSeverity.LOW,
  message,
  timestamp: new Date(),
  dismissible: true,
  autoHide,
  duration
});

export const createWarningMessage = (
  message: string,
  details?: string,
  severity: MessageSeverityType = MessageSeverity.MEDIUM
): Message => ({
  type: MessageType.WARNING,
  severity,
  message,
  details,
  timestamp: new Date(),
  dismissible: true,
  autoHide: false
});

export const createInfoMessage = (
  message: string,
  autoHide = true,
  duration = 5000
): Message => ({
  type: MessageType.INFO,
  severity: MessageSeverity.LOW,
  message,
  timestamp: new Date(),
  dismissible: true,
  autoHide,
  duration
});

// Validation message helpers
export const getValidationMessage = (
  field: string,
  rule: string,
  params?: any[]
): string => {
  const messageKey = `${field.toUpperCase()}_${rule.toUpperCase()}` as keyof typeof ERROR_MESSAGES;
  const message = ERROR_MESSAGES[messageKey];
  
  if (typeof message === 'function' && params) {
    return (message as any)(...params);
  }
  
  if (typeof message === 'string') {
    return message;
  }
  
  // Fallback to generic message
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Field-specific message generators
export const getFieldError = (
  fieldName: string,
  errors: Record<string, string>
): string | undefined => {
  switch (fieldName) {
    case 'required':
      return ERROR_MESSAGES.REQUIRED_FIELD(fieldName);
    case 'minLength':
      if (errors.minLength) {
        return ERROR_MESSAGES.STRING_TOO_SHORT(Number(errors.minLength) || 1);
      }
      break;
    case 'maxLength':
      if (errors.maxLength) {
        return ERROR_MESSAGES.STRING_TOO_LONG(Number(errors.maxLength) || 255);
      }
      break;
    case 'min':
      if (errors.min) {
        return ERROR_MESSAGES.NUMBER_TOO_SMALL(Number(errors.min) || 0);
      }
      break;
    case 'max':
      if (errors.max) {
        return ERROR_MESSAGES.NUMBER_TOO_BIG(Number(errors.max) || 100);
      }
      break;
    case 'email':
      return ERROR_MESSAGES.EMAIL_INVALID;
    case 'pattern':
      return ERROR_MESSAGES.STRING_PATTERN;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

// Export all message collections
export const MESSAGES = {
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  WARNING: WARNING_MESSAGES,
  INFO: INFO_MESSAGES
} as const;

export default MESSAGES;