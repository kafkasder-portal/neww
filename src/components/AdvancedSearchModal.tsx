import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface SavedFilter {
    id: string
    name: string
    filters: Record<string, any>
}

interface AdvancedSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onSearch: (filters: Record<string, any>) => void
    savedFilters?: SavedFilter[]
    onSaveFilter?: (name: string, filters: Record<string, any>) => void
    onDeleteFilter?: (id: string) => void
    searchFields?: Array<{
        key: string
        label: string
        type: 'text' | 'select' | 'date' | 'number'
        options?: Array<{ value: string; label: string }>
    }>
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
    isOpen,
    onClose,
    onSearch,
    savedFilters = [],
    onSaveFilter,
    onDeleteFilter,
    searchFields = []
}) => {
    const [filters, setFilters] = useState<Record<string, any>>({})
    const [filterName, setFilterName] = useState('')

    if (!isOpen) return null

    const handleSearch = () => {
        onSearch(filters)
        onClose()
    }

    const handleSaveFilter = () => {
        if (filterName && onSaveFilter) {
            onSaveFilter(filterName, filters)
            setFilterName('')
        }
    }

    const handleLoadFilter = (savedFilter: SavedFilter) => {
        setFilters(savedFilter.filters)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Gelişmiş Arama</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    {searchFields.map((field) => (
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
                        </div>
                    ))}
                </div>

                {savedFilters.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Kayıtlı Filtreler</h3>
                        <div className="space-y-2">
                            {savedFilters.map((filter) => (
                                <div key={filter.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{filter.name}</span>
                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleLoadFilter(filter)}
                                        >
                                            Yükle
                                        </Button>
                                        {onDeleteFilter && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onDeleteFilter(filter.id)}
                                            >
                                                Sil
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {onSaveFilter && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Filtreyi Kaydet</h3>
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Filtre adı"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                            <Button onClick={handleSaveFilter} disabled={!filterName}>
                                Kaydet
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        İptal
                    </Button>
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4 mr-2" />
                        Ara
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AdvancedSearchModal
