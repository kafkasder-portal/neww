import { 
  Coins, 
  FileText, 
  TrendingUp,
  Calendar,
  MessageSquare,
  PieChart,
  Activity,
  Settings,
  X,
  BarChart3,
  MapPin,
  Users,
  DollarSign,
  Zap,
  Heart
} from 'lucide-react'
// FinancialCard components removed - files deleted
import { Link } from 'react-router-dom'
import { DashboardCharts } from '@components/DashboardCharts'
import { DashboardCustomizer } from '@components/dashboard/DashboardCustomizer'
import { CacheMonitor } from '@components/performance/CacheMonitor'
import { ReportGenerator } from '@components/reports/ReportGenerator'
import { ChartDashboard } from '@components/charts/ChartDashboard'
import { WhatsAppManager } from '@components/whatsapp/WhatsAppManager'
import { MapDashboard } from '@components/maps/MapDashboard'
import { Skeleton, SkeletonGroup, CardSkeleton } from '@components/ui/skeleton'
import { EmptyState, NoDataFound } from '@components/ui/empty-state'
import { useDashboardCustomization } from '@hooks/useDashboardCustomization'
import { 
  CorporateButton,
  CorporateCard,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateCardContent,
  KPICard,
  CorporateProgress
} from '@components/ui/corporate/CorporateComponents'
import { useState, useEffect } from 'react'
import { useDesignSystem } from '@/hooks/useDesignSystem'

