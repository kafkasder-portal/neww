import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  QrCode,
  Warehouse,
  Users,
  FileText,
  Settings,
  Download,
  Upload
} from 'lucide-react'
import { InventoryDashboard, InventoryItem, StockAlert } from '@/types/inventory'
import { formatCurrency, formatNumber } from '@/utils/format'
import InventoryReports from '@/components/inventory/InventoryReports'

// Mock data - gerçek uygulamada API'den gelecek
const mockDashboard: InventoryDashboard = {
  totalItems: 1247,
  totalValue: 2850000,
  lowStockItems: 23,
  outOfStockItems: 8,
  pendingMovements: 15,
  recentMovements: [],
  topCategories: [
    {
      category: { id: '1', name: 'Gıda Malzemeleri', code: 'FOOD', description: '', isActive: true, createdAt: '', updatedAt: '' },
      itemCount: 450,
      totalValue: 1200000
    },
    {
      category: { id: '2', name: 'Temizlik Malzemeleri', code: 'CLEAN', description: '', isActive: true, createdAt: '', updatedAt: '' },
      itemCount: 180,
      totalValue: 350000
    },
    {
      category: { id: '3', name: 'Kırtasiye', code: 'STAT', description: '', isActive: true, createdAt: '', updatedAt: '' },
      itemCount: 220,
      totalValue: 180000
    }
  ],
  stockAlerts: [
    {
      id: '1',
      itemId: '1',
      alertType: 'low_stock',
      message: 'Pirinç stoku minimum seviyenin altında',
      severity: 'high',
      isRead: false,
      isResolved: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      itemId: '2',
      alertType: 'out_of_stock',
      message: 'Deterjan stokta kalmadı',
      severity: 'critical',
      isRead: false,
      isResolved: false,
      createdAt: new Date().toISOString()
    }
  ],
  monthlyMovements: [
    { month: 'Ocak', inbound: 1200, outbound: 980, value: 450000 },
    { month: 'Şubat', inbound: 1350, outbound: 1100, value: 520000 },
    { month: 'Mart', inbound: 1180, outbound: 1250, value: 480000 }
  ]
}

const Inventory: React.FC = () => {
  const [dashboard, setDashboard] = useState<InventoryDashboard>(mockDashboard)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Gerçek uygulamada dashboard verilerini API'den çek
    // fetchDashboardData()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'low_stock':
      case 'out_of_stock':
        return <TrendingDown className="h-4 w-4" />
      case 'overstock':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Envanter Yönetimi</h1>
          <p className="text-gray-600 mt-1">Stok takibi, malzeme yönetimi ve depo operasyonları</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            İçe Aktar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboard.totalItems)}</div>
            <p className="text-xs text-muted-foreground">Aktif envanter kalemleri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Mevcut stok değeri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Düşük Stok</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboard.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Minimum seviyenin altında</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stokta Yok</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboard.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Acil tedarik gerekli</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="items">Ürünler</TabsTrigger>
          <TabsTrigger value="movements">Hareketler</TabsTrigger>
          <TabsTrigger value="locations">Lokasyonlar</TabsTrigger>
          <TabsTrigger value="suppliers">Tedarikçiler</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stok Uyarıları
                </CardTitle>
                <CardDescription>
                  Dikkat gerektiren stok durumları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.stockAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAlertIcon(alert.alertType)}
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity === 'critical' ? 'Kritik' : 
                         alert.severity === 'high' ? 'Yüksek' :
                         alert.severity === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                    </div>
                  ))}
                  {dashboard.stockAlerts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Herhangi bir uyarı bulunmuyor
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Kategori Dağılımı
                </CardTitle>
                <CardDescription>
                  En çok stok değerine sahip kategoriler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.topCategories.map((cat, index) => (
                    <div key={cat.category.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{cat.category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cat.itemCount} ürün
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(cat.totalValue)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((cat.totalValue / dashboard.totalValue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>
                Sık kullanılan envanter işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-xs">Yeni Ürün</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-xs">Stok Girişi</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <TrendingDown className="h-6 w-6" />
                  <span className="text-xs">Stok Çıkışı</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <QrCode className="h-6 w-6" />
                  <span className="text-xs">QR Tarama</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Warehouse className="h-6 w-6" />
                  <span className="text-xs">Sayım</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Rapor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Listesi</CardTitle>
              <CardDescription>
                Tüm envanter kalemleri ve stok durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Ürün
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ürün listesi bileşeni burada görüntülenecek</p>
                <p className="text-sm">Bu bileşen ayrı bir dosyada geliştirilecek</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Stok Hareketleri</CardTitle>
              <CardDescription>
                Giriş, çıkış ve transfer işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Stok hareketleri bileşeni burada görüntülenecek</p>
                <p className="text-sm">Bu bileşen ayrı bir dosyada geliştirilecek</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Depo Lokasyonları</CardTitle>
              <CardDescription>
                Depo, raf ve lokasyon yönetimi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Warehouse className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Lokasyon yönetimi bileşeni burada görüntülenecek</p>
                <p className="text-sm">Bu bileşen ayrı bir dosyada geliştirilecek</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Tedarikçiler</CardTitle>
              <CardDescription>
                Tedarikçi bilgileri ve satın alma süreçleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tedarikçi yönetimi bileşeni burada görüntülenecek</p>
                <p className="text-sm">Bu bileşen ayrı bir dosyada geliştirilecek</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Inventory