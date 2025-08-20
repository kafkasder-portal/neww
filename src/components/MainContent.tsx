import React, { memo } from 'react'
import { cn } from '../lib/utils'
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
      {/* Content Area - SidebarInset already provides main tag */}
      <div className={cn(
        "flex-1 overflow-auto min-h-screen bg-background p-6",
        className
      )}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </SidebarInset>
  )
})

export { MainContent }
