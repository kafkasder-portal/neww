import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Heart,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

// New Design System Components
import { AppContent, AppShell } from '../../components/layouts/AppShell'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { ContentGrid, PageSection } from '../../components/ui/PageSection'
import { StatCardGroup } from '../../components/ui/StatCard'

/*
 * Dashboard Index - Main application dashboard with new design system
 * 
 * WHY: Ana kontrol paneli modern UI/UX ile güncellenecek
 * HOW: Yeni bileşenler ve token sistemi kullanılarak modernize edildi
 */

interface DashboardData {
  totalMembers: number
  totalBeneficiaries: number
  monthlyDonations: number
  activeProjects: number
  pendingTasks: number
  recentActivities: number
}

export default function DashboardIndex() {
  const [data, setData] = useState<DashboardData>({
    totalMembers: 0,
    totalBeneficiaries: 0,
    monthlyDonations: 0,
    activeProjects: 0,
    pendingTasks: 0,
    recentActivities: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulated data - replace with real API calls
      setTimeout(() => {
        setData({
          totalMembers: 156,
          totalBeneficiaries: 89,
          monthlyDonations: 25750,
          activeProjects: 12,
          pendingTasks: 7,
          recentActivities: 23
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Dashboard data loading error:', error)
      setLoading(false)
    }
  }

  // Format currency for Turkish Lira
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  // Dashboard statistics configuration
  const getDashboardStats = () => [
    {
      title: 'Toplam Üye',
      value: data.totalMembers,
      icon: <Users className="w-full h-full" />,
      trend: { value: 8, direction: 'up' as const, label: 'bu ay' },
      description: 'Aktif dernek üyesi',
      color: 'primary' as const
    },
    {
      title: 'İhtiyaç Sahipleri',
      value: data.totalBeneficiaries,
      icon: <Heart className="w-full h-full" />,
      trend: { value: 12, direction: 'up' as const, label: 'bu ay' },
      description: 'Yardım alan kişi',
      color: 'success' as const
    },
    {
      title: 'Aylık Bağış',
      value: formatCurrency(data.monthlyDonations),
      icon: <DollarSign className="w-full h-full" />,
      trend: { value: 15, direction: 'up' as const, label: 'geçen aya göre' },
      description: 'Bu ay toplanan bağış',
      color: 'info' as const
    },
    {
      title: 'Aktif Projeler',
      value: data.activeProjects,
      icon: <BarChart3 className="w-full h-full" />,
      trend: { value: 2, direction: 'up' as const, label: 'yeni proje' },
      description: 'Devam eden projeler',
      color: 'warning' as const
    },
    {
      title: 'Bekleyen Görevler',
      value: data.pendingTasks,
      icon: <Calendar className="w-full h-full" />,
      trend: { value: 3, direction: 'down' as const, label: 'azaldı' },
      description: 'Tamamlanmayı bekliyor',
      color: 'danger' as const
    },
    {
      title: 'Son Aktiviteler',
      value: data.recentActivities,
      icon: <Activity className="w-full h-full" />,
      trend: { value: 5, direction: 'up' as const, label: 'bu hafta' },
      description: 'Sistem aktivitesi',
      color: 'default' as const
    }
  ]

  // Loading state
  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
            <p className="text-ink-3">Dashboard yükleniyor...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Dernek faaliyetlerinizi takip edin ve yönetin"
        breadcrumbs={[
          { label: 'Ana Sayfa', icon: <Activity className="w-4 h-4" /> }
        ]}
        actions={[
          {
            label: 'Rapor Al',
            onClick: () => console.log('Report generation'),
            variant: 'outline',
            icon: <TrendingUp className="w-4 h-4" />
          },
          {
            label: 'Yeni Kayıt',
            onClick: () => console.log('New record'),
            variant: 'default',
            icon: <Plus className="w-4 h-4" />
          }
        ]}
      />

      <AppContent>
        {/* Statistics Section */}
        <PageSection
          id="dashboard-stats"
          title="Genel Durum"
          description="Dernek faaliyetlerinizin özet istatistikleri"
          spacing="md"
        >
          <StatCardGroup
            cards={getDashboardStats()}
            columns={3}
            gap="md"
          />
        </PageSection>

        {/* Quick Actions and Recent Activity */}
        <PageSection
          id="dashboard-actions"
          title="Hızlı Erişim"
          spacing="md"
        >
          <ContentGrid columns={2} gap="lg">
            {/* Quick Actions Card */}
            <div className="bg-surface border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-hierarchy-h3">Hızlı İşlemler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="flex items-center gap-3 w-full p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring text-left">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">Yeni Üye Kayıt</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring text-left">
                    <Heart className="w-5 h-5 text-success" />
                    <span className="font-medium">Yardım Başvurusu</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring text-left">
                    <DollarSign className="w-5 h-5 text-info" />
                    <span className="font-medium">Bağış Kaydı</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring text-left">
                    <MessageSquare className="w-5 h-5 text-warning" />
                    <span className="font-medium">Mesaj Gönder</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-surface border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-hierarchy-h3">Son Aktiviteler</h3>
              </div>
              <div className="p-6">
                <EmptyState
                  icon={<Zap className="w-full h-full" />}
                  title="Aktivite geçmişi"
                  description="Son sistem aktiviteleri burada görünecek."
                  size="sm"
                />
              </div>
            </div>
          </ContentGrid>
        </PageSection>

        {/* Welcome Message */}
        <PageSection
          id="welcome"
          spacing="sm"
          background="muted"
        >
          <div className="text-center py-8">
            <h2 className="text-hierarchy-h2 mb-2">
              Kafkasder Yönetim Paneline Hoşgeldiniz
            </h2>
            <p className="text-hierarchy-body max-w-2xl mx-auto">
              Dernek faaliyetlerinizi moderne teknoloji ile daha verimli yönetebilir,
              üyeleriniz ve ihtiyaç sahipleriyle daha etkili iletişim kurabilirsiniz.
            </p>
          </div>
        </PageSection>
      </AppContent>
    </AppShell>
  )
}
