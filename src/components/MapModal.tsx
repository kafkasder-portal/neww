import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Modal } from './Modal'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Leaflet marker ikonlarını düzelt
delete ((L.Icon.Default.prototype as unknown) as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  address: string
  bankNumber: string
  assignedTo: string
}

interface Coordinates {
  lat: number
  lng: number
}

export const MapModal = ({ isOpen, onClose, address, bankNumber, assignedTo }: MapModalProps) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Geocoding fonksiyonu - adres koordinatlara çevir
  const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      // Nominatim API kullanarak geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
      }
      return null
    } catch (error) {
      console.error('Geocoding hatası:', error)
      return null
    }
  }

  // Google Maps'te rota aç
  const openGoogleMapsRoute = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
      window.open(url, '_blank')
    } else {
      // Koordinat yoksa adres ile aç
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  // Apple Maps'te rota aç
  const openAppleMapsRoute = () => {
    if (coordinates) {
      const url = `https://maps.apple.com/?daddr=${coordinates.lat},${coordinates.lng}`
      window.open(url, '_blank')
    } else {
      const url = `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  // Yandex Maps'te rota aç
  const openYandexMapsRoute = () => {
    if (coordinates) {
      const url = `https://yandex.com.tr/maps/?rtext=~${coordinates.lat},${coordinates.lng}&rtt=auto`
      window.open(url, '_blank')
    } else {
      const url = `https://yandex.com.tr/maps/?text=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  useEffect(() => {
    if (isOpen && address) {
      setLoading(true)
      setError(null)
      
      geocodeAddress(address)
        .then((coords) => {
          if (coords) {
            setCoordinates(coords)
          } else {
            setError('Adres bulunamadı')
          }
        })
        .catch(() => {
          setError('Adres aranırken hata oluştu')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, address])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Harita - ${bankNumber}`} size="large">
      <div className="space-y-4">
        {/* Kumbara Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Kumbara:</span>
              <span className="ml-2 font-medium">{bankNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Atanan Yer:</span>
              <span className="ml-2 font-medium">{assignedTo}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Adres:</span>
              <span className="ml-2 font-medium">{address}</span>
            </div>
          </div>
        </div>

        {/* Rota Butonları */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openGoogleMapsRoute}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <span>🗺️</span>
            Google Maps&apos;te Rota
          </button>
          <button
            onClick={openAppleMapsRoute}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <span>🍎</span>
            Apple Maps&apos;te Rota
          </button>
          <button
            onClick={openYandexMapsRoute}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <span>🔍</span>
            Yandex Maps&apos;te Rota
          </button>
        </div>

        {/* Harita */}
        <div className="h-96 border rounded-lg overflow-hidden">
          {loading && (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Adres aranıyor...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <p className="text-sm text-gray-500">Rota butonlarını kullanarak harici harita uygulamalarında açabilirsiniz.</p>
              </div>
            </div>
          )}
          
          {coordinates && !loading && !error && (
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>
                  <div className="text-center">
                    <strong>{bankNumber}</strong><br />
                    {assignedTo}<br />
                    <small>{address}</small>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {/* Bilgi Notu */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          💡 <strong>İpucu:</strong> Rota butonlarını kullanarak tercih ettiğiniz harita uygulamasında navigasyon başlatabilirsiniz.
        </div>
      </div>
    </Modal>
  )
}