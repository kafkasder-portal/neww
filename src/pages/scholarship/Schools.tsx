import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Phone,
  Users,
  Mail,
  Building,
  // Star,
  CheckCircle
} from 'lucide-react'

export default function Schools() {
  const [searchTerm, setSearchTerm] = useState('')

  const schools = [
    {
      id: 1,
      name: 'Atatürk İlkokulu',
      type: 'İlkokul',
      address: 'Merkez Mah. Atatürk Cad. No:15 Ankara',
      phone: '0312 123 45 67',
      email: 'atatürk.ilkokul@meb.gov.tr',
      principalName: 'Ayşe Kaya',
      studentCount: 45,
      contractStatus: 'Aktif',
      contractDate: '2023-09-01',
      city: 'Ankara'
    },
    {
      id: 2,
      name: 'Cumhuriyet Ortaokulu',
      type: 'Ortaokul',
      address: 'Yenişehir Mah. İnönü Sok. No:8 İstanbul',
      phone: '0212 987 65 43',
      email: 'cumhuriyet.ortaokul@meb.gov.tr',
      principalName: 'Mehmet Demir',
      studentCount: 32,
      contractStatus: 'Aktif',
      contractDate: '2023-09-01',
      city: 'İstanbul'
    },
    {
      id: 3,
      name: 'Gazi Lisesi',
      type: 'Lise',
      address: 'Bahçelievler Mah. Gül Sk. No:22 İzmir',
      phone: '0232 234 56 78',
      email: 'gazi.lisesi@meb.gov.tr',
      principalName: 'Fatma Özkan',
      studentCount: 28,
      contractStatus: 'Beklemede',
      contractDate: '2024-02-01',
      city: 'İzmir'
    }
  ]

  const stats = {
    totalSchools: schools.length,
    activeContracts: schools.filter(s => s.contractStatus === 'Aktif').length,
    totalStudents: schools.reduce((sum, s) => sum + s.studentCount, 0),
    cities: [...new Set(schools.map(s => s.city))].length
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800'
      case 'Beklemede':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pasif':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Anlaşmalı Okullar</h1>
        </div>
        <p className="text-white/90">
          Burs programı kapsamındaki okul ve kurumların yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Okul</p>
              <p className="text-2xl font-bold">{stats.totalSchools}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Anlaşma</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Öğrenci Sayısı</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Şehir Sayısı</p>
              <p className="text-2xl font-bold text-orange-600">{stats.cities}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Toolbar & Content */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Okul ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-80"
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Okul Ekle
          </Button>
        </div>

        <div className="space-y-4">
          {filteredSchools.map((school) => (
            <div key={school.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">{school.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(school.contractStatus)}`}>
                      {school.contractStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{school.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{school.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{school.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Müdür: {school.principalName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{school.studentCount} burslu öğrenci</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Anlaşma: {new Date(school.contractDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
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
  )
}
