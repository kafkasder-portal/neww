import { format, isToday, isYesterday, isThisWeek, isThisYear, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { tr } from 'date-fns/locale'

// =====================================================
// Date and Time Utilities
// =====================================================

export const formatRelativeTime = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  
  const minutesDiff = differenceInMinutes(now, targetDate)
  const hoursDiff = differenceInHours(now, targetDate)
  const daysDiff = differenceInDays(now, targetDate)

  // Less than 1 minute
  if (minutesDiff < 1) {
    return 'şimdi'
  }
  
  // Less than 1 hour
  if (minutesDiff < 60) {
    return `${minutesDiff} dakika önce`
  }
  
  // Less than 1 day
  if (hoursDiff < 24) {
    return `${hoursDiff} saat önce`
  }
  
  // Less than 7 days
  if (daysDiff < 7) {
    return `${daysDiff} gün önce`
  }
  
  // More than 7 days, show formatted date
  return format(targetDate, 'dd MMM yyyy', { locale: tr })
}

export const formatMessageTime = (date: string | Date): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(targetDate)) {
    return format(targetDate, 'HH:mm')
  }
  
  if (isYesterday(targetDate)) {
    return 'Dün'
  }
  
  if (isThisWeek(targetDate)) {
    return format(targetDate, 'EEEE', { locale: tr })
  }
  
  if (isThisYear(targetDate)) {
    return format(targetDate, 'dd MMM', { locale: tr })
  }
  
  return format(targetDate, 'dd/MM/yyyy')
}

export const formatDueDate = (date: string | Date): { text: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const daysDiff = differenceInDays(targetDate, now)
  
  if (daysDiff < 0) {
    return {
      text: `${Math.abs(daysDiff)} gün gecikti`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false
    }
  }
  
  if (daysDiff === 0) {
    return {
      text: 'Bugün',
      isOverdue: false,
      isToday: true,
      isTomorrow: false
    }
  }
  
  if (daysDiff === 1) {
    return {
      text: 'Yarın',
      isOverdue: false,
      isToday: false,
      isTomorrow: true
    }
  }
  
  if (daysDiff <= 7) {
    return {
      text: `${daysDiff} gün sonra`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false
    }
  }
  
  return {
    text: format(targetDate, 'dd MMM yyyy', { locale: tr }),
    isOverdue: false,
    isToday: false,
    isTomorrow: false
  }
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} dakika`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} saat`
  }
  
  return `${hours} saat ${remainingMinutes} dakika`
}

// =====================================================
// File Utilities
// =====================================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  return imageExtensions.includes(getFileExtension(filename))
}

export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  return documentExtensions.includes(getFileExtension(filename))
}

export const isSpreadsheetFile = (filename: string): boolean => {
  const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods']
  return spreadsheetExtensions.includes(getFileExtension(filename))
}

export const isPresentationFile = (filename: string): boolean => {
  const presentationExtensions = ['ppt', 'pptx', 'odp']
  return presentationExtensions.includes(getFileExtension(filename))
}

export const getFileTypeIcon = (filename: string): string => {
  const extension = getFileExtension(filename)
  
  if (isImageFile(filename)) return '🖼️'
  if (isDocumentFile(filename)) return '📄'
  if (isSpreadsheetFile(filename)) return '📊'
  if (isPresentationFile(filename)) return '📑'
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) return '🎥'
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) return '🎵'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return '📦'
  
  return '📎'
}

// =====================================================
// Text Utilities
// =====================================================

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }
  
  return mentions
}

export const highlightMentions = (text: string): string => {
  return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .trim()
}

// =====================================================
// Validation Utilities
// =====================================================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Turkish phone number format
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateTaskTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: 'Görev başlığı boş olamaz' }
  }
  
  if (title.length < 3) {
    return { isValid: false, error: 'Görev başlığı en az 3 karakter olmalıdır' }
  }
  
  if (title.length > 100) {
    return { isValid: false, error: 'Görev başlığı en fazla 100 karakter olabilir' }
  }
  
  return { isValid: true }
}

export const validateMeetingTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: 'Toplantı başlığı boş olamaz' }
  }
  
  if (title.length < 3) {
    return { isValid: false, error: 'Toplantı başlığı en az 3 karakter olmalıdır' }
  }
  
  if (title.length > 150) {
    return { isValid: false, error: 'Toplantı başlığı en fazla 150 karakter olabilir' }
  }
  
  return { isValid: true }
}

