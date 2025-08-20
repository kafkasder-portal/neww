import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { CorporateCard, CorporateButton } from '@/components/ui/corporate/CorporateComponents'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <CorporateCard className="max-w-md w-full p-8 text-center space-y-6">
        <div className="space-y-6-group">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <CorporateButton variant="primary" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfa
            </CorporateButton>
          </Link>
          
          <CorporateButton 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </CorporateButton>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Sorun devam ederse lütfen sistem yöneticisi ile iletişime geçin.</p>
        </div>
      </CorporateCard>
    </div>
  )
}