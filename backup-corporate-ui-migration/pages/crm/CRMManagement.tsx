import { useState, useEffect } from 'react'
import { 
  CorporateButton,
  CorporateCard,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateCardContent,
  KPICard,
  QuickAccessCard
} from '@/components/ui/corporate/CorporateComponents'
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
  DollarSign,
  Gift,
  Send
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
        <thead className="corporate-table-header">
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
            <tr key={index} className="hover:corporate-table-header">
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
          <div className="absolute inset-0 corporate-table-header0 opacity-75" onClick={onClose}></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Toplam Bağışçı"
          value={(dashboardData?.totalDonors || 0).toString()}
          icon={<Users />}
          change={{ value: dashboardData?.newDonorsThisMonth || 0, isPositive: true }}
        />
        <KPICard 
          title="Aktif Bağışçı"
          value={(dashboardData?.activeDonors || 0).toString()}
          icon={<Heart />}
        />
        <KPICard 
          title="Ortalama Bağış"
          value={formatCurrency(dashboardData?.averageDonationAmount || 0)}
          icon={<DollarSign />}
        />
        <KPICard 
          title="Tutma Oranı"
          value={`%${Math.round(dashboardData?.donorRetentionRate || 0)}`}
          icon={<Target />}
          change={{ value: 2.5, isPositive: true }}
        />
      </div>

      <QuickAccessCard
        title="Hızlı İşlemler"
        actions={[
          { label: 'Yeni Bağışçı', icon: <UserPlus />, onClick: () => setShowDonorModal(true) },
          { label: 'Kampanya Başlat', icon: <Mail />, onClick: () => setShowCampaignModal(true) },
          { label: 'Segment Oluştur', icon: <Target />, onClick: () => setShowSegmentModal(true) },
          { label: 'Görev Ekle', icon: <Calendar />, onClick: () => setShowTaskModal(true) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle>Son Aktiviteler</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-corporate-primary-50 rounded-lg">
              <div className="w-8 h-8 bg-corporate-primary-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-corporate-text-primary">Yeni bağışçı eklendi</p>
                <p className="text-xs text-corporate-text-secondary">Ahmet Yılmaz - 2 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-corporate-success-50 rounded-lg">
              <div className="w-8 h-8 bg-corporate-success-500 rounded-full flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-corporate-text-primary">Bağış alındı</p>
                <p className="text-xs text-corporate-text-secondary">Fatma Demir - 5,000 TL - 4 saat önce</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-corporate-info-50 rounded-lg">
              <div className="w-8 h-8 bg-corporate-info-500 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-corporate-text-primary">Kampanya gönderildi</p>
                <p className="text-xs text-corporate-text-secondary">Ramazan Kampanyası - 150 alıcı - 1 gün önce</p>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>

        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle>En Yüksek Bağışçılar</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="space-y-3">
            {dashboardData?.topDonors?.map((donor, index) => (
              <div key={donor.id} className="flex items-center justify-between p-3 bg-corporate-neutral-50 hover:bg-corporate-neutral-100 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    index === 0 ? 'bg-corporate-gold' :
                    index === 1 ? 'bg-corporate-silver' :
                    index === 2 ? 'bg-corporate-bronze' : 'bg-corporate-primary-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-corporate-text-primary">{donor.name}</p>
                    <p className="text-sm text-corporate-text-secondary">{donor.lastDonation}</p>
                  </div>
                </div>
                <span className="font-bold text-corporate-success-600">{formatCurrency(donor.totalDonated)}</span>
              </div>
            )) || []}
          </CorporateCardContent>
        </CorporateCard>
      </div>

      <CorporateCard>
        <CorporateCardHeader>
          <div className="flex items-center justify-between">
            <CorporateCardTitle>Yaklaşan Görevler</CorporateCardTitle>
            <CorporateButton variant="outline" size="sm" onClick={() => setShowTaskModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Yeni Görev
            </CorporateButton>
          </div>
        </CorporateCardHeader>
        <CorporateCardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingTasks.slice(0, 6).map((task) => (
            <div key={task.id} className="p-4 border border-corporate-border rounded-lg bg-white">
              <div className="flex items-center justify-between mb-2">
                <CorporateBadge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'info' : 'success'}>
                  {task.priority === 'urgent' ? 'Acil' :
                   task.priority === 'high' ? 'Yüksek' :
                   task.priority === 'medium' ? 'Orta' : 'Düşük'}
                </CorporateBadge>
                <Clock className="w-4 h-4 text-corporate-text-secondary" />
              </div>
              <h4 className="font-medium text-sm mb-1 text-corporate-text-primary">{task.title}</h4>
              <p className="text-xs text-corporate-text-secondary mb-2">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-corporate-text-tertiary">{task.dueDate}</span>
                <CorporateButton variant="ghost" size="icon-sm">
                  <CheckCircle className="w-4 h-4" />
                </CorporateButton>
              </div>
            </div>
          ))}
        </CorporateCardContent>
      </CorporateCard>
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
          <CorporateButton variant="neutral" onClick={() => setShowCampaignModal(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Yeni Kampanya
          </CorporateButton>
          <CorporateButton onClick={() => setShowDonorModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Bağışçı Ekle
          </CorporateButton>
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
          <CorporateButton className="mt-4" onClick={() => setShowSegmentModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Segment Oluştur
          </CorporateButton>
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
          <CorporateButton className="mt-4" onClick={() => setShowTaskModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Görev Ekle
          </CorporateButton>
        </div>
      )}
      {activeTab === 'analytics' && (
        <CRMAnalytics onRefresh={loadData} />
      )}

      <CorporateModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        title="Yeni Bağışçı Ekle"
      >
        <div className="p-4 space-y-4">
          <FormGroup>
            <FormLabel>İsim Soyisim</FormLabel>
            <FormInput placeholder="örn. Ahmet Yılmaz" />
          </FormGroup>
          <FormGroup>
            <FormLabel>E-posta</FormLabel>
            <FormInput type="email" placeholder="örn. ahmet@ornek.com" />
          </FormGroup>
          <FormGroup>
            <FormLabel>Telefon</FormLabel>
            <FormInput type="tel" placeholder="örn. 555 123 4567" />
          </FormGroup>
          <CorporateAlert title="Bilgilendirme" description="Bu sadece bir demo formudur. Geliştirme aşamasındadır." />
        </div>
        <div className="corporate-modal-footer">
          <CorporateButton variant="neutral" onClick={() => setShowDonorModal(false)}>İptal</CorporateButton>
          <CorporateButton>Kaydet</CorporateButton>
        </div>
      </CorporateModal>

      <CorporateModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        title="Yeni Kampanya Oluştur"
      >
        <div className="p-4">
          <p>Kampanya oluşturma formu burada olacak...</p>
        </div>
        <div className="corporate-modal-footer">
          <CorporateButton variant="neutral" onClick={() => setShowCampaignModal(false)}>İptal</CorporateButton>
          <CorporateButton>Oluştur</CorporateButton>
        </div>
      </CorporateModal>

      <CorporateModal
        isOpen={showSegmentModal}
        onClose={() => setShowSegmentModal(false)}
        title="Yeni Segment Oluştur"
      >
        <div className="p-4">
          <p>Segment oluşturma formu burada olacak...</p>
        </div>
        <div className="corporate-modal-footer">
          <CorporateButton variant="neutral" onClick={() => setShowSegmentModal(false)}>İptal</CorporateButton>
          <CorporateButton>Oluştur</CorporateButton>
        </div>
      </CorporateModal>

      <CorporateModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Yeni Görev Ekle"
      >
        <div className="p-4">
          <p>Görev ekleme formu burada olacak...</p>
        </div>
        <div className="corporate-modal-footer">
          <CorporateButton variant="neutral" onClick={() => setShowTaskModal(false)}>İptal</CorporateButton>
          <CorporateButton>Ekle</CorporateButton>
        </div>
      </CorporateModal>
    </div>
  )
}