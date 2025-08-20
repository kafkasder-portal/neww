import { Settings, Users, Building, Workflow } from 'lucide-react'

export default function Definitions() {
  return (
    <div className="p-6 bg-card rounded-lg border">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sistem Tanımlamaları</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistem genelinde kullanılan tanımları ve yapılandırmaları yönetin
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-4 mb-8">
          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kullanıcı Yönetimi</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Kullanıcı hesapları, roller ve yetki gruplarını yönetin
            </p>
            <div className="space-y-6-group">
              <a href="/definitions/user-accounts" className="block text-sm text-blue-600 hover:text-blue-800">
                Kullanıcı Hesapları
              </a>
              <a href="/definitions/unit-roles" className="block text-sm text-blue-600 hover:text-blue-800">
                Birim Rolleri
              </a>
              <a href="/definitions/permission-groups" className="block text-sm text-blue-600 hover:text-blue-800">
                Yetki Grupları
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Organizasyon</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Birimler, binalar ve organizasyon yapısını düzenleyin
            </p>
            <div className="space-y-6-group">
              <a href="/definitions/units" className="block text-sm text-green-600 hover:text-green-800">
                Birimler
              </a>
              <a href="/definitions/buildings" className="block text-sm text-green-600 hover:text-green-800">
                Binalar
              </a>
              <a href="/definitions/internal-lines" className="block text-sm text-green-600 hover:text-green-800">
                Dahili Hatlar
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Workflow className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">İş Süreçleri</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Süreç akışları ve operasyonel tanımları yapılandırın
            </p>
            <div className="space-y-6-group">
              <a href="/definitions/process-flows" className="block text-sm text-purple-600 hover:text-purple-800">
                Süreç Akışları
              </a>
              <a href="/definitions/donation-methods" className="block text-sm text-purple-600 hover:text-purple-800">
                Bağış Yöntemleri
              </a>
              <a href="/definitions/delivery-types" className="block text-sm text-purple-600 hover:text-purple-800">
                Teslimat Türleri
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sistem Ayarları</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Genel sistem ayarları ve lokalizasyon seçenekleri
            </p>
            <div className="space-y-6-group">
              <a href="/definitions/general-settings" className="block text-sm text-orange-600 hover:text-orange-800">
                Genel Ayarlar
              </a>
              <a href="/definitions/interface-languages" className="block text-sm text-orange-600 hover:text-orange-800">
                Arayüz Dilleri
              </a>
              <a href="/definitions/translations" className="block text-sm text-orange-600 hover:text-orange-800">
                Tercüme
              </a>
            </div>
          </div>
        </div>

        {/* Additional Categories */}
        <div className="grid grid-cols-3 mb-8">
          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Lokasyon Tanımları</h3>
            <div className="space-y-6-group">
              <a href="/definitions/countries-cities" className="block text-sm text-blue-600 hover:text-blue-800">
                Ülke ve Şehirler
              </a>
              <a href="/definitions/passport-formats" className="block text-sm text-blue-600 hover:text-blue-800">
                Pasaport Formatları
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Kurumsal Tanımlar</h3>
            <div className="space-y-6-group">
              <a href="/definitions/institution-types" className="block text-sm text-green-600 hover:text-green-800">
                Kurum Tür Tanımları
              </a>
              <a href="/definitions/institution-status" className="block text-sm text-green-600 hover:text-green-800">
                Kurum Statü Tanımları
              </a>
              <a href="/definitions/meeting-requests" className="block text-sm text-green-600 hover:text-green-800">
                Görüşme İstek Tanımları
              </a>
              <a href="/definitions/gsm-codes" className="block text-sm text-green-600 hover:text-green-800">
                GSM Kod Numaraları
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 bg-card rounded-lg border">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Yardım & Bilgi</h3>
            <div className="space-y-6-group">
              <a href="/definitions/module-info" className="block text-sm text-purple-600 hover:text-purple-800">
                Modül Bilgilendirme
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity or Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Son Güncellemeler</h2>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Kullanıcı rolleri güncellendi</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Yeni birim tanımı eklendi</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 saat önce</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sistem ayarları değiştirildi</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 gün önce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
