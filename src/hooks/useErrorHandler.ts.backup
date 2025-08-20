import { useCallback } from 'react'
import { useAuthStore } from '../store/auth'
import { 
  errorService, 
  ErrorCategory, 
  ErrorSeverity,
  logAuthError,
  logNetworkError,
  logValidationError,
  logApiError,
  logSystemError
} from '../services/errorService'

export function useErrorHandler() {
  const { user, profile } = useAuthStore()

  const getBaseContext = useCallback(() => ({
    userId: user?.id,
    userEmail: user?.email,
    userRole: profile?.role,
    url: window.location.href,
    component: 'unknown'
  }), [user, profile])

  // Generic error handler
  const handleError = useCallback((
    error: Error,
    options: {
      category: ErrorCategory
      severity: ErrorSeverity
      component?: string
      action?: string
      showToast?: boolean
      customMessage?: string
      additionalData?: Record<string, unknown>
    }
  ) => {
    const context = {
      ...getBaseContext(),
      component: options.component || 'unknown',
      action: options.action || 'unknown',
      additionalData: options.additionalData
    }

    return errorService.handleError(error, {
      category: options.category,
      severity: options.severity,
      context,
      showToast: options.showToast,
      customMessage: options.customMessage
    })
  }, [getBaseContext])

  // Specialized error handlers
  const handleAuthError = useCallback((error: Error, component?: string, action?: string) => {
    return logAuthError(error, {
      ...getBaseContext(),
      component,
      action
    })
  }, [getBaseContext])

  const handleNetworkError = useCallback((error: Error, component?: string, action?: string) => {
    return logNetworkError(error, {
      ...getBaseContext(),
      component,
      action
    })
  }, [getBaseContext])

  const handleValidationError = useCallback((error: Error, component?: string, action?: string) => {
    return logValidationError(error, {
      ...getBaseContext(),
      component,
      action
    })
  }, [getBaseContext])

  const handleApiError = useCallback((error: Error, component?: string, action?: string, endpoint?: string) => {
    return logApiError(error, {
      ...getBaseContext(),
      component,
      action,
      additionalData: { endpoint }
    })
  }, [getBaseContext])

  const handleSystemError = useCallback((error: Error, component?: string, action?: string) => {
    return logSystemError(error, {
      ...getBaseContext(),
      component,
      action
    })
  }, [getBaseContext])

  // Async operation wrapper with error handling
  const withErrorHandling = useCallback(<T,>(
    operation: () => Promise<T>,
    options: {
      component: string
      action: string
      category?: ErrorCategory
      severity?: ErrorSeverity
      onError?: (error: Error, errorId: string) => void
      customErrorMessage?: string
    }
  ) => {
    return async (): Promise<T | null> => {
      try {
        return await operation()
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error(String(error))
        
        const errorId = handleError(errorInstance, {
          category: options.category || ErrorCategory.SYSTEM,
          severity: options.severity || ErrorSeverity.MEDIUM,
          component: options.component,
          action: options.action,
          customMessage: options.customErrorMessage
        })

        if (options.onError) {
          options.onError(errorInstance, errorId)
        }

        return null
      }
    }
  }, [handleError])

  // Form submission error handler
  const handleFormError = useCallback((error: Error, formName: string, fieldErrors?: Record<string, string>) => {
    return handleError(error, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      component: formName,
      action: 'form_submission',
      showToast: !fieldErrors, // Don't show toast if we have field-specific errors
      additionalData: { fieldErrors }
    })
  }, [handleError])

  // API call wrapper with automatic error handling
  const apiCall = useCallback(async <T,>(
    operation: () => Promise<T>,
    options: {
      component: string
      action: string
      endpoint: string
      showErrorToast?: boolean
      customErrorMessage?: string
    }
  ): Promise<T | null> => {
    try {
      return await operation()
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error(String(error))
      
      // Determine error category based on error type/status
      let category = ErrorCategory.EXTERNAL_SERVICE
      let severity = ErrorSeverity.MEDIUM

      if (errorInstance.message.includes('401') || errorInstance.message.includes('unauthorized')) {
        category = ErrorCategory.AUTHENTICATION
        severity = ErrorSeverity.HIGH
      } else if (errorInstance.message.includes('403') || errorInstance.message.includes('forbidden')) {
        category = ErrorCategory.AUTHORIZATION
        severity = ErrorSeverity.HIGH
      } else if (errorInstance.message.includes('400') || errorInstance.message.includes('validation')) {
        category = ErrorCategory.VALIDATION
        severity = ErrorSeverity.LOW
      } else if (errorInstance.message.includes('500') || errorInstance.message.includes('server')) {
        category = ErrorCategory.EXTERNAL_SERVICE
        severity = ErrorSeverity.HIGH
      } else if (errorInstance.message.includes('network') || errorInstance.message.includes('fetch')) {
        category = ErrorCategory.NETWORK
        severity = ErrorSeverity.MEDIUM
      }

      handleError(errorInstance, {
        category,
        severity,
        component: options.component,
        action: options.action,
        showToast: options.showErrorToast !== false,
        customMessage: options.customErrorMessage,
        additionalData: { endpoint: options.endpoint }
      })

      return null
    }
  }, [handleError])

  // Component lifecycle error handler
  const handleComponentError = useCallback((error: Error, componentName: string, lifecycle: string) => {
    return handleError(error, {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      component: componentName,
      action: `component_${lifecycle}`,
      additionalData: { lifecycle }
    })
  }, [handleError])

  return {
    // Generic handlers
    handleError,
    handleAuthError,
    handleNetworkError,
    handleValidationError,
    handleApiError,
    handleSystemError,
    handleFormError,
    handleComponentError,
    
    // Utility functions
    withErrorHandling,
    apiCall,
    
    // Error service access
    getErrorLogs: errorService.getLogs.bind(errorService),
    getErrorStats: errorService.getStats.bind(errorService),
    markErrorAsResolved: errorService.markAsResolved.bind(errorService),
    clearErrorLogs: errorService.clearLogs.bind(errorService)
  }
}

// Hook for form error handling
export function useFormErrorHandler(formName: string) {
  const { handleFormError, handleValidationError } = useErrorHandler()

  const handleSubmitError = useCallback((error: Error, fieldErrors?: Record<string, string>) => {
    return handleFormError(error, formName, fieldErrors)
  }, [handleFormError, formName])

  const handleFieldError = useCallback((error: Error, fieldName: string) => {
    return handleValidationError(error, formName, `field_validation_${fieldName}`)
  }, [handleValidationError, formName])

  return {
    handleSubmitError,
    handleFieldError
  }
}

// Hook for API error handling
export function useApiErrorHandler(componentName: string) {
  const { apiCall, handleApiError } = useErrorHandler()

  const makeApiCall = useCallback(<T,>(
    operation: () => Promise<T>,
    endpoint: string,
    action: string = 'api_call',
    options?: {
      showErrorToast?: boolean
      customErrorMessage?: string
    }
  ) => {
    return apiCall(operation, {
      component: componentName,
      action,
      endpoint,
      ...options
    })
  }, [apiCall, componentName])

  const handleError = useCallback((error: Error, endpoint: string, action: string = 'api_error') => {
    return handleApiError(error, componentName, action, endpoint)
  }, [handleApiError, componentName])

  return {
    makeApiCall,
    handleError
  }
}
