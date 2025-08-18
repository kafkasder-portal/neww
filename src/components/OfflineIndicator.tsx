import React from 'react'
import { Wifi, WifiOff, Clock, CheckCircle } from 'lucide-react'
import { useOfflineIndicator } from '../hooks/useOfflineSupport'
import { cn } from '../lib/utils'

/**
 * Offline durumu ve queue bilgilerini gösteren indicator component
 */

export const OfflineIndicator: React.FC = () => {
  const { 
    isOnline, 
    queueLength, 
    showIndicator, 
    indicatorText, 
    indicatorColor 
  } = useOfflineIndicator()

  if (!showIndicator) return null

  const getIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4" />
    }
    if (queueLength > 0) {
      return <Clock className="w-4 h-4" />
    }
    return <Wifi className="w-4 h-4" />
  }

  const getColorClasses = () => {
    switch (indicatorColor) {
      case 'red':
        return 'bg-red-500 text-white border-red-600'
      case 'orange':
        return 'bg-orange-500 text-white border-orange-600'
      case 'green':
        return 'bg-green-500 text-white border-green-600'
      default:
        return 'bg-gray-500 text-white border-gray-600'
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border shadow-lg transition-all duration-300',
          getColorClasses(),
          'animate-in slide-in-from-bottom-2'
        )}
      >
        {getIcon()}
        <span className="text-sm font-medium">{indicatorText}</span>
        
        {queueLength > 0 && (
          <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-white/20 rounded text-xs">
            <Clock className="w-3 h-3" />
            <span>{queueLength}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Compact offline indicator for header/navbar
 */
export const CompactOfflineIndicator: React.FC = () => {
  const { isOnline, queueLength } = useOfflineIndicator()

  if (isOnline && queueLength === 0) return null

  return (
    <div className="flex items-center gap-1">
      {!isOnline ? (
        <div className="flex items-center gap-1 text-red-500">
          <WifiOff className="w-4 h-4" />
          <span className="text-xs font-medium">Offline</span>
        </div>
      ) : queueLength > 0 ? (
        <div className="flex items-center gap-1 text-orange-500">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium">{queueLength}</span>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Detailed offline status component for settings/debug
 */
export const OfflineStatus: React.FC = () => {
  const { 
    isOnline, 
    wasOffline, 
    queueLength 
  } = useOfflineIndicator()

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-3">Bağlantı Durumu</h3>
      
      <div className="space-y-3">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">İnternet Bağlantısı:</span>
          <div className={cn(
            'flex items-center gap-2 px-2 py-1 rounded text-sm font-medium',
            isOnline 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          )}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isOnline ? 'Bağlı' : 'Bağlantı Yok'}
          </div>
        </div>

        {/* Queue Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Bekleyen İşlemler:</span>
          <div className={cn(
            'flex items-center gap-2 px-2 py-1 rounded text-sm font-medium',
            queueLength > 0
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          )}>
            {queueLength > 0 ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {queueLength > 0 ? `${queueLength} işlem` : 'Tümü tamamlandı'}
          </div>
        </div>

        {/* Previous Offline Status */}
        {wasOffline && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Son Durum:</span>
            <div className="flex items-center gap-2 px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <CheckCircle className="w-4 h-4" />
              Bağlantı Yeniden Kuruldu
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Bilgi:</strong> İnternet bağlantısı kesildiğinde işlemleriniz otomatik olarak kuyruğa alınır 
          ve bağlantı yeniden kurulduğunda otomatik olarak tamamlanır.
        </p>
      </div>
    </div>
  )
}

export default OfflineIndicator
