import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Download,
  Upload,
  Calendar,
  MapPin,
  Phone,
  User
} from 'lucide-react'

export default function OrphanForm() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedForm, setSelectedForm] = useState<any>(null)

  const orphanForms = [
    {
      id: 1,
      studentName: 'Ayşe Yılmaz',
      studentId: 'YTM001',
      age: 12,
      grade: '6. Sınıf',
      school: 'Atatürk Ortaokulu',
      guardianName: 'Fatma Yılmaz (Teyze)',
      guardianPhone: '0532 123 45 67',
      address: 'Merkez Mah. Atatürk Cad. No:15 Ankara',
      orphanType: 'Baba Vefat',
      orphanDate: '2020-03-15',
      formStatus: 'Tamamlandı',
      lastUpdate: '2024-01-10',
      documents: ['Nüfus Kayıt Örneği', 'Vefat Belgesi', 'Okul Belgesi'],
      monthlyIncome: 2500,
      siblings: 2,
      hasPhoto: true
    },
    {
      id: 2,
      studentName: 'Mehmet Demir',
      studentId: 'YTM002',
      age: 15,
      grade: '9. Sınıf',
      school: 'Cumhuriyet Lisesi',
      guardianName: 'Ahmet Demir (Amca)',
      guardianPhone: '0543 987 65 43',
      address: 'Yenişehir Mah. İnönü Sok. No:8 İstanbul',
      orphanType: 'Anne-Baba Vefat',
      orphanDate: '2018-07-22',
      formStatus: 'Eksik Belge',
      lastUpdate: '2024-01-08',
      documents: ['Nüfus Kayıt Örneği', 'Vefat Belgesi'],
      monthlyIncome: 1800,
      siblings: 1,
      hasPhoto: false
    },
    {
      id: 3,
      studentName: 'Fatma Kaya',
      studentId: 'YTM003',
      age: 8,
      grade: '2. Sınıf',
      school: 'Mimar Sinan İlkokulu',
      guardianName: 'Zeynep Kaya (Büyükanne)',
      guardianPhone: '0555 234 56 78',
      address: 'Bahçelievler Mah. Gül Sk. No:22 İzmir',
      orphanType: 'Anne Vefat',
      orphanDate: '2021-11-03',
      formStatus: 'İnceleniyor',
      lastUpdate: '2024-01-12',
      documents: ['Nüfus Kayıt Örneği', 'Vefat Belgesi', 'Okul Belgesi', 'Gelir Belgesi'],
      monthlyIncome: 3200,
      siblings: 3,
      hasPhoto: true
    }
  ]

  const formFields = [
    { section: 'Kişisel Bilgiler', fields: ['Ad Soyad', 'Doğum Tarihi', 'TC Kimlik No', 'Cinsiyet', 'Kan Grubu'] },
    { section: 'Eğitim Bilgileri', fields: ['Okul Adı', 'Sınıf', 'Öğrenci No', 'Devam Durumu', 'Akademik Başarı'] },
    { section: 'Aile Bilgileri', fields: ['Vasi Adı', 'Yakınlık Derecesi', 'İletişim Bilgileri', 'Meslek', 'Gelir Durumu'] },
    { section: 'Yetimlik Bilgileri', fields: ['Yetimlik Türü', 'Vefat Tarihi', 'Vefat Nedeni', 'Kardeş Sayısı', 'Diğer Destekler'] },
    { section: 'Adres Bilgileri', fields: ['İl', 'İlçe', 'Mahalle', 'Sokak', 'Daire No'] },
    { section: 'Sağlık Bilgileri', fields: ['Kronik Hastalık', 'Özel İhtiyaç', 'Sağlık Raporu', 'İlaç Kullanımı', 'Engel Durumu'] }
  ]

  const stats = {
    totalForms: orphanForms.length,
    completedForms: orphanForms.filter(f => f.formStatus === 'Tamamlandı').length,
    pendingForms: orphanForms.filter(f => f.formStatus === 'İnceleniyor').length,
    incompleteforms: orphanForms.filter(f => f.formStatus === 'Eksik Belge').length
  }

  const filteredForms = orphanForms.filter(form =>
    form.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tamamlandı':
        return 'bg-green-100 text-green-800'
      case 'İnceleniyor':
        return 'bg-yellow-100 text-yellow-800'
      case 'Eksik Belge':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Yetim Bilgi Formu</h1>
        </div>
        <p className="text-white/90">
          Yetim öğrenciler için detaylı bilgi toplama ve değerlendirme formları
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Form</p>
              <p className="text-2xl font-bold">{stats.totalForms}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedForms}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">İncelenen</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingForms}</p>
            </div>
            <Upload className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Eksik Belge</p>
              <p className="text-2xl font-bold text-red-600">{stats.incompleteforms}</p>
            </div>
            <User className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Öğrenci veya vasi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full md:w-80"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Dışa Aktar
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni Form
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredForms.map((form) => (
                <div 
                  key={form.id} 
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{form.studentName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(form.formStatus)}`}>
                          {form.formStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Öğrenci No: {form.studentId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{form.age} yaş, {form.grade}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Vasi: {form.guardianName}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{form.guardianPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{form.address.slice(0, 30)}...</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Son güncelleme: {new Date(form.lastUpdate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {form.orphanType}
                        </span>
                        <span className="text-muted-foreground">
                          {form.siblings} kardeş
                        </span>
                        <span className="text-muted-foreground">
                          ₺{form.monthlyIncome.toLocaleString('tr-TR')} aylık gelir
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Form Template */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Form Şablonu</h2>
            <div className="space-y-4">
              {formFields.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-sm text-primary">{section.section}</h3>
                  <div className="space-y-1">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="text-xs text-muted-foreground pl-2">
                        • {field}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Şablonu İndir
            </Button>
          </Card>

          {selectedForm && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Form Detayları</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">{selectedForm.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedForm.studentId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Yetimlik Bilgisi</h4>
                  <p className="text-sm text-muted-foreground">{selectedForm.orphanType}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedForm.orphanDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Belgeler</h4>
                  <div className="space-y-1">
                    {selectedForm.documents.map((doc: any, index: number) => (
                      <p key={index} className="text-xs text-muted-foreground">• {doc}</p>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Detayları Görüntüle
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
