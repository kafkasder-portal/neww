import type { FilterState, SavedFilter } from '../components/AdvancedSearchModal'

export interface SavedFiltersConfig {
  storageKey: string
  maxSavedFilters?: number
  enableCloud?: boolean
  userId?: string
}

export interface QuickFilterPreset {
  id: string
  name: string
  description?: string
  icon?: string
  filters: FilterState
  pageType: 'beneficiaries' | 'applications' | 'donations'
  isDefault?: boolean
  order?: number
}

export class SavedFiltersManager {
  private config: SavedFiltersConfig
  private storageKey: string

  constructor(config: SavedFiltersConfig) {
    this.config = {
      maxSavedFilters: 50,
      enableCloud: false,
      ...config
    }
    this.storageKey = config.userId 
      ? `${config.storageKey}_${config.userId}`
      : config.storageKey
  }

  // Save a new filter
  async saveFilter(filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>): Promise<SavedFilter> {
    const savedFilters = await this.getSavedFilters()
    
    // Check if we've reached the maximum limit
    if (savedFilters.length >= (this.config.maxSavedFilters || 50)) {
      throw new Error(`Maksimum ${this.config.maxSavedFilters} adet filtre kaydedebilirsiniz`)
    }
    
    // Check for duplicate names
    if (savedFilters.some(f => f.name === filter.name && f.pageType === filter.pageType)) {
      throw new Error('Bu isimde bir filtre zaten mevcut')
    }

    const newFilter: SavedFilter = {
      ...filter,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      lastUsed: new Date().toISOString()
    }

    const updatedFilters = [...savedFilters, newFilter]
    await this.storeSavedFilters(updatedFilters)
    
    return newFilter
  }

  // Get all saved filters
  async getSavedFilters(pageType?: string): Promise<SavedFilter[]> {
    try {
      const stored = localStorage.getItem(this.storageKey)
      const filters: SavedFilter[] = stored ? JSON.parse(stored) : []
      
      // Filter by page type if specified
      if (pageType) {
        return filters.filter(filter => filter.pageType === pageType)
      }
      
      return filters
    } catch (error) {
      console.error('Error loading saved filters:', error)
      return []
    }
  }

  // Get a specific saved filter by ID
  async getSavedFilter(id: string): Promise<SavedFilter | null> {
    const filters = await this.getSavedFilters()
    return filters.find(filter => filter.id === id) || null
  }

