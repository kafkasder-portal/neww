import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { PerformanceService } from '../services/performanceService'
import { errorService } from '../services/errorService'

/**
 * API performance tracking metadata
 */
interface PerformanceMetadata {
  startTime: number
  requestSize?: number
  endpoint: string
  method: string
  cacheHit?: boolean
}

/**
 * API request timing data
 */
interface RequestTiming {
  queueTime?: number
  dnsTime?: number
  connectTime?: number
  requestTime: number
  responseTime: number
  totalTime: number
}

/**
 * Performance tracking interceptor for Axios
 */
export class APIPerformanceInterceptor {
  private pendingRequests = new Map<string, PerformanceMetadata>()
  private requestCounter = 0

  /**
   * Request interceptor - başlangıç zamanını kaydet
   */
  requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const requestId = `${++this.requestCounter}-${Date.now()}`
    const startTime = performance.now()
    
    // Request size hesapla
    let requestSize = 0
    if (config.data) {
      try {
        requestSize = new Blob([
          typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
        ]).size
      } catch (error: any) {
        // Size hesaplanamadı
      }
    }

    // Metadata kaydet
    const metadata: PerformanceMetadata = {
      startTime,
      requestSize,
      endpoint: this.getEndpointPath(config.url || ''),
      method: (config.method || 'GET').toUpperCase(),
    }

    this.pendingRequests.set(requestId, metadata)
    
    // Request ID'yi header'a ekle
    config.headers = {
      ...config.headers,
      'X-Request-ID': requestId,
    }

    // Performance mark oluştur
    performance.mark(`api-request-start-${requestId}`)

