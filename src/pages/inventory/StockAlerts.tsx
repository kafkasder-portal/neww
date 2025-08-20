import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import StockAlertNotifications from '@/components/inventory/StockAlertNotifications'

const StockAlerts: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-card rounded-lg border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Uyarıları</h1>
          <p className="text-muted-foreground">
            Stok seviyelerini izleyin ve uyarıları yönetin
          </p>
        </div>
      </div>

      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle>Canlı Stok Uyarıları</CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <StockAlertNotifications />
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}

export default StockAlerts