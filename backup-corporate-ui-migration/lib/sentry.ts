import * as Sentry from '@sentry/react'
import { browserTracingIntegration } from '@sentry/react'

// Sentry konfigürasyonu
export const initSentry = () => {
  // Sadece production ortamında Sentry'yi başlat
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENVIRONMENT || 'production',
      integrations: [
        browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance monitoring
      tracesSampleRate: 0.1, // %10 sampling rate
      
      // Session replay (opsiyonel)
      replaysSessionSampleRate: 0.1, // %10 session replay
      replaysOnErrorSampleRate: 1.0, // Hata durumunda %100 replay
      
      // Hata filtreleme
      beforeSend(event, hint) {
        // Development ortamında console'a da yazdır
        if (import.meta.env.DEV) {
          console.error('Sentry Error:', event, hint)
        }
        
        // Belirli hataları filtrele
        if (event.exception) {
          const error = hint.originalException
          
          // Network hataları için özel işlem
          if (error instanceof TypeError && error.message.includes('fetch')) {
            event.tags = { ...event.tags, errorType: 'network' }
          }
          
          // Validation hataları için özel işlem
          if (error instanceof Error && error.message.includes('validation')) {
            event.tags = { ...event.tags, errorType: 'validation' }
          }
        }
        
        return event
      },
      
      // Kullanıcı context'i ayarla
      initialScope: {
        tags: {
          component: 'dernek-panel'
        }
      }
    })
    
    console.log('Sentry initialized for production')
  } else {
    console.log('Sentry not initialized (development mode or missing DSN)')
  }
}

// Kullanıcı bilgilerini Sentry'ye gönder
export const setSentryUser = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role
  })
}

// Manuel hata gönderimi
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key])
      })
    }
    Sentry.captureException(error)
  })
}

// Manuel mesaj gönderimi
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level)
}

// Performance monitoring için span başlat
export const startSpan = (name: string, op: string, callback: () => void) => {
  return Sentry.startSpan({ name, op }, callback)
}

export { Sentry }