import { useState, useEffect } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Modal } from '@components/Modal'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { VolunteerService } from '@services/volunteerService'
import type { 
  Volunteer, 
  VolunteerApplication, 
  VolunteerDashboard,
  VolunteerSearchFilters 
} from '../../types/volunteers'
import { toast } from 'sonner'
import { CorporateCard, CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { DashboardLayout, DashboardSection, createAddButton } from '@/components/common/DashboardLayout'
import { StatsGrid, StatsCardProps } from '@/components/common/StatsCard'
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  X,
  Phone,
  Mail,
  Star,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Activity,
  BarChart3,
  FileText
} from 'lucide-react'

export default function VolunteerManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'volunteers' | 'applications' | 'shifts' | 'training' | 'events'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])  
  const [applications, setApplications] = useState<VolunteerApplication[]>([])  
  const [dashboardData, setDashboardData] = useState<VolunteerDashboard | null>(null)
  
  // Modal states
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [, setShowShiftModal] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [, setSelectedApplication] = useState<VolunteerApplication | null>(null)
  
  // Filter states
  const [filters] = useState<VolunteerSearchFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load dashboard data
      const dashData = await VolunteerService.getDashboardData()
      setDashboardData(dashData)

      // Load volunteers
      const { volunteers: volunteerData } = await VolunteerService.searchVolunteers({ searchQuery }, 1, 20)
      setVolunteers(volunteerData)

      // Load applications
      const applicationData = await VolunteerService.getApplications()
      setApplications(applicationData)

      // Shifts functionality will be implemented later

    } catch (error) {
      console.error('Error loading volunteer data:', error)
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    const { volunteers: results } = await VolunteerService.searchVolunteers({
      ...filters,
      searchQuery
    })
    setVolunteers(results)
  }

  const handleApproveApplication = async (id: string) => {
    const success = await VolunteerService.reviewApplication(id, 'approved', 'Başvuru onaylandı')
    if (success) {
      loadData()
    }
  }

  const handleRejectApplication = async (id: string) => {
    const success = await VolunteerService.reviewApplication(id, 'rejected', 'Başvuru reddedildi')
    if (success) {
      loadData()
    }
  }

  const getDashboardStats = (): StatsCardProps[] => [
    {
      title: 'Aktif Gönüllü',
      value: (dashboardData?.totalActiveVolunteers || 0).toString(),
      icon: Users,
      trend: { value: dashboardData?.newApplicationsThisWeek || 0, isPositive: true },
      description: `+${dashboardData?.newApplicationsThisWeek || 0} yeni başvuru`
    },
    {
      title: 'Bu Ay Saat',
      value: (dashboardData?.hoursWorkedThisMonth || 0).toString(),
      icon: Clock,
      trend: { value: 8, isPositive: true },
      description: 'gönüllü saati'
    },
    {
      title: 'Yaklaşan Vardiya',
      value: (dashboardData?.upcomingShifts || 0).toString(),
      icon: Calendar,
      trend: { value: 5, isPositive: false },
      description: 'Bu hafta'
    },
    {
      title: 'Tutma Oranı',
      value: `%${dashboardData?.retentionRate || 0}`,
      icon: TrendingUp,
      trend: { value: 3, isPositive: true },
      description: 'Geçen aya göre'
    }
  ];

  const DashboardTab = () => (
    <DashboardLayout
      title="Gönüllü Yönetimi"
      subtitle="Gönüllü koordinasyonu ve program yönetimi"
      actions={[createAddButton('Yeni Gönüllü', () => setShowVolunteerModal(true))]}
      stats={getDashboardStats()}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <StatsGrid stats={getDashboardStats()} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 space-y-4">
        <CorporateCard className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Genel İstatistikler</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ortalama Yaş</span>
              <span className="font-medium">{dashboardData?.averageVolunteerAge || 0} yaş</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">En Popüler Rol</span>
              <span className="font-medium">{dashboardData?.mostPopularRole || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">En Başarılı Departman</span>
              <span className="font-medium">{dashboardData?.highestRatedDepartment || '-'}</span>
            </div>
          </div>
        </CorporateCard>

        <CorporateCard className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Son Başvurular</h3>
          <div className="space-y-3">
            {dashboardData?.recentApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.appliedDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === 'approved' ? 'bg-semantic-success/10 text-semantic-success' :
            app.status === 'rejected' ? 'bg-semantic-destructive/10 text-semantic-destructive' :
            'bg-semantic-warning/10 text-semantic-warning'
                }`}>
                  {app.status === 'approved' ? 'Onaylandı' :
                   app.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                </span>
              </div>
            ))}
            {(!dashboardData?.recentApplications || dashboardData.recentApplications.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">Son başvuru bulunamadı</p>
            )}
          </div>
        </CorporateCard>

        <CorporateCard className="p-6 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uyarılar</h3>
            <AlertCircle className="h-5 w-5 text-semantic-warning" />
          </div>
          <div className="space-y-3">
            {dashboardData?.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded text-sm ${
                alert.severity === 'critical' ? 'bg-semantic-destructive/10 text-semantic-destructive' :
          alert.severity === 'high' ? 'bg-semantic-warning/10 text-semantic-warning' :
          'bg-semantic-warning/10 text-semantic-warning'
              }`}>
                <p className="font-medium">{alert.message}</p>
                {alert.count > 1 && (
                  <p className="text-xs mt-1">({alert.count} adet)</p>
                )}
              </div>
            ))}
            {(!dashboardData?.alerts || dashboardData.alerts.length === 0) && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Herhangi bir uyarı yok</p>
              </div>
            )}
          </div>
        </CorporateCard>
      </div>

      {/* Quick Actions */}
      <CorporateCard className="p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CorporateButton 
            onClick={() => setShowVolunteerModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <UserPlus className="h-6 w-6 mb-2" />
            Gönüllü Ekle
          </CorporateButton>
          
          <CorporateButton 
            onClick={() => setShowShiftModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Calendar className="h-6 w-6 mb-2" />
            Vardiya Oluştur
          </CorporateButton>
          
          <CorporateButton 
            onClick={() => setActiveTab('applications')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <FileText className="h-6 w-6 mb-2" />
            Başvuruları İncele
          </CorporateButton>
          
          <CorporateButton 
            onClick={() => setActiveTab('training')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <BookOpen className="h-6 w-6 mb-2" />
            Eğitim Planla
          </CorporateButton>
        </div>
      </CorporateCard>
    </div>
    </DashboardLayout>
  )

  const VolunteersTab = () => {
    const columns: Column<Volunteer>[] = [
      { 
        key: 'name', 
        header: 'Gönüllü',
        render: (_, volunteer) => (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-semantic-info flex items-center justify-center text-white text-sm font-bold mr-3">
              {volunteer.firstName.charAt(0)}{volunteer.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{volunteer.firstName} {volunteer.lastName}</p>
              <p className="text-sm text-muted-foreground">{volunteer.email}</p>
            </div>
          </div>
        )
      },
      { 
        key: 'volunteerType', 
        header: 'Tür',
        render: (_, volunteer) => (
          <span className="capitalize">
            {volunteer.volunteerType === 'regular' ? 'Düzenli' :
             volunteer.volunteerType === 'event_based' ? 'Etkinlik Bazlı' :
             volunteer.volunteerType === 'seasonal' ? 'Sezonluk' :
             volunteer.volunteerType === 'professional' ? 'Profesyonel' : 'Öğrenci'}
          </span>
        )
      },
      { 
        key: 'totalHoursWorked', 
        header: 'Toplam Saat',
        render: (_, volunteer) => `${volunteer.totalHoursWorked || 0} saat`
      },
      { 
        key: 'totalShiftsCompleted', 
        header: 'Tamamlanan Vardiya',
        render: (_, volunteer) => volunteer.totalShiftsCompleted || 0
      },
      { 
        key: 'averageRating', 
        header: 'Ortalama Puan',
        render: (_, volunteer) => (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-semantic-warning mr-1" />
            <span>{(volunteer.averageRating || 0).toFixed(1)}</span>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Durum',
        render: (_, volunteer) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            volunteer.status === 'active' ? 'bg-semantic-success/10 text-semantic-success' :
          volunteer.status === 'inactive' ? 'bg-muted text-muted-foreground' :
          volunteer.status === 'on_leave' ? 'bg-semantic-warning/10 text-semantic-warning' :
          'bg-semantic-destructive/10 text-semantic-destructive'
          }`}>
            {volunteer.status === 'active' ? 'Aktif' :
             volunteer.status === 'inactive' ? 'Pasif' :
             volunteer.status === 'on_leave' ? 'İzinli' : 'Sonlandırıldı'}
          </span>
        )
      },
      {
        key: 'actions',
        header: 'İşlemler',
        render: (_, volunteer) => (
          <div className="flex space-x-1">
            <CorporateButton 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedVolunteer(volunteer)}
            >
              <Eye className="w-3 h-3" />
            </CorporateButton>
            <CorporateButton variant="outline" size="sm">
              <Edit className="w-3 h-3" />
            </CorporateButton>
            <CorporateButton variant="outline" size="sm">
              <Phone className="w-3 h-3" />
            </CorporateButton>
          </div>
        )
      }
    ]

    return (
      <div className="space-y-4">
        {/* Search and Actions */}
        <div className="flex items-center gap-2 overflow-x-auto rounded border p-2">
          <div className="flex-1 min-w-64">
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm" 
              placeholder="Gönüllü ara (ad, e-posta, telefon...)"
            />
          </div>
          <CorporateButton onClick={handleSearch} size="sm">
            <Search className="w-3 h-3 mr-1" />
            Ara
          </CorporateButton>
          <CorporateButton 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3 mr-1" />
            Filtrele
          </CorporateButton>
          <CorporateButton onClick={() => setShowVolunteerModal(true)} size="sm">
            <UserPlus className="w-3 h-3 mr-1" />
            Yeni Gönüllü
          </CorporateButton>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <CorporateCard className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="on_leave">İzinli</option>
                  <option value="terminated">Sonlandırıldı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tür</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="regular">Düzenli</option>
                  <option value="event_based">Etkinlik Bazlı</option>
                  <option value="seasonal">Sezonluk</option>
                  <option value="professional">Profesyonel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departman</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="aid">Yardım Dağıtımı</option>
                  <option value="fundraising">Bağış Toplama</option>
                  <option value="admin">Yönetim</option>
                </select>
              </div>
              <div className="flex items-end">
                <CorporateButton size="sm" className="w-full">Filtrele</CorporateButton>
              </div>
            </div>
          </CorporateCard>
        )}

        {/* Volunteers Table */}
        <CorporateCard>
          {loading ? (
            <div className="p-6 bg-card rounded-lg border text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={volunteers} />
          )}
        </CorporateCard>
      </div>
    )
  }

  const ApplicationsTab = () => {
    const columns: Column<VolunteerApplication>[] = [
      { 
        key: 'name', 
        header: 'Başvuran',
        render: (_, app) => (
          <div>
            <p className="font-medium">{app.firstName} {app.lastName}</p>
            <p className="text-sm text-muted-foreground">{app.email}</p>
          </div>
        )
      },
      { 
        key: 'applicationDate', 
        header: 'Başvuru Tarihi',
        render: (_, app) => new Date(app.applicationDate).toLocaleDateString('tr-TR')
      },
      { 
        key: 'preferredRoles', 
        header: 'Tercih Edilen Roller',
        render: (_, app) => app.preferredRoles.join(', ')
      },
      {
        key: 'status',
        header: 'Durum',
        render: (_, app) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            app.status === 'approved' ? 'bg-semantic-success/10 text-semantic-success' :
          app.status === 'rejected' ? 'bg-semantic-destructive/10 text-semantic-destructive' :
          app.status === 'under_review' ? 'bg-semantic-info/10 text-semantic-info' :
          'bg-semantic-warning/10 text-semantic-warning'
          }`}>
            {app.status === 'approved' ? 'Onaylandı' :
             app.status === 'rejected' ? 'Reddedildi' :
             app.status === 'under_review' ? 'İnceleniyor' : 'Bekliyor'}
          </span>
        )
      },
      {
        key: 'actions',
        header: 'İşlemler',
        render: (_, app) => (
          <div className="flex space-x-1">
            <CorporateButton 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedApplication(app)}
            >
              <Eye className="w-3 h-3" />
            </CorporateButton>
            {app.status === 'pending' && (
              <>
                <CorporateButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApproveApplication(app.id)}
                >
                  <CheckCircle className="w-3 h-3" />
                </CorporateButton>
                <CorporateButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRejectApplication(app.id)}
                >
                  <X className="w-3 h-3" />
                </CorporateButton>
              </>
            )}
          </div>
        )
      }
    ]

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Gönüllü Başvuruları</h2>
          <CorporateButton onClick={() => toast.info('Başvuru formu yakında eklenecek')}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Başvuru
          </CorporateButton>
        </div>

        <CorporateCard>
          {loading ? (
            <div className="p-6 bg-card rounded-lg border text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={applications} />
          )}
        </CorporateCard>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Users className="h-12 w-12 text-semantic-info mx-auto mb-4 animate-pulse" />
          <p>Gönüllü verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gönüllü Yönetimi</h1>
          <p className="text-muted-foreground">Gönüllü koordinasyonu ve program yönetimi</p>
        </div>
        <div className="flex gap-2">
          <CorporateButton variant="outline" onClick={() => setShowShiftModal(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Vardiya Oluştur
          </CorporateButton>
          <CorporateButton onClick={() => setShowVolunteerModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Gönüllü Ekle
          </CorporateButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { key: 'dashboard', label: 'Panel', icon: BarChart3 },
            { key: 'volunteers', label: 'Gönüllüler', icon: Users },
            { key: 'applications', label: 'Başvurular', icon: FileText },
            { key: 'shifts', label: 'Vardiyalar', icon: Calendar },
            { key: 'training', label: 'Eğitimler', icon: BookOpen },
            { key: 'events', label: 'Etkinlikler', icon: Activity }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-semantic-info text-semantic-info'
        : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'volunteers' && <VolunteersTab />}
      {activeTab === 'applications' && <ApplicationsTab />}
      {activeTab === 'shifts' && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Vardiya yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'training' && (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Eğitim yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'events' && (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Etkinlik yönetimi modülü yakında...</p>
        </div>
      )}

      {/* Modals */}
      {showVolunteerModal && (
        <Modal
          isOpen={showVolunteerModal}
          onClose={() => setShowVolunteerModal(false)}
          title="Yeni Gönüllü Kaydı"
        >
          <div className="p-4">
            <p>Gönüllü kayıt formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          title="Gönüllü Detayları"
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-semantic-info rounded-full flex items-center justify-center text-white font-bold">
                {selectedVolunteer.firstName.charAt(0)}{selectedVolunteer.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </h3>
                <p className="text-muted-foreground">{selectedVolunteer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Saat</p>
                <p className="font-semibold">{selectedVolunteer.totalHoursWorked || 0} saat</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tamamlanan Vardiya</p>
                <p className="font-semibold">{selectedVolunteer.totalShiftsCompleted || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ortalama Puan</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-semantic-warning mr-1" />
                  <span className="font-semibold">{(selectedVolunteer.averageRating || 0).toFixed(1)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durum</p>
                <p className="font-semibold">{selectedVolunteer.status}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <CorporateButton variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Ara
              </CorporateButton>
              <CorporateButton variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                E-posta
              </CorporateButton>
              <CorporateButton className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </CorporateButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
