import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Offline support hook'ları
 */

// Online/offline durumunu takip et
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        toast.success('İnternet bağlantısı yeniden kuruldu')
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      toast.warning('İnternet bağlantısı kesildi. Offline modda çalışıyorsunuz.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline])

  return { isOnline, wasOffline }
}

// Offline queue yönetimi
interface QueuedMutation {
  id: string
  mutationFn: () => Promise<unknown>
  onSuccess?: (data: unknown) => void
  onError?: (error: unknown) => void
  retryCount: number
  timestamp: number
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<QueuedMutation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { isOnline } = useOnlineStatus()
  // const queryClient = useQueryClient()

  // Queue'ya mutation ekle
  const addToQueue = (mutation: Omit<QueuedMutation, 'id' | 'retryCount' | 'timestamp'>) => {
    const queuedMutation: QueuedMutation = {
      ...mutation,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      retryCount: 0,
      timestamp: Date.now(),
    }

    setQueue(prev => [...prev, queuedMutation])
    
    // Local storage'a kaydet
    const existingQueue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    localStorage.setItem('offline-queue', JSON.stringify([...existingQueue, queuedMutation]))
    
    toast.info('İşlem offline queue\'ya eklendi')
  }

  // Queue'dan mutation kaldır
  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
    
    const existingQueue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    const updatedQueue = existingQueue.filter((item: QueuedMutation) => item.id !== id)
    localStorage.setItem('offline-queue', JSON.stringify(updatedQueue))
  }

  // Queue'yu işle
  const processQueue = async () => {
    if (!isOnline || isProcessing || queue.length === 0) return

    setIsProcessing(true)
    
    for (const mutation of queue) {
      try {
        const result = await mutation.mutationFn()
        mutation.onSuccess?.(result)
        removeFromQueue(mutation.id)
        toast.success('Offline işlem başarıyla tamamlandı')
      } catch (error) {
        mutation.retryCount++
        
        if (mutation.retryCount >= 3) {
          mutation.onError?.(error)
          removeFromQueue(mutation.id)
          toast.error('Offline işlem başarısız oldu')
        } else {
          toast.warning(`Offline işlem yeniden denenecek (${mutation.retryCount}/3)`)
        }
      }
    }
    
    setIsProcessing(false)
  }

  // Online olduğunda queue'yu işle
  useEffect(() => {
    if (isOnline) {
      processQueue()
    }
  }, [isOnline])

  // Component mount olduğunda local storage'dan queue'yu yükle
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    setQueue(savedQueue)
  }, [])

  return {
    queue,
    addToQueue,
    removeFromQueue,
    processQueue,
    isProcessing,
    queueLength: queue.length,
  }
}

// Offline cache yönetimi
export const useOfflineCache = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useOnlineStatus()

  // Cache'i local storage'a kaydet
  const saveCache = () => {
    try {
      const cache = queryClient.getQueryCache().getAll()
      const serializedCache = cache.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
        error: query.state.error,
      }))
      
      localStorage.setItem('react-query-cache', JSON.stringify(serializedCache))
    } catch (error) {
      console.warn('Cache kaydedilemedi:', error)
    }
  }

  // Cache'i local storage'dan yükle
  const loadCache = () => {
    try {
      const savedCache = localStorage.getItem('react-query-cache')
      if (savedCache) {
        const cache = JSON.parse(savedCache)
        
        cache.forEach((item: { queryKey: unknown; data: unknown }) => {
          queryClient.setQueryData(item.queryKey as readonly unknown[], item.data)
        })
      }
    } catch (error) {
      console.warn('Cache yüklenemedi:', error)
    }
  }

  // Cache'i temizle
  const clearCache = () => {
    localStorage.removeItem('react-query-cache')
    queryClient.clear()
  }

  // Offline durumunda cache'i kaydet
  useEffect(() => {
    if (!isOnline) {
      saveCache()
    }
  }, [isOnline])

  return {
    saveCache,
    loadCache,
    clearCache,
    isOnline,
  }
}

// Background sync hook
export const useBackgroundSync = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useOnlineStatus()
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)

  // Background sync işlemi
  const performBackgroundSync = async () => {
    if (!isOnline) return

    try {
      // Kritik verileri yenile
      await queryClient.refetchQueries({
        predicate: (query) => {
          // Sadece stale olan verileri yenile
          return query.isStale()
        },
      })

      setLastSyncTime(Date.now())
      console.log('Background sync tamamlandı')
    } catch (error) {
      console.warn('Background sync hatası:', error)
    }
  }

  // Periyodik background sync
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      performBackgroundSync()
    }, 5 * 60 * 1000) // 5 dakikada bir

    return () => clearInterval(interval)
  }, [isOnline])

  // Sayfa focus olduğunda sync
  useEffect(() => {
    const handleFocus = () => {
      if (isOnline) {
        performBackgroundSync()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isOnline])

  return {
    performBackgroundSync,
    lastSyncTime,
    isOnline,
  }
}

// Offline indicator component hook
export const useOfflineIndicator = () => {
  const { isOnline, wasOffline } = useOnlineStatus()
  const { queueLength } = useOfflineQueue()

  return {
    isOnline,
    wasOffline,
    queueLength,
    showIndicator: !isOnline || queueLength > 0,
    indicatorText: !isOnline 
      ? 'Offline' 
      : queueLength > 0 
      ? `${queueLength} işlem bekliyor` 
      : 'Online',
    indicatorColor: !isOnline 
      ? 'red' 
      : queueLength > 0 
      ? 'orange' 
      : 'green',
  }
}