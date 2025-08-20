import { Bell, Building2, ChevronUp, HelpCircle, LogOut, Search, Settings, Sparkles, Sun, User } from 'lucide-react'
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
      <Sidebar variant="inset" collapsible="icon" className="sidebar-premium border-0">
        {/* Premium Header */}
        <SidebarHeader className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-primary-600 to-brand-accent-500 flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 animate-glow"></div>
            </div>
            {!isCollapsed && (
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  DernekPanel
                </h1>
                <p className="text-sm text-sidebar-text-muted font-medium">
                  Premium Yönetim Sistemi
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Search - Only show when expanded */}
        {!isCollapsed && (
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-text-muted" />
              <input
                type="text"
                placeholder="Arama..."
                className="input-premium pl-10 text-sm"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <SidebarContent className="px-2">
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
                                className={`sidebar-nav-item w-full ${isActive ? 'active' : ''}`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <span className="badge-info text-xs">
                                        {item.badge}
                                      </span>
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
                          className="w-64 p-3 glass-card shadow-premium"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-3 py-2 bg-gradient-to-r from-brand-primary-500/20 to-brand-accent-500/20 text-white rounded-xl border border-white/20">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 ${location.pathname === subPage.href
                                  ? 'bg-gradient-to-r from-brand-primary-500/30 to-brand-accent-500/30 text-white border border-white/30 shadow-md'
                : 'hover:bg-white/10 text-sidebar-text hover:text-white'
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
          <SidebarGroup className="mt-auto border-t border-white/10 pt-4">
            <SidebarGroupLabel className="text-sidebar-text-muted font-semibold text-xs uppercase tracking-wider px-4 py-2">
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
                                className={`sidebar-nav-item w-full ${isActive ? 'active' : ''}`}
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate font-medium">{item.title}</span>
                                    {item.badge && (
                                      <span className="badge-info text-xs">
                                        {item.badge}
                                      </span>
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
                          className="w-64 p-3 glass-card shadow-premium"
                          sideOffset={8}
                        >
                          <div className="grid gap-2">
                            <div className="font-bold text-sm mb-3 px-3 py-2 bg-gradient-to-r from-brand-secondary-500/20 to-brand-primary-500/20 text-white rounded-xl border border-white/20">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className={`w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 ${location.pathname === subPage.href
                                  ? 'bg-gradient-to-r from-brand-secondary-500/30 to-brand-primary-500/30 text-white border border-white/30 shadow-md'
                : 'hover:bg-white/10 text-sidebar-text hover:text-white'
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

        {/* Premium Footer - User Profile */}
        <SidebarFooter className="px-6 py-6 border-t border-white/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="hover:bg-white/10 transition-all duration-300 rounded-xl p-3"
                        tooltip={isCollapsed ? "Admin Kullanıcı" : undefined}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 rounded-2xl ring-2 ring-white/20">
                            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-semantic-success border-2 border-white"></div>
                        </div>
                        {!isCollapsed && (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                Admin Kullanıcı
                              </p>
                              <p className="text-xs text-sidebar-text-muted truncate">
                                admin@dernekpanel.com
                              </p>
                            </div>
                            <ChevronUp className="ml-auto h-4 w-4 text-sidebar-text-muted" />
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
                  className="w-72 p-4 glass-card shadow-premium"
                  sideOffset={8}
                >
                  <div className="grid gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-accent-500/20 to-brand-primary-500/20 rounded-xl border border-white/20">
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-white/30">
                          <div className="h-full w-full rounded-2xl bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-semantic-success border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Admin Kullanıcı</p>
                        <p className="text-xs text-white/70 truncate">admin@dernekpanel.com</p>
                        <p className="text-xs text-brand-accent-200 font-medium truncate">Sistem Yöneticisi</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Hızlı Eylemler</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" size="sm" className="h-10 justify-start gap-2 hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl">
                          <Search className="h-4 w-4" />
                          <span className="text-xs">Arama</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="h-10 justify-start gap-2 hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl">
                          <Sun className="h-4 w-4" />
                          <span className="text-xs">Tema</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="h-10 justify-start gap-2 relative hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl">
                          <Bell className="h-4 w-4" />
                          <span className="absolute top-1 left-6 h-2 w-2 bg-semantic-danger rounded-full animate-glow" />
                          <span className="text-xs">Bildirim</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="h-10 justify-start gap-2 hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl">
                          <HelpCircle className="h-4 w-4" />
                          <span className="text-xs">Yardım</span>
                        </Button>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="border-t border-white/20 pt-4 space-y-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl p-3">
                        <User className="h-4 w-4" />
                        Profil Ayarları
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-white/10 text-sidebar-text hover:text-white rounded-xl p-3">
                        <Settings className="h-4 w-4" />
                        Hesap Ayarları
                      </Button>

                      <div className="border-t border-white/20 pt-3 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-3 text-semantic-danger hover:text-semantic-danger hover:bg-semantic-danger/10 rounded-xl p-3"
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

export default AppSidebar
export { AppSidebar }
