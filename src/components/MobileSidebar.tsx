import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { X, Menu, Home, Users, Coins, MessageSquare, GraduationCap, HelpingHand, BarChart3, Settings, ChevronDown, ChevronRight, Database } from 'lucide-react'
import { useUIStore } from '../store/ui'

export const MobileSidebar = () => {
  const location = useLocation()
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useUIStore()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Close sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname, setMobileSidebarOpen])

  // Close sidebar when clicking outside
  useEffect(() => {
    if (!isMobileSidebarOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const menuButton = document.getElementById('mobile-menu-button')
      
      if (sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setMobileSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileSidebarOpen, setMobileSidebarOpen])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const navigationItems = [
    {
      id: 'general',
      title: 'Genel',
      items: [
        { to: '/', icon: <Home className="h-4 w-4" />, label: 'Ana Sayfa' }
      ]
    },
    {
      id: 'aid',
      title: 'Yardım Yönetimi',
      icon: <HelpingHand className="h-4 w-4" />,
      items: [
        { to: '/aid/beneficiaries', icon: <Users className="h-4 w-4" />, label: 'İhtiyaç Sahipleri' },
        { to: '/aid/applications', icon: <Users className="h-4 w-4" />, label: 'Başvurular' },
        { to: '/aid/reports', icon: <BarChart3 className="h-4 w-4" />, label: 'Raporlar' }
      ]
    },
    {
      id: 'donations',
      title: 'Bağış Yönetimi',
      icon: <Coins className="h-4 w-4" />,
      items: [
        { to: '/donations', icon: <BarChart3 className="h-4 w-4" />, label: 'Bağış Listesi' },
        { to: '/donations/cash', icon: <Users className="h-4 w-4" />, label: 'Nakit Bağışlar' },
        { to: '/donations/vault', icon: <Users className="h-4 w-4" />, label: 'Bağış Veznesi' }
      ]
    },
    {
      id: 'messages',
      title: 'Mesaj Yönetimi',
      icon: <MessageSquare className="h-4 w-4" />,
      items: [
        { to: '/messages', icon: <MessageSquare className="h-4 w-4" />, label: 'Mesaj Yönetimi' },
        { to: '/messages/bulk-send', icon: <Users className="h-4 w-4" />, label: 'Toplu Gönderim' },
        { to: '/messages/templates', icon: <Users className="h-4 w-4" />, label: 'Şablonlar' }
      ]
    },
    {
      id: 'scholarship',
      title: 'Burs Yönetimi',
      icon: <GraduationCap className="h-4 w-4" />,
      items: [
        { to: '/scholarship', icon: <Users className="h-4 w-4" />, label: 'Öğrenciler' }
      ]
    },
    {
      id: 'demo',
      title: 'Demo',
      items: [
        { to: '/supabase-test', icon: <Database className="h-4 w-4" />, label: 'Supabase Test' }
      ]
    },
    {
      id: 'definitions',
      title: 'Tanımlamalar',
      icon: <Settings className="h-4 w-4" />,
      items: [
        { to: '/definitions/user-accounts', icon: <Users className="h-4 w-4" />, label: 'Kullanıcılar' },
        { to: '/definitions/general-settings', icon: <Settings className="h-4 w-4" />, label: 'Ayarlar' }
      ]
    }
  ]

  if (!isMobileSidebarOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" />
      
      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg text-sidebar-text transform transition-transform lg:hidden"
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-semibold">Dernek Paneli</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded p-3 hover:bg-sidebar-hover touch-target mobile-button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="h-full overflow-y-auto pb-14">
          <div className="space-y-1 p-3">
            {navigationItems.map((section) => (
              <div key={section.id}>
                {section.items && section.items.length > 1 ? (
                  // Expandable section
                  <>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center gap-3 rounded px-3 py-4 text-sm sidebar-nav-item mobile-nav-item"
                    >
                      {section.icon}
                      <span className="flex-1 text-left">{section.title}</span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.includes(section.id) && (
                      <div className="ml-6 space-y-1">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                              `flex items-center gap-3 rounded px-3 py-4 text-sm transition-colors sidebar-nav-item mobile-nav-item ${
                                isActive ? 'active' : ''
                              }`
                            }
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Single item
                  <div>
                    {section.title !== 'Genel' && (
                      <div className="mb-2 px-2 text-xs font-semibold uppercase text-sidebar-text-muted">
                        {section.title}
                      </div>
                    )}
                    {section.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors sidebar-nav-item ${
                            isActive ? 'active' : ''
                          }`
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// Mobile Menu Button Component
export const MobileMenuButton = () => {
  const { setMobileSidebarOpen } = useUIStore()

  return (
    <button
      id="mobile-menu-button"
      onClick={() => setMobileSidebarOpen(true)}
      className="rounded-lg p-3 hover:bg-accent lg:hidden touch-target mobile-button"
      title="Menü"
    >
      <Menu className="h-6 w-6" />
    </button>
  )
}

export default MobileSidebar
