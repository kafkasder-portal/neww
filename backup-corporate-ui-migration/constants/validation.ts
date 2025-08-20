// Validation related constants

export const VALIDATION_RULES = {
  // String lengths
  name: {
    min: 2,
    max: 50
  },
  surname: {
    min: 2,
    max: 50
  },
  email: {
    max: 100
  },
  phone: {
    min: 10,
    max: 15
  },
  address: {
    min: 10,
    max: 200
  },
  description: {
    max: 500
  },
  notes: {
    max: 1000
  },
  password: {
    min: 8,
    max: 50
  },
  
  // Numeric ranges
  age: {
    min: 0,
    max: 120
  },
  amount: {
    min: 0,
    max: 1000000
  },
  percentage: {
    min: 0,
    max: 100
  },
  
  // Identity numbers
  identityNo: {
    length: 11
  },
  
  // IBAN
  iban: {
    length: 26
  },
  
  // Postal code
  postalCode: {
    length: 5
  }
} as const;

export const VALIDATION_MESSAGES = {
  // Required fields
  required: 'Bu alan zorunludur',
  
  // String validations
  minLength: (min: number) => `En az ${min} karakter olmalıdır`,
  maxLength: (max: number) => `En fazla ${max} karakter olmalıdır`,
  
  // Number validations
  min: (min: number) => `En az ${min} olmalıdır`,
  max: (max: number) => `En fazla ${max} olmalıdır`,
  positive: 'Pozitif bir sayı olmalıdır',
  integer: 'Tam sayı olmalıdır',
  
  // Format validations
  email: 'Geçerli bir e-posta adresi giriniz',
  phone: 'Geçerli bir telefon numarası giriniz',
  url: 'Geçerli bir URL giriniz',
  date: 'Geçerli bir tarih giriniz',
  time: 'Geçerli bir saat giriniz',
  
  // Turkish specific validations
  identityNo: 'Geçerli bir TC kimlik numarası giriniz (11 haneli)',
  iban: 'Geçerli bir IBAN numarası giriniz',
  postalCode: 'Geçerli bir posta kodu giriniz (5 haneli)',
  
  // Password validations
  passwordWeak: 'Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, sayı içermelidir',
  passwordMismatch: 'Şifreler eşleşmiyor',
  
  // File validations
  fileSize: (maxSize: string) => `Dosya boyutu ${maxSize} MB'dan küçük olmalıdır`,
  fileType: (allowedTypes: string) => `Sadece ${allowedTypes} formatları desteklenmektedir`,
  
  // Custom validations
  unique: 'Bu değer zaten kullanılmaktadır',
  exists: 'Bu kayıt bulunamadı',
  futureDate: 'Gelecek bir tarih seçiniz',
  pastDate: 'Geçmiş bir tarih seçiniz',
  
  // Network errors
  networkError: 'Bağlantı hatası oluştu, lütfen tekrar deneyiniz',
  serverError: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyiniz',
  
  // Generic errors
  invalidData: 'Geçersiz veri formatı',
  processingError: 'İşlem sırasında hata oluştu'
} as const;

