import React from 'react'
import { CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle, CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { StatsGrid, StatsCardProps } from './StatsCard'
import { LucideIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export interface DashboardSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export interface DashboardLayoutProps {
  header: DashboardHeaderProps
  stats?: StatsCardProps[]
  statsColumns?: 1 | 2 | 3 | 4
  sections?: DashboardSectionProps[]
  children?: React.ReactNode
  className?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className
}) => {
  return (
    <CorporateCard className={cn('', className)}>
      <CorporateCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            <div>
              <CorporateCardTitle>{title}</CorporateCardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </CorporateCardHeader>
      <CorporateCardContent>
        {children}
      </CorporateCardContent>
    </CorporateCard>
  )
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  stats,
  statsColumns = 4,
  sections,
  children,
  className
}) => {
  return (
    <div className={cn('container mx-auto p-6 bg-card rounded-lg border space-y-6', className)}>
      <DashboardHeader {...header} />
      
      {stats && stats.length > 0 && (
        <StatsGrid stats={stats} columns={statsColumns} />
      )}
      
      {sections && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <DashboardSection key={index} {...section} />
          ))}
        </div>
      )}
      
      {children}
    </div>
  )
}

// Utility functions for common dashboard patterns
export const createAddButton = (label: string, onClick: () => void) => (
  <CorporateButton size="sm" onClick={onClick}>
    <Plus className="h-4 w-4 mr-2" />
    {label}
  </CorporateButton>
)

export const createViewButton = (label: string, onClick: () => void) => (
  <CorporateButton variant="outline" size="sm" onClick={onClick}>
    {label}
  </CorporateButton>
)

export default DashboardLayout