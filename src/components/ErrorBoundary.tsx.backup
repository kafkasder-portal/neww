import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { errorService, ErrorCategory, ErrorSeverity } from '../services/errorService'

interface Props {
  children: ReactNode
  level?: 'global' | 'page' | 'component'
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error service
    const errorId = errorService.handleError(error, {
      category: ErrorCategory.SYSTEM,
      severity: this.getSeverityFromLevel(this.props.level || 'component'),
      context: {
        component: 'ErrorBoundary',
        action: 'component_error',
        additionalData: {
          level: this.props.level,
          componentStack: errorInfo.componentStack,
          retryCount: this.retryCount
        }
      }
    })

    this.setState({
      error,
      errorInfo,
      errorId
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private getSeverityFromLevel(level: string): ErrorSeverity {
    switch (level) {
      case 'global':
        return ErrorSeverity.CRITICAL
      case 'page':
        return ErrorSeverity.HIGH
      case 'component':
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      })
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const { error, errorId } = this.state
    const subject = encodeURIComponent(`Bug Report - ${error?.message || 'Unknown Error'}`)
    const body = encodeURIComponent(`
Error ID: ${errorId}
Error Message: ${error?.message}
Stack Trace: ${error?.stack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:

    `.trim())
    
    window.open(`mailto:support@dernek.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorId } = this.state
      const { level = 'component', showDetails = false } = this.props

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {level === 'global' && 'Uygulama Hatası'}
                {level === 'page' && 'Sayfa Yüklenemedi'}
                {level === 'component' && 'Bir Sorun Oluştu'}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {level === 'global' && 'Uygulamada beklenmeyen bir hata oluştu.'}
                {level === 'page' && 'Bu sayfa yüklenirken bir hata oluştu.'}
                {level === 'component' && 'Bu bölüm gösterilirken bir hata oluştu.'}
              </p>

              {errorId && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">
                    Hata Kodu: <code className="font-mono bg-gray-200 px-1 rounded">{errorId.slice(-8)}</code>
                  </p>
                </div>
              )}
            </div>

            {showDetails && error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Teknik Detaylar
                  </summary>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Hata Mesajı:</strong>
                      <p className="font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                        {error.message}
                      </p>
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="font-mono bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              {/* Retry button (if not exceeded max retries) */}
              {this.retryCount < this.maxRetries && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tekrar Dene ({this.maxRetries - this.retryCount} deneme hakkı)
                </Button>
              )}

              {/* Action buttons based on error level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {level === 'global' ? (
                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sayfayı Yenile
                  </Button>
                ) : (
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Ana Sayfaya Dön
                  </Button>
                )}

                <Button
                  onClick={this.handleReportBug}
                  variant="outline"
                  className="w-full"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Hata Bildir
                </Button>
              </div>

              {/* Additional actions for global errors */}
              {level === 'global' && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Eğer sorun devam ederse:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          localStorage.clear()
                          sessionStorage.clear()
                          window.location.reload()
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Önbelleği Temizle
                      </Button>
                      <Button
                        onClick={() => window.open('mailto:destek@dernek.com')}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Destek İletişim
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    level?: 'global' | 'page' | 'component'
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
  }
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Specialized error boundaries
export const GlobalErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundary {...props} level="global" showDetails={process.env.NODE_ENV === 'development'} />
)

export const PageErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundary {...props} level="page" />
)

export const ComponentErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundary {...props} level="component" />
)
