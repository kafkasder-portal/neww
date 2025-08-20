import { supabase } from '@lib/supabase'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Package,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// New Design System Components
import { AppContent, AppShell } from '../../components/layouts/AppShell'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { ContentGrid, PageSection } from '../../components/ui/PageSection'
import { StatCardGroup } from '../../components/ui/StatCard'

interface DashboardStats {
  totalBeneficiaries: number
  pendingApplications: number
  monthlyAidAmount: number
  completedAids: number
  urgentApplications: number
  activeAidRecords: number
}

export default function AidIndex() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBeneficiaries: 0,
    pendingApplications: 0,
    monthlyAidAmount: 0,
    completedAids: 0,
    urgentApplications: 0,
    activeAidRecords: 0
  })
  const [recentApplications, setRecentApplications] = useState<{ id: string; title: string; description?: string; status: string; priority: string; created_at: string; beneficiaries?: { name: string; surname: string } }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // İhtiyaç sahipleri sayısı
      const { count: beneficiariesCount, error: beneficiariesError } = await supabase
        .from('beneficiaries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      if (beneficiariesError) {
        console.warn('Beneficiaries count error:', beneficiariesError)
      }

      // Bekleyen başvurular
      const { count: pendingCount, error: pendingError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (pendingError) {
        console.warn('Pending applications error:', pendingError)
      }

      // Acil başvurular
      const { count: urgentCount, error: urgentError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('priority', 'urgent')
        .eq('status', 'pending')

      if (urgentError) {
        console.warn('Urgent applications error:', urgentError)
      }

      // Bu ay tamamlanan yardımlar
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { count: completedCount, error: completedError } = await supabase
        .from('aid_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', `${currentMonth}-01`)

      if (completedError) {
        console.warn('Completed aids error:', completedError)
      }

      // Bu ay toplam yardım tutarı
      const { data: monthlyAids, error: monthlyError } = await supabase
        .from('aid_records')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', `${currentMonth}-01`)

      if (monthlyError) {
        console.warn('Monthly aids error:', monthlyError)
      }

      const monthlyTotal = monthlyAids?.reduce((sum, record) => {
        const amount = record.amount || 0
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0) || 0

      // Aktif yardım kayıtları
      const { count: activeCount, error: activeError } = await supabase
        .from('aid_records')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'distributed'])

      if (activeError) {
        console.warn('Active aid records error:', activeError)
      }

      // Son başvurular
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          beneficiaries (name, surname)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (applicationsError) {
        console.warn('Recent applications error:', applicationsError)
      }

      setStats({
        totalBeneficiaries: beneficiariesCount || 0,
        pendingApplications: pendingCount || 0,
        monthlyAidAmount: monthlyTotal,
        completedAids: completedCount || 0,
        urgentApplications: urgentCount || 0,
        activeAidRecords: activeCount || 0
      })

      setRecentApplications(applications || [])
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error)
      // Set default values on error
      setStats({
        totalBeneficiaries: 0,
        pendingApplications: 0,
        monthlyAidAmount: 0,
        completedAids: 0,
        urgentApplications: 0,
        activeAidRecords: 0
      })
      setRecentApplications([])
    } finally {
      setLoading(false)
    }
  }

  // Format stats for new StatCard components
  const getDashboardStats = () => [
    {
      title: 'Toplam İhtiyaç Sahibi',
      value: stats.totalBeneficiaries,
      icon: <Users className="w-full h-full" />,
      trend: { value: 5, direction: 'up' as const, label: 'önceki aya göre' },
      description: 'Kayıtlı ihtiyaç sahibi',
      color: 'primary' as const
    },
    {
      title: 'Bekleyen Başvurular',
      value: stats.pendingApplications,
      icon: <Clock className="w-full h-full" />,
      trend: { value: -3, direction: 'down' as const, label: 'önceki aya göre' },
      description: 'İnceleme bekliyor',
      color: 'warning' as const
    },
    {
      title: 'Acil Başvurular',
      value: stats.urgentApplications,
      icon: <AlertCircle className="w-full h-full" />,
      trend: { value: 2, direction: 'up' as const, label: 'önceki aya göre' },
      description: 'Öncelikli başvuru',
      color: 'danger' as const
    },
    {
      title: 'Bu Ay Tamamlanan',
      value: stats.completedAids,
      icon: <CheckCircle className="w-full h-full" />,
      trend: { value: 12, direction: 'up' as const, label: 'önceki aya göre' },
      description: 'Tamamlanan yardım',
      color: 'success' as const
    },
    {
      title: 'Bu Ay Toplam Tutar',
      value: formatCurrency(stats.monthlyAidAmount || 0),
      icon: <DollarSign className="w-full h-full" />,
      trend: { value: 8, direction: 'up' as const, label: 'önceki aya göre' },
      description: 'Aylık yardım tutarı',
      color: 'info' as const
    },
    {
      title: 'Aktif Yardım Kayıtları',
      value: stats.activeAidRecords,
      icon: <Package className="w-full h-full" />,
      trend: { value: 4, isPositive: true },
      description: 'Devam eden yardımlar'
    }
  ];

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '₺0,00'
    }
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Bekliyor', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      approved: { label: 'Onaylandı', class: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { label: 'Reddedildi', class: 'bg-red-100 text-red-800 border-red-200' },
      completed: { label: 'Tamamlandı', class: 'bg-blue-100 text-blue-800 border-blue-200' }
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, class: 'bg-gray-100 text-gray-800 border-gray-200' }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: 'Düşük', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      normal: { label: 'Normal', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      high: { label: 'Yüksek', class: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Acil', class: 'bg-red-100 text-red-800 border-red-200' }
    }
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || { label: priority, class: 'bg-gray-100 text-gray-800 border-gray-200' }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${priorityInfo.class}`}>
        {priorityInfo.label}
      </span>
    )
  }

  // Loading state
  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
            <p className="text-ink-3">Yardım yönetimi yükleniyor...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Page Header - Sticky header with breadcrumbs and actions */}
      <PageHeader
        title="Yardım Yönetimi"
        subtitle="Yardım süreçlerinizi takip edin ve yönetin"
        breadcrumbs={[
          { label: 'Yardım', icon: <Package className="w-4 h-4" /> }
        ]}
        actions={[
          {
            label: 'Yeni Başvuru',
            onClick: () => window.location.href = '/aid/applications',
            variant: 'default',
            icon: <Plus className="w-4 h-4" />
          }
        ]}
      />

      <AppContent>
        {/* Statistics Section */}
        <PageSection
          id="statistics"
          title="Genel İstatistikler"
          description="Yardım süreçlerinizin özet bilgileri"
          spacing="md"
        >
          <StatCardGroup
            cards={getDashboardStats()}
            columns={3}
            gap="md"
          />
        </PageSection>

        {/* Recent Applications and Quick Actions */}
        <PageSection
          id="recent-activity"
          title="Son Aktiviteler"
          spacing="md"
        >
          <ContentGrid columns={2} gap="lg">
            {/* Recent Applications Card */}
            <div className="bg-surface border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-hierarchy-h3">Son Başvurular</h3>
                  <Link
                    to="/aid/applications"
                    className="text-sm text-primary hover:text-primary/80 transition-colors focus-ring rounded px-2 py-1"
                  >
                    Tümünü Gör
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.slice(0, 5).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink-1 truncate">
                            {application.beneficiaries?.name || 'İsim'} {application.beneficiaries?.surname || 'Soyisim'}
                          </div>
                          <div className="text-sm text-ink-3 truncate">
                            {application.title}
                          </div>
                          <div className="text-xs text-ink-4">
                            {new Date(application.created_at).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${application.status === 'pending' ? 'bg-warning/10 text-warning' :
                              application.status === 'approved' ? 'bg-success/10 text-success' :
                                application.status === 'rejected' ? 'bg-danger/10 text-danger' :
                                  'bg-ink-4/10 text-ink-4'
                            }`}>
                            {application.status === 'pending' ? 'Bekliyor' :
                              application.status === 'approved' ? 'Onaylandı' :
                                application.status === 'rejected' ? 'Reddedildi' :
                                  'Bilinmiyor'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FileText className="w-full h-full" />}
                    title="Henüz başvuru yok"
                    description="Yeni yardım başvuruları burada görünecek."
                    size="sm"
                  />
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-surface border border-border rounded-lg shadow-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-hierarchy-h3">Hızlı İşlemler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    to="/aid/applications/new"
                    className="flex items-center gap-3 p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring"
                  >
                    <Plus className="w-5 h-5 text-primary" />
                    <span className="font-medium">Yeni Başvuru Oluştur</span>
                  </Link>
                  <Link
                    to="/aid/applications?status=pending"
                    className="flex items-center gap-3 p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring"
                  >
                    <Clock className="w-5 h-5 text-warning" />
                    <span className="font-medium">Bekleyen Başvuruları İncele</span>
                  </Link>
                  <Link
                    to="/aid/reports"
                    className="flex items-center gap-3 p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring"
                  >
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="font-medium">Yardım Raporları</span>
                  </Link>
                  <Link
                    to="/beneficiaries"
                    className="flex items-center gap-3 p-3 text-ink-2 hover:text-ink-1 hover:bg-muted/50 rounded-md transition-all focus-ring"
                  >
                    <Users className="w-5 h-5 text-info" />
                    <span className="font-medium">İhtiyaç Sahipleri</span>
                  </Link>
                </div>
              </div>
            </div>
          </ContentGrid>
        </PageSection>
      </AppContent>
    </AppShell>
  )
}