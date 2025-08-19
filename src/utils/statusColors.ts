/**
 * Consistent status color utilities for all components
 * Replaces hardcoded color combinations with CSS variables
 */

export type StatusType = 
  | 'success' | 'active' | 'approved' | 'completed' | 'delivered' | 'paid'
  | 'warning' | 'pending' | 'paused' | 'in-progress' | 'preparing'
  | 'error' | 'failed' | 'rejected' | 'cancelled' | 'inactive' | 'expired'
  | 'info' | 'neutral' | 'draft' | 'review' | 'waiting'

export type ColorVariant = 'light' | 'solid' | 'border'

/**
 * Get status color classes based on status type and variant
 */
export function getStatusColors(status: StatusType, variant: ColorVariant = 'light'): string {
  const statusMap = {
    // Success statuses (green)
    success: {
      light: 'status-success',
      solid: 'status-success-solid',
      border: 'status-success border'
    },
    active: {
      light: 'status-success',
      solid: 'status-success-solid', 
      border: 'status-success border'
    },
    approved: {
      light: 'status-success',
      solid: 'status-success-solid',
      border: 'status-success border'
    },
    completed: {
      light: 'status-success',
      solid: 'status-success-solid',
      border: 'status-success border'
    },
    delivered: {
      light: 'status-success',
      solid: 'status-success-solid',
      border: 'status-success border'
    },
    paid: {
      light: 'status-success',
      solid: 'status-success-solid',
      border: 'status-success border'
    },

    // Warning statuses (orange/yellow)
    warning: {
      light: 'status-warning',
      solid: 'status-warning-solid',
      border: 'status-warning border'
    },
    pending: {
      light: 'status-warning',
      solid: 'status-warning-solid',
      border: 'status-warning border'
    },
    paused: {
      light: 'status-warning',
      solid: 'status-warning-solid',
      border: 'status-warning border'
    },
    'in-progress': {
      light: 'status-warning',
      solid: 'status-warning-solid',
      border: 'status-warning border'
    },
    preparing: {
      light: 'status-warning',
      solid: 'status-warning-solid',
      border: 'status-warning border'
    },

    // Error statuses (red)
    error: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },
    failed: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },
    rejected: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },
    cancelled: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },
    inactive: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },
    expired: {
      light: 'status-error',
      solid: 'status-error-solid',
      border: 'status-error border'
    },

    // Info statuses (blue)
    info: {
      light: 'status-info',
      solid: 'status-info-solid',
      border: 'status-info border'
    },
    review: {
      light: 'status-info',
      solid: 'status-info-solid',
      border: 'status-info border'
    },

    // Neutral statuses (gray)
    neutral: {
      light: 'status-pending',
      solid: 'status-pending-solid',
      border: 'status-pending border'
    },
    draft: {
      light: 'status-pending',
      solid: 'status-pending-solid',
      border: 'status-pending border'
    },
    waiting: {
      light: 'status-pending',
      solid: 'status-pending-solid',
      border: 'status-pending border'
    }
  }

  return statusMap[status]?.[variant] || statusMap.neutral[variant]
}

/**
 * Common status mappings for specific domains
 */

// Payment statuses
export function getPaymentStatusColors(status: string): string {
  const normalizedStatus = status.toLowerCase()
  
  if (['ödendi', 'paid', 'başarılı', 'successful'].includes(normalizedStatus)) {
    return getStatusColors('paid')
  }
  if (['beklemede', 'pending', 'processing'].includes(normalizedStatus)) {
    return getStatusColors('pending')
  }
  if (['başarısız', 'failed', 'error'].includes(normalizedStatus)) {
    return getStatusColors('failed')
  }
  if (['iptal', 'cancelled', 'canceled'].includes(normalizedStatus)) {
    return getStatusColors('cancelled')
  }
  if (['kısmi', 'partial'].includes(normalizedStatus)) {
    return getStatusColors('warning')
  }
  
  return getStatusColors('neutral')
}

// General activity statuses
export function getActivityStatusColors(status: string): string {
  const normalizedStatus = status.toLowerCase()
  
  if (['aktif', 'active', 'açık', 'open'].includes(normalizedStatus)) {
    return getStatusColors('active')
  }
  if (['tamamlandı', 'completed', 'done', 'finished'].includes(normalizedStatus)) {
    return getStatusColors('completed')
  }
  if (['beklemede', 'pending', 'waiting'].includes(normalizedStatus)) {
    return getStatusColors('pending')
  }
  if (['iptal', 'cancelled', 'canceled', 'kapalı', 'closed'].includes(normalizedStatus)) {
    return getStatusColors('cancelled')
  }
  if (['pasif', 'inactive', 'disabled'].includes(normalizedStatus)) {
    return getStatusColors('inactive')
  }
  
  return getStatusColors('neutral')
}

// Donation-specific statuses
export function getDonationStatusColors(status: string): string {
  const normalizedStatus = status.toLowerCase()
  
  if (['onaylandı', 'approved', 'eşleştirildi', 'matched'].includes(normalizedStatus)) {
    return getStatusColors('approved')
  }
  if (['beklemede', 'pending', 'processing'].includes(normalizedStatus)) {
    return getStatusColors('pending')
  }
  if (['reddedildi', 'rejected', 'declined'].includes(normalizedStatus)) {
    return getStatusColors('rejected')
  }
  
  return getActivityStatusColors(status)
}

// Organization/Institution type colors
export function getInstitutionTypeColors(type: string): string {
  const typeColorMap: Record<string, string> = {
    'şirket': 'status-info',
    'company': 'status-info',
    'vakıf': 'status-success',
    'foundation': 'status-success',
    'dernek': 'bg-brand-100 text-brand-800 border-brand-200',
    'association': 'bg-brand-100 text-brand-800 border-brand-200',
    'okul': 'bg-neutral-100 text-neutral-700 border-neutral-200',
    'school': 'bg-neutral-100 text-neutral-700 border-neutral-200'
  }
  
  return typeColorMap[type.toLowerCase()] || 'status-pending'
}

/**
 * Priority level colors
 */
export function getPriorityColors(priority: string): string {
  const normalizedPriority = priority.toLowerCase()
  
  if (['kritik', 'critical', 'urgent', 'high'].includes(normalizedPriority)) {
    return getStatusColors('error')
  }
  if (['yüksek', 'important', 'medium-high'].includes(normalizedPriority)) {
    return getStatusColors('warning')
  }
  if (['orta', 'medium', 'normal'].includes(normalizedPriority)) {
    return getStatusColors('info')
  }
  if (['düşük', 'low'].includes(normalizedPriority)) {
    return getStatusColors('neutral')
  }
  
  return getStatusColors('neutral')
}

/**
 * Generic status badge component classes
 */
export function getStatusBadgeClasses(status: string, type: 'payment' | 'activity' | 'donation' | 'priority' | 'institution' = 'activity'): string {
  const baseClasses = 'px-2 py-1 rounded text-xs font-medium border'
  
  let statusClasses = ''
  switch (type) {
    case 'payment':
      statusClasses = getPaymentStatusColors(status)
      break
    case 'donation':
      statusClasses = getDonationStatusColors(status)
      break
    case 'priority':
      statusClasses = getPriorityColors(status)
      break
    case 'institution':
      statusClasses = getInstitutionTypeColors(status)
      break
    default:
      statusClasses = getActivityStatusColors(status)
  }
  
  return `${baseClasses} ${statusClasses}`
}
