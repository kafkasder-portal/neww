import React, { ComponentType, useEffect, useRef, forwardRef } from 'react'
import { useMemoryLeak } from '@/hooks/useMemoryLeak'

export interface MemoryLeakPreventionConfig {
  enableDetection?: boolean
  detectionInterval?: number
  maxLifetime?: number
  logWarnings?: boolean
}

const defaultConfig: MemoryLeakPreventionConfig = {
  enableDetection: process.env.NODE_ENV === 'development',
  detectionInterval: 60000, // 1 minute
  maxLifetime: 300000, // 5 minutes
  logWarnings: true
}

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
    
    if (finalConfig.enableDetection) {
      MemoryLeakDetector.getInstance().registerComponent(componentName)
    }

    renderCountRef.current += 1

    useEffect(() => {
      const startTime = Date.now()
      
      if (finalConfig.logWarnings && process.env.NODE_ENV === 'development') {
        console.debug('Component mounted:', componentName)
      }

      let intervalId: NodeJS.Timeout | null = null
      
      if (finalConfig.enableDetection) {
        intervalId = setInterval(() => {
          const lifetime = Date.now() - mountTimeRef.current
          const renderCount = renderCountRef.current
          
          if (lifetime > (finalConfig.maxLifetime || 300000)) {
            if (finalConfig.logWarnings) {
              console.warn(
                'Component has been mounted for ' + lifetime + 'ms with ' + renderCount + ' renders. ' +
                'This might indicate a memory leak.'
              )
            }
          }
        }, finalConfig.detectionInterval || 60000)
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
        }
        
        if (finalConfig.enableDetection) {
          MemoryLeakDetector.getInstance().unregisterComponent(componentName)
        }
      }
    }, [])

    return <WrappedComponent {...(props as P)} ref={ref} />
  })

  MemoryLeakPreventedComponent.displayName = 'withMemoryLeakPrevention(' + componentName + ')'

  return MemoryLeakPreventedComponent
}

export function useComponentMemoryMonitor(componentName: string, config: MemoryLeakPreventionConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config }
  const mountTimeRef = useRef<number>(Date.now())
  const renderCountRef = useRef<number>(0)
  const memoryLeak = useMemoryLeak()

  renderCountRef.current += 1

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    if (finalConfig.enableDetection) {
      intervalId = setInterval(() => {
        const lifetime = Date.now() - mountTimeRef.current
        const renderCount = renderCountRef.current
        
        if (lifetime > (finalConfig.maxLifetime || 300000)) {
          if (finalConfig.logWarnings) {
            console.warn(
              'Component ' + componentName + ' has been active for ' + lifetime + 'ms with ' + renderCount + ' renders'
            )
          }
        }
      }, finalConfig.detectionInterval || 60000)
    }

    memoryLeak.addCleanup(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [componentName, finalConfig, memoryLeak])

  return {
    renderCount: renderCountRef.current,
    lifetime: Date.now() - mountTimeRef.current,
    cleanup: memoryLeak.cleanup
  }
}

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
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isMonitoring = false
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
      if (data.count > 0 && now - data.lastSeen > 300000) {
        suspiciousComponents.push(name + ' (count: ' + data.count + ', age: ' + ((now - data.lastSeen) / 1000).toFixed(1) + 's)')
      }
      
      if (data.count > 50) {
        suspiciousComponents.push(name + ' (excessive instances: ' + data.count + ')')
      }
    })

    if (suspiciousComponents.length > 0) {
      console.warn('[MemoryLeakDetector] Suspicious components detected:', suspiciousComponents)
    }

    if ('memory' in performance) {
      const memory = (performance as any).memory
      if (memory) {
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
        const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)

        console.debug('[MemoryLeakDetector] Memory:', {
          used: usedMB + 'MB',
          total: totalMB + 'MB',
          limit: limitMB + 'MB'
        })
        
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
  }
}

if (process.env.NODE_ENV === 'development') {
  const detector = MemoryLeakDetector.getInstance()
  detector.startMonitoring()

  if (typeof window !== 'undefined') {
    (window as any).memoryLeakDetector = detector
  }
}

export default withMemoryLeakPrevention