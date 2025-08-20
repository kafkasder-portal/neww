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
  Zap,
  Bell,
  Search,
  MoreVertical
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { StatsCard, FeatureCard, WidgetCard, NotificationCard } from '@/components/ui/premium-cards'
import { PremiumSearch } from '@/components/ui/premium-forms'
import { Tooltip } from '@/components/ui/premium-modals'

// Mock data
const statsData = [
  {
    title: 'Toplam Yararlanıcı',
    value: '2,547',
    change: { value: 12.5, type: 'increase' as const, period: 'geçen ay' },
    icon: Users,
    color: 'success' as const
  },
  {
    title: 'Bu Ay Bağış',
    value: '₺458,942',
    change: { value: 8.2, type: 'increase' as const, period: 'geçen ay' },
    icon: DollarSign,
    color: 'info' as const
  },
  {
    title: 'Aktif Projeler',
    value: '24',
    change: { value: 3.1, type: 'decrease' as const, period: 'geçen ay' },
    icon: Activity,
    color: 'warning' as const
  },
  {
    title: 'Gönüllü Sayısı',
    value: '189',
    change: { value: 15.8, type: 'increase' as const, period: 'geçen ay' },
    icon: Heart,
    color: 'danger' as const
  }
]

const recentActivities = [
  {
    id: '1',
    title: 'Yeni Bağış Kaydı',
    message: 'Ahmet Yılmaz 5,000₺ bağış yaptı',
    time: '2 dakika önce',
    type: 'success' as const,
    unread: true
  },
  {
    id: '2',
    title: 'Yararlanıcı Başvurusu',
    message: 'Fatma Demir yeni başvuru oluşturdu',
    time: '15 dakika önce',
    type: 'info' as const,
    unread: true
  },
  {
    id: '3',
    title: 'Proje Güncellemesi',
    message: 'Eğitim projesi %80 tamamlandı',
    time: '1 saat önce',
    type: 'warning' as const
  },
  {
    id: '4',
    title: 'Sistem Bakımı',
    message: 'Scheduled maintenance completed',
    time: '3 saat önce',
    type: 'info' as const
  }
]

const quickActions = [
  {
    title: 'Yeni Bağış Kaydı',
    description: 'Hızlı bağış kaydı oluşturun ve takip edin',
    icon: DollarSign,
    href: '/donations/cash-donations',
    badge: 'Popüler'
  },
  {
    title: 'Yararlanıcı Ekle',
    description: 'Yeni yararlanıcı kaydı oluşturun',
    icon: Users,
    href: '/aid/beneficiaries'
  },
  {
    title: 'Rapor Oluştur',
    description: 'Mali ve operasyonel raporlar hazırlayın',
    icon: FileText,
    href: '/fund/complete-report'
  },
  {
    title: 'Gönüllü Yönetimi',
    description: 'Gönüllüleri yönetin ve görevlendirin',
    icon: Heart,
    href: '/volunteers'
  }
]

export default function DashboardIndex() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Loading Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded-xl animate-pulse-premium w-64" />
          <div className="h-4 bg-muted rounded-lg animate-pulse-premium w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse-premium" />
              <div className="h-8 bg-muted rounded animate-pulse-premium w-24" />
              <div className="h-3 bg-muted rounded animate-pulse-premium w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-heading-1 text-foreground">
              Dashboard
            </h1>
            <p className="text-body text-muted-foreground">
              Dernek yönetim sistemine hoş geldiniz
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <PremiumSearch
              placeholder="Arama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80"
            />
            
            <Tooltip content="Bildirimleri görüntüle">
              <button className="btn-ghost p-3">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-semantic-danger rounded-full animate-glow" />
              </button>
            </Tooltip>
            
            <Tooltip content="Ayarlar">
              <button className="btn-ghost p-3">
                <Settings className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            gradient={true}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <WidgetCard 
            title="Bağış Trendi"
            action={
              <div className="flex items-center gap-2">
                <button className="btn-ghost btn-sm">
                  <Filter className="h-4 w-4" />
                </button>
                <button className="btn-ghost btn-sm">
                  <Download className="h-4 w-4" />
                </button>
                <button className="btn-ghost btn-sm">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Grafik Yükleniyor...</p>
              </div>
            </div>
          </WidgetCard>

          {/* Quick Actions */}
          <WidgetCard title="Hızlı İşlemler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <FeatureCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  badge={action.badge}
                  href={action.href}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                />
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Right Column - Activities & Info */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <WidgetCard 
            title="Son Aktiviteler"
            action={
              <button className="btn-ghost btn-sm">
                <Eye className="h-4 w-4" />
                Tümünü Gör
              </button>
            }
          >
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <NotificationCard
                  key={activity.id}
                  title={activity.title}
                  message={activity.message}
                  time={activity.time}
                  type={activity.type}
                  unread={activity.unread}
                  className="animate-slide-right"
                  style={{ animationDelay: `${(index + 8) * 100}ms` }}
                />
              ))}
            </div>
          </WidgetCard>

          {/* System Status */}
          <WidgetCard title="Sistem Durumu">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Veritabanı</span>
                  <span className="text-semantic-success font-medium">Online</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-semantic-success to-semantic-success-light w-full rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API Servisleri</span>
                  <span className="text-semantic-success font-medium">Aktif</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-semantic-success to-semantic-success-light w-4/5 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Depolama</span>
                  <span className="text-semantic-warning font-medium">%75</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-semantic-warning to-semantic-warning-light w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </WidgetCard>

          {/* Quick Stats */}
          <WidgetCard title="Hızlı İstatistikler">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-semantic-info/10">
                    <MessageSquare className="h-4 w-4 text-semantic-info" />
                  </div>
                  <span className="text-sm text-foreground">Bekleyen Mesajlar</span>
                </div>
                <span className="font-semibold text-foreground">12</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-semantic-warning/10">
                    <Calendar className="h-4 w-4 text-semantic-warning" />
                  </div>
                  <span className="text-sm text-foreground">Bugünkü Görevler</span>
                </div>
                <span className="font-semibold text-foreground">8</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-semantic-success/10">
                    <TrendingUp className="h-4 w-4 text-semantic-success" />
                  </div>
                  <span className="text-sm text-foreground">Tamamlanan</span>
                </div>
                <span className="font-semibold text-foreground">24</span>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  )
}
