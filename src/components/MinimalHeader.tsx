import React from 'react'
import { Button } from './ui/button'
import { Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const MinimalHeader: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60 -mt-1">
      <div className="flex items-center gap-2 px-3 flex-1">
        {/* Sidebar toggle removed - sidebar stays icon-only */}
      </div>
      
      <div className="flex items-center gap-1 px-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 relative text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-financial-error rounded-full"></span>
        </Button>
      </div>
    </header>
  )
}

export { MinimalHeader }
