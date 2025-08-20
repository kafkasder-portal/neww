import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Package, Plus, Search, AlertTriangle, BarChart3, TrendingDown } from 'lucide-react'

const InventoryManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Envanter Yönetimi</h1>
          <p className="text-gray-600 mt-1">Stok takibi, malzeme yönetimi ve depo operasyonları</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CorporateButton size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </CorporateButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CorporateCard>
          <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CorporateCardTitle className="text-sm font-medium">Toplam Ürün</CorporateCardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Aktif envanter kalemleri</p>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CorporateCardTitle className="text-sm font-medium">Toplam Değer</CorporateCardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="text-2xl font-bold">₺2,850,000</div>
            <p className="text-xs text-muted-foreground">Mevcut stok değeri</p>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CorporateCardTitle className="text-sm font-medium">Düşük Stok</CorporateCardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">Minimum seviyenin altında</p>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CorporateCardTitle className="text-sm font-medium">Stokta Yok</CorporateCardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Acil tedarik gerekli</p>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Stok Uyarıları
            </CorporateCardTitle>
            <CardDescription>
              Dikkat gerektiren stok durumları
            </CardDescription>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Pirinç stoku minimum seviyenin altında</p>
                    <p className="text-xs text-muted-foreground">Bugün</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Yüksek</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Deterjan stokta kalmadı</p>
                    <p className="text-xs text-muted-foreground">Bugün</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Kritik</span>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        {/* Quick Actions */}
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle>Hızlı İşlemler</CorporateCardTitle>
            <CardDescription>
              Sık kullanılan envanter işlemleri
            </CardDescription>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="grid grid-cols-2 gap-4">
              <CorporateButton variant="neutral" className="h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-xs">Yeni Ürün</span>
              </CorporateButton>
              <CorporateButton variant="neutral" className="h-20 flex-col gap-2">
                <Search className="h-6 w-6" />
                <span className="text-xs">Ürün Ara</span>
              </CorporateButton>
              <CorporateButton variant="neutral" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Raporlar</span>
              </CorporateButton>
              <CorporateButton variant="neutral" className="h-20 flex-col gap-2">
                <Package className="h-6 w-6" />
                <span className="text-xs">Sayım</span>
              </CorporateButton>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Coming Soon Notice */}
      <CorporateCard>
        <CorporateCardContent className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Envanter Modülü Geliştiriliyor</h3>
          <p className="text-muted-foreground">
            Detaylı envanter yönetimi özellikleri yakında eklenecek.
          </p>
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}

export default InventoryManagement
