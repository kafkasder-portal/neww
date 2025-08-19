import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCode, BarChart3, Download, Print, Copy, Eye, Package } from 'lucide-react'
import { QRCodeGenerator } from './QRCodeGenerator'
import { InventoryQRScanner } from './InventoryQRScanner'
import { BarcodeScanner } from './BarcodeScanner'
import { InventoryItem } from '@/types/inventory'

interface InventoryCodeManagerProps {
  item?: InventoryItem
  onItemScanned?: (item: InventoryItem | null, code: string) => void
  onCodeGenerated?: (code: string, type: 'qr' | 'barcode') => void
  className?: string
}

interface ScannedCode {
  code: string
  type: 'qr' | 'barcode'
  timestamp: string
  item?: InventoryItem
}

export const InventoryCodeManager: React.FC<InventoryCodeManagerProps> = ({
  item,
  onItemScanned,
  onCodeGenerated,
  className = ''
}) => {
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [scannedCodes, setScannedCodes] = useState<ScannedCode[]>([])
  const [selectedCode, setSelectedCode] = useState<ScannedCode | null>(null)

  // QR kod tarama başarılı
  const handleQRScanSuccess = (scannedItem: InventoryItem | null, code: string) => {
    const newScannedCode: ScannedCode = {
      code,
      type: 'qr',
      timestamp: new Date().toISOString(),
      item: scannedItem || undefined
    }
    
    setScannedCodes(prev => [newScannedCode, ...prev.slice(0, 9)]) // Son 10 taramayı sakla
    setShowQRScanner(false)
    onItemScanned?.(scannedItem, code)
  }

  // Barkod tarama başarılı
  const handleBarcodeScanSuccess = (data: any) => {
    const newScannedCode: ScannedCode = {
      code: data.code,
      type: 'barcode',
      timestamp: new Date().toISOString()
    }
    
    setScannedCodes(prev => [newScannedCode, ...prev.slice(0, 9)])
    setShowBarcodeScanner(false)
    onItemScanned?.(null, data.code)
  }

  // QR kod oluşturma başarılı
  const handleQRGenerated = (code: string) => {
    onCodeGenerated?.(code, 'qr')
  }

  // Kod kopyala
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // Toast bildirimi eklenebilir
    } catch (error) {
      console.error('Kod kopyalanamadı:', error)
    }
  }

  // Kod detaylarını göster
  const showCodeDetails = (scannedCode: ScannedCode) => {
    setSelectedCode(scannedCode)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Ana Kontrol Paneli */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            QR Kod & Barkod Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* QR Kod Oluştur */}
            <Button
              onClick={() => setShowQRGenerator(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm">QR Kod Oluştur</span>
            </Button>

            {/* QR Kod Tara */}
            <Button
              onClick={() => setShowQRScanner(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm">QR Kod Tara</span>
            </Button>

            {/* Barkod Tara */}
            <Button
              onClick={() => setShowBarcodeScanner(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Barkod Tara</span>
            </Button>

            {/* Geçmiş */}
            <Button
              onClick={() => setSelectedCode(scannedCodes[0] || null)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
              disabled={scannedCodes.length === 0}
            >
              <Eye className="w-6 h-6" />
              <span className="text-sm">Tarama Geçmişi</span>
              {scannedCodes.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {scannedCodes.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mevcut Ürün Bilgisi */}
      {item && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seçili Ürün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Kod: {item.code}</p>
                <p className="text-sm text-gray-600">Kategori: {item.category}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQRGenerator(true)}
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Oluştur
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Son Taramalar */}
      {scannedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Son Taramalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scannedCodes.slice(0, 5).map((scannedCode, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {scannedCode.type === 'qr' ? (
                      <QrCode className="w-5 h-5 text-blue-600" />
                    ) : (
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium font-mono text-sm">
                        {scannedCode.code.length > 20 
                          ? `${scannedCode.code.substring(0, 20)}...` 
                          : scannedCode.code
                        }
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(scannedCode.timestamp).toLocaleString('tr-TR')}
                      </p>
                      {scannedCode.item && (
                        <p className="text-xs text-blue-600">
                          {scannedCode.item.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => showCodeDetails(scannedCode)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyCode(scannedCode.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kod Detayları Modal */}
      {selectedCode && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {selectedCode.type === 'qr' ? (
                  <QrCode className="w-5 h-5" />
                ) : (
                  <BarChart3 className="w-5 h-5" />
                )}
                Kod Detayları
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCode(null)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Kod:</label>
                <p className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
                  {selectedCode.code}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Tip:</label>
                <Badge variant={selectedCode.type === 'qr' ? 'default' : 'secondary'}>
                  {selectedCode.type === 'qr' ? 'QR Kod' : 'Barkod'}
                </Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Tarih:</label>
                <p className="text-sm">
                  {new Date(selectedCode.timestamp).toLocaleString('tr-TR')}
                </p>
              </div>
              
              {selectedCode.item && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ürün:</label>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-medium">{selectedCode.item.name}</p>
                    <p className="text-sm text-gray-600">Kod: {selectedCode.item.code}</p>
                    <p className="text-sm text-gray-600">Kategori: {selectedCode.item.category}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(selectedCode.code)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Kopyala
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Bileşenleri */}
      <QRCodeGenerator
        isOpen={showQRGenerator}
        onClose={() => setShowQRGenerator(false)}
        item={item}
        onGenerated={handleQRGenerated}
      />

      <InventoryQRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScanSuccess={handleBarcodeScanSuccess}
      />
    </div>
  )
}

export default InventoryCodeManager