import { useEffect, useRef, useCallback, MutableRefObject } from 'react'

// Memory leak prevention utilities
export interface CleanupFunction {
  (): void
}

export interface MemoryLeakDetector {
  addCleanup: (cleanup: CleanupFunction) => void
  removeCleanup: (cleanup: CleanupFunction) => void
  cleanup: () => void
  getActiveCleanups: () => number
}

/**
 * Hook for preventing memory leaks by managing cleanup functions
 */
export function useMemoryLeak(): MemoryLeakDetector {
  const cleanupsRef = useRef<Set<CleanupFunction>>(new Set())
  const isUnmountedRef = useRef(false)

  const addCleanup = useCallback((cleanup: CleanupFunction) => {
    if (!isUnmountedRef.current) {
      cleanupsRef.current.add(cleanup)
    }
  }, [])

  const removeCleanup = useCallback((cleanup: CleanupFunction) => {
    cleanupsRef.current.delete(cleanup)
  }, [])

  const cleanup = useCallback(() => {
    cleanupsRef.current.forEach(cleanupFn => {
      try {
        cleanupFn()
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    })
    cleanupsRef.current.clear()
  }, [])

  const getActiveCleanups = useCallback(() => {
    return cleanupsRef.current.size
  }, [])

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
      cleanup()
    }
  }, [])

  return {
    addCleanup,
    removeCleanup,
    cleanup,
    getActiveCleanups
  }
}

/**
 * Hook for safe event listeners that auto-cleanup
 */
export function useEventListener<T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  element?: Element | Window | null,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler)
  const { addCleanup } = useMemoryLeak()

  // Update ref when handler changes
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement = element ?? window
    if (!targetElement?.addEventListener) return

    const eventListener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[T])
    }

    targetElement.addEventListener(eventType, eventListener, options)

    const cleanup = () => {
      targetElement.removeEventListener(eventType, eventListener, options)
    }

    addCleanup(cleanup)

    return cleanup
  }, [eventType, element, options, addCleanup])
}

/**
 * Hook for safe intervals that auto-cleanup
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  immediate = false
) {
  const savedCallback = useRef(callback)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { addCleanup } = useMemoryLeak()

  // Update ref when callback changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const tick = () => savedCallback.current()

    if (immediate) {
      tick()
    }

    intervalRef.current = setInterval(tick, delay)

    const cleanup = () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    addCleanup(cleanup)

    return cleanup
  }, [delay, immediate, addCleanup])

  const clearInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return { clearInterval }
}

/**
 * Hook for safe timeouts that auto-cleanup
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
) {
  const savedCallback = useRef(callback)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { addCleanup } = useMemoryLeak()

  // Update ref when callback changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    timeoutRef.current = setTimeout(() => {
      savedCallback.current()
    }, delay)

    const cleanup = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    addCleanup(cleanup)

    return cleanup
  }, [delay, addCleanup])

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { clearTimeout }
}

/**
 * Hook for safe async operations that auto-cancel
 */
export function useAsyncOperation() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const { addCleanup } = useMemoryLeak()

  const executeAsync = useCallback(async <T>(
    asyncFn: (signal: AbortSignal) => Promise<T>
  ): Promise<T | null> => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    try {
      const result = await asyncFn(signal)
      return result
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null // Operation was cancelled
      }
      throw error
    }
  }, [])

  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const cleanup = () => {
      cancelOperation()
    }

    addCleanup(cleanup)

    return cleanup
  }, [addCleanup, cancelOperation])

  return { executeAsync, cancelOperation }
}

/**
 * Hook for safe DOM observers that auto-cleanup
 */
export function useObserver<T extends Element>(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<Set<T>>(new Set())
  const { addCleanup } = useMemoryLeak()

  const observe = useCallback((element: T) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(callback, options)
      
      const cleanup = () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
          observerRef.current = null
        }
        elementsRef.current.clear()
      }
      
      addCleanup(cleanup)
    }

    observerRef.current.observe(element)
    elementsRef.current.add(element)
  }, [callback, options, addCleanup])

  const unobserve = useCallback((element: T) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element)
      elementsRef.current.delete(element)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      elementsRef.current.clear()
    }
  }, [])

  return { observe, unobserve, disconnect }
}

/**
 * Hook for safe WebSocket connections that auto-cleanup
 */
export function useWebSocket(url: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const { addCleanup } = useMemoryLeak()

  const connect = useCallback(() => {
    if (!url) return

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    wsRef.current = new WebSocket(url)

    const cleanup = () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }

    addCleanup(cleanup)

    return wsRef.current
  }, [url, addCleanup])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data)
    }
  }, [])

  return { connect, disconnect, send, ws: wsRef.current }
}

/**
 * Hook for monitoring memory usage
 */
export function useMemoryMonitor(interval = 5000) {
  const memoryInfoRef = useRef<any>(null)
  const { addCleanup } = useMemoryLeak()

  useEffect(() => {
    if (!('memory' in performance)) {
      console.warn('Memory API not supported in this browser')
      return
    }

    const updateMemoryInfo = () => {
      memoryInfoRef.current = (performance as any).memory
    }

    updateMemoryInfo()
    const intervalId = setInterval(updateMemoryInfo, interval)

    const cleanup = () => {
      clearInterval(intervalId)
    }

    addCleanup(cleanup)

    return cleanup
  }, [interval, addCleanup])

  const getMemoryInfo = useCallback(() => {
    return memoryInfoRef.current
  }, [])

  const logMemoryUsage = useCallback(() => {
    const memory = memoryInfoRef.current
    if (memory) {
      console.debug('Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      })
    }
  }, [])

  return { getMemoryInfo, logMemoryUsage }
}

/**
 * Hook for detecting memory leaks in development
 */
export function useMemoryLeakDetector(componentName: string) {
  const mountTimeRef = useRef<number>(Date.now())
  const { addCleanup } = useMemoryLeak()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkMemoryLeak = () => {
        const lifetime = Date.now() - mountTimeRef.current
        if (lifetime > 300000) { // 5 minutes
          console.warn(`Potential memory leak detected in ${componentName}. Component has been mounted for ${lifetime}ms`)
        }
      }

      const intervalId = setInterval(checkMemoryLeak, 60000) // Check every minute

      const cleanup = () => {
        clearInterval(intervalId)
      }

      addCleanup(cleanup)

      return cleanup
    }
  }, [componentName, addCleanup])
}

export default useMemoryLeak