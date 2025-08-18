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
  MapPin,
  Building,
  Package,
  Edit,
  Trash2,
  Eye,
  QrCode,
  Warehouse,
  Grid3X3,
  Archive,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { WarehouseLocation, WarehouseLocationForm, WarehouseLocationFilters } from '@/types/inventory'

interface WarehouseLocationsProps {
  onLocationCreate?: (location: WarehouseLocationForm) => void
  onLocationUpdate?: (locationId: string, location: WarehouseLocationForm) => void
  onLocationDelete?: (locationId: string) => void
}

// Mock data - gerçek uygulamada API'den gelecek
const mockLocations: WarehouseLocation[] = [
  {
    id: '1',
    name: 'Ana Depo - A Rafı',
    code: 'WH01-A',
    description: 'Gıda ürünleri için ana depo A rafı',
    type: 'shelf',
    parentId: 'wh01',
    isActive: true,
    capacity: 500,
    currentOccupancy: 320,
    address: 'Ana Depo, 1. Kat, A Bölümü',
    coordinates: { latitude: 41.0082, longitude: 28.9784 },
    qrCode: 'QR-WH01-A',
    barcode: 'BC-WH01-A',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Ana Depo - B Rafı',
    code: 'WH01-B',
    description: 'Temizlik ürünleri için ana depo B rafı',
    type: 'shelf',
    parentId: 'wh01',
    isActive: true,
    capacity: 300,
    currentOccupancy: 180,
    address: 'Ana Depo, 1. Kat, B Bölümü',
    coordinates: { latitude: 41.0082, longitude: 28.9784 },
    qrCode: 'QR-WH01-B',
    barcode: 'BC-WH01-B',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    name: 'Ofis Deposu',
    code: 'OFF01',
    description: 'Ofis malzemeleri ve kırtasiye deposu',
    type: 'room',
    isActive: true,
    capacity: 100,
    currentOccupancy: 65,
    address: 'Ofis Binası, Zemin Kat',
    coordinates: { latitude: 41.0085, longitude: 28.9790 },
    qrCode: 'QR-OFF01',
    barcode: 'BC-OFF01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '4',
    name: 'Soğuk Hava Deposu',
    code: 'COLD01',
    description: 'Soğuk zincir gerektiren ürünler için',
    type: 'cold_storage',
    isActive: true,
    capacity: 200,
    currentOccupancy: 45,
    address: 'Ana Depo, Bodrum Kat',
    coordinates: { latitude: 41.0082, longitude: 28.9784 },
    qrCode: 'QR-COLD01',
    barcode: 'BC-COLD01',
    temperatureRange: { min: 2, max: 8 },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '5',
    name: 'Arşiv Deposu',
    code: 'ARC01',
    description: 'Kullanılmayan ve arşiv malzemeler',
    type: 'archive',
    isActive: false,
    capacity: 150,
    currentOccupancy: 120,
    address: 'Ek Bina, 2. Kat',
    coordinates: { latitude: 41.0080, longitude: 28.9788 },
    qrCode: 'QR-ARC01',
    barcode: 'BC-ARC01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z'
  }
]

