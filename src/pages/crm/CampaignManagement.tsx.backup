import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DonorCRMService } from '@/services/donorCRMService'
import type {
  CampaignFilters,
  DonorCampaign
} from '@/types/donors'
import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Globe,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Star,
  Target,
  TrendingUp,
  Users,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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



interface CampaignManagementProps {
  donors: Donor[]
}

interface CampaignFilters {
  status?: string
  type?: string
  dateRange?: string
  targetAmount?: string
}

export default function CampaignManagement({ donors }: CampaignManagementProps) {
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<DonorCampaign[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<CampaignFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<DonorCampaign | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const data = await DonorCRMService.getCampaigns(filters)
      setCampaigns(data)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast.error('Kampanyalar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const data = await DonorCRMService.searchCampaigns({
        ...filters,
        searchQuery
      })
      setCampaigns(data)
    } catch (error) {
      console.error('Error searching campaigns:', error)
      toast.error('Arama sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    loadCampaigns()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fundraising': return 'text-green-600 bg-green-100'
      case 'awareness': return 'text-blue-600 bg-blue-100'
      case 'event': return 'text-purple-600 bg-purple-100'
      case 'membership': return 'text-orange-600 bg-orange-100'
      case 'volunteer': return 'text-pink-600 bg-pink-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fundraising': return <DollarSign className="w-4 h-4" />
      case 'awareness': return <Globe className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      case 'membership': return <Users className="w-4 h-4" />
      case 'volunteer': return <Heart className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  const columns: Column<DonorCampaign>[] = [
    {
      key: 'name',
      title: 'Kampanya',
      render: (campaign) => (
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getTypeColor(campaign.campaignType)}`}>
            {getTypeIcon(campaign.campaignType)}
          </div>
          <div>
            <p className="font-medium text-sm">{campaign.campaignName}</p>
            <p className="text-xs text-gray-600">{campaign.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Tip',
      render: (campaign) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.campaignType)}`}>
          {campaign.campaignType === 'fundraising' ? 'Bağış Toplama' :
            campaign.campaignType === 'awareness' ? 'Farkındalık' :
              campaign.campaignType === 'event' ? 'Etkinlik' :
                campaign.campaignType === 'membership' ? 'Üyelik' :
                  campaign.campaignType === 'volunteer' ? 'Gönüllü' : campaign.campaignType
          }
        </span>
      )
    },
    {
      key: 'progress',
      title: 'İlerleme',
      render: (campaign) => {
        const progress = calculateProgress(campaign.raisedAmount || 0, campaign.targetAmount || 1)
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{formatCurrency(campaign.raisedAmount || 0)}</span>
              <span className="text-gray-600">{formatCurrency(campaign.targetAmount || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{progress.toFixed(1)}% tamamlandı</p>
          </div>
        )
      }
    },
    {
      key: 'dates',
      title: 'Tarihler',
      render: (campaign) => (
        <div className="text-sm">
          <p>Başlangıç: {formatDate(campaign.startDate)}</p>
          <p className="text-gray-600">Bitiş: {formatDate(campaign.endDate)}</p>
        </div>
      )
    },
    {
      key: 'participants',
      title: 'Katılımcılar',
      render: (campaign) => (
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{campaign.participantCount || 0}</p>
          <p className="text-xs text-gray-600">katılımcı</p>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Durum',
      render: (campaign) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status === 'active' ? 'Aktif' :
            campaign.status === 'draft' ? 'Taslak' :
              campaign.status === 'paused' ? 'Duraklatıldı' :
                campaign.status === 'completed' ? 'Tamamlandı' :
                  campaign.status === 'cancelled' ? 'İptal Edildi' : campaign.status
          }
        </span>
      )
    },
    {
      key: 'actions',
      title: 'İşlemler',
      render: (campaign) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCampaign(campaign)
              setShowDetailModal(true)
            }}
            title="Detayları Görüntüle"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCampaign(campaign)
              setShowAddModal(true)
            }}
            title="Düzenle"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {campaign.status === 'active' ? (
            <Button
              variant="ghost"
              size="sm"
              title="Duraklat"
            >
              <Pause className="w-4 h-4" />
            </Button>
          ) : campaign.status === 'paused' ? (
            <Button
              variant="ghost"
              size="sm"
              title="Devam Ettir"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            title="Daha Fazla"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const CampaignStats = () => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active')
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0)
    const totalTarget = campaigns.reduce((sum, c) => sum + (c.targetAmount || 0), 0)
    const totalParticipants = campaigns.reduce((sum, c) => sum + (c.participantCount || 0), 0)

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Kampanyalar</p>
              <p className="text-2xl font-bold text-green-600">{activeCampaigns.length}</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplanan Tutar</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRaised)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hedef Tutar</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalTarget)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Katılımcı</p>
              <p className="text-2xl font-bold text-orange-600">{totalParticipants}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>
    )
  }

  const CampaignOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Performing Campaigns */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          En Başarılı Kampanyalar
        </h3>
        <div className="space-y-4">
          {campaigns
            .sort((a, b) => calculateProgress(b.raisedAmount || 0, b.targetAmount || 1) - calculateProgress(a.raisedAmount || 0, a.targetAmount || 1))
            .slice(0, 5)
            .map(campaign => {
              const progress = calculateProgress(campaign.raisedAmount || 0, campaign.targetAmount || 1)
              return (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getTypeColor(campaign.campaignType)}`}>
                      {getTypeIcon(campaign.campaignType)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{campaign.campaignName}</p>
                      <p className="text-xs text-gray-600">{campaign.participantCount} katılımcı</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{progress.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">{formatCurrency(campaign.raisedAmount || 0)}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Son Aktiviteler
        </h3>
        <div className="space-y-4">
          {campaigns
            .filter(c => c.status === 'active')
            .slice(0, 5)
            .map(campaign => (
              <div key={campaign.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getTypeColor(campaign.campaignType)}`}>
                  {getTypeIcon(campaign.campaignType)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{campaign.campaignName}</p>
                  <p className="text-xs text-gray-600">Son güncelleme: {formatDate(campaign.updatedAt || campaign.startDate)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  Aktif
                </span>
              </div>
            ))
          }
        </div>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kampanya Yönetimi</h2>
          <p className="text-gray-600">Bağış kampanyalarını oluşturun ve yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => DonorCRMService.exportCampaigns()}>
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kampanya
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CampaignStats />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'campaigns'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Tüm Kampanyalar
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <CampaignOverview />}

      {activeTab === 'campaigns' && (
        <>
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Kampanya ara (isim, açıklama...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Ara
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtreler
              </Button>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Temizle
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Durum</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Tümü</option>
                    <option value="active">Aktif</option>
                    <option value="draft">Taslak</option>
                    <option value="paused">Duraklatıldı</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tip</label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Tümü</option>
                    <option value="fundraising">Bağış Toplama</option>
                    <option value="awareness">Farkındalık</option>
                    <option value="event">Etkinlik</option>
                    <option value="membership">Üyelik</option>
                    <option value="volunteer">Gönüllü</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tarih Aralığı</label>
                  <select
                    value={filters.dateRange || ''}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Tümü</option>
                    <option value="active">Aktif Olanlar</option>
                    <option value="month">Bu Ay</option>
                    <option value="quarter">Bu Çeyrek</option>
                    <option value="year">Bu Yıl</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hedef Tutar</label>
                  <select
                    value={filters.targetAmount || ''}
                    onChange={(e) => handleFilterChange('targetAmount', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Tümü</option>
                    <option value="0-10000">0 - 10.000 TL</option>
                    <option value="10000-50000">10.000 - 50.000 TL</option>
                    <option value="50000-100000">50.000 - 100.000 TL</option>
                    <option value="100000+">100.000+ TL</option>
                  </select>
                </div>
              </div>
            )}
          </Card>

          {/* Campaigns Table */}
          <Card>
            <DataTable
              data={campaigns}
              columns={columns}
              loading={loading}
              emptyMessage="Kampanya bulunamadı"
            />
          </Card>
        </>
      )}

      {/* Add/Edit Campaign Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCampaign(null)
          }}
          title={selectedCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya Oluştur'}
          size="xl"
        >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kampanya Adı</label>
                <Input placeholder="Kampanya adını girin" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kampanya Tipi</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="fundraising">Bağış Toplama</option>
                  <option value="awareness">Farkındalık</option>
                  <option value="event">Etkinlik</option>
                  <option value="membership">Üyelik</option>
                  <option value="volunteer">Gönüllü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hedef Tutar</label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="draft">Taslak</option>
                  <option value="active">Aktif</option>
                  <option value="paused">Duraklatıldı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bitiş Tarihi</label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={3}
                placeholder="Kampanya açıklaması"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hedef Kitle</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Bireysel Bağışçılar', 'Kurumsal Bağışçılar', 'VIP Bağışçılar', 'Yeni Bağışçılar'].map(segment => (
                  <label key={segment} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{segment}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                İptal
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                {selectedCampaign ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Campaign Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCampaign(null)
          }}
          title={selectedCampaign.campaignName}
          size="xl"
        >
          <div className="p-6 space-y-6">
            {/* Campaign Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${getTypeColor(selectedCampaign.campaignType)}`}>
                  {getTypeIcon(selectedCampaign.campaignType)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCampaign.campaignName}</h3>
                  <p className="text-gray-600">{selectedCampaign.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCampaign.status)}`}>
                      {selectedCampaign.status === 'active' ? 'Aktif' :
                        selectedCampaign.status === 'draft' ? 'Taslak' :
                          selectedCampaign.status === 'paused' ? 'Duraklatıldı' :
                            selectedCampaign.status === 'completed' ? 'Tamamlandı' :
                              selectedCampaign.status === 'cancelled' ? 'İptal Edildi' : selectedCampaign.status
                      }
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedCampaign.campaignType)}`}>
                      {selectedCampaign.campaignType === 'fundraising' ? 'Bağış Toplama' :
                        selectedCampaign.campaignType === 'awareness' ? 'Farkındalık' :
                          selectedCampaign.campaignType === 'event' ? 'Etkinlik' :
                            selectedCampaign.campaignType === 'membership' ? 'Üyelik' :
                              selectedCampaign.campaignType === 'volunteer' ? 'Gönüllü' : selectedCampaign.campaignType
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Toplanan</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCampaign.raisedAmount || 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Hedef</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedCampaign.targetAmount || 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">İlerleme</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {calculateProgress(selectedCampaign.raisedAmount || 0, selectedCampaign.targetAmount || 1).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(selectedCampaign.raisedAmount || 0, selectedCampaign.targetAmount || 1)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Kampanya Bilgileri</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Başlangıç:</span>
                    <span>{formatDate(selectedCampaign.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bitiş:</span>
                    <span>{formatDate(selectedCampaign.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Katılımcı:</span>
                    <span>{selectedCampaign.participantCount || 0} kişi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Oluşturulma:</span>
                    <span>{formatDate(selectedCampaign.createdAt || selectedCampaign.startDate)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Performans Metrikleri</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ortalama Bağış:</span>
                    <span>{formatCurrency((selectedCampaign.raisedAmount || 0) / Math.max(selectedCampaign.participantCount || 1, 1))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dönüşüm Oranı:</span>
                    <span>%{((selectedCampaign.participantCount || 0) / 100 * 15).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Günlük Ortalama:</span>
                    <span>{formatCurrency((selectedCampaign.raisedAmount || 0) / Math.max(Math.ceil((new Date(selectedCampaign.endDate).getTime() - new Date(selectedCampaign.startDate).getTime()) / (1000 * 60 * 60 * 24)), 1))}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Kapat
              </Button>
              <Button onClick={() => {
                setShowDetailModal(false)
                setShowAddModal(true)
              }}>
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