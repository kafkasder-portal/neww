import React, { ComponentType, useEffect, useRef, forwardRef } from 'react'
import { useMemoryLeak, useMemoryLeakDetector } from '@hooks/useMemoryLeak'

// Props for memory leak prevention configuration
export interface MemoryLeakPreventionConfig {
  enableDetection?: boolean
  detectionInterval?: number
  maxLifetime?: number
  logWarnings?: boolean
}

// Default configuration
const defaultConfig: MemoryLeakPreventionConfig = {
  enableDetection: process.env.NODE_ENV === 'development',
  detectionInterval: 60000, // 1 minute
  maxLifetime: 300000, // 5 minutes
  logWarnings: true
}

/**
 * Higher Order Component that wraps components with memory leak prevention
 */
export function withMemoryLeakPrevention<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: MemoryLeakPreventionConfig = {}
) {
  const finalConfig = { ...defaultConfig, ...config }
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const MemoryLeakPreventedComponent = forwardRef<any, P>((props, ref) => {
    const mountTimeRef = useRef<number>(Date.now())
    const renderCountRef = useRef<number>(0)
    const memoryLeak = useMemoryLeak()
    
    // Use memory leak detector if enabled
    if (finalConfig.enableDetection) {
      useMemoryLeakDetector(componentName)
    }

    // Track render count
    renderCountRef.current += 1

    // Monitor component lifecycle
    useEffect(() => {
      const startTime = Date.now()
      
      if (finalConfig.logWarnings && process.env.NODE_ENV === 'development') {
        console.log(`[MemoryLeak] ${componentName} mounted at ${new Date(startTime).toISOString()}`)
      }

      // Set up periodic memory checks
      let intervalId: NodeJS.Timeout | null = null
      
      if (finalConfig.enableDetection) {
        intervalId = setInterval(() => {
          const lifetime = Date.now() - mountTimeRef.current
          const renderCount = renderCountRef.current
          
          if (lifetime > (finalConfig.maxLifetime || 300000)) {
            if (finalConfig.logWarnings) {
              console.warn(
                `[MemoryLeak] ${componentName} has been mounted for ${lifetime}ms with ${renderCount} renders. ` +
                'This might indicate a memory leak.'
              )
            }
          }
          
          // Log memory usage if available
          if ('memory' in performance) {
            const memory = (performance as any).memory
            if (memory && finalConfig.logWarnings) {
              const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
              const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
              
              console.log(
                `[MemoryLeak] ${componentName} - Memory: ${usedMB}MB / ${totalMB}MB, ` +
                `Renders: ${renderCount}, Lifetime: ${(lifetime / 1000).toFixed(1)}s`
              )
            }
          }
        }, finalConfig.detectionInterval || 60000)
        
        memoryLeak.addCleanup(() => {
          if (intervalId) {
            clearInterval(intervalId)
          }
        })
      }

      return () => {
        const endTime = Date.now()
        const lifetime = endTime - startTime
        
        if (finalConfig.logWarnings && process.env.NODE_ENV === 'development') {
          console.log(
            `[MemoryLeak] ${componentName} unmounted after ${lifetime}ms with ${renderCountRef.current} renders`
          )
        }
        
        if (intervalId) {
          clearInterval(intervalId)
        }
        
        // Force cleanup
        memoryLeak.cleanup()
      }
    }, [])

    // Monitor excessive re-renders
    useEffect(() => {
      if (renderCountRef.current > 100 && finalConfig.logWarnings) {
        console.warn(
          `[MemoryLeak] ${componentName} has rendered ${renderCountRef.current} times. ` +
          'This might indicate unnecessary re-renders.'
        )
      }
    })

    return <WrappedComponent {...(props as P)} ref={ref} />
  })

  MemoryLeakPreventedComponent.displayName = `withMemoryLeakPrevention(${componentName})`

  return MemoryLeakPreventedComponent
}

