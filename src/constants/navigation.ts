import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  Building2,
  Coins,
  GraduationCap,
  HelpingHand,
  Shield,
  Database,
  CheckSquare,
  Calculator,
  Package,
  LucideIcon
} from 'lucide-react'

export interface NavigationSubPage {
  title: string
  href: string
  description?: string
}

export interface NavigationItem {
  title: string
  icon: LucideIcon
  badge?: string | number
  subPages: NavigationSubPage[]
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    badge: undefined,
    subPages: [
      { title: "Genel Bakış", href: "/", description: "Ana sayfa ve özet bilgiler" },
      { title: "Performans", href: "/system/performance", description: "Sistem performans metrikleri" },
      { title: "Aktivite Akışı", href: "/activity", description: "Son kullanıcı aktiviteleri" }
    ]
  },
  {
    title: "Analitik",
    icon: BarChart3,
    badge: 3,
    subPages: [
      { title: "Mesaj Analitiği", href: "/messages/analytics", description: "Mesaj istatistikleri" },
      { title: "Bağış Raporları", href: "/donations/reports", description: "Bağış analiz raporları" },
      { title: "Kullanıcı Metrikleri", href: "/analytics/users", description: "Kullanıcı davranış analizi" }
    ]
  },
  {
    title: "Bağış Yönetimi",
    icon: Coins,
    badge: undefined,
    subPages: [
      { title: "Bağış Listesi", href: "/donations", description: "Tüm bağışlar" },
      { title: "Bağış Veznesi", href: "/donations/vault", description: "Bağış kasası yönetimi" },
      { title: "Kurumlar", href: "/donations/institutions", description: "Bağışçı kurumlar" },
      { title: "Nakit Bağışlar", href: "/donations/cash", description: "Nakit bağış işlemleri" },
      { title: "Banka Bağışları", href: "/donations/bank", description: "Banka transferi bağışları" },
      { title: "Online Bağışlar", href: "/donations/online", description: "Online bağış platformu" },
      { title: "Kredi Kartı Bağışları", href: "/donations/credit-card", description: "Kredi kartı bağışları" },
      { title: "Toplu Provizyon", href: "/donations/bulk-provisioning", description: "Toplu bağış provizyon işlemleri" },
      { title: "Ramazan Dönemleri", href: "/donations/ramadan-periods", description: "Ramazan kampanya dönemleri" },
      { title: "Kurban Dönemleri", href: "/donations/sacrifice-periods", description: "Kurban kampanya dönemleri" },
      { title: "Düzenli Bağışlar", href: "/donations/recurring", description: "Abonelik tabanlı düzenli bağışlar" }
    ]
  },
  {
    title: "Toplantılar",
    icon: Calendar,
    badge: undefined,
    subPages: [
      { title: "Tüm Toplantılar", href: "/meetings", description: "Toplantı listesi" },
      { title: "Toplantı Planla", href: "/meetings/create", description: "Yeni toplantı oluştur" },
      { title: "Toplantı Takvimi", href: "/meetings/calendar", description: "Takvim görünümü" }
    ]
  },
  {
    title: "Yardım Yönetimi",
    icon: HelpingHand,
    badge: undefined,
    subPages: [
      { title: "İhtiyaç Sahipleri", href: "/aid/beneficiaries", description: "Yardım alan kişiler" },
      { title: "Yardım Başvuruları", href: "/aid/applications", description: "Başvuru yönetimi" },
      { title: "Nakdi Yardımlar", href: "/aid/cash-operations", description: "Nakdi yardım işlemleri" },
      { title: "Ayni Yardımlar", href: "/aid/in-kind-operations", description: "Ayni yardım dağıtımı" },
      { title: "Raporlar", href: "/aid/reports", description: "Yardım raporları" },
      { title: "Nakit Kasası", href: "/aid/cash-vault", description: "Nakit kasa yönetimi" },
      { title: "Banka Emirleri", href: "/aid/bank-orders", description: "Banka havale emirleri" },
      { title: "Hastane Sevkleri", href: "/aid/hospital-referrals", description: "Hastane sevk işlemleri" },
      { title: "Veri Kontrolü", href: "/aid/data-control", description: "Veri doğrulama ve kontrol" },
      { title: "Hizmet Takibi", href: "/aid/service-tracking", description: "Hizmet takip sistemi" }
    ]
  },
  {
    title: "Mali Yönetim",
    icon: Calculator,
    badge: undefined,
    subPages: [
      { title: "Mali Panel", href: "/finance", description: "Mali durum özeti" },
      { title: "Hesap Planı", href: "/finance/accounts", description: "Muhasebe hesap planı" },
      { title: "Yevmiye Defteri", href: "/finance/journal", description: "Muhasebe kayıtları" },
      { title: "Mali Raporlar", href: "/finance/reports", description: "Finansal raporlama" },
      { title: "Bütçe Yönetimi", href: "/finance/budget", description: "Bütçe planlama ve takip" },
      { title: "Hibe Yönetimi", href: "/finance/grants", description: "Hibe takip sistemi" },
      { title: "Banka Mutabakatı", href: "/finance/reconciliation", description: "Banka hesap mutabakatı" },
      { title: "Vergi Yönetimi", href: "/finance/tax", description: "Vergi belgeleri" }
    ]
  },
  {
    title: "Bağışçı CRM",
    icon: Users,
    badge: undefined,
    subPages: [
      { title: "CRM Panel", href: "/donors", description: "Bağışçı yönetim paneli" },
      { title: "Bağışçı Listesi", href: "/donors/list", description: "Tüm bağışçılar" },
      { title: "Bağışçı Segmentleri", href: "/donors/segments", description: "Bağışçı grupları" },
      { title: "CRM Kampanyaları", href: "/donors/campaigns", description: "Pazarlama kampanyaları" },
      { title: "Bağışçı Görevleri", href: "/donors/tasks", description: "Takip görevleri" },
      { title: "Bağışçı Analitikleri", href: "/donors/analytics", description: "Detaylı analizler" },
      { title: "İletişim Geçmişi", href: "/donors/communications", description: "İletişim kayıtları" }
    ]
  },
  {
    title: "Gönüllü Yönetimi",
    icon: Users,
    badge: undefined,
    subPages: [
      { title: "Gönüllü Panel", href: "/volunteers", description: "Gönüllü yönetim paneli" },
      { title: "Gönüllü Listesi", href: "/volunteers/list", description: "Tüm gönüllüler" },
      { title: "Başvurular", href: "/volunteers/applications", description: "Gönüllü başvuruları" },
      { title: "Vardiya Yönetimi", href: "/volunteers/shifts", description: "Vardiya planlaması" },
      { title: "Eğitim Programları", href: "/volunteers/training", description: "Gönüllü eğitimleri" },
      { title: "Etkinlik Yönetimi", href: "/volunteers/events", description: "Gönüllü etkinlikleri" },
      { title: "Performans Takibi", href: "/volunteers/performance", description: "Gönüllü değerlendirmeleri" }
    ]
  },
  {
    title: "Envanter Yönetimi",
    icon: Package,
    badge: undefined,
    subPages: [
      { title: "Envanter Panel", href: "/inventory", description: "Ana envanter yönetim paneli" },
      { title: "Stok Takibi", href: "/inventory/items", description: "Malzeme ve stok yönetimi" },
      { title: "Kategoriler", href: "/inventory/categories", description: "Ürün kategori yönetimi" },
      { title: "Lokasyonlar", href: "/inventory/locations", description: "Depo ve konum yönetimi" },
      { title: "Stok Uyarıları", href: "/inventory/alerts", description: "Minimum stok ve uyarılar" },
      { title: "Stok Hareketleri", href: "/inventory/movements", description: "Giriş çıkış hareketleri" },
      { title: "Tedarikçiler", href: "/inventory/suppliers", description: "Tedarikçi yönetimi" },
      { title: "Raporlar", href: "/inventory/reports", description: "Envanter analiz raporları" }
    ]
  },
  {
    title: "Mesajlaşma",
    icon: MessageSquare,
    badge: 12,
    subPages: [
      { title: "Mesaj Merkezi", href: "/messages", description: "Ana mesaj paneli" },
      { title: "Toplu Mesaj", href: "/messages/bulk-send", description: "Toplu mesaj gönderimi" },
      { title: "Mesaj Grupları", href: "/messages/groups", description: "Grup yönetimi" },
      { title: "SMS Gönderimleri", href: "/messages/sms-deliveries", description: "SMS kayıtları" },
      { title: "E-posta Gönderimleri", href: "/messages/email-deliveries", description: "E-posta kayıtları" }
    ]
  },
  {
    title: "Burs Yönetimi",
    icon: GraduationCap,
    badge: undefined,
    subPages: [
      { title: "Yetim & Öğrenciler", href: "/scholarship", description: "Burs alan öğrenciler" },
      { title: "Burs Kampanyaları", href: "/scholarship/campaigns", description: "Burs kampanya yönetimi" },
      { title: "Okullar", href: "/scholarship/schools", description: "Okul kayıtları" },
      { title: "Burs Raporları", href: "/scholarship/reports", description: "Burs analiz raporları" },
      { title: "Orphan Form", href: "/scholarship/orphan-form", description: "Yetim formu" },
      { title: "Adres Etiketleri", href: "/scholarship/address-labels", description: "Adres etiketi yönetimi" }
    ]
  },
  {
    title: "Görev Yönetimi",
    icon: CheckSquare,
    badge: undefined,
    subPages: [
      { title: "Görevler", href: "/tasks", description: "Görev listesi ve yönetimi" }
    ]
  },
  {
    title: "Fon Yönetimi",
    icon: Building2,
    badge: undefined,
    subPages: [
      { title: "Fon Tanımları", href: "/fund/fund-definitions", description: "Fon kategori tanımları" },
      { title: "Çalışma Alanları", href: "/fund/work-areas", description: "Fon çalışma alanları" },
      { title: "Fon Hareketleri", href: "/fund/fund-movements", description: "Fon hareket kayıtları" },
      { title: "Fon Bölgeleri", href: "/fund/fund-regions", description: "Bölgesel fon dağılımı" },
      { title: "Yardım Kategorileri", href: "/fund/aid-categories", description: "Yardım kategori tanımları" },
      { title: "Kaynak & Giderler", href: "/fund/sources-expenses", description: "Gelir gider yönetimi" },
      { title: "Aktivite Tanımları", href: "/fund/activity-definitions", description: "Aktivite kategorileri" },
      { title: "Tam Rapor", href: "/fund/complete-report", description: "Detaylı fon raporu" }
    ]
  }
]

