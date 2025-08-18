import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'

export default function TrackingCategories() {
  const [searchTerm, setSearchTerm] = useState('')

  const trackingCategories = [
    {
      id: 1,
      name: 'Akademik Başarı',
      description: 'Not ortalaması ve sınıf başarısı takibi',
      color: 'bg-green-500',
      priority: 'Yüksek',
      studentCount: 185,
      criteria: ['Not ortalaması ≥ 85', 'Devamsızlık ≤ 5 gün'],
      isActive: true
    },
    {
      id: 2,
      name: 'Devam Durumu',
      description: 'Okula devam ve devamsızlık takibi',
      color: 'bg-blue-500',
      priority: 'Yüksek',
      studentCount: 285,
      criteria: ['Aylık devamsızlık raporu', 'Mazeret belgesi kontrolü'],
      isActive: true
    },
    {
      id: 3,
      name: 'Sosyal Gelişim',
      description: 'Sosyal aktivite ve gelişim takibi',
      color: 'bg-purple-500',
      priority: 'Orta',
      studentCount: 142,
      criteria: ['Sosyal etkinlik katılımı', 'Davranış değerlendirmesi'],
      isActive: true
    },
    {
      id: 4,
      name: 'Aile İletişimi',
      description: 'Aile ile düzenli iletişim durumu',
      color: 'bg-orange-500',
      priority: 'Orta',
      studentCount: 198,
      criteria: ['Aylık aile görüşmesi', 'Veli toplantısı katılımı'],
      isActive: true
    },
    {
      id: 5,
      name: 'Ekonomik Durum',
      description: 'Ailenin ekonomik durumu değişiklik takibi',
      color: 'bg-red-500',
      priority: 'Yüksek',
      studentCount: 89,
      criteria: ['Gelir belgesi güncelleme', '6 aylık ekonomik değerlendirme'],
      isActive: true
    },
    {
      id: 6,
      name: 'Sağlık Durumu',
      description: 'Öğrencinin sağlık durumu takibi',
      color: 'bg-pink-500',
      priority: 'Orta',
      studentCount: 45,
      criteria: ['Yıllık sağlık raporu', 'Kronik hastalık takibi'],
      isActive: false
    }
  ]

  const recentActivities = [
    {
      id: 1,
      category: 'Akademik Başarı',
      student: 'Ayşe Yılmaz',
      status: 'success',
      message: 'Dönem sonu notları alındı',
      date: '2024-01-15'
    },
    {
      id: 2,
      category: 'Devam Durumu',
      student: 'Mehmet Demir',
      status: 'warning',
      message: 'Devamsızlık limitine yaklaştı',
      date: '2024-01-14'
    },
    {
      id: 3,
      category: 'Aile İletişimi',
      student: 'Fatma Kaya',
      status: 'error',
      message: 'Aile ile iletişim kurulamadı',
      date: '2024-01-13'
    },
    {
      id: 4,
      category: 'Sosyal Gelişim',
      student: 'Ali Özkan',
      status: 'success',
      message: 'Sosyal etkinliğe katıldı',
      date: '2024-01-12'
    }
  ]

  const stats = {
    totalCategories: trackingCategories.length,
    activeCategories: trackingCategories.filter(c => c.isActive).length,
    totalStudents: trackingCategories.reduce((sum, cat) => sum + cat.studentCount, 0),
    highPriority: trackingCategories.filter(c => c.priority === 'Yüksek').length
  }

  const filteredCategories = trackingCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Yüksek':
        return 'bg-red-100 text-red-800'
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800'
      case 'Düşük':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Star className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Takip Kategorileri</h1>
        </div>
        <p className="text-white/90">
          Öğrenci takip kategorilerinin tanımlanması ve yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Kategori</p>
              <p className="text-2xl font-bold">{stats.totalCategories}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Kategori</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCategories}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Takipteki Öğrenci</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yüksek Öncelik</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full md:w-80"
                />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Kategori
              </Button>
            </div>

            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-4 h-4 rounded-full ${category.color} mt-1`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{category.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(category.priority)}`}>
                              {category.priority} Öncelik
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {category.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {category.studentCount} öğrenci
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Takip Kriterleri:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {category.criteria.map((criterion, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {criterion}
                              </li>
                            ))}
                          </ul>
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

        {/* Recent Activities */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Son Aktiviteler</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-xs text-muted-foreground">{activity.category}</p>
                    <p className="text-xs">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Toplu Değerlendirme
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Öğrenci Atama
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="h-4 w-4 mr-2" />
                Kategori Raporu
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