  // Update an existing saved filter
  async updateSavedFilter(id: string, updates: Partial<SavedFilter>): Promise<SavedFilter | null> {
    const filters = await this.getSavedFilters()
    const filterIndex = filters.findIndex(filter => filter.id === id)
    
    if (filterIndex === -1) {
      throw new Error('Filtre bulunamadı')
    }
    
    // Check for duplicate names if name is being updated
    if (updates.name && updates.name !== filters[filterIndex].name) {
      const duplicateExists = filters.some((f, index) => 
        index !== filterIndex && 
        f.name === updates.name && 
        f.pageType === filters[filterIndex].pageType
      )
      
      if (duplicateExists) {
        throw new Error('Bu isimde bir filtre zaten mevcut')
      }
    }

    const updatedFilter: SavedFilter = {
      ...filters[filterIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    filters[filterIndex] = updatedFilter
    await this.storeSavedFilters(filters)
    
    return updatedFilter
  }

  // Delete a saved filter
  async deleteSavedFilter(id: string): Promise<boolean> {
    const filters = await this.getSavedFilters()
    const filteredFilters = filters.filter(filter => filter.id !== id)
    
    if (filteredFilters.length === filters.length) {
      return false // Filter not found
    }
    
    await this.storeSavedFilters(filteredFilters)
    return true
  }

  // Load and use a saved filter (increments usage count)
  async loadSavedFilter(id: string): Promise<SavedFilter | null> {
    const filter = await this.getSavedFilter(id)
    
    if (!filter) {
      return null
    }

    // Update usage statistics
    await this.updateSavedFilter(id, {
      usageCount: filter.usageCount + 1,
      lastUsed: new Date().toISOString()
    })

    return filter
  }

  // Get recently used filters
  async getRecentFilters(pageType?: string, limit: number = 5): Promise<SavedFilter[]> {
    const filters = await this.getSavedFilters(pageType)
    
    return filters
      .filter(filter => filter.usageCount > 0)
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, limit)
  }

  // Get most used filters
  async getPopularFilters(pageType?: string, limit: number = 5): Promise<SavedFilter[]> {
    const filters = await this.getSavedFilters(pageType)
    
    return filters
      .filter(filter => filter.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
  }

  // Search saved filters
  async searchSavedFilters(query: string, pageType?: string): Promise<SavedFilter[]> {
    const filters = await this.getSavedFilters(pageType)
    const lowercaseQuery = query.toLowerCase()
    
    return filters.filter(filter => 
      filter.name.toLowerCase().includes(lowercaseQuery) ||
      (filter.description && filter.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Export saved filters
  async exportSavedFilters(pageType?: string): Promise<string> {
    const filters = await this.getSavedFilters(pageType)
    return JSON.stringify(filters, null, 2)
  }

  // Import saved filters
  async importSavedFilters(jsonData: string, overwrite: boolean = false): Promise<number> {
    try {
      const importedFilters: SavedFilter[] = JSON.parse(jsonData)
      
      if (!Array.isArray(importedFilters)) {
        throw new Error('Geçersiz veri formatı')
      }

      const existingFilters = await this.getSavedFilters()
      let newFilters: SavedFilter[]
      
      if (overwrite) {
        newFilters = importedFilters.map(filter => ({
          ...filter,
          id: this.generateId(), // Generate new IDs
          createdAt: filter.createdAt,
          updatedAt: new Date().toISOString(),
          lastUsed: filter.lastUsed
        }))
      } else {
        // Merge with existing filters, avoiding duplicates
        const existingNames = new Set(
          existingFilters.map(f => `${f.name}_${f.pageType}`)
        )
        
        const uniqueImportedFilters = importedFilters.filter(filter => 
          !existingNames.has(`${filter.name}_${filter.pageType}`)
        )
        
        newFilters = [
          ...existingFilters,
          ...uniqueImportedFilters.map(filter => ({
            ...filter,
            id: this.generateId(),
            createdAt: filter.createdAt,
            updatedAt: new Date().toISOString(),
            lastUsed: filter.lastUsed
          }))
        ]
      }
      
      await this.storeSavedFilters(newFilters)
      return overwrite ? importedFilters.length : newFilters.length - existingFilters.length
    } catch (error) {
      throw new Error('Filtreler içe aktarılırken hata oluştu: ' + (error as Error).message)
    }
  }

  // Clear all saved filters
  async clearAllSavedFilters(pageType?: string): Promise<number> {
    if (pageType) {
      const allFilters = await this.getSavedFilters()
      const filteredFilters = allFilters.filter(filter => filter.pageType !== pageType)
      const removedCount = allFilters.length - filteredFilters.length
      
      await this.storeSavedFilters(filteredFilters)
      return removedCount
    } else {
      const filters = await this.getSavedFilters()
      const count = filters.length
      
      localStorage.removeItem(this.storageKey)
      return count
    }
  }

  // Get storage usage statistics
  async getStorageStats(): Promise<{
    totalFilters: number
    totalSize: number
    filtersByPage: Record<string, number>
    oldestFilter?: string
    newestFilter?: string
  }> {
    const filters = await this.getSavedFilters()
    const totalSize = JSON.stringify(filters).length
    
    const filtersByPage: Record<string, number> = {}
    let oldestFilter: string | undefined
    let newestFilter: string | undefined
    
    filters.forEach(filter => {
      filtersByPage[filter.pageType] = (filtersByPage[filter.pageType] || 0) + 1
      
      if (!oldestFilter || filter.createdAt < oldestFilter) {
        oldestFilter = filter.createdAt
      }
      
      if (!newestFilter || filter.createdAt > newestFilter) {
        newestFilter = filter.createdAt
      }
    })
    
    return {
      totalFilters: filters.length,
      totalSize,
      filtersByPage,
      oldestFilter,
      newestFilter
    }
  }

  // Private helper methods
  private async storeSavedFilters(filters: SavedFilter[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filters))
    } catch (error) {
      throw new Error('Filtreler kaydedilirken hata oluştu: ' + (error as Error).message)
    }
  }

  private generateId(): string {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Quick filter presets for different pages
export const getBeneficiariesQuickFilters = (): SavedFilter[] => [
  {
    id: 'active_beneficiaries',
    name: 'Aktif Yararlanıcılar',
    description: 'Aktif durumda olan tüm yararlanıcılar',
    filters: { status: 'active' },
    pageType: 'beneficiaries',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'high_priority',
    name: 'Yüksek Öncelik',
    description: 'Yüksek öncelikli yararlanıcılar',
    filters: { status: 'active', priority: 'high' },
    pageType: 'beneficiaries',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'education_category',
    name: 'Eğitim Kategorisi',
    description: 'Eğitim desteği alan yararlanıcılar',
    filters: { categories: ['education'] },
    pageType: 'beneficiaries',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'recent_registrations',
    name: 'Son Kayıtlar',
    description: 'Son 30 günde kayıt olan yararlanıcılar',
    filters: {
      registrationDate: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    },
    pageType: 'beneficiaries',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  }
]

export const getApplicationsQuickFilters = (): SavedFilter[] => [
  {
    id: 'pending_applications',
    name: 'Bekleyen Başvurular',
    description: 'İnceleme bekleyen başvurular',
    filters: { status: 'pending' },
    pageType: 'applications',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'urgent_applications',
    name: 'Acil Başvurular',
    description: 'Acil öncelikli başvurular',
    filters: { priority: 'urgent' },
    pageType: 'applications',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'approved_applications',
    name: 'Onaylanan Başvurular',
    description: 'Onaylanmış başvurular',
    filters: { status: 'approved' },
    pageType: 'applications',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'high_amount_applications',
    name: 'Yüksek Tutarlı Başvurular',
    description: '10.000 TL üzeri başvurular',
    filters: { amountRange: { min: 10000 } },
    pageType: 'applications',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  }
]

export const getDonationsQuickFilters = (): SavedFilter[] => [
  {
    id: 'recent_donations',
    name: 'Son Bağışlar',
    description: 'Son 7 günde alınan bağışlar',
    filters: {
      donationDate: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    },
    pageType: 'donations',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'monetary_donations',
    name: 'Parasal Bağışlar',
    description: 'Parasal bağışlar',
    filters: { donationType: 'monetary' },
    pageType: 'donations',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'large_donations',
    name: 'Büyük Bağışlar',
    description: '5.000 TL üzeri bağışlar',
    filters: { 
      donationType: 'monetary',
      amountRange: { min: 5000 }
    },
    pageType: 'donations',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  },
  {
    id: 'in_kind_donations',
    name: 'Ayni Bağışlar',
    description: 'Ayni bağışlar',
    filters: { donationType: 'in_kind' },
    pageType: 'donations',
    isQuickFilter: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
    lastUsed: new Date().toISOString()
  }
]

// React hook for saved filters management
export const useSavedFilters = (config: SavedFiltersConfig) => {
  const manager = new SavedFiltersManager(config)
  
  return {
    saveFilter: (filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>) => 
      manager.saveFilter(filter),
    getSavedFilters: (pageType?: string) => manager.getSavedFilters(pageType),
    getSavedFilter: (id: string) => manager.getSavedFilter(id),
    updateSavedFilter: (id: string, updates: Partial<SavedFilter>) => 
      manager.updateSavedFilter(id, updates),
    deleteSavedFilter: (id: string) => manager.deleteSavedFilter(id),
    loadSavedFilter: (id: string) => manager.loadSavedFilter(id),
    getRecentFilters: (pageType?: string, limit?: number) => 
      manager.getRecentFilters(pageType, limit),
    getPopularFilters: (pageType?: string, limit?: number) => 
      manager.getPopularFilters(pageType, limit),
    searchSavedFilters: (query: string, pageType?: string) => 
      manager.searchSavedFilters(query, pageType),
    exportSavedFilters: (pageType?: string) => manager.exportSavedFilters(pageType),
    importSavedFilters: (jsonData: string, overwrite?: boolean) => 
      manager.importSavedFilters(jsonData, overwrite),
    clearAllSavedFilters: (pageType?: string) => manager.clearAllSavedFilters(pageType),
    getStorageStats: () => manager.getStorageStats()
  }
}