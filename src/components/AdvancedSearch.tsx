import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Filter, X, Users, Coins, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  id: string
  type: 'beneficiary' | 'application' | 'donation' | 'user'
  title: string
  subtitle: string
  url: string
  metadata?: any
}

interface SearchFilters {
  type: string[]
  dateRange: {
    from: string
    to: string
  }
  status: string[]
  region: string[]
}

const initialFilters: SearchFilters = {
  type: [],
  dateRange: { from: '', to: '' },
  status: [],
  region: []
}

export const AdvancedSearch = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        performSearch()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, filters])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const performSearch = useCallback(async () => {
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const searchResults: SearchResult[] = []
      
      // Search beneficiaries
      if (filters.type.length === 0 || filters.type.includes('beneficiary')) {
        const { data: beneficiaries } = await supabase
          .from('beneficiaries')
          .select('*')
          .or(`name.ilike.%${query}%,surname.ilike.%${query}%,identity_no.ilike.%${query}%,phone.ilike.%${query}%`)
          .limit(5)
        
        beneficiaries?.forEach((b: any) => {
          searchResults.push({
            id: b.id,
            type: 'beneficiary',
            title: `${b.name} ${b.surname}`,
            subtitle: `${b.category} - ${b.city || 'Şehir belirtilmemiş'}`,
            url: `/aid/beneficiaries/${b.id}`,
            metadata: b
          })
        })
      }

      // Search applications
      if (filters.type.length === 0 || filters.type.includes('application')) {
        const { data: applications } = await supabase
          .from('applications')
          .select(`
            *,
            beneficiaries!inner(name, surname)
          `)
          .or(`description.ilike.%${query}%`)
          .limit(5)
        
        applications?.forEach((a: any) => {
          searchResults.push({
            id: a.id,
            type: 'application',
            title: `${a.beneficiaries.name} ${a.beneficiaries.surname} - Başvuru`,
            subtitle: `${a.aid_type} - ${a.status} - ${a.description?.substring(0, 50)}...`,
            url: `/aid/applications?search=${a.id}`,
            metadata: a
          })
        })
      }

      setResults(searchResults)
      
      // Save to recent searches
      if (query && !recentSearches.includes(query)) {
        const newRecent = [query, ...recentSearches.slice(0, 4)]
        setRecentSearches(newRecent)
        localStorage.setItem('recent_searches', JSON.stringify(newRecent))
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [query, filters, recentSearches])

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    setIsOpen(false)
    setQuery('')
  }

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'beneficiary': return <Users className="h-4 w-4 text-blue-600" />
      case 'application': return <FileText className="h-4 w-4 text-orange-600" />
      case 'donation': return <Coins className="h-4 w-4 text-green-600" />
      default: return <Search className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span>Ara...</span>
        <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl rounded-lg border bg-background p-0 shadow-lg">
            {/* Search Input */}
            <div className="flex items-center border-b p-4">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İhtiyaç sahibi, başvuru veya bağışçı ara..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded p-1.5 hover:bg-accent ${showFilters ? 'bg-accent' : ''}`}
                  title="Filtreler"
                >
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1.5 hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-b bg-muted/30 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Type Filter */}
                  <div>
                    <label className="mb-2 block text-xs font-medium">Tür</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'beneficiary', label: 'İhtiyaç Sahibi' },
                        { value: 'application', label: 'Başvuru' },
                        { value: 'donation', label: 'Bağış' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            const newTypes = filters.type.includes(option.value)
                              ? filters.type.filter(t => t !== option.value)
                              : [...filters.type, option.value]
                            setFilters({ ...filters, type: newTypes })
                          }}
                          className={`rounded px-3 py-1 text-xs ${
                            filters.type.includes(option.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="mb-2 block text-xs font-medium">Tarih Aralığı</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filters.dateRange.from}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, from: e.target.value }
                        })}
                        className="flex-1 rounded border px-2 py-1 text-xs"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.to}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, to: e.target.value }
                        })}
                        className="flex-1 rounded border px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) && 'Filtreler aktif'}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center p-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                  <p>&quot;{query}&quot; için sonuç bulunamadı</p>
                  <p className="mt-1 text-xs">Farklı kelimeler deneyin veya filtreleri değiştirin</p>
                </div>
              )}

              {!loading && query.length < 2 && recentSearches.length > 0 && (
                <div className="p-4">
                  <h4 className="mb-3 text-xs font-medium text-muted-foreground">Son Aramalar</h4>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="p-2">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex w-full items-center gap-3 rounded px-3 py-3 text-left hover:bg-accent"
                    >
                      {getResultIcon(result.type)}
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium text-sm truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>
                      </div>
                      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
                        ↵
                      </kbd>
                    </button>
                  ))}
                  
                  {results.length >= 10 && (
                    <div className="border-t p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Daha fazla sonuç için daha spesifik arama yapın
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdvancedSearch
