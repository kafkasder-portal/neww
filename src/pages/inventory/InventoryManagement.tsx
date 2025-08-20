import { CardDescription } from '@/components/ui/card'
import { CorporateButton, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { AlertTriangle, BarChart3, Package, Plus, Search, TrendingDown } from 'lucide-react'
import React from 'react'
import { DashboardLayout, createAddButton } from '../../components/common/DashboardLayout'
import { StatsCardProps, StatsGrid } from '../../components/common/StatsCard'

const InventoryManagement: React.FC = () => {
  const getDashboardStats = (): StatsCardProps[] => [
    {
      title: 'Toplam Ürün',
      value: '1,247',
      icon: Package,
      trend: { value: 5, isPositive: true },
      description: 'Aktif envanter kalemleri'
    },
    {
      title: 'Toplam Değer',
      value: '₺2,850,000',
      icon: BarChart3,
      trend: { value: 12, isPositive: true },
      description: 'Mevcut stok değeri'
    },
    {
      title: 'Düşük Stok',
      value: '23',
      icon: AlertTriangle,
      trend: { value: 3, isPositive: false },
      description: 'Minimum seviyenin altında'
    },
    {
      title: 'Stokta Yok',
      value: '8',
      icon: TrendingDown,
      trend: { value: 2, isPositive: false },
      description: 'Acil tedarik gerekli'
    }
  ];

  return (
    <DashboardLayout
      title="Envanter Yönetimi"
      subtitle="Stok takibi, malzeme yönetimi ve depo operasyonları"
      actions={[createAddButton('Yeni Ürün', () => console.log('Yeni ürün ekleme'))]}
      stats={getDashboardStats()}
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <StatsGrid stats={getDashboardStats()} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4">
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
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 border-red-200 rounded">Yüksek</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Deterjan stokta kalmadı</p>
                      <p className="text-xs text-muted-foreground">Bugün</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 border-red-200 rounded">Kritik</span>
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
                <CorporateButton variant="outline" className="h-20 flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-xs">Yeni Ürün</span>
                </CorporateButton>
                <CorporateButton variant="outline" className="h-20 flex-col gap-2">
                  <Search className="h-6 w-6" />
                  <span className="text-xs">Ürün Ara</span>
                </CorporateButton>
                <CorporateButton variant="outline" className="h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-xs">Raporlar</span>
                </CorporateButton>
                <CorporateButton variant="outline" className="h-20 flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span className="text-xs">Sayım</span>
                </CorporateButton>
              </div>
            </CorporateCardContent>
          </CorporateCard>
        </div>

        {/* Coming Soon Notice */}
        <CorporateCard>
          <CorporateCardContent className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Envanter Modülü Geliştiriliyor</h3>
            <p className="text-muted-foreground">
              Detaylı envanter yönetimi özellikleri yakında eklenecek.
            </p>
          </CorporateCardContent>
        </CorporateCard>
      </div>
    </DashboardLayout>
  )
}

export default InventoryManagement
