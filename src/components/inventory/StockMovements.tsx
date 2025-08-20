import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CorporateButton, CorporateBadge, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle, CorporateTable } from '@/components/ui/corporate/CorporateComponents'

import { Input } from '@/components/ui/input'

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
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  ArrowRightLeft,
  Settings,
  Calendar,
  User,
  Package,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { StockMovement, StockMovementForm, StockMovementFilters } from '@/types/inventory'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface StockMovementsProps {
  onMovementCreate?: (movement: StockMovementForm) => void
  onMovementApprove?: (movementId: string) => void
  onMovementReject?: (movementId: string) => void
}

// Mock data - gerçek uygulamada API'den gelecek
const mockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    item: {
      id: '1',
      name: 'Pirinç (5kg)',
      sku: 'FOOD-001',
      description: '',
      categoryId: '1',
      locationId: '1',
      unitOfMeasure: 'paket',
      unitPrice: 45.50,
      currentStock: 12,
      minimumStock: 20,
      maximumStock: 100,
      reorderPoint: 25,
      status: 'active',
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      updatedBy: ''
    },
    movementType: 'in',
    quantity: 50,
    unitPrice: 45.50,
    totalValue: 2275,
    toLocationId: '1',
    toLocation: {
      id: '1',
      name: 'Ana Depo - A Rafı',
      code: 'WH01-A',
      description: '',
      type: 'shelf',
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    reason: 'Satın alma',
    referenceNumber: 'PO-2024-001',
    referenceType: 'purchase',
    referenceId: 'po-001',
    notes: 'Tedarikçiden gelen yeni stok',
    performedBy: 'user1',
    performedAt: '2024-01-20T10:30:00Z',
    approvedBy: 'manager1',
    approvedAt: '2024-01-20T11:00:00Z',
    status: 'approved'
  },
  {
    id: '2',
    itemId: '2',
    item: {
      id: '2',
      name: 'Deterjan (2L)',
      sku: 'CLEAN-001',
      description: '',
      categoryId: '2',
      locationId: '2',
      unitOfMeasure: 'şişe',
      unitPrice: 28.90,
      currentStock: 0,
      minimumStock: 15,
      maximumStock: 50,
      reorderPoint: 20,
      status: 'active',
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      updatedBy: ''
    },
    movementType: 'out',
    quantity: 25,
    unitPrice: 28.90,
    totalValue: 722.50,
    fromLocationId: '2',
    fromLocation: {
      id: '2',
      name: 'Ana Depo - B Rafı',
      code: 'WH01-B',
      description: '',
      type: 'shelf',
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    reason: 'Yardım dağıtımı',
    referenceNumber: 'AID-2024-015',
    referenceType: 'aid',
    referenceId: 'aid-015',
    notes: 'Aile yardım paketi için',
    performedBy: 'user2',
    performedAt: '2024-01-22T14:15:00Z',
    status: 'pending'
  },
  {
    id: '3',
    itemId: '3',
    item: {
      id: '3',
      name: 'A4 Kağıt (500 yaprak)',
      sku: 'STAT-001',
      description: '',
      categoryId: '3',
      locationId: '3',
      unitOfMeasure: 'paket',
      unitPrice: 15.75,
      currentStock: 45,
      minimumStock: 10,
      maximumStock: 100,
      reorderPoint: 15,
      status: 'active',
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      updatedBy: ''
    },
    movementType: 'transfer',
    quantity: 10,
    fromLocationId: '3',
    fromLocation: {
      id: '3',
      name: 'Ofis Deposu',
      code: 'OFF01',
      description: '',
      type: 'room',
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    toLocationId: '1',
    toLocation: {
      id: '1',
      name: 'Ana Depo - A Rafı',
      code: 'WH01-A',
      description: '',
      type: 'shelf',
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    reason: 'Lokasyon değişikliği',
    referenceNumber: 'TRF-2024-003',
    referenceType: 'transfer',
    notes: 'Daha uygun lokasyona taşıma',
    performedBy: 'user3',
    performedAt: '2024-01-18T09:45:00Z',
    approvedBy: 'manager1',
    approvedAt: '2024-01-18T10:15:00Z',
    status: 'approved'
  }
]

const StockMovements: React.FC<StockMovementsProps> = ({
  onMovementCreate,
  onMovementApprove,
  onMovementReject
}) => {
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements)
  const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>(mockMovements)
  const [filters, setFilters] = useState<StockMovementFilters>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMovement, setNewMovement] = useState<StockMovementForm>({
    itemId: '',
    movementType: 'in',
    quantity: 0,
    reason: ''
  })

  useEffect(() => {
    applyFilters()
  }, [filters, movements])

  const applyFilters = () => {
    let filtered = [...movements]

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(movement => 
        movement.item?.name.toLowerCase().includes(searchTerm) ||
        movement.item?.sku.toLowerCase().includes(searchTerm) ||
        movement.referenceNumber?.toLowerCase().includes(searchTerm) ||
        movement.reason.toLowerCase().includes(searchTerm)
      )
    }

    // Hareket türü filtresi
    if (filters.movementType) {
      filtered = filtered.filter(movement => movement.movementType === filters.movementType)
    }

    // Durum filtresi
    if (filters.status) {
      filtered = filtered.filter(movement => movement.status === filters.status)
    }

    // Tarih filtresi
    if (filters.dateFrom) {
      filtered = filtered.filter(movement => 
        new Date(movement.performedAt) >= new Date(filters.dateFrom!)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(movement => 
        new Date(movement.performedAt) <= new Date(filters.dateTo!)
      )
    }

    setFilteredMovements(filtered)
  }

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'out':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
      case 'adjustment':
        return <Settings className="h-4 w-4 text-orange-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getMovementTypeName = (type: string) => {
    switch (type) {
      case 'in': return 'Giriş'
      case 'out': return 'Çıkış'
      case 'transfer': return 'Transfer'
      case 'adjustment': return 'Düzeltme'
      default: return type
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı'
      case 'pending': return 'Bekliyor'
      case 'rejected': return 'Reddedildi'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'pending': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const handleCreateMovement = () => {
    if (onMovementCreate) {
      onMovementCreate(newMovement)
    }
    setIsCreateDialogOpen(false)
    setNewMovement({
      itemId: '',
      movementType: 'in',
      quantity: 0,
      reason: ''
    })
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Stok Hareketleri
            </span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <CorporateButton>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Hareket
                </CorporateButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yeni Stok Hareketi</DialogTitle>
                  <DialogDescription>
                    Stok giriş, çıkış veya transfer işlemi oluşturun
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="movementType" className="text-right">
                      Hareket Türü
                    </Label>
                    <Select 
                      value={newMovement.movementType} 
                      onValueChange={(value: any) => setNewMovement(prev => ({ ...prev, movementType: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Giriş</SelectItem>
                        <SelectItem value="out">Çıkış</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="adjustment">Düzeltme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Miktar
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMovement.quantity}
                      onChange={(e) => setNewMovement(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      Sebep
                    </Label>
                    <Input
                      id="reason"
                      value={newMovement.reason}
                      onChange={(e) => setNewMovement(prev => ({ ...prev, reason: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notlar
                    </Label>
                    <Textarea
                      id="notes"
                      value={newMovement.notes || ''}
                      onChange={(e) => setNewMovement(prev => ({ ...prev, notes: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <CorporateButton type="submit" onClick={handleCreateMovement}>
                    Oluştur
                  </CorporateButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hareket ara..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Hareket Türü */}
            <Select 
              value={filters.movementType || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                movementType: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hareket türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Hareketler</SelectItem>
                <SelectItem value="in">Giriş</SelectItem>
                <SelectItem value="out">Çıkış</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="adjustment">Düzeltme</SelectItem>
              </SelectContent>
            </Select>

            {/* Durum */}
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                status: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="approved">Onaylandı</SelectItem>
                <SelectItem value="rejected">Reddedildi</SelectItem>
              </SelectContent>
            </Select>

            {/* Tarih Aralığı */}
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="text-sm"
              />
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredMovements.length} hareket gösteriliyor
        </p>
      </div>

      {/* Movements Table */}
      <CorporateCard>
        <CorporateCardContent className="p-0">
          <CorporateTable>
            <CorporateTableHeader>
              <CorporateTableRow>
                <CorporateTableHeaderCell>Tarih</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Ürün</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Hareket</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Miktar</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Lokasyon</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Referans</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Sebep</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>Durum</CorporateTableHeaderCell>
                <CorporateTableHeaderCell>İşlemler</CorporateTableHeaderCell>
              </CorporateTableRow>
            </CorporateTableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <CorporateTableRow key={movement.id}>
                  <CorporateTableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {formatDate(movement.performedAt)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {movement.performedBy}
                        </div>
                      </div>
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div>
                      <div className="font-medium">{movement.item?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {movement.item?.sku}
                      </div>
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div className="flex items-center gap-2">
                      {getMovementTypeIcon(movement.movementType)}
                      <span className="font-medium">
                        {getMovementTypeName(movement.movementType)}
                      </span>
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div className="text-right">
                      <div className="font-medium">
                        {movement.movementType === 'out' ? '-' : '+'}
                        {formatNumber(movement.quantity)} {movement.item?.unitOfMeasure}
                      </div>
                      {movement.totalValue && (
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(movement.totalValue, 'TRY', 'tr-TR')}
                        </div>
                      )}
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div className="text-sm">
                      {movement.fromLocation && (
                        <div className="flex items-center gap-1 text-red-600">
                          <MapPin className="h-3 w-3" />
                          {movement.fromLocation.name}
                        </div>
                      )}
                      {movement.toLocation && (
                        <div className="flex items-center gap-1 text-green-600">
                          <MapPin className="h-3 w-3" />
                          {movement.toLocation.name}
                        </div>
                      )}
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    {movement.referenceNumber && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {movement.referenceNumber}
                        </span>
                      </div>
                    )}
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div className="text-sm">{movement.reason}</div>
                    {movement.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {movement.notes}
                      </div>
                    )}
                  </CorporateTableCell>
                  <CorporateTableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(movement.status)}
                      <CorporateBadge variant={getStatusColor(movement.status) as any}>
                        {getStatusName(movement.status)}
                      </CorporateBadge>
                    </div>
                  </CorporateTableCell>
                  <CorporateTableCell>
                    {movement.status === 'pending' && (
                      <div className="flex gap-1">
                        <CorporateButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => onMovementApprove?.(movement.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </CorporateButton>
                        <CorporateButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => onMovementReject?.(movement.id)}
                        >
                          <XCircle className="h-3 w-3" />
                        </CorporateButton>
                      </div>
                    )}
                  </CorporateTableCell>
                </CorporateTableRow>
              ))}
            </TableBody>
          </CorporateTable>
          
          {filteredMovements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">Hareket bulunamadı</p>
              <p className="text-sm text-muted-foreground mb-4">
                Arama kriterlerinizi değiştirin veya yeni hareket oluşturun
              </p>
            </div>
          )}
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}

export default StockMovements