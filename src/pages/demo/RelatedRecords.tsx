import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  FileText,
  Search,
  Link as LinkIcon,
  Users,
  Building,
  Calendar,
  Database,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react'

export default function RelatedRecords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const relatedRecords = [
    {
      id: 1,
      type: 'Öğrenci-Bağışçı',
      primaryRecord: 'Ayşe Yılmaz (Öğrenci)',
      relatedRecord: 'Mehmet Özkan (Bağışçı)',
      relationship: 'Burs Sponsoru',
      startDate: '2023-09-01',
      status: 'Aktif',
      details: 'Aylık 500₺ eğitim bursu'
    },
    {
      id: 2,
      type: 'Aile-Öğrenci',
      primaryRecord: 'Fatma Kaya Ailesi',
      relatedRecord: 'Ali Kaya, Zehra Kaya',
      relationship: 'Kardeş',
      startDate: '2023-10-15',
      status: 'Aktif',
      details: 'Aynı aileden 2 öğrenci'
    },
    {
      id: 3,
      type: 'Okul-Öğrenci',
      primaryRecord: 'Atatürk İlkokulu',
      relatedRecord: '15 öğrenci',
      relationship: 'Eğitim Kurumu',
      startDate: '2023-09-01',
      status: 'Aktif',
      details: 'Anlaşmalı okul'
    },
    {
      id: 4,
      type: 'Bağış-Proje',
      primaryRecord: 'Eğitim Desteği Bağışı',
      relatedRecord: 'Kitap Dağıtım Projesi',
      relationship: 'Fonlama',
      startDate: '2024-01-01',
      status: 'Devam Ediyor',
      details: '25,000₺ bütçe'
    },
    {
      id: 5,
      type: 'Vasi-Öğrenci',
      primaryRecord: 'Ahmet Demir',
      relatedRecord: 'Mehmet Demir',
      relationship: 'Amca-Yeğen',
      startDate: '2022-05-10',
      status: 'Aktif',
      details: 'Yasal vasi'
    }
  ]

  const recordTypes = [
    { value: 'all', label: 'Tümü', count: relatedRecords.length },
    { value: 'Öğrenci-Bağışçı', label: 'Öğrenci-Bağışçı', count: relatedRecords.filter(r => r.type === 'Öğrenci-Bağışçı').length },
    { value: 'Aile-Öğrenci', label: 'Aile-Öğrenci', count: relatedRecords.filter(r => r.type === 'Aile-Öğrenci').length },
    { value: 'Okul-Öğrenci', label: 'Okul-Öğrenci', count: relatedRecords.filter(r => r.type === 'Okul-Öğrenci').length },
    { value: 'Bağış-Proje', label: 'Bağış-Proje', count: relatedRecords.filter(r => r.type === 'Bağış-Proje').length },
    { value: 'Vasi-Öğrenci', label: 'Vasi-Öğrenci', count: relatedRecords.filter(r => r.type === 'Vasi-Öğrenci').length }
  ]

  const stats = {
    totalRelationships: relatedRecords.length,
    activeRelationships: relatedRecords.filter(r => r.status === 'Aktif').length,
    students: 45,
    donors: 28
  }

  const filteredRecords = relatedRecords.filter(record => {
    const matchesSearch = record.primaryRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.relationship.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || record.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800'
      case 'Devam Ediyor':
        return 'bg-blue-100 text-blue-800'
      case 'Tamamlandı':
        return 'bg-gray-100 text-gray-800'
      case 'İptal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Öğrenci-Bağışçı':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'Aile-Öğrenci':
        return <Users className="h-4 w-4 text-green-600" />
      case 'Okul-Öğrenci':
        return <Building className="h-4 w-4 text-purple-600" />
      case 'Bağış-Proje':
        return <Database className="h-4 w-4 text-orange-600" />
      case 'Vasi-Öğrenci':
        return <Users className="h-4 w-4 text-red-600" />
      default:
        return <LinkIcon className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Bağlantılı Kayıtlar</h1>
        </div>
        <p className="text-white/90">
          Sistem içerisindeki ilişkili kayıtların görüntülenmesi ve yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam İlişki</p>
              <p className="text-2xl font-bold">{stats.totalRelationships}</p>
            </div>
            <LinkIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif İlişki</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRelationships}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Öğrenci</p>
              <p className="text-2xl font-bold text-purple-600">{stats.students}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bağışçı</p>
              <p className="text-2xl font-bold text-orange-600">{stats.donors}</p>
            </div>
            <Database className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtreler
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">İlişki Türü</label>
              <div className="space-y-2">
                {recordTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === type.value
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{type.label}</span>
                      <span className="text-xs opacity-70">{type.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Records List */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kayıt ara..."
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
                  <LinkIcon className="h-4 w-4" />
                  Yeni İlişki
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(record.type)}
                          <span className="font-medium">{record.relationship}</span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {record.type}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Ana Kayıt</p>
                          <p className="font-medium">{record.primaryRecord}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Bağlantılı Kayıt</p>
                          <p className="font-medium">{record.relatedRecord}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(record.startDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="text-muted-foreground">{record.details}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Arama kriterlerinize uygun kayıt bulunamadı.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
