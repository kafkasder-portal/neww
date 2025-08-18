import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { X, Search, Save, Trash2, Filter } from 'lucide-react'
import { FilterManager } from '../utils/filterManager'
import type { FilterDependency, FilterGroup, FilterValidationRule } from '../utils/filterManager'
import { URLFilterManager } from '../utils/urlFilterManager'
import { SavedFiltersManager } from '../utils/savedFiltersManager'
import { Button } from './ui/button'
import { debounce } from '../utils/debounce'

export type FilterState = Record<string, any>

export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'multiSelect' | 'numberRange'
  options?: { value: string; label: string }[]
  placeholder?: string
  defaultValue?: any
  visible?: boolean
  enabled?: boolean
  validation?: {
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    pattern?: string
  }
  dependencies?: string[]
  conditional?: {
    field: string
    value: any
    operator: 'equals' | 'not_equals' | 'contains'
  }
}

export interface SavedFilter {
  id: string
  name: string
  description?: string
  filters: Record<string, any>
  pageType: 'beneficiaries' | 'applications' | 'donations'
  isQuickFilter: boolean
  createdAt: string
  updatedAt: string
  usageCount: number
  lastUsed: string
}

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: Record<string, any>) => void
  fields: FilterField[]
  initialFilters?: Record<string, any>
  savedFilters?: SavedFilter[]
  quickFilters?: SavedFilter[]
  onSaveFilter?: (filter: Omit<SavedFilter, 'id' | 'createdAt'>) => void
  onDeleteFilter?: (filterId: string) => void
  onLoadFilter?: (filter: SavedFilter) => void
  title?: string
  pageType: 'beneficiaries' | 'applications' | 'donations'
  enableURLSync?: boolean
  enableExport?: boolean
  onExport?: (filters: Record<string, any>, format: 'csv' | 'excel' | 'pdf') => void
  dependencies?: FilterDependency[]
  groups?: FilterGroup[]
  validationRules?: FilterValidationRule[]
  urlConfig?: { baseUrl: string; paramPrefix?: string }
  savedFiltersConfig?: { storageKey: string; userId?: string }
}

