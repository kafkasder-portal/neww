import { cn } from '@utils/classNames'

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'dnd'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const statusConfig = {
  online: {
    label: 'Çevrimiçi',
    color: 'bg-financial-success',
    icon: '🟢'
  },
  offline: {
    label: 'Çevrimdışı',
    color: 'bg-neutral-500',
    icon: '⚫'
  },
  away: {
    label: 'Uzakta',
    color: 'bg-financial-warning',
    icon: '🟡'
  },
  busy: {
    label: 'Meşgul',
    color: 'bg-financial-error',
    icon: '🔴'
  },
  dnd: {
    label: 'Rahatsız Etmeyin',
    color: 'bg-chart-5',
    icon: '🟣'
  }
} as const

export function StatusBadge({ 
  status, 
  size = 'md', 
  showLabel = true, 
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status]
  
  if (!config) {
    return null
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className={cn(
        'rounded-full',
        config.color,
        sizeClasses[size]
      )} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {config.label}
        </span>
      )}
    </div>
  )
}
