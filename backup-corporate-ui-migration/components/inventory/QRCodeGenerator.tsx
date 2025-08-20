import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Download, Package, Printer, QrCode } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface InventoryItem {
  id: string
  name: string
  code: string
  category: string
  location: string
  quantity: number
  unit: string
  supplier?: string
  expiryDate?: string
}

interface QRCodeGeneratorProps {
  item?: InventoryItem
  onGenerate?: (qrData: string) => void
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ item, onGenerate }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [customData, setCustomData] = useState({
    itemCode: item?.code || '',
    itemName: item?.name || '',
    location: item?.location || '',
    category: item?.category || ''
  })

  // QR kod verisi oluştur
  const generateQRData = (data: typeof customData | InventoryItem) => {
    const qrData = {
      type: 'inventory_item',
      timestamp: new Date().toISOString(),
      ...(item ? {
        id: item.id,
        name: item.name,
        code: item.code,
        category: item.category,
        location: item.location,
        quantity: item.quantity,
        unit: item.unit,
        supplier: item.supplier,
        expiryDate: item.expiryDate
      } : {
        code: data.itemCode,
        name: data.itemName,
        location: data.location,
        category: data.category
      })
    }
    return JSON.stringify(qrData)
  }

  // QR kod oluştur
  const generateQRCode = async (data?: typeof customData) => {
    setIsGenerating(true)
    try {
      const QRCode = (await import('qrcode')).default
      const qrData = generateQRData(data || customData)
      const dataURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: 'COLORS.neutral[900]',
          light: 'COLORS.neutral[50]'
        }
      })
      setQrCodeDataURL(dataURL)
      onGenerate?.(qrData)
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Sayfa yüklendiğinde QR kod oluştur (eğer item varsa)
  useEffect(() => {
    if (item) {
      generateQRCode()
    }
  }, [item])

  // QR kodu indir
  const downloadQRCode = () => {
    if (!qrCodeDataURL) return

    const link = document.createElement('a')
    link.download = `${item?.code || customData.itemCode}-qr-kod.png`
    link.href = qrCodeDataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // QR kodu yazdır
  const printQRCode = () => {
    if (!qrCodeDataURL) return

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Envanter QR Kod - ${item?.code || customData.itemCode}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .qr-container {
            border: 2px solid #000;
            padding: 20px;
            margin: 20px auto;
            width: 300px;
          }
          .qr-code {
            margin: 10px 0;
          }
          .item-info {
            font-size: 14px;
            margin: 10px 0;
          }
          .item-code {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h2>Envanter QR Kod</h2>
          <div class="item-code">${item?.code || customData.itemCode}</div>
          <div class="item-info">${item?.name || customData.itemName}</div>
          <div class="item-info">Kategori: ${item?.category || customData.category}</div>
          <div class="item-info">Lokasyon: ${item?.location || customData.location}</div>
          <div class="qr-code">
            <img src="${qrCodeDataURL}" alt="QR Kod" />
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 10px;">
            Bu QR kodu tarayarak ürün bilgilerine ulaşabilirsiniz.
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printHTML)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
    }
  }

  // QR kodu panoya kopyala
  const copyQRToClipboard = async () => {
    if (!qrCodeDataURL) return

    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('QR kod panoya kopyalandı!')
    } catch (error) {
      console.error('Panoya kopyalama hatası:', error)
      alert('QR kod panoya kopyalanamadı')
    }
  }

  // QR kod verisini panoya kopyala
  const copyQRDataToClipboard = () => {
    const qrData = generateQRData(item || customData)
    navigator.clipboard.writeText(qrData).then(() => {
      alert('QR kod verisi panoya kopyalandı!')
    }).catch(() => {
      alert('QR kod verisi panoya kopyalanamadı')
    })
  }

  return (
    <CorporateCard className="w-full max-w-md">
      <CorporateCardHeader>
        <CorporateCardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Kod Oluşturucu
        </CorporateCardTitle>
      </CorporateCardHeader>
      <CorporateCardContent className="space-y-4">
        {/* Manuel Veri Girişi (item yoksa) */}
        {!item && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="itemCode">Ürün Kodu</Label>
              <Input
                id="itemCode"
                value={customData.itemCode}
                onChange={(e) => setCustomData(prev => ({ ...prev, itemCode: e.target.value }))}
                placeholder="Ürün kodunu girin"
              />
            </div>
            <div>
              <Label htmlFor="itemName">Ürün Adı</Label>
              <Input
                id="itemName"
                value={customData.itemName}
                onChange={(e) => setCustomData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="Ürün adını girin"
              />
            </div>
            <div>
              <Label htmlFor="location">Lokasyon</Label>
              <Input
                id="location"
                value={customData.location}
                onChange={(e) => setCustomData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Lokasyonu girin"
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={customData.category}
                onChange={(e) => setCustomData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Kategoriyi girin"
              />
            </div>
            <CorporateButton
              onClick={() => generateQRCode()}
              disabled={isGenerating || !customData.itemCode}
              className="w-full"
            >
              {isGenerating ? 'Oluşturuluyor...' : 'QR Kod Oluştur'}
            </CorporateButton>
          </div>
        )}

        {/* Ürün Bilgileri (item varsa) */}
        {item && (
          <div className="corporate-table-header p-3 rounded-lg corporate-form-group">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Kod: {item.code}</div>
              <div>Kategori: {item.category}</div>
              <div>Lokasyon: {item.location}</div>
              <div>Miktar: {item.quantity} {item.unit}</div>
            </div>
          </div>
        )}

        {/* QR Kod Görüntüsü */}
        {qrCodeDataURL && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border inline-block">
              <img
                src={qrCodeDataURL}
                alt="QR Kod"
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* Aksiyon Butonları */}
            <div className="grid grid-cols-2 gap-2">
              <CorporateButton
                onClick={downloadQRCode}
                variant="neutral"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                İndir
              </CorporateButton>
              <CorporateButton
                onClick={printQRCode}
                variant="neutral"
                size="sm"
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Yazdır
              </CorporateButton>
              <CorporateButton
                onClick={copyQRToClipboard}
                variant="neutral"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Resmi Kopyala
              </CorporateButton>
              <CorporateButton
                onClick={copyQRDataToClipboard}
                variant="neutral"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Veriyi Kopyala
              </CorporateButton>
            </div>
          </div>
        )}

        {/* Kullanım Bilgisi */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          💡 <strong>Kullanım:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>QR kod ürün bilgilerini içerir</li>
            <li>Mobil cihazlarla taranabilir</li>
            <li>Stok takibi için kullanılabilir</li>
            <li>Etiket olarak yazdırılabilir</li>
          </ul>
        </div>
      </CorporateCardContent>
    </CorporateCard>
  )
}

export default QRCodeGenerator