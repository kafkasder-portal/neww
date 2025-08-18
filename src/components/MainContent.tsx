import React, { memo } from 'react'
import { SidebarInset } from './ui/sidebar'
import { MinimalHeader } from './MinimalHeader'
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
  customBreadcrumbs 
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
      {/* Minimal Header */}
      <MinimalHeader />

      {/* Main Content */}
      <main className={cn("flex-1 overflow-auto", className)}>
        {showBreadcrumbs && currentPage && (
          <div className="border-b border-sidebar-border bg-sidebar/5 px-6 py-3">
            <h1 className="text-sm font-medium text-sidebar-foreground">{currentPage.title}</h1>
            {currentPage.description && (
              <p className="text-xs text-sidebar-foreground/70 mt-1">
                {currentPage.description}
              </p>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarInset>
  )
})

export { MainContent }
