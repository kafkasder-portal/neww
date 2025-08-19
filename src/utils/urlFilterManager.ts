import type { FilterState } from '../components/AdvancedSearchModal'
import { sanitizeInput, isValidUrl, safeUrlConstruct } from './sanitization';

export interface URLFilterConfig {
  baseUrl: string
  paramPrefix?: string
  encodeValues?: boolean
  excludeEmpty?: boolean
  dateFormat?: 'iso' | 'timestamp' | 'date'
}

export class URLFilterManager {
  private config: URLFilterConfig

  constructor(config: URLFilterConfig) {
    this.config = {
      paramPrefix: 'filter_',
      encodeValues: true,
      excludeEmpty: true,
      dateFormat: 'iso',
      ...config
    }
  }

  // Convert filters to URL search params
  filtersToURL(filters: FilterState): string {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (this.config.excludeEmpty && this.isEmpty(value)) {
        return
      }

      const paramKey = this.config.paramPrefix + key
      const paramValue = this.serializeValue(value)
      
      if (paramValue !== null) {
        params.set(paramKey, paramValue)
      }
    })

    const searchParams = params.toString()
    return searchParams ? `${this.config.baseUrl}?${searchParams}` : this.config.baseUrl
  }

  // Convert URL search params to filters
  urlToFilters(url: string): FilterState {
    const filters: FilterState = {}
    
    try {
      // Validate URL before processing
      if (!isValidUrl(url)) {
        console.warn('Invalid URL provided to urlToFilters:', url)
        return {}
      }
      
      // Handle both absolute and relative URLs using safe constructor
      let urlObj: URL | null
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urlObj = safeUrlConstruct(url)
      } else {
        // Relative URL - use current origin as base
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
        urlObj = safeUrlConstruct(url, baseUrl)
      }
      
      if (!urlObj) {
        console.warn('Failed to construct URL object for filters:', url)
        return {}
      }
      
      const params = urlObj.searchParams
      
      params.forEach((value, key) => {
        if (key.startsWith(this.config.paramPrefix || '')) {
          const filterKey = key.replace(this.config.paramPrefix || '', '')
          // Sanitize the parameter value
          const sanitizedValue = sanitizeInput(value)
          const deserializedValue = this.deserializeValue(sanitizedValue)
          
          if (deserializedValue !== null) {
            filters[filterKey] = deserializedValue
          }
        }
      })
    } catch (error) {
      console.warn('Invalid URL provided to urlToFilters:', error)
    }

    return filters
  }

  // Get current filters from browser URL
  getCurrentFilters(): FilterState {
    if (typeof window === 'undefined') return {}
    return this.urlToFilters(window.location.href)
  }

  // Update browser URL with new filters
  updateBrowserURL(filters: FilterState, replace: boolean = false): void {
    if (typeof window === 'undefined') return
    
    const newURL = this.filtersToURL(filters)
    
    // Validate the generated URL before updating
    if (!isValidUrl(newURL) && !newURL.startsWith('/')) {
      console.warn('Generated invalid URL, skipping update:', newURL);
      return;
    }
    
    if (replace) {
      window.history.replaceState({}, '', newURL)
    } else {
      window.history.pushState({}, '', newURL)
    }
  }

  // Generate shareable URL
  generateShareableURL(filters: FilterState, baseUrl?: string): string {
    try {
      const filterUrl = this.filtersToURL(filters);
      
      if (baseUrl) {
        // Validate base URL before using
        if (!isValidUrl(baseUrl)) {
          console.warn('Invalid base URL provided:', baseUrl);
          return filterUrl; // Return relative URL as fallback
        }
        
        // Combine with provided base URL using safe constructor
        const url = safeUrlConstruct(filterUrl, baseUrl);
        return url ? url.toString() : filterUrl;
      }
      
      // Use current origin if available
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        const url = safeUrlConstruct(filterUrl, window.location.origin);
        return url ? url.toString() : filterUrl;
      }
      
      // Fallback to relative URL
      return filterUrl;
    } catch (error) {
      console.warn('Failed to generate shareable URL:', error);
      return '';
    }
  }

  // Parse shareable URL
  parseShareableURL(url: string): FilterState {
    return this.urlToFilters(url)
  }

  // Create URL with specific filters applied
  createFilteredURL(baseFilters: FilterState, additionalFilters: FilterState): string {
    const combinedFilters = { ...baseFilters, ...additionalFilters }
    return this.filtersToURL(combinedFilters)
  }

  // Remove specific filters from URL
  removeFiltersFromURL(filters: FilterState, filtersToRemove: string[]): string {
    const newFilters = { ...filters }
    filtersToRemove.forEach(key => {
      delete newFilters[key]
    })
    return this.filtersToURL(newFilters)
  }

  // Check if current URL has any filters
  hasFilters(): boolean {
    const currentFilters = this.getCurrentFilters()
    return Object.keys(currentFilters).length > 0
  }

  // Clear all filters from URL
  clearFiltersFromURL(replace: boolean = false): void {
    if (typeof window === 'undefined') return
    
    const newURL = this.config.baseUrl
    
    if (replace) {
      window.history.replaceState({}, '', newURL)
    } else {
      window.history.pushState({}, '', newURL)
    }
  }

  // Listen for URL changes (for back/forward navigation)
  onURLChange(callback: (filters: FilterState) => void): () => void {
    if (typeof window === 'undefined') return () => {}
    
    const handlePopState = () => {
      const filters = this.getCurrentFilters()
      callback(filters)
    }

    window.addEventListener('popstate', handlePopState)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }

  // Validate URL filters against field definitions
  validateURLFilters(filters: FilterState, validFields: string[]): FilterState {
    const validatedFilters: FilterState = {}
    
    Object.entries(filters).forEach(([key, value]) => {
      if (validFields.includes(key)) {
        validatedFilters[key] = value
      }
    })

    return validatedFilters
  }

  // Private helper methods
  private serializeValue(value: unknown): string | null {
    if (this.isEmpty(value)) return null

    try {
      if (typeof value === 'string') {
        return this.config.encodeValues ? encodeURIComponent(value) : value
      }
      
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
      }
      
      if (value instanceof Date) {
        switch (this.config.dateFormat) {
          case 'timestamp':
            return String(value.getTime())
          case 'date':
            return value.toISOString().split('T')[0]
          case 'iso':
          default:
            return value.toISOString()
        }
      }
      
      if (Array.isArray(value)) {
        const serializedArray = value
          .filter(item => !this.isEmpty(item))
          .map(item => this.serializeValue(item))
          .filter(item => item !== null)
        
        return serializedArray.length > 0 ? serializedArray.join(',') : null
      }
      
      if (typeof value === 'object' && value !== null) {
        // Handle date ranges and number ranges
        if ('start' in value && 'end' in value && value.start && value.end) {
          const start = this.serializeValue(value.start)
          const end = this.serializeValue(value.end)
          return start && end ? `${start}|${end}` : null
        }
        
        if ('min' in value || 'max' in value) {
          const min = 'min' in value && value.min !== undefined ? String(value.min) : ''
          const max = 'max' in value && value.max !== undefined ? String(value.max) : ''
          return `${min}|${max}`
        }
        
        // Generic object serialization
        return JSON.stringify(value)
      }
      
      return String(value)
    } catch (error) {
      console.warn('Error serializing value:', value, error)
      return null
    }
  }

  private deserializeValue(value: string): unknown {
    if (!value) return null

    try {
      // Try to decode if encoding was used
      const decodedValue = this.config.encodeValues ? decodeURIComponent(value) : value
      
      // Check for array (comma-separated values)
      if (decodedValue.includes(',') && !decodedValue.includes('|')) {
        return decodedValue.split(',').map(item => {
          const trimmed = item.trim()
          return this.parseSimpleValue(trimmed)
        })
      }
      
      // Check for range values (pipe-separated)
      if (decodedValue.includes('|')) {
        const [first, second] = decodedValue.split('|')
        
        // Date range
        if (this.isDateString(first) || this.isDateString(second)) {
          return {
            start: first ? this.parseDate(first) : null,
            end: second ? this.parseDate(second) : null
          }
        }
        
        // Number range
        if (this.isNumeric(first) || this.isNumeric(second)) {
          return {
            min: first ? Number(first) : undefined,
            max: second ? Number(second) : undefined
          }
        }
        
        // Generic range
        return {
          start: first || null,
          end: second || null
        }
      }
      
      // Try to parse as JSON
      if ((decodedValue.startsWith('{') && decodedValue.endsWith('}')) ||
          (decodedValue.startsWith('[') && decodedValue.endsWith(']'))) {
        return JSON.parse(decodedValue)
      }
      
      // Parse simple value
      return this.parseSimpleValue(decodedValue)
    } catch (error) {
      console.warn('Error deserializing value:', value, error)
      return value // Return original value if parsing fails
    }
  }

  private parseSimpleValue(value: string): unknown {
    // Boolean
    if (value === 'true') return true
    if (value === 'false') return false
    
    // Number
    if (this.isNumeric(value)) {
      return Number(value)
    }
    
    // Date
    if (this.isDateString(value)) {
      return this.parseDate(value)
    }
    
    // String
    return value
  }

  private parseDate(value: string): Date | null {
    try {
      // Handle timestamp
      if (this.config.dateFormat === 'timestamp' && this.isNumeric(value)) {
        return new Date(Number(value))
      }
      
      // Handle ISO date or date string
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }

  private isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value))
  }

  private isDateString(value: string): boolean {
    if (!value) return false
    
    // ISO date pattern
    const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/
    if (isoPattern.test(value)) return true
    
    // Timestamp pattern
    if (this.config.dateFormat === 'timestamp' && this.isNumeric(value)) {
      const timestamp = Number(value)
      return timestamp > 0 && timestamp < Date.now() * 2 // Reasonable timestamp range
    }
    
    return false
  }

  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined || value === '') return true
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') {
      return Object.keys(value).length === 0 || 
             Object.values(value).every(v => v === null || v === undefined || v === '')
    }
    return false
  }
}

