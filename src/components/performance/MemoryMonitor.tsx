import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { AlertTriangle, Trash2, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface MemoryInfo {
  used: number
  total: number
  limit: number
  percentage: number
}

interface MemoryHistoryEntry {
  timestamp: number
  memory: MemoryInfo
  url: string
}

interface DOMInfo {
  nodeCount: number
  elementCount: number
  listenerCount: number
}

export default function MemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null)
  const [memoryHistory, setMemoryHistory] = useState<MemoryHistoryEntry[]>([])
  const [domInfo, setDOMInfo] = useState<DOMInfo | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Memory API desteğini kontrol et
    if (!('memory' in performance)) {
      setIsSupported(false)
      return
    }

    updateMemoryInfo()
    updateDOMInfo()

    // İlk ölçümü al
    if (isMonitoring) {
      startMonitoring()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMonitoring])

  const updateMemoryInfo = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const info: MemoryInfo = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
      }
      
      setMemoryInfo(info)
      
      // History'ye ekle
      const entry: MemoryHistoryEntry = {
        timestamp: Date.now(),
        memory: info,
        url: window.location.pathname,
      }
      
      setMemoryHistory(prev => {
        const newHistory = [...prev, entry]
        // Son 100 girişi tut
        return newHistory.slice(-100)
      })
    }
  }

  const updateDOMInfo = () => {
    try {
      const nodeCount = document.querySelectorAll('*').length
      const elementCount = document.getElementsByTagName('*').length
      
      // Event listener sayısını tahmin et (yaklaşık)
      let listenerCount = 0
      const elements = document.querySelectorAll('*')
      elements.forEach(element => {
        // React event listener'ları için heuristic
        const reactProps = Object.keys(element as any).filter(key => key.startsWith('__react'))
        listenerCount += reactProps.length
      })

      setDOMInfo({
        nodeCount,
        elementCount,
        listenerCount,
      })
    } catch (error) {
      console.warn('DOM bilgisi alınamadı:', error)
    }
  }

  const startMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      updateMemoryInfo()
      updateDOMInfo()
    }, 2000) // Her 2 saniyede bir güncelle
  }

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }

  const toggleMonitoring = () => {
    setIsMonitoring(prev => {
      const newState = !prev
      if (newState) {
        startMonitoring()
      } else {
        stopMonitoring()
      }
      return newState
    })
  }

  const forceGarbageCollection = async () => {
    if ('gc' in window) {
      // Chrome DevTools'ta gc() fonksiyonu varsa
      try {
        (window as any).gc()
        // GC sonrası güncelle
        setTimeout(updateMemoryInfo, 100)
      } catch (error) {
        console.warn('Manual GC çalıştırılamadı:', error)
      }
    } else {
      // GC'yi tetiklemeye çalış
      const largeArray = new Array(1000000).fill(null)
      largeArray.length = 0
      
      // Force bir sürü allocation/deallocation
      for (let i = 0; i < 100; i++) {
        const temp = new Array(10000).fill(Math.random())
        temp.length = 0
      }
      
      setTimeout(updateMemoryInfo, 500)
    }
  }

  const clearHistory = () => {
    setMemoryHistory([])
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getMemoryStatus = (percentage: number) => {
    if (percentage > 80) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-100' }
    if (percentage > 60) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const getMemoryTrend = () => {
    if (memoryHistory.length < 10) return null
    
    const recent = memoryHistory.slice(-10)
    const oldAvg = recent.slice(0, 5).reduce((sum, entry) => sum + entry.memory.used, 0) / 5
    const newAvg = recent.slice(-5).reduce((sum, entry) => sum + entry.memory.used, 0) / 5
    
    const trend = newAvg - oldAvg
    const percentage = (trend / oldAvg) * 100
    
    return {
      direction: trend > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage),
      trend,
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Memory API Desteklenmiyor
          </CardTitle>
          <CardDescription>
            Bu tarayıcı Memory API&apos;sını desteklemiyor. Chrome veya Edge kullanmayı deneyin.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const memoryStatus = memoryInfo ? getMemoryStatus(memoryInfo.percentage) : null
  const trend = getMemoryTrend()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bellek Monitörü</h2>
          <p className="text-gray-600">
            JavaScript heap ve DOM bellek kullanımı
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={forceGarbageCollection}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            GC Tetikle
          </Button>
          <Button
            onClick={toggleMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isMonitoring ? 'animate-spin' : ''}`} />
            {isMonitoring ? 'Durdur' : 'Başlat'}
          </Button>
        </div>
      </div>

      {/* Memory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kullanılan Bellek</CardTitle>
          </CardHeader>
          <CardContent>
            {memoryInfo && (
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${memoryStatus?.color}`}>
                  {formatBytes(memoryInfo.used)}
                </div>
                <div className="text-sm text-gray-600">
                  %{memoryInfo.percentage} kullanılan
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full ${
                      memoryInfo.percentage > 80 ? 'bg-red-500' :
                      memoryInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${memoryInfo.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heap Boyutu</CardTitle>
          </CardHeader>
          <CardContent>
            {memoryInfo && (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {formatBytes(memoryInfo.total)}
                </div>
                <div className="text-sm text-gray-600">
                  Limit: {formatBytes(memoryInfo.limit)}
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 text-sm ${
                    trend.direction === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    %{trend.percentage.toFixed(1)} trend
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DOM Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            {domInfo && (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {domInfo.nodeCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  DOM node sayısı
                </div>
                <div className="text-xs text-gray-500">
                  Elements: {domInfo.elementCount.toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Memory History Chart */}
      {memoryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bellek Kullanım Geçmişi</CardTitle>
                <CardDescription>
                  Son {memoryHistory.length} ölçüm
                </CardDescription>
              </div>
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
              >
                Geçmişi Temizle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple ASCII chart */}
              <div className="relative h-32 border border-gray-200 rounded bg-gray-50 p-2">
                {memoryHistory.length > 1 && (
                  <svg className="w-full h-full">
                    {memoryHistory.map((entry, index) => {
                      if (index === 0) return null
                      
                      const prevEntry = memoryHistory[index - 1]
                      const x1 = ((index - 1) / (memoryHistory.length - 1)) * 100
                      const x2 = (index / (memoryHistory.length - 1)) * 100
                      const y1 = 100 - (prevEntry.memory.percentage * 0.8)
                      const y2 = 100 - (entry.memory.percentage * 0.8)
                      
                      return (
                        <line
                          key={index}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={entry.memory.percentage > 80 ? '#ef4444' : 
                                 entry.memory.percentage > 60 ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                        />
                      )
                    })}
                  </svg>
                )}
              </div>
              
              {/* Recent entries */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Son Ölçümler</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {memoryHistory.slice(-10).reverse().map((entry) => {
                    const status = getMemoryStatus(entry.memory.percentage)
                    return (
                      <div key={entry.timestamp} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {new Date(entry.timestamp).toLocaleTimeString('tr-TR')}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge className={`${status.bg} ${status.color} text-xs`}>
                            %{entry.memory.percentage}
                          </Badge>
                          <span className="text-gray-600">
                            {formatBytes(entry.memory.used)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tips */}
      {memoryInfo && memoryInfo.percentage > 70 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Bellek Kullanımı Yüksek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>Bellek kullanımınız yüksek. Performansı artırmak için:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Kullanılmayan sekmelerinizi kapatın</li>
                <li>Büyük dosya yüklemelerini kontrol edin</li>
                <li>Sayfayı yenilemeyi deneyin</li>
                <li>Browser extension&apos;larını devre dışı bırakın</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
