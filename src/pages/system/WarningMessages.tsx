import { useMemo, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { exportToCsv } from '@lib/exportToCsv'
import { AlertTriangle, Trash2, RefreshCw, Search } from 'lucide-react'
import { Button } from '@components/ui/button'

interface WarningMessage {
  id: string
  message: string
  url: string
  lastOccurrence: string
  repeatCount: number
  ipAddress: string
  userAgent: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
}

const mockWarningMessages: WarningMessage[] = [
  {
    id: '1',
    message: 'Kullanıcı adı veya şifre hatalı',
    url: 'http://172.29.188.109/login',
    lastOccurrence: '09.08.2025 02:01:09',
    repeatCount: 6,
    ipAddress: '172.29.188.109',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'Medium'
  },
  {
    id: '2',
    message: 'Hızlı geri bildirim için tanımlı kategori bulunamadı. Ayrıca "İş Kategorisi " içindeki "İş Kaydı Birimleri " sekmesindeki birimlerde "Hızlı Geri Bildirim Yapılabilir" işaretlenmiş olmalıdır. Lütfen sistem yöneticinizle iletişime geçiniz.',
    url: 'http://172.29.188.109/crea/feedback',
    lastOccurrence: '06.08.2025 19:42:59',
    repeatCount: 1,
    ipAddress: '172.29.188.109',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'High'
  },
  {
    id: '3',
    message: 'Kullanıcı adı veya şifre hatalı',
    url: 'http://172.29.178.79/login',
    lastOccurrence: '24.07.2025 13:04:34',
    repeatCount: 2,
    ipAddress: '172.29.178.79',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
    severity: 'Medium'
  },
  {
    id: '4',
    message: 'Kullanıcı adı veya şifre hatalı',
    url: 'http://172.22.217.56/login',
    lastOccurrence: '12.07.2025 01:56:45',
    repeatCount: 7,
    ipAddress: '172.22.217.56',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'High'
  },
  {
    id: '5',
    message: 'Şifreler uyuşmuyor',
    url: 'http://172.22.217.56/repassword',
    lastOccurrence: '17.06.2025 14:33:36',
    repeatCount: 1,
    ipAddress: '172.22.217.56',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'Low'
  },
  {
    id: '6',
    message: 'Lütfen daha önce kullanılmayan bir şifre belirleyiniz',
    url: 'http://172.22.217.56/repassword',
    lastOccurrence: '17.06.2025 14:33:01',
    repeatCount: 1,
    ipAddress: '172.22.217.56',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'Low'
  },
  {
    id: '7',
    message: 'Durum bilgisi sıfır olamaz',
    url: 'http://172.22.217.56/crea/relief/service/detail/906',
    lastOccurrence: '02.06.2025 15:28:12',
    repeatCount: 3,
    ipAddress: '172.22.217.56',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'Medium'
  },
  {
    id: '8',
    message: 'nurettin nicki ile giriş yapmaya çalışan kullanıcının hatalı giriş denemesinden dolayı ip engellemesi',
    url: 'http://192.168.48.44/login',
    lastOccurrence: '12.05.2025 04:43:51',
    repeatCount: 1,
    ipAddress: '192.168.48.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'Critical'
  }
]

export default function WarningMessages() {
  const [query, setQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [ipFilter, setIpFilter] = useState('')
  
  const filtered = useMemo(() => {
    let result = mockWarningMessages
    
    if (selectedSeverity !== 'all') {
      result = result.filter(warning => warning.severity === selectedSeverity)
    }
    
    if (ipFilter) {
      result = result.filter(warning => warning.ipAddress.includes(ipFilter))
    }
    
    if (query) {
      result = result.filter((warning) => 
        JSON.stringify(warning).toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return result
  }, [query, selectedSeverity, ipFilter])

  const severityOptions = [...new Set(mockWarningMessages.map((w) => w.severity))]
  const totalWarnings = filtered.length
  const criticalWarnings = filtered.filter(w => w.severity === 'Critical').length
  const totalRepeats = filtered.reduce((acc, w) => acc + w.repeatCount, 0)

  const columns: Column<WarningMessage>[] = [
    { 
      key: 'message', 
      header: 'Uyarı Mesajı',
      render: (value: unknown) => (
        <div className="max-w-md">
          <p className="text-sm truncate" title={String(value || '')}>
            {String(value || '')}
          </p>
        </div>
      )
    },
    { 
      key: 'url', 
      header: 'URL',
      render: (value: unknown) => (
        <div className="max-w-xs">
          <p className="text-sm text-semantic-info truncate" title={String(value || '')}>
            {String(value || '')}
          </p>
        </div>
      )
    },
    { key: 'lastOccurrence', header: 'Son Oluşma' },
    { 
      key: 'repeatCount', 
      header: 'Tekrar',
      render: (value: unknown) => {
        const count = Number(value) || 0;
        return (
          <span className={`font-medium ${
            count > 5 ? 'text-semantic-danger' : count > 2 ? 'text-semantic-warning' : 'text-muted-foreground'
          }`}>
            {count}
          </span>
        )
      }
    },
    { key: 'ipAddress', header: 'IP Adresi' },
    { 
      key: 'severity', 
      header: 'Önem',
      render: (value: unknown) => {
        const colors = {
          'Low': 'bg-muted/50 text-muted-foreground',
          'Medium': 'bg-semantic-warning/10 text-semantic-warning',
          'High': 'bg-semantic-danger/10 text-semantic-danger',
          'Critical': 'bg-semantic-danger/10 text-semantic-danger'
        } as const
        const labels = {
          'Low': 'Düşük',
          'Medium': 'Orta',
          'High': 'Yüksek',
          'Critical': 'Kritik'
        } as const
        const severity = String(value || 'Low') as keyof typeof colors
        return (
          <span className={`rounded-full px-2 py-1 text-xs ${colors[severity] || colors['Low']}`}>
            {labels[severity] || labels['Low']}
          </span>
        )
      }
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (record: WarningMessage) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="soft-destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            startIcon={<Trash2 className="h-4 w-4" />}
          >
            Tümünü Sil
          </Button>
          <Button
            variant="soft-primary"
            size="sm"
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Yenile
          </Button>
        </div>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="rounded border bg-background px-2 py-1 text-sm"
        >
          <option value="all">Tüm Önem Seviyeleri</option>
          {severityOptions.map(severity => (
            <option key={severity} value={severity}>
              {severity === 'Low' ? 'Düşük' :
                severity === 'Medium' ? 'Orta' :
                severity === 'High' ? 'Yüksek' : 'Kritik'}
            </option>
          ))}
        </select>
        <input
          value={ipFilter}
          onChange={(e) => setIpFilter(e.target.value)}
          className="w-40 rounded border px-2 py-1 text-sm"
          placeholder="IP Adresi"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-64 flex-1 rounded border px-2 py-1 text-sm"
          placeholder="Uyarı mesajı ara..."
        />
        <Button
          variant="success"
          size="sm"
          startIcon={<Search className="h-4 w-4" />}
        >
          Ara
        </Button>
        <Button
          variant='soft-primary'
          size='sm'
          onClick={() => exportToCsv('uyari-mesajlari.csv', filtered)}
        >
          İndir
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          {totalWarnings} Kayıt
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-semantic-warning" />
            <h3 className="text-sm font-medium text-muted-foreground">Toplam Uyarı</h3>
          </div>
          <p className="text-2xl font-bold">{totalWarnings}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-semantic-danger" />
            <h3 className="text-sm font-medium text-muted-foreground">Kritik Uyarılar</h3>
          </div>
          <p className="text-2xl font-bold text-semantic-danger">{criticalWarnings}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Toplam Tekrar</h3>
          <p className="text-2xl font-bold text-semantic-warning">{totalRepeats}</p>
        </div>
        <div className="rounded border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Benzersiz IP</h3>
          <p className="text-2xl font-bold text-semantic-info">
            {new Set(filtered.map(w => w.ipAddress)).size}
          </p>
        </div>
      </div>

      {/* Warning Types Summary */}
      <div className="rounded border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Uyarı Türleri Dağılımı</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {severityOptions.map(severity => {
            const count = filtered.filter(w => w.severity === severity).length
            const percentage = totalWarnings > 0 ? (count / totalWarnings * 100).toFixed(1) : 0
            const label = severity === 'Low' ? 'Düşük' :
                          severity === 'Medium' ? 'Orta' :
                          severity === 'High' ? 'Yüksek' : 'Kritik'
            const color = severity === 'Low' ? 'text-muted-foreground' :
                severity === 'Medium' ? 'text-semantic-warning' :
                severity === 'High' ? 'text-semantic-danger' : 'text-semantic-danger'
            
            return (
              <div key={severity} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`text-lg font-bold ${color}`}>{count}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">%{percentage}</div>
              </div>
            )
          })}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  )
}
