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
      className={cn('bg-white border border-gray-200 rounded-lg shadow-sm', className)}
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
    <div className={cn('p-6 border-b border-gray-200', className)}>
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
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
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
    <p className={cn('text-sm text-gray-600 mt-1', className)}>
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
    <div className={cn('p-6', className)}>
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
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
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
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent hover:bg-gray-100',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
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
      <div className={cn('w-full border border-gray-300 rounded-lg', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full border border-gray-300 rounded-lg overflow-hidden', className)}>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <div className="text-gray-500">
                  Veri bulunamadı
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
    <table className={cn('w-full border-collapse border border-gray-300', className)}>
      {children}
    </table>
  )
}

export const CorporateTableHeader: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  )
}

export const CorporateTableHeaderCell: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <th className={cn('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50', className)}>
      {children}
    </th>
  )
}

export const CorporateTableRow: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <tr className={cn('border-b border-gray-200 hover:bg-gray-50', className)}>
      {children}
    </tr>
  )
}

export const CorporateTableCell: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}>
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
    <div className={cn('space-y-4', className)}>
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
    <label htmlFor={htmlFor} className={cn('block text-sm font-medium text-gray-700 mb-1', className)}>
      {children}
    </label>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', className)}
        {...props}
      />
    )
  }
)

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn('w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical', className)}
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
      className={cn('w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white', className)}
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
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50', className)} onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export const CorporateModalHeader: React.FC<CorporateTableProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

export const CorporateModalTitle: React.FC<CorporateCardTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  )
}

export const CorporateModalBody: React.FC<CorporateCardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export const CorporateModalFooter: React.FC<CorporateCardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2', className)}>
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
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className={cn('p-4 border rounded-lg', variantClasses[variant], className)}>
      {title && (
        <div className="font-medium mb-1">
          {title}
        </div>
      )}
      {description && (
        <div className="text-sm">
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
    success: 'bg-green-500 h-2 rounded-full transition-all duration-300',
    warning: 'bg-yellow-500 h-2 rounded-full transition-all duration-300',
    danger: 'bg-red-500 h-2 rounded-full transition-all duration-300'
  }

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
      <div
        className={cn('h-2 rounded-full transition-all duration-300', variantClasses[variant] || 'bg-blue-500')}
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
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
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
    <div className={cn('p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer', className)} onClick={onClick}>
      <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4', iconBgColor)}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
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
    <div className={cn('p-4 border border-gray-200 rounded-lg', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {change && (
          <span className={cn('text-xs font-medium', change.isPositive ? 'text-green-600' : 'text-red-600')}>
            {change.isPositive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
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
    <div className={cn('relative', className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    online: 'w-2 h-2 bg-green-500 rounded-full',
    offline: 'w-2 h-2 bg-gray-400 rounded-full',
    away: 'w-2 h-2 bg-yellow-500 rounded-full',
    busy: 'w-2 h-2 bg-red-500 rounded-full'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-2 h-2 rounded-full', statusClasses[status])} />
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
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('object-cover', sizeClasses[size], 'rounded-full', className)}
      />
    )
  }

  return (
    <div className={cn('flex items-center justify-center bg-gray-200 rounded-full', sizeClasses[size], className)}>
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
    <div className={cn('text-center py-8 text-muted-foreground', className)}>
      {icon && <div className="text-gray-400 mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
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
