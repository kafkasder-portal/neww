import React, { lazy, Suspense } from 'react'
import Loading from './Loading'

// Heavy dependencies (zxing, tesseract) are inside CameraScanner; this defers their cost.
const CameraScanner = lazy(() => import('./CameraScanner'))

class CameraErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: any) { console.error('CameraScanner load error:', err) }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-sm text-red-600">Kamera modülü yüklenemedi.</div>
    }
    return this.props.children
  }
}

const LazyCameraScanner = (props: any) => (
  <CameraErrorBoundary>
    <Suspense fallback={<Loading />}> <CameraScanner {...props} /> </Suspense>
  </CameraErrorBoundary>
)

export default LazyCameraScanner
