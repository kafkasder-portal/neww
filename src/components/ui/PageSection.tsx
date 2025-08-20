import { ReactNode } from 'react'

/*
 * PageSection Component - Structured content sections for long pages
 * 
 * WHY: Uzun sayfalarda içerik hiyerarşisi ve okunabilirlik için
 * HOW: Section başlıkları ve tutarlı spacing ile içerik organizasyonu
 */

export interface PageSectionProps {
    id?: string
    title?: string
    subtitle?: string
    description?: string
    children: ReactNode
    className?: string
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    background?: 'transparent' | 'muted' | 'surface'
    bordered?: boolean
}

export function PageSection({
    id,
    title,
    subtitle,
    description,
    children,
    className = '',
    spacing = 'lg',
    background = 'transparent',
    bordered = false
}: PageSectionProps) {
    const spacingClasses = {
        none: 'py-0',
        sm: 'py-6',
        md: 'py-8',
        lg: 'py-12',
        xl: 'py-16'
    }

    const backgroundClasses = {
        transparent: '',
        muted: 'bg-muted',
        surface: 'bg-surface'
    }

    const borderClasses = bordered ? 'border-b border-border last:border-b-0' : ''

    return (
        <section
            id={id}
            className={`
        ${spacingClasses[spacing]}
        ${backgroundClasses[background]}
        ${borderClasses}
        ${className}
      `}
        >
            <div className="container-content">
                {/* Section Header */}
                {(title || subtitle || description) && (
                    <header className="mb-8">
                        {subtitle && (
                            <div className="text-hierarchy-small text-primary mb-2">
                                {subtitle}
                            </div>
                        )}
                        {title && (
                            <h2 className="text-hierarchy-h2 mb-3">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-hierarchy-body text-reading">
                                {description}
                            </p>
                        )}
                    </header>
                )}

                {/* Section Content */}
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </section>
    )
}

// Content Grid Component - Section içeriği için responsive grid
export interface ContentGridProps {
    children: ReactNode
    columns?: 1 | 2 | 3 | 4
    gap?: 'sm' | 'md' | 'lg'
    className?: string
}

export function ContentGrid({
    children,
    columns = 1,
    gap = 'md',
    className = ''
}: ContentGridProps) {
    const columnClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }

    const gapClasses = {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8'
    }

    return (
        <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
            {children}
        </div>
    )
}

// Section Divider Component
export interface SectionDividerProps {
    label?: string
    className?: string
}

export function SectionDivider({ label, className = '' }: SectionDividerProps) {
    if (label) {
        return (
            <div className={`relative my-8 ${className}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-surface px-4 text-hierarchy-small">
                        {label}
                    </span>
                </div>
            </div>
        )
    }

    return <hr className={`my-8 border-border ${className}`} />
}
