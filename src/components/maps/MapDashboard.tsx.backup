import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Navigation, 
  Users, 
  Building,
  Search,
  Target,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { InteractiveMap } from './MapComponents'
// import { MapControls } from './MapControls' // Dosya mevcut değil
// import type { MapLocation, MapRoute, MapArea } from '@/types/map' // Dosya mevcut değil

// Inline type definitions
interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: 'help_center' | 'distribution_center' | 'user_location' | 'event_location'
  description?: string
  address?: string
  phone?: string
  email?: string
  status: 'active' | 'inactive' | 'temporary'
  capacity?: number
  currentOccupancy?: number
}

interface MapRoute {
  id: string
  name: string
  points: [number, number][]
  color: string
  distance?: number
  duration?: number
}

interface MapArea {
  id: string
  name: string
  center: [number, number]
  radius: number
  color: string
  description?: string
}
import {
  generateSampleLocations,
  generateSampleRoutes,
  generateSampleAreas
} from './MapComponents'

export const MapDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map')
  const [mapCenter] = useState<[number, number]>([41.0082, 28.9784]) // İstanbul - setMapCenter kullanılmıyor
  const [mapZoom] = useState(12) // setMapZoom kullanılmıyor
  const [showHeatmap] = useState(false) // setShowHeatmap kullanılmıyor
  const [showRoutes] = useState(true) // setShowRoutes kullanılmıyor
  const [showAreas] = useState(true) // setShowAreas kullanılmıyor
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  
  // Veri durumları
  const [locations, setLocations] = useState<MapLocation[]>(generateSampleLocations())
  const [routes] = useState<MapRoute[]>(generateSampleRoutes())
  const [areas] = useState<MapArea[]>(generateSampleAreas())
  
  // Yeni lokasyon ekleme
  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: 0,
    lng: 0,
    type: 'help_center' as MapLocation['type'],
    description: '',
    address: '',
    phone: '',
    email: '',
    status: 'active' as MapLocation['status'],
    capacity: 0
  })



  // Filtrelenmiş lokasyonlar
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || location.type === filterType
    return matchesSearch && matchesType
  })

  // Kullanılmayan fonksiyonlar - MapControls kaldırıldığı için
  // const handleZoomIn = () => {
  //   setMapZoom(prev => Math.min(prev + 1, 18))
  // }

  // const handleZoomOut = () => {
  //   setMapZoom(prev => Math.max(prev - 1, 1))
  // }

  // const handleReset = () => {
  //   setMapCenter([41.0082, 28.9784])
  //   setMapZoom(12)
  // }

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location)
    setActiveTab('details')
  }

  const handleMarkerDrag = (location: MapLocation, newPosition: [number, number]) => {
    setLocations(prev => prev.map(loc => 
      loc.id === location.id 
        ? { ...loc, lat: newPosition[0], lng: newPosition[1] }
        : loc
    ))
  }

  const handleAddLocation = () => {
    if (!newLocation.name || newLocation.lat === 0 || newLocation.lng === 0) return

    const location: MapLocation = {
      id: `location_${Date.now()}`,
      ...newLocation,
      currentOccupancy: 0
    }

    setLocations(prev => [...prev, location])
    setNewLocation({
      name: '',
      lat: 0,
      lng: 0,
      type: 'help_center',
      description: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      capacity: 0
    })
  }

  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id))
    if (selectedLocation?.id === id) {
      setSelectedLocation(null)
    }
  }

  const getLocationTypeIcon = (type: MapLocation['type']) => {
    switch (type) {
      case 'help_center': return <Building className="w-4 h-4" />
      case 'distribution_center': return <Navigation className="w-4 h-4" />
      case 'user_location': return <Users className="w-4 h-4" />
      case 'event_location': return <Target className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getLocationTypeColor = (type: MapLocation['type']) => {
    switch (type) {
      case 'help_center': return 'bg-blue-100 text-blue-800'
      case 'distribution_center': return 'bg-green-100 text-green-800'
      case 'user_location': return 'bg-yellow-100 text-yellow-800'
      case 'event_location': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Kontroller */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Harita Yönetimi</h2>
            <Badge variant="outline">{locations.length} Lokasyon</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Lokasyon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="help_center">Yardım Merkezi</SelectItem>
                <SelectItem value="distribution_center">Dağıtım Merkezi</SelectItem>
                <SelectItem value="user_location">Kullanıcı</SelectItem>
                <SelectItem value="event_location">Etkinlik</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Harita */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="relative">
              <InteractiveMap
                center={mapCenter}
                zoom={mapZoom}
                locations={filteredLocations}
                routes={routes}
                areas={areas}
                onLocationClick={handleLocationClick}
                onMarkerDrag={handleMarkerDrag}
                showHeatmap={showHeatmap}
                showRoutes={showRoutes}
                showAreas={showAreas}
                height="600px"
              />
              {/* MapControls component mevcut değil */}
            </div>
          </Card>
        </div>

        {/* Yan Panel */}
        <div className="space-y-6">
          {/* Lokasyon Listesi */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lokasyonlar</h3>
              <Button size="sm" onClick={() => setActiveTab('add')}>
                <Plus className="w-4 h-4 mr-1" />
                Ekle
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getLocationTypeIcon(location.type)}
                      <div>
                        <p className="font-medium text-sm">{location.name}</p>
                        <p className="text-xs text-gray-600">{location.description}</p>
                      </div>
                    </div>
                    <Badge className={getLocationTypeColor(location.type)}>
                      {location.type === 'help_center' ? 'Yardım' :
                       location.type === 'distribution_center' ? 'Dağıtım' :
                       location.type === 'user_location' ? 'Kullanıcı' : 'Etkinlik'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* İstatistikler */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">İstatistikler</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Toplam Lokasyon:</span>
                <span className="font-semibold">{locations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aktif Lokasyon:</span>
                <span className="font-semibold text-green-600">
                  {locations.filter(l => l.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Toplam Rota:</span>
                <span className="font-semibold">{routes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hizmet Alanı:</span>
                <span className="font-semibold">{areas.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Detay Sekmeleri */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Harita</TabsTrigger>
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="add">Yeni Ekle</TabsTrigger>
        </TabsList>

        {/* Detaylar Sekmesi */}
        <TabsContent value="details" className="space-y-4">
          {selectedLocation ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{selectedLocation.name}</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteLocation(selectedLocation.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Sil
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Temel Bilgiler</h4>
                  <div className="space-y-2">
                    <p><strong>Tür:</strong> {selectedLocation.type}</p>
                    <p><strong>Açıklama:</strong> {selectedLocation.description}</p>
                    <p><strong>Durum:</strong> 
                      <Badge className={`ml-2 ${
                        selectedLocation.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedLocation.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedLocation.status === 'active' ? 'Aktif' :
                         selectedLocation.status === 'inactive' ? 'Pasif' : 'Geçici'}
                      </Badge>
                    </p>
                    {selectedLocation.capacity && (
                      <p><strong>Kapasite:</strong> {selectedLocation.currentOccupancy || 0}/{selectedLocation.capacity}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">İletişim Bilgileri</h4>
                  <div className="space-y-2">
                    {selectedLocation.address && (
                      <p><strong>Adres:</strong> {selectedLocation.address}</p>
                    )}
                    {selectedLocation.phone && (
                      <p><strong>Telefon:</strong> {selectedLocation.phone}</p>
                    )}
                    {selectedLocation.email && (
                      <p><strong>E-posta:</strong> {selectedLocation.email}</p>
                    )}
                    <p><strong>Koordinatlar:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Detayları görüntülemek için bir lokasyon seçin</p>
            </Card>
          )}
        </TabsContent>

        {/* Yeni Ekleme Sekmesi */}
        <TabsContent value="add" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Yeni Lokasyon Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lokasyon Adı</label>
                <Input
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Lokasyon adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tür</label>
                <Select 
                  value={newLocation.type} 
                  onValueChange={(value: string) => setNewLocation(prev => ({ ...prev, type: value as MapLocation['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="help_center">Yardım Merkezi</SelectItem>
                    <SelectItem value="distribution_center">Dağıtım Merkezi</SelectItem>
                    <SelectItem value="user_location">Kullanıcı Lokasyonu</SelectItem>
                    <SelectItem value="event_location">Etkinlik Lokasyonu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Enlem</label>
                <Input
                  type="number"
                  step="any"
                  value={newLocation.lat}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                  placeholder="41.0082"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Boylam</label>
                <Input
                  type="number"
                  step="any"
                  value={newLocation.lng}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                  placeholder="28.9784"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <Input
                  value={newLocation.description}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Lokasyon açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Adres</label>
                <Input
                  value={newLocation.address}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <Input
                  value={newLocation.phone}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Telefon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <Input
                  type="email"
                  value={newLocation.email}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="E-posta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kapasite</label>
                <Input
                  type="number"
                  value={newLocation.capacity}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  placeholder="Kapasite"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAddLocation} disabled={!newLocation.name}>
                <Plus className="w-4 h-4 mr-1" />
                Lokasyon Ekle
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
