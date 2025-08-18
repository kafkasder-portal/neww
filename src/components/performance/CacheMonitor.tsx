import { useState, useEffect } from 'react'
import { BarChart3, Activity, Database, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useCacheManager } from '@/lib/cacheStrategies'
import { queryClient } from '@/lib/queryClient'

interface CacheMonitorProps {
  isOpen: boolean
  onClose: () => void
}

export function CacheMonitor({ isOpen, onClose }: CacheMonitorProps) {
  const cacheManager = useCacheManager(queryClient)
  const [performanceReport, setPerformanceReport] = useState<any>(null)
  const [memoryUsage, setMemoryUsage] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    if (isOpen) {
      updateStats()
      
      if (autoRefresh) {
        const interval = setInterval(updateStats, 5000)
        return () => clearInterval(interval)
      }
    }
  }, [isOpen, autoRefresh])

  const updateStats = () => {
    setPerformanceReport(cacheManager.getCachePerformanceReport())
    setMemoryUsage(cacheManager.getMemoryUsage())
  }

  const handleOptimize = () => {
    cacheManager.optimizeCache()
    updateStats()
  }

  const handleClearCache = () => {
    if (window.confirm('Tüm cache\'i temizlemek istediğinizden emin misiniz?')) {
      cacheManager.clearCache()
      updateStats()
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cache Performans Monitörü
              </h2>
              <p className="text-sm text-gray-600">
                Cache performansı ve bellek kullanımı
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-blue-50 border-blue-200' : ''}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Otomatik' : 'Manuel'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={updateStats}
            >
              <Activity className="w-4 h-4 mr-1" />
              Yenile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Memory Usage */}
          {memoryUsage && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bellek Kullanımı</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Query</p>
                      <p className="text-2xl font-bold text-gray-900">{memoryUsage.queryCount}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Boyut</p>
                      <p className="text-2xl font-bold text-gray-900">{formatBytes(memoryUsage.totalSize)}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ortalama Boyut</p>
                      <p className="text-2xl font-bold text-gray-900">{formatBytes(memoryUsage.averageSize)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Performance Report */}
          {performanceReport && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Performansı</h3>
              <div className="space-y-4">
                {Object.entries(performanceReport).map(([strategy, stats]: [string, any]) => (
                  <Card key={strategy} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">{strategy}</h4>
                        <p className="text-sm text-gray-600">{stats.hits + stats.misses} toplam istek</p>
                      </div>
                      <Badge 
                        variant={parseFloat(stats.hitRate) > 80 ? 'default' : 
                               parseFloat(stats.hitRate) > 60 ? 'secondary' : 'destructive'}
                      >
                        {stats.hitRate} Hit Rate
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Hits</p>
                        <p className="font-semibold text-green-600">{stats.hits}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Misses</p>
                        <p className="font-semibold text-red-600">{stats.misses}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Size</p>
                        <p className="font-semibold text-blue-600">{stats.size}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Hit Rate</span>
                        <span>{stats.hitRate}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            parseFloat(stats.hitRate) > 80 ? 'bg-green-500' :
                            parseFloat(stats.hitRate) > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: stats.hitRate }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Cache Yönetimi</h4>
              <p className="text-sm text-gray-600">Cache performansını optimize edin</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleOptimize}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Optimize Et
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCache}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <TrendingDown className="w-4 h-4 mr-1" />
                Cache Temizle
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
