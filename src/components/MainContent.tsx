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
          {/* Enhanced Breadcrumbs */}
          {showBreadcrumbs && currentPage && (
            <div className="border-b border-border-border bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center gap-3">
                  {/* Page Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bg-primary to-bg-primary flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>

                  {/* Page Info */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-foreground mb-1">
                      {currentPage.title}
                    </h1>
                    {currentPage.description && (
                      <p className="text-text-muted-foreground font-medium">
                        {currentPage.description}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-bg-primary/5 rounded-lg">
                      <div className="w-2 h-2 bg-bg-primary rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-bg-primary/80">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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

