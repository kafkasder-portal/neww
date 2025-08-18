import { useState, useEffect, useCallback } from 'react'
import { Modal } from './Modal'
import { generateQRCode, generatePrintableQR } from '../utils/qrCodeUtils'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  bank: {
    bankNumber: string
    id: string
    assignedTo: string
    location: string
    qrCode?: string
  }
}

export const QRCodeModal = ({ isOpen, onClose, bank }: QRCodeModalProps) => {
  const { bankNumber, id: bankId, assignedTo, location, qrCode } = bank || {}
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // QR kod oluştur
  const generateQR = useCallback(async () => {
    if (!bankNumber || !bankId) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Eğer QR kod zaten varsa onu kullan, yoksa yeni oluştur
      if (qrCode) {
        setQrCodeDataURL(qrCode)
      } else {
        const newQrCode = generateQRCode({
          bankNumber,
          assignedTo: assignedTo || '',
          location: location || '',
          contactPerson: '',
          contactPhone: ''
        })
        setQrCodeDataURL(newQrCode)
      }
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error)
      setError('QR kod oluşturulamadı')
    } finally {
      setLoading(false)
    }
  }, [bankNumber, bankId, qrCode, assignedTo, location])

  // QR kodu indir
  const downloadQRCode = () => {
    if (!qrCodeDataURL) return
    
    const link = document.createElement('a')
    link.download = `${bankNumber}-qr-kod.png`
    link.href = qrCodeDataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // QR kodu yazdır
  const printQRCode = () => {
    if (!qrCodeDataURL) return
    
    const printHTML = generatePrintableQR(qrCodeDataURL, bankNumber)
    const printWindow = window.open('', '_blank')
    
    if (printWindow) {
      printWindow.document.write(printHTML)
      printWindow.document.close()
      
      // Yazdırma dialogunu aç
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
      // Data URL'yi blob'a çevir
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      
      // Panoya kopyala
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
    const qrData = JSON.stringify({
      type: 'piggy_bank',
      bankNumber,
      bankId,
      timestamp: new Date().toISOString()
    })
    
    navigator.clipboard.writeText(qrData).then(() => {
      alert('QR kod verisi panoya kopyalandı!')
    }).catch(() => {
      alert('QR kod verisi panoya kopyalanamadı')
    })
  }

  // Modal açıldığında QR kod oluştur
  useEffect(() => {
    if (isOpen && bankNumber && bankId) {
      generateQR()
    }
  }, [isOpen, bankNumber, bankId, generateQR])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`QR Kod - ${bankNumber}`} size="medium">
      <div className="space-y-6">
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
              <span className="text-gray-600">Lokasyon:</span>
              <span className="ml-2 font-medium">{location}</span>
            </div>
          </div>
        </div>

        {/* QR Kod Alanı */}
        <div className="text-center">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">QR kod oluşturuluyor...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={generateQR}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          )}
          
          {qrCodeDataURL && !loading && !error && (
            <div className="space-y-4">
              {/* QR Kod Görüntüsü */}
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 p-4 rounded-lg bg-white">
                  <img
                    src={qrCodeDataURL}
                    alt={`QR Kod - ${bankNumber}`}
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>
              
              {/* QR Kod Bilgisi */}
              <div className="text-sm text-gray-600">
                <p>Bu QR kodu tarayarak kumbara bilgilerine ulaşabilirsiniz.</p>
                <p className="mt-1">Kumbara ID: <span className="font-mono">{bankId}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Aksiyon Butonları */}
        {qrCodeDataURL && !loading && !error && (
          <div className="space-y-3">
            {/* Ana Butonlar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadQRCode}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                İndir
              </button>
              <button
                onClick={printQRCode}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                Yazdır
              </button>
            </div>
            
            {/* Ek Butonlar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyQRToClipboard}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2 text-sm"
              >
                <span>📋</span>
                Resmi Kopyala
              </button>
              <button
                onClick={copyQRDataToClipboard}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center justify-center gap-2 text-sm"
              >
                <span>📄</span>
                Veriyi Kopyala
              </button>
            </div>
          </div>
        )}

        {/* Kullanım Bilgisi */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          💡 <strong>Kullanım:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li><strong>İndir:</strong> QR kodu PNG dosyası olarak kaydedin</li>
            <li><strong>Yazdır:</strong> QR kodu etiket olarak yazdırın</li>
            <li><strong>Resmi Kopyala:</strong> QR kod görüntüsünü panoya kopyalayın</li>
            <li><strong>Veriyi Kopyala:</strong> QR kod içeriğini metin olarak kopyalayın</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}