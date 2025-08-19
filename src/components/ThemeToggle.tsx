import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from './ui/button'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Açık tema (Koyu temaya geç)'
      case 'dark':
        return 'Koyu tema (Sistem temasına geç)'
      case 'system':
        return 'Sistem teması (Açık temaya geç)'
      default:
        return 'Tema değiştir'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      className="h-9 w-9 transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {getIcon()}
    </Button>
  )
}

// Dropdown versiyonu
export const ThemeToggleDropdown = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {theme === 'light' && <Sun className="h-4 w-4" />}
        {theme === 'dark' && <Moon className="h-4 w-4" />}
        {theme === 'system' && <Monitor className="h-4 w-4" />}
      </Button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-1">
          <button
            onClick={() => setTheme('light')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
              theme === 'light' ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Sun className="h-4 w-4" />
            Açık Tema
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
              theme === 'dark' ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Moon className="h-4 w-4" />
            Koyu Tema
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
              theme === 'system' ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Monitor className="h-4 w-4" />
            Sistem Teması
          </button>
        </div>
      </div>
    </div>
  )
}