import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import SupplierManagement from '@/components/inventory/SupplierManagement'

const SupplierManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-card rounded-lg border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tedarikçi Yönetimi</h1>
          <p className="text-muted-foreground">
            Tedarikçi bilgilerini yönetin ve takip edin
          </p>
        </div>
      </div>

      <CorporateCard>
        <CorporateCardHeader>
          <CorporateCardTitle>Tedarikçi Listesi</CorporateCardTitle>
        </CorporateCardHeader>
        <CorporateCardContent>
          <SupplierManagement />
        </CorporateCardContent>
      </CorporateCard>
    </div>
  )
}

export default SupplierManagementPage