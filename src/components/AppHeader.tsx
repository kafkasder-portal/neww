import {
  Activity,
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  User
} from 'lucide-react'
import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { allPages } from '../constants/navigation'
import { cn } from '../lib/utils'
import { Avatar } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { SidebarTrigger, useSidebar } from './ui/sidebar'

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
      "sticky top-0 z-50 w-full border-b border-border-border bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm",
      className
    )}>
      <div className="flex h-16 items-center px-4 lg:px-6 max-w-full">
        {/* Enhanced Sidebar Toggle & App Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 rounded-lg bg-bg-primary/5 text-bg-primary hover:bg-bg-primary/10 transition-colors" />

          {/* App Title & Current Page */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bg-primary to-bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-foreground">
                  Dernek Panel
                </h1>
                <p className="text-xs text-text-muted-foreground">Yönetim Sistemi</p>
              </div>
            </div>
            {currentPage && (
              <>
                <div className="hidden md:block w-px h-6 bg-border-border"></div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-text-foreground">
                    {currentPage.title}
                  </div>
                  {currentPage.description && (
                    <div className="hidden lg:block text-xs text-text-muted-foreground">
                      {currentPage.description}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Enhanced Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-bg-primary/5 text-text-muted-foreground hover:text-bg-primary">
            <Search className="h-4 w-4" />
            <span className="sr-only">Arama</span>
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-bg-primary/5 text-text-muted-foreground hover:text-bg-primary">
            <Sun className="h-4 w-4" />
            <span className="sr-only">Tema Değiştir</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative hover:bg-bg-primary/5 text-text-muted-foreground hover:text-bg-primary">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="sr-only">Bildirimler</span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="hidden sm:flex h-9 w-9 p-0 hover:bg-bg-primary/5 text-text-muted-foreground hover:text-bg-primary">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Yardım</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hidden sm:flex h-9 w-9 p-0 hover:bg-bg-primary/5 text-text-muted-foreground hover:text-bg-primary">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Ayarlar</span>
          </Button>

          {/* Divider */}
          <div className="w-px h-6 bg-border-border mx-2"></div>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-3 rounded-lg hover:bg-bg-primary/5 gap-2">
                <Avatar className="h-7 w-7 border-2 border-bg-primary/20">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-primary to-bg-primary rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-text-foreground">Ahmet Kaya</span>
                  <span className="text-xs text-text-muted-foreground">Yönetici</span>
                </div>
                <ChevronDown className="h-4 w-4 text-text-muted-foreground" />
                <span className="sr-only">Kullanıcı menüsü</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-4 bg-white border border-border-border shadow-xl rounded-xl">
              {/* User Profile Section */}
              <DropdownMenuLabel className="p-0 mb-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-bg-primary/5 to-bg-primary/10 rounded-lg">
                  <Avatar className="h-12 w-12 border-2 border-bg-primary/20">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-primary to-bg-primary rounded-full">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-text-foreground">Ahmet Kaya</p>
                    <p className="text-xs leading-none text-text-muted-foreground">
                      ahmet@sirket.com
                    </p>
                    <p className="text-xs leading-none text-bg-primary font-medium">
                      Sistem Yöneticisi
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-border-border" />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 py-2">
                <div className="flex items-center gap-2 p-2 bg-bg-green-500-50 rounded-lg">
                  <Activity className="h-4 w-4 text-bg-green-500-600" />
                  <div>
                    <p className="text-xs font-medium text-bg-green-500-700">Aktif</p>
                    <p className="text-xs text-bg-green-500-600">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-bg-primary/5 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-bg-primary" />
                  <div>
                    <p className="text-xs font-medium text-bg-primary/80">Son Giriş</p>
                    <p className="text-xs text-bg-primary">2 dk önce</p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-border-border" />

              {/* Menu Items */}
              <div className="space-y-1">
                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-primary/5 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-primary/5 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-primary/5 cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Tema Değiştir</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-primary/5 cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Bildirimler</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-border-border" />

              <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-600 cursor-pointer">
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
