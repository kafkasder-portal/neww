import { useState, useEffect, useCallback } from 'react'
import { PerformanceService } from '@/services/performanceService'

interface PerformanceData {
  webVitals: any[]
  apiMetrics: any[]
  renderMetrics: any[]
  memoryUsage: any
  cacheStats: any
}

interface PerformanceAlert {
  type: 'warning' | 'error'
  message: string
  metric: string
  value: number
  threshold: number
}

export function usePerformanceMonitoring() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const loadPerformanceData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = PerformanceService.getPerformanceReport()
      setPerformanceData(data)
      setLastUpdate(new Date())
      
      // Performance alertlerini kontrol et
      checkPerformanceAlerts(data)
    } catch (error) {
      console.error('Performans verileri yüklenemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkPerformanceAlerts = (data: PerformanceData) => {
    const newAlerts: PerformanceAlert[] = []

    // Web Vitals kontrolü
    if (data.webVitals.length > 0) {
      const latest = data.webVitals[data.webVitals.length - 1]
      
      if (latest.fcp && latest.fcp > 3000) {
        newAlerts.push({
          type: 'error',
          message: 'First Contentful Paint çok yavaş',
          metric: 'FCP',
          value: latest.fcp,
          threshold: 3000
        })
      }
      
      if (latest.lcp && latest.lcp > 4000) {
        newAlerts.push({
          type: 'error',
          message: 'Largest Contentful Paint çok yavaş',
          metric: 'LCP',
          value: latest.lcp,
          threshold: 4000
        })
      }
      
      if (latest.fid && latest.fid > 300) {
        newAlerts.push({
          type: 'error',
          message: 'First Input Delay çok yüksek',
          metric: 'FID',
          value: latest.fid,
          threshold: 300
        })
      }
      
      if (latest.cls && latest.cls > 0.25) {
        newAlerts.push({
          type: 'error',
          message: 'Cumulative Layout Shift çok yüksek',
          metric: 'CLS',
          value: latest.cls,
          threshold: 0.25
        })
      }
    }

    // API Performance kontrolü
    if (data.apiMetrics.length > 0) {
      const avgDuration = data.apiMetrics.reduce((sum, m) => sum + m.duration, 0) / data.apiMetrics.length
      const errorRate = data.apiMetrics.filter(m => !m.success).length / data.apiMetrics.length
      
      if (avgDuration > 5000) {
        newAlerts.push({
          type: 'error',
          message: 'API yanıt süresi çok yavaş',
          metric: 'API Response Time',
          value: avgDuration,
          threshold: 5000
        })
      }
      
      if (errorRate > 0.1) {
        newAlerts.push({
          type: 'error',
          message: 'API hata oranı çok yüksek',
          metric: 'API Error Rate',
          value: errorRate * 100,
          threshold: 10
        })
      }
    }

    // Memory kontrolü
    if (data.memoryUsage && data.memoryUsage.percentage > 90) {
      newAlerts.push({
        type: 'warning',
        message: 'Bellek kullanımı kritik seviyede',
        metric: 'Memory Usage',
        value: data.memoryUsage.percentage,
        threshold: 90
      })
    }

    setAlerts(newAlerts)
  }

  const recordCustomMetric = useCallback((name: string, value: number, metadata?: Record<string, unknown>) => {
    PerformanceService.recordCustomMetric(name, value, metadata)
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  useEffect(() => {
    loadPerformanceData()
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadPerformanceData, 30000)
    
    return () => clearInterval(interval)
  }, [loadPerformanceData])

  return {
    performanceData,
    alerts,
    isLoading,
    lastUpdate,
    loadPerformanceData,
    recordCustomMetric,
    clearAlerts
  }
}

// Performance tracking için HOC
export function withPerformanceTracking<T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
  const TrackedComponent = React.memo((props: T) => {
    const startTime = React.useRef(performance.now())
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime.current
      
      // Yavaş render'ları logla
      if (renderTime > 16) { // 60fps = 16ms
        console.warn(`Slow render detected: ${displayName} took ${renderTime.toFixed(2)}ms`)
      }
      
      PerformanceService.recordRenderPerformance(
        displayName,
        renderTime,
        renderTime,
        startTime.current,
        performance.now()
      )
      
      startTime.current = performance.now()
    })
    
    return React.createElement(WrappedComponent, props)
  })

  TrackedComponent.displayName = `withPerformanceTracking(${displayName})`
  return TrackedComponent as React.ComponentType<T>
}