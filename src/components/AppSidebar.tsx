import React, { memo, startTransition } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from './ui/sidebar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'
import { Badge } from './ui/badge'
import { Building2, ChevronUp, User } from 'lucide-react'
import { navigationItems, supportItems } from '../constants/navigation'
import { cn } from '../lib/utils'

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

  const activeMainItem = getActiveMainItem()

  return (
    <TooltipProvider>
      <Sidebar variant="inset" collapsible="icon">
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" className="h-10">
                <div className="flex aspect-square size-6 items-center justify-center rounded bg-brand-primary text-white">
                  <Building2 className="size-3" />
                </div>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-medium">Panel</span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Main Content */}
        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigasyon</SidebarGroupLabel>
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
                                className="w-full"
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <Icon className="size-4 flex-shrink-0" />
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge>
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center">
                              <div>
                                <div className="font-medium">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-muted-foreground">
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
                          className="w-56 p-2"
                          sideOffset={8}
                        >
                          <div className="grid gap-1">
                            <div className="font-medium text-sm mb-2 px-2 py-1">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start h-auto p-2"
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-medium text-sm">
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

          {/* Support Section */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Destek</SidebarGroupLabel>
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
                                className="w-full"
                                tooltip={isCollapsed ? item.title : undefined}
                              >
                                <Icon className="size-4 flex-shrink-0" />
                                {!isCollapsed && (
                                  <>
                                    <span className="flex-1 truncate">{item.title}</span>
                                    {item.badge && (
                                      <SidebarMenuBadge>
                                        {item.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </>
                                )}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" align="center">
                              <div>
                                <div className="font-medium">{item.title}</div>
                                {activeSubPage && (
                                  <div className="text-xs text-muted-foreground">
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
                          className="w-56 p-2"
                          sideOffset={8}
                        >
                          <div className="grid gap-1">
                            <div className="font-medium text-sm mb-2 px-2 py-1">
                              {item.title}
                            </div>
                            {item.subPages.map((subPage) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start h-auto p-2"
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                <div className="grid gap-1 text-left">
                                  <div className="font-medium text-sm">
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

        {/* Footer - User Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        tooltip={isCollapsed ? "Ahmet Kaya" : undefined}
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
                            <User className="h-4 w-4" />
                          </div>
                        </Avatar>
                        {!isCollapsed && (
                          <>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">Ahmet Kaya</span>
                              <span className="truncate text-xs">ahmet@sirket.com</span>
                            </div>
                            <ChevronUp className="ml-auto size-4" />
                          </>
                        )}
                      </SidebarMenuButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" align="center">
                      <div>
                        <div className="font-medium">Ahmet Kaya</div>
                        <div className="text-xs text-muted-foreground">
                          ahmet@sirket.com
                        </div>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>

                <PopoverContent
                  side="right"
                  align="end"
                  className="w-56 p-2"
                  sideOffset={8}
                >
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
                          <User className="h-4 w-4" />
                        </div>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Ahmet Kaya</span>
                        <span className="truncate text-xs text-muted-foreground">
                          ahmet@sirket.com
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Profil Ayarları
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Hesap Ayarları
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Destek
                      </Button>
                      <div className="border-t pt-1 mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        >
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
