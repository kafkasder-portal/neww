import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  Upload, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Download,
  Eye,
  Trash2,
  Edit,
  Users,
  FileImage,
  // Grid3X3,
  List
} from 'lucide-react'

export default function VisualManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  const mockStudents = [
    {
      id: 1,
      name: 'Ayşe Yılmaz',
      studentId: 'OGR001',
      school: 'Atatürk İlkokulu',
      grade: '5. Sınıf',
      photo: '/api/placeholder/150/200',
      hasPhoto: true,
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      studentId: 'OGR002',
      school: 'Cumhuriyet Ortaokulu',
      grade: '7. Sınıf',
      photo: null,
      hasPhoto: false,
      uploadDate: null
    },
    {
      id: 3,
      name: 'Fatma Kaya',
      studentId: 'OGR003',
      school: 'Gazi Lisesi',
      grade: '11. Sınıf',
      photo: '/api/placeholder/150/200',
      hasPhoto: true,
      uploadDate: '2024-01-20'
    },
    {
      id: 4,
      name: 'Ali Özkan',
      studentId: 'OGR004',
      school: 'Mesleki ve Teknik Lise',
      grade: '10. Sınıf',
      photo: null,
      hasPhoto: false,
      uploadDate: null
    }
  ]

  const stats = {
    totalStudents: 285,
    withPhotos: 198,
    withoutPhotos: 87,
    photoPercentage: 69
  }

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <FileImage className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Görsel Yönetimi</h1>
        </div>
        <p className="text-white/90">
          Öğrenci fotoğrafları ve görsel içeriklerin merkezi yönetimi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Öğrenci</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fotoğrafı Olan</p>
              <p className="text-2xl font-bold text-green-600">{stats.withPhotos}</p>
            </div>
            <ImageIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fotoğrafı Eksik</p>
              <p className="text-2xl font-bold text-red-600">{stats.withoutPhotos}</p>
            </div>
            <FileImage className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tamamlanma</p>
              <p className="text-2xl font-bold text-purple-600">%{stats.photoPercentage}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-purple-600">%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Öğrenci ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-80"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrele
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <div className="h-4 w-4 grid grid-cols-3 gap-0.5">
                {Array.from({length: 9}).map((_, i) => (
                  <div key={i} className="bg-current rounded-sm" />
                ))}
              </div>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Toplu Yükleme
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="space-y-3">
                <div className="relative group">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    {student.hasPhoto ? (
                      <img
                        src="/api/placeholder/150/200"
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {student.hasPhoto ? (
                      <>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-medium text-sm">{student.name}</h3>
                  <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  <p className="text-xs text-muted-foreground">{student.school}</p>
                  <p className="text-xs text-muted-foreground">{student.grade}</p>
                  {student.uploadDate && (
                    <p className="text-xs text-green-600">
                      Yüklendi: {new Date(student.uploadDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {student.hasPhoto ? (
                    <img
                      src="/api/placeholder/64/80"
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  <p className="text-sm text-muted-foreground">{student.school} - {student.grade}</p>
                  {student.uploadDate && (
                    <p className="text-sm text-green-600">
                      Yüklendi: {new Date(student.uploadDate).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {student.hasPhoto ? (
                    <>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Fotoğraf Yükle
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
