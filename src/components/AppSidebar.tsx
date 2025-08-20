import { Bell, Building2, ChevronUp, HelpCircle, LogOut, Search, Settings, Sparkles, Sun, User } from 'lucide-react'
import { memo, startTransition } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigationItems, supportItems } from '../constants/navigation'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

const AppSidebar = memo(function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Check if current route matches any navigation item
  const isActiveItem = (item: any) => {
    return item.subPages.some((page: any) => page.href === location.pathname)
  }

  // Get active subpage for an item
  const getActiveSubPage = (item: any) => {
    return item.subPages.find((page: any) => page.href === location.pathname)
  }

  // Get the currently active main navigation item
  const getActiveMainItem = () => {
    return [...navigationItems, ...supportItems].find(item =>
      item.subPages.some(page => page.href === location.pathname)
    )
  }

  const _activeMainItem = getActiveMainItem()

  return (
    <TooltipProvider>
      <Sidebar variant="inset" collapsible="icon" className="border-border bg-background">

        {/* Main Content */}
        <SidebarContent className="bg-gradient-to-b from-bg-muted to-white">
          {/* Support Section - Moved to top */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
              Destek & Sistem
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveItem(item)
                  const activeSubPage = getActiveSubPage(item)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Popover>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                className={`w-full transition-all duration-200 hover:bg-primary/5 hover:border-primary/20 ${isActive
                ? 'bg-primary/10 border-primary/30 text-primary/80 shadow-sm'
                : 'bg-white border-transparent text-foreground'
              }`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                                  ? 'bg-primary text-white shadow-md'
                : 'bg-muted/80 text-muted-foreground'
                                  }`}>
                                  <Icon className="size-4 flex-shrink-0" />
                                </div>
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge className="bg-accent text-white">
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center" className="bg-white border border-border shadow-lg">
                              <div className="p-2">
                                <div className="font-semibold text-foreground">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {activeSubPage.title}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>

                        <PopoverContent
                          side="right"
                          align="start"
                          className="w-64 p-3 bg-white border border-border shadow-xl rounded-xl"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-2 py-2 bg-primary/5 text-primary/80 rounded-lg">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${location.pathname === subPage.href
                                  ? 'bg-primary/10 text-primary/80 border border-primary/20'
                : 'hover:bg-muted'
                                  }`}
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-semibold text-sm">
                                    {subPage.title}
                                  </div>
                                  {subPage.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {subPage.description}
                                    </div>
                                  )}
                                </div>
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Main Navigation - Moved to bottom */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
              Ana Menü
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveItem(item)
                  const activeSubPage = getActiveSubPage(item)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Popover>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                className={`w-full transition-all duration-200 hover:bg-secondary/5 hover:border-secondary/20 ${isActive
                ? 'bg-secondary/10 border-secondary/30 text-secondary/80 shadow-sm'
                : 'bg-white border-transparent text-foreground'
              }`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                                  ? 'bg-secondary text-white shadow-md'
                : 'bg-muted/80 text-muted-foreground'
                                  }`}>
                                  <Icon className="size-4 flex-shrink-0" />
                                </div>
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge className="bg-accent text-white">
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center" className="bg-white border border-border shadow-lg">
                              <div className="p-2">
                                <div className="font-semibold text-foreground">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {activeSubPage.title}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>

                        <PopoverContent
                          side="right"
                          align="start"
                          className="w-64 p-3 bg-white border border-border shadow-xl rounded-xl"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-2 py-2 bg-secondary/5 text-secondary/80 rounded-lg">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${location.pathname === subPage.href
                                  ? 'bg-secondary/10 text-secondary/80 border border-secondary/20'
                : 'hover:bg-muted'
                                  }`}
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-semibold text-sm">
                                    {subPage.title}
                                  </div>
                                  {subPage.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {subPage.description}
                                    </div>
                                  )}
                                </div>
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Enhanced Footer - User Profile */}
        <SidebarFooter className="border-t border-sidebar-border bg-gradient-to-r from-bg-muted to-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-primary/5 data-[state=open]:text-primary/80 hover:bg-primary/5 transition-all duration-200"
                        tooltip={isCollapsed ? "Ahmet Kaya" : undefined}
                      >
                        <Avatar className="h-10 w-10 rounded-xl border-2 border-bg-primary/20 shadow-md">
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </Avatar>
                        {!isCollapsed && (
                          <>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-bold text-foreground">Ahmet Kaya</span>
                <span className="truncate text-xs text-muted-foreground">Yönetici</span>
                            </div>
                            <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                          </>
                        )}
                      </SidebarMenuButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" align="center" className="bg-white border border-border shadow-lg">
                      <div className="p-2">
                        <div className="font-bold text-foreground">Ahmet Kaya</div>
                <div className="text-xs text-muted-foreground">
                          Yönetici
                        </div>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>

                <PopoverContent
                  side="right"
                  align="end"
                  className="w-72 p-4 bg-white border border-border shadow-xl rounded-xl"
                  sideOffset={8}
                >
                  <div className="grid gap-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-bg-primary/5 to-bg-primary/10 rounded-lg">
                      <Avatar className="h-12 w-12 rounded-xl border-2 border-bg-primary/20">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-bold text-foreground">Ahmet Kaya</span>
                <span className="truncate text-xs text-muted-foreground">
                          ahmet@sirket.com
                        </span>
                        <span className="truncate text-xs text-bg-primary font-medium">
                          Sistem Yöneticisi
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hızlı Eylemler</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" size="sm" className="h-9 justify-start gap-2 hover:bg-primary/5 text-muted-foreground hover:text-primary">
                          <Search className="h-4 w-4" />
                          <span className="text-xs">Arama</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-9 justify-start gap-2 hover:bg-primary/5 text-muted-foreground hover:text-primary">
                          <Sun className="h-4 w-4" />
                          <span className="text-xs">Tema</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-9 justify-start gap-2 relative hover:bg-primary/5 text-muted-foreground hover:text-primary">
                          <Bell className="h-4 w-4" />
                          <span className="absolute top-1 left-6 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-xs">Bildirim</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-9 justify-start gap-2 hover:bg-primary/5 text-muted-foreground hover:text-primary">
                          <HelpCircle className="h-4 w-4" />
                          <span className="text-xs">Yardım</span>
                        </Button>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="border-t border-border pt-3 space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-secondary/5">
                        <User className="h-4 w-4" />
                        Profil Ayarları
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-secondary/5">
                        <Settings className="h-4 w-4" />
                        Hesap Ayarları
                      </Button>

                      <div className="border-t border-border pt-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Çıkış Yap
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
})

export { AppSidebar }

