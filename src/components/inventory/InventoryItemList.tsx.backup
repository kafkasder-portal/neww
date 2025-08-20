import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  QrCode,
  Eye
} from 'lucide-react'
import { InventoryItem, InventoryFilters } from '@/types/inventory'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface InventoryItemListProps {
  onItemSelect?: (item: InventoryItem) => void
  onItemEdit?: (item: InventoryItem) => void
  onItemDelete?: (item: InventoryItem) => void
  onAddNew?: () => void
}

// Mock data - gerçek uygulamada API'den gelecek
const mockItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Pirinç (5kg)',
    description: 'Yerli pirinç, 5 kilogramlık paket',
    sku: 'FOOD-001',
    barcode: '8690123456789',
    categoryId: '1',
    category: { id: '1', name: 'Gıda Malzemeleri', code: 'FOOD', description: '', isActive: true, createdAt: '', updatedAt: '' },
    locationId: '1',
    location: { id: '1', name: 'Ana Depo - A Rafı', code: 'WH01-A', description: '', type: 'shelf', isActive: true, createdAt: '', updatedAt: '' },
    unitOfMeasure: 'paket',
    unitPrice: 45.50,
    currentStock: 12,
    minimumStock: 20,
    maximumStock: 100,
    reorderPoint: 25,
    status: 'active',
    tags: ['gıda', 'temel'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'user1',
    updatedBy: 'user1'
  },
  {
    id: '2',
    name: 'Deterjan (2L)',
    description: 'Çamaşır deterjanı, 2 litre',
    sku: 'CLEAN-001',
    barcode: '8690987654321',
    categoryId: '2',
    category: { id: '2', name: 'Temizlik Malzemeleri', code: 'CLEAN', description: '', isActive: true, createdAt: '', updatedAt: '' },
    locationId: '2',
    location: { id: '2', name: 'Ana Depo - B Rafı', code: 'WH01-B', description: '', type: 'shelf', isActive: true, createdAt: '', updatedAt: '' },
    unitOfMeasure: 'şişe',
    unitPrice: 28.90,
    currentStock: 0,
    minimumStock: 15,
    maximumStock: 50,
    reorderPoint: 20,
    status: 'active',
    tags: ['temizlik', 'deterjan'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    createdBy: 'user2',
    updatedBy: 'user2'
  },
  {
    id: '3',
    name: 'A4 Kağıt (500 yaprak)',
    description: 'Fotokopi kağıdı, A4 boyut, 80gr',
    sku: 'STAT-001',
    barcode: '8690555666777',
    categoryId: '3',
    category: { id: '3', name: 'Kırtasiye', code: 'STAT', description: '', isActive: true, createdAt: '', updatedAt: '' },
    locationId: '3',
    location: { id: '3', name: 'Ofis Deposu', code: 'OFF01', description: '', type: 'room', isActive: true, createdAt: '', updatedAt: '' },
    unitOfMeasure: 'paket',
    unitPrice: 15.75,
    currentStock: 45,
    minimumStock: 10,
    maximumStock: 100,
    reorderPoint: 15,
    status: 'active',
    tags: ['kırtasiye', 'kağıt'],
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-18T13:20:00Z',
    createdBy: 'user1',
    updatedBy: 'user3'
  }
]

const InventoryItemList: React.FC<InventoryItemListProps> = ({
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onAddNew
}) => {
  const [items, setItems] = useState<InventoryItem[]>(mockItems)
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(mockItems)
  const [filters, setFilters] = useState<InventoryFilters>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, items])

  const applyFilters = () => {
    let filtered = [...items]

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.barcode?.toLowerCase().includes(searchTerm)
      )
    }

    // Kategori filtresi
    if (filters.categoryId) {
      filtered = filtered.filter(item => item.categoryId === filters.categoryId)
    }

    // Lokasyon filtresi
    if (filters.locationId) {
      filtered = filtered.filter(item => item.locationId === filters.locationId)
    }

    // Durum filtresi
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status)
    }

    // Düşük stok filtresi
    if (filters.lowStock) {
      filtered = filtered.filter(item => item.currentStock <= item.minimumStock)
    }

    // Stokta yok filtresi
    if (filters.outOfStock) {
      filtered = filtered.filter(item => item.currentStock === 0)
    }

    setFilteredItems(filtered)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { status: 'out_of_stock', label: 'Stokta Yok', color: 'destructive' }
    } else if (item.currentStock <= item.minimumStock) {
      return { status: 'low_stock', label: 'Düşük Stok', color: 'destructive' }
    } else if (item.maximumStock && item.currentStock >= item.maximumStock) {
      return { status: 'overstock', label: 'Fazla Stok', color: 'secondary' }
    } else {
      return { status: 'normal', label: 'Normal', color: 'default' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'discontinued':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleCategoryFilter = (categoryId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      categoryId: categoryId === 'all' ? undefined : categoryId 
    }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status as any
    }))
  }

  const toggleLowStockFilter = () => {
    setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))
  }

  const toggleOutOfStockFilter = () => {
    setFilters(prev => ({ ...prev, outOfStock: !prev.outOfStock }))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ürün ara..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Kategori */}
            <Select value={filters.categoryId || 'all'} onValueChange={handleCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="1">Gıda Malzemeleri</SelectItem>
                <SelectItem value="2">Temizlik Malzemeleri</SelectItem>
                <SelectItem value="3">Kırtasiye</SelectItem>
              </SelectContent>
            </Select>

            {/* Durum */}
            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
                <SelectItem value="discontinued">Durdurulmuş</SelectItem>
              </SelectContent>
            </Select>

            {/* Hızlı Filtreler */}
            <div className="flex gap-2">
              <Button
                variant={filters.lowStock ? 'default' : 'outline'}
                size="sm"
                onClick={toggleLowStockFilter}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Düşük Stok
              </Button>
              <Button
                variant={filters.outOfStock ? 'default' : 'outline'}
                size="sm"
                onClick={toggleOutOfStockFilter}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Stokta Yok
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} ürün gösteriliyor
          {filters.search && ` ("${filters.search}" araması için)`}
        </p>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ürün
        </Button>
      </div>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lokasyon</TableHead>
                <TableHead>Mevcut Stok</TableHead>
                <TableHead>Birim Fiyat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Stok Durumu</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item)
                return (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onItemSelect?.(item)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{item.sku}</div>
                      {item.barcode && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <QrCode className="h-3 w-3" />
                          {item.barcode}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.location?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.location?.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatNumber(item.currentStock)} {item.unitOfMeasure}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Min: {formatNumber(item.minimumStock)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right font-medium">
                        {formatCurrency(item.unitPrice, 'TRY', 'tr-TR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm capitalize">
                          {item.status === 'active' ? 'Aktif' :
                           item.status === 'inactive' ? 'Pasif' : 'Durdurulmuş'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.color as any}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onItemSelect?.(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onItemDelete?.(item)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">Ürün bulunamadı</p>
              <p className="text-sm text-muted-foreground mb-4">
                Arama kriterlerinizi değiştirin veya yeni ürün ekleyin
              </p>
              <Button onClick={onAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ürün Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryItemList