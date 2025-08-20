import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthErrorBoundary } from './components/AuthErrorBoundary'
import ErrorFallback from './components/ErrorFallback'
import './index.css'
// Removed corporate UI enhancement CSS

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <AuthErrorBoundary>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('Uncaught error:', error, errorInfo)
        }}
      >
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthErrorBoundary>
  </React.StrictMode>
)
