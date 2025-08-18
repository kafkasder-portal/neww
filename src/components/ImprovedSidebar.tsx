import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Search,
  X,
  Star,
  Clock,
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  Coins,
  Mail,
  GraduationCap,
  HelpingHand,
  Wallet,
  Settings,
  Shield,
  FileText,
  Menu,
  TrendingUp
} from 'lucide-react'

interface MenuGroup {
  id: string
  label: string
  icon: React.ReactNode
  items: MenuItem[]
  priority: 'high' | 'medium' | 'low'
}

interface MenuItem {
  id: string
  to: string
  label: string
  icon: React.ReactNode
  badge?: number
  keywords?: string[]
}

export function ImprovedSidebar() {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCompact, setIsCompact] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['dashboard']))
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['/aid/beneficiaries', '/donations', '/messages']))
  const [recentlyUsed] = useState<string[]>(['/aid/beneficiaries', '/donations/cash', '/messages/bulk-send'])

  // Organize menu items by priority and usage
  const menuGroups: MenuGroup[] = [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      icon: <Home className="h-4 w-4" />,
      priority: 'high',
      items: [
        { id: 'home', to: '/', label: 'Dashboard', icon: <TrendingUp className="h-4 w-4" /> }
      ]
    },
    {
      id: 'aid',
      label: 'Yardım Yönetimi',
      icon: <HelpingHand className="h-4 w-4" />,
      priority: 'high',
      items: [
        { id: 'beneficiaries', to: '/aid/beneficiaries', label: 'İhtiyaç Sahipleri', icon: <Users className="h-4 w-4" />, keywords: ['kişi', 'ihtiyaç', 'faydalanıcı'] },
        { id: 'applications', to: '/aid/applications', label: 'Başvurular', icon: <FileText className="h-4 w-4" />, badge: 5, keywords: ['başvuru', 'talep'] },
        { id: 'aid-reports', to: '/aid/reports', label: 'Raporlar', icon: <TrendingUp className="h-4 w-4" />, keywords: ['rapor', 'analiz'] }
      ]
    },
    {
      id: 'donations',
      label: 'Bağış Yönetimi',
      icon: <Coins className="h-4 w-4" />,
      priority: 'high',
      items: [
        { id: 'donations-list', to: '/donations', label: 'Bağış Listesi', icon: <Coins className="h-4 w-4" />, keywords: ['bağış', 'donation'] },
        { id: 'cash-donations', to: '/donations/cash', label: 'Nakit Bağışlar', icon: <Wallet className="h-4 w-4" />, keywords: ['nakit', 'para'] },
        { id: 'institutions', to: '/donations/institutions', label: 'Kurumlar', icon: <Users className="h-4 w-4" />, keywords: ['kurum', 'institution'] }
      ]
    },
    {
      id: 'messages',
      label: 'Mesaj Yönetimi',
      icon: <Mail className="h-4 w-4" />,
      priority: 'medium',
      items: [
        { id: 'messages-main', to: '/messages', label: 'Mesaj Merkezi', icon: <Mail className="h-4 w-4" />, keywords: ['mesaj', 'iletişim'] },
        { id: 'bulk-send', to: '/messages/bulk-send', label: 'Toplu Gönderim', icon: <Mail className="h-4 w-4" />, keywords: ['toplu', 'gönderim', 'bulk'] }
      ]
    },
    {
      id: 'scholarship',
      label: 'Burs Yönetimi',
      icon: <GraduationCap className="h-4 w-4" />,
      priority: 'medium',
      items: [
        { id: 'students', to: '/scholarship', label: 'Öğrenciler', icon: <GraduationCap className="h-4 w-4" />, keywords: ['öğrenci', 'burs', 'yetim'] }
      ]
    },
    {
      id: 'system',
      label: 'Sistem & Ayarlar',
      icon: <Settings className="h-4 w-4" />,
      priority: 'low',
      items: [
        { id: 'definitions', to: '/definitions/general-settings', label: 'Genel Ayarlar', icon: <Settings className="h-4 w-4" />, keywords: ['ayar', 'tanım', 'config'] },
        { id: 'users', to: '/definitions/user-accounts', label: 'Kullanıcılar', icon: <Users className="h-4 w-4" />, keywords: ['kullanıcı', 'hesap'] },
        { id: 'security', to: '/system/ip-blocking', label: 'Güvenlik', icon: <Shield className="h-4 w-4" />, keywords: ['güvenlik', 'ip', 'engel'] }
      ]
    }
  ]

  // Filter items based on search
  const filteredGroups = searchTerm 
    ? menuGroups.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })).filter(group => group.items.length > 0)
    : menuGroups

  // Get all menu items for favorites and recent
  const allItems = menuGroups.flatMap(group => group.items)

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId)
    } else {
      newFavorites.add(itemId)
    }
    setFavorites(newFavorites)
  }

  // Auto-expand groups based on current location
  useEffect(() => {
    const currentGroup = menuGroups.find(group =>
      group.items.some(item => item.to === location.pathname)
    )
    if (currentGroup) {
      setExpandedGroups(prev => new Set([...prev, currentGroup.id]))
    }
  }, [location.pathname])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Ara"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      if (e.key === 'Escape') {
        setSearchTerm('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const favoriteItems = allItems.filter(item => favorites.has(item.to))
  const recentItems = allItems.filter(item => recentlyUsed.includes(item.to))

  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 border-r bg-white text-gray-900 md:block overflow-hidden transition-all duration-300 ${isCompact ? 'w-16' : 'w-72'}`}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!isCompact && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DP</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Dernek Paneli</span>
          </Link>
        )}
        <button
          onClick={() => setIsCompact(!isCompact)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={isCompact ? 'Genişlet' : 'Daralt'}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Search */}
        {!isCompact && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ara... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Menüde ara"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {!isCompact && !searchTerm && (
            <>
              {/* Favorites */}
              {favoriteItems.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-500 mb-2">
                    <Star className="h-3 w-3" />
                    Favoriler
                  </div>
                  <div className="space-y-1">
                    {favoriteItems.map(item => (
                      <NavLink
                        key={item.id}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                            isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`
                        }
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(item.to)
                          }}
                          className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </button>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Used */}
              {recentItems.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-500 mb-2">
                    <Clock className="h-3 w-3" />
                    Son Kullanılan
                  </div>
                  <div className="space-y-1">
                    {recentItems.slice(0, 3).map(item => {
                      const menuItem = allItems.find(i => i.to === item.to)
                      if (!menuItem) return null
                      return (
                        <NavLink
                          key={menuItem.id}
                          to={menuItem.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                              isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`
                          }
                        >
                          {menuItem.icon}
                          <span className="flex-1">{menuItem.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Main Menu */}
          <div className="space-y-2">
            {!isCompact && !searchTerm && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-gray-500 mb-2">
                <Menu className="h-3 w-3" />
                Tüm Modüller
              </div>
            )}
            
            {filteredGroups.map(group => (
              <div key={group.id} className="group">
                {isCompact ? (
                  <NavLink
                    to={group.items[0]?.to || '/'}
                    className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    title={group.label}
                  >
                    {group.icon}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {group.icon}
                      <span className="flex-1 text-left">{group.label}</span>
                      {group.items.length > 1 && (
                        expandedGroups.has(group.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {(expandedGroups.has(group.id) || searchTerm) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {group.items.map(item => (
                          <div key={item.id} className="group/item">
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                                }`
                              }
                            >
                              {item.icon}
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleFavorite(item.to)
                                }}
                                className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover/item:opacity-100 transition-opacity"
                              >
                                <Star className={`h-3 w-3 ${favorites.has(item.to) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                              </button>
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Search Results */}
          {searchTerm && filteredGroups.length === 0 && !isCompact && (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">&quot;{searchTerm}&quot; için sonuç bulunamadı</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCompact && (
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              <p>Dernek Yönetim Paneli v2.0</p>
              <p className="mt-1">Ctrl+K ile arama yapın</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
