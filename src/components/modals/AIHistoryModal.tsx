import { useState, useEffect } from 'react'
import { X, Search, Clock, MessageSquare, Trash2, Copy, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { toast } from 'sonner'

interface AIHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCommand?: (command: string) => void
}

interface CommandHistoryItem {
  id: string
  command: string
  timestamp: Date
  response?: string
  success: boolean
}

export function AIHistoryModal({ isOpen, onClose, onSelectCommand }: AIHistoryModalProps) {
  const [history, setHistory] = useState<CommandHistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredHistory, setFilteredHistory] = useState<CommandHistoryItem[]>([])

  // Load history from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedHistory = localStorage.getItem('ai-command-history')
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory).map((item: unknown) => {
            const historyItem = item as { id: string; command: string; timestamp: string; response?: string; success: boolean }
            return {
              ...historyItem,
              timestamp: new Date(historyItem.timestamp)
            }
          })
          setHistory(parsed)
        } catch (error) {
          console.error('Error loading command history:', error)
          setHistory([])
        }
      }
    }
  }, [isOpen])

  // Filter history based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(history)
    } else {
      const filtered = history.filter(item =>
        item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.response && item.response.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredHistory(filtered)
    }
  }, [history, searchTerm])

  const handleSelectCommand = (command: string) => {
    if (onSelectCommand) {
      onSelectCommand(command)
      onClose()
      toast.success('Komut seçildi')
    }
  }

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    toast.success('Komut kopyalandı')
  }

  const handleDeleteItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('ai-command-history', JSON.stringify(updatedHistory))
    toast.success('Komut silindi')
  }

  const handleClearAll = () => {
    setHistory([])
    localStorage.removeItem('ai-command-history')
    toast.success('Tüm geçmiş temizlendi')
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes} dakika önce`
    if (hours < 24) return `${hours} saat önce`
    if (days < 7) return `${days} gün önce`
    return timestamp.toLocaleDateString('tr-TR')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Komut Geçmişi</h2>
              <span className="text-sm text-gray-500">({filteredHistory.length} komut)</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Komutlarda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tümünü Sil
            </Button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Arama kriterinize uygun komut bulunamadı' : 'Henüz komut geçmişi yok'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(item.timestamp)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.success ? 'Başarılı' : 'Hatalı'}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium text-gray-900 mb-1">Komut:</p>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                          {item.command}
                        </code>
                      </div>
                      
                      {item.response && (
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Yanıt:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                            {item.response}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCommand(item.command)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Kopyala
                      </Button>
                      
                      {onSelectCommand && (
                        <Button
                          size="sm"
                          onClick={() => handleSelectCommand(item.command)}
                          className="text-xs bg-blue-500 hover:bg-blue-600"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Kullan
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Komutlar otomatik olarak kaydedilir ve yerel depolamada saklanır.
            </span>
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Helper function to add command to history
export const addCommandToHistory = (command: string, response?: string, success: boolean = true) => {
  const historyItem: CommandHistoryItem = {
    id: Date.now().toString(),
    command,
    timestamp: new Date(),
    response,
    success
  }

  const existingHistory = localStorage.getItem('ai-command-history')
  let history: CommandHistoryItem[] = []
  
  if (existingHistory) {
    try {
      history = JSON.parse(existingHistory)
    } catch (error) {
      console.error('Error parsing command history:', error)
    }
  }

  // Add new item to the beginning
  history.unshift(historyItem)
  
  // Keep only the last 50 items
  history = history.slice(0, 50)
  
  localStorage.setItem('ai-command-history', JSON.stringify(history))
}