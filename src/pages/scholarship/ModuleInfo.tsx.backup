import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { 
  Info, 
  Book, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  FileText, 
  Download,
  GraduationCap,
  Star,
  Mail,
  Calendar
} from 'lucide-react'

export default function ScholarshipModuleInfo() {
  const moduleFeatures = [
    {
      title: 'Öğrenci Yönetimi',
      description: 'Burs alan öğrencilerin kapsamlı kayıt ve takip sistemi',
      icon: <Users className="h-6 w-6" />,
      features: ['Öğrenci kayıtları', 'Akademik takip', 'Devam kontrolü', 'Performans değerlendirme']
    },
    {
      title: 'Burs Yönetimi',
      description: 'Farklı burs türleri ve ödeme planları yönetimi',
      icon: <GraduationCap className="h-6 w-6" />,
      features: ['Burs türü tanımlama', 'Ödeme planları', 'Tutar belirleme', 'Otomatik ödemeler']
    },
    {
      title: 'İletişim Sistemi',
      description: 'Öğrenciler ve aileler ile etkili iletişim araçları',
      icon: <Mail className="h-6 w-6" />,
      features: ['Mektup yönetimi', 'Toplu mesajlaşma', 'Aile iletişimi', 'Bilgilendirme']
    },
    {
      title: 'Raporlama',
      description: 'Detaylı analiz ve raporlama sistemleri',
      icon: <BarChart3 className="h-6 w-6" />,
      features: ['Başarı raporları', 'Mali raporlar', 'Devam raporları', 'İstatistikler']
    }
  ]

  const quickStats = {
    totalStudents: 285,
    activeCampaigns: 5,
    monthlyPayments: 142000,
    completionRate: 87
  }

  const helpResources = [
    { title: 'Kullanıcı Kılavuzu', type: 'PDF', size: '2.5 MB' },
    { title: 'Video Eğitimler', type: 'Video', duration: '45 dk' },
    { title: 'SSS Dokümanı', type: 'PDF', size: '850 KB' },
    { title: 'API Dokümantasyonu', type: 'Web', pages: '24 sayfa' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Info className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Burs Yönetimi Modülü</h1>
        </div>
        <p className="text-white/90">
          Kapsamlı burs yönetimi sistemi hakkında detaylı bilgiler ve kullanım kılavuzu
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Öğrenci</p>
              <p className="text-2xl font-bold text-blue-600">{quickStats.totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Kampanya</p>
              <p className="text-2xl font-bold text-green-600">{quickStats.activeCampaigns}</p>
            </div>
            <Star className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aylık Ödeme</p>
              <p className="text-2xl font-bold text-purple-600">₺{quickStats.monthlyPayments.toLocaleString('tr-TR')}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Başarı Oranı</p>
              <p className="text-2xl font-bold text-orange-600">%{quickStats.completionRate}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Features */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Modül Özellikleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleFeatures.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* System Requirements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Sistem Gereksinimleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Minimum Gereksinimler</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Windows 10 / macOS 10.14 / Linux Ubuntu 18.04</li>
                  <li>• 4 GB RAM</li>
                  <li>• 2 GB boş disk alanı</li>
                  <li>• İnternet bağlantısı</li>
                  <li>• Modern web tarayıcısı</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Önerilen Gereksinimler</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Windows 11 / macOS 12+ / Linux Ubuntu 20.04+</li>
                  <li>• 8 GB RAM</li>
                  <li>• 5 GB boş disk alanı</li>
                  <li>• Yüksek hızlı internet</li>
                  <li>• Google Chrome / Firefox (güncel)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Help Resources */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Yardım Kaynakları
            </h2>
            <div className="space-y-3">
              {helpResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {resource.type} - {resource.size || resource.duration || resource.pages}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Teknik Destek</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">E-posta</p>
                <p className="text-muted-foreground">destek@dernek.org.tr</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Telefon</p>
                <p className="text-muted-foreground">+90 312 XXX XX XX</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Çalışma Saatleri</p>
                <p className="text-muted-foreground">Pazartesi - Cuma: 09:00 - 18:00</p>
              </div>
            </div>
            <Button className="w-full mt-4">
              Destek Talebi Oluştur
            </Button>
          </Card>

          {/* Version Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Sürüm Bilgileri</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Modül Sürümü:</span>
                <span className="font-medium">v2.1.4</span>
              </div>
              <div className="flex justify-between">
                <span>Son Güncelleme:</span>
                <span className="font-medium">15.01.2024</span>
              </div>
              <div className="flex justify-between">
                <span>Lisans:</span>
                <span className="font-medium">Enterprise</span>
              </div>
              <div className="flex justify-between">
                <span>Durum:</span>
                <span className="text-green-600 font-medium">Aktif</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
