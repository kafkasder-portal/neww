import React, { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import { Bell, Search, Settings, User, LogOut, Menu } from 'lucide-react'
import { allPages } from '../constants/navigation'
import { cn } from '../lib/utils'

interface AppHeaderProps {
  className?: string
}

const AppHeader = memo(function AppHeader({ className }: AppHeaderProps) {
  const location = useLocation()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  
  // Find current page info
  const currentPage = allPages.find(page => page.href === location.pathname)
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-sidebar-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm",
      className
    )}>
      <div className="flex h-16 items-center px-4 lg:px-6 max-w-full">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-8 w-8" />
          
          {/* App Title & Current Page */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">
                Panel
              </h1>
            </div>
            {currentPage && (
              <>
                <div className="hidden md:block text-muted-foreground">/</div>
                <div className="text-sm font-medium text-muted-foreground truncate">
                  {currentPage.title}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-accent">
            <Search className="h-4 w-4" />
            <span className="sr-only">Arama</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            <span className="sr-only">Bildirimler</span>
          </Button>

          {/* Settings - Hidden on small screens */}
          <Button variant="ghost" size="sm" className="hidden sm:flex h-9 w-9 p-0 hover:bg-accent">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Ayarlar</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0 hover:bg-accent ml-1">
                <Avatar className="h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center bg-muted rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                </Avatar>
                <span className="sr-only">Kullanıcı menüsü</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Ahmet Kaya</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ahmet@sirket.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ayarlar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
})

export { AppHeader }