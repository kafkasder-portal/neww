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
      color: 'bg-semantic-info'
    },
    {
      title: 'Görsel Yönetimi',
      description: 'Öğrenci fotoğrafları ve görsel içerik yönetimi',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/visual-management',
      color: 'bg-semantic-success'
    },
    {
      title: 'Tanımlamalar',
      description: 'Burs türleri ve kategorilerinin tanımlanması',
      icon: <Settings className="h-6 w-6" />,
      link: '/scholarship/definitions',
      color: 'bg-brand-secondary'
    },
    {
      title: 'Takip Kategorileri',
      description: 'Öğrenci takip kategorilerinin yönetimi',
      icon: <Star className="h-6 w-6" />,
      link: '/scholarship/tracking-categories',
      color: 'bg-semantic-warning'
    },
    {
      title: 'Yetim Bilgi Formu',
      description: 'Yetim öğrenciler için özel bilgi formları',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/orphan-form',
      color: 'bg-semantic-danger'
    },
    {
      title: 'Yetim Mektupları',
      description: 'Yetim öğrenciler ile yazışma yönetimi',
      icon: <Mail className="h-6 w-6" />,
      link: '/scholarship/orphan-letters',
      color: 'bg-brand-tertiary'
    },
    {
      title: 'Kampanyalar',
      description: 'Burs kampanyalarının planlanması ve yönetimi',
      icon: <Star className="h-6 w-6" />,
      link: '/scholarship/campaigns',
      color: 'bg-semantic-danger'
    },
    {
      title: 'Okullar',
      description: 'Anlaşmalı okul ve kurumların yönetimi',
      icon: <GraduationCap className="h-6 w-6" />,
      link: '/scholarship/schools',
      color: 'bg-brand-quaternary'
    },
    {
      title: 'Form Tanımları',
      description: 'Başvuru ve değerlendirme formlarının tasarımı',
      icon: <FileText className="h-6 w-6" />,
      link: '/scholarship/form-definitions',
      color: 'bg-semantic-warning'
    },
    {
      title: 'Fiyat Tanımları',
      description: 'Burs miktarları ve ödeme planlarının belirlenmesi',
      icon: <DollarSign className="h-6 w-6" />,
      link: '/scholarship/price-definitions',
      color: 'bg-semantic-success'
    },
    {
      title: 'Adres Etiket Baskı',
      description: 'Posta gönderimler için adres etiketleri',
      icon: <Package className="h-6 w-6" />,
      link: '/scholarship/address-labels',
      color: 'bg-semantic-info'
    },
    {
      title: 'Raporlar',
      description: 'Burs dağılımı ve öğrenci performans raporları',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/scholarship/reports',
      color: 'bg-brand-secondary'
    },
    {
      title: 'Veri Kontrolü',
      description: 'Öğrenci verilerinin doğrulama ve temizleme',
      icon: <Database className="h-6 w-6" />,
      link: '/scholarship/data-control',
      color: 'bg-neutral-500'
    },
    {
      title: 'Modül Bilgilendirme',
      description: 'Burs yönetimi modülü hakkında bilgiler',
      icon: <Info className="h-6 w-6" />,
      link: '/scholarship/module-info',
      color: 'bg-neutral-400'
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
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Öğrenci</p>
              <p className="text-2xl font-bold text-semantic-info">285</p>
            </div>
            <Users className="h-8 w-8 text-semantic-info" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bu Ay Burs</p>
              <p className="text-2xl font-bold text-semantic-success">₺45,600</p>
            </div>
            <DollarSign className="h-8 w-8 text-semantic-success" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anlaşmalı Okul</p>
              <p className="text-2xl font-bold text-brand-secondary">28</p>
            </div>
            <GraduationCap className="h-8 w-8 text-brand-secondary" />
          </div>
        </CorporateCard>
        <CorporateCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Kampanya</p>
              <p className="text-2xl font-bold text-semantic-warning">5</p>
            </div>
            <Star className="h-8 w-8 text-semantic-warning" />
          </div>
        </CorporateCard>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <Link key={index} to={module.link}>
            <CorporateCard className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 h-full">
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
            </CorporateCard>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <CorporateCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/scholarship/orphans-students">
            <CorporateButton className="h-auto p-4 w-full">
              <div className="flex flex-col items-center corporate-form-group">
                <Users className="h-6 w-6" />
                <span>Yeni Öğrenci Ekle</span>
              </div>
            </CorporateButton>
          </Link>
          <Link to="/scholarship/reports">
            <CorporateButton variant="neutral" className="h-auto p-4 w-full">
              <div className="flex flex-col items-center corporate-form-group">
                <BarChart3 className="h-6 w-6" />
                <span>Raporları Görüntüle</span>
              </div>
            </CorporateButton>
          </Link>
          <Link to="/scholarship/campaigns">
            <CorporateButton variant="neutral" className="h-auto p-4 w-full">
              <div className="flex flex-col items-center corporate-form-group">
                <Star className="h-6 w-6" />
                <span>Kampanya Yönet</span>
              </div>
            </CorporateButton>
          </Link>
        </div>
      </CorporateCard>
    </div>
  )
}
