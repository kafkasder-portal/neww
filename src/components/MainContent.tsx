import React, { memo } from 'react'
import { cn } from '../lib/utils'
import { AppHeader } from './AppHeader'
import { SidebarInset } from './ui/sidebar'

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

const MainContent = memo(function MainContent({
  children,
  className
}: MainContentProps) {
  return (
    <SidebarInset>
      {/* App Header */}
      <AppHeader />

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto relative min-h-screen",
        "bg-background",
        className
      )}>
        <div className="relative">
          {/* Content Area */}
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </div>
      </main>
    </SidebarInset>
  )
})

export { MainContent }
