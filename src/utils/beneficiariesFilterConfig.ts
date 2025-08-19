import type { FilterField, FilterDependency, FilterGroup, FilterValidationRule } from './filterManager'
import type { SavedFiltersConfig } from './savedFiltersManager'
import type { SavedFilter } from '../components/AdvancedSearchModal'

// Beneficiaries için filter field'ları
export const createBeneficiariesFilterConfig = () => {
  const fields: FilterField[] = [
    {
      key: 'search',
      type: 'text',
      label: 'Genel Arama',
      placeholder: 'Yararlanıcı adı, telefon, adres...'
    },
    {
      key: 'name',
      type: 'text',
      label: 'Ad Soyad',
      placeholder: 'Yararlanıcı adı ara...'
    },
    {
      key: 'phone',
      type: 'text',
      label: 'Telefon',
      placeholder: 'Telefon numarası ara...'
    },
    {
      key: 'address',
      type: 'text',
      label: 'Adres',
      placeholder: 'Adres ara...'
    },
    {
      key: 'status',
      type: 'select',
      label: 'Durum',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Pasif' },
        { value: 'pending', label: 'Beklemede' }
      ]
    },
    {
      key: 'category',
      type: 'multiSelect',
      label: 'Kategori',
      options: [
        { value: 'family', label: 'Aile' },
        { value: 'individual', label: 'Birey' },
        { value: 'elderly', label: 'Yaşlı' },
        { value: 'disabled', label: 'Engelli' },
        { value: 'orphan', label: 'Yetim' }
      ]
    },
    {
      key: 'ageRange',
      type: 'numberRange',
      label: 'Yaş Aralığı'
    },
    {
      key: 'registrationDate',
      type: 'dateRange',
      label: 'Kayıt Tarihi'
    },
    {
      key: 'lastContactDate',
      type: 'dateRange',
      label: 'Son İletişim Tarihi'
    }
  ]

  const dependencies: FilterDependency[] = [
    {
      field: 'ageRange',
      dependsOn: 'category',
      condition: { operator: 'in', value: ['individual', 'elderly'] },
      action: 'show'
    }
  ]

  const groups: FilterGroup[] = [
    {
      id: 'basic',
      key: 'basic',
      label: 'Temel Bilgiler',
      fields: ['search', 'name', 'phone', 'address'],
      operator: 'AND'
    },
    {
      id: 'classification',
      key: 'classification',
      label: 'Sınıflandırma',
      fields: ['status', 'category', 'ageRange'],
      operator: 'AND'
    },
    {
      id: 'dates',
      key: 'dates',
      label: 'Tarihler',
      fields: ['registrationDate', 'lastContactDate'],
      operator: 'AND'
    }
  ]

  const validationRules: FilterValidationRule[] = [
    {
      field: 'ageRange',
      rules: {
        custom: (value: any) => {
          if (value?.min && value?.max && value.min > value.max) {
            return 'Minimum yaş maksimum yaştan büyük olamaz'
          }
          return null
        }
      }
    },
    {
      field: 'registrationDate',
      rules: {
        custom: (value: any) => {
          if (value?.from && value?.to && new Date(value.from) > new Date(value.to)) {
            return 'Başlangıç tarihi bitiş tarihinden önce olmalıdır'
          }
          return null
        }
      }
    }
  ]

  return { fields, dependencies, groups, validationRules }
}

// URL configuration
export const createBeneficiariesURLConfig = () => ({
  baseUrl: '/beneficiaries',
  paramPrefix: 'bf_',
  encodeValues: true,
  excludeEmpty: true,
  dateFormat: 'iso' as const
})

// Saved filters configuration
export function createBeneficiariesSavedFiltersConfig(): SavedFiltersConfig {
  return {
    storageKey: 'beneficiaries_saved_filters',
    maxSavedFilters: 10
  }
}

// Quick filter presets
export function getBeneficiariesQuickFilters(): SavedFilter[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'active_beneficiaries',
      name: 'Aktif Yararlanıcılar',
      description: 'Aktif durumda olan tüm yararlanıcılar',
      filters: { status: 'active' },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'recent_registrations',
      name: 'Son Kayıtlar',
      description: 'Son 30 gün içinde kayıt olan yararlanıcılar',
      filters: {
        registrationDate: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        }
      },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'families',
      name: 'Aileler',
      description: 'Aile kategorisindeki yararlanıcılar',
      filters: { category: ['family'] },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    },
    {
      id: 'elderly_disabled',
      name: 'Yaşlı ve Engelli',
      description: 'Yaşlı ve engelli kategorilerindeki yararlanıcılar',
      filters: { category: ['elderly', 'disabled'] },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now
    }
  ]
}