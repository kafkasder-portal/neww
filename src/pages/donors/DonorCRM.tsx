import { useState, useEffect } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Modal } from '@components/Modal'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { DonorCRMService } from '@services/donorCRMService'
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
  Building,
  User,
  DollarSign
} from 'lucide-react'

export default function DonorCRM() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'donors' | 'segments' | 'campaigns' | 'tasks' | 'analytics'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [donors, setDonors] = useState<Donor[]>([])
  const [dashboardData, setDashboardData] = useState<DonorDashboardData | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState<DonorTaskList[]>([])
  
  // Modal states
  const [showDonorModal, setShowDonorModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
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

      {/* Donor Segmentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bağışçı Türü Dağılımı</h3>
          <div className="space-y-3">
            {Object.entries(dashboardData?.donorsByType || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  {type === 'individual' ? <User className="w-4 h-4 mr-2" /> : <Building className="w-4 h-4 mr-2" />}
                  <span className="capitalize">{
                    type === 'individual' ? 'Bireysel' :
                    type === 'corporate' ? 'Kurumsal' :
                    type === 'foundation' ? 'Vakıf' : 'Devlet'
                  }</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / (dashboardData?.totalDonors || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bağışçı Kademesi</h3>
          <div className="space-y-3">
            {Object.entries(dashboardData?.donorsByTier || {}).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className={`w-4 h-4 mr-2 ${
                    tier === 'platinum' ? 'text-purple-600' :
                    tier === 'gold' ? 'text-yellow-600' :
                    tier === 'silver' ? 'text-gray-600' :
                    tier === 'bronze' ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                  <span className="capitalize">{
                    tier === 'platinum' ? 'Platin' :
                    tier === 'gold' ? 'Altın' :
                    tier === 'silver' ? 'Gümüş' :
                    tier === 'bronze' ? 'Bronz' : 'Standart'
                  }</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Donors & Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">En Yüksek Bağışçılar</h3>
          <div className="space-y-3">
            {dashboardData?.topDonors.map((donor, index) => (
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
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Yaklaşan Görevler</h3>
            <Button variant="outline" size="sm" onClick={() => setShowTaskModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Yeni
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    task.priority === 'urgent' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-orange-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-600">{task.dueDate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const DonorsTab = () => {
    const columns: Column<Donor>[] = [
      { 
        key: 'name', 
        header: 'Bağışçı', 
        render: (_, donor) => (
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
              donor.donorType === 'individual' ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              {donor.donorType === 'individual' ? 
                `${donor.firstName?.charAt(0) || ''}${donor.lastName?.charAt(0) || ''}` :
                donor.companyName?.charAt(0) || 'C'
              }
            </div>
            <div>
              <p className="font-medium">
                {donor.donorType === 'individual' ? 
                  `${donor.firstName} ${donor.lastName}` : 
                  donor.companyName
                }
              </p>
              <p className="text-sm text-gray-600">{donor.email}</p>
            </div>
          </div>
        )
      },
      { 
        key: 'donorTier', 
        header: 'Kademe',
        render: (_, donor) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            donor.donorTier === 'platinum' ? 'bg-purple-100 text-purple-800' :
            donor.donorTier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
            donor.donorTier === 'silver' ? 'bg-gray-100 text-gray-800' :
            donor.donorTier === 'bronze' ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {donor.donorTier === 'platinum' ? 'Platin' :
             donor.donorTier === 'gold' ? 'Altın' :
             donor.donorTier === 'silver' ? 'Gümüş' :
             donor.donorTier === 'bronze' ? 'Bronz' : 'Standart'}
          </span>
        )
      },
      { 
        key: 'totalDonated', 
        header: 'Toplam Bağış', 
        render: (_, donor) => formatCurrency(donor.totalDonated)
      },
      { 
        key: 'donationCount', 
        header: 'Bağış Sayısı',
        render: (_, donor) => donor.donationCount || 0
      },
      { 
        key: 'lastDonationDate', 
        header: 'Son Bağış',
        render: (_, donor) => donor.lastDonationDate ? 
          new Date(donor.lastDonationDate).toLocaleDateString('tr-TR') : '-'
      },
      {
        key: 'relationshipStatus',
        header: 'Durum',
        render: (_, donor) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            donor.relationshipStatus === 'active' ? 'bg-green-100 text-green-800' :
            donor.relationshipStatus === 'lapsed' ? 'bg-yellow-100 text-yellow-800' :
            donor.relationshipStatus === 'prospect' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {donor.relationshipStatus === 'active' ? 'Aktif' :
             donor.relationshipStatus === 'lapsed' ? 'Durgun' :
             donor.relationshipStatus === 'prospect' ? 'Potansiyel' : 'Kayıp'}
          </span>
        )
      },
      {
        key: 'actions',
        header: 'İşlemler',
        render: (_, donor) => (
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => setSelectedDonor(donor)}>
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-3 h-3" />
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
              placeholder="Bağışçı ara (ad, e-posta, telefon...)"
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
          <Button onClick={() => setShowDonorModal(true)} size="sm">
            <UserPlus className="w-3 h-3 mr-1" />
            Yeni Bağışçı
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tür</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="individual">Bireysel</option>
                  <option value="corporate">Kurumsal</option>
                  <option value="foundation">Vakıf</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kademe</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="platinum">Platin</option>
                  <option value="gold">Altın</option>
                  <option value="silver">Gümüş</option>
                  <option value="bronze">Bronz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select className="w-full rounded border px-2 py-1 text-sm">
                  <option value="">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="lapsed">Durgun</option>
                  <option value="prospect">Potansiyel</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button size="sm" className="w-full">Filtrele</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Donors Table */}
        <Card>
          {loading ? (
            <div className="p-6 text-center">Yükleniyor...</div>
          ) : (
            <DataTable columns={columns} data={donors} />
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
          <p>Bağışçı verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bağışçı CRM</h1>
          <p className="text-gray-600">Bağışçı ilişkileri ve analitik yönetimi</p>
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
            { key: 'donors', label: 'Bağışçılar', icon: Users },
            { key: 'segments', label: 'Segmentler', icon: Target },
            { key: 'campaigns', label: 'Kampanyalar', icon: Mail },
            { key: 'tasks', label: 'Görevler', icon: Calendar },
            { key: 'analytics', label: 'Analitik', icon: TrendingUp }
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
      {activeTab === 'donors' && <DonorsTab />}
      {activeTab === 'segments' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Bağışçı segmentleri modülü yakında...</p>
        </div>
      )}
      {activeTab === 'campaigns' && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Kampanya yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'tasks' && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Görev yönetimi modülü yakında...</p>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Analitik raporları modülü yakında...</p>
        </div>
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
