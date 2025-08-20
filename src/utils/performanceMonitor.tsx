import { Profiler, ProfilerOnRenderCallback } from 'react'

// Performance metrics interface
export interface PerformanceMetrics {
  componentName: string
  renderTime: number
  renderCount: number
  averageRenderTime: number
  slowRenders: number
  memoryUsage?: {
    used: number
    total: number
    limit: number
  }
  timestamp: number
}

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER: 16, // 16ms (60fps)
  VERY_SLOW_RENDER: 33, // 33ms (30fps)
  EXCESSIVE_RENDERS: 10, // renders per second
  MEMORY_WARNING: 0.7, // 70% of heap limit
  MEMORY_CRITICAL: 0.9 // 90% of heap limit
} as const

// Performance monitor class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private renderHistory: Map<string, number[]> = new Map()
  private isEnabled = process.env.NODE_ENV === 'development'
  private observers: ((metrics: PerformanceMetrics) => void)[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  isMonitoringEnabled(): boolean {
    return this.isEnabled
  }

  // Subscribe to performance updates
  subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.observers.push(callback)
    return () => {
      const index = this.observers.indexOf(callback)
      if (index > -1) {
        this.observers.splice(index, 1)
      }
    }
  }

  // Notify observers
  private notifyObservers(metrics: PerformanceMetrics) {
    this.observers.forEach(callback => {
      try {
        callback(metrics)
      } catch (error) {
        console.error('Error in performance observer:', error)
      }
    })
  }

  // Record render performance
  recordRender(
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) {
    if (!this.isEnabled) return

    const existing = this.metrics.get(id) || {
      componentName: id,
      renderTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      slowRenders: 0,
      timestamp: Date.now()
    }

    // Update render history
    const history = this.renderHistory.get(id) || []
    history.push(actualDuration)
    
    // Keep only last 100 renders
    if (history.length > 100) {
      history.shift()
    }
    this.renderHistory.set(id, history)

    // Calculate metrics
    const renderCount = existing.renderCount + 1
    const totalTime = existing.renderTime + actualDuration
    const averageRenderTime = totalTime / renderCount
    const slowRenders = existing.slowRenders + (actualDuration > PERFORMANCE_THRESHOLDS.SLOW_RENDER ? 1 : 0)

    // Get memory usage
    const memoryUsage = this.getMemoryUsage()

    const metrics: PerformanceMetrics = {
      componentName: id,
      renderTime: totalTime,
      renderCount,
      averageRenderTime,
      slowRenders,
      memoryUsage,
      timestamp: Date.now()
    }

    this.metrics.set(id, metrics)

    // Check for performance issues
    this.checkPerformanceIssues(metrics, actualDuration, phase)

    // Notify observers
    this.notifyObservers(metrics)
  }

  // Get memory usage if available
  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return undefined
  }

  // Check for performance issues
  private checkPerformanceIssues(
    metrics: PerformanceMetrics,
    renderTime: number,
    phase: 'mount' | 'update'
  ) {
    const { componentName, renderCount, slowRenders, memoryUsage } = metrics

    // Check for slow renders
    if (renderTime > PERFORMANCE_THRESHOLDS.VERY_SLOW_RENDER) {
      console.warn(
        `[Performance] Very slow ${phase} render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
      )
    } else if (renderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER) {
      console.warn(
        `[Performance] Slow ${phase} render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
      )
    }

    // Check for excessive re-renders
    const slowRenderRatio = slowRenders / renderCount
    if (slowRenderRatio > 0.5 && renderCount > 10) {
      console.warn(
        `[Performance] ${componentName} has ${(slowRenderRatio * 100).toFixed(1)}% slow renders (${slowRenders}/${renderCount})`
      )
    }

    // Check for excessive render frequency
    const history = this.renderHistory.get(componentName) || []
    if (history.length >= 10) {
      const recentRenders = history.slice(-10)
      const timeSpan = 1000 // 1 second
      const rendersPerSecond = recentRenders.length / (timeSpan / 1000)
      
      if (rendersPerSecond > PERFORMANCE_THRESHOLDS.EXCESSIVE_RENDERS) {
        console.warn(
          `[Performance] Excessive render frequency in ${componentName}: ${rendersPerSecond.toFixed(1)} renders/second`
        )
      }
    }

    // Check memory usage
    if (memoryUsage) {
      const memoryRatio = memoryUsage.used / memoryUsage.limit
      
      if (memoryRatio > PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL) {
        console.error(
          `[Performance] Critical memory usage: ${(memoryRatio * 100).toFixed(1)}% (${(memoryUsage.used / 1024 / 1024).toFixed(2)}MB)`
        )
      } else if (memoryRatio > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
        console.warn(
          `[Performance] High memory usage: ${(memoryRatio * 100).toFixed(1)}% (${(memoryUsage.used / 1024 / 1024).toFixed(2)}MB)`
        )
      }
    }
  }

  // Get metrics for a specific component
  getMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.metrics.get(componentName)
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  // Get performance summary
  getSummary() {
    const allMetrics = this.getAllMetrics()
    
    if (allMetrics.length === 0) {
      return {
        totalComponents: 0,
        totalRenders: 0,
        averageRenderTime: 0,
        slowComponents: [],
        memoryUsage: this.getMemoryUsage()
      }
    }

    const totalRenders = allMetrics.reduce((sum, m) => sum + m.renderCount, 0)
    const totalRenderTime = allMetrics.reduce((sum, m) => sum + m.renderTime, 0)
    const averageRenderTime = totalRenderTime / totalRenders

    const slowComponents = allMetrics
      .filter(m => m.averageRenderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER)
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
      .slice(0, 10)

    return {
      totalComponents: allMetrics.length,
      totalRenders,
      averageRenderTime,
      slowComponents,
      memoryUsage: this.getMemoryUsage()
    }
  }

  // Clear all metrics
  clear() {
    this.metrics.clear()
    this.renderHistory.clear()
  }

  // Export metrics as JSON
  exportMetrics() {
    return {
      timestamp: Date.now(),
      metrics: this.getAllMetrics(),
      summary: this.getSummary()
    }
  }

  // Start performance monitoring for the entire app
  startGlobalMonitoring() {
    if (!this.isEnabled) return

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Long task threshold
              console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`)
            }
          })
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        console.warn('Long task monitoring not supported:', error)
      }
    }

    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0]
        }
    }

    }
}

// Create profiler callback
export const createProfilerCallback = (componentName: string): ProfilerOnRenderCallback => {
  const monitor = PerformanceMonitor.getInstance()
  
  return (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    monitor.recordRender(componentName, phase, actualDuration, baseDuration, startTime, commitTime)
  }
}

// HOC for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const callback = createProfilerCallback(name)

  const PerformanceMonitoredComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <Profiler id={name} onRender={callback}>
        <WrappedComponent {...props} ref={ref} />
      </Profiler>
    )
  })

  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${name})`

  return PerformanceMonitoredComponent
}

// Hook for manual performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    getMetrics: () => monitor.getMetrics(componentName),
    getSummary: () => monitor.getSummary(),
    exportMetrics: () => monitor.exportMetrics()
  }
}

// Initialize global monitoring
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const monitor = PerformanceMonitor.getInstance()
  monitor.startGlobalMonitoring()
  
  // Expose to window for debugging
  ;(window as any).performanceMonitor = monitor
}

export default PerformanceMonitor