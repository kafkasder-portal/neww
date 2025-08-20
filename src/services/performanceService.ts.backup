import React from 'react'
import { errorService, ErrorSeverity, ErrorCategory } from './errorService'

/**
 * Performans metrikleri türleri
 */
export interface PerformanceMetrics {
  // Web Vitals
  fcp?: number  // First Contentful Paint
  lcp?: number  // Largest Contentful Paint
  fid?: number  // First Input Delay
  cls?: number  // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  
  // Custom metrikleri
  pageLoadTime?: number
  apiResponseTime?: number
  renderTime?: number
  memoryUsage?: number
  
  // Context
  page: string
  userId?: string
  timestamp: number
  userAgent: string
  connection?: string
}

/**
 * API performans metrikleri
 */
export interface APIPerformanceMetrics {
  endpoint: string
  method: string
  duration: number
  status: number
  success: boolean
  timestamp: number
  userId?: string
  
  // Request detayları
  requestSize?: number
  responseSize?: number
  cacheHit?: boolean
}

/**
 * Render performans metrikleri
 */
export interface RenderPerformanceMetrics {
  componentName: string
  renderTime: number
  reRenderCount: number
  propsChangeCount: number
  timestamp: number
  
  // React profiler verileri
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetrics[] = []
  private apiMetrics: APIPerformanceMetrics[] = []
  private renderMetrics: RenderPerformanceMetrics[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30 saniye
  private observer?: PerformanceObserver

  constructor() {
    this.initializeWebVitals()
    this.initializeNavigationTiming()
    this.startPeriodicFlush()
  }

  /**
   * Web Vitals metriklerini başlat
   */
  private initializeWebVitals() {
    // Core Web Vitals observer
    try {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.handlePerformanceEntry(entry)
        })
      })

      // Layout shift metrikleri
      this.observer.observe({ entryTypes: ['layout-shift'] })
      
      // Paint metrikleri
      this.observer.observe({ entryTypes: ['paint'] })
      
      // Navigation metrikleri
      this.observer.observe({ entryTypes: ['navigation'] })
      
      // Largest Contentful Paint
      this.observer.observe({ entryTypes: ['largest-contentful-paint'] })

    } catch (error) {
      console.warn('Performance Observer desteklenmiyor:', error)
    }
  }

  /**
   * Navigation timing metriklerini başlat
   */
  private initializeNavigationTiming() {
    window.addEventListener('load', () => {
      // Sayfa yükleme metrikleri
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (perfData) {
        this.recordPageLoadMetrics(perfData)
      }
    })
  }

  /**
   * Performance entry'lerini işle
   */
  private handlePerformanceEntry(entry: PerformanceEntry) {
    const currentPage = window.location.pathname
    const timestamp = Date.now()
    
    const metric: Partial<PerformanceMetrics> = {
      page: currentPage,
      timestamp,
      userAgent: navigator.userAgent,
    }

    // Connection bilgisi (varsa)
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { connection?: { effectiveType: string } }).connection
      metric.connection = connection?.effectiveType
    }

    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          metric.fcp = entry.startTime
        }
        break
        
      case 'largest-contentful-paint':
        metric.lcp = entry.startTime
        break
        
      case 'layout-shift': {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!layoutShiftEntry.hadRecentInput) {
          metric.cls = (metric.cls || 0) + layoutShiftEntry.value
        }
        break
      }
        
      case 'first-input': {
        const firstInputEntry = entry as PerformanceEntry & { processingStart: number }
        metric.fid = firstInputEntry.processingStart - entry.startTime
        break
      }
    }

    if (Object.keys(metric).length > 3) {
      this.addMetric(metric as PerformanceMetrics)
    }
  }

  /**
   * Sayfa yükleme metriklerini kaydet
   */
  private recordPageLoadMetrics(perfData: PerformanceNavigationTiming) {
    const metric: PerformanceMetrics = {
      page: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      pageLoadTime: perfData.loadEventEnd - perfData.fetchStart,
      ttfb: perfData.responseStart - perfData.requestStart,
    }

    // Memory bilgisi (varsa)
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
      metric.memoryUsage = memory?.usedJSHeapSize
    }

    this.addMetric(metric)
  }

  /**
   * API performans metriği ekle
   */
  recordAPIPerformance(endpoint: string, method: string, startTime: number, response: Response, requestSize?: number) {
    const duration = performance.now() - startTime
    
    const metric: APIPerformanceMetrics = {
      endpoint,
      method: method.toUpperCase(),
      duration,
      status: response.status,
      success: response.ok,
      timestamp: Date.now(),
      requestSize,
      cacheHit: response.headers.get('x-cache') === 'HIT',
    }

    // Response size hesapla (yaklaşık)
    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      metric.responseSize = parseInt(contentLength, 10)
    }

    this.apiMetrics.push(metric)
    this.checkAndFlushAPI()
  }

  /**
   * React component render metriği ekle
   */
  recordRenderPerformance(
    componentName: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) {
    const metric: RenderPerformanceMetrics = {
      componentName,
      renderTime: actualDuration,
      reRenderCount: 1,
      propsChangeCount: 0,
      timestamp: Date.now(),
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    }

    // Aynı component için var olan metriği güncelle
    const existing = this.renderMetrics.find(m => 
      m.componentName === componentName && 
      Date.now() - m.timestamp < 1000
    )

    if (existing) {
      existing.reRenderCount++
      existing.renderTime = Math.max(existing.renderTime, actualDuration)
    } else {
      this.renderMetrics.push(metric)
    }

    this.checkAndFlushRender()
  }

  /**
   * Custom metrik ekle
   */
  recordCustomMetric(metricName: string, value: number, metadata?: Record<string, unknown>) {
    const metric: PerformanceMetrics = {
      page: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      [metricName]: value,
      ...metadata,
    }

    this.addMetric(metric)
  }

  /**
   * Metrik ekle
   */
  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    this.checkAndFlush()
  }

  /**
   * Batch kontrolü ve gönderim
   */
  private checkAndFlush() {
    if (this.metrics.length >= this.batchSize) {
      this.flushMetrics()
    }
  }

  private checkAndFlushAPI() {
    if (this.apiMetrics.length >= this.batchSize) {
      this.flushAPIMetrics()
    }
  }

  private checkAndFlushRender() {
    if (this.renderMetrics.length >= this.batchSize) {
      this.flushRenderMetrics()
    }
  }

  /**
   * Metrikleri sunucuya gönder
   */
  private async flushMetrics() {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    try {
      const response = await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'performance',
          metrics: metricsToSend,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      // Hata durumunda metrikleri geri koy
      this.metrics.unshift(...metricsToSend)
      
      errorService.handleError(error as Error, {
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        context: {
          component: 'PerformanceService',
          action: 'flush-metrics',
          additionalData: {
            metricsCount: metricsToSend.length,
            retryable: true,
          }
        }
      })
    }
  }

  /**
   * API metriklerini gönder
   */
  private async flushAPIMetrics() {
    if (this.apiMetrics.length === 0) return

    const metricsToSend = [...this.apiMetrics]
    this.apiMetrics = []

    try {
      await fetch('/api/analytics/api-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'api-performance',
          metrics: metricsToSend,
        }),
      })
    } catch (error) {
      this.apiMetrics.unshift(...metricsToSend)
      console.warn('API metrik gönderimi başarısız:', error)
    }
  }

  /**
   * Render metriklerini gönder
   */
  private async flushRenderMetrics() {
    if (this.renderMetrics.length === 0) return

    const metricsToSend = [...this.renderMetrics]
    this.renderMetrics = []

    try {
      await fetch('/api/analytics/render-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'render-performance',
          metrics: metricsToSend,
        }),
      })
    } catch (error) {
      this.renderMetrics.unshift(...metricsToSend)
      console.warn('Render metrik gönderimi başarısız:', error)
    }
  }

  /**
   * Periyodik metrik gönderimi
   */
  private startPeriodicFlush() {
    setInterval(() => {
      this.flushMetrics()
      this.flushAPIMetrics()
      this.flushRenderMetrics()
    }, this.flushInterval)

    // Sayfa kapatılırken kalan metrikleri gönder
    window.addEventListener('beforeunload', () => {
      this.flushMetrics()
      this.flushAPIMetrics()
      this.flushRenderMetrics()
    })

    // Visibility change'de flush yap
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushMetrics()
        this.flushAPIMetrics()
        this.flushRenderMetrics()
      }
    })
  }

  /**
   * Performans raporunu al
   */
  getPerformanceReport() {
    return {
      webVitals: this.metrics.filter(m => m.fcp || m.lcp || m.fid || m.cls),
      apiMetrics: this.apiMetrics.slice(-50), // Son 50 API çağrısı
      renderMetrics: this.renderMetrics.slice(-50), // Son 50 render
      memoryUsage: this.getCurrentMemoryUsage(),
      cacheStats: this.getCacheStats(),
    }
  }

  /**
   * Mevcut memory kullanımını al
   */
  private getCurrentMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as Performance & { 
        memory?: { 
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        } 
      }).memory
      
      if (memory) {
        return {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
        }
      }
    }
    return null
  }

  /**
   * Cache istatistiklerini al
   */
  private getCacheStats() {
    // LocalStorage kullanımı
    let localStorageSize = 0
    try {
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          localStorageSize += localStorage[key].length
        }
      }
    } catch (error) {
      console.warn('LocalStorage size hesaplanamadı:', error)
    }

    return {
      localStorage: localStorageSize,
      sessionStorage: JSON.stringify(sessionStorage).length,
    }
  }

  /**
   * Service'i temizle
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    // Kalan metrikleri gönder
    this.flushMetrics()
    this.flushAPIMetrics()
    this.flushRenderMetrics()
  }
}

// Singleton instance
export const PerformanceService = new PerformanceMonitoringService()

/**
 * API çağrıları için performans wrapper
 */
export function withPerformanceTracking<T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now()
  
  return apiCall()
    .then((result) => {
      const response = result as unknown
      if (response && typeof response === 'object' && response !== null && 'status' in response) {
        PerformanceService.recordAPIPerformance(endpoint, method, startTime, response as Response)
      }
      return result
    })
    .catch((error) => {
      // Hata durumunda da performans kaydı yap
      const fakeResponse = new Response(null, { status: 500, statusText: 'Error' })
      PerformanceService.recordAPIPerformance(endpoint, method, startTime, fakeResponse)
      throw error
    })
}

/**
 * Component performance tracking için HOC
 */
export function withRenderTracking<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
  const TrackedComponent = React.memo((props: P) => {
    const startTime = React.useRef(performance.now())
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime.current
      PerformanceService.recordRenderPerformance(
        displayName,
        renderTime,
        renderTime, // baseDuration yaklaşımı
        startTime.current,
        performance.now()
      )
      
      // Her render'da yeni başlangıç zamanı
      startTime.current = performance.now()
    })
    
    return React.createElement(WrappedComponent, props)
  })

  TrackedComponent.displayName = `withRenderTracking(${displayName})`
  return TrackedComponent as unknown as React.ComponentType<P>
}
