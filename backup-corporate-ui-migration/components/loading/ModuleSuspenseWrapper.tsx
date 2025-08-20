import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import AidModuleLoading from './AidModuleLoading'
import DonationsModuleLoading from './DonationsModuleLoading'
import ScholarshipModuleLoading from './ScholarshipModuleLoading'
import { Loading } from '../Loading'
import { AlertTriangle, RefreshCw } from 'lucide-react'

type ModuleType = 'aid' | 'donations' | 'scholarship' | 'messages' | 'fund' | 'system' | 'definitions' | 'dashboard' | 'meetings' | 'internal_messages' | 'tasks'
type LoadingType = 'dashboard' | 'table' | 'form' | 'vault' | 'tracking' | 'students' | 'applications' | 'stats'

interface ModuleSuspenseWrapperProps {
  children: React.ReactNode
  module: ModuleType
  loadingType?: LoadingType
  fallbackText?: string
}

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  module: ModuleType
}

const ErrorFallback = ({ error, resetErrorBoundary, module }: ErrorFallbackProps) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <div className="text-center max-w-md">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {module.charAt(0).toUpperCase() + module.slice(1)} Modülü Yüklenemedi
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
      </p>
      <details className="text-xs text-muted-foreground mb-4">
        <summary className="cursor-pointer hover:text-foreground">
          Hata detayları
        </summary>
        <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
          {error.message}
        </pre>
      </details>
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Tekrar Dene
      </button>
    </div>
  </div>
)

const getModuleLoading = (module: ModuleType, loadingType: LoadingType = 'dashboard') => {
  switch (module) {
    case 'aid':
      return <AidModuleLoading type={loadingType} />
    case 'donations':
      return <DonationsModuleLoading type={loadingType} />
    case 'scholarship':
      return <ScholarshipModuleLoading type={loadingType} />
    case 'messages':
      return <Loading text="Mesajlar yükleniyor..." size="lg" />
    case 'fund':
      return <Loading text="Fon bilgileri yükleniyor..." size="lg" />
    case 'system':
      return <Loading text="Sistem ayarları yükleniyor..." size="lg" />
    case 'definitions':
      return <Loading text="Tanımlar yükleniyor..." size="lg" />
    case 'dashboard':
      return <Loading text="Dashboard yükleniyor..." size="lg" />
    case 'meetings':
      return <Loading text="Toplantılar yükleniyor..." size="lg" />
    case 'internal_messages':
      return <Loading text="İç mesajlar yükleniyor..." size="lg" />
    case 'tasks':
      return <Loading text="Görevler yükleniyor..." size="lg" />
    default:
      return <Loading text="Sayfa yükleniyor..." size="lg" />
  }
}

export const ModuleSuspenseWrapper = ({ 
  children, 
  module, 
  loadingType = 'dashboard'
}: ModuleSuspenseWrapperProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={(props: { error: Error; resetErrorBoundary: () => void }) => <ErrorFallback {...props} module={module} />}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={getModuleLoading(module, loadingType)}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Specific wrappers for each module
export const withAidSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="aid" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export const withDonationsSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="donations" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export const withScholarshipSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="scholarship" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export const withMessagesSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
) => (
  <ModuleSuspenseWrapper module="messages">
    <Component />
  </ModuleSuspenseWrapper>
)

export const withFundSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
) => (
  <ModuleSuspenseWrapper module="fund">
    <Component />
  </ModuleSuspenseWrapper>
)

export const withSystemSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
) => (
  <ModuleSuspenseWrapper module="system">
    <Component />
  </ModuleSuspenseWrapper>
)

export const withDefinitionsSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
) => (
  <ModuleSuspenseWrapper module="definitions">
    <Component />
  </ModuleSuspenseWrapper>
)

export const withDashboardSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
) => (
  <ModuleSuspenseWrapper module="dashboard">
    <Component />
  </ModuleSuspenseWrapper>
)

export const withMeetingsSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="meetings" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export const withInternalMessagesSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="internal_messages" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export const withTasksSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>,
  loadingType: LoadingType = 'dashboard'
) => (
  <ModuleSuspenseWrapper module="tasks" loadingType={loadingType}>
    <Component />
  </ModuleSuspenseWrapper>
)

export default ModuleSuspenseWrapper
