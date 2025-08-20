import { cn } from '@/lib/utils'
import React from 'react'

/* ========================================
 * SIDEBAR-ALIGNED CARD COMPONENTS
 * ======================================== */

interface CorporateCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const CorporateCard: React.FC<CorporateCardProps> = ({
  children,
  className,
  onClick
}) => {
  return (
    <div
      className={cn('corporate-card', className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CorporateCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CorporateCardHeader: React.FC<CorporateCardHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('corporate-card-header', className)}>
      {children}
    </div>
  )
}

interface CorporateCardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CorporateCardTitle: React.FC<CorporateCardTitleProps> = ({
  children,
  className
}) => {
  return (
    <h3 className={cn('corporate-card-title', className)}>
      {children}
    </h3>
  )
}

interface CorporateCardSubtitleProps {
  children: React.ReactNode
  className?: string
}

export const CorporateCardSubtitle: React.FC<CorporateCardSubtitleProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn('corporate-card-subtitle', className)}>
      {children}
    </p>
  )
}

interface CorporateCardContentProps {
  children: React.ReactNode
  className?: string
}

export const CorporateCardContent: React.FC<CorporateCardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('corporate-card-content', className)}>
      {children}
    </div>
  )
}

interface CorporateCardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CorporateCardFooter: React.FC<CorporateCardFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('corporate-card-footer', className)}>
      {children}
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED KPI CARD
 * ======================================== */

interface KPICardProps {
  title: string
  value: string
  change?: { value: number; isPositive: boolean }
  icon?: React.ReactNode
  className?: string
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  className
}) => {
  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{value}</p>
          {change && (
            <p className={cn('kpi-change', change.isPositive ? 'positive' : 'negative')}>
              {change.isPositive ? '+' : ''}{change.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-brand-primary-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED BUTTON COMPONENTS
 * ======================================== */

interface CorporateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
}

export const CorporateButton: React.FC<CorporateButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const variantClasses = {
    primary: 'corporate-btn-primary',
    secondary: 'corporate-btn-secondary',
    success: 'corporate-btn-success',
    danger: 'corporate-btn-danger',
    ghost: 'corporate-btn-ghost',
    outline: 'corporate-btn-outline'
  }

  const sizeClasses = {
    sm: 'corporate-btn-sm',
    md: 'corporate-btn-md',
    lg: 'corporate-btn-lg',
    xl: 'corporate-btn-xl'
  }

  return (
    <button
      className={cn(
        'corporate-btn',
        variant === 'icon' ? '' : variantClasses[variant as keyof typeof variantClasses],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Alias for backward compatibility
export const Button = CorporateButton

/* ========================================
 * SIDEBAR-ALIGNED TABLE COMPONENTS
 * ======================================== */

interface CorporateTableProps {
  children: React.ReactNode
  className?: string
}

interface CorporateTableDataProps<T> {
  columns: Array<{
    key: string
    title: string
    render?: (item: T) => React.ReactNode
  }>
  data: T[]
  loading?: boolean
  className?: string
}

export const CorporateTable = <T,>({ columns, data, loading, className }: CorporateTableDataProps<T>) => {
  if (loading) {
    return (
      <div className={cn('corporate-table-loading', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-primary-600"></div>
          <span className="ml-2 text-corporate-neutral-600">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('corporate-table-container', className)}>
      <table className="corporate-table">
        <thead className="corporate-table-header">
          <tr className="corporate-table-row">
            {columns.map((column) => (
              <th key={column.key} className="corporate-table-header-cell">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="corporate-table-cell text-center py-8">
                <div className="text-corporate-neutral-500">
                  Veri bulunamadı
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="corporate-table-row">
                {columns.map((column) => (
                  <td key={column.key} className="corporate-table-cell">
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Simple table components for manual usage
export const CorporateTableSimple: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <table className={cn('corporate-table', className)}>
      {children}
    </table>
  )
}

export const CorporateTableHeader: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <thead className={cn('corporate-table-header', className)}>
      {children}
    </thead>
  )
}

export const CorporateTableHeaderCell: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <th className={cn('corporate-table-header-cell', className)}>
      {children}
    </th>
  )
}

export const CorporateTableRow: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <tr className={cn('corporate-table-row', className)}>
      {children}
    </tr>
  )
}

export const CorporateTableCell: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <td className={cn('corporate-table-cell', className)}>
      {children}
    </td>
  )
}

// Aliases for backward compatibility
export const Table = CorporateTable
export const TableHeader = CorporateTableHeader
export const TableHeaderCell = CorporateTableHeaderCell
export const TableRow = CorporateTableRow
export const TableCell = CorporateTableCell

/* ========================================
 * SIDEBAR-ALIGNED FORM COMPONENTS
 * ======================================== */

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => {
  return (
    <div className={cn('corporate-form-group', className)}>
      {children}
    </div>
  )
}

interface FormLabelProps {
  children: React.ReactNode
  htmlFor?: string
  className?: string
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={cn('corporate-form-label', className)}>
      {children}
    </label>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const FormInput: React.FC<FormInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn('corporate-form-input', className)}
      {...props}
    />
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn('corporate-form-textarea', className)}
      {...props}
    />
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  className?: string
}

export const FormSelect: React.FC<FormSelectProps> = ({ children, className, ...props }) => {
  return (
    <select
      className={cn('corporate-form-select', className)}
      {...props}
    >
      {children}
    </select>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED MODAL COMPONENTS
 * ======================================== */

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const CorporateModal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null

  return (
    <div className={cn('corporate-modal', className)} onClick={onClose}>
      <div className="corporate-modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export const CorporateModalHeader: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <div className={cn('corporate-modal-header', className)}>
      {children}
    </div>
  )
}

export const CorporateModalTitle: React.FC<CorporateCardTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn('corporate-modal-title', className)}>
      {children}
    </h2>
  )
}

export const CorporateModalBody: React.FC<CorporateCardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('corporate-modal-body', className)}>
      {children}
    </div>
  )
}