export const supportItems: NavigationItem[] = [
  {
    title: "Sistem Yönetimi",
    icon: Shield,
    badge: undefined,
    subPages: [
      { title: "Kullanıcı Yönetimi", href: "/system/user-management", description: "Kullanıcı hesapları" },
      { title: "IP Engelleme", href: "/system/ip-blocking", description: "Güvenlik ayarları" },
      { title: "Sistem Ayarları", href: "/system/settings", description: "Genel sistem ayarları" }
    ]
  },
  {
    title: "Tanımlamalar",
    icon: Database,
    badge: undefined,
    subPages: [
      { title: "Genel Tanımlar", href: "/definitions", description: "Sistem tanımlamaları" },
      { title: "Kullanıcı Hesapları", href: "/definitions/user-accounts", description: "Hesap tanımları" },
      { title: "Yetki Grupları", href: "/definitions/permission-groups", description: "Yetkilendirme" },
      { title: "Genel Ayarlar", href: "/definitions/general-settings", description: "Genel ayarlar" },
      { title: "Birimler", href: "/definitions/units", description: "Organizasyon birimleri" },
      { title: "Binalar", href: "/definitions/buildings", description: "Bina tanımları" },
      { title: "Ülke & Şehirler", href: "/definitions/countries-cities", description: "Lokasyon tanımları" },
      { title: "Bağış Yöntemleri", href: "/definitions/donation-methods", description: "Bağış türü tanımları" },
      { title: "Teslimat Türleri", href: "/definitions/delivery-types", description: "Teslimat seçenekleri" },
      { title: "GSM Kodları", href: "/definitions/gsm-codes", description: "Telefon kodu tanımları" },
      { title: "Pasaport Formatları", href: "/definitions/passport-formats", description: "Pasaport formatları" },
      { title: "Süreç Akışları", href: "/definitions/process-flows", description: "İş süreçleri" },
      { title: "Çeviriler", href: "/definitions/translations", description: "Dil çevirileri" }
    ]
  }
]

export const allNavigationItems = [...navigationItems, ...supportItems]

// Search için flatten edilmiş sayfa listesi
export const allPages = allNavigationItems.flatMap(item => 
  item.subPages.map(subPage => ({
    ...subPage,
    category: item.title,
    icon: item.icon
  }))
)
