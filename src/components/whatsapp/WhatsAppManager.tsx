import React, { useState, useEffect } from 'react'
import { Card, CorporateButton, CorporateBadge, CorporateCard } from '@/components/ui/corporate/CorporateComponents'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // Kullanılmıyor

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  QrCode
} from 'lucide-react'
import { whatsappService, WhatsAppMessage, MessageTemplate, ScheduledMessage } from '@/lib/whatsapp/whatsappMockService'
// import { saveAs } from 'file-saver' // Gerekirse tekrar eklenebilir

export const WhatsAppManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connection')
  const [connectionStatus, setConnectionStatus] = useState({ isReady: false, isConnected: false })

  // Mesaj gönderme
  const [recipient, setRecipient] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // Şablonlar
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  // newTemplate state kaldırıldı
  
  // Zamanlanmış mesajlar
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([])
  // newScheduled state kaldırıldı
  
  // Mesaj geçmişi
  const [messageHistory, setMessageHistory] = useState<WhatsAppMessage[]>([])
  
  // İstatistikler
  const [statistics, setStatistics] = useState({
    totalMessages: 0,
    messages24h: 0,
    messages7d: 0,
    sentMessages: 0,
    deliveredMessages: 0,
    failedMessages: 0,
    pendingScheduled: 0
  })

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000) // Her 5 saniyede bir güncelle
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setConnectionStatus(whatsappService.getConnectionStatus())
    setTemplates(whatsappService.getTemplates())
    setScheduledMessages(whatsappService.getScheduledMessages())
    setMessageHistory(whatsappService.getMessageHistory())
    setStatistics(whatsappService.getStatistics())
  }

  const handleConnect = async () => {
    try {
      await whatsappService.initialize()
      loadData()
    } catch (error) {
      console.error('Bağlantı hatası:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await whatsappService.destroy()
      loadData()
    } catch (error) {
      console.error('Bağlantı kesme hatası:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!recipient || !messageContent) return
    
    setIsSending(true)
    try {
      const success = await whatsappService.sendMessage(recipient, messageContent)
      if (success) {
        setMessageContent('')
        loadData()
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error)
    } finally {
      setIsSending(false)
    }
  }

  // handleAddTemplate fonksiyonu kaldırıldı

  // handleScheduleMessage fonksiyonu kaldırıldı

  const handleCancelScheduled = (id: string) => {
    whatsappService.cancelScheduledMessage(id)
    loadData()
  }

  // extractVariables fonksiyonu kaldırıldı

  const formatPhoneNumber = (phone: string) => {
    return phone.replace('@c.us', '').replace('@s.whatsapp.net', '')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR')
  }

  return (
    <div className="space-y-6">
      {/* Bağlantı Durumu */}
      <CorporateCard className="p-6 bg-card rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <h2 className="text-xl font-semibold">WhatsApp Bağlantısı</h2>
            <CorporateBadge variant={connectionStatus.isReady ? 'default' : 'secondary'}>
              {connectionStatus.isReady ? 'Bağlı' : 'Bağlantı Yok'}
            </CorporateBadge>
          </div>
          <div className="flex space-x-2">
            <CorporateButton
              variant="outline"
              size="sm"
              onClick={handleConnect}
              disabled={connectionStatus.isConnected}
            >
              <Wifi className="w-4 h-4 mr-1" />
              Bağlan
            </CorporateButton>
            <CorporateButton
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={!connectionStatus.isConnected}
            >
              <WifiOff className="w-4 h-4 mr-1" />
              Bağlantıyı Kes
            </CorporateButton>
            <CorporateButton
              variant="outline"
              size="sm"
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Yenile
            </CorporateButton>
          </div>
        </div>
      </CorporateCard>

      {/* Ana İçerik */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="connection">Bağlantı</TabsTrigger>
          <TabsTrigger value="send">Mesaj Gönder</TabsTrigger>
          <TabsTrigger value="templates">Şablonlar</TabsTrigger>
          <TabsTrigger value="scheduled">Zamanlanmış</TabsTrigger>
          <TabsTrigger value="history">Geçmiş</TabsTrigger>
          <TabsTrigger value="stats">İstatistikler</TabsTrigger>
        </TabsList>

        {/* Bağlantı Sekmesi */}
        <TabsContent value="connection" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">QR Kod Tarama</h3>
            <div className="text-center py-8">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">QR kod bekleniyor...</p>
            </div>
          </CorporateCard>
        </TabsContent>

        {/* Mesaj Gönderme Sekmesi */}
        <TabsContent value="send" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Mesaj Gönder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alıcı Numarası</label>
                <Input
                  placeholder="905xxxxxxxxx"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mesaj</label>
                <Textarea
                  placeholder="Mesajınızı yazın..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>
              <CorporateButton
                onClick={handleSendMessage}
                disabled={isSending || !recipient || !messageContent}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Gönderiliyor...' : 'Gönder'}
              </CorporateButton>
            </div>
          </CorporateCard>
        </TabsContent>

        {/* Şablonlar Sekmesi */}
        <TabsContent value="templates" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mesaj Şablonları</h3>
              <CorporateButton size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Yeni Şablon
              </CorporateButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <CorporateCard key={template.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <CorporateBadge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Aktif' : 'Pasif'}
                    </CorporateBadge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.content}</p>
                  <div className="flex items-center justify-between">
                    <CorporateBadge variant="outline">{template.category}</CorporateBadge>
                    <div className="flex space-x-1">
                      <CorporateButton size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </CorporateButton>
                      <CorporateButton size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </CorporateButton>
                    </div>
                  </div>
                </CorporateCard>
              ))}
            </div>
          </CorporateCard>
        </TabsContent>

        {/* Zamanlanmış Mesajlar Sekmesi */}
        <TabsContent value="scheduled" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Zamanlanmış Mesajlar</h3>
            <div className="space-y-4">
              {scheduledMessages.map((message) => (
                <CorporateCard key={message.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formatPhoneNumber(message.to)}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(message.scheduledAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CorporateBadge variant={
                        message.status === 'pending' ? 'default' :
                        message.status === 'sent' ? 'secondary' :
                        'destructive'
                      }>
                        {message.status}
                      </CorporateBadge>
                      {message.status === 'pending' && (
                        <CorporateButton size="sm" variant="ghost" onClick={() => handleCancelScheduled(message.id)}>
                          <Trash2 className="w-4 h-4" />
                        </CorporateButton>
                      )}
                    </div>
                  </div>
                </CorporateCard>
              ))}
            </div>
          </CorporateCard>
        </TabsContent>

        {/* Mesaj Geçmişi Sekmesi */}
        <TabsContent value="history" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Mesaj Geçmişi</h3>
            <div className="space-y-6-group max-h-96 overflow-y-auto">
              {messageHistory.map((message) => (
                <CorporateCard key={message.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formatPhoneNumber(message.from)}</p>
                      <p className="text-sm text-gray-600">{message.body}</p>
                      <p className="text-xs text-gray-500">{formatDate(message.timestamp)}</p>
                    </div>
                    <CorporateBadge variant={
                      message.status === 'sent' ? 'default' :
                      message.status === 'delivered' ? 'secondary' :
                      'destructive'
                    }>
                      {message.status}
                    </CorporateBadge>
                  </div>
                </CorporateCard>
              ))}
            </div>
          </CorporateCard>
        </TabsContent>

        {/* İstatistikler Sekmesi */}
        <TabsContent value="stats" className="space-y-4">
          <CorporateCard className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">İstatistikler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalMessages}</div>
                <div className="text-sm text-gray-600">Toplam Mesaj</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.messages24h}</div>
                <div className="text-sm text-gray-600">Son 24 Saat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statistics.sentMessages}</div>
                <div className="text-sm text-gray-600">Gönderilen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statistics.failedMessages}</div>
                <div className="text-sm text-gray-600">Başarısız</div>
              </div>
            </div>
          </CorporateCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
