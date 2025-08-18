import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { FileText, Plus, Edit, Trash2, Search, Settings, Layout, List } from 'lucide-react'

export default function FormDefinitions() {
  const [searchTerm, setSearchTerm] = useState('')

  const forms = [
    {
      id: 1,
      name: 'Başvuru Formu',
      description: 'Yeni öğrenci başvuru formu',
      fieldCount: 25,
      status: 'Aktif',
      version: '2.1',
      lastUpdate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Değerlendirme Formu',
      description: 'Öğrenci performans değerlendirme formu',
      fieldCount: 18,
      status: 'Aktif',
      version: '1.5',
      lastUpdate: '2024-01-08'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Form Tanımları</h1>
        </div>
        <p className="text-white/90">Başvuru ve değerlendirme formlarının tasarımı</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Form</p>
              <p className="text-2xl font-bold">{forms.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Form</p>
              <p className="text-2xl font-bold text-green-600">{forms.filter(f => f.status === 'Aktif').length}</p>
            </div>
            <Settings className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Alan</p>
              <p className="text-2xl font-bold text-purple-600">{forms.reduce((sum, f) => sum + f.fieldCount, 0)}</p>
            </div>
            <Layout className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Son Güncelleme</p>
              <p className="text-sm font-bold text-orange-600">Bu hafta</p>
            </div>
            <List className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Form ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-80" />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Form
          </Button>
        </div>

        <div className="space-y-4">
          {forms.map((form) => (
            <div key={form.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{form.name}</h3>
                  <p className="text-sm text-muted-foreground">{form.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>{form.fieldCount} alan</span>
                    <span>v{form.version}</span>
                    <span className="text-muted-foreground">{new Date(form.lastUpdate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
