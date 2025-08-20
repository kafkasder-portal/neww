import { Bell, Building2, ChevronUp, LogOut, Settings, Sparkles, User } from 'lucide-react'
import { memo, startTransition } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigationItems, supportItems } from '../constants/navigation'
import { Avatar } from './ui/avatar'
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
        {/* Enhanced Header */}
        <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-bg-primary to-bg-primary/80">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" className="h-12 bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white/20 text-white shadow-lg">
                  <Building2 className="icon size-4" />
                </div>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-bold text-white">Dernek Panel</span>
                    <span className="truncate text-white/70 text-xs">Yönetim Sistemi</span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Main Content */}
        <SidebarContent className="bg-gradient-to-b from-bg-muted to-white">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-text-muted-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
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
                                className={`w-full transition-all duration-200 hover:bg-bg-primary/5 hover:border-bg-primary/20 ${isActive
                                  ? 'bg-bg-primary/10 border-bg-primary/30 text-bg-primary/80 shadow-sm'
                                  : 'bg-white border-transparent text-text-foreground'
                                  }`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                                  ? 'bg-bg-primary text-white shadow-md'
                                  : 'bg-bg-muted/80 text-text-muted-foreground'
                                  }`}>
                                  <Icon className="icon size-4 flex-shrink-0" />
                                </div>
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge className="bg-bg-accent text-white">
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center" className="bg-white border border-border-border shadow-lg">
                              <div className="p-2">
                                <div className="font-semibold text-text-foreground">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-text-muted-foreground mt-1">
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
                          className="w-64 p-3 bg-white border border-border-border shadow-xl rounded-xl"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-2 py-2 bg-bg-primary/5 text-bg-primary/80 rounded-lg">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${location.pathname === subPage.href
                                  ? 'bg-bg-primary/10 text-bg-primary/80 border border-bg-primary/20'
                                  : 'hover:bg-bg-muted'
                                  }`}
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-semibold text-sm">
                                    {subPage.title}
                                  </div>
                                  {subPage.description && (
                                    <div className="text-xs text-text-muted-foreground">
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

          {/* Support Section */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-text-muted-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2">
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
                                className={`w-full transition-all duration-200 hover:bg-bg-secondary/5 hover:border-bg-secondary/20 ${isActive
                                  ? 'bg-bg-secondary/10 border-bg-secondary/30 text-bg-secondary/80 shadow-sm'
                                  : 'bg-white border-transparent text-text-foreground'
                                  }`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                                  ? 'bg-bg-secondary text-white shadow-md'
                                  : 'bg-bg-muted/80 text-text-muted-foreground'
                                  }`}>
                                  <Icon className="size-4 flex-shrink-0" />
                                </div>
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge className="bg-bg-accent text-white">
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center" className="bg-white border border-border-border shadow-lg">
                              <div className="p-2">
                                <div className="font-semibold text-text-foreground">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-text-muted-foreground mt-1">
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
                          className="w-64 p-3 bg-white border border-border-border shadow-xl rounded-xl"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-2 py-2 bg-bg-secondary/5 text-bg-secondary/80 rounded-lg">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${location.pathname === subPage.href
                                  ? 'bg-bg-secondary/10 text-bg-secondary/80 border border-bg-secondary/20'
                                  : 'hover:bg-bg-muted'
                                  }`}
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-semibold text-sm">
                                    {subPage.title}
                                  </div>
                                  {subPage.description && (
                                    <div className="text-xs text-text-muted-foreground">
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
                        className="data-[state=open]:bg-bg-primary/5 data-[state=open]:text-bg-primary/80 hover:bg-bg-primary/5 transition-all duration-200"
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
                              <span className="truncate font-bold text-text-foreground">Ahmet Kaya</span>
                              <span className="truncate text-xs text-text-muted-foreground">Yönetici</span>
                            </div>
                            <ChevronUp className="ml-auto size-4 text-text-muted-foreground" />
                          </>
                        )}
                      </SidebarMenuButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" align="center" className="bg-white border border-border-border shadow-lg">
                      <div className="p-2">
                        <div className="font-bold text-text-foreground">Ahmet Kaya</div>
                        <div className="text-xs text-text-muted-foreground">
                          Yönetici
                        </div>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>

                <PopoverContent
                  side="right"
                  align="end"
                  className="w-72 p-4 bg-white border border-border-border shadow-xl rounded-xl"
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
                        <span className="truncate font-bold text-text-foreground">Ahmet Kaya</span>
                        <span className="truncate text-xs text-text-muted-foreground">
                          ahmet@sirket.com
                        </span>
                        <span className="truncate text-xs text-bg-primary font-medium">
                          Sistem Yöneticisi
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-bg-primary/5">
                        <Bell className="h-4 w-4" />
                        Bildirimler
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-bg-primary/5">
                        <Settings className="h-4 w-4" />
                        Ayarlar
                      </Button>
                    </div>

                    {/* Profile Actions */}
                    <div className="border-t border-border-border pt-3 space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-bg-secondary/5">
                        <User className="h-4 w-4" />
                        Profil Ayarları
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-bg-secondary/5">
                        <Sparkles className="h-4 w-4" />
                        Tema Değiştir
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-bg-secondary/5">
                        <Settings className="h-4 w-4" />
                        Hesap Ayarları
                      </Button>

                      <div className="border-t border-border-border pt-2 mt-2">
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

