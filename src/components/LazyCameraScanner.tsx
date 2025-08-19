import React, { lazy, Suspense } from 'react'

// Lazy load the camera scanner component
const CameraScanner = lazy(() => import('./BarcodeScanner'))

interface LazyCameraScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
  className?: string
}

export const LazyCameraScanner: React.FC<LazyCameraScannerProps> = ({
  onScan,
  onError,
  className
}) => {
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Kamera yükleniyor...</span>
      </div>
    }>
      <CameraScanner onScan={onScan} onError={onError} />
    </Suspense>
  )
}

export default LazyCameraScanner
