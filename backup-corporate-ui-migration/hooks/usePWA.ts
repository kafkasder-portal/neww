import { useEffect, useState } from 'react'
// import { useRegisterSW } from 'virtual:pwa-register/react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  needRefresh: boolean
  updateAvailable: boolean
}

interface PWAActions {
  install: () => Promise<void>
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  showInstallPrompt: () => void
}

export function usePWA(): PWAState & PWAActions {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  // const {
  //   needRefresh,
  //   updateServiceWorker,
  // } = useRegisterSW({
  //   onRegistered(r: ServiceWorkerRegistration) {
  //     console.log('SW Registered: ' + r)
  //   },
  //   onRegisterError(error: Error) {
  //     console.log('SW registration error', error)
  //   },
  // })
  
  const needRefresh = false
  const updateServiceWorker = async () => {
    console.log('Service worker update not available')
  }

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    checkInstalled()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const install = async (): Promise<void> => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const showInstallPrompt = () => {
    if (isInstallable && !isInstalled) {
      install()
    }
  }

  return {
    isInstallable,
    isInstalled,
    isOffline,
    needRefresh,
    updateAvailable: needRefresh,
    install,
    updateServiceWorker,
    showInstallPrompt,
  }
}