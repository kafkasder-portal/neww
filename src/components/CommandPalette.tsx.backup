import { useEffect, useMemo, useRef, useState, startTransition, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllActions } from '../lib/ai/actions'
import { parseIntent } from '../lib/ai/intent'
import { useTheme } from '../contexts/ThemeContext'
import { Bot, Zap } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  toggleChat: () => void
  onOpenAICenter?: () => void
}

export default function CommandPalette({ isOpen, onClose, toggleChat, onOpenAICenter }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setSelected(0)
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          const event = new CustomEvent('open-command-palette')
          window.dispatchEvent(event)
        }
      }
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        startTransition(() => {
          setSelected((s) => Math.min(s + 1, 9))
        })
      }
      if (e.key === 'ArrowUp') {
        startTransition(() => {
          setSelected((s) => Math.max(s - 1, 0))
        })
      }
      if (e.key === 'Enter') execute()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, query, onClose])

  useEffect(() => {
    const open = () => isOpen ? undefined : onOpen()
    window.addEventListener('open-command-palette', open as any)
    return () => window.removeEventListener('open-command-palette', open as any)
  }, [isOpen])

  const onOpen = () => {
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const all = useMemo(() => getAllActions(), [])

  const filtered = useMemo(() => {
    const actions = [...all]

    // AI Komut Merkezi öğesi ekle
    if (onOpenAICenter) {
      actions.unshift({
        id: 'ai:command-center',
        label: 'AI Komut Merkezi',
        description: 'Doğal dil ile komut ver, akıllı otomasyon',
        keywords: ['ai', 'yapay zeka', 'akıllı', 'otomasyon', 'komut'],
        run: () => {
          onOpenAICenter()
          onClose()
        }
      })
    }

    if (!query) return actions.slice(0, 10)
    const { action } = parseIntent(query)
    if (action) return [action, ...actions.filter(a => a.id !== action.id)].slice(0, 10)
    const q = query.toLowerCase()
    return actions.filter(a => a.label.toLowerCase().includes(q) || (a.keywords||[]).some(k => k.toLowerCase().includes(q))).slice(0, 10)
  }, [all, query, onOpenAICenter, onClose])

  const execute = useCallback(async () => {
    const item = filtered[selected]
    if (!item) return
    await item.run({
      navigateTo: (path) => navigate(path),
      setTheme: (t) => setTheme(t),
      toggleChat,
    }, { query })
    onClose()
  }, [filtered, selected, navigate, setTheme, toggleChat, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-lg bg-background shadow-xl ring-1 ring-border" onClick={e => e.stopPropagation()}>
        <div className="border-b p-3">
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              startTransition(() => {
                setQuery(e.target.value)
              })
            }}
            placeholder="Komut yazın veya ? ile yardım alın (Cmd/Ctrl+K)"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <ul className="max-h-80 overflow-auto p-1">
          {filtered.map((a, idx) => (
            <li key={a.id}
                onMouseEnter={() => {
                  startTransition(() => {
                    setSelected(idx)
                  })
                }}
                onClick={execute}
                className={"cursor-pointer rounded px-3 py-2 text-sm flex items-center gap-2 " + (idx === selected ? 'bg-accent text-accent-foreground' : '')}
            >
              {a.id === 'ai:command-center' && <Bot className="w-4 h-4 text-blue-500" />}
              {a.id.includes('agent:') && <Zap className="w-4 h-4 text-green-500" />}
              <div className="flex-1">
                <div className="font-medium">{a.label}</div>
                {a.description ? <div className="text-muted-foreground text-xs">{a.description}</div> : null}
                <div className="text-xs text-muted-foreground">{a.id}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t p-2 text-right text-xs text-muted-foreground">Enter: Çalıştır • Esc: Kapat • ↑/↓: Seç</div>
      </div>
    </div>
  )
}
