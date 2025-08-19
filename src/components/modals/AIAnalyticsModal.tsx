import { useState, useEffect } from 'react'
import { X, TrendingUp, BarChart3, Brain, Clock, Target } from 'lucide-react'

interface AIAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
}

export function AIAnalyticsModal({ isOpen, onClose, userId }: AIAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadAnalytics()
    }
  }, [isOpen, userId])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Mock analytics data for now since the methods don't exist yet
      const mockHistory = [
        { command: 'Hak sahibi listele', timestamp: new Date(), result: { success: true, message: 'Başarılı' } },
        { command: 'Bağış ekle', timestamp: new Date(), result: { success: true, message: 'Başarılı' } },
        { command: 'Rapor oluştur', timestamp: new Date(), result: { success: false, message: 'Hata' } }
      ]

      setAnalytics({
        totalCommands: mockHistory.length,
        successRate: 0.85,
        mostUsedCommands: [
          { command: 'Hak sahibi listele', count: 15 },
          { command: 'Bağış ekle', count: 12 },
          { command: 'Rapor oluştur', count: 8 }
        ],
        learnedPatterns: [
          { pattern: 'Bağış işlemleri', successRate: 0.92, usageCount: 25, lastUsed: new Date() },
          { pattern: 'Rapor oluşturma', successRate: 0.78, usageCount: 18, lastUsed: new Date() }
        ],
        recentHistory: mockHistory,
        trends: calculateTrends(mockHistory)
      })
    } catch (error) {
      console.error('Analytics yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const calculateTrends = (history: any[]) => {
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    
    const recentCommands = history.filter(h => new Date(h.timestamp) > last7Days)
    const dailyUsage = new Map<string, number>()
    
    recentCommands.forEach(command => {
      const day = new Date(command.timestamp).toDateString()
      dailyUsage.set(day, (dailyUsage.get(day) || 0) + 1)
    })

    return {
      weeklyTotal: recentCommands.length,
      dailyAverage: recentCommands.length / 7,
      dailyBreakdown: Array.from(dailyUsage.entries())
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            <h2 className="text-lg font-semibold">AI Asistan Analitikleri</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Genel İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Toplam Komut</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {analytics.totalCommands}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Başarı Oranı</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {Math.round(analytics.successRate * 100)}%
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Öğrenilen Pattern</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {analytics.learnedPatterns.length}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">Haftalık Kullanım</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">
                    {analytics.trends.weeklyTotal}
                  </div>
                </div>
              </div>

              {/* En Çok Kullanılan Komutlar */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  En Çok Kullanılan Komutlar
                </h3>
                <div className="space-y-2">
                  {analytics.mostUsedCommands.map((cmd: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{cmd.command}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ 
                              width: `${(cmd.count / analytics.mostUsedCommands[0].count) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[2rem]">{cmd.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Öğrenilen Paternler */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Öğrenilen AI Paternleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analytics.learnedPatterns.map((pattern: any, index: number) => (
                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-700">
                          {pattern.pattern}
                        </span>
                        <span className="text-xs text-purple-600">
                          {Math.round(pattern.successRate * 100)}% başarı
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-600">
                        <span>{pattern.usageCount} kullanım</span>
                        <span>•</span>
                        <span>Son: {new Date(pattern.lastUsed).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Son Komut Geçmişi */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Son Komut Geçmişi
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analytics.recentHistory.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border-l-4 ${
                        item.result.success 
                          ? 'bg-green-50 border-green-400' 
                          : 'bg-red-50 border-red-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.command}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.result.success 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.result.success ? '✅ Başarılı' : '❌ Başarısız'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      {item.result.message && (
                        <div className="mt-1 text-sm text-gray-600">
                          {item.result.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Günlük Kullanım Trendi */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Son 7 Gün Kullanım Trendi
                </h3>
                <div className="space-y-2">
                  {analytics.trends.dailyBreakdown.map(([day, count]: [string, number], index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{new Date(day).toLocaleDateString('tr-TR')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                            style={{ 
                              width: `${Math.max((count / Math.max(...analytics.trends.dailyBreakdown.map(([, c]: [string, number]) => c))) * 100, 5)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm min-w-[2rem]">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Günlük ortalama: {Math.round(analytics.trends.dailyAverage * 10) / 10} komut
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Analitik verisi bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
