import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InventoryItem } from '@/types/inventory'
import { BarChart3, Copy, Eye, Package, QrCode } from 'lucide-react'
import React, { useState } from 'react'
import { BarcodeScanner } from './BarcodeScanner'
import { InventoryQRScanner } from './InventoryQRScanner'
import { QRCodeGenerator } from './QRCodeGenerator'

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
      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            QR Kod & Barkod Yönetimi
          </CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* QR Kod Oluştur */}
            <CorporateButton
              onClick={() => setShowQRGenerator(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="neutral"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm">QR Kod Oluştur</span>
            </CorporateButton>

            {/* QR Kod Tara */}
            <CorporateButton
              onClick={() => setShowQRScanner(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="neutral"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm">QR Kod Tara</span>
            </CorporateButton>

            {/* Barkod Tara */}
            <CorporateButton
              onClick={() => setShowBarcodeScanner(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="neutral"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Barkod Tara</span>
            </CorporateButton>

            {/* Geçmiş */}
            <CorporateButton
              onClick={() => setSelectedCode(scannedCodes[0] || null)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="neutral"
              disabled={scannedCodes.length === 0}
            >
              <Eye className="w-6 h-6" />
              <span className="text-sm">Tarama Geçmişi</span>
              {scannedCodes.length > 0 && (
                <CorporateBadge variant="neutral" className="text-xs">
                  {scannedCodes.length}
                </CorporateBadge>
              )}
            </CorporateButton>
          </div>
        </CorporateCardContent>
      </CorporateCard>

      {/* Mevcut Ürün Bilgisi */}
      {item && (
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="text-lg">Seçili Ürün</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Kod: {item.code}</p>
                <p className="text-sm text-gray-600">Kategori: {item.category}</p>
              </div>
              <div className="flex gap-2">
                <CorporateButton
                  size="sm"
                  variant="neutral"
                  onClick={() => setShowQRGenerator(true)}
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Oluştur
                </CorporateButton>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>
      )}

      {/* Son Taramalar */}
      {scannedCodes.length > 0 && (
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="text-lg">Son Taramalar</CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-3">
              {scannedCodes.slice(0, 5).map((scannedCode, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 corporate-table-header rounded-lg"
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
                    <CorporateButton
                      size="sm"
                      variant="ghost"
                      onClick={() => showCodeDetails(scannedCode)}
                    >
                      <Eye className="w-4 h-4" />
                    </CorporateButton>
                    <CorporateButton
                      size="sm"
                      variant="ghost"
                      onClick={() => copyCode(scannedCode.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </CorporateButton>
                  </div>
                </div>
              ))}
            </div>
          </CorporateCardContent>
        </CorporateCard>
      )}

      {/* Kod Detayları Modal */}
      {selectedCode && (
        <CorporateCard className="border-2 border-blue-200">
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {selectedCode.type === 'qr' ? (
                  <QrCode className="w-5 h-5" />
                ) : (
                  <BarChart3 className="w-5 h-5" />
                )}
                Kod Detayları
              </span>
              <CorporateButton
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCode(null)}
              >
                ×
              </CorporateButton>
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Kod:</label>
                <p className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
                  {selectedCode.code}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Tip:</label>
                <CorporateBadge variant={selectedCode.type === 'qr' ? 'default' : 'secondary'}>
                  {selectedCode.type === 'qr' ? 'QR Kod' : 'Barkod'}
                </CorporateBadge>
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
                <CorporateButton
                  size="sm"
                  variant="neutral"
                  onClick={() => copyCode(selectedCode.code)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Kopyala
                </CorporateButton>
              </div>
            </div>
          </CorporateCardContent>
        </CorporateCard>
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