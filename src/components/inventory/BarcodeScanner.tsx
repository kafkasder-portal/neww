import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CorporateButton } from '@/components/ui/corporate/CorporateComponents'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Scan, X, Package, Keyboard, BarChart3 } from 'lucide-react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'

interface BarcodeData {
  code: string
  format: string
  timestamp: string
  isManual?: boolean
}

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (data: BarcodeData) => void
  onError?: (error: string) => void
  allowManualEntry?: boolean
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onError,
  allowManualEntry = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<BarcodeData | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0)
  const [manualCode, setManualCode] = useState('')
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera')

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

  // Barkod formatını belirle
  const getBarcodeFormat = (result: any): string => {
    const format = result.getBarcodeFormat()
    if (format) {
      return format.toString()
    }
    return 'UNKNOWN'
  }

  // Barkod tarama başarılı olduğunda
  const handleScanSuccess = useCallback((result: any) => {
    const code = result.getText()
    const format = getBarcodeFormat(result)
    
    if (code && code.trim().length > 0) {
      const barcodeData: BarcodeData = {
        code: code.trim(),
        format,
        timestamp: new Date().toISOString(),
        isManual: false
      }
      
      setScanResult(barcodeData)
      setError(null)
      
      // Taramayı durdur
      stopScanning()
      
      // Başarılı tarama callback'i
      onScanSuccess(barcodeData)
    } else {
      setError('Geçersiz barkod. Lütfen tekrar deneyin.')
      onError?.('Geçersiz barkod')
    }
  }, [onScanSuccess, onError])

  // Barkod tarama hatası
  const handleScanError = (error: any) => {
    if (!(error instanceof NotFoundException)) {
      console.error('Barkod tarama hatası:', error)
      setError('Barkod taranırken hata oluştu')
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
      
      // Barcode Scanner oluştur
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

  // Manuel kod girişi
  const handleManualSubmit = () => {
    if (manualCode.trim().length > 0) {
      const barcodeData: BarcodeData = {
        code: manualCode.trim(),
        format: 'MANUAL',
        timestamp: new Date().toISOString(),
        isManual: true
      }
      
      setScanResult(barcodeData)
      setError(null)
      onScanSuccess(barcodeData)
      setManualCode('')
    }
  }

  // Modal açıldığında kamera cihazlarını al
  useEffect(() => {
    if (isOpen) {
      getCameraDevices()
      setScanMode('camera')
    }
  }, [isOpen, getCameraDevices])

  // Kamera değiştiğinde yeniden başlat
  useEffect(() => {
    if (isOpen && hasCamera && scanMode === 'camera' && !isScanning) {
      const timer = setTimeout(() => {
        startScanning()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentCameraIndex, isOpen, hasCamera, scanMode, isScanning, startScanning])

  // Modal kapandığında taramayı durdur
  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      setScanResult(null)
      setError(null)
      setManualCode('')
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
            <BarChart3 className="w-5 h-5" />
            Barkod Tarayıcı
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Tarama Modu Seçimi */}
          {allowManualEntry && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => {
                  setScanMode('camera')
                  setError(null)
                  setScanResult(null)
                }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  scanMode === 'camera'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-4 h-4 inline mr-1" />
                Kamera
              </button>
              <button
                onClick={() => {
                  setScanMode('manual')
                  stopScanning()
                  setError(null)
                  setScanResult(null)
                }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  scanMode === 'manual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Keyboard className="w-4 h-4 inline mr-1" />
                Manuel
              </button>
            </div>
          )}

          {/* Kamera Modu */}
          {scanMode === 'camera' && (
            <>
              {/* Kamera Görüntüsü */}
              {hasCamera && (
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
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
                      <div className="border-2 border-red-500 w-64 h-16 rounded animate-pulse">
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
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
                      <Scan className="w-4 h-4" />
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
            </>
          )}

          {/* Manuel Giriş Modu */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <Keyboard className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">Barkod numarasını manuel olarak girin</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="manualCode">Barkod Numarası</Label>
                  <Input
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Barkod numarasını girin"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualSubmit()
                      }
                    }}
                  />
                </div>
                <CorporateButton 
                  onClick={handleManualSubmit} 
                  disabled={!manualCode.trim()}
                  className="w-full"
                >
                  Barkodu Onayla
                </CorporateButton>
              </div>
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
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">
                  {scanResult.isManual ? 'Manuel Giriş Başarılı' : 'Barkod Başarıyla Tarandı'}
                </span>
              </div>
              <div className="space-y-6-group text-sm">
                <div>
                  <span className="text-gray-600">Barkod:</span>
                  <span className="ml-2 font-mono font-medium">{scanResult.code}</span>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 font-medium">{scanResult.format}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tarih:</span>
                  <span className="ml-2 font-medium">
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
              <li>Barkodu kamera görüş alanına getirin</li>
              <li>Barkod otomatik olarak taranacaktır</li>
              <li>Manuel giriş için klavye modunu kullanın</li>
              <li>Birden fazla kamera varsa değiştirebilirsiniz</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BarcodeScanner