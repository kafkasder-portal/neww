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
  Calendar,
  DollarSign,
  Users,
  Target,
  // TrendingUp,
  Eye,
  Play,
  Pause,
  BarChart3
} from 'lucide-react'

export default function ScholarshipCampaigns() {
  const [searchTerm, setSearchTerm] = useState('')

  const campaigns = [
    {
      id: 1,
      name: 'Eğitime Destek 2024',
      description: 'İhtiyaç sahibi öğrenciler için kapsamlı eğitim desteği kampanyası',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAmount: 100000,
      raisedAmount: 65400,
      participantCount: 142,
      status: 'Aktif',
      category: 'Genel Eğitim',
      priority: 'Yüksek'
    },
    {
      id: 2,
      name: 'Yetim Öğrenci Bursu',
      description: 'Yetim öğrenciler için özel burs kampanyası',
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      targetAmount: 50000,
      raisedAmount: 38200,
      participantCount: 89,
      status: 'Aktif',
      category: 'Yetim Desteği',
      priority: 'Yüksek'
    },
    {
      id: 3,
      name: 'Üniversite Hazırlık',
      description: 'Lise son sınıf öğrencileri için üniversite hazırlık desteği',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      targetAmount: 30000,
      raisedAmount: 15600,
      participantCount: 45,
      status: 'Aktif',
      category: 'Üniversite Hazırlık',
      priority: 'Orta'
    },
    {
      id: 4,
      name: 'Kitap ve Kırtasiye',
      description: 'Eğitim materyalleri için destek kampanyası',
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      targetAmount: 25000,
      raisedAmount: 25000,
      participantCount: 167,
      status: 'Tamamlandı',
      category: 'Materyal Desteği',
      priority: 'Orta'
    },
    {
      id: 5,
      name: 'Teknoloji Desteği',
      description: 'Uzaktan eğitim için tablet ve laptop desteği',
      startDate: '2024-04-01',
      endDate: '2024-07-31',
      targetAmount: 75000,
      raisedAmount: 12300,
      participantCount: 28,
      status: 'Beklemede',
      category: 'Teknoloji',
      priority: 'Orta'
    }
  ]

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'Aktif').length,
    totalTarget: campaigns.reduce((sum, c) => sum + c.targetAmount, 0),
    totalRaised: campaigns.reduce((sum, c) => sum + c.raisedAmount, 0)
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800'
      case 'Beklemede':
        return 'bg-yellow-100 text-yellow-800'
      case 'Tamamlandı':
        return 'bg-blue-100 text-blue-800'
      case 'İptal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Star className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Burs Kampanyaları</h1>
        </div>
        <p className="text-white/90">
          Eğitim desteği kampanyalarının planlanması ve yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Kampanya</p>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Kampanya</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hedef Tutar</p>
              <p className="text-2xl font-bold text-purple-600">₺{stats.totalTarget.toLocaleString('tr-TR')}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplanan</p>
              <p className="text-2xl font-bold text-orange-600">₺{stats.totalRaised.toLocaleString('tr-TR')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kampanya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-80"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Raporlar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Kampanya
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(campaign.priority)}`}>
                    {campaign.priority}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Toplanan: ₺{campaign.raisedAmount.toLocaleString('tr-TR')}</span>
                  <span>Hedef: ₺{campaign.targetAmount.toLocaleString('tr-TR')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(campaign.raisedAmount, campaign.targetAmount)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  %{getProgressPercentage(campaign.raisedAmount, campaign.targetAmount).toFixed(1)} tamamlandı
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Başlangıç:</span>
                  </div>
                  <p className="ml-6">{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Bitiş:</span>
                  </div>
                  <p className="ml-6">{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.participantCount} katılımc��</span>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {campaign.category}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Detay
                </Button>
                {campaign.status === 'Aktif' && (
                  <Button size="sm" variant="outline">
                    <Pause className="h-4 w-4 mr-1" />
                    Duraklat
                  </Button>
                )}
                {campaign.status === 'Beklemede' && (
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    Başlat
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Düzenle
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
