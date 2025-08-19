import type { FilterField, SavedFilter } from '../components/AdvancedSearchModal'
import type { FilterDependency, FilterGroup, FilterValidationRule } from '../utils/filterManager'

// Import types from other config files
export interface URLConfig {
  baseUrl: string
  paramPrefix: string
  excludeFromUrl: string[]
  arrayDelimiter: string
}

export interface SavedFiltersConfig {
  storageKey: string
  maxSavedFilters: number
  defaultFilters: any[]
}

// Filter field definitions for donations
export const donationsFilterFields: FilterField[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Genel Arama',
    placeholder: 'Bağışçı adı, e-posta veya işlem no ile ara...'
  },
  {
    key: 'donorName',
    type: 'text',
    label: 'Bağışçı Adı',
    placeholder: 'Bağışçı adını girin'
  },
  {
    key: 'donorEmail',
    type: 'text',
    label: 'E-posta',
    placeholder: 'E-posta adresini girin'
  },
  {
    key: 'status',
    type: 'multiSelect',
    label: 'Durum',
    options: [
      { value: 'başarılı', label: 'Başarılı' },
      { value: 'beklemede', label: 'Beklemede' },
      { value: 'başarısız', label: 'Başarısız' },
      { value: 'iptal', label: 'İptal' },
      { value: 'iade', label: 'İade' }
    ]
  },
  {
    key: 'platform',
    type: 'multiSelect',
    label: 'Platform',
    options: [
      { value: 'Web Sitesi', label: 'Web Sitesi' },
      { value: 'Mobil Uygulama', label: 'Mobil Uygulama' },
      { value: 'Facebook', label: 'Facebook' },
      { value: 'Instagram', label: 'Instagram' },
      { value: 'WhatsApp', label: 'WhatsApp' },
      { value: 'SMS', label: 'SMS' }
    ]
  },
  {
    key: 'paymentMethod',
    type: 'multiSelect',
    label: 'Ödeme Yöntemi',
    options: [
      { value: 'Kredi Kartı', label: 'Kredi Kartı' },
      { value: 'Banka Kartı', label: 'Banka Kartı' },
      { value: 'Havale/EFT', label: 'Havale/EFT' },
      { value: 'Mobil Ödeme', label: 'Mobil Ödeme' },
      { value: 'Dijital Cüzdan', label: 'Dijital Cüzdan' }
    ]
  },
  {
    key: 'amountRange',
    type: 'numberRange',
    label: 'Tutar Aralığı',
    placeholder: 'Min - Max tutar'
  },
  {
    key: 'currency',
    type: 'multiSelect',
    label: 'Para Birimi',
    options: [
      { value: 'TRY', label: 'TRY' },
      { value: 'USD', label: 'USD' },
      { value: 'EUR', label: 'EUR' }
    ]
  },
  {
    key: 'purpose',
    type: 'multiSelect',
    label: 'Bağış Amacı',
    options: [
      { value: 'Genel Bağış', label: 'Genel Bağış' },
      { value: 'Eğitim Yardımı', label: 'Eğitim Yardımı' },
      { value: 'Sağlık Yardımı', label: 'Sağlık Yardımı' },
      { value: 'Gıda Yardımı', label: 'Gıda Yardımı' },
      { value: 'Kurban', label: 'Kurban' },
      { value: 'Ramazan', label: 'Ramazan' },
      { value: 'Diğer', label: 'Diğer' }
    ]
  },
  {
    key: 'isRecurring',
    type: 'select',
    label: 'Bağış Tipi',
    options: [
      { value: 'true', label: 'Düzenli Bağışlar' },
      { value: 'false', label: 'Tek Seferlik Bağışlar' }
    ]
  },
  {
    key: 'recurringPeriod',
    type: 'multiSelect',
    label: 'Düzenli Bağış Periyodu',
    options: [
      { value: 'Aylık', label: 'Aylık' },
      { value: 'Üç Aylık', label: 'Üç Aylık' },
      { value: 'Altı Aylık', label: 'Altı Aylık' },
      { value: 'Yıllık', label: 'Yıllık' }
    ]
  },
  {
    key: 'referralSource',
    type: 'multiSelect',
    label: 'Yönlendirme Kaynağı',
    options: [
      { value: 'Organik Arama', label: 'Organik Arama' },
      { value: 'Google Ads', label: 'Google Ads' },
      { value: 'Facebook Ads', label: 'Facebook Ads' },
      { value: 'E-posta Kampanyası', label: 'E-posta Kampanyası' },
      { value: 'SMS Kampanyası', label: 'SMS Kampanyası' },
      { value: 'Sosyal Medya', label: 'Sosyal Medya' },
      { value: 'Arkadaş Tavsiyesi', label: 'Arkadaş Tavsiyesi' },
      { value: 'Diğer', label: 'Diğer' }
    ]
  },
  {
    key: 'campaign',
    type: 'text',
    label: 'Kampanya',
    placeholder: 'Kampanya adını girin'
  },
  {
    key: 'dateRange',
    type: 'dateRange',
    label: 'Bağış Tarihi',
    placeholder: 'Tarih aralığı seçin'
  },
  {
    key: 'transactionId',
    type: 'text',
    label: 'İşlem No',
    placeholder: 'İşlem numarasını girin'
  }
]

