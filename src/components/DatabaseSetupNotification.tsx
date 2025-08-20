import React, { useState } from 'react'
import { CorporateButton, Card, CardContent, CardDescription, CardHeader, CardTitle, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { AlertTriangle, Database, Settings, ExternalLink } from 'lucide-react'

interface DatabaseSetupNotificationProps {
  onEnableMockData?: () => void
  onDismiss?: () => void
}

export const DatabaseSetupNotification: React.FC<DatabaseSetupNotificationProps> = ({
  onEnableMockData,
  onDismiss
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const enableMockData = () => {
    localStorage.setItem('use_mock_data', 'true')
    if (onEnableMockData) {
      onEnableMockData()
    }
  }

  const dismissNotification = () => {
    localStorage.setItem('db_setup_dismissed', 'true')
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <CorporateCard className="mb-6 border-orange-200 bg-orange-50">
      <CorporateCardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <CorporateCardTitle className="text-lg text-orange-800">
              Veritabanı Kurulumu Gerekli
            </CorporateCardTitle>
            <CardDescription className="text-orange-700 mt-1">
              Bazı özellikler için Supabase veritabanı tablolarının oluşturulması gerekiyor.
            </CardDescription>
          </div>
        </div>
      </CorporateCardHeader>
      
      <CorporateCardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <CorporateButton 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isExpanded ? 'Gizle' : 'Kurulum Detayları'}
            </CorporateButton>
            
            <CorporateButton 
              variant="outline" 
              size="sm"
              onClick={enableMockData}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Demo Verilerini Etkinleştir
            </CorporateButton>
            
            <CorporateButton 
              variant="ghost" 
              size="sm"
              onClick={dismissNotification}
              className="text-gray-600 hover:bg-gray-100"
            >
              Bu mesajı gizle
            </CorporateButton>
          </div>

          {isExpanded && (
            <Alert className="bg-white border-orange-200">
              <Database className="h-4 w-4" />
              <AlertTitle>Gerekli Veritabanı Tabloları</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-6-group text-sm">
                  <p>Aşağıdaki tablolar Supabase veritabanınızda oluşturulmalıdır:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><code className="px-1 py-0.5 bg-gray-100 rounded">chart_of_accounts</code> - Mali hesap planı</li>
                    <li><code className="px-1 py-0.5 bg-gray-100 rounded">donors</code> - Bağışçı bilgileri</li>
                    <li><code className="px-1 py-0.5 bg-gray-100 rounded">donor_tasks</code> - Bağışçı görevleri</li>
                    <li><code className="px-1 py-0.5 bg-gray-100 rounded">budgets</code> - Bütçe kayıtları</li>
                    <li><code className="px-1 py-0.5 bg-gray-100 rounded">grants</code> - Hibe kayıtları</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="font-medium text-blue-800">📋 Hızlı Çözüm:</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Sistemi hemen test etmek için "Demo Verilerini Etkinleştir" butonuna tıklayın. 
                      Bu seçenek gerçek veritabanı bağlantısı olmadan demo verilerle çalışmanıza olanak sağlar.
                    </p>
                  </div>
                  <div className="mt-3">
                    <a 
                      href="https://supabase.com/docs/guides/getting-started" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Supabase Kurulum Kılavuzu
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CorporateCardContent>
    </CorporateCard>
  )
}

export default DatabaseSetupNotification
