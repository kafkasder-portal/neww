import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  Search, 
  Sun, 
  Moon, 
  Keyboard, 
  Calendar,
  Clock,
  ArrowRight,
  Command
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useSearch } from '../hooks/useSearch'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { cn } from '../lib/utils'

const HeaderActions = memo(function HeaderActions() {
  const navigate = useNavigate()
  const { theme, isDarkMode, toggleDarkMode, cycleTheme } = useTheme()
  const {
    isSearchOpen,
    searchQuery,
    filteredPages,
    recentResults,
    openSearch,
    closeSearch,
    handleSearch,
    handleResultClick,
    clearRecentSearches
  } = useSearch()

  // Keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    onSearch: openSearch,
    onToggleTheme: toggleDarkMode,
    onCloseModal: closeSearch,
    onNavigateToHome: () => navigate('/')
  })

  // Handle search result selection
  const handleResultSelect = useCallback((result: any) => {
    handleResultClick(result)
    navigate(result.href)
  }, [handleResultClick, navigate])

  // Get current date for "Today" button
  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex items-center gap-2">
      {/* Quick Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full justify-start bg-background text-sm font-normal text-muted-foreground shadow-none md:w-40 lg:w-64"
            onClick={openSearch}
          >
            <Search className="mr-2 h-4 w-4 shrink-0" />
            <span className="hidden lg:inline-flex">Ara...</span>
            <span className="inline-flex lg:hidden">Ara...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="sr-only">Hızlı Arama</DialogTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Sayfa ara..."
                className="pl-10 pr-4 h-12 text-base border-0 focus-visible:ring-0 shadow-none"
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            {/* Search Results */}
            {searchQuery && filteredPages.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Arama Sonuçları
                </div>
                {filteredPages.map((page) => {
                  const Icon = page.icon
                  return (
                    <Button
                      key={page.href}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 mb-1"
                      onClick={() => handleResultSelect(page)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{page.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{page.category}</span>
                            {page.description && (
                              <>
                                <span>•</span>
                                <span className="truncate">{page.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Recent Searches */}
            {!searchQuery && recentResults.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Son Aramalar
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    onClick={clearRecentSearches}
                  >
                    Temizle
                  </Button>
                </div>
                {recentResults.map((page) => {
                  const Icon = page.icon
                  return (
                    <Button
                      key={page.href}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 mb-1"
                      onClick={() => handleResultSelect(page)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{page.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {page.category}
                          </div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredPages.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-sm text-muted-foreground">
                  "{searchQuery}" için sonuç bulunamadı
                </div>
              </div>
            )}

            {/* Default Content */}
            {!searchQuery && recentResults.length === 0 && (
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Hızlı erişim için sayfa ismi yazın
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground px-2">
                    Klavye Kısayolları
                  </div>
                  <div className="grid gap-1">
                    {shortcuts.slice(0, 4).map((shortcut) => (
                      <div key={shortcut.keys} className="flex items-center justify-between px-2 py-1 text-xs">
                        <span className="text-muted-foreground">{shortcut.description}</span>
                        <kbd className="font-mono text-xs bg-muted px-1 rounded">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={toggleDarkMode}
        title={`${isDarkMode ? 'Açık' : 'Koyu'} temaya geç`}
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span className="sr-only">Tema değiştir</span>
      </Button>

      {/* Keyboard Shortcuts Help */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 hidden md:flex"
            title="Klavye kısayolları"
          >
            <Keyboard className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Kısayollar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Klavye Kısayolları</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="outline" className="font-mono">
                  {shortcut.keys}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Today Button */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 hidden lg:flex"
        title="Bugünün tarihi"
      >
        <Calendar className="mr-2 h-4 w-4" />
        <span>Bugün</span>
      </Button>

      {/* Separator */}
      <Separator orientation="vertical" className="h-6 hidden md:block" />

      {/* New Project Button */}
      <Button
        size="sm"
        className="h-8 px-4"
        onClick={() => navigate('/projects/new')}
      >
        Yeni Proje
      </Button>
    </div>
  )
})

export { HeaderActions }