/**
 * Hook for manual memory leak prevention in functional components
 */
export function useComponentMemoryMonitor(componentName: string, config: MemoryLeakPreventionConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config }
  const mountTimeRef = useRef<number>(Date.now())
  const renderCountRef = useRef<number>(0)
  const memoryLeak = useMemoryLeak()
  
  renderCountRef.current += 1

  useEffect(() => {
    if (!finalConfig.enableDetection) return

    const intervalId = setInterval(() => {
      const lifetime = Date.now() - mountTimeRef.current
      const renderCount = renderCountRef.current
      
      if (lifetime > (finalConfig.maxLifetime || 300000) && finalConfig.logWarnings) {
        console.warn(
          `[MemoryLeak] ${componentName} lifetime: ${lifetime}ms, renders: ${renderCount}`
        )
      }
    }, finalConfig.detectionInterval || 60000)

    memoryLeak.addCleanup(() => {
      clearInterval(intervalId)
    })

    return () => {
      clearInterval(intervalId)
    }
  }, [componentName, finalConfig, memoryLeak])

  return {
    renderCount: renderCountRef.current,
    lifetime: Date.now() - mountTimeRef.current,
    cleanup: memoryLeak.cleanup
  }
}

/**
 * Utility function to detect potential memory leaks in the app
 */
export class MemoryLeakDetector {
  private static instance: MemoryLeakDetector
  private components: Map<string, { count: number; lastSeen: number }> = new Map()
  private intervalId: NodeJS.Timeout | null = null
  private isMonitoring = false

  static getInstance(): MemoryLeakDetector {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector()
    }
    return MemoryLeakDetector.instance
  }

  startMonitoring(interval = 30000) {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.intervalId = setInterval(() => {
      this.checkForLeaks()
    }, interval)

    console.log('[MemoryLeakDetector] Started monitoring')
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isMonitoring = false
    console.log('[MemoryLeakDetector] Stopped monitoring')
  }

  registerComponent(name: string) {
    const existing = this.components.get(name) || { count: 0, lastSeen: 0 }
    this.components.set(name, {
      count: existing.count + 1,
      lastSeen: Date.now()
    })
  }

  unregisterComponent(name: string) {
    const existing = this.components.get(name)
    if (existing && existing.count > 0) {
      this.components.set(name, {
        count: existing.count - 1,
        lastSeen: Date.now()
      })
    }
  }

  private checkForLeaks() {
    const now = Date.now()
    const suspiciousComponents: string[] = []

    this.components.forEach((data, name) => {
      // Check for components that have been around too long
      if (data.count > 0 && now - data.lastSeen > 300000) { // 5 minutes
        suspiciousComponents.push(`${name} (count: ${data.count}, age: ${((now - data.lastSeen) / 1000).toFixed(1)}s)`)
      }
      
      // Check for too many instances
      if (data.count > 50) {
        suspiciousComponents.push(`${name} (excessive instances: ${data.count})`)
      }
    })

    if (suspiciousComponents.length > 0) {
      console.warn('[MemoryLeakDetector] Suspicious components detected:', suspiciousComponents)
    }

    // Log memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      if (memory) {
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
        const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
        
        console.log(`[MemoryLeakDetector] Memory: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`)
        
        // Warn if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn('[MemoryLeakDetector] High memory usage detected!')
        }
      }
    }
  }

  getStats() {
    return {
      totalComponents: this.components.size,
      activeInstances: Array.from(this.components.values()).reduce((sum, data) => sum + data.count, 0),
      components: Object.fromEntries(this.components)
    }
  }

  reset() {
    this.components.clear()
    console.log('[MemoryLeakDetector] Stats reset')
  }
}

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  const detector = MemoryLeakDetector.getInstance()
  detector.startMonitoring()
  
  // Expose to window for debugging
  if (typeof window !== 'undefined') {
    (window as any).memoryLeakDetector = detector
  }
}

export default withMemoryLeakPrevention