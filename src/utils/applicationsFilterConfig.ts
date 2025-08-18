import type { FilterField, SavedFilter } from '../components/AdvancedSearchModal'
import type { FilterDependency, FilterGroup, FilterValidationRule } from '../utils/filterManager'
import type { URLConfig, SavedFiltersConfig } from './donationsFilterConfig'

export interface QuickFilterPreset {
  key: string
  name: string
  filters: Record<string, any>
}

// Applications için filter field'ları
export const createApplicationsFilterConfig = () => {
  const fields: FilterField[] = [
    {
      key: 'search',
      type: 'text',
      label: 'Genel Arama',
      placeholder: 'Başvuran adı, açıklama...'
    },
    {
      key: 'beneficiary_name',
      type: 'text',
      label: 'Başvuran Adı',
      placeholder: 'Ad veya soyad...'
    },
    {
      key: 'status',
      type: 'multiSelect',
      label: 'Durum',
      options: [
        { value: 'pending', label: 'Bekleyen' },
        { value: 'approved', label: 'Onaylanan' },
        { value: 'rejected', label: 'Reddedilen' },
        { value: 'completed', label: 'Tamamlanan' }
      ]
    },
    {
      key: 'priority',
      type: 'multiSelect',
      label: 'Öncelik',
      options: [
        { value: 'low', label: 'Düşük' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'Yüksek' },
        { value: 'urgent', label: 'Acil' }
      ]
    },
    {
      key: 'aid_type',
      type: 'multiSelect',
      label: 'Yardım Türü',
      options: [
        { value: 'cash', label: 'Nakdi Yardım' },
        { value: 'in_kind', label: 'Ayni Yardım' },
        { value: 'service', label: 'Hizmet Yardımı' },
        { value: 'medical', label: 'Sağlık Yardımı' }
      ]
    },
    {
      key: 'amount_range',
      type: 'numberRange',
      label: 'Tutar Aralığı (TL)',
      placeholder: 'Min - Max tutar'
    },
    {
      key: 'beneficiary_category',
      type: 'multiSelect',
      label: 'Yararlanıcı Kategorisi',
      options: [
        { value: 'Yetim Ailesi', label: 'Yetim Ailesi' },
        { value: 'Dul Kadın', label: 'Dul Kadın' },
        { value: 'Yaşlı', label: 'Yaşlı' },
        { value: 'Engelli', label: 'Engelli' },
        { value: 'Hasta', label: 'Hasta' },
        { value: 'Öğrenci', label: 'Öğrenci' },
        { value: 'Mülteci', label: 'Mülteci' },
        { value: 'Diğer', label: 'Diğer' }
      ]
    },
    {
      key: 'created_date_range',
      type: 'dateRange',
      label: 'Başvuru Tarihi',
      placeholder: 'Tarih aralığı seçin'
    },
    {
      key: 'evaluated_date_range',
      type: 'dateRange',
      label: 'Değerlendirme Tarihi',
      placeholder: 'Tarih aralığı seçin'
    },
    {
      key: 'evaluated_by',
      type: 'text',
      label: 'Değerlendiren',
      placeholder: 'Değerlendiren kişi...'
    },
    {
      key: 'has_evaluation_notes',
      type: 'select',
      label: 'Değerlendirme Notu',
      options: [
        { value: 'yes', label: 'Var' },
        { value: 'no', label: 'Yok' }
      ]
    }
  ]

  const groups: FilterGroup[] = [
    {
      id: 'general',
      key: 'general',
      label: 'Genel Arama',
      fields: ['search'],
      operator: 'AND'
    },
    {
      id: 'beneficiary',
      key: 'beneficiary',
      label: 'Yararlanıcı Bilgileri',
      fields: ['beneficiary_name', 'beneficiary_category'],
      operator: 'AND'
    },
    {
      id: 'status',
      key: 'status',
      label: 'Durum Bilgileri',
      fields: ['status', 'priority'],
      operator: 'AND'
    },
    {
      id: 'details',
      key: 'details',
      label: 'Başvuru Detayları',
      fields: ['aid_type', 'amount_range'],
      operator: 'AND'
    },
    {
      id: 'dates',
      key: 'dates',
      label: 'Tarih Aralıkları',
      fields: ['created_date_range', 'evaluated_date_range'],
      operator: 'AND'
    },
    {
      id: 'evaluation',
      key: 'evaluation',
      label: 'Değerlendirme',
      fields: ['evaluated_by', 'has_evaluation_notes'],
      operator: 'AND'
    }
  ]

  const dependencies: FilterDependency[] = [
    {
      field: 'amount_range',
      dependsOn: 'aid_type',
      condition: {
        operator: 'contains',
        value: 'cash'
      },
      action: 'show'
    },
    {
      field: 'evaluated_date_range',
      dependsOn: 'status',
      condition: {
        operator: 'in',
        value: ['approved', 'rejected']
      },
      action: 'show'
    },
    {
      field: 'evaluated_by',
      dependsOn: 'status',
      condition: {
        operator: 'in',
        value: ['approved', 'rejected']
      },
      action: 'show'
    },
    {
      field: 'has_evaluation_notes',
      dependsOn: 'status',
      condition: {
        operator: 'in',
        value: ['approved', 'rejected']
      },
      action: 'show'
    }
  ]

  const validationRules: FilterValidationRule[] = [
    {
      field: 'amount_range',
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
      field: 'created_date_range',
      rules: {
        custom: (value: any) => {
          if (value && value.start && value.end && new Date(value.start) > new Date(value.end)) {
            return 'Başlangıç tarihi bitiş tarihinden sonra olamaz'
          }
          return null
        }
      }
    },
    {
      field: 'evaluated_date_range',
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

  return {
    fields,
    groups,
    dependencies,
    validationRules
  }
}

export const applicationsURLConfig: URLConfig = {
  baseUrl: '/applications',
  paramPrefix: 'filter_',
  excludeFromUrl: ['quickFilter'],
  arrayDelimiter: ','
}

export const applicationsSavedFiltersConfig: SavedFiltersConfig = {
  storageKey: 'applications_saved_filters',
  maxSavedFilters: 50,
  defaultFilters: []
}

export function getApplicationsQuickFilters(): SavedFilter[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'pending_applications',
      name: 'Bekleyen Başvurular',
      description: 'İnceleme bekleyen başvurular',
      filters: {
        status: ['pending']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    },
    {
      id: 'urgent_applications',
      name: 'Acil Başvurular',
      description: 'Acil öncelikli başvurular',
      filters: {
        priority: ['urgent']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    },
    {
      id: 'cash_aid_applications',
      name: 'Nakit Yardım Başvuruları',
      description: 'Nakit yardım kategorisindeki başvurular',
      filters: {
        category: ['cash_aid']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    },
    {
      id: 'approved_applications',
      name: 'Onaylanan Başvurular',
      description: 'Onaylanmış başvurular',
      filters: {
        status: ['approved']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    },
    {
      id: 'high_priority_pending',
      name: 'Yüksek Öncelik Bekleyen',
      description: 'Yüksek öncelikli bekleyen başvurular',
      filters: {
        status: ['pending'],
        priority: ['high']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    },
    {
      id: 'medical_aid_applications',
      name: 'Sağlık Yardımı Başvuruları',
      description: 'Sağlık yardımı kategorisindeki başvurular',
      filters: {
        category: ['medical_aid']
      },
      pageType: 'applications',
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsed: now,
      isQuickFilter: true
    }
  ]
}