import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Input } from '@/components/ui/input'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { DonorCRMService } from '@/services/donorCRMService'
import type { 
  DonorCommunication, 
  CommunicationFilters
} from '@/types/donors'
import { toast } from 'sonner'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  Video,
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Send,
  Inbox,
  PhoneCall,
  Users,
  Target,
  TrendingUp,
  Activity,
  Archive,
  Star,
  Tag,
  Download,
  Upload,
  X,
  MoreHorizontal
} from 'lucide-react'

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



interface CommunicationHistoryProps {
  donors: Donor[]
}

interface CommunicationFilters {
  donorId?: string
  communicationType?: string
  status?: string
  dateRange?: string
  priority?: string
}

export default function CommunicationHistory({ donors }: CommunicationHistoryProps) {
  const [loading, setLoading] = useState(false)
  const [communications, setCommunications] = useState<DonorCommunication[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<CommunicationFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<DonorCommunication | null>(null)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [communicationType, setCommunicationType] = useState('email')

  useEffect(() => {
    loadCommunications()
  }, [])

  const loadCommunications = async () => {
    setLoading(true)
    try {
      const data = await DonorCRMService.getCommunications(filters)
      setCommunications(data)
    } catch (error) {
      console.error('Error loading communications:', error)
      toast.error('İletişim geçmişi yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const data = await DonorCRMService.searchCommunications({
        ...filters,
        searchQuery
      })
      setCommunications(data)
    } catch (error) {
      console.error('Error searching communications:', error)
      toast.error('Arama sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof CommunicationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    loadCommunications()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'meeting': return <Calendar className="w-4 h-4" />
      case 'video_call': return <Video className="w-4 h-4" />
      case 'letter': return <FileText className="w-4 h-4" />
      case 'sms': return <MessageSquare className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-600 bg-blue-100'
      case 'phone': return 'text-green-600 bg-green-100'
      case 'meeting': return 'text-purple-600 bg-purple-100'
      case 'video_call': return 'text-orange-600 bg-orange-100'
      case 'letter': return 'text-gray-600 bg-gray-100'
      case 'sms': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns: Column<DonorCommunication>[] = [
    {
      key: 'type',
      title: 'Tip',
      render: (comm) => (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getTypeColor(comm.communicationType)}`}>
          {getTypeIcon(comm.communicationType)}
        </div>
      )
    },
    {
      key: 'donor',
      title: 'Bağışçı',
      render: (comm) => {
        const donor = donors.find(d => d.id === comm.donorId)
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {donor?.donorType === 'individual' ? 
                `${donor?.firstName?.charAt(0) || ''}${donor?.lastName?.charAt(0) || ''}` :
                donor?.companyName?.charAt(0) || 'C'
              }
            </div>
            <div>
              <p className="font-medium text-sm">
                {donor?.donorType === 'individual' ? 
                  `${donor?.firstName} ${donor?.lastName}` : 
                  donor?.companyName
                }
              </p>
              <p className="text-xs text-gray-600">{donor?.email}</p>
            </div>
          </div>
        )
      }
    },
    {
      key: 'subject',
      title: 'Konu',
      render: (comm) => (
        <div>
          <p className="font-medium text-sm">{comm.subject}</p>
          <p className="text-xs text-gray-600 truncate max-w-xs">{comm.content}</p>
        </div>
      )
    },
    {
      key: 'date',
      title: 'Tarih',
      render: (comm) => (
        <div className="text-sm">
          <p>{formatDate(comm.communicationDate)}</p>
          <p className="text-xs text-gray-600">
            {comm.followUpDate && `Takip: ${formatDate(comm.followUpDate)}`}
          </p>
        </div>
      )
    },
    {
      key: 'priority',
      title: 'Öncelik',
      render: (comm) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comm.priority)}`}>
          {comm.priority === 'urgent' ? 'Acil' :
           comm.priority === 'high' ? 'Yüksek' :
           comm.priority === 'medium' ? 'Orta' : 'Düşük'
          }
        </span>
      )
    },
    {
      key: 'status',
      title: 'Durum',
      render: (comm) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comm.status)}`}>
          {comm.status === 'completed' ? 'Tamamlandı' :
           comm.status === 'pending' ? 'Bekliyor' :
           comm.status === 'failed' ? 'Başarısız' :
           comm.status === 'scheduled' ? 'Planlandı' : comm.status
          }
        </span>
      )
    },
    {
      key: 'actions',
      title: 'İşlemler',
      render: (comm) => (
        <div className="flex items-center space-x-1">
          <CorporateButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCommunication(comm)
              setShowDetailModal(true)
            }}
            title="Detayları Görüntüle"
          >
            <Eye className="w-4 h-4" />
          </CorporateButton>
          <CorporateButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCommunication(comm)
              setShowAddModal(true)
            }}
            title="Düzenle"
          >
            <Edit className="w-4 h-4" />
          </CorporateButton>
          <CorporateButton
            variant="ghost"
            size="sm"
            title="Daha Fazla"
          >
            <MoreHorizontal className="w-4 h-4" />
          </CorporateButton>
        </div>
      )
    }
  ]

  const CommunicationStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <CorporateCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Toplam İletişim</p>
            <p className="text-2xl font-bold text-blue-600">{communications.length}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
      </CorporateCard>
      <CorporateCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Bu Ay</p>
            <p className="text-2xl font-bold text-green-600">
              {communications.filter(c => 
                new Date(c.communicationDate).getMonth() === new Date().getMonth()
              ).length}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </CorporateCard>
      <CorporateCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600">
              {communications.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </CorporateCard>
      <CorporateCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tamamlanan</p>
            <p className="text-2xl font-bold text-purple-600">
              {communications.filter(c => c.status === 'completed').length}
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-purple-600" />
        </div>
      </CorporateCard>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">İletişim Geçmişi</h2>
          <p className="text-gray-600">Bağışçılarla yapılan tüm iletişim kayıtları</p>
        </div>
        <div className="flex gap-2">
          <CorporateButton variant="neutral" onClick={() => DonorCRMService.exportCommunications()}>
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </CorporateButton>
          <CorporateButton onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni İletişim
          </CorporateButton>
        </div>
      </div>

      {/* Stats */}
      <CommunicationStats />

      {/* Search and Filters */}
      <CorporateCard className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="İletişim ara (konu, içerik, bağışçı...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <CorporateButton onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Ara
          </CorporateButton>
          <CorporateButton
            variant="neutral"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtreler
          </CorporateButton>
          {(searchQuery || Object.keys(filters).length > 0) && (
            <CorporateButton variant="neutral" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Temizle
            </CorporateButton>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 corporate-table-header rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Bağışçı</label>
              <select
                value={filters.donorId || ''}
                onChange={(e) => handleFilterChange('donorId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tüm Bağışçılar</option>
                {donors.map(donor => (
                  <option key={donor.id} value={donor.id}>
                    {donor.donorType === 'individual' ? 
                      `${donor.firstName} ${donor.lastName}` : 
                      donor.companyName
                    }
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">İletişim Tipi</label>
              <select
                value={filters.communicationType || ''}
                onChange={(e) => handleFilterChange('communicationType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="email">E-posta</option>
                <option value="phone">Telefon</option>
                <option value="meeting">Toplantı</option>
                <option value="video_call">Video Görüşme</option>
                <option value="letter">Mektup</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Durum</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="completed">Tamamlandı</option>
                <option value="pending">Bekliyor</option>
                <option value="failed">Başarısız</option>
                <option value="scheduled">Planlandı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Öncelik</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="urgent">Acil</option>
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
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
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="quarter">Bu Çeyrek</option>
                <option value="year">Bu Yıl</option>
              </select>
            </div>
          </div>
        )}
      </CorporateCard>

      {/* Communications Table */}
      <CorporateCard>
        <DataTable
          data={communications}
          columns={columns}
          loading={loading}
          emptyMessage="İletişim kaydı bulunamadı"
        />
      </CorporateCard>

      {/* Add/Edit Communication Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCommunication(null)
          }}
          title={selectedCommunication ? 'İletişim Düzenle' : 'Yeni İletişim Ekle'}
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bağışçı</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="">Bağışçı seçin</option>
                  {donors.map(donor => (
                    <option key={donor.id} value={donor.id}>
                      {donor.donorType === 'individual' ? 
                        `${donor.firstName} ${donor.lastName}` : 
                        donor.companyName
                      }
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İletişim Tipi</label>
                <select value={communicationType} onChange={(e) => setCommunicationType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="email">E-posta</option>
                  <option value="phone">Telefon</option>
                  <option value="meeting">Toplantı</option>
                  <option value="video_call">Video Görüşme</option>
                  <option value="letter">Mektup</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Öncelik</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="scheduled">Planlandı</option>
                  <option value="pending">Bekliyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="failed">Başarısız</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Konu</label>
              <Input placeholder="İletişim konusu" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">İçerik</label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="İletişim detayları ve notlar"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">İletişim Tarihi</label>
                <Input type="datetime-local" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Takip Tarihi</label>
                <Input type="datetime-local" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <CorporateButton variant="neutral" onClick={() => setShowAddModal(false)}>
                İptal
              </CorporateButton>
              <CorporateButton>
                <Send className="w-4 h-4 mr-2" />
                {selectedCommunication ? 'Güncelle' : 'Kaydet'}
              </CorporateButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Communication Detail Modal */}
      {showDetailModal && selectedCommunication && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCommunication(null)
          }}
          title="İletişim Detayları"
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getTypeColor(selectedCommunication.communicationType)}`}>
                {getTypeIcon(selectedCommunication.communicationType)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedCommunication.subject}</h3>
                <p className="text-gray-600">{formatDate(selectedCommunication.communicationDate)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Durum</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCommunication.status)}`}>
                  {selectedCommunication.status === 'completed' ? 'Tamamlandı' :
                   selectedCommunication.status === 'pending' ? 'Bekliyor' :
                   selectedCommunication.status === 'failed' ? 'Başarısız' :
                   selectedCommunication.status === 'scheduled' ? 'Planlandı' : selectedCommunication.status
                  }
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Öncelik</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedCommunication.priority)}`}>
                  {selectedCommunication.priority === 'urgent' ? 'Acil' :
                   selectedCommunication.priority === 'high' ? 'Yüksek' :
                   selectedCommunication.priority === 'medium' ? 'Orta' : 'Düşük'
                  }
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">İçerik</p>
              <div className="p-4 corporate-table-header rounded-lg">
                <p className="text-sm">{selectedCommunication.content}</p>
              </div>
            </div>

            {selectedCommunication.followUpDate && (
              <div>
                <p className="text-sm text-gray-600">Takip Tarihi</p>
                <p className="font-medium">{formatDate(selectedCommunication.followUpDate)}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <CorporateButton variant="neutral" onClick={() => setShowDetailModal(false)}>
                Kapat
              </CorporateButton>
              <CorporateButton onClick={() => {
                setShowDetailModal(false)
                setShowAddModal(true)
              }}>
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