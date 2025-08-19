import { useMemo } from 'react'

interface FuzzySearchOptions<T> {
  keys: (keyof T | { name: keyof T; weight?: number })[]
  threshold?: number
  includeScore?: boolean
  includeMatches?: boolean
  minMatchCharLength?: number
  shouldSort?: boolean
  findAllMatches?: boolean
  location?: number
  distance?: number
}

interface SearchResult<T> {
  item: T
  refIndex: number
  score: number
  matches: unknown[]
}

// Simple fuzzy search implementation without external dependencies
function simpleSearch<T>(data: T[], searchTerm: string, keys: (keyof T | { name: keyof T; weight?: number })[]): SearchResult<T>[] {
  if (!searchTerm.trim()) {
    return data.map((item, index) => ({
      item,
      refIndex: index,
      score: 0,
      matches: []
    }))
  }

  const searchLower = searchTerm.toLowerCase()
  const results: SearchResult<T>[] = []

  data.forEach((item, index) => {
    let score = 0
    let hasMatch = false

    keys.forEach(key => {
      const fieldName = typeof key === 'object' ? key.name : key
      const fieldValue = String(item[fieldName] || '').toLowerCase()
      
      if (fieldValue.includes(searchLower)) {
        hasMatch = true
        const weight = typeof key === 'object' ? key.weight || 1 : 1
        // Simple scoring: exact match gets higher score
        const matchScore = fieldValue === searchLower ? 1 : 0.5
        score += matchScore * weight
      }
    })

    if (hasMatch) {
      results.push({
        item,
        refIndex: index,
        score,
        matches: []
      })
    }
  })

  // Sort by score (higher is better)
  return results.sort((a, b) => b.score - a.score)
}

export function useFuzzySearch<T>(
  data: T[],
  searchTerm: string,
  options: FuzzySearchOptions<T>
) {
  const results = useMemo(() => {
    return simpleSearch(data, searchTerm, options.keys)
  }, [data, searchTerm, options.keys])

  return {
    results,
    filteredData: results.map((result: SearchResult<T>) => result.item),
    hasResults: results.length > 0,
    totalResults: results.length
  }
}

// Beneficiaries için özel search hook
export function useBeneficiarySearch(beneficiaries: Record<string, unknown>[], searchTerm: string) {
  return useFuzzySearch(beneficiaries, searchTerm, {
    keys: [
      { name: 'firstName', weight: 0.3 },
      { name: 'lastName', weight: 0.3 },
      { name: 'email', weight: 0.2 },
      { name: 'phone', weight: 0.1 },
      { name: 'nationalId', weight: 0.1 }
    ],
    threshold: 0.4,
    minMatchCharLength: 2
  })
}

// Applications için özel search hook
export function useApplicationSearch(applications: Record<string, unknown>[], searchTerm: string) {
  return useFuzzySearch(applications, searchTerm, {
    keys: [
      { name: 'applicantName', weight: 0.3 },
      { name: 'applicationId', weight: 0.2 },
      { name: 'status', weight: 0.2 },
      { name: 'type', weight: 0.2 },
      { name: 'description', weight: 0.1 }
    ],
    threshold: 0.3,
    minMatchCharLength: 2
  })
}

// Donations için özel search hook
export function useDonationSearch(donations: Record<string, unknown>[], searchTerm: string) {
  return useFuzzySearch(donations, searchTerm, {
    keys: [
      { name: 'donorName', weight: 0.3 },
      { name: 'donationId', weight: 0.2 },
      { name: 'type', weight: 0.2 },
      { name: 'campaign', weight: 0.2 },
      { name: 'notes', weight: 0.1 }
    ],
    threshold: 0.3,
    minMatchCharLength: 2
  })
}