    return config
  }

  /**
   * Response interceptor - performans metriklerini kaydet
   */
  responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    const requestId = response.config.headers?.['X-Request-ID'] as string
    if (!requestId || !this.pendingRequests.has(requestId)) {
      return response
    }

    const metadata = this.pendingRequests.get(requestId)!
    const endTime = performance.now()
    const duration = endTime - metadata.startTime

    // Performance mark oluştur
    performance.mark(`api-request-end-${requestId}`)
    
    try {
      performance.measure(
        `api-request-${requestId}`,
        `api-request-start-${requestId}`,
        `api-request-end-${requestId}`
      )
    } catch (error) {
      // Performance measurement failed
    }

    // Cache hit kontrolü (for future use)
    // const cacheHit = response.headers['x-cache'] === 'HIT' || 
    //                  response.headers['cf-cache-status'] === 'HIT'

    // Response size hesapla (for future use)
    // let responseSize = 0
    // if (response.data) {
    //   try {
    //     responseSize = new Blob([
    //       typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
    //     ]).size
    //   } catch (error) {
    //     // Size hesaplanamadı
    //   }
    // }

    // Create compatible Response object for Performance Service
    const compatibleResponse = new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers as any)
    })

    // Performance Service'e kaydet
    PerformanceService.recordAPIPerformance(
      metadata.endpoint,
      metadata.method,
      metadata.startTime,
      compatibleResponse,
      metadata.requestSize
    )

    // Detaylı timing bilgileri
    this.recordDetailedTiming(requestId, metadata, response, duration)

    // Cleanup
    this.pendingRequests.delete(requestId)
    performance.clearMarks(`api-request-start-${requestId}`)
    performance.clearMarks(`api-request-end-${requestId}`)
    performance.clearMeasures(`api-request-${requestId}`)

    return response
  }

  /**
   * Error interceptor - hatalı istekleri de kaydet
   */
  errorInterceptor = (error: AxiosError): Promise<AxiosError> => {
    const requestId = error.config?.headers?.['X-Request-ID'] as string
    if (requestId && this.pendingRequests.has(requestId)) {
      const metadata = this.pendingRequests.get(requestId)!
      const endTime = performance.now()
      const duration = endTime - metadata.startTime

      // Fake response oluştur error tracking için
      const fakeResponse = {
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Network Error',
        ok: false,
        headers: new Headers(),
      } as Response

      // Error olarak kaydet
      PerformanceService.recordAPIPerformance(
        metadata.endpoint,
        metadata.method,
        metadata.startTime,
        fakeResponse,
        metadata.requestSize
      )

      // Error service'e de kaydet
      errorService.handleError(error, {
        category: 'network' as any,
        severity: 'medium' as any,
        context: {
          additionalData: {
            endpoint: metadata.endpoint,
            method: metadata.method,
            duration,
            requestSize: metadata.requestSize,
          }
        }
      })

      // Cleanup
      this.pendingRequests.delete(requestId)
      performance.clearMarks(`api-request-start-${requestId}`)
      performance.clearMarks(`api-request-end-${requestId}`)
    }

    return Promise.reject(error)
  }

  /**
   * Detaylı timing bilgilerini kaydet
   */
  private recordDetailedTiming(
    _requestId: string,
    metadata: PerformanceMetadata,
    response: AxiosResponse,
    totalDuration: number
  ): void {
    try {
      // Navigation timing API'sinden detaylı bilgi al (for future use)
      // const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const resourceEntries = performance.getEntriesByName(response.config.url || '') as PerformanceResourceTiming[]

      let timing: RequestTiming = {
        requestTime: totalDuration,
        responseTime: totalDuration,
        totalTime: totalDuration,
      }

      // Resource timing varsa detaylı bilgileri al
      if (resourceEntries.length > 0) {
        const entry = resourceEntries[resourceEntries.length - 1] // En son entry
        timing = {
          dnsTime: entry.domainLookupEnd - entry.domainLookupStart,
          connectTime: entry.connectEnd - entry.connectStart,
          requestTime: entry.responseStart - entry.requestStart,
          responseTime: entry.responseEnd - entry.responseStart,
          totalTime: entry.responseEnd - entry.startTime,
        }
      }

      // Custom metric olarak kaydet
      PerformanceService.recordCustomMetric(`api-timing-${metadata.endpoint}`, totalDuration, {
        endpoint: metadata.endpoint,
        method: metadata.method,
        timing,
        cacheHit: response.headers['x-cache'] === 'HIT',
        status: response.status,
      })

      // Yavaş request'leri logla
      if (totalDuration > 3000) { // 3 saniyeden uzun
        console.warn(`🐌 Slow API request: ${metadata.method} ${metadata.endpoint} - ${totalDuration.toFixed(2)}ms`, {
          timing,
          requestSize: metadata.requestSize,
          status: response.status,
        })
      }
    } catch (error: any) {
      console.warn('Detailed timing kaydedilemedi:', error)
    }
  }

  /**
   * Endpoint path'ini temizle
   */
  private getEndpointPath(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin)
      // Query parameter'ları ve hash'i kaldır
      return urlObj.pathname
    } catch (error: any) {
      // URL parse edilemedi, olduğu gibi döndür
      return url.split('?')[0].split('#')[0]
    }
  }

  /**
   * Pending request'leri temizle
   */
  cleanup(): void {
    this.pendingRequests.clear()
  }

  /**
   * İstatistikleri al
   */
  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      totalRequests: this.requestCounter,
    }
  }
}

/**
 * Singleton interceptor instance
 */
export const apiPerformanceInterceptor = new APIPerformanceInterceptor()

/**
 * Axios instance'a interceptor'ları ekle
 */
export function setupAPIPerformanceTracking(axiosInstance: any = axios): void {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    apiPerformanceInterceptor.requestInterceptor,
    (error: any) => Promise.reject(error)
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    apiPerformanceInterceptor.responseInterceptor,
    apiPerformanceInterceptor.errorInterceptor
  )
}

/**
 * API performance summary raporunu al
 */
