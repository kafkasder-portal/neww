import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Heart,
  MessageSquare,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
// FinancialCard components removed - files deleted
import { useDesignSystem } from '@/hooks/useDesignSystem'
import { DashboardCharts } from '@components/DashboardCharts'
import { ChartDashboard } from '@components/charts/ChartDashboard'
import { DashboardCustomizer } from '@components/dashboard/DashboardCustomizer'
import { MapDashboard } from '@components/maps/MapDashboard'
import { CacheMonitor } from '@components/performance/CacheMonitor'
import { ReportGenerator } from '@components/reports/ReportGenerator'
import {
  CorporateBadge,
  CorporateButton,
  CorporateCard,
  CorporateCardContent,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateProgress
} from '@components/ui/corporate/CorporateComponents'
import { CardSkeleton, SkeletonGroup } from '@components/ui/skeleton'
import { WhatsAppManager } from '@components/whatsapp/WhatsAppManager'
import { useDashboardCustomization } from '@hooks/useDashboardCustomization'
import { useEffect, useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-br from-bg-muted via-white to-bg-primary/5/30">
      {/* Enhanced Welcome Section */}
      <div className="relative overflow-hidden">
        <CorporateCard className="bg-gradient-to-r from-bg-primary via-bg-primary/80 to-bg-primary/90 text-white shadow-2xl border-0 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 to-bg-primary/90/90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>

          <CorporateCardContent className="relative z-10 p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                      Hoş Geldiniz, Ahmet Kaya
                    </h1>
                    <p className="text-bg-primary/10 text-lg">
                      Dernek Yönetim Paneli - {new Date().toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Sistem Aktif</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">156 Aktif Kullanıcı</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">%15.2 Büyüme</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <CorporateButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomizer(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Özelleştir
                </CorporateButton>
                <CorporateButton
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Rapor İndir
                </CorporateButton>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} className="h-40" />
          ))
        ) : (
          <>
            <div className="group">
              <CorporateCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-bg-primary/5/50">
                <CorporateCardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-bg-primary" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Toplam Yardım Alanlar</h3>
                <p className="text-2xl font-bold text-foreground">2,847</p>
                    <div className="flex items-center gap-2">
                      <CorporateBadge variant="success" className="text-xs">Aktif</CorporateBadge>
                      <span className="text-xs text-muted-foreground">Bu ay</span>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>

            <div className="group">
              <CorporateCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-bg-green-500-50/50">
                <CorporateCardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-bg-green-500-600" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Toplam Bağışlar</h3>
                <p className="text-2xl font-bold text-foreground">₺1,245,680</p>
                    <div className="flex items-center gap-2">
                      <CorporateBadge variant="success" className="text-xs">Yükselen</CorporateBadge>
                      <span className="text-xs text-muted-foreground">Bu ay</span>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>

            <div className="group">
              <CorporateCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-bg-yellow-500-50/50">
                <CorporateCardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-bg-yellow-500-600" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">+23%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Aktif Başvurular</h3>
                <p className="text-2xl font-bold text-foreground">156</p>
                    <div className="flex items-center gap-2">
                      <CorporateBadge variant="warning" className="text-xs">Beklemede</CorporateBadge>
                      <span className="text-xs text-muted-foreground">Değerlendirme</span>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>

            <div className="group">
              <CorporateCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-bg-accent/5/50">
                <CorporateCardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-bg-accent" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">+2.1%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Aylık Büyüme</h3>
                <p className="text-2xl font-bold text-foreground">%15.2</p>
                    <div className="flex items-center gap-2">
                      <CorporateBadge variant="info" className="text-xs">Pozitif</CorporateBadge>
                      <span className="text-xs text-muted-foreground">Geçen aya göre</span>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {isLoading ? (
          <>
            <CardSkeleton className="h-96" />
            <CardSkeleton className="h-96" />
          </>
        ) : (
          <>
            <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CorporateCardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-bg-green-500-600" />
                    </div>
                    <div>
                      <CorporateCardTitle>Aylık Yardım Dağılımı</CorporateCardTitle>
                      <p className="text-sm text-muted-foreground">Bu ayki yardım dağılımı</p>
                    </div>
                  </div>
                  <CorporateButton variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Detay
                  </CorporateButton>
                </div>
              </CorporateCardHeader>
              <CorporateCardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Gıda Yardımı</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₺125,000</span>
                    </div>
                    <CorporateProgress value={75} variant="success" className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>75% tamamlandı</span>
                      <span>₺93,750 harcandı</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Eğitim Desteği</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₺85,000</span>
                    </div>
                    <CorporateProgress value={60} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>60% tamamlandı</span>
                      <span>₺51,000 harcandı</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium">Sağlık Yardımı</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₺45,000</span>
                    </div>
                    <CorporateProgress value={35} variant="warning" className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>35% tamamlandı</span>
                      <span>₺15,750 harcandı</span>
                    </div>
                  </div>
                </div>
              </CorporateCardContent>
            </CorporateCard>

            <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CorporateCardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-bg-yellow-500-600" />
                    </div>
                    <div>
                      <CorporateCardTitle>Hızlı İşlemler</CorporateCardTitle>
                      <p className="text-sm text-muted-foreground">Sık kullanılan işlemler</p>
                    </div>
                  </div>
                  <CorporateButton variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni
                  </CorporateButton>
                </div>
              </CorporateCardHeader>
              <CorporateCardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <CorporateButton
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Users className="h-6 w-6 text-bg-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Yeni Başvuru</span>
                  </CorporateButton>

                  <CorporateButton
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-3 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Heart className="h-6 w-6 text-bg-green-500-600" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Bağış Ekle</span>
                  </CorporateButton>

                  <CorporateButton
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-3 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <FileText className="h-6 w-6 text-bg-yellow-500-600" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Rapor Oluştur</span>
                  </CorporateButton>

                  <CorporateButton
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-3 hover:bg-secondary/5 hover:border-secondary/30 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <MessageSquare className="h-6 w-6 text-bg-secondary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Mesaj Gönder</span>
                  </CorporateButton>
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </>
        )}
      </div>

      {/* Enhanced Dashboard Charts */}
      <CorporateCard className="mt-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CorporateCardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-bg-primary" />
              </div>
              <div>
                <CorporateCardTitle>Performans Grafikleri</CorporateCardTitle>
                <p className="text-sm text-muted-foreground">Aylık ve yıllık trendler</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CorporateButton variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrele
              </CorporateButton>
              <CorporateButton variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </CorporateButton>
            </div>
          </div>
        </CorporateCardHeader>
        <CorporateCardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardSkeleton className="h-96" />
              <CardSkeleton className="h-96" />
            </div>
          ) : (
            <DashboardCharts />
          )}
        </CorporateCardContent>
      </CorporateCard>

      {/* Enhanced Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <CorporateCard className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CorporateCardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-bg-primary" />
                </div>
                <div>
                  <CorporateCardTitle>Son Aktiviteler</CorporateCardTitle>
                  <p className="text-sm text-muted-foreground">Sistem aktiviteleri</p>
                </div>
              </div>
              <CorporateButton variant="outline" size="sm">
                Tümünü Gör
              </CorporateButton>
            </div>
          </CorporateCardHeader>
          <CorporateCardContent className="p-6">
            {isLoading ? (
              <SkeletonGroup count={4} className="space-y-4" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Yeni yardım başvurusu alındı</p>
                    <p className="text-xs text-muted-foreground">Ahmet Yılmaz tarafından</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">2 dk önce</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Bağış işlemi tamamlandı</p>
                    <p className="text-xs text-muted-foreground">₺5,000 bağış alındı</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">5 dk önce</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Rapor oluşturuldu</p>
                    <p className="text-xs text-muted-foreground">Aylık rapor hazırlandı</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">10 dk önce</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Sistem güncellemesi</p>
                    <p className="text-xs text-muted-foreground">Yeni özellikler eklendi</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">1 saat önce</span>
                </div>
              </div>
            )}
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CorporateCardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-bg-secondary" />
              </div>
              <div>
                <CorporateCardTitle>Bugünün Görevleri</CorporateCardTitle>
                <p className="text-sm text-muted-foreground">Günlük görevler</p>
              </div>
            </div>
          </CorporateCardHeader>
          <CorporateCardContent className="p-6">
            {isLoading ? (
              <SkeletonGroup count={3} className="space-y-4" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-bg-primary bg-white border-border rounded focus:ring-bg-primary focus:ring-2" onChange={() => { }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Başvuru değerlendirmeleri</p>
                    <p className="text-xs text-muted-foreground">15 başvuru bekliyor</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-bg-primary bg-white border-border rounded focus:ring-bg-primary focus:ring-2" defaultChecked onChange={() => { }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground line-through">Aylık rapor hazırlama</p>
                    <p className="text-xs text-muted-foreground">Tamamlandı</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-bg-primary bg-white border-border rounded focus:ring-bg-primary focus:ring-2" onChange={() => { }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Bağışçı toplantısı</p>
                    <p className="text-xs text-muted-foreground">14:00 - Konferans Salonu</p>
                  </div>
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
          onSave={(widgets) => {
            updateWidgets(widgets)
            setShowCustomizer(false)
          }}
          currentWidgets={settings.widgets || []}
        />
      )}

      {showCacheMonitor && (
        <CacheMonitor
          isOpen={showCacheMonitor}
          onClose={() => setShowCacheMonitor(false)}
        />
      )}

      {showReportGenerator && (
        <ReportGenerator />
      )}

      {showChartDashboard && (
        <ChartDashboard />
      )}

      {showWhatsAppManager && (
        <WhatsAppManager />
      )}

      {showMapDashboard && (
        <MapDashboard />
      )}
    </div>
  )
}
