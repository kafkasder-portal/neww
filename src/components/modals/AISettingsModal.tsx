import { useState } from 'react'
import { X, Save, Volume2, Zap, Clock, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { toast } from 'sonner'

interface AISettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AISettings {
  voiceEnabled: boolean
  autoSuggestions: boolean
  commandHistory: boolean
  maxHistoryItems: number
  responseDelay: number
  language: 'tr' | 'en'
  theme: 'light' | 'dark' | 'auto'
  soundEffects: boolean
}

const defaultSettings: AISettings = {
  voiceEnabled: true,
  autoSuggestions: true,
  commandHistory: true,
  maxHistoryItems: 20,
  responseDelay: 500,
  language: 'tr',
  theme: 'light',
  soundEffects: true
}

export function AISettingsModal({ isOpen, onClose }: AISettingsModalProps) {
  const [settings, setSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('ai-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<AISettings>
        return { ...defaultSettings, ...parsed }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    try {
      localStorage.setItem('ai-settings', JSON.stringify(settings))
      toast.success('Ayarlar kaydedildi')
      setHasChanges(false)
      onClose()
    } catch (_error) {
      toast.error('Ayarlar kaydedilemedi')
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
    toast.success('Ayarlar sıfırlandı')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">AI Ayarları</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Ses Ayarları */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Ses Ayarları
              </h3>
              <div className="space-y-3 pl-6">
                <label className="flex items-center justify-between">
                  <span>Sesli komut desteği</span>
                  <input
                    type="checkbox"
                    checked={settings.voiceEnabled}
                    onChange={(e) => updateSetting('voiceEnabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span>Ses efektleri</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Komut Ayarları */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Komut Ayarları
              </h3>
              <div className="space-y-3 pl-6">
                <label className="flex items-center justify-between">
                  <span>Otomatik öneriler</span>
                  <input
                    type="checkbox"
                    checked={settings.autoSuggestions}
                    onChange={(e) => updateSetting('autoSuggestions', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span>Komut geçmişi</span>
                  <input
                    type="checkbox"
                    checked={settings.commandHistory}
                    onChange={(e) => updateSetting('commandHistory', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                
                <div className="flex items-center justify-between">
                  <span>Maksimum geçmiş sayısı</span>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={settings.maxHistoryItems}
                    onChange={(e) => updateSetting('maxHistoryItems', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Yanıt gecikmesi (ms)</span>
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    step="100"
                    value={settings.responseDelay}
                    onChange={(e) => updateSetting('responseDelay', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Genel Ayarlar */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Genel Ayarlar
              </h3>
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <span>Dil</span>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value as 'tr' | 'en')}
                    className="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Tema</span>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'auto')}
                    className="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Açık</option>
                    <option value="dark">Koyu</option>
                    <option value="auto">Otomatik</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Sıfırla
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}