// Shared Types between Frontend and Backend
// This file contains common type definitions used across the application

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================

export interface User {
    id: string
    email: string
    fullName?: string
    role: UserRole
    avatar?: string
    isActive: boolean
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export type UserRole = 'admin' | 'manager' | 'volunteer' | 'viewer'

export interface UserProfile {
    id: string
    user_id: string
    full_name: string
    role: UserRole
    avatar_url?: string
    phone?: string
    address?: string
    bio?: string
    is_active: boolean
    status: 'active' | 'inactive' | 'suspended'
    created_at: string
    updated_at: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
    errors?: string[]
    meta?: {
        total?: number
        page?: number
        limit?: number
        totalPages?: number
    }
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// ============================================================================
// COMMON ENUM TYPES
// ============================================================================

export type Status = 'pending' | 'active' | 'completed' | 'cancelled' | 'failed'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type Currency = 'TRY' | 'USD' | 'EUR'

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AppError {
    message: string
    code: string
    statusCode: number
    details?: any
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ErrorCategory =
    | 'authentication'
    | 'authorization'
    | 'validation'
    | 'database'
    | 'network'
    | 'external_service'
    | 'system'
    | 'user_input'

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    isRead: boolean
    createdAt: string
    userId: string
    actionUrl?: string
    metadata?: Record<string, any>
}

// ============================================================================
// FILE & UPLOAD TYPES
// ============================================================================

export interface FileUpload {
    id: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    bucket: string
    path: string
    uploadedBy: string
    uploadedAt: string
    metadata?: Record<string, any>
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchFilters {
    query?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    dateFrom?: string
    dateTo?: string
    status?: Status[]
    category?: string[]
}

export interface SearchResult<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
    field: string
    message: string
    code: string
}

export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
}

// ============================================================================
// AUDIT & LOGGING TYPES
// ============================================================================

export interface AuditLog {
    id: string
    userId: string
    action: string
    resource: string
    resourceId?: string
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    timestamp: string
}

export interface SystemLog {
    id: string
    level: 'debug' | 'info' | 'warn' | 'error'
    message: string
    context?: Record<string, any>
    timestamp: string
    source: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// ============================================================================
// API ENDPOINT TYPES
// ============================================================================

export interface ApiEndpoint {
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    description: string
    requiresAuth: boolean
    requiredPermissions?: string[]
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
    environment: 'development' | 'staging' | 'production'
    apiUrl: string
    supabaseUrl: string
    supabaseAnonKey: string
    features: {
        ai: boolean
        notifications: boolean
        fileUpload: boolean
        realtime: boolean
    }
    limits: {
        maxFileSize: number
        maxUploads: number
        rateLimit: number
    }
}
