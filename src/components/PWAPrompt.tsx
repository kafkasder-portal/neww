import React from 'react'
import { usePWA } from '../hooks/usePWA'
import { X, Download, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface PWAPromptProps {
  onClose?: () => void
}

export function PWAPrompt({ onClose }: PWAPromptProps) {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    needRefresh,
    install,
    updateServiceWorker,
  } = usePWA()

  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = React.useState(false)

  React.useEffect(() => {
    if (isInstallable && !isInstalled) {
      setShowInstallPrompt(true)
    }
  }, [isInstallable, isInstalled])

  React.useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true)
    }
  }, [needRefresh])

  const handleInstall = async () => {
    await install()
    setShowInstallPrompt(false)
    onClose?.()
  }

  const handleUpdate = async () => {
    await updateServiceWorker(true)
    setShowUpdatePrompt(false)
    onClose?.()
  }

  const handleCloseInstall = () => {
    setShowInstallPrompt(false)
    onClose?.()
  }

  const handleCloseUpdate = () => {
    setShowUpdatePrompt(false)
    onClose?.()
  }

  return (
    <>
      {/* Offline Status */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Çevrimdışı</span>
        </div>
      )}

      {/* Online Status (when coming back online) */}
      {!isOffline && (
        <div className="fixed bottom-4 left-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Çevrimiçi</span>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Uygulamayı Yükle
              </h3>
            </div>
            <button
              onClick={handleCloseInstall}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Bu uygulamayı cihazınıza yükleyerek daha hızlı erişim sağlayabilirsiniz.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Yükle
            </button>
            <button
              onClick={handleCloseInstall}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Şimdi Değil
            </button>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Güncelleme Mevcut
              </h3>
            </div>
            <button
              onClick={handleCloseUpdate}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Yeni bir sürüm mevcut. Güncellemek için sayfayı yenileyin.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Güncelle
            </button>
            <button
              onClick={handleCloseUpdate}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Sonra
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PWAPrompt
