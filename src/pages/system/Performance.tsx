import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { 
  CorporateCard, 
  CorporateCardContent, 
  CorporateCardHeader, 
  CorporateCardTitle,
  CorporateButton,
  CorporateBadge
} from '@/components/ui/corporate/CorporateComponents'
import PerformanceMonitor from '@components/performance/PerformanceMonitor'
import MemoryMonitor from '@components/performance/MemoryMonitor'
import { getAPIPerformanceSummary } from '../../api/performanceInterceptors'
import { CachingService } from '@services/cachingService'
import { PerformanceService } from '@services/performanceService'
import { 
  Activity, 
  Zap, 
  Database, 
  Monitor, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react'

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [apiSummary, setApiSummary] = useState<any>(null)
  const [cacheStats, setCacheStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    loadPerformanceData()
  }, [])

  const loadPerformanceData = async () => {
    setIsLoading(true)
    try {
      const apiData = getAPIPerformanceSummary()
      const cacheData = CachingService.getStats()
      
      setApiSummary(apiData)
      setCacheStats(cacheData)
    } catch (error) {
      console.error('Performance data loading failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllCaches = async () => {
    if (confirm('Tüm cache&apos;leri temizlemek istediğinizden emin misiniz?')) {
      try {
        await CachingService.clear()
        await loadPerformanceData()
      } catch (error) {
        console.error('Cache clearing failed:', error)
      }
    }
  }

  const downloadPerformanceReport = () => {
    const report = PerformanceService.getPerformanceReport()
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      good: 'bg-semantic-success/10 text-semantic-success',
    warning: 'bg-semantic-warning/10 text-semantic-warning',
    poor: 'bg-semantic-destructive/10 text-semantic-destructive',
    unknown: 'bg-muted text-muted-foreground',
    }

    const labels = {
      good: 'İyi',
      warning: 'Uyarı',
      poor: 'Kötü',
      unknown: 'Bilinmiyor',
    }

    return (
      <CorporateBadge className={variants[status as keyof typeof variants] || variants.unknown}>
        {labels[status as keyof typeof labels] || status}
      </CorporateBadge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performans İzleme</h1>
          <p className="text-muted-foreground">
            Sistem performansı ve optimizasyon metrikleri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CorporateButton
            onClick={downloadPerformanceReport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Rapor İndir
          </CorporateButton>
          <CorporateButton
            onClick={clearAllCaches}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Cache Temizle
          </CorporateButton>
          <CorporateButton
            onClick={loadPerformanceData}
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Yenile
          </CorporateButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Canlı İzleme
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Bellek
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            API & Cache
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CorporateCard>
              <CorporateCardHeader className="pb-2">
                <CorporateCardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-semantic-info" />
                  Genel Durum
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-6-group">
                  {getStatusBadge('good')}
                  <div className="text-sm text-muted-foreground">
                    Sistem normal çalışıyor
                  </div>
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader className="pb-2">
                <CorporateCardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-semantic-warning" />
                  API Performansı
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-6-group">
                  {apiSummary ? (
                    <>
                      <div className="text-lg font-bold text-semantic-info">
                        {apiSummary.averageDuration}ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        %{apiSummary.successRate} başarı
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                  )}
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader className="pb-2">
                <CorporateCardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4 text-semantic-success" />
                  Cache Durumu
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-6-group">
                  {cacheStats ? (
                    <>
                      <div className="text-lg font-bold text-semantic-success">
                        {cacheStats.total.entries}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatBytes(cacheStats.total.size)}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                  )}
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader className="pb-2">
                <CorporateCardTitle className="text-sm font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-brand-secondary" />
                  İzleme Durumu
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-6-group">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-semantic-success" />
                    <span className="text-sm">Aktif</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gerçek zamanlı
                  </div>
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </div>

          {/* API Performance Summary */}
          {apiSummary && apiSummary.recommendations.length > 0 && (
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-semantic-warning" />
                  Performans Önerileri
                </CorporateCardTitle>
                <CardDescription>
                  Sistem optimizasyonu için öneriler
                </CardDescription>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-3">
                  {apiSummary.recommendations.map((rec: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'border-semantic-danger bg-semantic-danger/10' :
                      rec.priority === 'medium' ? 'border-semantic-warning bg-semantic-warning/10' :
                      'border-semantic-info bg-semantic-info/10'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                          rec.priority === 'high' ? 'text-semantic-danger' :
                          rec.priority === 'medium' ? 'text-semantic-warning' :
                          'text-semantic-info'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{rec.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Öncelik: {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>
          )}
        </TabsContent>

        <TabsContent value="monitoring">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryMonitor />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          {/* API Performance Details */}
          {apiSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>API İstatistikleri</CorporateCardTitle>
                  <CardDescription>
                    Son API çağrılarının detaylı analizi
                  </CardDescription>
                </CorporateCardHeader>
                <CorporateCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Toplam İstek</div>
                        <div className="text-lg font-bold text-semantic-info">
                        {apiSummary.totalRequests.toLocaleString()}
                      </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Ortalama Süre</div>
                        <div className="text-lg font-bold text-semantic-info">
                          {apiSummary.averageDuration}ms
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Başarı Oranı</div>
                        <div className="text-lg font-bold text-semantic-success">
                          %{apiSummary.successRate}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Yavaş İstekler</div>
                        <div className="text-lg font-bold text-semantic-warning">
                          {apiSummary.slowRequests}
                        </div>
                      </div>
                    </div>

                    {/* Error Distribution */}
                    {Object.keys(apiSummary.errorsByStatus).length > 0 && (
                      <div className="space-y-6-group">
                        <div className="text-sm font-medium">Hata Dağılımı</div>
                        <div className="space-y-1">
                          {Object.entries(apiSummary.errorsByStatus).map(([status, count]) => (
                            <div key={status} className="flex justify-between text-sm">
                              <span>HTTP {status}</span>
                              <span className="font-medium">{count as number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CorporateCardContent>
              </CorporateCard>

              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>Cache İstatistikleri</CorporateCardTitle>
                  <CardDescription>
                    Bellek ve depolama kullanımı
                  </CardDescription>
                </CorporateCardHeader>
                <CorporateCardContent>
                  {cacheStats && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Memory Cache</div>
                          <div className="text-lg font-bold text-brand-secondary">
                            {cacheStats.memory.entries}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(cacheStats.memory.size)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">LocalStorage</div>
                          <div className="text-lg font-bold text-semantic-info">
                            {cacheStats.localStorage.entries}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(cacheStats.localStorage.size)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">SessionStorage</div>
                          <div className="text-lg font-bold text-semantic-success">
                            {cacheStats.sessionStorage.entries}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(cacheStats.sessionStorage.size)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Kullanım Oranı</div>
                          <div className="text-lg font-bold text-semantic-warning">
                            %{cacheStats.memory.utilization.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Memory
                          </div>
                        </div>
                      </div>

                      {/* Cache utilization bar */}
                      <div className="space-y-6-group">
                        <div className="flex justify-between text-sm">
                          <span>Memory Kullanımı</span>
                          <span>%{cacheStats.memory.utilization.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              cacheStats.memory.utilization > 80 ? 'bg-semantic-destructive' :
            cacheStats.memory.utilization > 60 ? 'bg-semantic-warning' : 'bg-semantic-success'
                            }`}
                            style={{ width: `${Math.min(cacheStats.memory.utilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CorporateCardContent>
              </CorporateCard>
            </div>
          )}

          {/* Slowest Endpoints */}
          {apiSummary && apiSummary.slowestEndpoints.length > 0 && (
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>En Yavaş Endpoint&apos;ler</CorporateCardTitle>
                <CardDescription>
                  Optimizasyon gereken API endpoint&apos;leri
                </CardDescription>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-6-group">
                  {apiSummary.slowestEndpoints.map(([endpoint, stats]: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{endpoint}</div>
                        <div className="text-sm text-muted-foreground">
                          {stats.count} istek
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-semantic-destructive">
                          {Math.round(stats.averageDuration)}ms
                        </div>
                        {stats.errorRate > 0 && (
                          <div className="text-sm text-semantic-destructive">
                            %{Math.round(stats.errorRate * 100)} hata
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
