import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import OfflineIndicator from './components/OfflineIndicator'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { OnboardingTestButton } from './components/onboarding/OnboardingTestButton'
import PWAPrompt from './components/PWAPrompt'
import { onboardingSteps } from './constants/onboardingSteps.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { PerformanceService } from './services/performanceService'

import AppRoutes from './routes'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

// Clean and minimal layout
function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}

// Inner component that uses theme-dependent hooks
function AppContent({
  resetOnboarding,
  setShowOnboarding
}: {
  resetOnboarding: () => void
  setShowOnboarding: (show: boolean) => void
}) {
  return (
    <SimpleLayout>
      <ErrorBoundary level="page">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
              {/* Premium Loading Animation */}
              <div className="h-16 w-16 rounded-full border-4 border-brand-primary-200 border-t-brand-primary-600 animate-spin"></div>
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-r-brand-accent-600 animate-spin animate-reverse"></div>
            </div>
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </ErrorBoundary>

      {/* Global UI Components */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-card',
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'hsl(var(--foreground))'
          }
        }}
      />
      
      <OfflineIndicator />
      <PWAPrompt />
      
      {/* Onboarding */}
      <OnboardingModal
        steps={onboardingSteps}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
        onReset={resetOnboarding}
      />

      {/* Dev Tools */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <OnboardingTestButton onTest={() => setShowOnboarding(true)} />
          <ReactQueryDevtools 
            initialIsOpen={false} 
            buttonPosition="bottom-left"
          />
        </>
      )}
    </SimpleLayout>
  )
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if onboarding was completed
    const completed = localStorage.getItem('onboarding-completed')
    return !completed
  })

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-completed')
    setShowOnboarding(true)
  }

  useEffect(() => {
    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      PerformanceService.start()
    }

    // Set up global error handlers
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', () => {})
    }
  }, [])

  return (
    <ErrorBoundary level="app">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <SocketProvider>
              <AppContent 
                resetOnboarding={resetOnboarding}
                setShowOnboarding={setShowOnboarding}
              />
            </SocketProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
