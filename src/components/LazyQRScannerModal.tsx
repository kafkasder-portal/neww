import React, { lazy, Suspense } from 'react'

// Lazy load the QR scanner modal component
const QRScannerModal = lazy(() => import('./QRCodeGenerator'))

interface LazyQRScannerModalProps {
    isOpen: boolean
    onClose: () => void
    onScan: (data: string) => void
    title?: string
}

export const LazyQRScannerModal: React.FC<LazyQRScannerModalProps> = ({
    isOpen,
    onClose,
    onScan,
    title = "QR Kod Tarayıcı"
}) => {
    if (!isOpen) return null

    return (
        <Suspense fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-center">QR Tarayıcı yükleniyor...</p>
                </div>
            </div>
        }>
            <QRScannerModal
                isOpen={isOpen}
                onClose={onClose}
                onScan={onScan}
                title={title}
            />
        </Suspense>
    )
}

export default LazyQRScannerModal
