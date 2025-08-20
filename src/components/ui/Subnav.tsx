import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

/*
 * Subnav Component - Sticky sub-navigation for long pages
 * 
 * WHY: Uzun modül sayfalarında bölümler arası hızlı geçiş için
 * HOW: Tab benzeri navigasyon sticky olarak sayfanın üst kısmında kalır
 */

export interface SubnavItem {
    id: string
    label: string
    href?: string
    icon?: ReactNode
    count?: number
    disabled?: boolean
}

export interface SubnavProps {
    items: SubnavItem[]
    activeItem?: string
    onItemClick?: (item: SubnavItem) => void
    className?: string
    sticky?: boolean
    variant?: 'tabs' | 'pills' | 'underline'
}

export function Subnav({
    items,
    activeItem,
    onItemClick,
    className = '',
    sticky = true,
    variant = 'tabs'
}: SubnavProps) {
    const location = useLocation()

    const stickyClasses = sticky
        ? 'sticky top-[var(--header-height)] z-10 bg-surface/95 backdrop-blur-sm border-b border-border'
        : 'border-b border-border'

    // Aktif öğeyi belirle - prop'tan veya URL'den
    const getActiveItem = (item: SubnavItem) => {
        if (activeItem) {
            return activeItem === item.id
        }
        if (item.href) {
            return location.pathname === item.href
        }
        return false
    }

    return (
        <nav
            className={`${stickyClasses} ${className}`}
            role="tablist"
            aria-label="Alt navigasyon"
        >
            <div className="container-content">
                <div className={`flex ${getVariantClasses(variant)}`}>
                    {items.map((item) => (
                        <SubnavItem
                            key={item.id}
                            item={item}
                            isActive={getActiveItem(item)}
                            onClick={onItemClick}
                            variant={variant}
                        />
                    ))}
                </div>
            </div>
        </nav>
    )
}

// Subnav Item Component
interface SubnavItemProps {
    item: SubnavItem
    isActive: boolean
    onClick?: (item: SubnavItem) => void
    variant: 'tabs' | 'pills' | 'underline'
}

function SubnavItem({ item, isActive, onClick, variant }: SubnavItemProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (item.disabled) return

        if (onClick) {
            onClick(item)
        }
    }

    const baseClasses = [
        'inline-flex items-center gap-2 px-4 py-3 text-sm font-medium',
        'transition-all duration-fast ease-out',
        'focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed'
    ].join(' ')

    const variantClasses = getItemVariantClasses(variant, isActive)
    const disabledClasses = item.disabled ? 'pointer-events-none' : 'cursor-pointer'

    const content = (
        <>
            {item.icon && (
                <span className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                    {item.icon}
                </span>
            )}
            <span>{item.label}</span>
            {item.count !== undefined && (
                <span className={`
          inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full
          ${isActive
                        ? 'bg-surface text-primary'
                        : 'bg-muted text-ink-3'
                    }
        `}>
                    {item.count}
                </span>
            )}
        </>
    )

    // Eğer href varsa Link kullan, yoksa button
    if (item.href && !onClick) {
        return (
            <Link
                to={item.href}
                className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
                role="tab"
                aria-selected={isActive}
                aria-disabled={item.disabled}
            >
                {content}
            </Link>
        )
    }

    return (
        <button
            onClick={handleClick}
            disabled={item.disabled}
            className={`${baseClasses} ${variantClasses}`}
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled}
        >
            {content}
        </button>
    )
}

// Variant stil sınıfları
function getVariantClasses(variant: 'tabs' | 'pills' | 'underline'): string {
    switch (variant) {
        case 'tabs':
            return 'border-b border-border'
        case 'pills':
            return 'p-1 bg-muted rounded-md'
        case 'underline':
            return 'space-x-1'
        default:
            return ''
    }
}

function getItemVariantClasses(variant: 'tabs' | 'pills' | 'underline', isActive: boolean): string {
    const base = 'hover:text-ink-1 hover:bg-muted/50'

    switch (variant) {
        case 'tabs':
            return isActive
                ? 'text-primary border-b-2 border-primary bg-transparent -mb-px'
                : `text-ink-3 border-b-2 border-transparent ${base}`

        case 'pills':
            return isActive
                ? 'text-ink-1 bg-surface shadow-sm'
                : `text-ink-3 ${base}`

        case 'underline':
            return isActive
                ? 'text-primary border-b-2 border-primary'
                : `text-ink-3 border-b-2 border-transparent ${base}`

        default:
            return isActive ? 'text-primary' : `text-ink-3 ${base}`
    }
}

// Scroll to section utility - Anchor navigation için
export function scrollToSection(sectionId: string, offset = 64) {
    const element = document.getElementById(sectionId)
    if (element) {
        const y = element.offsetTop - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
    }
}

// Hook for section scrolling with subnav
export function useScrollSpy(sectionIds: string[], offset = 100) {
    const [activeSection, setActiveSection] = React.useState<string>('')

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY + offset

            for (const sectionId of sectionIds) {
                const element = document.getElementById(sectionId)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
                        setActiveSection(sectionId)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial check

        return () => window.removeEventListener('scroll', handleScroll)
    }, [sectionIds, offset])

    return activeSection
}
