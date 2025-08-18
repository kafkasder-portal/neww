import { useEffect, Suspense } from 'react'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import PWAPrompt from './components/PWAPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import { SocketProvider } from './contexts/SocketContext'
import { OfflineProvider } from './contexts/OfflineContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient, cacheUtils } from './lib/queryClient'
import { useAuthStore } from './store/auth'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { OnboardingTestButton } from './components/onboarding/OnboardingTestButton'
import { useOnboarding } from './hooks/useOnboarding'
import { onboardingSteps } from './constants/onboardingSteps.tsx'

import AppRoutes from './routes'

// Inner component that uses theme-dependent hooks
function AppContent({
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
        onClose={() => {}}
        onComplete={() => {}}
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
  const { resetOnboarding, setShowOnboarding } = useOnboarding()

  // Initialize auth on app start
  useEffect(() => {
    initialize()
  }, [initialize])

  // Cache persistence için offline support
  useEffect(() => {
    // Uygulama başlarken cache'i yükle
    cacheUtils.loadFromStorage()

    // Sayfa kapatılırken cache'i kaydet
    const handleBeforeUnload = () => {
      cacheUtils.saveToStorage()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

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
          <QueryClientProvider client={queryClient}>
            <OfflineProvider>
              <SocketProvider>
                <AppContent
                  resetOnboarding={resetOnboarding}
                  setShowOnboarding={setShowOnboarding}
                />
              </SocketProvider>
            </OfflineProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
