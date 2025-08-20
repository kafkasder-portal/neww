import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Input } from '@/components/ui/input'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Plus, 
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  TrendingUp,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Supplier, SupplierForm, SupplierFilters } from '@/types/inventory'
import { formatCurrency } from '@/utils/formatters'

interface SupplierManagementProps {
  onSupplierCreate?: (supplier: SupplierForm) => void
  onSupplierUpdate?: (supplierId: string, supplier: SupplierForm) => void
  onSupplierDelete?: (supplierId: string) => void
}

// Mock data - gerçek uygulamada API'den gelecek
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Gıda Tedarik A.Ş.',
    code: 'SUP-001',
    type: 'company',
    contactPerson: 'Ahmet Yılmaz',
    email: 'ahmet@gidatedarik.com',
    phone: '+90 212 555 0101',
    address: 'Atatürk Mah. Gıda Cad. No:15 Şişli/İstanbul',
    taxNumber: '1234567890',
    category: 'food',
    rating: 4.5,
    isActive: true,
    paymentTerms: 30,
    creditLimit: 50000,
    currentDebt: 12500,
    totalOrders: 45,
    totalAmount: 125000,
    lastOrderDate: '2024-01-20T00:00:00Z',
    notes: 'Güvenilir tedarikçi, zamanında teslimat',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Temizlik Ürünleri Ltd.',
    code: 'SUP-002',
    type: 'company',
    contactPerson: 'Fatma Demir',
    email: 'fatma@temizlik.com',
    phone: '+90 216 555 0202',
    address: 'Merkez Mah. Temizlik Sok. No:8 Kadıköy/İstanbul',
    taxNumber: '0987654321',
    category: 'cleaning',
    rating: 4.2,
    isActive: true,
    paymentTerms: 45,
    creditLimit: 30000,
    currentDebt: 8750,
    totalOrders: 32,
    totalAmount: 87500,
    lastOrderDate: '2024-01-18T00:00:00Z',
    notes: 'Kaliteli ürünler, rekabetçi fiyatlar',
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    name: 'Kırtasiye Dünyası',
    code: 'SUP-003',
    type: 'individual',
    contactPerson: 'Mehmet Özkan',
    email: 'mehmet@kirtasiye.com',
    phone: '+90 312 555 0303',
    address: 'Çankaya Mah. Ofis Cad. No:22 Çankaya/Ankara',
    taxNumber: '1122334455',
    category: 'office',
    rating: 3.8,
    isActive: true,
    paymentTerms: 15,
    creditLimit: 15000,
    currentDebt: 2100,
    totalOrders: 28,
    totalAmount: 42000,
    lastOrderDate: '2024-01-15T00:00:00Z',
    notes: 'Hızlı teslimat, küçük siparişler için uygun',
    createdAt: '2023-09-10T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '4',
    name: 'Soğuk Zincir Lojistik',
    code: 'SUP-004',
    type: 'company',
    contactPerson: 'Ayşe Kaya',
    email: 'ayse@sogukzincir.com',
    phone: '+90 232 555 0404',
    address: 'Liman Mah. Soğuk Cad. No:5 Konak/İzmir',
    taxNumber: '5566778899',
    category: 'logistics',
    rating: 4.7,
    isActive: true,
    paymentTerms: 60,
    creditLimit: 75000,
    currentDebt: 0,
    totalOrders: 18,
    totalAmount: 95000,
    lastOrderDate: '2024-01-22T00:00:00Z',
    notes: 'Soğuk zincir uzmanı, yüksek kalite',
    createdAt: '2023-11-20T00:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '5',
    name: 'Eski Tedarikçi A.Ş.',
    code: 'SUP-005',
    type: 'company',
    contactPerson: 'Ali Veli',
    email: 'ali@eskitedarikci.com',
    phone: '+90 312 555 0505',
    address: 'Eski Mah. Eski Cad. No:1 Ankara',
    taxNumber: '9988776655',
    category: 'other',
    rating: 2.5,
    isActive: false,
    paymentTerms: 30,
    creditLimit: 10000,
    currentDebt: 5000,
    totalOrders: 12,
    totalAmount: 25000,
    lastOrderDate: '2023-12-01T00:00:00Z',
    notes: 'Kalite sorunları nedeniyle pasif',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-12-15T11:30:00Z'
  }
]

