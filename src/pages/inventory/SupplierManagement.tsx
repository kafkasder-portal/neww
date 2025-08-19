import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SupplierManagement from '@/components/inventory/SupplierManagement'

const SupplierManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tedarikçi Yönetimi</h1>
          <p className="text-muted-foreground">
            Tedarikçi bilgilerini yönetin ve takip edin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tedarikçi Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierManagement />
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierManagementPage