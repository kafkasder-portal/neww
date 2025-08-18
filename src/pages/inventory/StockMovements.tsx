import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StockMovements from '@/components/inventory/StockMovements'

const StockMovementsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Hareketleri</h1>
          <p className="text-muted-foreground">
            Giriş ve çıkış hareketlerini takip edin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stok Hareket Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <StockMovements />
        </CardContent>
      </Card>
    </div>
  )
}

export default StockMovementsPage