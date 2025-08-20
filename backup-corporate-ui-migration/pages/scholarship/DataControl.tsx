import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Database, Search, RefreshCw, AlertTriangle, CheckCircle, X, FileText, Users } from 'lucide-react'

export default function DataControl() {
  const [searchTerm, setSearchTerm] = useState('')

  const dataIssues = [
    { id: 1, type: 'Eksik Bilgi', description: 'Öğrenci fotoğrafı eksik', student: 'Mehmet Demir', severity: 'Orta', status: 'Beklemede' },
    { id: 2, type: 'Çakışma', description: 'Aynı TC kimlik numarası', student: 'Ali Özkan', severity: 'Yüksek', status: 'İnceleniyor' },
    { id: 3, type: 'Güncel Değil', description: 'İletişim bilgileri eski', student: 'Ayşe Yılmaz', severity: 'Düşük', status: 'Çözüldü' }
  ]

  const stats = {
    totalRecords: 285,
    validRecords: 268,
    issuesFound: dataIssues.length,
    resolved: dataIssues.filter(i => i.status === 'Çözüldü').length
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Database className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Veri Kontrolü</h1>
        </div>
        <p className="text-white/90">Öğrenci verilerinin doğrulama ve temizleme işlemleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Kayıt</p>
              <p className="text-2xl font-bold">{stats.totalRecords}</p>
            </div>
            <Users className="h-8 w-8 text-semantic-info" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Geçerli Kayıt</p>
              <p className="text-2xl font-bold text-semantic-success">{stats.validRecords}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-semantic-success" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sorun Bulunan</p>
              <p className="text-2xl font-bold text-semantic-danger">{stats.issuesFound}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-semantic-danger" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Çözülen</p>
              <p className="text-2xl font-bold text-brand-secondary">{stats.resolved}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-brand-secondary" />
          </div>
        </CorporateCard>
      </div>

      <CorporateCard className="p-6">
        <div className="flex justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Veri sorunu ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-80" />
          </div>
          <div className="flex gap-2">
            <CorporateButton variant="neutral" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Veri Kontrolü Çalıştır
            </CorporateButton>
            <CorporateButton className="gap-2">
              <FileText className="h-4 w-4" />
              Rapor Oluştur
            </CorporateButton>
          </div>
        </div>

        <div className="space-y-4">
          {dataIssues.map((issue) => (
            <div key={issue.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      issue.severity === 'Yüksek' ? 'bg-semantic-danger/10 text-semantic-danger' :
                      issue.severity === 'Orta' ? 'bg-semantic-warning/10 text-semantic-warning' :
                      'bg-semantic-success/10 text-semantic-success'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="font-medium">{issue.type}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      issue.status === 'Çözüldü' ? 'bg-semantic-success/10 text-semantic-success' :
                      issue.status === 'İnceleniyor' ? 'bg-semantic-warning/10 text-semantic-warning' :
                      'bg-muted/50 text-muted-foreground'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="font-medium">{issue.description}</h4>
                  <p className="text-sm text-muted-foreground">Öğrenci: {issue.student}</p>
                </div>
                <div className="flex gap-2">
                  <CorporateButton size="sm" variant="neutral">
                    <CheckCircle className="h-4 w-4" />
                  </CorporateButton>
                  <CorporateButton size="sm" variant="danger">
                    <X className="h-4 w-4" />
                  </CorporateButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CorporateCard>
    </div>
  )
}
