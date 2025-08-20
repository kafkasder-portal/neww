import { ChevronRight, Home } from 'lucide-react'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/*
 * PageHeader Component - Sticky header with breadcrumbs and actions
 * 
 * WHY: Uzun sayfalarda navigasyon ve eylem erişimi için sticky header gerekli
 * HOW: Breadcrumb navigasyonu ve action buttonları ile tutarlı sayfa başlığı sistemi
 */

export interface BreadcrumbItem {
    label: string
    href?: string
    icon?: ReactNode
}

export interface PageAction {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost' | 'danger'
    icon?: ReactNode
    disabled?: boolean
}

export interface PageHeaderProps {
    title: string
    subtitle?: string
    breadcrumbs?: BreadcrumbItem[]
    actions?: PageAction[]
    className?: string
    sticky?: boolean
}

export function PageHeader({
    title,
    subtitle,
    breadcrumbs = [],
    actions = [],
    className = '',
    sticky = true
}: PageHeaderProps) {
    const stickyClasses = sticky
        ? 'sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-border'
        : ''

    return (
        <header className={`${stickyClasses} ${className}`}>
            <div className="container-content py-4">
                {/* Breadcrumbs - WCAG AA uyumlu navigasyon */}
                {breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="mb-2">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center text-ink-3 hover:text-ink-2 transition-colors focus-ring rounded"
                                    aria-label="Ana sayfa"
                                >
                                    <Home className="w-4 h-4" />
                                </Link>
                            </li>
                            {breadcrumbs.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <ChevronRight className="w-4 h-4 text-ink-4" aria-hidden="true" />
                                    {item.href ? (
                                        <Link
                                            to={item.href}
                                            className="flex items-center space-x-1 text-ink-3 hover:text-ink-2 transition-colors focus-ring rounded px-1"
                                        >
                                            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                                            <span>{item.label}</span>
                                        </Link>
                                    ) : (
                                        <span className="flex items-center space-x-1 text-ink-2 font-medium">
                                            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                                            <span>{item.label}</span>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Header content */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-hierarchy-h1 mb-1">{title}</h1>
                        {subtitle && (
                            <p className="text-hierarchy-caption text-reading">{subtitle}</p>
                        )}
                    </div>

                    {/* Action buttons - WCAG AA uyumlu */}
                    {actions.length > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {actions.map((action, index) => (
                                <ActionButton key={index} {...action} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

// Action Button Component
function ActionButton({
    label,
    onClick,
    variant = 'default',
    icon,
    disabled = false
}: PageAction) {
    const baseClasses = [
        'inline-flex items-center justify-center gap-2',
        'px-4 py-2 text-sm font-medium rounded-md',
        'transition-all duration-fast ease-out',
        'focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed'
    ].join(' ')

    const variantClasses = {
        default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        outline: 'border border-border bg-surface hover:bg-muted text-ink-2',
        ghost: 'hover:bg-muted text-ink-2',
        danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]}`}
            aria-label={icon && !label ? label : undefined}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    )
}
