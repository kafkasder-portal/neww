import React, { lazy, Suspense } from 'react'
import Loading from './Loading'

const QRScannerModalLazy = lazy(() => import('./QRScannerModal').then(m => ({ default: m.QRScannerModal })))

class QRModalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: any) { console.error('QRScannerModal load error:', err) }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-sm text-red-600">QR tarayıcı yüklenemedi.</div>
    }
    return this.props.children
  }
}

const LazyQRScannerModal = (props: any) => (
  <QRModalErrorBoundary>
    <Suspense fallback={<Loading />}> <QRScannerModalLazy {...props} /> </Suspense>
  </QRModalErrorBoundary>
)

export default LazyQRScannerModal