const SupplierManagement: React.FC<SupplierManagementProps> = ({
  onSupplierCreate,
  onSupplierUpdate,
  onSupplierDelete
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [filters, setFilters] = useState<SupplierFilters>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [newSupplier, setNewSupplier] = useState<SupplierForm>({
    name: '',
    code: '',
    type: 'company',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'other',
    isActive: true
  })

  useEffect(() => {
    applyFilters()
  }, [filters, suppliers])

  const applyFilters = () => {
    let filtered = [...suppliers]

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.code.toLowerCase().includes(searchTerm) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm) ||
        supplier.email?.toLowerCase().includes(searchTerm) ||
        supplier.phone?.toLowerCase().includes(searchTerm)
      )
    }

    // Kategori filtresi
    if (filters.category) {
      filtered = filtered.filter(supplier => supplier.category === filters.category)
    }

    // Tür filtresi
    if (filters.type) {
      filtered = filtered.filter(supplier => supplier.type === filters.type)
    }

    // Durum filtresi
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(supplier => supplier.isActive === filters.isActive)
    }

    // Rating filtresi
    if (filters.minRating) {
      filtered = filtered.filter(supplier => (supplier.rating || 0) >= filters.minRating!)
    }

    setFilteredSuppliers(filtered)
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'food': return 'Gıda'
      case 'cleaning': return 'Temizlik'
      case 'office': return 'Ofis'
      case 'medical': return 'Tıbbi'
      case 'logistics': return 'Lojistik'
      case 'other': return 'Diğer'
      default: return category
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'company': return 'Şirket'
      case 'individual': return 'Bireysel'
      default: return type
    }
  }

  const getCreditStatus = (supplier: Supplier) => {
    if (!supplier.creditLimit || !supplier.currentDebt) return 'safe'
    const usage = (supplier.currentDebt / supplier.creditLimit) * 100
    if (usage >= 90) return 'critical'
    if (usage >= 70) return 'warning'
    return 'safe'
  }

  const getCreditStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500'
      case 'warning': return 'text-orange-500'
      case 'safe': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-200 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />)
    }

    return stars
  }

  const handleCreateSupplier = () => {
    if (onSupplierCreate) {
      onSupplierCreate(newSupplier)
    }
    setIsCreateDialogOpen(false)
    setNewSupplier({
      name: '',
      code: '',
      type: 'company',
      contactPerson: '',
      email: '',
      phone: '',
      category: 'other',
      isActive: true
    })
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setNewSupplier({
      name: supplier.name,
      code: supplier.code,
      type: supplier.type,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address,
      taxNumber: supplier.taxNumber,
      category: supplier.category,
      isActive: supplier.isActive,
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit,
      notes: supplier.notes
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSupplier = () => {
    if (selectedSupplier && onSupplierUpdate) {
      onSupplierUpdate(selectedSupplier.id, newSupplier)
    }
    setIsEditDialogOpen(false)
    setSelectedSupplier(null)
    setNewSupplier({
      name: '',
      code: '',
      type: 'company',
      contactPerson: '',
      email: '',
      phone: '',
      category: 'other',
      isActive: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const SupplierDialog = ({ isOpen, onOpenChange, title, onSubmit }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    onSubmit: () => void
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Tedarikçi bilgilerini girin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="corporate-form-group">
              <Label htmlFor="name">Tedarikçi Adı *</Label>
              <Input
                id="name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Gıda Tedarik A.Ş."
              />
            </div>
            <div className="corporate-form-group">
              <Label htmlFor="code">Tedarikçi Kodu *</Label>
              <Input
                id="code"
                value={newSupplier.code}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, code: e.target.value }))}
                placeholder="SUP-001"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="corporate-form-group">
              <Label htmlFor="type">Tür</Label>
              <Select 
                value={newSupplier.type} 
                onValueChange={(value: any) => setNewSupplier(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Şirket</SelectItem>
                  <SelectItem value="individual">Bireysel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="corporate-form-group">
              <Label htmlFor="category">Kategori</Label>
              <Select 
                value={newSupplier.category} 
                onValueChange={(value: any) => setNewSupplier(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Gıda</SelectItem>
                  <SelectItem value="cleaning">Temizlik</SelectItem>
                  <SelectItem value="office">Ofis</SelectItem>
                  <SelectItem value="medical">Tıbbi</SelectItem>
                  <SelectItem value="logistics">Lojistik</SelectItem>
                  <SelectItem value="other">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="corporate-form-group">
              <Label htmlFor="contactPerson">İletişim Kişisi</Label>
              <Input
                id="contactPerson"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Ahmet Yılmaz"
              />
            </div>
            <div className="corporate-form-group">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+90 212 555 0101"
              />
            </div>
          </div>

          <div className="corporate-form-group">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
              placeholder="ahmet@gidatedarik.com"
            />
          </div>

          <div className="corporate-form-group">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              value={newSupplier.address || ''}
              onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Tam adres bilgisi..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="corporate-form-group">
              <Label htmlFor="taxNumber">Vergi Numarası</Label>
              <Input
                id="taxNumber"
                value={newSupplier.taxNumber || ''}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, taxNumber: e.target.value }))}
                placeholder="1234567890"
              />
            </div>
            <div className="corporate-form-group">
              <Label htmlFor="paymentTerms">Ödeme Vadesi (gün)</Label>
              <Input
                id="paymentTerms"
                type="number"
                value={newSupplier.paymentTerms || ''}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, paymentTerms: Number(e.target.value) }))}
                placeholder="30"
              />
            </div>
          </div>

          <div className="corporate-form-group">
            <Label htmlFor="creditLimit">Kredi Limiti (TL)</Label>
            <Input
              id="creditLimit"
              type="number"
              value={newSupplier.creditLimit || ''}
              onChange={(e) => setNewSupplier(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
              placeholder="50000"
            />
          </div>

          <div className="corporate-form-group">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              value={newSupplier.notes || ''}
              onChange={(e) => setNewSupplier(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Tedarikçi hakkında notlar..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={newSupplier.isActive}
              onCheckedChange={(checked) => setNewSupplier(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Aktif</Label>
          </div>
        </div>
        <DialogFooter>
          <CorporateButton type="submit" onClick={onSubmit}>
            {title.includes('Düzenle') ? 'Güncelle' : 'Oluştur'}
          </CorporateButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tedarikçi Yönetimi
            </span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <CorporateButton>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Tedarikçi
                </CorporateButton>
              </DialogTrigger>
            </Dialog>
          </CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tedarikçi ara..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Kategori */}
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                category: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="food">Gıda</SelectItem>
                <SelectItem value="cleaning">Temizlik</SelectItem>
                <SelectItem value="office">Ofis</SelectItem>
                <SelectItem value="medical">Tıbbi</SelectItem>
                <SelectItem value="logistics">Lojistik</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>

            {/* Tür */}
            <Select 
              value={filters.type || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                type: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="company">Şirket</SelectItem>
                <SelectItem value="individual">Bireysel</SelectItem>
              </SelectContent>
            </Select>

            {/* Durum */}
            <Select 
              value={filters.isActive === undefined ? 'all' : filters.isActive.toString()} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                isActive: value === 'all' ? undefined : value === 'true'
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Pasif</SelectItem>
              </SelectContent>
            </Select>

            {/* Minimum Rating */}
            <Select 
              value={filters.minRating?.toString() || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                minRating: value === 'all' ? undefined : Number(value)
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min. Puan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Puanlar</SelectItem>
                <SelectItem value="4">4+ Yıldız</SelectItem>
                <SelectItem value="3">3+ Yıldız</SelectItem>
                <SelectItem value="2">2+ Yıldız</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredSuppliers.length} tedarikçi gösteriliyor
        </p>
      </div>

      {/* Suppliers Table */}
      <CorporateCard>
        <CorporateCardContent className="p-0">
          <CorporateTable>
            <CorporateTableHeader>
              <CorporateTableRow>
                <CorporateTableHeaderCell>Tedarikçi</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>İletişim</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Kategori</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Değerlendirme</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Finansal</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Son Sipariş</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Durum</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>İşlemler</CorporateTableHeaderCell>
              </CorporateTableRow>
            </CorporateTableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => {
                const creditStatus = getCreditStatus(supplier)
                return (
                  <CorporateTableRow key={supplier.id}>
                    <CorporateTableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {supplier.code}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <CorporateBadge variant="neutral" className="text-xs">
                            {getTypeName(supplier.type)}
                          </CorporateBadge>
                        </div>
                      </div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="space-y-1">
                        {supplier.contactPerson && (
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {supplier.contactPerson}
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {supplier.phone}
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {supplier.email}
                          </div>
                        )}
                      </div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <CorporateBadge variant="neutral">
                        {getCategoryName(supplier.category)}
                      </CorporateBadge>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      {supplier.rating ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {renderStars(supplier.rating)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {supplier.rating.toFixed(1)}/5.0
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="space-y-1">
                        {supplier.creditLimit && (
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {formatCurrency(supplier.creditLimit, 'TRY', 'tr-TR')}
                              </span>
                            </div>
                            {supplier.currentDebt && supplier.currentDebt > 0 && (
                              <div className={`text-xs ${getCreditStatusColor(creditStatus)}`}>
                                Borç: {formatCurrency(supplier.currentDebt, 'TRY', 'tr-TR')}
                              </div>
                            )}
                          </div>
                        )}
                        {supplier.totalAmount && (
                          <div className="text-xs text-muted-foreground">
                            Toplam: {formatCurrency(supplier.totalAmount, 'TRY', 'tr-TR')}
                          </div>
                        )}
                      </div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      {supplier.lastOrderDate ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(supplier.lastOrderDate)}
                          </div>
                          {supplier.totalOrders && (
                            <div className="text-xs text-muted-foreground">
                              {supplier.totalOrders} sipariş
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="flex items-center gap-2">
                        {supplier.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <CorporateBadge variant={supplier.isActive ? 'default' : 'secondary'}>
                          {supplier.isActive ? 'Aktif' : 'Pasif'}
                        </CorporateBadge>
                        {creditStatus === 'critical' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="flex gap-1">
                        <CorporateButton 
                          size="sm" 
                          variant="neutral"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="h-3 w-3" />
                        </CorporateButton>
                        <CorporateButton 
                          size="sm" 
                          variant="neutral"
                          onClick={() => onSupplierDelete?.(supplier.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </CorporateButton>
                      </div>
                    </CorporateTableCell>
                  </CorporateTableRow>
                )
              })}
            </TableBody>
          </CorporateTable>
          
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">Tedarikçi bulunamadı</p>
              <p className="text-sm text-muted-foreground mb-4">
                Arama kriterlerinizi değiştirin veya yeni tedarikçi oluşturun
              </p>
            </div>
          )}
        </CorporateCardContent>
      </CorporateCard>

      {/* Create Dialog */}
      <SupplierDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Yeni Tedarikçi Oluştur"
        onSubmit={handleCreateSupplier}
      />

      {/* Edit Dialog */}
      <SupplierDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Tedarikçi Düzenle"
        onSubmit={handleUpdateSupplier}
      />
    </div>
  )
}

export default SupplierManagement