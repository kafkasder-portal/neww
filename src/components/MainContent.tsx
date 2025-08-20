import React, { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { allPages } from '../constants/navigation'
import { cn } from '../lib/utils'
import { AppHeader } from './AppHeader'
import { SidebarInset } from './ui/sidebar'

interface MainContentProps {
  children: React.ReactNode
  className?: string
  showBreadcrumbs?: boolean
  customBreadcrumbs?: Array<{
    title: string
    href?: string
  }>
}

const MainContent = memo(function MainContent({
  children,
  className,
  showBreadcrumbs = true,
  customBreadcrumbs: _customBreadcrumbs
}: MainContentProps) {
  const location = useLocation()

  // Find current page info for breadcrumbs
  const currentPage = allPages.find(page => page.href === location.pathname)

  return (
    <SidebarInset>
      {/* Enhanced App Header */}
      <AppHeader />

      {/* Enhanced Main Content */}
      <main className={cn(
        "flex-1 overflow-auto relative min-h-screen",
        "bg-gradient-to-br from-bg-muted via-white to-bg-primary/5/30",
        "dashboard-background",
        className
      )}>
        {/* Enhanced Floating Decorative Elements */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>

        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-muted/50 via-transparent to-bg-primary/5/30 pointer-events-none"></div>

        <div className="relative z-10">


          {/* Enhanced Content Area */}
          <div className="flex-1 p-6 bg-card rounded-lg border">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="animate-fade-in-up">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarInset>
  )
})

export { MainContent }

