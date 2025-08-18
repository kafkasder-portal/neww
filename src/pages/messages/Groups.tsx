import { useState, useMemo, useCallback } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  UserMinus,
  Filter,
  Download,
  Upload
} from 'lucide-react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { Modal } from '@components/Modal'
// Mock data kaldırıldı - gerçek API'den veri gelecek

export interface MessageGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  isActive: boolean;
}

interface GroupMember {
  id: string
  name: string
  phone?: string
  email?: string
  joinDate: string
  status: 'active' | 'inactive'
}

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedGroup, setSelectedGroup] = useState<MessageGroup | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false)
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  
  // Mock üye verileri
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      phone: '+90 532 123 4567',
      email: 'ahmet@example.com',
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Fatma Demir',
      phone: '+90 533 987 6543',
      email: 'fatma@example.com',
      joinDate: '2024-01-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mehmet Kaya',
      phone: '+90 534 555 1234',
      email: 'mehmet@example.com',
      joinDate: '2024-02-01',
      status: 'inactive'
    }
  ])

  const messageGroups: MessageGroup[] = []; // Boş array - gerçek API'den veri gelecek

  const filtered = useMemo(() => {
    return messageGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || group.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter, messageGroups])

  const handleViewGroup = useCallback((group: MessageGroup) => {
    setSelectedGroup(group)
    setIsViewModalOpen(true)
  }, [])

  const handleEditGroup = useCallback((group: MessageGroup) => {
    setSelectedGroup(group)
    setGroupName(group.name)
    setGroupDescription(group.description)
    setIsEditModalOpen(true)
  }, [])

  const handleViewMembers = useCallback((group: MessageGroup) => {
    setSelectedGroup(group)
    setIsMembersModalOpen(true)
  }, [])

  const handleNewGroup = useCallback(() => {
    setGroupName('')
    setGroupDescription('')
    setIsNewGroupModalOpen(true)
  }, [])

  const addMember = useCallback(() => {
    if (newMemberName && (newMemberPhone || newMemberEmail)) {
      const newMember: GroupMember = {
        id: Date.now().toString(),
        name: newMemberName,
        phone: newMemberPhone,
        email: newMemberEmail,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
      }
      setGroupMembers(prev => [...prev, newMember])
      setNewMemberName('')
      setNewMemberPhone('')
      setNewMemberEmail('')
    }
  }, [newMemberName, newMemberPhone, newMemberEmail])

  const removeMember = useCallback((memberId: string) => {
    setGroupMembers(prev => prev.filter(m => m.id !== memberId))
  }, [])

  const toggleMemberStatus = useCallback((memberId: string) => {
    setGroupMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
        : m
    ))
  }, [])

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status === 'active' ? 'Aktif' : 'Pasif'}
      </span>
    )
  }

  const columns: Column<MessageGroup>[] = [
    {
      key: 'name',
      header: 'Grup Adı',
      render: (_, group: MessageGroup) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{group.name}</span>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Açıklama',
      render: (_, group: MessageGroup) => (
        <span className="text-sm text-gray-600">{group.description}</span>
      )
    },
    {
      key: 'member_count',
      header: 'Üye Sayısı',
      render: (_, group: MessageGroup) => (
        <span className="font-medium">{group.memberCount}</span>
      )
    },
    {
      key: 'status',
      header: 'Durum',
      render: (_, group: MessageGroup) => getStatusBadge(group.status)
    },
    {
      key: 'created_date',
      header: 'Oluşturulma Tarihi',
      render: (_, group: MessageGroup) => (
        <span className="text-sm">{group.createdAt}</span>
      )
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_, group: MessageGroup) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewGroup(group)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Görüntüle"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewMembers(group)}
            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
            title="Üyeleri Görüntüle"
          >
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditGroup(group)}
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

  const memberColumns: Column<GroupMember>[] = [
    {
      key: 'name',
      header: 'Ad Soyad',
      render: (_, member: GroupMember) => (
        <span className="font-medium">{member.name}</span>
      )
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (_, member: GroupMember) => (
        <span className="text-sm">{member.phone || '-'}</span>
      )
    },
    {
      key: 'email',
      header: 'E-posta',
      render: (_, member: GroupMember) => (
        <span className="text-sm">{member.email || '-'}</span>
      )
    },
    {
      key: 'joinDate',
      header: 'Katılım Tarihi',
      render: (_, member: GroupMember) => (
        <span className="text-sm">{member.joinDate}</span>
      )
    },
    {
      key: 'status',
      header: 'Durum',
      render: (_, member: GroupMember) => getStatusBadge(member.status)
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_, member: GroupMember) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleMemberStatus(member.id)}
            className={`p-1 rounded ${
              member.status === 'active' 
                ? 'text-orange-600 hover:bg-orange-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={member.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
          >
            {member.status === 'active' ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          </button>
          <button
            onClick={() => removeMember(member.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Gruptan Çıkar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesaj Grupları</h1>
          <p className="text-gray-600 mt-1">Mesaj gönderim gruplarını yönetin</p>
        </div>
        <button
          onClick={handleNewGroup}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Grup
        </button>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Grup adı veya açıklama ara..."
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Durum:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Toplam Grup</p>
              <p className="text-2xl font-bold text-gray-900">{messageGroups.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Aktif Gruplar</p>
              <p className="text-2xl font-bold text-gray-900">
                {messageGroups.filter(g => g.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Toplam Üye</p>
              <p className="text-2xl font-bold text-gray-900">
                {messageGroups.reduce((total, group) => total + group.memberCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Pasif Gruplar</p>
              <p className="text-2xl font-bold text-gray-900">
                {messageGroups.filter(g => g.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grup Listesi */}
      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Grup Görüntüleme Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Grup Detayları"
      >
        {selectedGroup && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
                <p className="text-sm text-gray-900">{selectedGroup.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                {getStatusBadge(selectedGroup.status)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Üye Sayısı</label>
                <p className="text-sm text-gray-900">{selectedGroup.memberCount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
                <p className="text-sm text-gray-900">{selectedGroup.createdAt}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-900">{selectedGroup.description}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Grup Düzenleme Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Grup Düzenle"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Grup adı"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Grup açıklaması"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      {/* Yeni Grup Modal */}
      <Modal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        title="Yeni Grup Oluştur"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Grup adı"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Grup açıklaması"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsNewGroupModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Oluştur
            </button>
          </div>
        </div>
      </Modal>

      {/* Üyeler Modal */}
      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={`${selectedGroup?.name} - Üyeler`}
      >
        <div className="space-y-4">
          {/* Yeni üye ekleme */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Yeni Üye Ekle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Ad Soyad"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newMemberPhone}
                onChange={(e) => setNewMemberPhone(e.target.value)}
                placeholder="Telefon"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="E-posta"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
                  <Upload className="h-4 w-4" />
                  Dosyadan İçe Aktar
                </button>
                <button className="flex items-center gap-1 text-sm text-green-600 hover:bg-green-50 px-2 py-1 rounded">
                  <Download className="h-4 w-4" />
                  Dışa Aktar
                </button>
              </div>
              <button
                onClick={addMember}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Üye listesi */}
          <div>
            <DataTable columns={memberColumns} data={groupMembers} />
          </div>
        </div>
      </Modal>
    </div>
  )
}