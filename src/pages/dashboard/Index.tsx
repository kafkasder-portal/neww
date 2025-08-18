import { 
  Coins, 
  FileText, 
  TrendingUp,
  Calendar,
  MessageSquare,
  PieChart,
  Activity,
  Settings,
  Database,
  X,
  BarChart3,
  MapPin
} from 'lucide-react'
import { TotalDonationsCard, MonthlyGrowthCard, ActiveBeneficiariesCard, FundDistributionCard } from '@components/FinancialCard'
import { Link } from 'react-router-dom'
import { DashboardCharts } from '@components/DashboardCharts'
import { DashboardCustomizer } from '@components/dashboard/DashboardCustomizer'
import { CacheMonitor } from '@components/performance/CacheMonitor'
import { ReportGenerator } from '@components/reports/ReportGenerator'
import { ChartDashboard } from '@components/charts/ChartDashboard'
import { WhatsAppManager } from '@components/whatsapp/WhatsAppManager'
import { MapDashboard } from '@components/maps/MapDashboard'
import { useDashboardCustomization } from '@hooks/useDashboardCustomization'
import { Button } from '@components/ui/button'
import { useState } from 'react'

export default function DashboardIndex() {
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showCacheMonitor, setShowCacheMonitor] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [showChartDashboard, setShowChartDashboard] = useState(false)
  const [showWhatsAppManager, setShowWhatsAppManager] = useState(false)
  const [showMapDashboard, setShowMapDashboard] = useState(false)
  const { settings, updateWidgets } = useDashboardCustomization()

  return (
    <div className="space-y-6">
      {/* Hoş Geldin Bölümü */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-600 rounded-xl p-6 sm:p-8 text-white shadow-lg relative">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">Hoş Geldiniz!</h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">Dernek finansal yönetim panelinize hoş geldiniz. Güncel durumu aşağıdan takip edebilirsiniz.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCacheMonitor(true)}
              className="text-white hover:bg-white/10"
            >
              <Database className="w-4 h-4 mr-1" />
              Cache
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomizer(true)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-1" />
              Kişiselleştir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportGenerator(true)}
              className="text-white hover:bg-white/10"
            >
              <FileText className="w-4 h-4 mr-1" />
              Rapor
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChartDashboard(true)}
              className="text-white hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Grafikler
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWhatsAppManager(true)}
              className="text-white hover:bg-white/10"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMapDashboard(true)}
              className="text-white hover:bg-white/10"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Harita
            </Button>
          </div>
        </div>
      </div>

      {/* Finansal İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalDonationsCard 
          totalDonations={45230}
          monthlyChange={8.2}
          trend={[42000, 43500, 44200, 45230]}
        />
        <ActiveBeneficiariesCard 
          count={1234}
          monthlyChange={12}
        />
        <MonthlyGrowthCard 
          growthRate={15.4}
          period="Son 30 gün"
        />
        <FundDistributionCard 
          distributionRate={87}
          target={85}
        />
      </div>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickAccessCard
          title="Yeni Başvuru"
          description="İhtiyaç sahibi başvurusu oluştur"
          icon={<FileText className="h-6 w-6" />}
          color="bg-brand-primary"
          link="/aid/applications"
        />
        <QuickAccessCard
          title="Bağış Kabul"
          description="Yeni bağış kaydı oluştur"
          icon={<Coins className="h-6 w-6" />}
          color="bg-financial-success"
          link="/donations/cash"
        />
        <QuickAccessCard
          title="Mesaj Gönder"
          description="Toplu mesaj gönderimi yap"
          icon={<MessageSquare className="h-6 w-6" />}
          color="bg-chart-5"
          link="/messages/bulk-send"
        />
        <QuickAccessCard
          title="Rapor Oluştur"
          description="Yardım raporu hazırla"
          icon={<PieChart className="h-6 w-6" />}
          color="bg-chart-7"
          link="/aid/reports"
        />
      </div>

      {/* Dashboard Charts */}
      <DashboardCharts />

      {/* Alt Kısım - 3 Sütun */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Son Aktiviteler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Son Aktiviteler</h3>
          </div>
          <div className="space-y-3">
            <ActivityItem
              title="Yeni başvuru onaylandı"
              subtitle="Ayşe Yılmaz - Nakdi Yardım"
              time="2 saat önce"
            />
            <ActivityItem
              title="Bağış alındı"
              subtitle="₺500 - Ahmet Demir"
              time="4 saat önce"
            />
            <ActivityItem
              title="Toplu mesaj gönderildi"
              subtitle="142 kişiye SMS gönderildi"
              time="6 saat önce"
            />
            <ActivityItem
              title="Yardım dağıtıldı"
              subtitle="₺1,200 - 3 aile"
              time="1 gün önce"
            />
          </div>
          <Link to="/aid" className="mt-4 block text-sm text-primary hover:underline">
            Tüm aktiviteleri gör →
          </Link>
        </div>

        {/* Bu Ayki Hedefler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bu Ayki Hedefler</h3>
          </div>
          <div className="space-y-4">
            <ProgressItem
              title="Bağış Hedefi"
              current={45670}
              target={60000}
              unit="₺"
            />
            <ProgressItem
              title="Yardım Dağıtımı"
              current={38240}
              target={45000}
              unit="₺"
            />
            <ProgressItem
              title="Yeni Başvuru"
              current={12}
              target={20}
              unit=""
            />
            <ProgressItem
              title="Burs Öğrenci"
              current={85}
              target={100}
              unit=""
            />
          </div>
        </div>

        {/* Yaklaşan Etkinlikler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Yaklaşan Etkinlikler</h3>
          </div>
          <div className="space-y-3">
            <EventItem
              title="Yönetim Kurulu Toplantısı"
              date="15 Ocak 2024"
              time="14:00"
            />
            <EventItem
              title="Bağış Kampanyası Lansmanı"
              date="20 Ocak 2024"
              time="10:00"
            />
            <EventItem
              title="İhtiyaç Sahipleri Ziyareti"
              date="25 Ocak 2024"
              time="09:00"
            />
            <EventItem
              title="Burs Öğrenci Buluşması"
              date="30 Ocak 2024"
              time="15:00"
            />
          </div>
          <Link to="/messages" className="mt-4 block text-sm text-primary hover:underline">
            Takvimi gör →
          </Link>
        </div>
      </div>
      
      {/* Dashboard Customizer Modal */}
      <DashboardCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        onSave={updateWidgets}
        currentWidgets={settings.widgets}
      />
      <CacheMonitor
        isOpen={showCacheMonitor}
        onClose={() => setShowCacheMonitor(false)}
      />
      {showReportGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Rapor Oluşturucu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReportGenerator(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <ReportGenerator />
            </div>
          </div>
        </div>
      )}
      {showChartDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Grafik Dashboard</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChartDashboard(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <ChartDashboard />
            </div>
          </div>
        </div>
      )}
      {showWhatsAppManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">WhatsApp Yöneticisi</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWhatsAppManager(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <WhatsAppManager />
            </div>
          </div>
        </div>
      )}
      {showMapDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Harita Yönetimi</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMapDashboard(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <MapDashboard />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QuickAccessCard({ title, description, icon, color, link }: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  link: string
}) {
  return (
    <Link to={link} className="group block">
      <div className="rounded-lg border bg-card p-4 transition-all hover:border-primary hover:shadow-md">
        <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

function ActivityItem({ title, subtitle, time }: {
  title: string
  subtitle: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function ProgressItem({ title, current, target, unit }: {
  title: string
  current: number
  target: number
  unit: string
}) {
  const percentage = Math.round((current / target) * 100)
  
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          {unit}{current.toLocaleString('tr-TR')} / {unit}{target.toLocaleString('tr-TR')}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div 
          className="h-2 rounded-full bg-primary transition-all duration-300" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">%{percentage} tamamlandı</p>
    </div>
  )
}

function EventItem({ title, date, time }: {
  title: string
  date: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3 rounded border p-2">
      <div className="flex h-12 w-12 flex-col items-center justify-center rounded bg-primary/10 text-primary">
        <span className="text-xs font-medium">{date.split(' ')[0]}</span>
        <span className="text-xs">{date.split(' ')[1]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
