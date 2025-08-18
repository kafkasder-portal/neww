import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { 
  GraduationCap, 
  Users, 
  FileText, 
  Star, 
  Mail, 
  Settings,
  DollarSign,
  Package,
  BarChart3,
  Database,
  Info
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ScholarshipIndex() {
  const modules = [
    {
      title: 'Yetimler & Öğrenciler',
      description: 'Burs alan öğrenci ve yetim kayıtlarının yönetimi',
      icon: <Users className="h-6 w-6" />,
      link: '/scholarship/orphans-students',
      color: 'bg-blue-500'
    },
    {
      title: 'Görsel Yönetimi',
      description: 'Öğrenci fotoğrafları ve görsel içerik yönetimi',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/visual-management',
      color: 'bg-green-500'
    },
    {
      title: 'Tanımlamalar',
      description: 'Burs türleri ve kategorilerinin tanımlanması',
      icon: <Settings className="h-6 w-6" />,
      link: '/scholarship/definitions',
      color: 'bg-purple-500'
    },
    {
      title: 'Takip Kategorileri',
      description: 'Öğrenci takip kategorilerinin yönetimi',
      icon: <Star className="h-6 w-6" />,
      link: '/scholarship/tracking-categories',
      color: 'bg-yellow-500'
    },
    {
      title: 'Yetim Bilgi Formu',
      description: 'Yetim öğrenciler için özel bilgi formları',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/orphan-form',
      color: 'bg-red-500'
    },
    {
      title: 'Yetim Mektupları',
      description: 'Yetim öğrenciler ile yazışma yönetimi',
      icon: <Mail className="h-6 w-6" />,
      link: '/scholarship/orphan-letters',
      color: 'bg-indigo-500'
    },
    {
      title: 'Kampanyalar',
      description: 'Burs kampanyalarının planlanması ve yönetimi',
      icon: <Star className="h-6 w-6" />,
      link: '/scholarship/campaigns',
      color: 'bg-pink-500'
    },
    {
      title: 'Okullar',
      description: 'Anlaşmalı okul ve kurumların yönetimi',
      icon: <GraduationCap className="h-6 w-6" />,
      link: '/scholarship/schools',
      color: 'bg-cyan-500'
    },
    {
      title: 'Form Tanımları',
      description: 'Başvuru ve değerlendirme formlarının tasarımı',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/form-definitions',
      color: 'bg-orange-500'
    },
    {
      title: 'Fiyat Tanımları',
      description: 'Burs miktarları ve ödeme planlarının belirlenmesi',
      icon: <DollarSign className="h-6 w-6" />,
      link: '/scholarship/price-definitions',
      color: 'bg-emerald-500'
    },
    {
      title: 'Adres Etiket Baskı',
      description: 'Posta gönderimler için adres etiketleri',
      icon: <Package className="h-6 w-6" />,
      link: '/scholarship/address-labels',
      color: 'bg-teal-500'
    },
    {
      title: 'Raporlar',
      description: 'Burs dağılımı ve öğrenci performans raporları',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/scholarship/reports',
      color: 'bg-violet-500'
    },
    {
      title: 'Veri Kontrolü',
      description: 'Öğrenci verilerinin doğrulama ve temizleme',
      icon: <Database className="h-6 w-6" />,
      link: '/scholarship/data-control',
      color: 'bg-slate-500'
    },
    {
      title: 'Modül Bilgilendirme',
      description: 'Burs yönetimi modülü hakkında bilgiler',
      icon: <Info className="h-6 w-6" />,
      link: '/scholarship/module-info',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Burs Yönetimi</h1>
        </div>
        <p className="text-white/90">
          Öğrenci bursları, yetim takibi ve eğitim desteklerinin kapsamlı yönetimi
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Öğrenci</p>
              <p className="text-2xl font-bold text-blue-600">285</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bu Ay Burs</p>
              <p className="text-2xl font-bold text-green-600">₺45,600</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anlaşmalı Okul</p>
              <p className="text-2xl font-bold text-purple-600">28</p>
            </div>
            <GraduationCap className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Kampanya</p>
              <p className="text-2xl font-bold text-orange-600">5</p>
            </div>
            <Star className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <Link key={index} to={module.link}>
            <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 h-full">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-lg ${module.color} text-white`}>
                  {module.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{module.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/scholarship/orphans-students">
            <Button className="h-auto p-4 w-full">
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Yeni Öğrenci Ekle</span>
              </div>
            </Button>
          </Link>
          <Link to="/scholarship/reports">
            <Button variant="outline" className="h-auto p-4 w-full">
              <div className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Raporları Görüntüle</span>
              </div>
            </Button>
          </Link>
          <Link to="/scholarship/campaigns">
            <Button variant="outline" className="h-auto p-4 w-full">
              <div className="flex flex-col items-center space-y-2">
                <Star className="h-6 w-6" />
                <span>Kampanya Yönet</span>
              </div>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
