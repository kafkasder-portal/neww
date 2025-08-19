// Shared Utilities between Frontend and Backend
// Common functions used across the application

import type { SearchFilters, SearchResult, ValidationError, ValidationResult } from '@/types/shared'

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validates phone number format (Turkish)
 */
export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Validates Turkish ID number
 */
export function isValidTurkishId(id: string): boolean {
    if (!/^\d{11}$/.test(id)) return false

    let odd = 0, even = 0, sum = 0

    for (let i = 0; i < 9; i++) {
        if (i % 2 === 0) {
            odd += parseInt(id[i])
        } else {
            even += parseInt(id[i])
        }
    }

    sum = odd * 7 - even

    if (sum % 10 !== parseInt(id[9])) return false

    for (let i = 0; i < 10; i++) {
        sum += parseInt(id[i])
    }

    return sum % 10 === parseInt(id[10])
}

/**
 * Validates required fields
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): ValidationResult {
    const errors: ValidationError[] = []

    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors.push({
                field,
                message: `${field} alanı zorunludur`,
                code: 'REQUIRED_FIELD'
            })
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalizes first letter of each word
 */
export function capitalizeWords(str: string): string {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

/**
 * Converts string to slug
 */
export function toSlug(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

/**
 * Truncates text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Formats Turkish currency
 */
export function formatCurrency(amount: number, currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): string {
    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    })
    return formatter.format(amount)
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Formats date to Turkish format
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
    const d = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    if (includeTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    return d.toLocaleDateString('tr-TR', options)
}

/**
 * Gets relative time (e.g., "2 saat önce")
 */
export function getRelativeTime(date: Date | string): string {
    const now = new Date()
    const target = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Az önce'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} gün önce`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} ay önce`

    return `${Math.floor(diffInSeconds / 31536000)} yıl önce`
}

/**
 * Checks if date is today
 */
export function isToday(date: Date | string): boolean {
    const today = new Date()
    const target = new Date(date)
    return today.toDateString() === target.toDateString()
}

// ============================================================================
// ARRAY & OBJECT UTILITIES
// ============================================================================

/**
 * Removes duplicates from array
 */
export function removeDuplicates<T>(array: T[], key?: keyof T): T[] {
    if (!key) {
        return [...new Set(array)]
    }

    const seen = new Set()
    return array.filter(item => {
        const value = item[key]
        if (seen.has(value)) return false
        seen.add(value)
        return true
    })
}

/**
 * Groups array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
        const groupKey = String(item[key])
        if (!groups[groupKey]) groups[groupKey] = []
        groups[groupKey].push(item)
        return groups
    }, {} as Record<string, T[]>)
}

/**
 * Sorts array by multiple keys
 */
export function sortByMultiple<T>(array: T[], ...keys: Array<keyof T>): T[] {
    return [...array].sort((a, b) => {
        for (const key of keys) {
            const aVal = a[key]
            const bVal = b[key]

            if (aVal < bVal) return -1
            if (aVal > bVal) return 1
        }
        return 0
    })
}

// ============================================================================
// SEARCH & FILTER UTILITIES
// ============================================================================

/**
 * Applies search filters to array
 */
export function applySearchFilters<T>(
    items: T[],
    filters: SearchFilters,
    searchFields: (keyof T)[]
): SearchResult<T> {
    let filtered = [...items]

    // Apply search query
    if (filters.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(item =>
            searchFields.some(field => {
                const value = item[field]
                return value && String(value).toLowerCase().includes(query)
            })
        )
    }

    // Apply date filters
    if (filters.dateFrom) {
        filtered = filtered.filter(item => {
            const itemDate = new Date((item as any).createdAt || (item as any).created_at)
            return itemDate >= new Date(filters.dateFrom!)
        })
    }

    if (filters.dateTo) {
        filtered = filtered.filter(item => {
            const itemDate = new Date((item as any).createdAt || (item as any).created_at)
            return itemDate <= new Date(filters.dateTo!)
        })
    }

    // Apply status filters
    if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(item => {
            const itemStatus = (item as any).status
            return filters.status!.includes(itemStatus)
        })
    }

    // Apply sorting
    if (filters.sortBy) {
        filtered.sort((a, b) => {
            const aVal = (a as any)[filters.sortBy!]
            const bVal = (b as any)[filters.sortBy!]

            if (filters.sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1
            }
            return aVal > bVal ? 1 : -1
        })
    }

    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = filtered.slice(startIndex, endIndex)

    return {
        items: paginatedItems,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1
    }
}

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Sanitizes HTML content
 */
export function sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use DOMPurify
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
}

/**
 * Generates random string
 */
export function generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Masks sensitive data
 */
export function maskSensitiveData(data: string, type: 'email' | 'phone' | 'id'): string {
    switch (type) {
        case 'email':
            const [local, domain] = data.split('@')
            return `${local.charAt(0)}***@${domain}`
        case 'phone':
            return data.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')
        case 'id':
            return data.replace(/(\d{3})(\d{6})(\d{2})/, '$1******$3')
        default:
            return data
    }
}

// ============================================================================
// FILE UTILITIES
// ============================================================================

/**
 * Gets file extension
 */
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Formats file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validates file type
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = getFileExtension(filename)
    return allowedTypes.includes(extension)
}

/**
 * Validates file size
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Extracts error message from various error types
 */
export function extractErrorMessage(error: any): string {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    if (error?.detail) return error.detail
    return 'Bilinmeyen bir hata oluştu'
}

/**
 * Logs error with context
 */
export function logError(error: any, context?: Record<string, any>): void {
    console.error('Error:', {
        message: extractErrorMessage(error),
        stack: error?.stack,
        context,
        timestamp: new Date().toISOString()
    })
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounces function calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Throttles function calls
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}
