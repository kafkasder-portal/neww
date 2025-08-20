import { ReactNode } from 'react'
import { AppSidebar } from '../sidebar/AppSidebar'
import { SidebarProvider } from '../ui/sidebar'

/*
 * AppShell Component - Main application layout with sidebar
 * 
 * WHY: Sidebar ve ana içerik alanı için tutarlı layout yapısı
 * HOW: SidebarProvider ile state management ve responsive behavior
 */

export interface AppShellProps {
    children: ReactNode
    className?: string
}

export function AppShell({ children, className = '' }: AppShellProps) {
    return (
        <SidebarProvider>
            <div className={`min-h-screen bg-background ${className}`}>
                {/* Sidebar - Mevcut yapıyı koruyor */}
                <AppSidebar />

                {/* Main Content Area */}
                <main className="lg:pl-[var(--sidebar-width)] min-h-screen">
                    <div className="flex flex-col min-h-screen">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

// Layout için Header wrapper - Sticky header desteği
export interface AppHeaderProps {
    children: ReactNode
    className?: string
    sticky?: boolean
}

export function AppHeader({ children, className = '', sticky = true }: AppHeaderProps) {
    const stickyClasses = sticky
        ? 'sticky top-0 z-20 bg-surface/95 backdrop-blur-sm border-b border-border'
        : ''

    return (
        <header className={`${stickyClasses} ${className}`}>
            {children}
        </header>
    )
}

// Layout için Content wrapper - Container ve spacing
export interface AppContentProps {
    children: ReactNode
    className?: string
    contained?: boolean
    spacing?: 'none' | 'sm' | 'md' | 'lg'
}

export function AppContent({
    children,
    className = '',
    contained = true,
    spacing = 'md'
}: AppContentProps) {
    const spacingClasses = {
        none: '',
        sm: 'py-4',
        md: 'py-6',
        lg: 'py-8'
    }

    const containerClasses = contained ? 'container-content' : ''

    return (
        <div className={`flex-1 ${spacingClasses[spacing]} ${containerClasses} ${className}`}>
            {children}
        </div>
    )
}

// Footer Component - Sticky footer option
export interface AppFooterProps {
    children: ReactNode
    className?: string
    sticky?: boolean
}

export function AppFooter({ children, className = '', sticky = false }: AppFooterProps) {
    const stickyClasses = sticky ? 'sticky bottom-0' : ''

    return (
        <footer className={`bg-surface border-t border-border ${stickyClasses} ${className}`}>
            <div className="container-content py-4">
                {children}
            </div>
        </footer>
    )
}