export const FIELD_LABELS = {
  // Personal information
  name: 'Ad',
  surname: 'Soyad',
  fullName: 'Ad Soyad',
  email: 'E-posta',
  phone: 'Telefon',
  mobile: 'Cep Telefonu',
  address: 'Adres',
  city: 'Şehir',
  district: 'İlçe',
  neighborhood: 'Mahalle',
  postalCode: 'Posta Kodu',
  country: 'Ülke',
  
  // Identity information
  identityNo: 'TC Kimlik No',
  passportNo: 'Pasaport No',
  birthDate: 'Doğum Tarihi',
  birthPlace: 'Doğum Yeri',
  nationality: 'Uyruk',
  gender: 'Cinsiyet',
  maritalStatus: 'Medeni Durum',
  
  // Contact information
  homePhone: 'Ev Telefonu',
  workPhone: 'İş Telefonu',
  fax: 'Faks',
  website: 'Web Sitesi',
  
  // Financial information
  amount: 'Tutar',
  currency: 'Para Birimi',
  iban: 'IBAN',
  bankName: 'Banka Adı',
  accountNo: 'Hesap No',
  
  // Application information
  applicationDate: 'Başvuru Tarihi',
  applicationNo: 'Başvuru No',
  status: 'Durum',
  priority: 'Öncelik',
  category: 'Kategori',
  type: 'Tür',
  
  // System fields
  createdAt: 'Oluşturulma Tarihi',
  updatedAt: 'Güncellenme Tarihi',
  createdBy: 'Oluşturan',
  updatedBy: 'Güncelleyen',
  
  // Common fields
  title: 'Başlık',
  description: 'Açıklama',
  notes: 'Notlar',
  active: 'Aktif',
  enabled: 'Etkin',
  visible: 'Görünür',
  
  // Authentication
  username: 'Kullanıcı Adı',
  password: 'Şifre',
  confirmPassword: 'Şifre Tekrar',
  currentPassword: 'Mevcut Şifre',
  newPassword: 'Yeni Şifre',
  
  // File upload
  file: 'Dosya',
  files: 'Dosyalar',
  image: 'Resim',
  document: 'Belge',
  
  // Date and time
  date: 'Tarih',
  time: 'Saat',
  startDate: 'Başlangıç Tarihi',
  endDate: 'Bitiş Tarihi',
  
  // Actions
  save: 'Kaydet',
  cancel: 'İptal',
  delete: 'Sil',
  edit: 'Düzenle',
  view: 'Görüntüle',
  add: 'Ekle',
  remove: 'Kaldır',
  search: 'Ara',
  filter: 'Filtrele',
  export: 'Dışa Aktar',
  import: 'İçe Aktar',
  print: 'Yazdır',
  download: 'İndir',
  upload: 'Yükle'
} as const;

export const PLACEHOLDER_TEXTS = {
  // Personal information
  name: 'Adınızı giriniz',
  surname: 'Soyadınızı giriniz',
  email: 'ornek@email.com',
  phone: '0555 123 45 67',
  address: 'Adresinizi giriniz',
  
  // Search and filter
  search: 'Arama yapınız...',
  searchBeneficiaries: 'İhtiyaç sahibi ara...',
  searchApplications: 'Başvuru ara...',
  filter: 'Filtrele...',
  
  // Amounts
  amount: '0,00',
  
  // Dates
  selectDate: 'Tarih seçiniz',
  selectTime: 'Saat seçiniz',
  
  // Dropdowns
  select: 'Seçiniz...',
  selectOption: 'Bir seçenek seçiniz',
  
  // Text areas
  description: 'Açıklama giriniz...',
  notes: 'Notlarınızı giriniz...',
  
  // Files
  selectFile: 'Dosya seçiniz',
  dragDropFile: 'Dosyayı buraya sürükleyin veya tıklayın'
} as const;

export const STATUS_OPTIONS = {
  // Application statuses
  application: {
    pending: { label: 'Beklemede', color: 'yellow' },
    approved: { label: 'Onaylandı', color: 'green' },
    rejected: { label: 'Reddedildi', color: 'red' },
    cancelled: { label: 'İptal Edildi', color: 'gray' }
  },
  
  // Payment statuses
  payment: {
    pending: { label: 'Beklemede', color: 'yellow' },
    processing: { label: 'İşleniyor', color: 'blue' },
    completed: { label: 'Tamamlandı', color: 'green' },
    failed: { label: 'Başarısız', color: 'red' },
    cancelled: { label: 'İptal Edildi', color: 'gray' }
  },
  
  // General statuses
  general: {
    active: { label: 'Aktif', color: 'green' },
    inactive: { label: 'Pasif', color: 'gray' },
    draft: { label: 'Taslak', color: 'yellow' },
    published: { label: 'Yayınlandı', color: 'green' }
  },
  
  // Priority levels
  priority: {
    low: { label: 'Düşük', color: 'gray' },
    medium: { label: 'Orta', color: 'yellow' },
    high: { label: 'Yüksek', color: 'orange' },
    urgent: { label: 'Acil', color: 'red' }
  }
} as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Erkek' },
  { value: 'female', label: 'Kadın' },
  { value: 'other', label: 'Diğer' }
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Bekar' },
  { value: 'married', label: 'Evli' },
  { value: 'divorced', label: 'Boşanmış' },
  { value: 'widowed', label: 'Dul' }
] as const;

export const EDUCATION_LEVELS = [
  { value: 'none', label: 'Okur-yazar değil' },
  { value: 'literate', label: 'Okur-yazar' },
  { value: 'primary', label: 'İlkokul' },
  { value: 'secondary', label: 'Ortaokul' },
  { value: 'high_school', label: 'Lise' },
  { value: 'university', label: 'Üniversite' },
  { value: 'graduate', label: 'Lisansüstü' }
] as const;