const WarehouseLocations: React.FC<WarehouseLocationsProps> = ({
  onLocationCreate,
  onLocationUpdate,
  onLocationDelete
}) => {
  const [locations, setLocations] = useState<WarehouseLocation[]>(mockLocations)
  const [filteredLocations, setFilteredLocations] = useState<WarehouseLocation[]>(mockLocations)
  const [filters, setFilters] = useState<WarehouseLocationFilters>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<WarehouseLocation | null>(null)
  const [newLocation, setNewLocation] = useState<WarehouseLocationForm>({
    name: '',
    code: '',
    type: 'shelf',
    isActive: true
  })

  useEffect(() => {
    applyFilters()
  }, [filters, locations])

  const applyFilters = () => {
    let filtered = [...locations]

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(searchTerm) ||
        location.code.toLowerCase().includes(searchTerm) ||
        location.description?.toLowerCase().includes(searchTerm) ||
        location.address?.toLowerCase().includes(searchTerm)
      )
    }

    // Tür filtresi
    if (filters.type) {
      filtered = filtered.filter(location => location.type === filters.type)
    }

    // Durum filtresi
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(location => location.isActive === filters.isActive)
    }

    setFilteredLocations(filtered)
  }

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-4 w-4 text-blue-500" />
      case 'room':
        return <Building className="h-4 w-4 text-green-500" />
      case 'shelf':
        return <Grid3X3 className="h-4 w-4 text-purple-500" />
      case 'cold_storage':
        return <Package className="h-4 w-4 text-cyan-500" />
      case 'archive':
        return <Archive className="h-4 w-4 text-gray-500" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getLocationTypeName = (type: string) => {
    switch (type) {
      case 'warehouse': return 'Depo'
      case 'room': return 'Oda'
      case 'shelf': return 'Raf'
      case 'cold_storage': return 'Soğuk Depo'
      case 'archive': return 'Arşiv'
      default: return type
    }
  }

  const getOccupancyPercentage = (location: WarehouseLocation) => {
    if (!location.capacity || !location.currentOccupancy) return 0
    return Math.round((location.currentOccupancy / location.capacity) * 100)
  }

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 70) return 'text-orange-500'
    return 'text-green-500'
  }

  const handleCreateLocation = () => {
    if (onLocationCreate) {
      onLocationCreate(newLocation)
    }
    setIsCreateDialogOpen(false)
    setNewLocation({
      name: '',
      code: '',
      type: 'shelf',
      isActive: true
    })
  }

  const handleEditLocation = (location: WarehouseLocation) => {
    setSelectedLocation(location)
    setNewLocation({
      name: location.name,
      code: location.code,
      description: location.description,
      type: location.type,
      isActive: location.isActive,
      capacity: location.capacity,
      address: location.address
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateLocation = () => {
    if (selectedLocation && onLocationUpdate) {
      onLocationUpdate(selectedLocation.id, newLocation)
    }
    setIsEditDialogOpen(false)
    setSelectedLocation(null)
    setNewLocation({
      name: '',
      code: '',
      type: 'shelf',
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

  const LocationDialog = ({ isOpen, onOpenChange, title, onSubmit }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    onSubmit: () => void
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Depo lokasyonu bilgilerini girin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Lokasyon Adı
            </Label>
            <Input
              id="name"
              value={newLocation.name}
              onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
              className="col-span-3"
              placeholder="Ana Depo - A Rafı"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Lokasyon Kodu
            </Label>
            <Input
              id="code"
              value={newLocation.code}
              onChange={(e) => setNewLocation(prev => ({ ...prev, code: e.target.value }))}
              className="col-span-3"
              placeholder="WH01-A"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tür
            </Label>
            <Select 
              value={newLocation.type} 
              onValueChange={(value: any) => setNewLocation(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">Depo</SelectItem>
                <SelectItem value="room">Oda</SelectItem>
                <SelectItem value="shelf">Raf</SelectItem>
                <SelectItem value="cold_storage">Soğuk Depo</SelectItem>
                <SelectItem value="archive">Arşiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Kapasite
            </Label>
            <Input
              id="capacity"
              type="number"
              value={newLocation.capacity || ''}
              onChange={(e) => setNewLocation(prev => ({ ...prev, capacity: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adres
            </Label>
            <Input
              id="address"
              value={newLocation.address || ''}
              onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
              className="col-span-3"
              placeholder="Ana Depo, 1. Kat, A Bölümü"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Açıklama
            </Label>
            <Textarea
              id="description"
              value={newLocation.description || ''}
              onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
              className="col-span-3"
              rows={3}
              placeholder="Lokasyon açıklaması..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Aktif
            </Label>
            <div className="col-span-3">
              <Switch
                id="isActive"
                checked={newLocation.isActive}
                onCheckedChange={(checked) => setNewLocation(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            {title.includes('Düzenle') ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Depo Lokasyonları
            </span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Lokasyon
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Lokasyon ara..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Tür */}
            <Select 
              value={filters.type || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                type: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lokasyon türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="warehouse">Depo</SelectItem>
                <SelectItem value="room">Oda</SelectItem>
                <SelectItem value="shelf">Raf</SelectItem>
                <SelectItem value="cold_storage">Soğuk Depo</SelectItem>
                <SelectItem value="archive">Arşiv</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredLocations.length} lokasyon gösteriliyor
        </p>
      </div>

      {/* Locations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lokasyon</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Kapasite</TableHead>
                <TableHead>Doluluk</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>QR/Barkod</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => {
                const occupancyPercentage = getOccupancyPercentage(location)
                return (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {location.code}
                        </div>
                        {location.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {location.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationTypeIcon(location.type)}
                        <span>{getLocationTypeName(location.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {location.capacity ? (
                        <div className="text-sm">
                          <div className="font-medium">{location.capacity} birim</div>
                          {location.temperatureRange && (
                            <div className="text-xs text-muted-foreground">
                              {location.temperatureRange.min}°C - {location.temperatureRange.max}°C
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {location.capacity && location.currentOccupancy ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{location.currentOccupancy}</span>
                            <span className={getOccupancyColor(occupancyPercentage)}>
                              %{occupancyPercentage}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                occupancyPercentage >= 90 ? 'bg-red-500' :
                                occupancyPercentage >= 70 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${occupancyPercentage}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {location.address || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {location.qrCode && (
                          <div className="flex items-center gap-1 text-xs">
                            <QrCode className="h-3 w-3" />
                            <span className="font-mono">{location.qrCode}</span>
                          </div>
                        )}
                        {location.barcode && (
                          <div className="flex items-center gap-1 text-xs">
                            <Grid3X3 className="h-3 w-3" />
                            <span className="font-mono">{location.barcode}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {location.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={location.isActive ? 'default' : 'secondary'}>
                          {location.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditLocation(location)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onLocationDelete?.(location.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">Lokasyon bulunamadı</p>
              <p className="text-sm text-muted-foreground mb-4">
                Arama kriterlerinizi değiştirin veya yeni lokasyon oluşturun
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <LocationDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Yeni Lokasyon Oluştur"
        onSubmit={handleCreateLocation}
      />

      {/* Edit Dialog */}
      <LocationDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Lokasyon Düzenle"
        onSubmit={handleUpdateLocation}
      />
    </div>
  )
}

export default WarehouseLocations