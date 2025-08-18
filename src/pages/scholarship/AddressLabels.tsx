import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Package, Download, Search, Printer, MapPin, Mail, FileText } from 'lucide-react'

export default function AddressLabels() {
  const [searchTerm, setSearchTerm] = useState('')

  const labelTemplates = [
    { id: 1, name: 'Standart Etiket', size: '70x36mm', count: 24, type: 'Adres' },
    { id: 2, name: 'Büyük Etiket', size: '99x67mm', count: 8, type: 'Kargo' },
    { id: 3, name: 'Küçük Etiket', size: '38x21mm', count: 65, type: 'Kimlik' }
  ]

  const recipients = [
    { id: 1, name: 'Ayşe Yılmaz', address: 'Merkez Mah. Atatürk Cad. No:15 Ankara', selected: false },
    { id: 2, name: 'Mehmet Demir', address: 'Yenişehir Mah. İnönü Sok. No:8 İstanbul', selected: false },
    { id: 3, name: 'Fatma Kaya', address: 'Bahçelievler Mah. Gül Sk. No:22 İzmir', selected: false }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Package className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Adres Etiket Baskı</h1>
        </div>
        <p className="text-white/90">Posta gönderimler için adres etiketleri hazırlama</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Etiket Şablonu</p>
              <p className="text-2xl font-bold">{labelTemplates.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alıcı Sayısı</p>
              <p className="text-2xl font-bold text-green-600">{recipients.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Seçilen</p>
              <p className="text-2xl font-bold text-purple-600">{recipients.filter(r => r.selected).length}</p>
            </div>
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yazdırılacak</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <Printer className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Etiket Şablonları</h2>
          <div className="space-y-3">
            {labelTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.size} - {template.count} etiket</p>
                  </div>
                  <Button size="sm" variant="outline">Seç</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Alıcı Listesi</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                İçe Aktar
              </Button>
              <Button size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Yazdır
              </Button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Alıcı ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>

          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="border rounded p-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium">{recipient.name}</h4>
                    <p className="text-sm text-muted-foreground">{recipient.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