export const validateDateRange = (startDate: Date, endDate: Date): { isValid: boolean; error?: string } => {
  if (startDate >= endDate) {
    return { isValid: false, error: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır' }
  }
  
  const now = new Date()
  if (startDate < now) {
    return { isValid: false, error: 'Başlangıç tarihi geçmiş bir tarih olamaz' }
  }
  
  return { isValid: true }
}

// =====================================================
// Search and Filter Utilities
// =====================================================

export const createSearchFilter = <T>(
  items: T[], 
  searchTerm: string, 
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items
  
  const lowerSearchTerm = searchTerm.toLowerCase()
  
  return items.filter(item => 
    searchFields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm)
      }
      return false
    })
  )
}

export const createMultiFilter = <T>(
  items: T[],
  filters: { [key in keyof T]?: unknown }
): T[] => {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      
      const itemValue = item[key as keyof T]
      
      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }
      
      return itemValue === value
    })
  })
}

// =====================================================
// Priority and Status Utilities
// =====================================================

export const getPriorityValue = (priority: 'low' | 'medium' | 'high' | 'urgent'): number => {
  const priorityValues = { low: 1, medium: 2, high: 3, urgent: 4 }
  return priorityValues[priority] || 1
}

export const sortByPriority = <T extends { priority: 'low' | 'medium' | 'high' | 'urgent' }>(
  items: T[], 
  descending = true
): T[] => {
  return [...items].sort((a, b) => {
    const valueA = getPriorityValue(a.priority)
    const valueB = getPriorityValue(b.priority)
    return descending ? valueB - valueA : valueA - valueB
  })
}

export const sortByDate = <T extends { created_at: string } | { updated_at: string } | { due_date?: string }>(
  items: T[],
  field: keyof T,
  descending = true
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[field] as string)
    const dateB = new Date(b[field] as string)
    return descending ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })
}

// =====================================================
// Notification Utilities
// =====================================================

export const shouldSendNotification = (
  lastNotificationDate?: string,
  minIntervalMinutes = 30
): boolean => {
  if (!lastNotificationDate) return true
  
  const lastNotification = new Date(lastNotificationDate)
  const now = new Date()
  const diffMinutes = differenceInMinutes(now, lastNotification)
  
  return diffMinutes >= minIntervalMinutes
}

export const getNotificationMessage = (
  type: 'task_assigned' | 'task_due' | 'meeting_reminder' | 'message_received',
  data: { title?: string; name?: string; dueDate?: string }
): { title: string; message: string } => {
  switch (type) {
    case 'task_assigned':
      return {
        title: 'Yeni Görev Atandı',
        message: `"${data.title}" görevi size atandı.`
      }
    
    case 'task_due':
      return {
        title: 'Görev Süresi Yaklaşıyor',
        message: `"${data.title}" görevinin süresi ${formatDueDate(data.dueDate!).text}.`
      }
    
    case 'meeting_reminder':
      return {
        title: 'Toplantı Hatırlatması',
        message: `"${data.title}" toplantısı yaklaşıyor.`
      }
    
    case 'message_received':
      return {
        title: 'Yeni Mesaj',
        message: `${data.name} size mesaj gönderdi.`
      }
    
    default:
      return {
        title: 'Bildirim',
        message: 'Yeni bir bildiriminiz var.'
      }
  }
}

// =====================================================
// Permission Utilities
// =====================================================

export const checkModuleAccess = (
  userRole: string
): { canView: boolean; canCreate: boolean; canEdit: boolean; canDelete: boolean } => {
  const permissions = {
    super_admin: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    admin: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    manager: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    coordinator: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    operator: { canView: true, canCreate: true, canEdit: false, canDelete: false },
    viewer: { canView: true, canCreate: false, canEdit: false, canDelete: false }
  }
  
  return permissions[userRole as keyof typeof permissions] || permissions.viewer
}

// =====================================================
// Export Utilities
// =====================================================

export const generateCSVContent = <T>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string => {
  const csvHeaders = headers.map(h => h.label).join(',')
  const csvRows = data.map(item => 
    headers.map(h => {
      const value = item[h.key]
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// =====================================================
// Message Formatting Utilities
// =====================================================

export const formatMessage = (message: {
  id: string
  content: string
  sender: string
  timestamp: string
  type: string
}) => {
  return {
    id: message.id,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
    type: message.type
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'text-green-500'
    case 'offline':
      return 'text-gray-400'
    case 'away':
      return 'text-yellow-500'
    default:
      return 'text-gray-400'
  }
}

export const getInitials = (name: string): string => {
  if (!name.trim()) return ''
  
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export const groupByDate = <T extends Record<string, unknown>>(
  items: T[],
  dateField: keyof T
): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {}
  
  items.forEach(item => {
    const date = item[dateField]
    if (date) {
      const dateValue = typeof date === 'string' || typeof date === 'number' || date instanceof Date ? date : String(date)
      const dateKey = new Date(dateValue).toISOString().split('T')[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(item)
    }
  })
  
  return grouped
}

// =====================================================
// Local Storage Utilities
// =====================================================

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return defaultValue
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}
