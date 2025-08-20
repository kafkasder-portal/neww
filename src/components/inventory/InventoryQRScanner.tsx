import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CorporateButton } from '@/components/ui/corporate/CorporateComponents'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Camera, Scan, X, Package, MapPin, Tag, Calendar } from 'lucide-react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'

interface InventoryQRData {
  type: string
  id?: string
  name?: string
  code: string
  category?: string
  location?: string
  quantity?: number
  unit?: string
  supplier?: string
  expiryDate?: string
  timestamp: string
}

interface InventoryQRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (data: InventoryQRData) => void
  onError?: (error: string) => void
}

export const InventoryQRScanner: React.FC<InventoryQRScannerProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<InventoryQRData | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0)

  // Kamera cihazlarını listele
  const getCameraDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setCameraDevices(videoDevices)
      return videoDevices
    } catch (error) {
      console.error('Kamera cihazları alınamadı:', error)
      return []
    }
  }, [])

  // QR kod verisini parse et
  const parseQRData = (rawData: string): InventoryQRData | null => {
    try {
      const data = JSON.parse(rawData)
      
      // Envanter QR kodu kontrolü
      if (data.type === 'inventory_item') {
        return {
          type: data.type,
          id: data.id,
          name: data.name,
          code: data.code,
          category: data.category,
          location: data.location,
          quantity: data.quantity,
          unit: data.unit,
          supplier: data.supplier,
          expiryDate: data.expiryDate,
          timestamp: data.timestamp
        }
      }
      
      // Basit ürün kodu formatı
      if (typeof data === 'string' && data.length > 0) {
        return {
          type: 'simple_code',
          code: data,
          timestamp: new Date().toISOString()
        }
      }
      
      return null
    } catch {
      // JSON değilse, basit string olarak değerlendir
      if (typeof rawData === 'string' && rawData.trim().length > 0) {
        return {
          type: 'simple_code',
          code: rawData.trim(),
          timestamp: new Date().toISOString()
        }
      }
      return null
    }
  }

  // QR kod tarama başarılı olduğunda
  const handleScanSuccess = useCallback((result: any) => {
    const parsedData = parseQRData(result.getText())
    
    if (parsedData) {
      setScanResult(parsedData)
      setError(null)
      
      // Taramayı durdur
      stopScanning()
      
      // Başarılı tarama callback'i
      onScanSuccess(parsedData)
    } else {
      setError('Geçersiz QR kod. Lütfen envanter QR kodunu tarayın.')
      onError?.('Geçersiz QR kod formatı')
    }
  }, [onScanSuccess, onError])

  // QR kod tarama hatası
  const handleScanError = (error: any) => {
    if (!(error instanceof NotFoundException)) {
      console.error('QR tarama hatası:', error)
      setError('QR kod taranırken hata oluştu')
      onError?.('Tarama hatası')
    }
  }

  // Kamera başlat
  const startScanning = useCallback(async () => {
    if (!videoRef.current) return

    try {
      setError(null)
      setScanResult(null)
      
      // Kamera cihazlarını al
      const devices = await getCameraDevices()
      if (devices.length === 0) {
        setError('Kamera cihazı bulunamadı')
        setHasCamera(false)
        return
      }
      
      // QR Scanner oluştur
      const codeReader = new BrowserMultiFormatReader()
      codeReaderRef.current = codeReader
      
      // Seçili kamera ile taramayı başlat
      const selectedDevice = devices[currentCameraIndex]
      await codeReader.decodeFromVideoDevice(
        selectedDevice?.deviceId,
        videoRef.current,
        handleScanSuccess
      )
      
      setIsScanning(true)
      
    } catch (error) {
      console.error('Kamera başlatma hatası:', error)
      setError('Kamera erişimi sağlanamadı. Lütfen kamera izinlerini kontrol edin.')
      setHasCamera(false)
      onError?.('Kamera erişim hatası')
    }
  }, [currentCameraIndex, getCameraDevices, handleScanSuccess, onError])

  // Taramayı durdur
  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
      codeReaderRef.current = null
    }
    setIsScanning(false)
  }, [])

  // Kamera değiştir
  const switchCamera = () => {
    if (cameraDevices.length > 1) {
      stopScanning()
      setCurrentCameraIndex((prev) => (prev + 1) % cameraDevices.length)
    }
  }

  // Modal açıldığında kamera cihazlarını al
  useEffect(() => {
    if (isOpen) {
      getCameraDevices()
    }
  }, [isOpen, getCameraDevices])

  // Kamera değiştiğinde yeniden başlat
  useEffect(() => {
    if (isOpen && hasCamera && !isScanning) {
      const timer = setTimeout(() => {
        startScanning()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentCameraIndex, isOpen, hasCamera, isScanning, startScanning])

  // Modal kapandığında taramayı durdur
  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      setScanResult(null)
      setError(null)
    }
  }, [isOpen, stopScanning])

  // Component unmount olduğunda temizlik
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Envanter QR Kod Tarayıcı
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Kamera Görüntüsü */}
          {hasCamera && (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Tarama Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-blue-500 w-48 h-48 rounded-lg animate-pulse">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kamera Yok */}
          {!hasCamera && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Kamera erişimi sağlanamadı</p>
              <CorporateButton onClick={() => window.location.reload()} variant="outline">
                Sayfayı Yenile
              </CorporateButton>
            </div>
          )}

          {/* Kontrol Butonları */}
          {hasCamera && (
            <div className="flex justify-center gap-2">
              {!isScanning ? (
                <CorporateButton onClick={startScanning} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Taramayı Başlat
                </CorporateButton>
              ) : (
                <>
                  <CorporateButton onClick={stopScanning} variant="danger" className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Durdur
                  </CorporateButton>
                  {cameraDevices.length > 1 && (
                    <CorporateButton onClick={switchCamera} variant="outline" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Kamera Değiştir
                    </CorporateButton>
                  )}
                </>
              )}
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <X className="w-4 h-4" />
                <span className="font-medium">Hata</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Başarılı Tarama Sonucu */}
          {scanResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-3">
                <Package className="w-4 h-4" />
                <span className="font-medium">QR Kod Başarıyla Tarandı</span>
              </div>
              <div className="space-y-6-group text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Kod:</span>
                  <span className="font-medium">{scanResult.code}</span>
                </div>
                {scanResult.name && (
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Ürün:</span>
                    <span className="font-medium">{scanResult.name}</span>
                  </div>
                )}
                {scanResult.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium">{scanResult.category}</span>
                  </div>
                )}
                {scanResult.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Lokasyon:</span>
                    <span className="font-medium">{scanResult.location}</span>
                  </div>
                )}
                {scanResult.quantity && (
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Miktar:</span>
                    <span className="font-medium">{scanResult.quantity} {scanResult.unit}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Tarih:</span>
                  <span className="font-medium">
                    {new Date(scanResult.timestamp).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Kullanım Talimatları */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            💡 <strong>Nasıl Kullanılır:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>QR kodu kamera görüş alanına getirin</li>
              <li>QR kod otomatik olarak taranacaktır</li>
              <li>Ürün bilgileri görüntülenecektir</li>
              <li>Birden fazla kamera varsa değiştirebilirsiniz</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryQRScanner