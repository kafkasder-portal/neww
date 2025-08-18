import { useState } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Download,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useErrorHandler } from '@hooks/useErrorHandler'
import { ErrorCategory, ErrorSeverity, ErrorLog } from '@services/errorService'
import { SEVERITY_COLORS } from '@/constants/colors'

// Use optimized severity colors from constants
const SEVERITY_BADGE_COLORS = {
  [ErrorSeverity.LOW]: SEVERITY_COLORS.low.tailwind,
  [ErrorSeverity.MEDIUM]: SEVERITY_COLORS.medium.tailwind,
  [ErrorSeverity.HIGH]: SEVERITY_COLORS.high.tailwind,
  [ErrorSeverity.CRITICAL]: SEVERITY_COLORS.critical.tailwind
}

// Optimized category colors using design system
const CATEGORY_COLORS = {
  [ErrorCategory.AUTHENTICATION]: 'bg-brand-50 text-brand-700 border-brand-200',
  [ErrorCategory.AUTHORIZATION]: 'bg-brand-50 text-brand-700 border-brand-200',
  [ErrorCategory.NETWORK]: 'bg-financial-info-light text-financial-info border-financial-info/30',
  [ErrorCategory.VALIDATION]: 'bg-financial-success-light text-financial-success border-financial-success/30',
  [ErrorCategory.DATABASE]: 'bg-financial-error-light text-financial-error border-financial-error/30',
  [ErrorCategory.SYSTEM]: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  [ErrorCategory.USER_INPUT]: 'bg-financial-warning-light text-financial-warning border-financial-warning/30',
  [ErrorCategory.EXTERNAL_SERVICE]: 'bg-chart-6 bg-opacity-10 text-chart-6 border-chart-6/30'
}

interface ErrorDashboardProps {
  isAdmin?: boolean
}

export function ErrorDashboard({ isAdmin = false }: ErrorDashboardProps) {
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [filters, setFilters] = useState<{
    category?: ErrorCategory
    severity?: ErrorSeverity
    resolved?: boolean
  }>({})


  const { 
    getErrorLogs, 
    getErrorStats, 
    markErrorAsResolved, 
    clearErrorLogs 
  } = useErrorHandler()

  const stats = getErrorStats()
  const logs = getErrorLogs({ ...filters, limit: 100 })

  const handleMarkAsResolved = (errorId: string) => {
    markErrorAsResolved(errorId, 'admin')
  }

  const handleClearLogs = () => {
    if (confirm('Tüm hata kayıtlarını silmek istediğinizden emin misiniz?')) {
      clearErrorLogs()
      setSelectedError(null)
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'Severity', 'Category', 'Message', 'Component', 'Action', 'Resolved'].join(','),
      ...logs.map(log => [
        log.id,
        log.timestamp,
        log.severity,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        log.context.component || '',
        log.context.action || '',
        log.resolved ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hata Yönetim Paneli</h2>
          <p className="text-gray-600 mt-1">Sistem hatalarını izleyin ve yönetin</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          
          {logs.length > 0 && (
            <Button onClick={exportLogs} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
          )}
          
          {isAdmin && logs.length > 0 && (
            <Button onClick={handleClearLogs} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Temizle
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Hata</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Çözülmemiş</p>
              <p className="text-2xl font-bold text-financial-error">{stats.unresolved}</p>
            </div>
            <XCircle className="w-8 h-8 text-financial-error/60" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Çözülmüş</p>
              <p className="text-2xl font-bold text-financial-success">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-financial-success/60" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kritik Hatalar</p>
              <p className="text-2xl font-bold text-financial-error">{stats.bySeverity[ErrorSeverity.CRITICAL]}</p>
            </div>
            <Clock className="w-8 h-8 text-financial-error/60" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Error List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filtreler:</span>
              </div>
              
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  severity: e.target.value as ErrorSeverity || undefined 
                }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Tüm Önem Seviyeleri</option>
                <option value={ErrorSeverity.LOW}>Düşük</option>
                <option value={ErrorSeverity.MEDIUM}>Orta</option>
                <option value={ErrorSeverity.HIGH}>Yüksek</option>
                <option value={ErrorSeverity.CRITICAL}>Kritik</option>
              </select>

              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  category: e.target.value as ErrorCategory || undefined 
                }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Tüm Kategoriler</option>
                <option value={ErrorCategory.AUTHENTICATION}>Kimlik Doğrulama</option>
                <option value={ErrorCategory.AUTHORIZATION}>Yetkilendirme</option>
                <option value={ErrorCategory.NETWORK}>Ağ</option>
                <option value={ErrorCategory.VALIDATION}>Doğrulama</option>
                <option value={ErrorCategory.DATABASE}>Veritabanı</option>
                <option value={ErrorCategory.SYSTEM}>Sistem</option>
                <option value={ErrorCategory.USER_INPUT}>Kullanıcı Girişi</option>
                <option value={ErrorCategory.EXTERNAL_SERVICE}>Harici Servis</option>
              </select>

              <select
                value={filters.resolved !== undefined ? String(filters.resolved) : ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  resolved: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Tüm Durumlar</option>
                <option value="false">Çözülmemiş</option>
                <option value="true">Çözülmüş</option>
              </select>

              {(filters.severity || filters.category || filters.resolved !== undefined) && (
                <Button
                  onClick={() => setFilters({})}
                  variant="outline"
                  size="sm"
                >
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </Card>

          {/* Error List */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Hata Kayıtları ({logs.length})</h3>
            
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Kayıtlı hata bulunamadı</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedError?.id === log.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                    onClick={() => setSelectedError(log)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={SEVERITY_BADGE_COLORS[log.severity]}>
                            {log.severity.toUpperCase()}
                          </Badge>
                          <Badge className={CATEGORY_COLORS[log.category]}>
                            {log.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {log.resolved && (
                            <Badge className="bg-financial-success-light text-financial-success border-financial-success/30">
                              ÇÖZÜLMÜŞ
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {log.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString('tr-TR')} • {log.context.component}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedError(log)
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!log.resolved && isAdmin && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsResolved(log.id)
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Error Detail */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Hata Detayı</h3>
            
            {selectedError ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID</label>
                  <p className="text-sm font-mono bg-gray-100 p-1 rounded">
                    {selectedError.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Mesaj</label>
                  <p className="text-sm">{selectedError.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Zaman</label>
                  <p className="text-sm">
                    {new Date(selectedError.timestamp).toLocaleString('tr-TR')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Bileşen</label>
                  <p className="text-sm">{selectedError.context.component || 'Bilinmiyor'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Eylem</label>
                  <p className="text-sm">{selectedError.context.action || 'Bilinmiyor'}</p>
                </div>

                {selectedError.context.userId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Kullanıcı</label>
                    <p className="text-sm">{selectedError.context.userEmail}</p>
                  </div>
                )}

                {selectedError.stack && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Stack Trace</label>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}

                {selectedError.context.additionalData && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ek Bilgiler</label>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(selectedError.context.additionalData, null, 2)}
                    </pre>
                  </div>
                )}

                {!selectedError.resolved && isAdmin && (
                  <Button
                    onClick={() => handleMarkAsResolved(selectedError.id)}
                    className="w-full"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Çözülmüş Olarak İşaretle
                  </Button>
                )}

                {selectedError.resolved && (
                  <div className="text-sm text-green-600">
                    ✓ {new Date(selectedError.resolvedAt!).toLocaleString('tr-TR')} tarihinde çözülmüş
                    {selectedError.resolvedBy && ` (${selectedError.resolvedBy})`}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Detayları görüntülemek için bir hata seçin</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
