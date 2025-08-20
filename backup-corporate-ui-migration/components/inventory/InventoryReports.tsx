import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { Separator } from '@/components/ui/separator'
import { useInventoryReports } from '@/hooks/useInventoryReports'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  Download,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Printer,
  Share2
} from 'lucide-react'

const InventoryReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const {
    reportData,
    loading,
    error,
    filters,
    setFilters,
    generateReport,
    exportReport,
    refreshReport
  } = useInventoryReports()

  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
    handleFilterChange(field, value)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Rapor oluşturuluyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">{error}</p>
          <CorporateButton onClick={refreshReport} className="mt-2">
            Tekrar Dene
          </CorporateButton>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Rapor verisi bulunamadı</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtreler ve Kontroller */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Rapor Filtreleri
          </CorporateCardTitle>
          <CardDescription>
            Rapor parametrelerini ayarlayın ve verileri filtreleyin
          </CardDescription>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="corporate-form-group">
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              />
            </div>
            <div className="corporate-form-group">
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              />
            </div>
            <div className="corporate-form-group">
              <Label>İnaktif Ürünler</Label>
              <Select
                value={filters.includeInactive ? 'true' : 'false'}
                onValueChange={(value) => handleFilterChange('includeInactive', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Dahil Etme</SelectItem>
                  <SelectItem value="true">Dahil Et</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <CorporateButton onClick={generateReport} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Raporu Yenile
              </CorporateButton>
            </div>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CorporateCard>
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Ürün</p>
                <p className="text-2xl font-bold">{formatNumber(reportData.totalItems)}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Değer</p>
                <p className="text-2xl font-bold">{formatCurrency(reportData.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Düşük Stok</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(reportData.lowStockItems)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tükenen Ürünler</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(reportData.outOfStockItems)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Eylem Butonları */}
      <div className="flex flex-wrap gap-2">
        <CorporateButton onClick={() => exportReport('csv')} variant="neutral">
          <Download className="h-4 w-4 mr-2" />
          CSV İndir
        </CorporateButton>
        <CorporateButton onClick={() => exportReport('json')} variant="neutral">
          <Download className="h-4 w-4 mr-2" />
          JSON İndir
        </CorporateButton>
        <CorporateButton variant="neutral">
          <Printer className="h-4 w-4 mr-2" />
          Yazdır
        </CorporateButton>
        <CorporateButton variant="neutral">
          <Share2 className="h-4 w-4 mr-2" />
          Paylaş
        </CorporateButton>
      </div>

      {/* Raporlar */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="distribution">Dağılım</TabsTrigger>
          <TabsTrigger value="trends">Trendler</TabsTrigger>
          <TabsTrigger value="performance">Performans</TabsTrigger>
          <TabsTrigger value="alerts">Uyarılar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kategori Dağılımı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Kategori Dağılımı
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                    >
                      {reportData.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [formatNumber(value as number), 'Adet']} />
                  </PieChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>

            {/* En Değerli Ürünler */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  En Değerli Ürünler
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-3">
                  {reportData.topValueItems.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CorporateBadge variant="neutral">{index + 1}</CorporateBadge>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.totalValue)}</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(item.quantity)} adet</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </div>

          {/* Aylık Stok Değeri Trendi */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Aylık Stok Değeri Trendi
              </CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reportData.monthlyStockValue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Toplam Değer']} />
                  <Area type="monotone" dataKey="totalValue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lokasyon Dağılımı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Lokasyon Dağılımı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.locationDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatNumber(value as number), 'Adet']} />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>

            {/* Kategori Değer Dağılımı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Kategori Değer Dağılımı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Toplam Değer']} />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CorporateCardContent>
            </CorporateCard>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Stok Hareket Trendleri */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle>Stok Hareket Trendleri (Son 30 Gün)</CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportData.stockMovementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="inbound" stroke="#10B981" strokeWidth={2} name="Giriş" />
                  <Line type="monotone" dataKey="outbound" stroke="#EF4444" strokeWidth={2} name="Çıkış" />
                  <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} name="Net" />
                </LineChart>
              </ResponsiveContainer>
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stok Devir Hızı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Kategori Bazında Stok Devir Hızı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-3">
                  {reportData.stockTurnoverRate.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(item.totalMovements)} hareket</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.turnoverRate.toFixed(2)}x</p>
                        <p className="text-sm text-muted-foreground">{item.averageDaysInStock} gün</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>

            {/* Tedarikçi Performansı */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Tedarikçi Performansı</CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-3">
                  {reportData.supplierPerformance.slice(0, 5).map((supplier, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{supplier.supplier}</p>
                        <CorporateBadge variant="neutral">{formatNumber(supplier.totalOrders)} sipariş</CorporateBadge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Teslimat</p>
                          <p className="font-medium">{supplier.averageDeliveryTime.toFixed(1)} gün</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Kalite</p>
                          <p className="font-medium">{supplier.qualityRating.toFixed(1)}/5</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Zamanında</p>
                          <p className="font-medium">{supplier.onTimeDeliveryRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Son Kullanma Tarihi Uyarıları */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Son Kullanma Tarihi Uyarıları
              </CorporateCardTitle>
              <CardDescription>
                30 gün içinde sona erecek ürünler
              </CardDescription>
            </CorporateCardHeader>
            <CorporateCardContent>
              {reportData.expiryAlerts.length > 0 ? (
                <div className="space-y-3">
                  {reportData.expiryAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CorporateBadge 
                          variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'warning' ? 'default' : 'secondary'
                          }
                        >
                          {alert.severity === 'critical' ? 'Kritik' :
                           alert.severity === 'warning' ? 'Uyarı' : 'Bilgi'}
                        </CorporateBadge>
                        <div>
                          <p className="font-medium">{alert.name}</p>
                          <p className="text-sm text-muted-foreground">{alert.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{alert.daysUntilExpiry} gün kaldı</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(alert.quantity)} adet</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Yakın zamanda sona erecek ürün bulunmuyor</p>
                </div>
              )}
            </CorporateCardContent>
          </CorporateCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InventoryReports