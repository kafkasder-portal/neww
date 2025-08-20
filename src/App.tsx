import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useEffect } from 'react'
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
import { useAuthStore } from './store/auth'

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

// Inner component that uses theme-dependent hooks (unused for now)
function _AppContent({
  resetOnboarding,
  setShowOnboarding
}: {
  resetOnboarding: () => void
  setShowOnboarding: (show: boolean) => void
}) {
  return (
    <>
      <ErrorBoundary level="page">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </ErrorBoundary>

      {/* Global UI Components - sadece authenticated kullanıcılar için */}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
      <PWAPrompt />
      <OfflineIndicator />

      {/* Onboarding */}
      <OnboardingModal
        isOpen={false} // Disabled for now
        onClose={() => {
          // Onboarding close handler
        }}
        onComplete={() => {
          // Onboarding complete handler
        }}
        steps={onboardingSteps}
      />

      {/* Development Tools */}
      {process.env.NODE_ENV === 'development' && (
        <OnboardingTestButton
          onReset={resetOnboarding}
          onStart={() => setShowOnboarding(true)}
        />
      )}
    </>
  )
}

export default function App() {
  const { initializing, initialize } = useAuthStore()

  // Initialize auth on app start
  useEffect(() => {
    initialize()
  }, [initialize])

  // Show loading screen while initializing auth
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Uygulama yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary level="global" showDetails={process.env.NODE_ENV === 'development'}>
      <ThemeProvider>
        <LanguageProvider>
          <SocketProvider>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <AppRoutes />
              </Suspense>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </SocketProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
