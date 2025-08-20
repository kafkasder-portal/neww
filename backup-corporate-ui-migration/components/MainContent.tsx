import React, { memo } from 'react'
import { SidebarInset } from './ui/sidebar'
import { AppHeader } from './AppHeader'
import { useLocation } from 'react-router-dom'
import { allPages } from '../constants/navigation'
import { cn } from '../lib/utils'

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

  // Generate breadcrumbs - simplified to show only current page
  // const breadcrumbs = customBreadcrumbs || (currentPage ? [
  //   { title: currentPage.title }
  // ] : [])

  return (
    <SidebarInset>
      {/* App Header */}
      <AppHeader />

      {/* Main Content */}
      <main className={cn("flex-1 overflow-auto dashboard-background relative", className)}>
        {/* Floating decorative elements */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        
        <div className="relative z-10">
          {showBreadcrumbs && currentPage && (
            <div className="border-b border-sidebar-border bg-sidebar/5 px-6 py-4">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-lg font-semibold text-sidebar-foreground">{currentPage.title}</h1>
                {currentPage.description && (
                  <p className="text-sm text-sidebar-foreground/70 mt-1">
                    {currentPage.description}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </SidebarInset>
  )
})

export { MainContent }