// React hook for URL filter management
export const useURLFilters = (config: URLFilterConfig) => {
  const urlManager = new URLFilterManager(config)
  
  const getCurrentFilters = () => urlManager.getCurrentFilters()
  
  const updateFilters = (filters: FilterState, replace: boolean = false) => {
    urlManager.updateBrowserURL(filters, replace)
  }
  
  const clearFilters = (replace: boolean = false) => {
    urlManager.clearFiltersFromURL(replace)
  }
  
  const generateShareableURL = (filters: FilterState) => {
    return urlManager.generateShareableURL(filters)
  }
  
  const onURLChange = (callback: (filters: FilterState) => void) => {
    return urlManager.onURLChange(callback)
  }
  
  return {
    getCurrentFilters,
    updateFilters,
    clearFilters,
    generateShareableURL,
    onURLChange,
    hasFilters: urlManager.hasFilters()
  }
}

// Predefined URL filter configurations for different pages
export const createBeneficiariesURLConfig = (): URLFilterConfig => ({
  baseUrl: '/beneficiaries',
  paramPrefix: 'bf_',
  encodeValues: true,
  excludeEmpty: true,
  dateFormat: 'iso'
})

export const createApplicationsURLConfig = (): URLFilterConfig => ({
  baseUrl: '/applications',
  paramPrefix: 'app_',
  encodeValues: true,
  excludeEmpty: true,
  dateFormat: 'iso'
})

export const createDonationsURLConfig = (): URLFilterConfig => ({
  baseUrl: '/donations',
  paramPrefix: 'don_',
  encodeValues: true,
  excludeEmpty: true,
  dateFormat: 'iso'
})