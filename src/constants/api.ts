// API related constants

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  
  // Beneficiaries
  beneficiaries: {
    base: '/beneficiaries',
    search: '/beneficiaries/search',
    export: '/beneficiaries/export',
    import: '/beneficiaries/import'
  },
  
  // Applications
  applications: {
    base: '/applications',
    byBeneficiary: '/applications/beneficiary',
    byStatus: '/applications/status',
    approve: '/applications/approve',
    reject: '/applications/reject'
  },
  
  // Aid Records
  aidRecords: {
    base: '/aid-records',
    byBeneficiary: '/aid-records/beneficiary',
    byDateRange: '/aid-records/date-range',
    statistics: '/aid-records/statistics'
  },
  
  // Payments
  payments: {
    base: '/payments',
    byBeneficiary: '/payments/beneficiary',
    byStatus: '/payments/status',
    process: '/payments/process',
    cancel: '/payments/cancel'
  },
  
  // Documents
  documents: {
    base: '/documents',
    upload: '/documents/upload',
    download: '/documents/download',
    delete: '/documents/delete'
  },
  
  // Reports
  reports: {
    base: '/reports',
    generate: '/reports/generate',
    download: '/reports/download'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;

export const API_TIMEOUTS = {
  default: 10000, // 10 seconds
  upload: 60000,  // 1 minute
  download: 30000, // 30 seconds
  report: 120000  // 2 minutes
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const CACHE_KEYS = {
  beneficiaries: 'beneficiaries',
  applications: 'applications',
  aidRecords: 'aid_records',
  payments: 'payments',
  userProfile: 'user_profile',
  permissions: 'permissions',
  statistics: 'statistics'
} as const;

export const CACHE_DURATIONS = {
  short: 5 * 60 * 1000,    // 5 minutes
  medium: 15 * 60 * 1000,  // 15 minutes
  long: 60 * 60 * 1000,    // 1 hour
  veryLong: 24 * 60 * 60 * 1000 // 24 hours
} as const;

export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryMultiplier: 2
} as const;

export const REQUEST_HEADERS = {
  contentType: {
    json: 'application/json',
    formData: 'multipart/form-data',
    urlEncoded: 'application/x-www-form-urlencoded'
  },
  accept: {
    json: 'application/json',
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
} as const;

export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business logic errors
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NOT_FOUND: 'NOT_FOUND',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const;

export const SUPABASE_TABLES = {
  beneficiaries: 'beneficiaries',
  applications: 'applications',
  aidRecords: 'aid_records',
  payments: 'payments',
  inKindAids: 'in_kind_aids',
  documents: 'documents',
  familyMembers: 'family_members',
  userProfiles: 'user_profiles'
} as const;

export const RLS_POLICIES = {
  select: 'SELECT',
  insert: 'INSERT',
  update: 'UPDATE',
  delete: 'DELETE'
} as const;

export const SUPABASE_FUNCTIONS = {
  generateReport: 'generate_report',
  processPayment: 'process_payment',
  sendNotification: 'send_notification',
  validateData: 'validate_data'
} as const;