// Filter groups for better organization
export const donationsFilterGroups: FilterGroup[] = [
  {
    id: 'basic',
    key: 'basic',
    label: 'Temel Filtreler',
    fields: ['search', 'donorName', 'donorEmail', 'status'],
    operator: 'AND'
  },
  {
    id: 'platform',
    key: 'platform',
    label: 'Platform ve Ödeme',
    fields: ['platform', 'paymentMethod', 'currency'],
    operator: 'AND'
  },
  {
    id: 'amount',
    key: 'amount',
    label: 'Tutar ve Amaç',
    fields: ['amountRange', 'purpose'],
    operator: 'AND'
  },
  {
    id: 'recurring',
    key: 'recurring',
    label: 'Düzenli Bağışlar',
    fields: ['isRecurring', 'recurringPeriod'],
    operator: 'AND'
  },
  {
    id: 'marketing',
    key: 'marketing',
    label: 'Pazarlama ve Kampanya',
    fields: ['referralSource', 'campaign'],
    operator: 'AND'
  },
  {
    id: 'date',
    key: 'date',
    label: 'Tarih ve İşlem',
    fields: ['dateRange', 'transactionId'],
    operator: 'AND'
  }
]

// Filter dependencies
export const donationsFilterDependencies: FilterDependency[] = [
  {
    field: 'recurringPeriod',
    dependsOn: 'isRecurring',
    condition: { operator: 'equals', value: 'true' },
    action: 'show'
  }
]

// Validation rules
export const donationsValidationRules: FilterValidationRule[] = [
  {
    field: 'amountRange',
    rules: {
      custom: (value: any) => {
        if (value && value.min && value.max && value.min > value.max) {
          return 'Minimum tutar maksimum tutardan büyük olamaz'
        }
        return null
      }
    }
  },
  {
    field: 'dateRange',
    rules: {
      custom: (value: any) => {
        if (value && value.start && value.end && new Date(value.start) > new Date(value.end)) {
          return 'Başlangıç tarihi bitiş tarihinden sonra olamaz'
        }
        return null
      }
    }
  }
]

// Create filter configuration
export function createDonationsFilterConfig() {
  return {
    fields: donationsFilterFields,
    groups: donationsFilterGroups,
    dependencies: donationsFilterDependencies,
    validationRules: donationsValidationRules
  }
}

// URL configuration for donations
export function createDonationsURLConfig(): URLConfig {
  return {
    baseUrl: '/donations/online',
    paramPrefix: 'f_',
    excludeFromUrl: ['search'],
    arrayDelimiter: ','
  }
}

// Saved filters configuration
export function createDonationsSavedFiltersConfig(): SavedFiltersConfig {
  return {
    storageKey: 'donations_saved_filters',
    maxSavedFilters: 10,
    defaultFilters: []
  }
}

// Quick filter presets
export function getDonationsQuickFilters(): SavedFilter[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'successful',
      name: 'Başarılı Bağışlar',
      filters: {
        status: ['başarılı']
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'pending',
      name: 'Bekleyen Bağışlar',
      filters: {
        status: ['beklemede']
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'recurring',
      name: 'Düzenli Bağışlar',
      filters: {
        isRecurring: 'true'
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'high_amount',
      name: 'Yüksek Tutarlı Bağışlar',
      filters: {
        amountRange: { min: 1000 }
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'this_month',
      name: 'Bu Ay',
      filters: {
        dateRange: {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'credit_card',
      name: 'Kredi Kartı Bağışları',
      filters: {
        paymentMethod: ['Kredi Kartı']
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'mobile_donations',
      name: 'Mobil Bağışlar',
      filters: {
        platform: ['Mobil Uygulama']
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'social_media',
      name: 'Sosyal Medya Bağışları',
      filters: {
        referralSource: ['Facebook Ads', 'Sosyal Medya']
      },
      pageType: 'donations',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    }
  ]
}