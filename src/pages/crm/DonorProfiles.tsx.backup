import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DonorCRMService } from '@/services/donorCRMService'
import type { Donor, DonorSearchFilters } from '@/types/donors'
import {
  Building,
  Check,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  Phone,
  Search,
  Upload,
  User,
  UserPlus,
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

interface DonorProfilesProps {
  donors: Donor[]
  onDonorSelect: (donor: Donor) => void
  onRefresh: () => void
}

export default function DonorProfiles({ donors, onDonorSelect, onRefresh }: DonorProfilesProps) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<DonorSearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>(donors)
  const [selectedDonors, setSelectedDonors] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    setFilteredDonors(donors)
  }, [donors])

  const handleSearch = async () => {
    if (!searchQuery && Object.keys(filters).length === 0) {
      setFilteredDonors(donors)
      return
    }

    setLoading(true)
    try {
      const { donors: results } = await DonorCRMService.searchDonors({
        ...filters,
        searchQuery
      })
      setFilteredDonors(results)
    } catch (error) {
      console.error('Error searching donors:', error)
      toast.error(`Bağışçı arama hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof DonorSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setFilteredDonors(donors)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'prospect': return 'bg-yellow-100 text-yellow-800'
      case 'lapsed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedDonors.length === 0) return

    setLoading(true)
    try {
      switch (bulkAction) {
        case 'export':
          await DonorCRMService.exportDonors(selectedDonors)
          toast.success('Bağışçılar dışa aktarıldı')
          break
        case 'segment':
          // Segment oluşturma modalı açılacak
          toast.info('Segment oluşturma özelliği geliştiriliyor')
          break
        case 'campaign':
          // Kampanya oluşturma modalı açılacak
          toast.info('Kampanya oluşturma özelliği geliştiriliyor')
          break
        case 'delete':
          if (confirm('Seçili bağışçıları silmek istediğinizden emin misiniz?')) {
            await DonorCRMService.deleteDonors(selectedDonors)
            toast.success('Bağışçılar silindi')
            onRefresh()
          }
          break
      }
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error('İşlem sırasında hata oluştu')
    } finally {
      setLoading(false)
      setSelectedDonors([])
      setBulkAction('')
    }
  }

  const columns: Column<Donor>[] = [
    {
      key: 'select',
      title: '',
      render: (donor) => (
        <input
          type="checkbox"
          checked={selectedDonors.includes(donor.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedDonors(prev => [...prev, donor.id])
            } else {
              setSelectedDonors(prev => prev.filter(id => id !== donor.id))
            }
          }}
          className="rounded"
        />
      )
    },
    {
      key: 'name',
      title: 'Bağışçı',
      render: (donor) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
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
      key: 'type',
      title: 'Tip',
      render: (donor) => (
        <div className="flex items-center space-x-1">
          {donor.donorType === 'individual' ?
            <User className="w-4 h-4 text-blue-600" /> :
            <Building className="w-4 h-4 text-purple-600" />
          }
          <span className="text-sm">
            {donor.donorType === 'individual' ? 'Bireysel' :
              donor.donorType === 'corporate' ? 'Kurumsal' :
                donor.donorType === 'foundation' ? 'Vakıf' : 'Devlet'
            }
          </span>
        </div>
      )
    },
    {
      key: 'tier',
      title: 'Kademe',
      render: (donor) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(donor.donorTier)}`}>
          {donor.donorTier === 'platinum' ? 'Platin' :
            donor.donorTier === 'gold' ? 'Altın' :
              donor.donorTier === 'silver' ? 'Gümüş' :
                donor.donorTier === 'bronze' ? 'Bronz' : 'Standart'
          }
        </span>
      )
    },
    {
      key: 'totalDonated',
      title: 'Toplam Bağış',
      render: (donor) => (
        <div className="text-right">
          <p className="font-semibold text-green-600">{formatCurrency(donor.totalDonated)}</p>
          <p className="text-xs text-gray-600">{donor.donationCount || 0} bağış</p>
        </div>
      )
    },
    {
      key: 'lastDonation',
      title: 'Son Bağış',
      render: (donor) => (
        <div className="text-sm">
          <p>{donor.lastDonation || 'Henüz yok'}</p>
          <p className="text-xs text-gray-600">
            {donor.daysSinceLastDonation ? `${donor.daysSinceLastDonation} gün önce` : ''}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Durum',
      render: (donor) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donor.relationshipStatus)}`}>
          {donor.relationshipStatus === 'active' ? 'Aktif' :
            donor.relationshipStatus === 'inactive' ? 'Pasif' :
              donor.relationshipStatus === 'prospect' ? 'Potansiyel' :
                donor.relationshipStatus === 'lapsed' ? 'Kayıp' : donor.relationshipStatus
          }
        </span>
      )
    },
    {
      key: 'actions',
      title: 'İşlemler',
      render: (donor) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDonorSelect(donor)}
            title="Detayları Görüntüle"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDonor(donor)
              setShowEditModal(true)
            }}
            title="Düzenle"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`tel:${donor.phone}`)}
            title="Ara"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`mailto:${donor.email}`)}
            title="E-posta Gönder"
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bağışçı Profilleri</h2>
          <p className="text-gray-600">Toplam {filteredDonors.length} bağışçı</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            İçe Aktar
          </Button>
          <Button variant="outline" onClick={() => DonorCRMService.exportDonors()}>
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Yeni Bağışçı
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Bağışçı ara (isim, e-posta, telefon...)"
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
              <label className="block text-sm font-medium mb-1">Bağışçı Tipi</label>
              <select
                value={filters.donorType || ''}
                onChange={(e) => handleFilterChange('donorType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="individual">Bireysel</option>
                <option value="corporate">Kurumsal</option>
                <option value="foundation">Vakıf</option>
                <option value="government">Devlet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kademe</label>
              <select
                value={filters.donorTier || ''}
                onChange={(e) => handleFilterChange('donorTier', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="platinum">Platin</option>
                <option value="gold">Altın</option>
                <option value="silver">Gümüş</option>
                <option value="bronze">Bronz</option>
                <option value="standard">Standart</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Durum</label>
              <select
                value={filters.relationshipStatus || ''}
                onChange={(e) => handleFilterChange('relationshipStatus', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="prospect">Potansiyel</option>
                <option value="lapsed">Kayıp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bağış Aralığı</label>
              <select
                value={filters.donationRange || ''}
                onChange={(e) => handleFilterChange('donationRange', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Tümü</option>
                <option value="0-1000">0 - 1.000 TL</option>
                <option value="1000-5000">1.000 - 5.000 TL</option>
                <option value="5000-10000">5.000 - 10.000 TL</option>
                <option value="10000+">10.000 TL+</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedDonors.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedDonors.length} bağışçı seçildi
            </p>
            <div className="flex items-center space-x-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toplu işlem seçin</option>
                <option value="export">Dışa Aktar</option>
                <option value="segment">Segment Oluştur</option>
                <option value="campaign">Kampanya Gönder</option>
                <option value="delete">Sil</option>
              </select>
              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction || loading}
              >
                Uygula
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Donors Table */}
      <Card>
        <DataTable
          data={filteredDonors}
          columns={columns}
          loading={loading}
          emptyMessage="Bağışçı bulunamadı"
        />
      </Card>

      {/* Add Donor Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Yeni Bağışçı Ekle"
          size="lg"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bağışçı Tipi</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="individual">Bireysel</option>
                  <option value="corporate">Kurumsal</option>
                  <option value="foundation">Vakıf</option>
                  <option value="government">Devlet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kademe</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                  <option value="standard">Standart</option>
                  <option value="bronze">Bronz</option>
                  <option value="silver">Gümüş</option>
                  <option value="gold">Altın</option>
                  <option value="platinum">Platin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ad</label>
                <Input placeholder="Bağışçı adı" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soyad</label>
                <Input placeholder="Bağışçı soyadı" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <Input type="email" placeholder="ornek@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <Input placeholder="+90 555 123 45 67" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adres</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Tam adres bilgisi"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                İptal
              </Button>
              <Button>
                <Check className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Donor Modal */}
      {showEditModal && selectedDonor && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedDonor(null)
          }}
          title="Bağışçı Düzenle"
          size="lg"
        >
          <div className="p-6 space-y-4">
            <p className="text-gray-600">Bağışçı düzenleme formu burada olacak...</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                İptal
              </Button>
              <Button>
                <Check className="w-4 h-4 mr-2" />
                Güncelle
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Bağışçı İçe Aktar"
        >
          <div className="p-6 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">CSV veya Excel dosyası sürükleyin</p>
              <p className="text-sm text-gray-500">veya dosya seçmek için tıklayın</p>
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                İptal
              </Button>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                İçe Aktar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
