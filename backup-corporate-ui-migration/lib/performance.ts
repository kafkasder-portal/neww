// Performance monitoring utilities
interface PerformanceMetrics {
  loadTime?: number
  renderTime?: number
  memoryUsage?: number
  bundleSize?: number
  memoryLimit?: number
  usagePercentage?: number
}

interface PerformanceConfig {
  enableMonitoring: boolean
  logToConsole: boolean
  sendToAnalytics: boolean
  threshold: {
    loadTime: number
    renderTime: number
    memoryUsage: number
  }
}

class PerformanceMonitor {
  private config: PerformanceConfig
  private metrics: Map<string, PerformanceMetrics> = new Map()

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableMonitoring: true,
      logToConsole: process.env.NODE_ENV === 'development',
      sendToAnalytics: false,
      threshold: {
        loadTime: 3000,
        renderTime: 1000,
        memoryUsage: 50 * 1024 * 1024 // 50MB
      },
      ...config
    }
  }

  // Measure component render time
  measureRenderTime(componentName: string, renderFn: () => void): void {
    if (!this.config.enableMonitoring) return

    const startTime = performance.now()
    renderFn()
    const endTime = performance.now()
    const renderTime = endTime - startTime

    this.recordMetric(componentName, { renderTime })

    if (renderTime > this.config.threshold.renderTime) {
      this.warnSlowRender(componentName, renderTime)
    }
  }

  // Measure async operations
  async measureAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    if (!this.config.enableMonitoring) return operation()

    const startTime = performance.now()
    try {
      const result = await operation()
      const endTime = performance.now()
      const loadTime = endTime - startTime

      this.recordMetric(operationName, { loadTime })

      if (loadTime > this.config.threshold.loadTime) {
        this.warnSlowOperation(operationName, loadTime)
      }

      return result
    } catch (error) {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      this.recordMetric(operationName, { loadTime })
      throw error
    }
  }

  // Measure memory usage
  measureMemoryUsage(): number | undefined {
    if (!this.config.enableMonitoring) return undefined
    
    // Check if performance.memory is available (Chrome only)
    const memory = (performance as any).memory
    if (!memory) return undefined

    const memoryUsage = memory.usedJSHeapSize
    this.recordMetric('memory', { memoryUsage })

    if (memoryUsage > this.config.threshold.memoryUsage) {
      this.warnHighMemoryUsage(memoryUsage)
    }

    return memoryUsage
  }

  // Record performance metrics
  public recordMetric(name: string, metrics: Partial<PerformanceMetrics>): void {
    const existing = this.metrics.get(name) || {}
    this.metrics.set(name, { ...existing, ...metrics })

    if (this.config.logToConsole) {
      console.log(`Performance metric [${name}]:`, metrics)
    }
  }

  // Warn about slow renders
  private warnSlowRender(componentName: string, renderTime: number): void {
    const message = `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
    if (this.config.logToConsole) {
      console.warn(message)
    }
    this.sendToAnalytics('slow_render', { componentName, renderTime })
  }

  // Warn about slow operations
  private warnSlowOperation(operationName: string, loadTime: number): void {
    const message = `Slow operation detected: ${operationName} took ${loadTime.toFixed(2)}ms`
    if (this.config.logToConsole) {
      console.warn(message)
    }
    this.sendToAnalytics('slow_operation', { operationName, loadTime })
  }

  // Warn about high memory usage
  private warnHighMemoryUsage(memoryUsage: number): void {
    const message = `High memory usage detected: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`
    if (this.config.logToConsole) {
      console.warn(message)
    }
    this.sendToAnalytics('high_memory', { memoryUsage })
  }

  // Send metrics to analytics
  private sendToAnalytics(_event: string, _data: Record<string, any>): void {
    if (!this.config.sendToAnalytics) return

    // Implementation for sending to analytics service
    // Example: Google Analytics, Sentry, etc.
    try {
      // window.gtag?.('event', event, data)
      // Sentry.captureMessage(event, { extra: data })
    } catch (error) {
      if (this.config.logToConsole) {
        console.error('Failed to send performance data to analytics:', error)
      }
    }
  }

  // Get all metrics
  getMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics)
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear()
  }

  // Get performance report
  getReport(): Record<string, any> {
    const report: Record<string, any> = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      summary: this.generateSummary()
    }

    return report
  }

  // Generate performance summary
  private generateSummary(): Record<string, any> {
    const metrics = Array.from(this.metrics.values())
    
    if (metrics.length === 0) return {}

    const loadTimes = metrics.map(m => m.loadTime).filter((val): val is number => val !== undefined)
    const renderTimes = metrics.map(m => m.renderTime).filter((val): val is number => val !== undefined)
    const memoryUsages = metrics.map(m => m.memoryUsage).filter((val): val is number => val !== undefined)

    return {
      averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
      averageRenderTime: renderTimes.length > 0 ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length : 0,
      maxMemoryUsage: memoryUsages.length > 0 ? Math.max(...memoryUsages) : 0,
      totalMetrics: metrics.length
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// React performance hook
export function usePerformanceMonitoring(componentName: string) {
  const measureRender = (renderFn: () => void) => {
    performanceMonitor.measureRenderTime(componentName, renderFn)
  }

  const measureAsync = <T>(operationName: string, operation: () => Promise<T>) => {
    return performanceMonitor.measureAsyncOperation(operationName, operation)
  }

  return { measureRender, measureAsync }
}

// Bundle size monitoring
export function measureBundleSize(): void {
  if (process.env.NODE_ENV === 'development') return

  const scriptElements = document.querySelectorAll('script[src]')
  let totalSize = 0

  scriptElements.forEach(script => {
    const src = script.getAttribute('src')
    if (src && src.includes('chunk')) {
      // Estimate bundle size (this is a rough approximation)
      totalSize += 100 * 1024 // Assume 100KB per chunk
    }
  })

  performanceMonitor.recordMetric('bundle', { bundleSize: totalSize })
}

// Memory leak detection
export function detectMemoryLeaks(): void {
  const memory = (performance as any).memory
  if (!memory) return

  const memoryUsage = memory.usedJSHeapSize
  const memoryLimit = memory.jsHeapSizeLimit
  const usagePercentage = (memoryUsage / memoryLimit) * 100

  if (usagePercentage > 80) {
    console.warn(`High memory usage detected: ${usagePercentage.toFixed(2)}%`)
    performanceMonitor.recordMetric('memory_leak', { 
      memoryUsage, 
      memoryLimit, 
      usagePercentage 
    })
  }
}

// Performance optimization utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Export the monitor for direct use
export default performanceMonitor
