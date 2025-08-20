import React from 'react'
import { clsx } from 'clsx'
import { ArrowUpRight, TrendingUp, TrendingDown, MoreVertical, Star, Heart, Bookmark } from 'lucide-react'

// Base Premium Card
interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  rounded = 'xl',
  hover = true,
  clickable = false,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }

  const variantClasses = {
    default: 'bg-card border border-border shadow-sm',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-brand-primary-500/10 via-brand-secondary-500/5 to-brand-accent-500/10 border border-white/20 backdrop-blur-xl',
    elevated: 'bg-card border border-border shadow-premium'
  }

  return (
    <div
      className={clsx(
        'transition-all duration-300 ease-out',
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        hover && 'hover:shadow-lg hover:-translate-y-1',
        clickable && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  )
}

// Stats Card
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period?: string
  }
  icon?: React.ComponentType<any>
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  gradient?: boolean
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'default',
  gradient = false,
  className
}) => {
  const colorClasses = {
    default: gradient ? 'from-neutral-500 to-neutral-600' : 'text-neutral-600',
    success: gradient ? 'from-semantic-success to-semantic-success' : 'text-semantic-success',
    warning: gradient ? 'from-semantic-warning to-semantic-warning' : 'text-semantic-warning',
    danger: gradient ? 'from-semantic-danger to-semantic-danger' : 'text-semantic-danger',
    info: gradient ? 'from-semantic-info to-semantic-info' : 'text-semantic-info'
  }

  return (
    <PremiumCard variant="glass" className={clsx('relative overflow-hidden', className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={clsx(
                'text-3xl font-bold tracking-tight',
                gradient ? `bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent` : colorClasses[color]
              )}>
                {value}
              </p>
            </div>

            {change && (
              <div className={clsx(
                'flex items-center gap-2 text-sm font-medium',
                change.type === 'increase' ? 'text-semantic-success' : 'text-semantic-danger'
              )}>
                {change.type === 'increase' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(change.value)}%</span>
                {change.period && (
                  <span className="text-muted-foreground">vs {change.period}</span>
                )}
              </div>
            )}
          </div>

          {Icon && (
            <div className={clsx(
              'p-3 rounded-2xl',
              gradient ? `bg-gradient-to-br ${colorClasses[color]}` : `bg-${color}/10`
            )}>
              <Icon className={clsx(
                'h-6 w-6',
                gradient ? 'text-white' : colorClasses[color]
              )} />
            </div>
          )}
        </div>
      </div>
    </PremiumCard>
  )
}

// Feature Card
interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ComponentType<any>
  image?: string
  badge?: string
  href?: string
  onClick?: () => void
  actions?: React.ReactNode
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  image,
  badge,
  href,
  onClick,
  actions,
  className
}) => {
  const CardWrapper = href ? 'a' : 'div'

  return (
    <PremiumCard 
      variant="glass" 
      clickable={!!onClick || !!href}
      onClick={onClick}
      className={clsx('group relative overflow-hidden', className)}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-primary-500 to-brand-primary-600">
                <Icon className="h-5 w-5 text-white" />
              </div>
            )}
            
            {badge && (
              <span className="badge-info text-xs">
                {badge}
              </span>
            )}
          </div>

          {actions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Link Arrow */}
        {(href || onClick) && (
          <div className="flex justify-end">
            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
        )}
      </div>
    </PremiumCard>
  )
}

// Dashboard Widget Card
interface WidgetCardProps {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
  loading?: boolean
  error?: string
  className?: string
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  action,
  loading = false,
  error,
  className
}) => {
  return (
    <PremiumCard variant="glass" className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse-premium" />
          <div className="h-4 bg-muted rounded animate-pulse-premium w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse-premium w-1/2" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-semantic-danger">
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        children
      )}
    </PremiumCard>
  )
}

// Profile Card
interface ProfileCardProps {
  name: string
  title?: string
  avatar?: string
  initials?: string
  description?: string
  stats?: Array<{ label: string; value: string | number }>
  actions?: React.ReactNode
  verified?: boolean
  className?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  avatar,
  initials,
  description,
  stats,
  actions,
  verified = false,
  className
}) => {
  return (
    <PremiumCard variant="glass" className={className}>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt={name} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-primary-500 to-brand-accent-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {initials || name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
            
            {verified && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-semantic-success flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            {title && (
              <p className="text-sm text-brand-primary-600 font-medium">{title}</p>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PremiumCard>
  )
}

// Notification Card
interface NotificationCardProps {
  title: string
  message: string
  time: string
  type?: 'info' | 'success' | 'warning' | 'danger'
  avatar?: string
  icon?: React.ComponentType<any>
  unread?: boolean
  actions?: React.ReactNode
  onClick?: () => void
  className?: string
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  time,
  type = 'info',
  avatar,
  icon: Icon,
  unread = false,
  actions,
  onClick,
  className
}) => {
  const typeColors = {
    info: 'border-semantic-info/30 bg-semantic-info/5',
    success: 'border-semantic-success/30 bg-semantic-success/5',
    warning: 'border-semantic-warning/30 bg-semantic-warning/5',
    danger: 'border-semantic-danger/30 bg-semantic-danger/5'
  }

  return (
    <PremiumCard 
      padding="md"
      clickable={!!onClick}
      onClick={onClick}
      className={clsx(
        'relative border-l-4 transition-all duration-300',
        typeColors[type],
        unread && 'ring-2 ring-brand-primary-500/20',
        className
      )}
    >
      {unread && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-primary-500 animate-glow" />
      )}

      <div className="flex items-start gap-3">
        {/* Avatar or Icon */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
          ) : Icon ? (
            <div className={clsx(
              'p-2 rounded-xl',
              `bg-semantic-${type}/20`
            )}>
              <Icon className={clsx('h-5 w-5', `text-semantic-${type}`)} />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {actions && (
            <div className="pt-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </PremiumCard>
  )
}

// Pricing Card
interface PricingCardProps {
  title: string
  price: string | number
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  buttonText?: string
  onSelect?: () => void
  className?: string
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period = 'aylık',
  description,
  features,
  highlighted = false,
  buttonText = 'Seç',
  onSelect,
  className
}) => {
  return (
    <PremiumCard 
      variant={highlighted ? 'gradient' : 'glass'}
      className={clsx(
        'relative overflow-hidden',
        highlighted && 'ring-2 ring-brand-primary-500 scale-105',
        className
      )}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-accent-500" />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground">₺/{period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-semantic-success/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-semantic-success" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onSelect}
          className={clsx(
            'btn-premium w-full',
            highlighted ? 'btn-primary' : 'btn-ghost'
          )}
        >
          {buttonText}
        </button>
      </div>
    </PremiumCard>
  )
}
