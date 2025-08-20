import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StockAlertNotifications from '@/components/inventory/StockAlertNotifications'

const StockAlerts: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Uyarıları</h1>
          <p className="text-muted-foreground">
            Stok seviyelerini izleyin ve uyarıları yönetin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canlı Stok Uyarıları</CardTitle>
        </CardHeader>
        <CardContent>
          <StockAlertNotifications />
        </CardContent>
      </Card>
    </div>
  )
}

export default StockAlerts