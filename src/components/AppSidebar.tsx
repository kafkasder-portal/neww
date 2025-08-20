import { Building2, ChevronUp, LogOut, Settings, User } from 'lucide-react'
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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'

const AppSidebar = memo(function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Check if current route matches any navigation item
  const isActiveItem = (item: any) => {
    return item.subPages?.some((page: any) => page.href === location.pathname)
  }

  return (
    <Sidebar className="border-r bg-card">
      {/* Header */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-lg">Dernek Panel</h2>
              <p className="text-xs text-muted-foreground">Yönetim Sistemi</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-2">
        {/* Main Navigation - First */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
            Ana Menü
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveItem(item)

                return (
                  <SidebarMenuItem key={item.title}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <SidebarMenuButton
                          isActive={isActive}
                          className="w-full"
                        >
                          <Icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </SidebarMenuButton>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-64 p-0" sideOffset={8}>
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                          <div className="space-y-1">
                            {item.subPages?.map((subPage: any) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                {subPage.title}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support & System - Second */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveItem(item)

                return (
                  <SidebarMenuItem key={item.title}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <SidebarMenuButton
                          isActive={isActive}
                          className="w-full"
                        >
                          <Icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </SidebarMenuButton>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-64 p-0" sideOffset={8}>
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                          <div className="space-y-1">
                            {item.subPages?.map((subPage: any) => (
                              <Button
                                key={subPage.href}
                                variant={location.pathname === subPage.href ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => startTransition(() => navigate(subPage.href))}
                              >
                                {subPage.title}
                              </Button>
                            ))}
                          </div>
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

      {/* Footer */}
      <SidebarFooter className="p-4 border-t">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost" 
              className="w-full justify-start gap-3 px-3 py-2"
            >
              <Avatar className="h-8 w-8">
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                  A
                </div>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Admin</div>
                  <div className="text-xs text-muted-foreground">Sistem Yöneticisi</div>
                </div>
              )}
              {!isCollapsed && <ChevronUp className="h-4 w-4" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" side="top" align="end">
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  )
})

export default AppSidebar
