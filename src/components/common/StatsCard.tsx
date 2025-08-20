import React from 'react'
import { CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle } from '@/components/ui/corporate/CorporateComponents'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  className?: string
  iconColor?: string
  valueColor?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconColor = 'text-muted-foreground',
  valueColor = 'text-foreground'
}) => {
  return (
    <CorporateCard className={cn('', className)}>
      <CorporateCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CorporateCardTitle className="text-sm font-medium">{title}</CorporateCardTitle>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </CorporateCardHeader>
      <CorporateCardContent>
        <div className={cn('text-2xl font-bold', valueColor)}>
          {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
            )}
          </div>
        )}
      </CorporateCardContent>
    </CorporateCard>
  )
}

export interface StatsGridProps {
  stats: StatsCardProps[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default StatsCard