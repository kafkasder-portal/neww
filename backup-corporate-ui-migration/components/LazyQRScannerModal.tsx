import React, { lazy, Suspense } from 'react'

// Lazy load the QR scanner modal component
const QRScannerModal = lazy(() => import('./inventory/InventoryQRScanner'))

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

    const handleScanSuccess = (data: any) => {
        // Extract the code from the scanned data and pass it to onScan
        const code = typeof data === 'string' ? data : data.code || JSON.stringify(data)
        onScan(code)
    }

    return (
        <Suspense fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="corporate-card">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-center">QR Tarayıcı yükleniyor...</p>
                </div>
            </div>
        }>
            <QRScannerModal
                isOpen={isOpen}
                onClose={onClose}
                onScanSuccess={handleScanSuccess}
            />
        </Suspense>
    )
}

export default LazyQRScannerModal
