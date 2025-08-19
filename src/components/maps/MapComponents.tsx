import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet marker icon sorununu çöz
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface MapLocation {
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

export interface MapRoute {
  id: string
  name: string
  points: [number, number][]
  color: string
  distance?: number
  duration?: number
}

export interface MapArea {
  id: string
  name: string
  center: [number, number]
  radius: number
  color: string
  description?: string
}

interface MapViewProps {
  center: [number, number]
  zoom: number
  locations?: MapLocation[]
  routes?: MapRoute[]
  areas?: MapArea[]
  onLocationClick?: (location: MapLocation) => void
  onMarkerDrag?: (location: MapLocation, newPosition: [number, number]) => void
  showHeatmap?: boolean
  showRoutes?: boolean
  showAreas?: boolean
  height?: string
}

// Harita merkezini güncelleme komponenti
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  
  return null
}

// Özel marker ikonları
const createCustomIcon = (type: MapLocation['type']) => {
  const colors = {
    help_center: '#3B82F6', // Blue
    distribution_center: '#10B981', // Green
    user_location: '#F59E0B', // Yellow
    event_location: '#EF4444' // Red
  }
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${colors[type]};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        ${type === 'help_center' ? 'H' : 
          type === 'distribution_center' ? 'D' : 
          type === 'user_location' ? 'U' : 'E'}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

export const InteractiveMap: React.FC<MapViewProps> = ({
  center,
  zoom,
  locations = [],
  routes = [],
  areas = [],
  onLocationClick,
  onMarkerDrag,
  // showHeatmap = false, // Kullanılmıyor
  showRoutes = true,
  showAreas = true,
  height = '500px'
}) => {
  const mapRef = useRef<L.Map>(null)

  const handleMarkerClick = (location: MapLocation) => {
    if (onLocationClick) {
      onLocationClick(location)
    }
  }

  const handleMarkerDrag = (location: MapLocation, event: L.DragEndEvent) => {
    if (onMarkerDrag) {
      const newPosition: [number, number] = [
        event.target.getLatLng().lat,
        event.target.getLatLng().lng
      ]
      onMarkerDrag(location, newPosition)
    }
  }

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <MapUpdater center={center} />
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Lokasyonlar */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.type)}
            draggable={location.type === 'user_location'}
            eventHandlers={{
              click: () => handleMarkerClick(location),
              dragend: (e) => handleMarkerDrag(location, e)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                {location.address && (
                  <p className="text-sm mb-1">
                    <strong>Adres:</strong> {location.address}
                  </p>
                )}
                {location.phone && (
                  <p className="text-sm mb-1">
                    <strong>Telefon:</strong> {location.phone}
                  </p>
                )}
                {location.email && (
                  <p className="text-sm mb-1">
                    <strong>E-posta:</strong> {location.email}
                  </p>
                )}
                {location.capacity && (
                  <p className="text-sm mb-1">
                    <strong>Kapasite:</strong> {location.currentOccupancy || 0}/{location.capacity}
                  </p>
                )}
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    location.status === 'active' ? 'bg-green-100 text-green-800' :
                    location.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {location.status === 'active' ? 'Aktif' :
                     location.status === 'inactive' ? 'Pasif' : 'Geçici'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rotalar */}
        {showRoutes && routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.points}
            color={route.color}
            weight={3}
            opacity={0.8}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{route.name}</h3>
                {route.distance && (
                  <p className="text-sm">Mesafe: {route.distance} km</p>
                )}
                {route.duration && (
                  <p className="text-sm">Süre: {route.duration} dk</p>
                )}
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Alanlar */}
        {showAreas && areas.map((area) => (
          <Circle
            key={area.id}
            center={area.center}
            radius={area.radius}
            pathOptions={{
              color: area.color,
              fillColor: area.color,
              fillOpacity: 0.2
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{area.name}</h3>
                <p className="text-sm">{area.description}</p>
                <p className="text-sm">Yarıçap: {area.radius} m</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  )
}

// Harita kontrolleri komponenti
interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onToggleHeatmap: () => void
  onToggleRoutes: () => void
  onToggleAreas: () => void
  showHeatmap: boolean
  showRoutes: boolean
  showAreas: boolean
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleHeatmap,
  onToggleRoutes,
  onToggleAreas,
  showHeatmap,
  showRoutes,
  showAreas
}) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 space-y-2">
      <div className="flex flex-col space-y-1">
        <button
          onClick={onZoomIn}
          className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
          title="Yakınlaştır"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          className="w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
          title="Uzaklaştır"
        >
          -
        </button>
        <button
          onClick={onReset}
          className="w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
          title="Sıfırla"
        >
          ⌂
        </button>
      </div>
      
      <div className="border-t pt-2">
        <div className="space-y-1">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={onToggleHeatmap}
              className="rounded"
            />
            <span>Isı Haritası</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={onToggleRoutes}
              className="rounded"
            />
            <span>Rotalar</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showAreas}
              onChange={onToggleAreas}
              className="rounded"
            />
            <span>Alanlar</span>
          </label>
        </div>
      </div>
    </div>
  )
}

