import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export interface SavedFilter {
    id: string
    name: string
    filters: Record<string, any>
    description?: string
    pageType?: string
    createdAt?: string
    updatedAt?: string
    lastUsed?: string
    usageCount?: number
    isQuickFilter?: boolean
}

interface AdvancedSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onSearch?: (filters: Record<string, any>) => void
    onApplyFilters?: (filters: Record<string, any>) => void
    savedFilters?: SavedFilter[]
    onSaveFilter?: (name: string, filters: Record<string, any>) => void
    onLoadFilter?: (filter: SavedFilter) => void
    onDeleteFilter?: (id: string) => void
    searchFields?: Array<{
        key: string
        label: string
        type: 'text' | 'select' | 'date' | 'number'
        options?: Array<{ value: string; label: string }>
    }>
    fields?: Array<{
        key: string
        label: string
        type: 'text' | 'select' | 'date' | 'number' | 'multiSelect' | 'dateRange' | 'range' | 'boolean' | 'numberRange'
        options?: Array<{ value: string; label: string }>
        group?: string
        dependsOn?: string
        condition?: (filters: Record<string, any>) => boolean
    }>
    pageType?: string
    urlConfig?: any
    savedFiltersConfig?: {
        storageKey: string
        maxSavedFilters: number
    }
    quickFilters?: Array<{
        id: string
        name: string
        filters: Record<string, any>
        description?: string
    }>
    initialFilters?: Record<string, any>
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
    isOpen,
    onClose,
    onSearch,
    onApplyFilters,
    savedFilters = [],
    onSaveFilter,
    onLoadFilter,
    onDeleteFilter,
    searchFields = [],
    fields = [],
    savedFiltersConfig,
    quickFilters = [],
    initialFilters = {}
}) => {
    const [filters, setFilters] = useState<Record<string, any>>(initialFilters)
    const [filterName, setFilterName] = useState('')

    const maxSavedFilters = savedFiltersConfig?.maxSavedFilters || 10

    if (!isOpen) return null

    const handleSearch = () => {
        if (onApplyFilters) {
            onApplyFilters(filters)
        } else if (onSearch) {
            onSearch(filters)
        }
        onClose()
    }

    const handleSaveFilter = () => {
        if (filterName && onSaveFilter) {
            // Check if we've reached the maximum number of saved filters
            if (savedFilters.length >= maxSavedFilters) {
                // Remove the oldest filter to make room for the new one
                const oldestFilter = savedFilters[0]
                if (onDeleteFilter && oldestFilter) {
                    onDeleteFilter(oldestFilter.id)
                }
            }

            onSaveFilter(filterName, filters)
            setFilterName('')
        }
    }

    const handleLoadFilter = (savedFilter: SavedFilter) => {
        setFilters(savedFilter.filters)
        if (onLoadFilter) {
            onLoadFilter(savedFilter)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="corporate-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Gelişmiş Arama</h2>
                    <CorporateButton
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </CorporateButton>
                </div>

                {quickFilters.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Hızlı Filtreler</h3>
                        <div className="flex flex-wrap gap-2">
                            {quickFilters.map((quickFilter) => (
                                <CorporateButton
                                    key={quickFilter.id}
                                    variant="neutral"
                                    size="sm"
                                    onClick={() => {
                                        setFilters(quickFilter.filters)
                                        if (onApplyFilters) {
                                            onApplyFilters(quickFilter.filters)
                                        } else if (onSearch) {
                                            onSearch(quickFilter.filters)
                                        }
                                        onClose()
                                    }}
                                    title={quickFilter.description}
                                >
                                    {quickFilter.name}
                                </CorporateButton>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {(fields.length > 0 ? fields : searchFields).map((field) => (
                        <div key={field.key}>
                            <Label htmlFor={field.key}>{field.label}</Label>
                            {field.type === 'text' && (
                                <Input
                                    id={field.key}
                                    value={filters[field.key] || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    placeholder={`${field.label} ara...`}
                                />
                            )}
                            {field.type === 'select' && field.options && (
                                <Select
                                    value={filters[field.key] || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, [field.key]: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`${field.label} seçin...`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {field.type === 'multiSelect' && field.options && (
                                <div className="corporate-form-group">
                                    {field.options.map((option) => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`${field.key}-${option.value}`}
                                                checked={Array.isArray(filters[field.key]) && filters[field.key].includes(option.value)}
                                                onChange={(e) => {
                                                    const currentValues = Array.isArray(filters[field.key]) ? filters[field.key] : []
                                                    const newValues = e.target.checked
                                                        ? [...currentValues, option.value]
                                                        : currentValues.filter((v: string) => v !== option.value)
                                                    setFilters(prev => ({ ...prev, [field.key]: newValues }))
                                                }}
                                            />
                                            <Label htmlFor={`${field.key}-${option.value}`}>{option.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {field.type === 'dateRange' && (
                                <div className="flex space-x-2">
                                    <Input
                                        type="date"
                                        placeholder="Başlangıç"
                                        value={filters[field.key]?.start || ''}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            [field.key]: {
                                                ...prev[field.key],
                                                start: e.target.value
                                            }
                                        }))}
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Bitiş"
                                        value={filters[field.key]?.end || ''}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            [field.key]: {
                                                ...prev[field.key],
                                                end: e.target.value
                                            }
                                        }))}
                                    />
                                </div>
                            )}
                            {field.type === 'date' && (
                                <Input
                                    id={field.key}
                                    type="date"
                                    value={filters[field.key] || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                />
                            )}
                            {field.type === 'number' && (
                                <Input
                                    id={field.key}
                                    type="number"
                                    value={filters[field.key] || ''}
                                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    placeholder={`${field.label} girin...`}
                                />
                            )}
                            {field.type === 'boolean' && (
                                <Select
                                    value={filters[field.key] || ''}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, [field.key]: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`${field.label} seçin...`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Evet</SelectItem>
                                        <SelectItem value="false">Hayır</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            {field.type === 'numberRange' && (
                                <div className="flex space-x-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters[field.key]?.min || ''}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            [field.key]: {
                                                ...prev[field.key],
                                                min: e.target.value
                                            }
                                        }))}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters[field.key]?.max || ''}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            [field.key]: {
                                                ...prev[field.key],
                                                max: e.target.value
                                            }
                                        }))}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {savedFilters.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Kayıtlı Filtreler</h3>
                        <div className="corporate-form-group">
                            {savedFilters.map((filter) => (
                                <div key={filter.id} className="flex items-center justify-between p-2 corporate-table-header rounded">
                                    <span className="text-sm">{filter.name}</span>
                                    <div className="space-x-2">
                                        <CorporateButton
                                            size="sm"
                                            variant="neutral"
                                            onClick={() => handleLoadFilter(filter)}
                                        >
                                            Yükle
                                        </CorporateButton>
                                        {onDeleteFilter && (
                                            <CorporateButton
                                                size="sm"
                                                variant="danger"
                                                onClick={() => onDeleteFilter(filter.id)}
                                            >
                                                Sil
                                            </CorporateButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {onSaveFilter && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">
                            Filtreyi Kaydet
                            {savedFilters.length >= maxSavedFilters && (
                                <span className="text-xs text-orange-600 ml-2">
                                    (Maksimum {maxSavedFilters} filtre)
                                </span>
                            )}
                        </h3>
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Filtre adı"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                            <CorporateButton
                                onClick={handleSaveFilter}
                                disabled={!filterName}
                                title={savedFilters.length >= maxSavedFilters ?
                                    `Maksimum ${maxSavedFilters} filtreye ulaştınız. En eski filtre otomatik olarak silinecek.` :
                                    undefined
                                }
                            >
                                Kaydet
                            </CorporateButton>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                    <CorporateButton variant="neutral" onClick={onClose}>
                        İptal
                    </CorporateButton>
                    <CorporateButton onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Ara
                    </CorporateButton>
                </div>
            </div>
        </div>
    )
}

export default AdvancedSearchModal
