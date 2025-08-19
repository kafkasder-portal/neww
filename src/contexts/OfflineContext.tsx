import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useOfflineQueue, useBackgroundSync, useOfflineCache } from '../hooks/useOfflineSupport'
import { toast } from 'sonner'

interface OfflineContextType {
  isOnline: boolean
  queueSize: number
  isProcessing: boolean
  retryQueue: () => void
  clearQueue: () => void
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const useOfflineContext = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider')
  }
  return context
}

interface OfflineProviderProps {
  children: ReactNode
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const {
    queue,
    isProcessing,
    // addToQueue,
    processQueue,
    // clearQueue,
    // retryQueue
  } = useOfflineQueue()
  
  const { isOnline } = useBackgroundSync()
  const { saveCache } = useOfflineCache()
  
  // Mock functions for missing methods
  const retryQueue = () => {
    processQueue()
  }
  
  const clearQueue = () => {
    // Implementation would clear the queue
    console.log('Clear queue called')
  }

  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue()
      toast.success('Çevrimiçi oldunuz! Bekleyen işlemler işleniyor...')
    }
  }, [isOnline, queue.length, processQueue])

  // Save cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveCache()
    }, 30000) // Save every 30 seconds

    return () => clearInterval(interval)
  }, [saveCache])

  // Show offline notification
  useEffect(() => {
    if (!isOnline) {
      toast.warning('İnternet bağlantısı kesildi. Çevrimdışı modda çalışıyorsunuz.')
    }
  }, [isOnline])

  const value: OfflineContextType = {
    isOnline,
    queueSize: queue.length,
    isProcessing,
    retryQueue,
    clearQueue
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}