import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/corporate/CorporateComponents'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Activity, Zap, HardDrive, Database, X } from 'lucide-react'
import { CorporateBadge, CorporateCard, CorporateButton, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring'
// import { PERFORMANCE_COLORS } from '@/constants/colors'

interface PerformanceData {
  webVitals: any[]
  apiMetrics: any[]
  renderMetrics: any[]
  memoryUsage: any
  cacheStats: any
}

export default function PerformanceMonitor() {
  const { 
    performanceData, 
    alerts, 
    isLoading, 
    loadPerformanceData, 
    clearAlerts,
    lastUpdate
  } = usePerformanceMonitoring()

  const getWebVitalsStatus = (vitals: any[]) => {
    if (vitals.length === 0) return { status: 'unknown', color: 'gray' }
    
    const latest = vitals[vitals.length - 1]
    const issues = []
    
    if (latest.fcp && latest.fcp > 1800) issues.push('FCP')
    if (latest.lcp && latest.lcp > 2500) issues.push('LCP')
    if (latest.fid && latest.fid > 100) issues.push('FID')
    if (latest.cls && latest.cls > 0.1) issues.push('CLS')
    
    if (issues.length === 0) return { status: 'good', color: 'green', issues: [] }
    if (issues.length <= 2) return { status: 'needs-improvement', color: 'yellow', issues }
    return { status: 'poor', color: 'red', issues }
  }

  const getAPIPerformanceStatus = (apiMetrics: any[]) => {
    if (apiMetrics.length === 0) return { status: 'unknown', avgDuration: 0 }
    
    const avgDuration = apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length
    const errorRate = apiMetrics.filter(m => !m.success).length / apiMetrics.length
    
    if (avgDuration > 3000 || errorRate > 0.05) return { status: 'poor', avgDuration, errorRate }
    if (avgDuration > 1000 || errorRate > 0.02) return { status: 'needs-improvement', avgDuration, errorRate }
    return { status: 'good', avgDuration, errorRate }
  }

  const getRenderPerformanceStatus = (renderMetrics: any[]) => {
    if (renderMetrics.length === 0) return { status: 'unknown', avgRenderTime: 0 }
    
    const avgRenderTime = renderMetrics.reduce((sum, m) => sum + m.renderTime, 0) / renderMetrics.length
    const slowComponents = renderMetrics.filter(m => m.renderTime > 16).length // 60fps = 16ms
    
    if (avgRenderTime > 50 || slowComponents > renderMetrics.length * 0.3) {
      return { status: 'poor', avgRenderTime, slowComponents }
    }
    if (avgRenderTime > 25 || slowComponents > renderMetrics.length * 0.1) {
      return { status: 'needs-improvement', avgRenderTime, slowComponents }
    }
    return { status: 'good', avgRenderTime, slowComponents }
  }

  const getMemoryStatus = (memoryUsage: any) => {
    if (!memoryUsage) return { status: 'unknown', percentage: 0 }
    
    const percentage = memoryUsage.percentage
    
    if (percentage > 80) return { status: 'poor', percentage }
    if (percentage > 60) return { status: 'needs-improvement', percentage }
    return { status: 'good', percentage }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-financial-success" />
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4 text-financial-warning" />
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-financial-error" />
      default:
        return <Clock className="h-4 w-4 text-neutral-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      good: 'bg-financial-success-light text-financial-success border-financial-success/30',
      'needs-improvement': 'bg-financial-warning-light text-financial-warning border-financial-warning/30',
      poor: 'bg-financial-error-light text-financial-error border-financial-error/30',
      unknown: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    }

    return (
      <CorporateBadge className={variants[status as keyof typeof variants] || variants.unknown}>
        {status === 'good' && 'İyi'}
        {status === 'needs-improvement' && 'Geliştirilmeli'}
        {status === 'poor' && 'Kötü'}
        {status === 'unknown' && 'Bilinmiyor'}
      </CorporateBadge>
    )
  }

  if (isLoading && !performanceData) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Performans verileri yükleniyor...
      </div>
    )
  }

  if (!performanceData) {
    return (
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-financial-warning" />
            Performans Verisi Bulunamadı
          </CorporateCardTitle>
          <CardDescription>
            Performans verileri henüz toplanmamış. Lütfen sayfayı kullanmaya devam edin.
          </CardDescription>
        </CorporateCardHeader>
      </CorporateCard>
    )
  }

  const webVitalsStatus = getWebVitalsStatus(performanceData.webVitals)
  const apiStatus = getAPIPerformanceStatus(performanceData.apiMetrics)
  const renderStatus = getRenderPerformanceStatus(performanceData.renderMetrics)
  const memoryStatus = getMemoryStatus(performanceData.memoryUsage)

  return (
    <div className="space-y-6">
      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2 mb-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                   <strong>{alert.metric}:</strong> {alert.message} 
                   ({alert.value.toFixed(2)} &gt; {alert.threshold})
                 </span>
                <CorporateButton
                  variant="ghost"
                  size="sm"
                  onClick={clearAlerts}
                >
                  <X className="h-4 w-4" />
                </CorporateButton>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Performans Monitörü
            {alerts.length > 0 && (
              <CorporateBadge variant="destructive" className="ml-2">
                {alerts.length} Alert
              </CorporateBadge>
            )}
          </h1>
          <p className="text-gray-600">
            Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
          </p>
        </div>
        <CorporateButton
          onClick={loadPerformanceData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </CorporateButton>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Web Vitals */}
        <CorporateCard>
          <CorporateCardHeader className="pb-2">
            <CorporateCardTitle className="text-sm font-medium flex items-center justify-between">
              Web Vitals
              {getStatusIcon(webVitalsStatus.status)}
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-6-group">
              {getStatusBadge(webVitalsStatus.status)}
              {webVitalsStatus.issues && webVitalsStatus.issues.length > 0 && (
                <div className="text-sm text-gray-600">
                  Sorunlu: {webVitalsStatus.issues.join(', ')}
                </div>
              )}
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* API Performance */}
        <CorporateCard>
          <CorporateCardHeader className="pb-2">
            <CorporateCardTitle className="text-sm font-medium flex items-center justify-between">
              API Performansı
              {getStatusIcon(apiStatus.status)}
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-6-group">
              {getStatusBadge(apiStatus.status)}
              <div className="text-sm text-gray-600">
                Ort: {formatDuration(apiStatus.avgDuration)}
              </div>
              {apiStatus.errorRate && apiStatus.errorRate > 0 && (
                <div className="text-sm text-financial-error">
                  Hata oranı: %{(apiStatus.errorRate * 100).toFixed(1)}
                </div>
              )}
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* Render Performance */}
        <CorporateCard>
          <CorporateCardHeader className="pb-2">
            <CorporateCardTitle className="text-sm font-medium flex items-center justify-between">
              Render Performansı
              {getStatusIcon(renderStatus.status)}
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-6-group">
              {getStatusBadge(renderStatus.status)}
              <div className="text-sm text-gray-600">
                Ort: {formatDuration(renderStatus.avgRenderTime)}
              </div>
              {renderStatus.slowComponents && renderStatus.slowComponents > 0 && (
                <div className="text-sm text-financial-warning">
                  Yavaş: {renderStatus.slowComponents} component
                </div>
              )}
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* Memory Usage */}
        <CorporateCard>
          <CorporateCardHeader className="pb-2">
            <CorporateCardTitle className="text-sm font-medium flex items-center justify-between">
              Bellek Kullanımı
              {getStatusIcon(memoryStatus.status)}
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-6-group">
              {getStatusBadge(memoryStatus.status)}
              {performanceData.memoryUsage && (
                <>
                  <div className="text-sm text-gray-600">
                    %{memoryStatus.percentage}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBytes(performanceData.memoryUsage.used)} / {formatBytes(performanceData.memoryUsage.limit)}
                  </div>
                </>
              )}
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
        {/* Web Vitals Detail */}
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle>Web Vitals Detayları</CorporateCardTitle>
            <CardDescription>
              Core Web Vitals metrikleri ve performans göstergeleri
            </CardDescription>
          </CorporateCardHeader>
          <CorporateCardContent>
            {performanceData.webVitals.length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  const latest = performanceData.webVitals[performanceData.webVitals.length - 1]
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      {latest.fcp && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">First Contentful Paint</div>
                          <div className={`text-lg font-bold ${latest.fcp > 1800 ? 'text-red-500' : latest.fcp > 1000 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {formatDuration(latest.fcp)}
                          </div>
                        </div>
                      )}
                      {latest.lcp && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Largest Contentful Paint</div>
                          <div className={`text-lg font-bold ${latest.lcp > 2500 ? 'text-red-500' : latest.lcp > 1500 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {formatDuration(latest.lcp)}
                          </div>
                        </div>
                      )}
                      {latest.fid && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">First Input Delay</div>
                          <div className={`text-lg font-bold ${latest.fid > 100 ? 'text-red-500' : latest.fid > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {formatDuration(latest.fid)}
                          </div>
                        </div>
                      )}
                      {latest.cls && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Cumulative Layout Shift</div>
                          <div className={`text-lg font-bold ${latest.cls > 0.1 ? 'text-red-500' : latest.cls > 0.05 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {latest.cls.toFixed(3)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Web Vitals verileri henüz toplanmamış
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>

        {/* API Metrics */}
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle>API Metrikleri</CorporateCardTitle>
            <CardDescription>
              Son API çağrılarının performans analizi
            </CardDescription>
          </CorporateCardHeader>
          <CorporateCardContent>
            {performanceData.apiMetrics.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Toplam API Çağrısı</div>
                    <div className="text-lg font-bold text-blue-600">
                      {performanceData.apiMetrics.length}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Ortalama Süre</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatDuration(apiStatus.avgDuration)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Başarı Oranı</div>
                    <div className="text-lg font-bold text-green-600">
                      %{((1 - (apiStatus.errorRate || 0)) * 100).toFixed(1)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Cache Hit</div>
                    <div className="text-lg font-bold text-purple-600">
                      %{((performanceData.apiMetrics.filter(m => m.cacheHit).length / performanceData.apiMetrics.length) * 100).toFixed(1)}
                    </div>
                  </div>
                </div>
                
                {/* Recent API Calls */}
                <div className="space-y-6-group">
                  <div className="text-sm font-medium">Son API Çağrıları</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {performanceData.apiMetrics.slice(-5).reverse().map((metric, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{metric.method} {metric.endpoint}</span>
                        <div className="flex items-center gap-2">
                          <span className={metric.success ? 'text-green-600' : 'text-red-600'}>
                            {metric.status}
                          </span>
                          <span className="text-gray-600">
                            {formatDuration(metric.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                API metrikleri henüz toplanmamış
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Cache and Storage */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle>Cache ve Depolama</CorporateCardTitle>
          <CardDescription>
            Yerel depolama kullanımı ve cache istatistikleri
          </CardDescription>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceData.cacheStats && (
              <>
                <div className="space-y-1">
                  <div className="text-sm font-medium">LocalStorage</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatBytes(performanceData.cacheStats.localStorage)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">SessionStorage</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatBytes(performanceData.cacheStats.sessionStorage)}
                  </div>
                </div>
              </>
            )}
            {performanceData.memoryUsage && (
              <div className="space-y-1">
                <div className="text-sm font-medium">JS Heap</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatBytes(performanceData.memoryUsage.used)}
                </div>
                <div className="text-xs text-gray-500">
                  / {formatBytes(performanceData.memoryUsage.limit)}
                </div>
              </div>
            )}
          </div>
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}
