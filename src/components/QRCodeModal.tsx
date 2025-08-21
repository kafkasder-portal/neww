import React, { useEffect, useRef } from 'react'
import { X, Download, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import QRCode from 'qrcode'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  qrData: string
  title?: string
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrData,
  title = "QR Kod"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && qrData && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(err => {
        console.error('QR kod oluşturma hatası:', err)
      })
    }
  }, [isOpen, qrData])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `qr-code-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      alert('QR kod verisi panoya kopyalandı!')
    } catch (err) {
      console.error('Kopyalama hatası:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-sm max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <CorporateButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </CorporateButton>
          </div>
          
          <div className="text-center">
            {/* QR Kod Canvas */}
            <div className="bg-white p-4 rounded-lg mb-4 inline-block shadow-sm">
              <canvas 
                ref={canvasRef} 
                className="block" 
                style={{ width: '50px', height: '30px' }}
              />
            </div>
            
            {/* QR Kod Verisi */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-600 break-all font-mono">{qrData}</p>
            </div>
            
            {/* Eylem Butonları */}
            <div className="flex gap-2 mb-4">
              <CorporateButton
                variant="outline"
                onClick={handleCopy}
                className="flex-1 flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Kopyala
              </CorporateButton>
              <CorporateButton
                variant="outline"
                onClick={handleDownload}
                className="flex-1 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                İndir
              </CorporateButton>
            </div>
            
            <CorporateButton onClick={onClose} className="w-full">
              Kapat
            </CorporateButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal
