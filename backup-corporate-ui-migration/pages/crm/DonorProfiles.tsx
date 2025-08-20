import { 
  CorporateButton,
  CorporateCard,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateCardContent,
  CorporateTable,
  CorporateModal,
  CorporateAlert,
  FormInput,
  FormGroup,
  FormLabel
} from '@/components/ui/corporate/CorporateComponents'
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

// Column tipi tanımı
interface Column<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
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

  const getTierColor = (donorTier: string) => {
    switch (donorTier) {
      case 'platinum': return 'bg-corporate-secondary-100 text-corporate-secondary-800'
      case 'gold': return 'bg-corporate-warning-100 text-corporate-warning-800'
      case 'silver': return 'bg-corporate-neutral-200 text-corporate-neutral-800'
      case 'bronze': return 'bg-corporate-danger-100 text-corporate-danger-800'
      default: return 'bg-corporate-primary-100 text-corporate-primary-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-corporate-success-100 text-corporate-success-800'
      case 'inactive': return 'bg-corporate-danger-100 text-corporate-danger-800'
      case 'prospect': return 'bg-corporate-warning-100 text-corporate-warning-800'
      case 'lapsed': return 'bg-corporate-neutral-200 text-corporate-neutral-800'
      default: return 'bg-corporate-primary-100 text-corporate-primary-800'
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedDonors.length === 0) return

    setLoading(true)
    try {
      switch (bulkAction) {
        case 'export':
          // Implement export logic
          toast.success(`${selectedDonors.length} bağışçı dışa aktarıldı.`)
          break
      }
      setSelectedDonors([])
      onRefresh()
    } catch (error) {
      console.error('Error with bulk action:', error)
      toast.error(`Toplu işlem hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  const columns: Column<Donor>[] = [
    {
      key: 'selection',
      title: '',
      render: (donor) => (
        <input
          type="checkbox"
          className="corporate-form-checkbox rounded text-corporate-primary-600"
          checked={selectedDonors.includes(donor.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedDonors((prev) => [...prev, donor.id])
            } else {
              setSelectedDonors((prev) => prev.filter((id) => id !== donor.id))
            }
          }}
        />
      )
    },
    {
      key: 'name',
      title: 'İsim',
      render: (donor) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              src={donor.avatar || "https://via.placeholder.com/40"} 
              alt="Donor avatar" 
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{donor.name}</div>
            <div className="text-sm text-gray-500">{donor.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'totalDonated',
      title: 'Toplam Bağış',
      render: (donor) => (
        <div className="text-sm text-gray-900">{formatCurrency(donor.totalDonated)}</div>
      )
    },
    {
      key: 'donorTier',
      title: 'Seviye',
      render: (donor) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTierColor(donor.donorTier)}`}>
          {donor.donorTier === 'platinum' ? 'Platin' :
            donor.donorTier === 'gold' ? 'Altın' :
              donor.donorTier === 'silver' ? 'Gümüş' :
                donor.donorTier === 'bronze' ? 'Bronz' : 'Standart'
          }
        </span>
      )
    },
    {
      key: 'status',
      title: 'Durum',
      render: (donor) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donor.relationshipStatus)}`}>
          {donor.relationshipStatus === 'active' ? 'Aktif' :
            donor.relationshipStatus === 'inactive' ? 'Pasif' :
              donor.relationshipStatus === 'prospect' ? 'Aday' :
                donor.relationshipStatus === 'lapsed' ? 'Kayıp' : donor.relationshipStatus
          }
        </span>
      )
    },
    {
      key: 'actions',
      title: 'İşlemler',
      render: (donor) => (
        <div className="flex items-center space-x-2">
          <CorporateButton variant="icon" size="sm" onClick={() => onDonorSelect(donor)}>
            <Eye className="h-4 w-4" />
          </CorporateButton>
          <CorporateButton variant="icon" size="sm" onClick={() => {
            setSelectedDonor(donor)
            setShowEditModal(true)
          }}>
            <Edit className="h-4 w-4" />
          </CorporateButton>
        </div>
      )
    }
  ]

  return (
    <CorporateCard>
      <CorporateCardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CorporateCardTitle>Bağışçı Profilleri</CorporateCardTitle>
          <div className="flex items-center gap-2">
            <FormInput
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <CorporateButton variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" /> Filtrele
            </CorporateButton>
            <CorporateButton variant="primary" onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" /> Yeni Bağışçı
            </CorporateButton>
          </div>
        </div>
      </CorporateCardHeader>
      <CorporateCardContent>
        {showFilters && (
          <div className="p-4 mb-4 border rounded-lg bg-corporate-neutral-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormGroup>
                <FormLabel>Durum</FormLabel>
                <select className="corporate-form-select" onChange={(e) => handleFilterChange('status', e.target.value)}>
                  <option value="">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">İnaktif</option>
                  <option value="prospect">Aday</option>
                  <option value="lapsed">Vazgeçmiş</option>
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel>Seviye</FormLabel>
                <select className="corporate-form-select" onChange={(e) => handleFilterChange('donorTier', e.target.value)}>
                  <option value="">Tüm Kademeler</option>
                  <option value="platinum">Platin</option>
                  <option value="gold">Altın</option>
                  <option value="silver">Gümüş</option>
                  <option value="bronze">Bronz</option>
                  <option value="standard">Standart</option>
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel>Min. Toplam Bağış</FormLabel>
                <FormInput type="number" placeholder="örn: 1000" onChange={(e) => handleFilterChange('minTotalDonation', e.target.value)} />
              </FormGroup>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <CorporateButton variant="outline" onClick={clearFilters}>Temizle</CorporateButton>
              <CorporateButton onClick={handleSearch}>Uygula</CorporateButton>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div>
            <select 
              className="corporate-form-select text-sm"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              disabled={selectedDonors.length === 0}
            >
              <option value="">Toplu İşlem Seç</option>
              <option value="delete">Sil</option>
              <option value="export">Dışa Aktar</option>
            </select>
            <CorporateButton onClick={handleBulkAction} disabled={!bulkAction || selectedDonors.length === 0} className="ml-2">
              Uygula
            </CorporateButton>
          </div>
          <div className="text-sm text-corporate-neutral-600">
            {filteredDonors.length} sonuç bulundu
          </div>
        </div>
        <CorporateTable columns={columns} data={filteredDonors} loading={loading} />
      </CorporateCardContent>

      <CorporateModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="corporate-modal-header">
          <h2 className="corporate-modal-title">Yeni Bağışçı Ekle</h2>
        </div>
        <div className="corporate-modal-body">
          <CorporateAlert title="Bilgi" description="Yeni bağışçı ekleme formu bu alanda yer alacaktır." />
        </div>
      </CorporateModal>

      <CorporateModal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="corporate-modal-header">
          <h2 className="corporate-modal-title">Bağışçı Düzenle</h2>
        </div>
        <div className="corporate-modal-body">
          <CorporateAlert title="Bilgi" description="Bağışçı düzenleme formu bu alanda yer alacaktır." />
        </div>
      </CorporateModal>

      <CorporateModal isOpen={showImportModal} onClose={() => setShowImportModal(false)}>
        <div className="corporate-modal-header">
          <h2 className="corporate-modal-title">Bağışçıları İçe Aktar</h2>
        </div>
        <div className="corporate-modal-body">
          <CorporateAlert title="Bilgi" description="Bağışçı içe aktarma arayüzü bu alanda yer alacaktır." />
        </div>
      </CorporateModal>
    </CorporateCard>
  )
}
