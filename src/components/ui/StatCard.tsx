import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ReactNode } from 'react'

/*
 * StatCard Component - Statistical information display
 * 
 * WHY: Dashboard ve analitik veriler için tutarlı kart bileşeni
 * HOW: İkon, başlık, değer ve trend göstergesi ile veri görselleştirmesi
 */

export interface StatCardProps {
    title: string
    value: string | number
    icon?: ReactNode
    description?: string
    trend?: {
        value: number
        label?: string
        direction?: 'up' | 'down' | 'neutral'
    }
    color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
    loading?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function StatCard({
    title,
    value,
    icon,
    description,
    trend,
    color = 'default',
    loading = false,
    className = '',
    size = 'md'
}: StatCardProps) {
    const sizeClasses = {
        sm: {
            container: 'p-4',
            icon: 'w-8 h-8',
            value: 'text-2xl',
            title: 'text-sm'
        },
        md: {
            container: 'p-6',
            icon: 'w-10 h-10',
            value: 'text-3xl',
            title: 'text-base'
        },
        lg: {
            container: 'p-8',
            icon: 'w-12 h-12',
            value: 'text-4xl',
            title: 'text-lg'
        }
    }

    const colorClasses = {
        default: {
            card: 'bg-surface border-border',
            icon: 'text-ink-3',
            value: 'text-ink-1'
        },
        primary: {
            card: 'bg-primary/5 border-primary/20',
            icon: 'text-primary',
            value: 'text-ink-1'
        },
        success: {
            card: 'bg-success/5 border-success/20',
            icon: 'text-success',
            value: 'text-ink-1'
        },
        warning: {
            card: 'bg-warning/5 border-warning/20',
            icon: 'text-warning',
            value: 'text-ink-1'
        },
        danger: {
            card: 'bg-danger/5 border-danger/20',
            icon: 'text-danger',
            value: 'text-ink-1'
        },
        info: {
            card: 'bg-info/5 border-info/20',
            icon: 'text-info',
            value: 'text-ink-1'
        }
    }

    const sizes = sizeClasses[size]
    const colors = colorClasses[color]

    if (loading) {
        return <StatCardSkeleton size={size} className={className} />
    }

    return (
        <div className={`
      ${colors.card} 
      border rounded-lg 
      transition-all duration-normal 
      hover:shadow-card
      ${sizes.container}
      ${className}
    `}>
            <div className="flex items-start justify-between">
                {/* Content */}
                <div className="min-w-0 flex-1">
                    <p className={`font-medium text-ink-3 ${sizes.title} mb-1`}>
                        {title}
                    </p>
                    <p className={`font-bold ${colors.value} ${sizes.value} mb-2`}>
                        {typeof value === 'number' ? formatNumber(value) : value}
                    </p>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-ink-3 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Trend */}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendIcon direction={trend.direction} />
                            <span className={`text-sm font-medium ${getTrendColor(trend.direction)}`}>
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </span>
                            {trend.label && (
                                <span className="text-sm text-ink-3">
                                    {trend.label}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon */}
                {icon && (
                    <div className={`${colors.icon} ${sizes.icon} flex-shrink-0 ml-4`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

// Trend Icon Component
function TrendIcon({ direction }: { direction?: 'up' | 'down' | 'neutral' }) {
    const iconProps = { className: "w-4 h-4" }

    switch (direction) {
        case 'up':
            return <TrendingUp {...iconProps} className={`${iconProps.className} text-success`} />
        case 'down':
            return <TrendingDown {...iconProps} className={`${iconProps.className} text-danger`} />
        case 'neutral':
        default:
            return <Minus {...iconProps} className={`${iconProps.className} text-ink-3`} />
    }
}

// Trend color helper
function getTrendColor(direction?: 'up' | 'down' | 'neutral'): string {
    switch (direction) {
        case 'up':
            return 'text-success'
        case 'down':
            return 'text-danger'
        case 'neutral':
        default:
            return 'text-ink-3'
    }
}

// Number formatting utility
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString('tr-TR')
}

// Loading Skeleton
interface StatCardSkeletonProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

function StatCardSkeleton({ size = 'md', className = '' }: StatCardSkeletonProps) {
    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    return (
        <div className={`
      bg-surface border border-border rounded-lg 
      ${sizeClasses[size]}
      ${className}
    `}>
            <div className="animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-3"></div>
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                    <div className="w-10 h-10 bg-muted rounded ml-4"></div>
                </div>
            </div>
        </div>
    )
}

// StatCard Group Component - Multiple stat cards in a grid
export interface StatCardGroupProps {
    cards: StatCardProps[]
    columns?: 1 | 2 | 3 | 4
    gap?: 'sm' | 'md' | 'lg'
    className?: string
}

export function StatCardGroup({
    cards,
    columns = 4,
    gap = 'md',
    className = ''
}: StatCardGroupProps) {
    const columnClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }

    const gapClasses = {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8'
    }

    return (
        <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    )
}