export default function DashboardIndex() {
  const { colors, styles, utils } = useDesignSystem()

  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showCacheMonitor, setShowCacheMonitor] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [showChartDashboard, setShowChartDashboard] = useState(false)
  const [showWhatsAppManager, setShowWhatsAppManager] = useState(false)
  const [showMapDashboard, setShowMapDashboard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { settings, updateWidgets } = useDashboardCustomization()
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6 p-6 bg-corporate-neutral-50 min-h-screen">
      {/* Hoş Geldin Bölümü */}
      <CorporateCard className="bg-gradient-to-r from-corporate-primary-600 to-corporate-primary-700 text-white shadow-lg relative overflow-hidden">
        <CorporateCardContent className="p-6 sm:p-8 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Hoş Geldiniz, Ahmet Kaya
              </h1>
              <p className="text-corporate-primary-100 text-sm sm:text-base">
                Dernek Yönetim Paneli - Bugün {new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <CorporateButton
                variant="outline"
                size="sm"
                onClick={() => setShowCustomizer(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Özelleştir
              </CorporateButton>
            </div>
          </div>
        </CorporateCardContent>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </CorporateCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} className="h-32" />
          ))
        ) : (
          <>
            <KPICard 
              title="Toplam Yardım Alanlar"
              value="2,847"
              change={{ value: 12, isPositive: true }}
              icon={<Users className="w-5 h-5 text-corporate-primary-600" />}
            />
            <KPICard 
              title="Toplam Bağışlar"
              value="₺1,245,680"
              change={{ value: 8, isPositive: true }}
              icon={<Heart className="w-5 h-5 text-corporate-danger-500" />}
            />
            <KPICard 
              title="Aktif Başvurular"
              value="156"
              change={{ value: 23, isPositive: true }}
              icon={<FileText className="w-5 h-5 text-corporate-warning-500" />}
            />
            <KPICard 
              title="Aylık Büyüme"
              value="%15.2"
              change={{ value: 2.1, isPositive: true }}
              icon={<TrendingUp className="w-5 h-5 text-corporate-success-500" />}
            />
          </>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          <>
            <CardSkeleton className="h-80" />
            <CardSkeleton className="h-80" />
          </>
        ) : (
          <>
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-corporate-success-600" />
                  Aylık Yardım Dağılımı
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gıda Yardımı</span>
                    <span className="text-sm text-corporate-neutral-600 font-semibold">₺125,000</span>
                  </div>
                  <CorporateProgress value={75} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Eğitim Desteği</span>
                    <span className="text-sm text-corporate-neutral-600 font-semibold">₺85,000</span>
                  </div>
                  <CorporateProgress value={60} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sağlık Yardımı</span>
                    <span className="text-sm text-corporate-neutral-600 font-semibold">₺45,000</span>
                  </div>
                  <CorporateProgress value={35} />
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-corporate-warning-500" />
                  Hızlı İşlemler
                </CorporateCardTitle>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="grid grid-cols-2 gap-4">
                  <CorporateButton variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-corporate-primary-600" />
                    <span className="text-xs font-medium">Yeni Başvuru</span>
                  </CorporateButton>
                  <CorporateButton variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Heart className="h-6 w-6 text-corporate-danger-500" />
                    <span className="text-xs font-medium">Bağış Ekle</span>
                  </CorporateButton>
                  <CorporateButton variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <FileText className="h-6 w-6 text-corporate-success-600" />
                    <span className="text-xs font-medium">Rapor Oluştur</span>
                  </CorporateButton>
                  <CorporateButton variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="h-6 w-6 text-corporate-secondary-600" />
                    <span className="text-xs font-medium">Mesaj Gönder</span>
                  </CorporateButton>
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </>
        )}
      </div>

      {/* Dashboard Charts */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle>Performans Grafikleri</CorporateCardTitle>
          <p className="text-corporate-neutral-600">Aylık ve yıllık trendler</p>
        </CorporateCardHeader>
        <CorporateCardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <CardSkeleton className="h-96" />
              <CardSkeleton className="h-96" />
            </div>
          ) : (
            <DashboardCharts />
          )}
        </CorporateCardContent>
      </CorporateCard>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CorporateCard className="lg:col-span-2">
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-corporate-primary-600" />
              Son Aktiviteler
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            {isLoading ? (
              <SkeletonGroup count={4} className="space-y-3" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-corporate-primary-50 rounded-lg">
                  <div className="w-2 h-2 bg-corporate-primary-500 rounded-full"></div>
                  <span className="text-sm">Yeni yardım başvurusu alındı</span>
                  <span className="text-xs text-corporate-neutral-500 ml-auto">2 dakika önce</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-corporate-success-50 rounded-lg">
                  <div className="w-2 h-2 bg-corporate-success-500 rounded-full"></div>
                  <span className="text-sm">Bağış işlemi tamamlandı</span>
                  <span className="text-xs text-corporate-neutral-500 ml-auto">5 dakika önce</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-corporate-warning-50 rounded-lg">
                  <div className="w-2 h-2 bg-corporate-warning-500 rounded-full"></div>
                  <span className="text-sm">Rapor oluşturuldu</span>
                  <span className="text-xs text-corporate-neutral-500 ml-auto">10 dakika önce</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-corporate-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-corporate-secondary-500 rounded-full"></div>
                  <span className="text-sm">Sistem güncellemesi</span>
                  <span className="text-xs text-corporate-neutral-500 ml-auto">1 saat önce</span>
                </div>
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-corporate-secondary-600" />
              Bugünün Görevleri
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            {isLoading ? (
              <SkeletonGroup count={3} className="space-y-3" />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="corporate-form-checkbox" onChange={() => {}} />
                  <span className="text-sm">Başvuru değerlendirmeleri</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="corporate-form-checkbox" defaultChecked onChange={() => {}} />
                  <span className="text-sm line-through text-corporate-neutral-500">Aylık rapor hazırlama</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="corporate-form-checkbox" onChange={() => {}} />
                  <span className="text-sm">Bağışçı toplantısı</span>
                </div>
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Modal Components */}
      {showCustomizer && (
        <DashboardCustomizer 
          isOpen={showCustomizer} 
          onClose={() => setShowCustomizer(false)} 
        />
      )}

      {showCacheMonitor && (
        <CacheMonitor 
          isOpen={showCacheMonitor} 
          onClose={() => setShowCacheMonitor(false)} 
        />
      )}

      {showReportGenerator && (
        <ReportGenerator 
          isOpen={showReportGenerator} 
          onClose={() => setShowReportGenerator(false)} 
        />
      )}

      {showChartDashboard && (
        <ChartDashboard 
          isOpen={showChartDashboard} 
          onClose={() => setShowChartDashboard(false)} 
        />
      )}

      {showWhatsAppManager && (
        <WhatsAppManager 
          isOpen={showWhatsAppManager} 
          onClose={() => setShowWhatsAppManager(false)} 
        />
      )}

      {showMapDashboard && (
        <MapDashboard 
          isOpen={showMapDashboard} 
          onClose={() => setShowMapDashboard(false)} 
        />
      )}
    </div>
  )
}
