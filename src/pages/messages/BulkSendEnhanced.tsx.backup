import { useState } from 'react'
import MessageNavigation from '@components/MessageNavigation'
import { 
  Send, 
  Users, 
  FileText, 
  Upload, 
  Calendar, 
  Clock,
  Target,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react'
import { useFormSanitization } from '@hooks/useSanitization'

export default function BulkSendEnhanced() {
  const [messageType, setMessageType] = useState('sms')
  const [recipientType, setRecipientType] = useState('groups')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [priority, setPriority] = useState('normal')
  
  const { createSanitizedChangeHandler } = useFormSanitization()
  // Message sanitization hook available if needed

  // Mock data
  const availableGroups = [
    { id: '1', name: 'Aktif Üyeler', count: 1250, lastUpdated: '2024-01-15' },
    { id: '2', name: 'VIP Müşteriler', count: 320, lastUpdated: '2024-01-14' },
    { id: '3', name: 'Yeni Kayıtlar', count: 89, lastUpdated: '2024-01-15' },
    { id: '4', name: 'İnaktif Kullanıcılar', count: 456, lastUpdated: '2024-01-10' },
    { id: '5', name: 'Bölge Temsilcileri', count: 24, lastUpdated: '2024-01-12' }
  ]

  const availableTemplates = [
    { id: '1', name: 'Randevu Hatırlatması', type: 'sms', preview: 'Sayın {isim}, yarın saat {saat} randevunuz bulunmaktadır.' },
    { id: '2', name: 'Ödeme Bildirimi', type: 'email', preview: 'Merhaba {isim}, ödemenizin son tarihi {tarih}dir.' },
    { id: '3', name: 'Kampanya Duyurusu', type: 'sms', preview: 'Özel fırsat! %{indirim} indirim kodu: {kod}' },
    { id: '4', name: 'Sistem Bakımı', type: 'notification', preview: 'Sistem bakımı: {tarih} {saat}-{bitis} arası hizmet verilmeyecektir.' }
  ]

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const getTotalRecipients = () => {
    return selectedGroups.reduce((total, groupId) => {
      const group = availableGroups.find(g => g.id === groupId)
      return total + (group?.count || 0)
    }, 0)
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Smartphone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'notification': return <MessageSquare className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getCharacterCount = () => {
    if (messageType === 'sms') {
      const count = messageContent.length
      const smsCount = Math.ceil(count / 160)
      return { count, limit: 160, smsCount }
    }
    return { count: messageContent.length, limit: null, smsCount: null }
  }

  const charInfo = getCharacterCount()

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <MessageNavigation currentPath="/messages/bulk-send" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toplu Mesaj Gönderimi</h1>
          <p className="text-gray-600 mt-1">Birden fazla alıcıya aynı anda mesaj gönderin</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="h-4 w-4" />
            Önizleme
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Send className="h-4 w-4" />
            Gönder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Type Selection */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj Türü</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: 'sms', label: 'SMS', icon: Smartphone, desc: 'Kısa metin mesajı' },
                { type: 'email', label: 'E-posta', icon: Mail, desc: 'Detaylı e-posta' },
                { type: 'notification', label: 'Bildirim', icon: MessageSquare, desc: 'Uygulama bildirimi' }
              ].map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  onClick={() => setMessageType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    messageType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alıcı Seçimi</h3>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setRecipientType('groups')}
                className={`px-4 py-2 rounded-lg ${
                  recipientType === 'groups'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Gruplar
              </button>
              <button
                onClick={() => setRecipientType('manual')}
                className={`px-4 py-2 rounded-lg ${
                  recipientType === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Manuel
              </button>
              <button
                onClick={() => setRecipientType('file')}
                className={`px-4 py-2 rounded-lg ${
                  recipientType === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Dosya
              </button>
            </div>

            {recipientType === 'groups' && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-3">
                  Mesaj gönderilecek grupları seçin:
                </div>
                {availableGroups.map(group => (
                  <div
                    key={group.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGroups.includes(group.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleGroupToggle(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{group.name}</div>
                        <div className="text-sm text-gray-600">
                          {group.count.toLocaleString()} kişi • Son güncelleme: {group.lastUpdated}
                        </div>
                      </div>
                      <div className={`p-1 rounded-full ${
                        selectedGroups.includes(group.id) ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recipientType === 'manual' && (
              <div>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Telefon numaralarını veya e-posta adreslerini virgül ile ayırarak girin..."
                />
                <div className="text-xs text-gray-500 mt-2">
                  Örnek: +90555123456, +90555789012 veya user1@email.com, user2@email.com
                </div>
              </div>
            )}

            {recipientType === 'file' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 mb-2">CSV veya Excel dosyası yükleyin</div>
                <div className="text-xs text-gray-500 mb-4">
                  Maksimum dosya boyutu: 10MB
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Dosya Seç
                </button>
                <div className="mt-4">
                  <a href="#" className="text-blue-600 text-sm hover:underline">
                    <Download className="h-4 w-4 inline mr-1" />
                    Örnek şablonu indir
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj İçeriği</h3>
            
            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şablon Seç (Opsiyonel)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value)
                  const template = availableTemplates.find(t => t.id === e.target.value)
                  if (template) {
                    setMessageContent(template.preview)
                  }
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Şablon seçin...</option>
                {availableTemplates
                  .filter(t => t.type === messageType)
                  .map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Message Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj Metni
              </label>
              <textarea
                rows={messageType === 'email' ? 8 : 4}
                value={messageContent}
                onChange={createSanitizedChangeHandler(
                  (value) => setMessageContent(value),
                  'text'
                )}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  messageType === 'sms' 
                    ? 'SMS mesajınızı yazın...' 
                    : messageType === 'email'
                    ? 'E-posta içeriğinizi yazın...'
                    : 'Bildirim mesajınızı yazın...'
                }
              />
              
              {/* Character Counter for SMS */}
              {messageType === 'sms' && (
                <div className="flex justify-between items-center mt-2 text-xs">
                  <div className="text-gray-500">
                    Değişkenler: {'{isim}'}, {'{tarih}'}, {'{saat}'}
                  </div>
                  <div className={`${charInfo.count > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                    {charInfo.count}/160 karakter
                    {charInfo.smsCount && charInfo.smsCount > 1 && (
                      <span className="ml-2">({charInfo.smsCount} SMS)</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Email Subject (only for email) */}
            {messageType === 'email' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Konusu
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={createSanitizedChangeHandler(
                    (value) => setEmailSubject(value),
                    'text'
                  )}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E-posta konusunu girin..."
                />
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gönderim Ayarları</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Gönderim Tarihi
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Gönderim Saati
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4 inline mr-1" />
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Düşük</option>
                <option value="normal">Normal</option>
                <option value="high">Yüksek</option>
                <option value="urgent">Acil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gönderim Özeti</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getMessageTypeIcon(messageType)}
                <div>
                  <div className="font-medium text-gray-900">
                    {messageType === 'sms' ? 'SMS' : messageType === 'email' ? 'E-posta' : 'Bildirim'}
                  </div>
                  <div className="text-sm text-gray-600">Mesaj türü</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-4 w-4 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {getTotalRecipients().toLocaleString()} kişi
                  </div>
                  <div className="text-sm text-gray-600">Toplam alıcı</div>
                </div>
              </div>
              
              {scheduledDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {scheduledDate} {scheduledTime}
                    </div>
                    <div className="text-sm text-gray-600">Zamanlanmış gönderim</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Tahmini Maliyet</h4>
            <div className="text-2xl font-bold mb-1">
              {messageType === 'sms' 
                ? `${(getTotalRecipients() * 0.12).toFixed(2)} ₺`
                : messageType === 'email'
                ? `${(getTotalRecipients() * 0.05).toFixed(2)} ₺`
                : 'Ücretsiz'
              }
            </div>
            <div className="text-sm opacity-90">
              {messageType === 'sms' && '0.12 ₺/SMS'}
              {messageType === 'email' && '0.05 ₺/E-posta'}
              {messageType === 'notification' && 'Bildirimler ücretsizdir'}
            </div>
          </div>

          {/* Selected Groups */}
          {selectedGroups.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Seçili Gruplar</h4>
              <div className="space-y-2">
                {selectedGroups.map(groupId => {
                  const group = availableGroups.find(g => g.id === groupId)
                  return group ? (
                    <div key={groupId} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                        <div className="text-xs text-gray-600">{group.count} kişi</div>
                      </div>
                      <button
                        onClick={() => handleGroupToggle(groupId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Warnings */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Önemli Notlar</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Toplu mesajlar geri alınamaz</li>
                  <li>• SMS karakter limiti: 160</li>
                  <li>• Zamanlanmış mesajlar 30 gün önceden planlanabilir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
