// import React from 'react' // JSX kullanımı için gerekli değil
import { 
  Home, 
  Users, 
  Heart, 
  MessageSquare, 
  Calendar, 
  CheckSquare, 
  Settings,
  BarChart3,
  FileText,
  Building
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export const onboardingSteps = [
  {
    id: 'welcome',
    title: 'onboarding.welcome',
    description: 'onboarding.welcomeDescription',
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
          <Building className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Dernek Yönetim Paneli
        </h3>
        <p className="text-gray-600">
          Modern, güvenli ve kullanıcı dostu dernek yönetim sistemi
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">Kullanıcı Yönetimi</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900">Yardım Sistemi</p>
          </div>
        </div>
      </div>
    ),
    interactive: false
  },
  {
    id: 'dashboard',
    title: 'onboarding.dashboardTitle',
    description: 'onboarding.dashboardDescription',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">İstatistikler</h4>
            <p className="text-sm text-gray-600">Güncel veriler ve grafikler</p>
          </Card>
          <Card className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Aktiviteler</h4>
            <p className="text-sm text-gray-600">Son aktiviteler ve bildirimler</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Görevler</h4>
            <p className="text-sm text-gray-600">Bekleyen görevler ve öncelikler</p>
          </Card>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>İpucu:</strong> Dashboard&apos;da widget&apos;ları düzenleyebilir ve kişiselleştirebilirsiniz.
          </p>
        </div>
      </div>
    ),
    interactive: true
  },
  {
    id: 'modules',
    title: 'onboarding.modulesTitle',
    description: 'onboarding.modulesDescription',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Yardım Modülü</h4>
                <p className="text-xs text-gray-600">İhtiyaç sahipleri ve başvurular</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Heart className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Bağış Modülü</h4>
                <p className="text-xs text-gray-600">Bağış takibi ve yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">Mesajlaşma</h4>
                <p className="text-xs text-gray-600">İletişim ve bildirimler</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-gray-900">Toplantılar</h4>
                <p className="text-xs text-gray-600">Ajanda ve toplantı yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Görevler</h4>
                <p className="text-xs text-gray-600">Proje ve görev takibi</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Sistem</h4>
                <p className="text-xs text-gray-600">Ayarlar ve yönetim</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    interactive: true
  },
  {
    id: 'navigation',
    title: 'Navigasyon - Sistemde Gezinme',
    description: 'Sol menüden tüm modüllere erişebilir, üst menüden hızlı işlemler yapabilirsiniz.',
    content: (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Sol Menü</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Dashboard - Ana sayfa</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span>Yardım - İhtiyaç sahipleri</span>
            </li>
            <li className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-600" />
              <span>Bağışlar - Bağış yönetimi</span>
            </li>
            <li className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>Mesajlar - İletişim</span>
            </li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Üst Menü</h4>
          <ul className="space-y-2 text-sm">
            <li>🔍 <strong>Arama</strong> - Hızlı arama yapın</li>
            <li>🔔 <strong>Bildirimler</strong> - Yeni mesajlar ve uyarılar</li>
            <li>👤 <strong>Profil</strong> - Hesap ayarları</li>
            <li>🎨 <strong>Tema</strong> - Açık/koyu tema değiştirme</li>
          </ul>
        </div>
      </div>
    ),
    interactive: true
  },
  {
    id: 'ai-assistant',
    title: 'AI Asistan - Akıllı Yardımcı',
    description: 'AI Asistan ile doğal dil kullanarak sistemde işlemler yapabilir, sorular sorabilirsiniz.',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">AI Asistan Özellikleri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-sm"><strong>💬 Doğal Dil:</strong> Türkçe konuşun</p>
              <p className="text-sm"><strong>🎯 Hızlı İşlemler:</strong> Komutlarla işlem yapın</p>
              <p className="text-sm"><strong>📊 Raporlar:</strong> Otomatik rapor oluşturun</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><strong>🔍 Arama:</strong> Akıllı arama yapın</p>
              <p className="text-sm"><strong>📈 Analiz:</strong> Veri analizi yapın</p>
              <p className="text-sm"><strong>⚡ Otomasyon:</strong> Tekrarlayan işlemler</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Örnek Komutlar</h4>
          <div className="space-y-2 text-sm">
            <p>&quot;<strong>Hak sahibi listele</strong>&quot; - Tüm ihtiyaç sahiplerini göster</p>
            <p>&quot;<strong>Yeni bağış ekle: 1000 TL</strong>&quot; - Bağış kaydı oluştur</p>
            <p>&quot;<strong>Bu ay bağış raporu al</strong>&quot; - Aylık rapor oluştur</p>
            <p>&quot;<strong>Toplantı oluştur: Yönetim toplantısı</strong>&quot; - Toplantı planla</p>
          </div>
        </div>
      </div>
    ),
    interactive: true
  },
  {
    id: 'permissions',
    title: 'Yetkiler ve Güvenlik',
    description: 'Sistem, rol tabanlı yetkilendirme kullanır. Her kullanıcının belirli yetkileri vardır.',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Kullanıcı Rolleri</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm font-medium">Super Admin</span>
                <span className="text-xs text-red-600">Tam yetki</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs text-orange-600">Yönetim</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm font-medium">Manager</span>
                <span className="text-xs text-yellow-600">Operasyon</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">Coordinator</span>
                <span className="text-xs text-green-600">Koordinasyon</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Operator</span>
                <span className="text-xs text-blue-600">İşlem</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Viewer</span>
                <span className="text-xs text-gray-600">Görüntüleme</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Güvenlik Özellikleri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>JWT tabanlı kimlik doğrulama</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>İki faktörlü doğrulama</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Otomatik oturum sonlandırma</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Şifre politikaları</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    interactive: true
  },
  {
    id: 'completion',
    title: 'Tebrikler! 🎉',
    description: 'Onboarding rehberini tamamladınız. Artık sistemi kullanmaya başlayabilirsiniz.',
    content: (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
          <CheckSquare className="w-12 h-12 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Hazırsınız!
          </h3>
          <p className="text-gray-600 mb-4">
            Artık Dernek Yönetim Paneli&apos;nin tüm özelliklerini kullanabilirsiniz.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Dokümantasyon</h4>
            <p className="text-sm text-gray-600">Detaylı kullanım kılavuzu</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Destek</h4>
            <p className="text-sm text-gray-600">Yardım ve destek</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">Ayarlar</h4>
            <p className="text-sm text-gray-600">Kişiselleştirme</p>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>İpucu:</strong> Herhangi bir sorunuz olduğunda AI Asistan&apos;ı kullanabilir veya destek ekibimizle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    ),
    interactive: false
  }
]
