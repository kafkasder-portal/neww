// Temporary fix for beneficiaries filter configuration
import type { SavedFilter } from '../components/AdvancedSearchModal'

export interface BeneficiaryFilter {
  id: string;
  label: string;
  value: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: { label: string; value: string }[];
}

export interface SavedFiltersConfig {
  storageKey: string;
  filters: BeneficiaryFilter[];
  quickFilters: BeneficiaryFilter[];
}

export function createBeneficiariesSavedFiltersConfig(): SavedFiltersConfig {
  return {
    storageKey: 'beneficiaries_saved_filters',
    filters: [
      {
        id: 'status',
        label: 'Durum',
        value: '',
        type: 'select',
        options: [
          { label: 'Aktif', value: 'active' },
          { label: 'Pasif', value: 'inactive' },
          { label: 'Beklemede', value: 'pending' }
        ]
      },
      {
        id: 'city',
        label: 'Şehir',
        value: '',
        type: 'select',
        options: [
          { label: 'İstanbul', value: 'istanbul' },
          { label: 'Ankara', value: 'ankara' },
          { label: 'İzmir', value: 'izmir' }
        ]
      },
      {
        id: 'age',
        label: 'Yaş',
        value: '',
        type: 'number'
      },
      {
        id: 'name',
        label: 'Ad Soyad',
        value: '',
        type: 'text'
      }
    ],
    quickFilters: [
      {
        id: 'active',
        label: 'Aktif Yararlanıcılar',
        value: 'active',
        type: 'select'
      },
      {
        id: 'pending',
        label: 'Bekleyen Başvurular',
        value: 'pending',
        type: 'select'
      }
    ]
  };
}

export function getBeneficiariesQuickFilters(): SavedFilter[] {
  return [
    {
      id: 'all',
      name: 'Tümü',
      filters: {},
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'active',
      name: 'Aktif',
      filters: { status: 'active' },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'inactive',
      name: 'Pasif',
      filters: { status: 'inactive' },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString()
    },
    {
      id: 'pending',
      name: 'Beklemede',
      filters: { status: 'pending' },
      pageType: 'beneficiaries',
      isQuickFilter: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString()
    }
  ];
}