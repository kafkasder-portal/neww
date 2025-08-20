import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import OfflineIndicator from './components/OfflineIndicator'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { OnboardingTestButton } from './components/onboarding/OnboardingTestButton'
import PWAPrompt from './components/PWAPrompt'
import AppSidebar from './components/AppSidebar'
import { SidebarProvider, SidebarInset } from './components/ui/sidebar'
import { onboardingSteps } from './constants/onboardingSteps.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAuthStore } from './store/auth'
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

// Premium Layout Component with Enhanced AppSidebar
function PremiumLayout({ children }: { children: React.ReactNode }) {
  const { session, user } = useAuthStore()

  // Don't show sidebar on login page
  const isLoginPage = window.location.pathname === '/login'

  if (isLoginPage || !session || !user) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced AppSidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full">
              {/* Premium Background Pattern */}
              <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-500/5 via-transparent to-brand-accent-500/5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-primary-400/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-brand-accent-400/10 to-transparent rounded-full blur-3xl" />
              </div>

              {/* Content */}
              <div className="relative">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
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
    <PremiumLayout>
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

      {/* Global UI Components - sadece authenticated kullanıcılar için */}
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
    </PremiumLayout>
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
