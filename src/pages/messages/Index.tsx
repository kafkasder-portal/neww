import { useMemo, useState } from 'react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
// Mock data kaldırıldı - gerçek API'den veri gelecek

export interface MessageRow {
  id: string;
  recipient: string;
  recipientType: string;
  subject: string;
  content: string;
  messageType: string;
  status: string;
  priority: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  sentBy: string;
  groupId?: string;
  templateId?: string;
  cost: number;
  currency: string;
  retryCount: number;
  errorMessage?: string;
  time: string;
  date: string;
  group: string;
  sender: string;
  type: string;
}

type Message = MessageRow;
import { Modal } from '@components/Modal'
import MessageNavigation from '@components/MessageNavigation'
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  Target
} from 'lucide-react'

export default function MessagesIndex() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false)

  const mockData: Message[] = []; // Boş array - gerçek API'den veri gelecek

  const filtered = useMemo(() => {
    return mockData.filter(message => {
      const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           message.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter
      const matchesType = typeFilter === 'all' || message.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [searchTerm, statusFilter, typeFilter, priorityFilter, mockData])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'read': return <Eye className="h-4 w-4 text-green-600" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority === 'low' ? 'Düşük' : priority === 'normal' ? 'Normal' : priority === 'high' ? 'Yüksek' : 'Acil'}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      sms: 'bg-green-100 text-green-800',
      email: 'bg-blue-100 text-blue-800',
      notification: 'bg-purple-100 text-purple-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type === 'sms' ? 'SMS' : type === 'email' ? 'E-posta' : 'Bildirim'}
      </span>
    )
  }

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    setIsViewModalOpen(true)
  }

  const columns: Column<Message>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (_, message) => (
        <span className="font-mono text-sm text-gray-600">#{message.id}</span>
      )
    },
    {
      key: 'subject',
      header: 'Konu',
      render: (_, message) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(message.status)}
          <span className="font-medium">{message.subject}</span>
        </div>
      )
    },
    {
      key: 'sender',
      header: 'Gönderen',
      render: (_, message) => (
        <span className="text-sm">{message.sender}</span>
      )
    },
    {
      key: 'recipient',
      header: 'Alıcı',
      render: (_, message) => (
        <span className="text-sm">{message.recipient}</span>
      )
    },
    {
      key: 'type',
      header: 'Tür',
      render: (_, message) => getTypeBadge(message.type)
    },
    {
      key: 'priority',
      header: 'Öncelik',
      render: (_, message) => getPriorityBadge(message.priority)
    },
    {
      key: 'date',
      header: 'Tarih',
      render: (_, message) => (
        <div className="text-sm">
          <div>{message.date}</div>
          <div className="text-gray-500">{message.time}</div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_, message) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewMessage(message)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Görüntüle"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Düzenle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <MessageNavigation currentPath="/messages" />

      {/* Başlık ve Eylemler */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesaj Listesi</h1>
          <p className="text-gray-600 mt-1">Gönderilmiş ve alınmış mesajları görüntüle ve yönet</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Yenile
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            Dışa Aktar
          </button>
          <button
            onClick={() => setIsNewMessageModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Mesaj
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Konu, gönderen veya alıcı ara..."
          />
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtreler:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="sent">Gönderildi</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="read">Okundu</option>
            <option value="failed">Başarısız</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Türler</option>
            <option value="sms">SMS</option>
            <option value="email">E-posta</option>
            <option value="notification">Bildirim</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="low">Düşük</option>
            <option value="normal">Normal</option>
            <option value="high">Yüksek</option>
            <option value="urgent">Acil</option>
          </select>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select className="bg-transparent border-0 text-sm focus:outline-none">
              <option value="today">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Mesaj</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.length}</p>
              <p className="text-xs text-gray-500">Son 30 gün</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Başarılı</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.filter(m => m.status === 'delivered' || m.status === 'read').length}
              </p>
              <p className="text-xs text-gray-500">
                %{((mockData.filter(m => m.status === 'delivered' || m.status === 'read').length / mockData.length) * 100).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Beklemede</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.filter(m => m.status === 'sent').length}
              </p>
              <p className="text-xs text-gray-500">İşleniyor</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Başarısız</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.filter(m => m.status === 'failed').length}
              </p>
              <p className="text-xs text-gray-500">Tekrar denenecek</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Acil</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.filter(m => m.priority === 'urgent').length}
              </p>
              <p className="text-xs text-gray-500">Öncelikli</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Mesaj Görüntüleme Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Mesaj Detayları"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedMessage.status)}
                  <span className="text-sm">
                    {selectedMessage.status === 'sent' ? 'Gönderildi' :
                     selectedMessage.status === 'delivered' ? 'Teslim Edildi' :
                     selectedMessage.status === 'read' ? 'Okundu' : 'Başarısız'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gönderen</label>
                <p className="text-sm text-gray-900">{selectedMessage.sender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı</label>
                <p className="text-sm text-gray-900">{selectedMessage.recipient}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                {getTypeBadge(selectedMessage.type)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                {getPriorityBadge(selectedMessage.priority)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <p className="text-sm text-gray-900">{selectedMessage.date} {selectedMessage.time}</p>
              </div>
              {selectedMessage.group && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grup</label>
                  <p className="text-sm text-gray-900">{selectedMessage.group}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj İçeriği</label>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Yeni Mesaj Modal */}
      <Modal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        title="Yeni Mesaj Oluştur"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj Türü</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="notification">Bildirim</option>
                <option value="sms">SMS</option>
                <option value="email">E-posta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="normal">Normal</option>
                <option value="low">Düşük</option>
                <option value="high">Yüksek</option>
                <option value="urgent">Acil</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alıcı adı veya grup seçin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mesaj konusu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj İçeriği</label>
            <textarea
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mesaj içeriğini yazın..."
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsNewMessageModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Gönder
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
