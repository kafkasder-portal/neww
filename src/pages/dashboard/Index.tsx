import {
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Heart,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock data
const statsData = [
  {
    title: 'Toplam Yararlanıcı',
    value: '2,547',
    change: '+12.5%',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'Bu Ay Bağış',
    value: '₺458,942',
    change: '+8.2%',
    icon: DollarSign,
    color: 'text-blue-600'
  },
  {
    title: 'Aktif Projeler',
    value: '24',
    change: '-3.1%',
    icon: Activity,
    color: 'text-orange-600'
  },
  {
    title: 'Toplam Gönüllü',
    value: '156',
    change: '+15.3%',
    icon: Heart,
    color: 'text-red-600'
  }
]

const recentActivities = [
  {
    title: 'Yeni bağış alındı',
    description: 'Ahmet Yılmaz - ₺2,500',
    time: '5 dakika önce',
    type: 'donation'
  },
  {
    title: 'Yardım başvurusu',
    description: 'Fatma Demir - Gıda yardımı',
    time: '15 dakika önce',
    type: 'application'
  },
  {
    title: 'Gönüllü kaydı',
    description: 'Mehmet Kaya - Eğitim desteği',
    time: '1 saat önce',
    type: 'volunteer'
  }
]

export default function DashboardIndex() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dernek faaliyetlerinizin genel görünümü
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change} geçen ay
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Activities */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-start p-3 border rounded">
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Hızlı İşlemler</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Yeni Yararlanıcı
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Bağış Kaydet
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Gönüllü Ekle
            </Button>
          </div>
        </Card>

      </div>

    </div>
  )
}
