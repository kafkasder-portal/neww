import React, { memo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Building2, 
  ChevronRight, 
  Home, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Bell,
  Search,
  User,
  Menu,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'

interface NavigationItem {
  id: string
  title: string
  icon: React.ComponentType<any>
  href?: string
  subItems?: Array<{
    id: string
    title: string
    href: string
    description?: string
  }>
  badge?: string | number
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    href: '/'
  },
  {
    id: 'beneficiaries',
    title: 'Yararlanıcılar',
    icon: Users,
    subItems: [
      { id: 'beneficiaries-list', title: 'Yararlanıcı Listesi', href: '/aid/beneficiaries' },
      { id: 'beneficiaries-detail', title: 'Detaylar', href: '/aid/beneficiaries-detail' },
      { id: 'applications', title: 'Başvurular', href: '/aid/applications' }
    ]
  },
  {
    id: 'donations',
    title: 'Bağışlar',
    icon: DollarSign,
    subItems: [
      { id: 'cash-donations', title: 'Nakit Bağışlar', href: '/donations/cash-donations' },
      { id: 'bank-donations', title: 'Banka Bağışları', href: '/donations/bank-donations' },
      { id: 'institutions', title: 'Kurumlar', href: '/donations/institutions' }
    ],
    badge: '12'
  },
  {
    id: 'reports',
    title: 'Raporlar',
    icon: FileText,
    subItems: [
      { id: 'financial-reports', title: 'Mali Raporlar', href: '/fund/complete-report' },
      { id: 'beneficiary-reports', title: 'Yararlanıcı Raporları', href: '/aid/reports' }
    ]
  }
]

const bottomItems: NavigationItem[] = [
  {
    id: 'settings',
    title: 'Ayarlar',
    icon: Settings,
    href: '/system/user-management'
  },
  {
    id: 'help',
    title: 'Yardım',
    icon: HelpCircle,
    href: '/help'
  }
]

interface PremiumSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

const PremiumSidebar = memo(function PremiumSidebar({ 
  collapsed = false, 
  onToggle 
}: PremiumSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isActiveItem = (item: NavigationItem): boolean => {
    if (item.href && location.pathname === item.href) return true
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href)
    }
    return false
  }

  const handleNavigation = (href: string) => {
    navigate(href)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-primary-600 to-brand-accent-500 flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 animate-glow"></div>
            </div>
            {!collapsed && (
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
          
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search - Only show when expanded */}
      {!collapsed && (
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

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveItem(item)
          const isExpanded = expandedItems.has(item.id)
          const hasSubItems = item.subItems && item.subItems.length > 0

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleExpanded(item.id)
                  } else if (item.href) {
                    handleNavigation(item.href)
                  }
                }}
                className={`sidebar-nav-item w-full ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className="badge-info text-xs">
                          {item.badge}
                        </span>
                      )}
                      {hasSubItems && (
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </>
                  )}
                </div>
              </button>

              {/* Sub Items */}
              {hasSubItems && !collapsed && isExpanded && (
                <div className="ml-8 space-y-1 animate-slide-up">
                  {item.subItems!.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem.href)}
                      className={`sidebar-nav-item w-full text-sm ${
                        location.pathname === subItem.href ? 'active' : ''
                      }`}
                    >
                      <span className="truncate">{subItem.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 space-y-2 border-t border-white/10">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <button
              key={item.id}
              onClick={() => item.href && handleNavigation(item.href)}
              className={`sidebar-nav-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
            </button>
          )
        })}
      </div>

      {/* User Profile */}
      <div className="px-6 py-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-white/20">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-semantic-success border-2 border-white"></div>
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Admin Kullanıcı
              </p>
              <p className="text-xs text-sidebar-text-muted truncate">
                admin@dernekpanel.com
              </p>
            </div>
          )}

          {!collapsed && (
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
              <LogOut className="h-4 w-4 text-sidebar-text-muted" />
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 text-white shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:flex flex-col h-full
        ${collapsed ? 'w-20' : 'w-80'}
        sidebar-premium
        transition-all duration-300 ease-out
        fixed left-0 top-0 z-30
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-80 z-50 md:hidden
        sidebar-premium
        transform transition-transform duration-300 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Toggle Button for Desktop */}
      <button
        onClick={onToggle}
        className={`
          hidden md:block fixed z-40 p-2 rounded-full 
          bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          ${collapsed ? 'left-16 top-4' : 'left-72 top-4'}
        `}
      >
        <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </>
  )
})

export default PremiumSidebar