export function getAPIPerformanceSummary() {
  const performanceReport = PerformanceService.getPerformanceReport()
  const apiMetrics = performanceReport.apiMetrics || []

  if (apiMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageDuration: 0,
      successRate: 0,
      slowRequests: 0,
      errorsByStatus: {},
    }
  }

  // İstatistikleri hesapla
  const totalRequests = apiMetrics.length
  const successfulRequests = apiMetrics.filter(m => m.success).length
  const averageDuration = apiMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests
  const slowRequests = apiMetrics.filter(m => m.duration > 3000).length
  const successRate = (successfulRequests / totalRequests) * 100

  // Error'ları status code'a göre grupla
  const errorsByStatus: Record<number, number> = {}
  apiMetrics.filter(m => !m.success).forEach(m => {
    errorsByStatus[m.status] = (errorsByStatus[m.status] || 0) + 1
  })

  // Endpoint'leri performansa göre grupla
  const endpointPerformance: Record<string, {
    count: number
    averageDuration: number
    errorRate: number
  }> = {}

  apiMetrics.forEach(m => {
    const key = `${m.method} ${m.endpoint}`
    if (!endpointPerformance[key]) {
      endpointPerformance[key] = { count: 0, averageDuration: 0, errorRate: 0 }
    }
    
    const stat = endpointPerformance[key]
    stat.count++
    stat.averageDuration = (stat.averageDuration * (stat.count - 1) + m.duration) / stat.count
    if (!m.success) {
      stat.errorRate = (stat.errorRate * (stat.count - 1) + 1) / stat.count
    }
  })

  // En yavaş endpoint'leri bul
  const slowestEndpoints = Object.entries(endpointPerformance)
    .sort(([, a], [, b]) => b.averageDuration - a.averageDuration)
    .slice(0, 5)

  // En hatalı endpoint'leri bul
  const errorProneEndpoints = Object.entries(endpointPerformance)
    .filter(([, stat]) => stat.errorRate > 0)
    .sort(([, a], [, b]) => b.errorRate - a.errorRate)
    .slice(0, 5)

  return {
    totalRequests,
    averageDuration: Math.round(averageDuration),
    successRate: Math.round(successRate * 100) / 100,
    slowRequests,
    errorsByStatus,
    endpointPerformance,
    slowestEndpoints,
    errorProneEndpoints,
    recommendations: generateAPIRecommendations({
      averageDuration,
      successRate,
      slowRequests,
      totalRequests,
      slowestEndpoints,
      errorProneEndpoints,
    }),
  }
}

/**
 * API performansı için öneriler oluştur
 */
function generateAPIRecommendations(stats: {
  averageDuration: number
  successRate: number
  slowRequests: number
  totalRequests: number
  slowestEndpoints: any[]
  errorProneEndpoints: any[]
}) {
  const recommendations = []

  if (stats.averageDuration > 2000) {
    recommendations.push({
      type: 'warning',
      message: 'API ortalama yanıt süresi yüksek. Caching ve optimizasyon düşünün.',
      priority: 'high',
    })
  }

  if (stats.successRate < 95) {
    recommendations.push({
      type: 'error',
      message: 'API başarı oranı düşük. Error handling ve retry mekanizması ekleyin.',
      priority: 'high',
    })
  }

  if (stats.slowRequests > stats.totalRequests * 0.1) {
    recommendations.push({
      type: 'warning',
      message: 'Çok sayıda yavaş request var. Timeout değerlerini kontrol edin.',
      priority: 'medium',
    })
  }

  if (stats.slowestEndpoints.length > 0) {
    const slowest = stats.slowestEndpoints[0]
    recommendations.push({
      type: 'info',
      message: `En yavaş endpoint: ${slowest[0]} (${Math.round(slowest[1].averageDuration)}ms)`,
      priority: 'medium',
    })
  }

  if (stats.errorProneEndpoints.length > 0) {
    const errorProne = stats.errorProneEndpoints[0]
    recommendations.push({
      type: 'warning',
      message: `En hatalı endpoint: ${errorProne[0]} (%${Math.round(errorProne[1].errorRate * 100)} hata)`,
      priority: 'high',
    })
  }

  return recommendations
}

// Automatic cleanup on page unload
window.addEventListener('beforeunload', () => {
  apiPerformanceInterceptor.cleanup()
})
