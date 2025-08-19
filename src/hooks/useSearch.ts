import { useState, useEffect, useMemo, useCallback } from 'react'
import { allPages } from '../constants/navigation'

interface SearchResult {
  title: string
  href: string
  description?: string
  category: string
  icon: any
}

export const useSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse recent searches:', error)
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return
    
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(item => item !== query)].slice(0, 5)
      localStorage.setItem('recent-searches', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }, [])

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return allPages.filter(page => 
      page.title.toLowerCase().includes(query) ||
      page.category.toLowerCase().includes(query) ||
      page.description?.toLowerCase().includes(query) ||
      page.href.toLowerCase().includes(query)
    ).slice(0, 10) // Limit to 10 results
  }, [searchQuery])

  // Get recent searches as search results
  const recentResults = useMemo(() => {
    return recentSearches.map(query => {
      // Find a matching page for the recent search
      const page = allPages.find(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      
      return page ? {
        ...page,
        isRecent: true
      } : null
    }).filter(Boolean) as (SearchResult & { isRecent: boolean })[]
  }, [recentSearches])

  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleResultClick = useCallback((result: SearchResult) => {
    saveRecentSearch(result.title)
    closeSearch()
  }, [saveRecentSearch, closeSearch])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        openSearch()
      }
      
      if (event.key === 'Escape' && isSearchOpen) {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, openSearch, closeSearch])

  return {
    isSearchOpen,
    searchQuery,
    filteredPages,
    recentSearches,
    recentResults,
    openSearch,
    closeSearch,
    handleSearch,
    handleResultClick,
    clearRecentSearches,
    setSearchQuery
  }
}
