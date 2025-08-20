import React from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'

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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 break-all">{qrData}</p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Kapat
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal
