
// Filter field types
export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'multiSelect' | 'dateRange' | 'numberRange' | 'boolean' | 'number' | 'date'
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  defaultValue?: unknown
  validation?: {
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  visible?: boolean
  enabled?: boolean
}

// Filter state type
export type FilterState = Record<string, unknown>

export interface FilterDependency {
  field: string
  dependsOn: string
  condition: {
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal' | 'in' | 'not_in' | 'empty' | 'not_empty'
    value?: unknown
  }
  action: 'show' | 'hide' | 'enable' | 'disable' | 'clear'
}

export interface FilterGroup {
  id: string
  key: string
  label: string
  fields: string[]
  operator: 'AND' | 'OR'
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface FilterValidationRule {
  field: string
  rules: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
    custom?: (value: unknown, allFilters: FilterState) => string | null
  }
}

export class FilterManager {
  private fields: FilterField[]
  private dependencies: FilterDependency[]
  private groups: FilterGroup[]
  private validationRules: FilterValidationRule[]
  private _visibleFieldsCache?: { key: string; fields: FilterField[] }

  constructor(
    fields: FilterField[],
    dependencies: FilterDependency[] = [],
    groups: FilterGroup[] = [],
    validationRules: FilterValidationRule[] = []
  ) {
    this.fields = fields
    this.dependencies = dependencies
    this.groups = groups
    this.validationRules = validationRules
  }

  // Get visible fields based on current filter state
  getVisibleFields(filters: FilterState): FilterField[] {
    // Cache visible fields calculation for performance
    const cacheKey = JSON.stringify(Object.keys(filters).sort())
    if (this._visibleFieldsCache?.key === cacheKey) {
      return this._visibleFieldsCache.fields
    }

    const visibleFields = this.fields.filter(field => {
      const dependency = this.dependencies.find(dep => dep.field === field.key)
      if (!dependency) return true

      const dependentValue = filters[dependency.dependsOn]
      return this.evaluateCondition(dependentValue, dependency.condition)
    })

    // Cache the result
    this._visibleFieldsCache = { key: cacheKey, fields: visibleFields }
    return visibleFields
  }

  // Get enabled fields based on current filter state
  getEnabledFields(filters: FilterState): string[] {
    const enabledFields: string[] = []

    this.fields.forEach(field => {
      const dependency = this.dependencies.find(dep =>
        dep.field === field.key && dep.action === 'enable'
      )

      if (!dependency) {
        enabledFields.push(field.key)
        return
      }

      const dependentValue = filters[dependency.dependsOn]
      if (this.evaluateCondition(dependentValue, dependency.condition)) {
        enabledFields.push(field.key)
      }
    })

    return enabledFields
  }

  // Get fields that should be cleared based on dependencies
  getFieldsToClear(changedField: string, newValue: unknown): string[] {
    const fieldsToClear: string[] = []

    this.dependencies.forEach(dependency => {
      if (dependency.dependsOn === changedField && dependency.action === 'clear') {
        if (!this.evaluateCondition(newValue, dependency.condition)) {
          fieldsToClear.push(dependency.field)
        }
      }
    })

    return fieldsToClear
  }

  // Validate all filters
  validateFilters(filters: FilterState): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}
    const visibleFields = this.getVisibleFields(filters)
    const enabledFields = this.getEnabledFields(filters)

    // Use for...of for better performance with early exit potential
    for (const field of visibleFields) {
      if (!enabledFields.includes(field.key)) continue

      const value = filters[field.key]
      const validationRule = this.validationRules.find(rule => rule.field === field.key)

      if (!validationRule) continue

      // Required validation
      if (validationRule.rules.required && this.isEmpty(value)) {
        errors[field.key] = `${field.label} alanı zorunludur`
        continue
      }

      if (this.isEmpty(value)) continue

      // Min/Max validation for numbers
      if (typeof value === 'number') {
        if (validationRule.rules.min !== undefined && value < validationRule.rules.min) {
          errors[field.key] = `${field.label} en az ${validationRule.rules.min} olmalıdır`
          continue
        }
        if (validationRule.rules.max !== undefined && value > validationRule.rules.max) {
          errors[field.key] = `${field.label} en fazla ${validationRule.rules.max} olmalıdır`
          continue
        }
      }

      // Min/Max validation for strings
      if (typeof value === 'string') {
        if (validationRule.rules.min !== undefined && value.length < validationRule.rules.min) {
          errors[field.key] = `${field.label} en az ${validationRule.rules.min} karakter olmalıdır`
          continue
        }
        if (validationRule.rules.max !== undefined && value.length > validationRule.rules.max) {
          errors[field.key] = `${field.label} en fazla ${validationRule.rules.max} karakter olmalıdır`
          continue
        }
      }

      // Pattern validation
      if (validationRule.rules.pattern && typeof value === 'string') {
        const regex = new RegExp(validationRule.rules.pattern)
        if (!regex.test(value)) {
          errors[field.key] = `${field.label} geçerli bir format değil`
          continue
        }
      }

      // Custom validation
      if (validationRule.rules.custom) {
        const customError = validationRule.rules.custom(value, filters)
        if (customError) {
          errors[field.key] = customError
          continue
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Group fields by their groups
  getGroupedFields(filters: FilterState): Array<{ group: FilterGroup | null; fields: FilterField[] }> {
    const visibleFields = this.getVisibleFields(filters)
    const groupedFields: Array<{ group: FilterGroup | null; fields: FilterField[] }> = []
    const fieldsInGroups = new Set<string>()

    // Add grouped fields
    this.groups.forEach(group => {
      const groupFields = visibleFields.filter(field => group.fields.includes(field.key))
      if (groupFields.length > 0) {
        groupedFields.push({ group, fields: groupFields })
        groupFields.forEach(field => fieldsInGroups.add(field.key))
      }
    })

    // Add ungrouped fields
    const ungroupedFields = visibleFields.filter(field => !fieldsInGroups.has(field.key))
    if (ungroupedFields.length > 0) {
      groupedFields.push({ group: null, fields: ungroupedFields })
    }

    return groupedFields
  }

  // Apply filter changes with dependency handling
  applyFilterChange(
    filters: FilterState,
    fieldKey: string,
    newValue: unknown
  ): FilterState {
    const newFilters = { ...filters, [fieldKey]: newValue }

    // Clear dependent fields if needed
    const fieldsToClear = this.getFieldsToClear(fieldKey, newValue)
    fieldsToClear.forEach(field => {
      delete newFilters[field]
    })

    return newFilters
  }

  // Build query parameters for API
  buildQueryParams(filters: FilterState): Record<string, unknown> {
    const params: Record<string, unknown> = {}
    const visibleFields = this.getVisibleFields(filters)
    const enabledFields = this.getEnabledFields(filters)

    // Pre-filter out empty values for better performance
    const activeFilters = Object.entries(filters).filter(([, value]) =>
      !this.isEmpty(value)
    )

    for (const field of visibleFields) {
      if (!enabledFields.includes(field.key)) continue

      const filterEntry = activeFilters.find(([key]) => key === field.key)
      if (!filterEntry) continue

      const [, value] = filterEntry

      // Handle different field types
      switch (field.type) {
        case 'multiSelect':
          if (Array.isArray(value) && value.length > 0) {
            params[field.key] = value
          }
          break
        case 'dateRange':
          if (value && typeof value === 'object' && value !== null && 'start' in value && 'end' in value) {
            const dateRange = value as { start: string; end: string }
            if (dateRange.start && dateRange.end) {
              params[`${field.key}_start`] = dateRange.start
              params[`${field.key}_end`] = dateRange.end
            }
          }
          break
        case 'numberRange':
          if (value && typeof value === 'object' && value !== null && ('min' in value || 'max' in value)) {
            const numberRange = value as { min?: number; max?: number }
            if (numberRange.min !== undefined) params[`${field.key}_min`] = numberRange.min
            if (numberRange.max !== undefined) params[`${field.key}_max`] = numberRange.max
          }
          break
        default:
          params[field.key] = value
      }
    }

    return params
  }

  // Private helper methods
  private evaluateCondition(value: unknown, condition: FilterDependency['condition']): boolean {
    const { operator, value: conditionValue } = condition

    switch (operator) {
      case 'equals':
        return value === conditionValue
      case 'not_equals':
        return value !== conditionValue
      case 'contains':
        return typeof value === 'string' && typeof conditionValue === 'string' && value.includes(conditionValue)
      case 'not_contains':
        return typeof value === 'string' && typeof conditionValue === 'string' && !value.includes(conditionValue)
      case 'greater_than':
        return typeof value === 'number' && typeof conditionValue === 'number' && value > conditionValue
      case 'less_than':
        return typeof value === 'number' && typeof conditionValue === 'number' && value < conditionValue
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(value)
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(value)
      default:
        return false
    }
  }

  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined || value === '') return true
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>
      return Object.keys(obj).length === 0 ||
        Object.values(obj).every(v => v === null || v === undefined || v === '')
    }
    return false
  }

  // Reset filters to default values
  resetFilters(): FilterState {
    const resetState: FilterState = {}

    this.fields.forEach(field => {
      switch (field.type) {
        case 'multiSelect':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : []
          break
        case 'numberRange':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : { min: undefined, max: undefined }
          break
        case 'dateRange':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : { start: undefined, end: undefined }
          break
        default:
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : ''
      }
    })

    return resetState
  }

  // Static method for resetting filters
  static resetFilters(fields: FilterField[]): FilterState {
    const resetState: FilterState = {}

    fields.forEach(field => {
      switch (field.type) {
        case 'multiSelect':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : []
          break
        case 'numberRange':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : { min: undefined, max: undefined }
          break
        case 'dateRange':
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : { start: undefined, end: undefined }
          break
        default:
          resetState[field.key] = field.defaultValue !== undefined ? field.defaultValue : ''
      }
    })

    return resetState
  }

  // Static method for building filter query
  static buildFilterQuery(filters: FilterState): Record<string, unknown> {
    const query: Record<string, unknown> = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return

      if (Array.isArray(value)) {
        if (value.length > 0) {
          query[key] = value
        }
      } else if (typeof value === 'object' && value !== null) {
        if ('from' in value && 'to' in value && value.from && value.to) {
          // Date range
          const dateRange = value as { from: string; to: string }
          query[`${key}_from`] = dateRange.from
          query[`${key}_to`] = dateRange.to
        } else if ('min' in value || 'max' in value) {
          // Number range
          const numberRange = value as { min?: number; max?: number }
          if (numberRange.min !== undefined) query[`${key}_min`] = numberRange.min
          if (numberRange.max !== undefined) query[`${key}_max`] = numberRange.max
        } else if (Object.keys(value).length > 0) {
          query[key] = value
        }
      } else {
        query[key] = value
      }
    })

    return query
  }

  // Static method for getting visible fields
  static getVisibleFields(fields: FilterField[]): FilterField[] {
    return fields.filter(field => field.visible !== false)
  }

  // Static method for validating filters
  static validateFilters(
    filters: FilterState,
    fields: FilterField[],
    validationRules: FilterValidationRule[] = []
  ): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const field of fields) {
      const value = filters[field.key]
      const validation = field.validation

      if (!validation) continue

      // Required validation
      if (validation.required && (!value || value === '')) {
        errors[field.key] = 'Bu alan zorunludur'
        continue
      }

      // Skip other validations if value is empty and not required
      if (!value || value === '') continue

      // Min length validation
      if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
        errors[field.key] = `En az ${validation.minLength} karakter olmalıdır`
        continue
      }

      // Pattern validation
      if (validation.pattern && typeof value === 'string') {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(value)) {
          errors[field.key] = 'Geçerli bir email adresi girin'
          continue
        }
      }

      // Number range validation
      if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          errors[field.key] = `Minimum değer ${validation.min} olmalıdır`
          continue
        }
        if (validation.max !== undefined && value > validation.max) {
          errors[field.key] = `Maksimum değer ${validation.max} olmalıdır`
          continue
        }
      }
    }

    // Custom validation rules
    for (const rule of validationRules) {
      if (rule.rules.custom) {
        const value = filters[rule.field]
        const customError = rule.rules.custom(value, filters)
        if (customError) {
          errors[rule.field] = customError
        }
      }
    }

    return errors
  }

  // Static method for applying dependencies
  static applyDependencies(
    fields: FilterField[],
    filters: FilterState,
    dependencies: FilterDependency[]
  ): FilterField[] {
    return fields.map(field => {
      const fieldDependencies = dependencies.filter(dep => dep.field === field.key)

      if (fieldDependencies.length === 0) {
        return { ...field, visible: true, enabled: true }
      }

      let visible = field.visible !== false // Start with field's default visibility
      let enabled = field.enabled !== false // Start with field's default enabled state

      for (const dependency of fieldDependencies) {
        const sourceValue = filters[dependency.dependsOn]
        const conditionMet = FilterManager.evaluateCondition(sourceValue, dependency.condition)

        if (dependency.action === 'show') {
          visible = visible && conditionMet
        } else if (dependency.action === 'hide') {
          visible = visible && !conditionMet
        } else if (dependency.action === 'enable') {
          enabled = enabled && conditionMet
        } else if (dependency.action === 'disable') {
          enabled = enabled && !conditionMet
        }
      }

      return { ...field, visible, enabled }
    })
  }

  // Static helper method for evaluating conditions
  static evaluateCondition(value: unknown, condition: FilterDependency['condition']): boolean {
    const { operator, value: conditionValue } = condition

    switch (operator) {
      case 'equals':
        return value === conditionValue
      case 'not_equals':
        return value !== conditionValue
      case 'contains':
        return typeof value === 'string' && typeof conditionValue === 'string' && value.includes(conditionValue)
      case 'not_contains':
        return typeof value === 'string' && typeof conditionValue === 'string' && !value.includes(conditionValue)
      case 'greater_than':
        return typeof value === 'number' && typeof conditionValue === 'number' && value > conditionValue
      case 'less_than':
        return typeof value === 'number' && typeof conditionValue === 'number' && value < conditionValue
      case 'greater_than_or_equal':
        return typeof value === 'number' && typeof conditionValue === 'number' && value >= conditionValue
      case 'less_than_or_equal':
        return typeof value === 'number' && typeof conditionValue === 'number' && value <= conditionValue
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(value)
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(value)
      case 'not_empty':
        return value !== null && value !== undefined && value !== ''
      case 'empty':
        return value === null || value === undefined || value === ''
      default:
        return false
    }
  }

  // Apply filters to data
  applyFilters<T extends Record<string, any>>(data: T[], filters: FilterState): T[] {
    return data.filter(item => {
      return this.fields.every(field => {
        const filterValue = filters[field.key]
        const itemValue = this.getNestedValue(item, field.key)

        if (this.isEmpty(filterValue)) return true

        switch (field.type) {
          case 'text':
            return this.matchesText(itemValue, filterValue as string)
          case 'select':
            return this.matchesSelect(itemValue, filterValue as string)
          case 'multiSelect':
            return this.matchesMultiSelect(itemValue, filterValue as string[])
          case 'dateRange':
            return this.matchesDateRange(itemValue, filterValue as { start: string; end: string })
          case 'numberRange':
            return this.matchesNumberRange(itemValue, filterValue as { min: number; max: number })
          case 'boolean':
            return this.matchesBoolean(itemValue, filterValue as boolean)
          default:
            return true
        }
      })
    })
  }

  // Helper methods for filter matching
  private matchesText(itemValue: any, filterValue: string): boolean {
    if (!itemValue) return false
    return String(itemValue).toLowerCase().includes(filterValue.toLowerCase())
  }

  private matchesSelect(itemValue: any, filterValue: string): boolean {
    return itemValue === filterValue
  }

  private matchesMultiSelect(itemValue: any, filterValue: string[]): boolean {
    if (!Array.isArray(filterValue) || filterValue.length === 0) return true
    return filterValue.includes(String(itemValue))
  }

  private matchesDateRange(itemValue: any, filterValue: { start: string; end: string }): boolean {
    if (!itemValue || !filterValue.start || !filterValue.end) return true
    const itemDate = new Date(itemValue)
    const startDate = new Date(filterValue.start)
    const endDate = new Date(filterValue.end)
    return itemDate >= startDate && itemDate <= endDate
  }

  private matchesNumberRange(itemValue: any, filterValue: { min: number; max: number }): boolean {
    if (itemValue === null || itemValue === undefined) return true
    const numValue = Number(itemValue)
    if (isNaN(numValue)) return false
    if (filterValue.min !== undefined && numValue < filterValue.min) return false
    if (filterValue.max !== undefined && numValue > filterValue.max) return false
    return true
  }

  private matchesBoolean(itemValue: any, filterValue: boolean): boolean {
    return Boolean(itemValue) === filterValue
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // URL handling methods
  private getDateRangeFromURL(params: URLSearchParams, key: string): { start: string; end: string } | undefined {
    const start = params.get(`${key}_start`)
    const end = params.get(`${key}_end`)
    if (start || end) {
      return { start: start || '', end: end || '' }
    }
    return undefined
  }

  private getNumberRangeFromURL(params: URLSearchParams, key: string): { min?: number; max?: number } | undefined {
    const min = params.get(`${key}_min`)
    const max = params.get(`${key}_max`)
    if (min || max) {
      return {
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined
      }
    }
    return undefined
  }

  private setDateRangeToURL(params: URLSearchParams, key: string, value: { start: string; end: string }): void {
    if (value.start) params.set(`${key}_start`, value.start)
    if (value.end) params.set(`${key}_end`, value.end)
  }

  private setNumberRangeToURL(params: URLSearchParams, key: string, value: { min?: number; max?: number }): void {
    if (value.min !== undefined) params.set(`${key}_min`, String(value.min))
    if (value.max !== undefined) params.set(`${key}_max`, String(value.max))
  }

  // Load filters from URL
  loadFromURL(url: string): FilterState {
    const urlObj = new URL(url)
    const params = urlObj.searchParams
    const filters: FilterState = {}

    this.fields.forEach(field => {
      const value = params.get(field.key)

      if (value !== null) {
        switch (field.type) {
          case 'multiSelect':
            filters[field.key] = value.split(',').filter(v => v.trim() !== '')
            break
          case 'boolean':
            filters[field.key] = value === 'true'
            break
          case 'number':
            filters[field.key] = Number(value)
            break
          case 'dateRange': {
            const dateRange = this.getDateRangeFromURL(params, field.key)
            if (dateRange) filters[field.key] = dateRange
            break
          }
          case 'numberRange': {
            const numberRange = this.getNumberRangeFromURL(params, field.key)
            if (numberRange) filters[field.key] = numberRange
            break
          }
          default:
            filters[field.key] = value
        }
      }
    })

    return filters
  }

  // Save filters to URL
  saveToURL(filters: FilterState): string {
    const params = new URLSearchParams()

    this.fields.forEach(field => {
      const value = filters[field.key]

      if (value !== undefined && value !== null && value !== '') {
        switch (field.type) {
          case 'multiSelect':
            if (Array.isArray(value) && value.length > 0) {
              params.set(field.key, value.join(','))
            }
            break
          case 'dateRange':
            if (typeof value === 'object' && value !== null) {
              const dateRange = value as { start: string; end: string }
              this.setDateRangeToURL(params, field.key, dateRange)
            }
            break
          case 'numberRange':
            if (typeof value === 'object' && value !== null) {
              const numberRange = value as { min?: number; max?: number }
              this.setNumberRangeToURL(params, field.key, numberRange)
            }
            break
          default:
            params.set(field.key, String(value))
        }
      }
    })

    return params.toString()
  }
}

// Helper function to create filter configurations for different pages
export const createBeneficiariesFilterConfig = (): {
  fields: FilterField[]
  dependencies: FilterDependency[]
  groups: FilterGroup[]
  validationRules: FilterValidationRule[]
} => {
  const fields: FilterField[] = [
    {
      key: 'name',
      label: 'Ad Soyad',
      type: 'text',
      placeholder: 'Yararlanıcı adı ara...'
    },
    {
      key: 'status',
      label: 'Durum',
      type: 'select',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Pasif' },
        { value: 'pending', label: 'Beklemede' }
      ]
    },
    {
      key: 'categories',
      label: 'Kategoriler',
      type: 'multiSelect',
      options: [
        { value: 'education', label: 'Eğitim' },
        { value: 'health', label: 'Sağlık' },
        { value: 'food', label: 'Gıda' },
        { value: 'shelter', label: 'Barınma' }
      ]
    },
    {
      key: 'ageRange',
      label: 'Yaş Aralığı',
      type: 'numberRange',
      validation: { min: 0, max: 120 }
    },
    {
      key: 'registrationDate',
      label: 'Kayıt Tarihi',
      type: 'dateRange'
    },
    {
      key: 'priority',
      label: 'Öncelik',
      type: 'select',
      options: [
        { value: 'high', label: 'Yüksek' },
        { value: 'medium', label: 'Orta' },
        { value: 'low', label: 'Düşük' }
      ]
    },
    {
      key: 'hasActiveApplication',
      label: 'Aktif Başvuru Var',
      type: 'select',
      options: [
        { value: 'true', label: 'Evet' },
        { value: 'false', label: 'Hayır' }
      ]
    }
  ]

  const dependencies: FilterDependency[] = [
    {
      field: 'priority',
      dependsOn: 'status',
      condition: { operator: 'equals', value: 'active' },
      action: 'show'
    }
  ]

  const groups: FilterGroup[] = [
    {
      id: 'basic',
      key: 'basic',
      label: 'Temel Bilgiler',
      fields: ['name', 'status', 'categories'],
      operator: 'AND'
    },
    {
      id: 'demographics',
      key: 'demographics',
      label: 'Demografik Bilgiler',
      fields: ['ageRange', 'registrationDate'],
      operator: 'AND',
      collapsible: true,
      defaultCollapsed: true
    },
    {
      id: 'advanced',
      key: 'advanced',
      label: 'Gelişmiş Filtreler',
      fields: ['priority', 'hasActiveApplication'],
      operator: 'AND',
      collapsible: true,
      defaultCollapsed: true
    }
  ]

  const validationRules: FilterValidationRule[] = [
    {
      field: 'ageRange',
      rules: {
        custom: (value: unknown) => {
          if (value && typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            const rangeValue = value as { min?: number; max?: number }
            if (rangeValue.min && rangeValue.max && rangeValue.min > rangeValue.max) {
              return 'Minimum yaş maksimum yaştan büyük olamaz'
            }
          }
          return null
        }
      }
    }
  ]

  return { fields, dependencies, groups, validationRules }
}

export const createApplicationsFilterConfig = (): {
  fields: FilterField[]
  dependencies: FilterDependency[]
  groups: FilterGroup[]
  validationRules: FilterValidationRule[]
} => {
  const fields: FilterField[] = [
    {
      key: 'applicantName',
      label: 'Başvuran Adı',
      type: 'text',
      placeholder: 'Başvuran adı ara...'
    },
    {
      key: 'status',
      label: 'Başvuru Durumu',
      type: 'select',
      options: [
        { value: 'pending', label: 'Beklemede' },
        { value: 'approved', label: 'Onaylandı' },
        { value: 'rejected', label: 'Reddedildi' },
        { value: 'in_review', label: 'İncelemede' }
      ]
    },
    {
      key: 'categories',
      label: 'Başvuru Kategorileri',
      type: 'multiSelect',
      options: [
        { value: 'education', label: 'Eğitim Desteği' },
        { value: 'health', label: 'Sağlık Desteği' },
        { value: 'food', label: 'Gıda Yardımı' },
        { value: 'emergency', label: 'Acil Yardım' }
      ]
    },
    {
      key: 'applicationDate',
      label: 'Başvuru Tarihi',
      type: 'dateRange'
    },
    {
      key: 'amountRange',
      label: 'Talep Edilen Miktar',
      type: 'numberRange',
      validation: { min: 0 }
    },
    {
      key: 'priority',
      label: 'Öncelik Seviyesi',
      type: 'select',
      options: [
        { value: 'urgent', label: 'Acil' },
        { value: 'high', label: 'Yüksek' },
        { value: 'medium', label: 'Orta' },
        { value: 'low', label: 'Düşük' }
      ]
    }
  ]

  const dependencies: FilterDependency[] = [
    {
      field: 'priority',
      dependsOn: 'status',
      condition: { operator: 'in', value: ['pending', 'in_review'] },
      action: 'show'
    }
  ]

  const groups: FilterGroup[] = [
    {
      id: 'basic',
      key: 'basic',
      label: 'Temel Bilgiler',
      fields: ['applicantName', 'status', 'categories'],
      operator: 'AND'
    },
    {
      id: 'details',
      key: 'details',
      label: 'Başvuru Detayları',
      fields: ['applicationDate', 'amountRange', 'priority'],
      operator: 'AND',
      collapsible: true
    }
  ]

  const validationRules: FilterValidationRule[] = [
    {
      field: 'amountRange',
      rules: {
        custom: (value: unknown) => {
          if (value && typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            const rangeValue = value as { min?: number; max?: number }
            if (rangeValue.min && rangeValue.max && rangeValue.min > rangeValue.max) {
              return 'Minimum miktar maksimum miktardan büyük olamaz'
            }
          }
          return null
        }
      }
    }
  ]

  return { fields, dependencies, groups, validationRules }
}

export const createDonationsFilterConfig = (): {
  fields: FilterField[]
  dependencies: FilterDependency[]
  groups: FilterGroup[]
  validationRules: FilterValidationRule[]
} => {
  const fields: FilterField[] = [
    {
      key: 'donorName',
      label: 'Bağışçı Adı',
      type: 'text',
      placeholder: 'Bağışçı adı ara...'
    },
    {
      key: 'donationType',
      label: 'Bağış Türü',
      type: 'select',
      options: [
        { value: 'monetary', label: 'Parasal' },
        { value: 'in_kind', label: 'Ayni' },
        { value: 'service', label: 'Hizmet' }
      ]
    },
    {
      key: 'status',
      label: 'Bağış Durumu',
      type: 'select',
      options: [
        { value: 'received', label: 'Alındı' },
        { value: 'pending', label: 'Beklemede' },
        { value: 'cancelled', label: 'İptal Edildi' }
      ]
    },
    {
      key: 'donationDate',
      label: 'Bağış Tarihi',
      type: 'dateRange'
    },
    {
      key: 'amountRange',
      label: 'Bağış Miktarı',
      type: 'numberRange',
      validation: { min: 0 }
    },
    {
      key: 'categories',
      label: 'Bağış Kategorileri',
      type: 'multiSelect',
      options: [
        { value: 'education', label: 'Eğitim' },
        { value: 'health', label: 'Sağlık' },
        { value: 'food', label: 'Gıda' },
        { value: 'clothing', label: 'Giyim' },
        { value: 'shelter', label: 'Barınma' }
      ]
    }
  ]

  const dependencies: FilterDependency[] = [
    {
      field: 'amountRange',
      dependsOn: 'donationType',
      condition: { operator: 'equals', value: 'monetary' },
      action: 'show'
    },
    {
      field: 'categories',
      dependsOn: 'donationType',
      condition: { operator: 'equals', value: 'in_kind' },
      action: 'show'
    }
  ]

  const groups: FilterGroup[] = [
    {
      id: 'basic',
      key: 'basic',
      label: 'Temel Bilgiler',
      fields: ['donorName', 'donationType', 'status'],
      operator: 'AND'
    },
    {
      id: 'details',
      key: 'details',
      label: 'Bağış Detayları',
      fields: ['donationDate', 'amountRange', 'categories'],
      operator: 'AND',
      collapsible: true
    }
  ]

  const validationRules: FilterValidationRule[] = [
    {
      field: 'amountRange',
      rules: {
        custom: (value: unknown) => {
          if (value && typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            const rangeValue = value as { min?: number; max?: number }
            if (rangeValue.min && rangeValue.max && rangeValue.min > rangeValue.max) {
              return 'Minimum miktar maksimum miktardan büyük olamaz'
            }
          }
          return null
        }
      }
    }
  ]

  return { fields, dependencies, groups, validationRules }
}