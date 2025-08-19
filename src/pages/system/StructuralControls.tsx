import { useMemo, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'
import { Database, CheckCircle, XCircle, AlertTriangle, Play, Settings } from 'lucide-react'
import { useDesignSystem } from '@/hooks/useDesignSystem'

interface StructuralControl {
  id: string
  name: string
  description: string
  type: 'Database' | 'API' | 'Service' | 'File System'
  status: 'Healthy' | 'Warning' | 'Error' | 'Unknown'
  lastCheck: string
  nextCheck: string
  details: string
  errorCount: number
  uptime: string
  responseTime: number
}

const mockControls: StructuralControl[] = [
  {
    id: '1',
    name: 'Veritabanı Bağlantısı',
    description: 'Ana PostgreSQL veritabanı bağlantı kontrolü',
    type: 'Database',
    status: 'Healthy',
    lastCheck: '2024-01-15 10:30:45',
    nextCheck: '2024-01-15 10:35:45',
    details: 'Bağlantı başarılı, 23 aktif session',
    errorCount: 0,
    uptime: '99.9%',
    responseTime: 12
  },
  {
    id: '2',
    name: 'API Endpoint Kontrolü',
    description: 'Harici API servislerinin erişilebilirlik kontrolü',
    type: 'API',
    status: 'Warning',
    lastCheck: '2024-01-15 10:29:12',
    nextCheck: '2024-01-15 10:34:12',
    details: 'Yavaş yanıt süresi tespit edildi',
    errorCount: 3,
    uptime: '98.2%',
    responseTime: 2300
  },
  {
    id: '3',
    name: 'Dosya Sistemi Kontrolü',
    description: 'Disk alanı ve dosya sistemи kontrolü',
    type: 'File System',
    status: 'Error',
    lastCheck: '2024-01-15 10:28:30',
    nextCheck: '2024-01-15 10:33:30',
    details: 'Disk alanı %85 dolu, temizlik gerekli',
    errorCount: 1,
    uptime: '95.8%',
    responseTime: 0
  },
  {
    id: '4',
    name: 'E-posta Servisi',
    description: 'SMTP sunucu bağlantı ve gönderim kontrolü',
    type: 'Service',
    status: 'Healthy',
    lastCheck: '2024-01-15 10:30:15',
    nextCheck: '2024-01-15 10:35:15',
    details: 'Servis çalışıyor, queue boş',
    errorCount: 0,
    uptime: '99.5%',
    responseTime: 156
  },
  {
    id: '5',
    name: 'Redis Cache',
    description: 'Redis önbellek sistemi kontrolü',
    type: 'Database',
    status: 'Warning',
    lastCheck: '2024-01-15 10:29:45',
    nextCheck: '2024-01-15 10:34:45',
    details: 'Bellek kullanımı %78, temizlik önerilir',
    errorCount: 0,
    uptime: '99.1%',
    responseTime: 8
  },
  {
    id: '6',
    name: 'Backup Sistemi',
    description: 'Otomatik yedekleme sistemi kontrolü',
    type: 'Service',
    status: 'Unknown',
    lastCheck: '2024-01-15 08:00:00',
    nextCheck: '2024-01-16 08:00:00',
    details: 'Son yedekleme 6 saat önce',
    errorCount: 0,
    uptime: '100%',
    responseTime: 0
  }
]

export default function StructuralControls() {
  const { colors, styles, utils } = useDesignSystem()

  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const filtered = useMemo(() => {
    let result = mockControls
    
    if (selectedType !== 'all') {
      result = result.filter(control => control.type === selectedType)
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(control => control.status === selectedStatus)
    }
    
    if (query) {
      result = result.filter((control) => 
        JSON.stringify(control).toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return result
  }, [query, selectedType, selectedStatus])

  const columns: Column<StructuralControl>[] = [
    { key: 'name', header: 'Kontrol Adı' },
    { key: 'description', header: 'Açıklama' },
    { 
      key: 'type', 
      header: 'Tip',
      render: (value: unknown) => {
        const colors = {
          'Database': 'bg-brand-primary/10 text-brand-primary',
          'API': 'bg-semantic-success/10 text-semantic-success',
          'Service': 'bg-semantic-info/10 text-semantic-info',
          'File System': 'bg-semantic-warning/10 text-semantic-warning'
        } as const
        const type = value as keyof typeof colors
        return (
          <span className={`rounded-full px-2 py-1 text-xs ${colors[type] || colors['Database']}`}>
            {String(value || '')}
          </span>
        )
      }
    },
    { 
      key: 'status', 
      header: 'Durum',
      render: (value: unknown) => {
        const config = {
          'Healthy': { icon: <CheckCircle className="icon h-4 w-4" />, color: 'bg-semantic-success/10 text-semantic-success' },
    'Warning': { icon: <AlertTriangle className="icon h-4 w-4" />, color: 'bg-semantic-warning/10 text-semantic-warning' },
    'Error': { icon: <XCircle className="icon h-4 w-4" />, color: 'bg-semantic-destructive/10 text-semantic-destructive' },
    'Unknown': { icon: <Database className="icon h-4 w-4" />, color: 'bg-muted text-muted-foreground' }
        } as const
        const statusValue = String(value || 'Unknown');
        const { icon, color } = config[statusValue as keyof typeof config] || config['Unknown']
        return (
          <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${color}`}>
            {icon}
            {statusValue === 'Healthy' ? 'Sağlıklı' : 
             statusValue === 'Warning' ? 'Uyarı' : 
             statusValue === 'Error' ? 'Hata' : 'Bilinmiyor'}
          </span>
        )
      }
    },
    { 
      key: 'responseTime', 
      header: 'Yanıt Süresi (ms)',
      render: (value: unknown) => {
        const num = Number(value) || 0;
        return num > 0 ? `${num}ms` : '-';
      }
    },
    { 
      key: 'uptime', 
      header: 'Çalışma Süresi',
      render: (value: unknown) => {
        const num = parseFloat(String(value || '0'));
        return (
          <span className={`font-medium ${
            num > 99 ? 'text-semantic-success' :
      num > 95 ? 'text-semantic-warning' : 'text-semantic-destructive'
          }`}>
            {String(value || '')}
          </span>
        )
      }
    },
    { key: 'errorCount', header: 'Hata Sayısı' },
    { key: 'lastCheck', header: 'Son Kontrol' },
    {
      key: 'actions',
      header: 'İşlemler',
      render: () => (
        <div className="flex gap-2">
          <button className="rounded p-1 text-semantic-success hover:bg-semantic-success/10" title="Şimdi Kontrol Et">
            <Play className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-brand-primary hover:bg-brand-primary/10" title="Ayarlar">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  const types = ['Database', 'API', 'Service', 'File System']
  const statuses = ['Healthy', 'Warning', 'Error', 'Unknown']
  
  const healthyCount = filtered.filter(c => c.status === 'Healthy').length
  const warningCount = filtered.filter(c => c.status === 'Warning').length
  const errorCount = filtered.filter(c => c.status === 'Error').length
  const totalErrors = filtered.reduce((sum, c) => sum + c.errorCount, 0)

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
        <button className="flex items-center gap-2 rounded bg-semantic-success px-3 py-1 text-sm text-white">
          <Play className="h-4 w-4" />
          Tümünü Kontrol Et
        </button>
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded border bg-background px-2 py-1 text-sm"
        >
          <option value="all">Tüm Tipler</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded border bg-background px-2 py-1 text-sm"
        >
          <option value="all">Tüm Durumlar</option>
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'Healthy' ? 'Sağlıklı' : 
               status === 'Warning' ? 'Uyarı' : 
               status === 'Error' ? 'Hata' : 'Bilinmiyor'}
            </option>
          ))}
        </select>
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="min-w-64 flex-1 rounded border px-2 py-1 text-sm" 
          placeholder="Kontrol ara..." 
        />
        <button className="rounded bg-brand-primary px-3 py-1 text-sm text-white">Ara</button>
        <button 
          onClick={() => exportToCsv('yapisal-kontroller.csv', filtered)} 
          className="rounded bg-muted-foreground px-3 py-1 text-sm text-white"
        >
          İndir
        </button>
        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} Kontrol
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded border bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="icon h-5 w-5 text-semantic-success" />
            <h3 className="text-sm font-medium text-muted-foreground">Sağlıklı</h3>
          </div>
          <p className="text-2xl font-bold text-semantic-success">{healthyCount}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="icon h-5 w-5 text-semantic-warning" />
            <h3 className="text-sm font-medium text-muted-foreground">Uyarı</h3>
          </div>
          <p className="text-2xl font-bold text-semantic-warning">{warningCount}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex items-center gap-2">
            <XCircle className="icon h-5 w-5 text-semantic-destructive" />
            <h3 className="text-sm font-medium text-muted-foreground">Hata</h3>
          </div>
          <p className="text-2xl font-bold text-semantic-destructive">{errorCount}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Toplam Hata</h3>
          <p className="text-2xl font-bold text-semantic-warning">{totalErrors}</p>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="rounded border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Sistem Sağlığı Genel Görünümü</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statuses.map(status => {
            const count = filtered.filter(c => c.status === status).length
            const percentage = filtered.length > 0 ? (count / filtered.length * 100).toFixed(1) : 0
            const label = status === 'Healthy' ? 'Sağlıklı' : 
                         status === 'Warning' ? 'Uyarı' : 
                         status === 'Error' ? 'Hata' : 'Bilinmiyor'
            const color = status === 'Healthy' ? 'text-semantic-success' :
          status === 'Warning' ? 'text-semantic-warning' :
          status === 'Error' ? 'text-semantic-destructive' : 'text-muted-foreground'
            
            return (
              <div key={status} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`text-lg font-bold ${color}`}>{count}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">%{percentage}</div>
                <div className="mt-2 h-2 w-full rounded bg-muted">
                  <div 
                    className={`h-full rounded ${
                      status === 'Healthy' ? 'bg-semantic-success' :
              status === 'Warning' ? 'bg-semantic-warning' :
              status === 'Error' ? 'bg-semantic-destructive' : 'bg-muted-foreground'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      {/* System Details */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded border bg-card p-4">
          <h3 className="mb-3 text-lg font-semibold">Son Kontrol Detayları</h3>
          <div className="space-y-3">
            {filtered.slice(0, 3).map(control => (
              <div key={control.id} className="border-b pb-2 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{control.name}</span>
                  <span className="text-sm text-muted-foreground">{control.lastCheck}</span>
                </div>
                <p className="text-sm text-muted-foreground">{control.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border bg-card p-4">
          <h3 className="mb-3 text-lg font-semibold">Performans Metrikleri</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Ortalama Yanıt Süresi</span>
              <span className="font-medium">
                {Math.round(filtered.filter(c => c.responseTime > 0).reduce((sum, c) => sum + c.responseTime, 0) / filtered.filter(c => c.responseTime > 0).length)}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Ortalama Çalışma Süresi</span>
              <span className="font-medium text-semantic-success">
                {(filtered.reduce((sum, c) => sum + parseFloat(c.uptime), 0) / filtered.length).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Aktif Kontrol Sayısı</span>
              <span className="font-medium">{filtered.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Son Güncelleme</span>
              <span className="font-medium">2024-01-15 10:30:45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
