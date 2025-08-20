import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DonorCRMService } from '@/services/donorCRMService'
import type { Donor, DonorDashboardData, DonorSearchFilters, DonorTaskList } from '@/types/donors'
import { toast } from 'sonner'
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Heart, 
  Target, 
  Mail, 
  Phone, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  BarChart3,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import DonorProfiles from './DonorProfiles'
import CommunicationHistory from './CommunicationHistory'
import CampaignManagement from './CampaignManagement'
import CRMAnalytics from './CRMAnalytics'

// Geçici Column tipi tanımı
interface Column<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
}

// Geçici DataTable bileşeni
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
}

function DataTable<T>({ data, columns, loading }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item: any, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Geçici Modal bileşeni
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CRMManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'donors' | 'segments' | 'campaigns' | 'communications' | 'tasks' | 'analytics'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [donors, setDonors] = useState<Donor[]>([])
  const [dashboardData, setDashboardData] = useState<DonorDashboardData | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState<DonorTaskList[]>([])
  
  // Modal states
  const [showDonorModal, setShowDonorModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showSegmentModal, setShowSegmentModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<DonorSearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load dashboard data
      const dashData = await DonorCRMService.getDashboardData()
      setDashboardData(dashData)

      // Load recent donors
      const { donors: donorData } = await DonorCRMService.searchDonors({ searchQuery }, 1, 20)
      setDonors(donorData)

      // Load upcoming tasks
      const tasks = await DonorCRMService.getUpcomingTasks(10)
      setUpcomingTasks(tasks)

    } catch (error) {
      console.error('Error loading CRM data:', error)
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    const { donors: results } = await DonorCRMService.searchDonors({
      ...filters,
      searchQuery
    })
    setDonors(results)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Bağışçı</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData?.totalDonors || 0}</p>
              <p className="text-xs text-green-600">+{dashboardData?.newDonorsThisMonth || 0} bu ay</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Bağışçı</p>
              <p className="text-2xl font-bold text-green-600">{dashboardData?.activeDonors || 0}</p>
              <p className="text-xs text-gray-600">
                %{dashboardData ? Math.round((dashboardData.activeDonors / dashboardData.totalDonors) * 100) : 0} oran
              </p>
            </div>
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ortalama Bağış</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(dashboardData?.averageDonationAmount || 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tutma Oranı</p>
              <p className="text-2xl font-bold text-orange-600">
                %{Math.round(dashboardData?.donorRetentionRate || 0)}
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => setShowDonorModal(true)}
          >
            <UserPlus className="h-6 w-6" />
            <span className="text-sm">Yeni Bağışçı</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => setShowCampaignModal(true)}
          >
            <Mail className="h-6 w-6" />
            <span className="text-sm">Kampanya Başlat</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => setShowSegmentModal(true)}
          >
            <Target className="h-6 w-6" />
            <span className="text-sm">Segment Oluştur</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => setShowTaskModal(true)}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Görev Ekle</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity & Top Donors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Yeni bağışçı eklendi</p>
                <p className="text-xs text-gray-600">Ahmet Yılmaz - 2 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bağış alındı</p>
                <p className="text-xs text-gray-600">Fatma Demir - 5,000 TL - 4 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Kampanya gönderildi</p>
                <p className="text-xs text-gray-600">Ramazan Kampanyası - 150 alıcı - 1 gün önce</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">En Yüksek Bağışçılar</h3>
          <div className="space-y-3">
            {dashboardData?.topDonors?.map((donor, index) => (
              <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    <p className="text-sm text-gray-600">{donor.lastDonation}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">{formatCurrency(donor.totalDonated)}</span>
              </div>
            )) || []}
          </div>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Yaklaşan Görevler</h3>
          <Button variant="outline" size="sm" onClick={() => setShowTaskModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Yeni Görev
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingTasks.slice(0, 6).map((task) => (
            <div key={task.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority === 'urgent' ? 'Acil' :
                   task.priority === 'high' ? 'Yüksek' :
                   task.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{task.dueDate}</span>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p>CRM verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM Yönetimi</h1>
          <p className="text-gray-600">Müşteri ilişkileri ve bağışçı yönetimi sistemi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCampaignModal(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Yeni Kampanya
          </Button>
          <Button onClick={() => setShowDonorModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Bağışçı Ekle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { key: 'dashboard', label: 'Panel', icon: BarChart3 },
            { key: 'donors', label: 'Bağışçı Profilleri', icon: Users },
            { key: 'segments', label: 'Segmentasyon', icon: Target },
            { key: 'campaigns', label: 'Kampanya Yönetimi', icon: Mail },
            { key: 'communications', label: 'İletişim Geçmişi', icon: MessageSquare },
            { key: 'tasks', label: 'Görev Yönetimi', icon: Calendar },
            { key: 'analytics', label: 'Analitik & Raporlar', icon: TrendingUp }
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
      {activeTab === 'donors' && (
        <DonorProfiles 
          donors={donors}
          onDonorSelect={setSelectedDonor}
          onRefresh={loadData}
        />
      )}
      {activeTab === 'segments' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Bağışçı segmentasyon modülü geliştiriliyor...</p>
          <Button className="mt-4" onClick={() => setShowSegmentModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Segment Oluştur
          </Button>
        </div>
      )}
      {activeTab === 'campaigns' && (
        <CampaignManagement onRefresh={loadData} />
      )}
      {activeTab === 'communications' && (
        <CommunicationHistory donors={donors} />
      )}
      {activeTab === 'tasks' && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Görev yönetimi modülü geliştiriliyor...</p>
          <Button className="mt-4" onClick={() => setShowTaskModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Görev Ekle
          </Button>
        </div>
      )}
      {activeTab === 'analytics' && (
        <CRMAnalytics dashboardData={dashboardData} />
      )}

      {/* Modals */}
      {showDonorModal && (
        <Modal
          isOpen={showDonorModal}
          onClose={() => setShowDonorModal(false)}
          title="Yeni Bağışçı Ekle"
        >
          <div className="p-4">
            <p>Bağışçı ekleme formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {showCampaignModal && (
        <Modal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          title="Yeni Kampanya Oluştur"
        >
          <div className="p-4">
            <p>Kampanya oluşturma formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {showSegmentModal && (
        <Modal
          isOpen={showSegmentModal}
          onClose={() => setShowSegmentModal(false)}
          title="Yeni Segment Oluştur"
        >
          <div className="p-4">
            <p>Segment oluşturma formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {showTaskModal && (
        <Modal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          title="Yeni Görev Ekle"
        >
          <div className="p-4">
            <p>Görev ekleme formu burada olacak...</p>
          </div>
        </Modal>
      )}

      {/* Donor Detail Modal */}
      {selectedDonor && (
        <Modal
          isOpen={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
          title="Bağışçı Detayları"
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {selectedDonor.donorType === 'individual' ? 
                  `${selectedDonor.firstName?.charAt(0) || ''}${selectedDonor.lastName?.charAt(0) || ''}` :
                  selectedDonor.companyName?.charAt(0) || 'C'
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedDonor.donorType === 'individual' ? 
                    `${selectedDonor.firstName} ${selectedDonor.lastName}` : 
                    selectedDonor.companyName
                  }
                </h3>
                <p className="text-gray-600">{selectedDonor.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Toplam Bağış</p>
                <p className="font-semibold">{formatCurrency(selectedDonor.totalDonated)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bağış Sayısı</p>
                <p className="font-semibold">{selectedDonor.donationCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kademe</p>
                <p className="font-semibold">{selectedDonor.donorTier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durum</p>
                <p className="font-semibold">{selectedDonor.relationshipStatus}</p>
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