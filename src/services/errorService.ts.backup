import { toast } from 'sonner'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  VALIDATION = 'validation',
  DATABASE = 'database',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
  EXTERNAL_SERVICE = 'external_service'
}

export interface ErrorContext {
  userId?: string
  userEmail?: string
  userRole?: string
  component?: string
  action?: string
  url?: string
  timestamp?: string
  userAgent?: string
  sessionId?: string
  additionalData?: Record<string, unknown>
}

export interface ErrorLog {
  id: string
  message: string
  stack?: string
  code?: string
  category: ErrorCategory
  severity: ErrorSeverity
  context: ErrorContext
  timestamp: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

class ErrorService {
  private logs: ErrorLog[] = []
  private isEnabled: boolean = true
  private maxLogs: number = 1000
  private pendingLogs: ErrorLog[] = []
  private batchTimeout: ReturnType<typeof setTimeout> | null = null
  private batchSize: number = 10
  private batchDelay: number = 5000 // 5 seconds

  constructor() {
    // Initialize error service
    this.setupGlobalErrorHandlers()
    this.startPeriodicCleanup()
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        context: {
          component: 'window',
          action: 'unhandled_error',
          url: window.location.href,
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          category: ErrorCategory.SYSTEM,
          severity: ErrorSeverity.HIGH,
          context: {
            component: 'window',
            action: 'unhandled_promise_rejection',
            url: window.location.href
          }
        }
      )
    })

    // Send pending logs before page unload
    window.addEventListener('beforeunload', () => {
      this.flushPendingLogs()
    })

    // Send pending logs when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushPendingLogs()
      }
    })
  }

  private startPeriodicCleanup() {
    // Clean up old logs every 10 minutes
    setInterval(() => {
      this.cleanupOldLogs()
    }, 10 * 60 * 1000)
  }

  private cleanupOldLogs() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
    this.logs = this.logs.filter(log => new Date(log.timestamp).getTime() > cutoffTime)
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentContext(): ErrorContext {
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('app_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('app_session_id', sessionId)
    }
    return sessionId
  }

  private shouldShowToast(severity: ErrorSeverity, category: ErrorCategory): boolean {
    // Don't show toast for low severity or validation errors
    if (severity === ErrorSeverity.LOW || category === ErrorCategory.VALIDATION) {
      return false
    }
    return true
  }

  private getToastMessage(category: ErrorCategory): string {
    const categoryMessages: Record<ErrorCategory, string> = {
      [ErrorCategory.AUTHENTICATION]: 'Kimlik doğrulama hatası oluştu',
      [ErrorCategory.AUTHORIZATION]: 'Bu işlem için yetkiniz bulunmuyor',
      [ErrorCategory.NETWORK]: 'Bağlantı hatası oluştu',
      [ErrorCategory.VALIDATION]: 'Girilen bilgilerde hata var',
      [ErrorCategory.DATABASE]: 'Veritabanı hatası oluştu',
      [ErrorCategory.SYSTEM]: 'Sistem hatası oluştu',
      [ErrorCategory.USER_INPUT]: 'Geçersiz veri girişi',
      [ErrorCategory.EXTERNAL_SERVICE]: 'Harici servis hatası oluştu'
    }

    return categoryMessages[category] || 'Beklenmeyen bir hata oluştu'
  }

  private scheduleBatchSend() {
    if (this.batchTimeout) {
      return
    }

    this.batchTimeout = setTimeout(() => {
      this.flushPendingLogs()
    }, this.batchDelay)
  }

  private async flushPendingLogs() {
    if (this.pendingLogs.length === 0) {
      return
    }

    const logsToSend = [...this.pendingLogs]
    this.pendingLogs = []

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }

    try {
      await this.sendBatchToServer(logsToSend)
    } catch (error) {
      console.error('Failed to send error logs to server:', error)
      // Re-add failed logs to pending (but limit to prevent infinite growth)
      this.pendingLogs = [...logsToSend.slice(-50), ...this.pendingLogs]
    }
  }

  private async sendBatchToServer(logs: ErrorLog[]): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      // Don't send to server in development
      return
    }

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logs),
        keepalive: true // Important for beforeunload events
      })
    } catch (error) {
      console.error('Network error sending logs:', error)
      throw error
    }
  }

  handleError(
    error: Error,
    options: {
      category: ErrorCategory
      severity: ErrorSeverity
      context?: Partial<ErrorContext>
      showToast?: boolean
      customMessage?: string
    }
  ): string {
    if (!this.isEnabled) {
      return ''
    }

    const errorLog: ErrorLog = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      code: (error as Error & { code?: string }).code,
      category: options.category,
      severity: options.severity,
      context: {
        ...this.getCurrentContext(),
        ...options.context
      },
      timestamp: new Date().toISOString(),
      resolved: false
    }

    // Add to local logs
    this.logs.unshift(errorLog)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Add to pending logs for server sync
    this.pendingLogs.push(errorLog)
    
    // Schedule batch send if we have enough logs or this is critical
    if (this.pendingLogs.length >= this.batchSize || options.severity === ErrorSeverity.CRITICAL) {
      this.flushPendingLogs()
    } else {
      this.scheduleBatchSend()
    }

    // Console logging
    const logLevel = this.getLogLevel(options.severity)
    console[logLevel](`[${options.category.toUpperCase()}] ${error.message}`, {
      error,
      context: errorLog.context,
      errorId: errorLog.id
    })

    // Show toast notification
    if (options.showToast !== false && this.shouldShowToast(options.severity, options.category)) {
      const toastMessage = options.customMessage || this.getToastMessage(options.category)
      
      if (options.severity === ErrorSeverity.CRITICAL || options.severity === ErrorSeverity.HIGH) {
        toast.error(toastMessage, {
          description: 'Hata ID: ' + errorLog.id.slice(-8),
          duration: 8000,
          action: {
            label: 'Detaylar',
            onClick: () => {
              console.group('Error Details')
              console.error('Error:', error)
              console.log('Context:', errorLog.context)
              console.log('Error ID:', errorLog.id)
              console.groupEnd()
            }
          }
        })
      } else {
        toast.warning(toastMessage, {
          duration: 5000
        })
      }
    }

    return errorLog.id
  }

  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error'
      case ErrorSeverity.MEDIUM:
        return 'warn'
      case ErrorSeverity.LOW:
      default:
        return 'info'
    }
  }

  // Convenience methods for different error types
  handleAuthError(error: Error, context?: Partial<ErrorContext>) {
    return this.handleError(error, {
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      context
    })
  }

  handleNetworkError(error: Error, context?: Partial<ErrorContext>) {
    return this.handleError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      context,
      customMessage: 'Bağlantı sorunu yaşanıyor. Lütfen internet bağlantınızı kontrol edin.'
    })
  }

  handleValidationError(error: Error, context?: Partial<ErrorContext>) {
    return this.handleError(error, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      context,
      showToast: false // Validation errors usually handled by forms
    })
  }

  handleApiError(error: Error, context?: Partial<ErrorContext>) {
    const severity = error.message.includes('500') ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM
    return this.handleError(error, {
      category: ErrorCategory.EXTERNAL_SERVICE,
      severity,
      context
    })
  }

  handleSystemError(error: Error, context?: Partial<ErrorContext>) {
    return this.handleError(error, {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      context
    })
  }

  // Error retrieval and management
  getLogs(filters?: {
    category?: ErrorCategory
    severity?: ErrorSeverity
    resolved?: boolean
    limit?: number
  }): ErrorLog[] {
    let filteredLogs = [...this.logs]

    if (filters?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity)
    }

    if (filters?.resolved !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.resolved === filters.resolved)
    }

    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  getErrorById(id: string): ErrorLog | undefined {
    return this.logs.find(log => log.id === id)
  }

  markAsResolved(id: string, resolvedBy?: string): boolean {
    const log = this.logs.find(log => log.id === id)
    if (log) {
      log.resolved = true
      log.resolvedAt = new Date().toISOString()
      log.resolvedBy = resolvedBy
      return true
    }
    return false
  }

  clearLogs(): void {
    this.logs = []
    this.pendingLogs = []
  }

  getStats(): {
    total: number
    byCategory: Record<ErrorCategory, number>
    bySeverity: Record<ErrorSeverity, number>
    resolved: number
    unresolved: number
  } {
    const stats = {
      total: this.logs.length,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      resolved: this.logs.filter(log => log.resolved).length,
      unresolved: this.logs.filter(log => !log.resolved).length
    }

    // Initialize counters
    Object.values(ErrorCategory).forEach(category => {
      stats.byCategory[category] = 0
    })
    Object.values(ErrorSeverity).forEach(severity => {
      stats.bySeverity[severity] = 0
    })

    // Count logs
    this.logs.forEach(log => {
      stats.byCategory[log.category]++
      stats.bySeverity[log.severity]++
    })

    return stats
  }

  // Configuration
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  setMaxLogs(maxLogs: number): void {
    this.maxLogs = maxLogs
    if (this.logs.length > maxLogs) {
      this.logs = this.logs.slice(0, maxLogs)
    }
  }

  // Force flush pending logs (useful for testing)
  async forceBatchSend(): Promise<void> {
    await this.flushPendingLogs()
  }
}

// Create singleton instance
export const errorService = new ErrorService()

// Export convenience functions
export const logError = errorService.handleError.bind(errorService)
export const logAuthError = errorService.handleAuthError.bind(errorService)
export const logNetworkError = errorService.handleNetworkError.bind(errorService)
export const logValidationError = errorService.handleValidationError.bind(errorService)
export const logApiError = errorService.handleApiError.bind(errorService)
export const logSystemError = errorService.handleSystemError.bind(errorService)