// Örnek veri oluşturucular
export const generateSampleLocations = (): MapLocation[] => {
  return [
    {
      id: '1',
      name: 'Merkez Yardım Noktası',
      lat: 41.0082,
      lng: 28.9784,
      type: 'help_center',
      description: 'Ana yardım dağıtım merkezi',
      address: 'Sultanahmet, İstanbul',
      phone: '0212 555 0123',
      email: 'merkez@dernek.org',
      status: 'active',
      capacity: 1000,
      currentOccupancy: 750
    },
    {
      id: '2',
      name: 'Kadıköy Dağıtım Merkezi',
      lat: 40.9909,
      lng: 29.0303,
      type: 'distribution_center',
      description: 'Doğu yakası dağıtım merkezi',
      address: 'Kadıköy, İstanbul',
      phone: '0216 555 0456',
      email: 'kadikoy@dernek.org',
      status: 'active',
      capacity: 500,
      currentOccupancy: 300
    },
    {
      id: '3',
      name: 'Ahmet Yılmaz',
      lat: 41.0151,
      lng: 28.9795,
      type: 'user_location',
      description: 'Yardım alan kişi',
      phone: '0532 555 0789',
      status: 'active'
    },
    {
      id: '4',
      name: 'Yılbaşı Etkinliği',
      lat: 41.0082,
      lng: 28.9784,
      type: 'event_location',
      description: 'Yılbaşı yardım etkinliği',
      address: 'Taksim Meydanı, İstanbul',
      status: 'temporary'
    }
  ]
}

export const generateSampleRoutes = (): MapRoute[] => {
  return [
    {
      id: 'route_1',
      name: 'Merkez - Kadıköy Rota',
      points: [
        [41.0082, 28.9784],
        [40.9909, 29.0303]
      ],
      color: '#3B82F6',
      distance: 12.5,
      duration: 25
    },
    {
      id: 'route_2',
      name: 'Dağıtım Rota 1',
      points: [
        [41.0082, 28.9784],
        [41.0151, 28.9795],
        [41.0200, 28.9850]
      ],
      color: '#10B981',
      distance: 8.2,
      duration: 15
    }
  ]
}

export const generateSampleAreas = (): MapArea[] => {
  return [
    {
      id: 'area_1',
      name: 'Merkez Hizmet Alanı',
      center: [41.0082, 28.9784],
      radius: 5000,
      color: '#3B82F6',
      description: '5km yarıçapında hizmet alanı'
    },
    {
      id: 'area_2',
      name: 'Kadıköy Hizmet Alanı',
      center: [40.9909, 29.0303],
      radius: 3000,
      color: '#10B981',
      description: '3km yarıçapında hizmet alanı'
    }
  ]
}