export const CorporateModalFooter: React.FC<CorporateCardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('corporate-modal-footer', className)}>
      {children}
    </div>
  )
}

// Aliases for backward compatibility
export const Modal = CorporateModal
export const ModalHeader = CorporateModalHeader
export const ModalTitle = CorporateModalTitle
export const ModalBody = CorporateModalBody
export const ModalFooter = CorporateModalFooter

/* ========================================
 * SIDEBAR-ALIGNED ALERT COMPONENTS
 * ======================================== */

interface AlertProps {
  variant?: 'success' | 'warning' | 'danger' | 'info'
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export const CorporateAlert: React.FC<AlertProps> = ({ 
  variant = 'info', 
  title, 
  description, 
  children, 
  className 
}) => {
  const variantClasses = {
    success: 'corporate-alert-success',
    warning: 'corporate-alert-warning',
    danger: 'corporate-alert-danger',
    info: 'corporate-alert-info'
  }

  return (
    <div className={cn('corporate-alert', variantClasses[variant], className)}>
      {title && (
        <div className="corporate-alert-title">
          {title}
        </div>
      )}
      {description && (
        <div className="corporate-alert-description">
          {description}
        </div>
      )}
      {children}
    </div>
  )
}

// Alias for backward compatibility
export const Alert = CorporateAlert

/* ========================================
 * SIDEBAR-ALIGNED PROGRESS COMPONENTS
 * ======================================== */

interface ProgressProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export const CorporateProgress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  className
}) => {
  const percentage = (value / max) * 100
  const variantClasses = {
    default: '',
    success: 'corporate-progress-success',
    warning: 'corporate-progress-warning',
    danger: 'corporate-progress-danger'
  }

  return (
    <div className={cn('corporate-progress', className)}>
      <div
        className={cn('corporate-progress-bar', variantClasses[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Alias for backward compatibility
export const Progress = CorporateProgress

/* ========================================
 * SIDEBAR-ALIGNED BADGE COMPONENTS
 * ======================================== */

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export const CorporateBadge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className }) => {
  const variantClasses = {
    success: 'corporate-badge-success',
    warning: 'corporate-badge-warning',
    danger: 'corporate-badge-danger',
    info: 'corporate-badge-info',
    neutral: 'corporate-badge-neutral'
  }

  return (
    <span className={cn('corporate-badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

// Alias for backward compatibility
export const Badge = CorporateBadge

/* ========================================
 * SIDEBAR-ALIGNED QUICK ACCESS CARD
 * ======================================== */

interface QuickAccessCardProps {
  icon: React.ReactNode
  title: string
  description: string
  iconBgColor?: string
  onClick?: () => void
  className?: string
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  icon,
  title,
  description,
  iconBgColor = 'bg-brand-primary-600',
  onClick,
  className
}) => {
  return (
    <div className={cn('corporate-quick-access', className)} onClick={onClick}>
      <div className={cn('corporate-quick-access-icon', iconBgColor)}>
        {icon}
      </div>
      <h3 className="corporate-quick-access-title">{title}</h3>
      <p className="corporate-quick-access-description">{description}</p>
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED STATISTICS CARD
 * ======================================== */

interface StatisticsCardProps {
  title: string
  value: string
  change?: { value: number; isPositive: boolean }
  className?: string
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  className
}) => {
  return (
    <div className={cn('corporate-statistics', className)}>
      <div className="corporate-statistics-header">
        <span className="corporate-statistics-title">{title}</span>
        {change && (
          <span className={cn('corporate-statistics-change', change.isPositive ? 'positive' : 'negative')}>
            {change.isPositive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      <div className="corporate-statistics-value">{value}</div>
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED SEARCH COMPONENT
 * ======================================== */

interface SearchProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const CorporateSearch: React.FC<SearchProps> = ({
  placeholder = 'Ara...',
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn('corporate-search', className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="corporate-search-input"
      />
      <svg className="corporate-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  )
}

// Alias for backward compatibility
export const Search = CorporateSearch

/* ========================================
 * SIDEBAR-ALIGNED STATUS INDICATOR
 * ======================================== */

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  label?: string
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className
}) => {
  const statusClasses = {
    online: 'corporate-status-dot-online',
    offline: 'corporate-status-dot-offline',
    away: 'corporate-status-dot-away',
    busy: 'corporate-status-dot-busy'
  }

  return (
    <div className={cn('corporate-status', className)}>
      <div className={cn('corporate-status-dot', statusClasses[status])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED AVATAR COMPONENTS
 * ======================================== */

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children?: React.ReactNode
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  children,
  className
}) => {
  const sizeClasses = {
    sm: 'corporate-avatar-sm',
    md: 'corporate-avatar-md',
    lg: 'corporate-avatar-lg',
    xl: 'corporate-avatar-xl'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('corporate-avatar', sizeClasses[size], 'rounded-lg', className)}
      />
    )
  }

  return (
    <div className={cn('corporate-avatar', sizeClasses[size], className)}>
      {children}
    </div>
  )
}

/* ========================================
 * SIDEBAR-ALIGNED EMPTY STATE
 * ======================================== */

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <div className={cn('corporate-empty', className)}>
      {icon && <div className="corporate-empty-icon">{icon}</div>}
      <h3 className="corporate-empty-title">{title}</h3>
      <p className="corporate-empty-description">{description}</p>
    </div>
  )
}

/* ========================================
 * EXPORT ALL COMPONENTS
 * ======================================== */

export {
  CorporateCard as Card,
  CorporateCardContent as CardContent,
  CorporateCardFooter as CardFooter,
  CorporateCardHeader as CardHeader,
  CorporateCardSubtitle as CardSubtitle,
  CorporateCardTitle as CardTitle
}



