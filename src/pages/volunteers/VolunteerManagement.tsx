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
  VolunteerShift,
  VolunteerDashboard,
  VolunteerSearchFilters 
} from '@/types/volunteers'
import { toast } from 'sonner'
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Award, 
  MapPin,
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
  UserCheck,
  Activity,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react'

export default function VolunteerManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'volunteers' | 'applications' | 'shifts' | 'training' | 'events'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [applications, setApplications] = useState<VolunteerApplication[]>([])
  const [shifts, setShifts] = useState<VolunteerShift[]>([])
  const [dashboardData, setDashboardData] = useState<VolunteerDashboard | null>(null)
  
  // Modal states
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState<VolunteerSearchFilters>({})
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

      // Load shifts
      const shiftData = await VolunteerService.getShifts()
      setShifts(shiftData)

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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Gönüllü</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData?.totalActiveVolunteers || 0}</p>
              <p className="text-xs text-green-600">+{dashboardData?.newApplicationsThisWeek || 0} yeni başvuru</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bu Ay Saat</p>
              <p className="text-2xl font-bold text-green-600">{dashboardData?.hoursWorkedThisMonth || 0}</p>
              <p className="text-xs text-gray-600">gönüllü saati</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Yaklaşan Vardiya</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardData?.upcomingShifts || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tutma Oranı</p>
              <p className="text-2xl font-bold text-orange-600">%{dashboardData?.retentionRate || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Genel İstatistikler</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ortalama Yaş</span>
              <span className="font-medium">{dashboardData?.averageVolunteerAge || 0} yaş</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">En Popüler Rol</span>
              <span className="font-medium">{dashboardData?.mostPopularRole || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">En Başarılı Departman</span>
              <span className="font-medium">{dashboardData?.highestRatedDepartment || '-'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Son Başvurular</h3>
          <div className="space-y-3">
            {dashboardData?.recentApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-xs text-gray-600">{app.appliedDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status === 'approved' ? 'Onaylandı' :
                   app.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                </span>
              </div>
            ))}
            {(!dashboardData?.recentApplications || dashboardData.recentApplications.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">Son başvuru bulunamadı</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uyarılar</h3>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {dashboardData?.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded text-sm ${
                alert.severity === 'critical' ? 'bg-red-50 text-red-800' :
                alert.severity === 'high' ? 'bg-orange-50 text-orange-800' :
                'bg-yellow-50 text-yellow-800'
              }`}>
                <p className="font-medium">{alert.message}</p>
                {alert.count > 1 && (
                  <p className="text-xs mt-1">({alert.count} adet)</p>
                )}
              </div>
            ))}
            {(!dashboardData?.alerts || dashboardData.alerts.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Herhangi bir uyarı yok</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setShowVolunteerModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <UserPlus className="h-6 w-6 mb-2" />
            Gönüllü Ekle
          </Button>
          
          <Button 
            onClick={() => setShowShiftModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Calendar className="h-6 w-6 mb-2" />
            Vardiya Oluştur
          </Button>
          
          <Button 
            onClick={() => setActiveTab('applications')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <FileText className="h-6 w-6 mb-2" />
            Başvuruları İncele
          </Button>
          
          <Button 
            onClick={() => setActiveTab('training')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <BookOpen className="h-6 w-6 mb-2" />
            Eğitim Planla
          </Button>
        </div>
      </Card>
    </div>
  )

  const VolunteersTab = () => {
    const columns: Column<Volunteer>[] = [
      { 
        key: 'name', 
        header: 'Gönüllü',
        render: (_, volunteer) => (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold mr-3">
              {volunteer.firstName.charAt(0)}{volunteer.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{volunteer.firstName} {volunteer.lastName}</p>
              <p className="text-sm text-gray-600">{volunteer.email}</p>
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
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{(volunteer.averageRating || 0).toFixed(1)}</span>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Durum',
        render: (_, volunteer) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            volunteer.status === 'active' ? 'bg-green-100 text-green-800' :
            volunteer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
            volunteer.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedVolunteer(volunteer)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="w-3 h-3" />
            </Button>
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
          <Button onClick={handleSearch} size="sm">
            <Search className="w-3 h-3 mr-1" />
            Ara
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3 mr-1" />
            Filtrele
          </Button>
          <Button onClick={() => setShowVolunteerModal(true)} size="sm">
            <UserPlus className="w-3 h-3 mr-1" />
            Yeni Gönüllü
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4">
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
                <Button size="sm" className="w-full">Filtrele</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Volunteers Table */}
        <Card>
          {loading ? (
            <div className="p-6 text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={volunteers} />
          )}
        </Card>
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
            <p className="text-sm text-gray-600">{app.email}</p>
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
            app.status === 'approved' ? 'bg-green-100 text-green-800' :
            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
            app.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedApplication(app)}
            >
              <Eye className="w-3 h-3" />
            </Button>
            {app.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApproveApplication(app.id)}
                >
                  <CheckCircle className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRejectApplication(app.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
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
          <Button onClick={() => setShowApplicationModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Başvuru
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="p-6 text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={applications} />
          )}
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
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
          <p className="text-gray-600">Gönüllü koordinasyonu ve program yönetimi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowShiftModal(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Vardiya Oluştur
          </Button>
          <Button onClick={() => setShowVolunteerModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Gönüllü Ekle
          </Button>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Vardiya yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'training' && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Eğitim yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'events' && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Etkinlik yönetimi modülü yakında...</p>
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
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {selectedVolunteer.firstName.charAt(0)}{selectedVolunteer.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </h3>
                <p className="text-gray-600">{selectedVolunteer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Toplam Saat</p>
                <p className="font-semibold">{selectedVolunteer.totalHoursWorked || 0} saat</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamamlanan Vardiya</p>
                <p className="font-semibold">{selectedVolunteer.totalShiftsCompleted || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ortalama Puan</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-semibold">{(selectedVolunteer.averageRating || 0).toFixed(1)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durum</p>
                <p className="font-semibold">{selectedVolunteer.status}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Ara
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                E-posta
              </Button>
              <Button className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