export const AdvancedSearchModal = memo(function AdvancedSearchModal({
  isOpen,
  onClose,
  onApplyFilters,
  fields,
  initialFilters = {},
  savedFilters = [],
  quickFilters = [],
  onSaveFilter,
  onDeleteFilter,
  onLoadFilter,
  title = 'Gelişmiş Arama',
  pageType,
  enableURLSync = true,
  enableExport = false,
  onExport,
  dependencies = [],
  groups = [],
  validationRules = [],
  urlConfig,
  savedFiltersConfig
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters)
  const [saveFilterName, setSaveFilterName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'filters' | 'saved' | 'quick'>('filters')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize managers with memoization
  const filterManager = useMemo(() => 
    new FilterManager(fields, dependencies, groups, validationRules), 
    [fields, dependencies, groups, validationRules]
  )
  const urlManager = useMemo(() => 
    urlConfig ? new URLFilterManager(urlConfig) : null, 
    [urlConfig]
  )
  const savedFiltersManager = useMemo(() => 
    savedFiltersConfig ? new SavedFiltersManager(savedFiltersConfig) : null, 
    [savedFiltersConfig]
  )

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters)
    }
  }, [isOpen, initialFilters])

  // URL sync effect
  useEffect(() => {
    if (enableURLSync && isOpen && urlManager) {
      // Load filters from URL on mount
      const urlFilters = urlManager.getCurrentFilters()
      const { errors } = filterManager.validateFilters(urlFilters)
      
      if (Object.keys(errors).length > 0) {
        setFilters(prev => ({ ...prev, ...urlFilters }))
      }
    }
  }, [isOpen, enableURLSync, urlManager, filterManager, fields])

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    if (!enableURLSync || !urlManager) return
    
    const cleanup = urlManager.onURLChange((urlFilters) => {
      const { errors } = filterManager.validateFilters(urlFilters)
      if (Object.keys(errors).length === 0) {
        setFilters(urlFilters)
        setValidationErrors({})
      }
    })
    
    return cleanup
  }, [enableURLSync, urlManager, filterManager, fields])

  // Validation function
  const validateFilters = useCallback((filtersToValidate: Record<string, any>) => {
    const { errors } = filterManager.validateFilters(filtersToValidate)
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [filterManager])

  // Update URL with filters - debounced for performance
  const updateURL = useMemo(() => 
    debounce((newFilters: Record<string, any>) => {
      if (!enableURLSync || !urlManager) return
      urlManager.updateBrowserURL(newFilters, true)
    }, 300), 
    [enableURLSync, urlManager]
  )

  const handleFilterChange = useCallback((key: string, value: any) => {
    // Apply filter change with dependency handling
    const newFilters = filterManager.applyFilterChange(filters, key, value)
    setFilters(newFilters)
    
    // Clear validation errors for this field and any cleared dependent fields
    const clearedFields = Object.keys(filters).filter(k => !(k in newFilters))
    if (validationErrors[key] || clearedFields.some(f => validationErrors[f])) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        clearedFields.forEach(field => delete newErrors[field])
        return newErrors
      })
    }
    
    updateURL(newFilters)
  }, [filterManager, filters, validationErrors, updateURL])

  const handleApplyFilters = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (validateFilters(filters)) {
        await onApplyFilters(filters)
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Filtreler uygulanırken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [filters, onApplyFilters, onClose, validateFilters])

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {}
    setFilters(clearedFilters)
    setValidationErrors({})
    updateURL(clearedFilters)
  }, [updateURL])

  const handleSaveFilter = useCallback(async (isQuickFilter = false) => {
    if (saveFilterName.trim() && onSaveFilter && validateFilters(filters)) {
      try {
        setIsLoading(true)
        setError(null)
        
        if (savedFiltersManager) {
          const newSavedFilter: SavedFilter = {
            id: Date.now().toString(),
            name: saveFilterName.trim(),
            filters,
            createdAt: new Date().toISOString(),
            pageType,
            isQuickFilter,
            updatedAt: new Date().toISOString(),
            usageCount: 0,
            lastUsed: new Date().toISOString()
          }
          
          // Save using SavedFiltersManager
          await savedFiltersManager.saveFilter(newSavedFilter)
        }
        
        onSaveFilter({
          name: saveFilterName.trim(),
          description: '',
          filters,
          pageType,
          isQuickFilter: isQuickFilter || false,
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          lastUsed: new Date().toISOString()
        })
        setSaveFilterName('')
        setShowSaveForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Filtre kaydedilirken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }
  }, [saveFilterName, onSaveFilter, validateFilters, filters, savedFiltersManager, pageType])

  const handleLoadFilter = (savedFilter: SavedFilter) => {
    // Load filter using SavedFiltersManager
    if (savedFiltersManager) {
      savedFiltersManager.loadSavedFilter(savedFilter.id)
    }
    
    setFilters(savedFilter.filters)
    setValidationErrors({})
    updateURL(savedFilter.filters)
    
    if (onLoadFilter) {
      onLoadFilter(savedFilter)
    }
    
    setActiveTab('filters')
  }

  const renderField = (field: FilterField) => {
    const value = filters[field.key] || (field.type === 'multiSelect' ? [] : field.type === 'dateRange' || field.type === 'numberRange' ? {} : '')
    const error = validationErrors[field.key]
    const hasError = !!error
    
    // Check if field should be visible and enabled
    const visibleFields = filterManager.getVisibleFields(filters)
    const enabledFields = filterManager.getEnabledFields(filters)
    const isVisible = visibleFields.some(f => f.key === field.key)
    const isEnabled = enabledFields.includes(field.key)
    
    if (!isVisible) {
      return null
    }
    
    const isConditionallyHidden = field.conditional && 
      filters[field.conditional.field] !== field.conditional.value

    if (isConditionallyHidden) return null

    const baseClassName = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div className="space-y-1">
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder || field.label}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(field.key, e.target.value)}
              disabled={!isEnabled}
              className={`${baseClassName} ${!isEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min={field.validation?.min}
              max={field.validation?.max}
              pattern={field.validation?.pattern}
            />
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-1">
            <select
              value={value}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(field.key, e.target.value)}
              disabled={!isEnabled}
              className={`${baseClassName} ${!isEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Tümü</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      case 'multiSelect':
        return (
          <div className="space-y-1">
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const currentValues = Array.isArray(value) ? value : []
                      if (e.target.checked) {
                        handleFilterChange(field.key, [...currentValues, option.value])
                      } else {
                        handleFilterChange(field.key, currentValues.filter(v => v !== option.value))
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      case 'numberRange':
        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFilterChange(field.key, { ...value, min: e.target.value })
                }
                className={baseClassName}
                min={field.validation?.min}
                max={field.validation?.max}
              />
              <input
                type="number"
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFilterChange(field.key, { ...value, max: e.target.value })
                }
                className={baseClassName}
                min={field.validation?.min}
                max={field.validation?.max}
              />
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      case 'dateRange':
        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                type="date"
                value={value?.start || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFilterChange(field.key, { ...value, start: e.target.value })
                }
                className={`flex-1 ${baseClassName}`}
                placeholder="Başlangıç"
                min={field.validation?.min}
                max={field.validation?.max}
              />
              <input
                type="date"
                value={value?.end || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFilterChange(field.key, { ...value, end: e.target.value })
                }
                className={`flex-1 ${baseClassName}`}
                placeholder="Bitiş"
                min={field.validation?.min}
                max={field.validation?.max}
              />
            </div>
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div className="space-y-1">
            <input
              type="date"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(field.key, e.target.value)}
              className={baseClassName}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {hasError && (
              <p className="text-sm text-red-500">{hasError}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div data-testid="advanced-search-modal" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {pageType && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {pageType}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {enableExport && onExport && (
              <button
                onClick={() => onExport(filters, 'csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-1"
              >
                <span>Dışa Aktar</span>
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('filters')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'filters'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Filtreler
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'saved'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Kayıtlı Filtreler ({savedFilters.length})
          </button>
          {quickFilters && quickFilters.length > 0 && (
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'quick'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Hızlı Filtreler
            </button>
          )}
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Tab Content */}
          {activeTab === 'filters' && (
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Validation Errors Summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Lütfen aşağıdaki hataları düzeltin:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {Object.entries(validationErrors).map(([key, error]) => (
                      <li key={key}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-6">
                {filterManager.getGroupedFields(filters).filter(item => item.group).map(item => (
                  <div key={(item.group as FilterGroup).id} className="space-y-4">
                    {(item.group as FilterGroup).label && (
                      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                        {(item.group as FilterGroup).label}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.label}
                            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Ungrouped fields */}
                {(() => {
                  const groupedFieldKeys = filterManager.getGroupedFields(filters).flatMap(g => g.fields.map(f => f.key))
                  const ungroupedFields = fields.filter(f => !groupedFieldKeys.includes(f.key))
                  return ungroupedFields.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ungroupedFields.map((field) => (
                          <div key={field.key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              {field.label}
                              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>

              {/* Save Filter Section */}
              {onSaveFilter && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {!showSaveForm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveForm(true)}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Filtreyi Kaydet
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        placeholder="Filtre adı"
                        value={saveFilterName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveFilterName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            handleSaveFilter()
                          }
                        }}
                      />
                      <Button onClick={() => handleSaveFilter()} disabled={!saveFilterName.trim()}>
                        Kaydet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSaveForm(false)
                          setSaveFilterName('')
                        }}
                      >
                        İptal
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kayıtlı Filtreler</h3>
                  <div className="flex items-center space-x-2">
                    {savedFiltersManager && (
                      <>
                        <button
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = '.json'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file && savedFiltersManager) {
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                  try {
                                    const data = JSON.parse(e.target?.result as string)
                                    savedFiltersManager.importSavedFilters(data)
                                  } catch (error) {
                                    console.error('Import failed:', error)
                                  }
                                }
                                reader.readAsText(file)
                              }
                            }
                            input.click()
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          İçe Aktar
                        </button>
                        <button
                          onClick={() => {
                            const data = savedFiltersManager.exportSavedFilters()
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `saved-filters-${pageType}-${new Date().toISOString().split('T')[0]}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Dışa Aktar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        if (savedFiltersManager) {
                          savedFiltersManager.clearAllSavedFilters()
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Tümünü Temizle
                    </button>
                  </div>
                </div>
                
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleLoadFilter(filter)}>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {filter.name}
                          </h4>
                          {filter.isQuickFilter && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                              Hızlı
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                          <span>Oluşturulma: {new Date(filter.createdAt).toLocaleDateString('tr-TR')}</span>
                          {filter.lastUsed && (
                            <span>Son kullanım: {new Date(filter.lastUsed).toLocaleDateString('tr-TR')}</span>
                          )}
                          {filter.usageCount && (
                            <span>Kullanım: {filter.usageCount}</span>
                          )}
                        </div>
                      </div>
                      {onDeleteFilter && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteFilter(filter.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {savedFilters.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Henüz kayıtlı filtre yok
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Filtrelerinizi kaydetmek için önce filtre oluşturun
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'quick' && quickFilters && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hızlı Filtreler</h3>
                  {savedFiltersManager && (
                    <button
                      onClick={() => {
                        // Create quick filter from current filters
                        if (Object.keys(filters).length > 0) {
                          const quickFilterName = prompt('Hızlı filtre adı:')
                          if (quickFilterName) {
                            setSaveFilterName(quickFilterName)
                            handleSaveFilter(true) // Save as quick filter
                          }
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Mevcut Filtreyi Hızlı Filtre Yap
                    </button>
                  )}
                </div>
                
                {quickFilters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickFilters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          handleLoadFilter(filter)
                          
                          // Track usage if savedFiltersManager is available
                          if (savedFiltersManager && filter.id) {
                            savedFiltersManager.loadSavedFilter(filter.id)
                          }
                        }}
                        className="p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {filter.name}
                          </h4>
                          {filter.usageCount && filter.usageCount > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-800 dark:text-blue-200">
                              {filter.usageCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{Object.keys(filter.filters).length} filtre</span>
                          {filter.lastUsed && (
                            <span>Son: {new Date(filter.lastUsed).toLocaleDateString('tr-TR')}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="mb-4">Hızlı filtre bulunamadı</p>
                    <p className="text-sm">Sık kullanılan filtrelerinizi hızlı erişim için kaydedin</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtreleri Temizle
          </Button>
          <div className="flex items-center gap-2">
            <Button data-testid="close-modal" variant="outline" onClick={onClose} disabled={isLoading}>
              İptal
            </Button>
            <Button data-testid="apply-filters" onClick={handleApplyFilters} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isLoading ? 'Filtreleniyor...' : 'Filtrele'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})
