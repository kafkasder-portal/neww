import { useState, useMemo } from 'react'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Filter,
  Download,
  Upload,
  Star
} from 'lucide-react'
import { DataTable } from '@components/DataTable'
import type { Column } from '@components/DataTable'
import { Modal } from '@components/Modal'
// Mock data kaldırıldı - gerçek API'den veri gelecek

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  category: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  description?: string;
  isFavorite?: boolean;
}
import { useFormSanitization } from '@hooks/useSanitization'

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateContent, setTemplateContent] = useState('')
  const [templateCategory, setTemplateCategory] = useState('general')
  const [templateType, setTemplateType] = useState<'sms' | 'email' | 'notification'>('notification')
  const [isFavorite, setIsFavorite] = useState(false)
  
  const { createSanitizedChangeHandler } = useFormSanitization()
  // Message sanitization hooks available if needed
  
  // Şablon kategorileri
  const categories = [
    { value: 'general', label: 'Genel' },
    { value: 'welcome', label: 'Hoş Geldin' },
    { value: 'reminder', label: 'Hatırlatma' },
    { value: 'notification', label: 'Bildirim' },
    { value: 'promotion', label: 'Promosyon' },
    { value: 'emergency', label: 'Acil Durum' }
  ]

  // Mock data - gerçek API entegrasyonu yapılana kadar
  const messageTemplates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Hoş Geldiniz Mesajı',
      subject: 'Derneğimize Hoş Geldiniz',
      content: 'Sayın {firstName} {lastName},\n\nKafkas Kültür ve Dayanışma Derneği ailesine hoş geldiniz. Sizinle birlikte daha güçlü bir topluluk oluşturuyoruz.\n\nSaygılarımızla,\nDernek Yönetimi',
      type: 'email',
      category: 'welcome',
      variables: ['firstName', 'lastName'],
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      usageCount: 25
    },
    {
      id: '2',
      name: 'Toplantı Daveti',
      subject: 'Aylık Genel Toplantı Daveti',
      content: 'Sayın {firstName},\n\n{meetingDate} tarihinde saat {meetingTime} da yapılacak aylık genel toplantımıza katılımınızı bekliyoruz.\n\nToplantı Konuları:\n- Aylık faaliyet raporu\n- Bütçe değerlendirmesi\n- Yeni projeler\n\nKonum: {location}\n\nSaygılarımızla,\nDernek Yönetimi',
      type: 'email',
      category: 'meeting',
      variables: ['firstName', 'meetingDate', 'meetingTime', 'location'],
      isActive: true,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      usageCount: 15
    },
    {
      id: '3',
      name: 'Yardım Başvuru Onayı',
      subject: 'Yardım Başvurunuz Onaylandı',
      content: 'Sayın {firstName} {lastName},\n\n{applicationDate} tarihinde yapmış olduğunuz {aidType} yardım başvurunuz onaylanmıştır.\n\nYardım Tutarı: {amount} TL\nDağıtım Tarihi: {distributionDate}\n\nGerekli evrakları tamamladıktan sonra yardımınızı alabilirsiniz.\n\nSaygılarımızla,\nDernek Yönetimi',
      type: 'sms',
      category: 'aid',
      variables: ['firstName', 'lastName', 'applicationDate', 'aidType', 'amount', 'distributionDate'],
      isActive: true,
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z',
      usageCount: 42
    },
    {
      id: '4',
      name: 'Doğum Günü Kutlaması',
      subject: 'Doğum Gününüz Kutlu Olsun!',
      content: 'Sevgili {firstName},\n\nDoğum gününüzü kutlar, sağlık, mutluluk ve başarı dolu bir yaş dileriz.\n\nDernek ailesi olarak her zaman yanınızdayız.\n\nSevgi ve saygılarımızla,\nKafkas Kültür ve Dayanışma Derneği',
      type: 'email',
      category: 'birthday',
      variables: ['firstName'],
      isActive: true,
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z',
      usageCount: 8
    },
    {
      id: '5',
      name: 'Acil Durum Bildirimi',
      subject: 'ACİL: Önemli Duyuru',
      content: 'Sayın üyelerimiz,\n\nACİL DURUM: {emergencyMessage}\n\nLütfen dernek merkezini arayınız: {phoneNumber}\n\nDernek Yönetimi',
      type: 'sms',
      category: 'emergency',
      variables: ['emergencyMessage', 'phoneNumber'],
      isActive: true,
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2024-02-05T10:00:00Z',
      usageCount: 2
    },
    {
      id: '6',
      name: 'Burs Başvuru Sonucu',
      subject: 'Burs Başvuru Değerlendirme Sonucu',
      content: 'Sayın {firstName} {lastName},\n\n{academicYear} eğitim-öğretim yılı için yapmış olduğunuz burs başvurunuz değerlendirilmiştir.\n\nSonuç: {result}\n{resultMessage}\n\nDetaylı bilgi için dernek merkezimizi ziyaret edebilirsiniz.\n\nBaşarılar dileriz,\nEğitim Koordinatörlüğü',
      type: 'email',
      category: 'scholarship',
      variables: ['firstName', 'lastName', 'academicYear', 'result', 'resultMessage'],
      isActive: true,
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-02-10T10:00:00Z',
      usageCount: 18
    }
  ];

  const filtered = useMemo(() => {
    return messageTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
      const matchesType = typeFilter === 'all' || template.type === typeFilter
      
      return matchesSearch && matchesCategory && matchesType
    })
  }, [searchTerm, categoryFilter, typeFilter, messageTemplates])

  const handleViewTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const handleEditTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setTemplateName(template.name)
    setTemplateSubject(template.subject)
    setTemplateContent(template.content)
    setTemplateCategory(template.category || 'general')
    setTemplateType(template.type as 'sms' | 'email' | 'notification')
    setIsFavorite(template.isFavorite || false)
    setIsEditModalOpen(true)
  }

  const handleNewTemplate = () => {
    setTemplateName('')
    setTemplateSubject('')
    setTemplateContent('')
    setTemplateCategory('general')
    setTemplateType('notification')
    setIsFavorite(false)
    setIsNewTemplateModalOpen(true)
  }

  const handleCopyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.content)
    alert('Şablon içeriği panoya kopyalandı!')
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      welcome: 'bg-blue-100 text-blue-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      notification: 'bg-purple-100 text-purple-800',
      promotion: 'bg-green-100 text-green-800',
      emergency: 'bg-red-100 text-red-800'
    }
    const categoryLabel = categories.find(c => c.value === category)?.label || category
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
        {categoryLabel}
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

  const columns: Column<MessageTemplate>[] = [
    {
      key: 'name',
      header: 'Şablon Adı',
      render: (_, template) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{template.name}</span>
           {template.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Konu',
      render: (_, template) => (
        <span className="text-sm">{template.subject}</span>
      )
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (_, template) => getCategoryBadge(template.category || 'general')
    },
    {
      key: 'type',
      header: 'Tür',
      render: (_, template) => getTypeBadge(template.type)
    },
    {
      key: 'usageCount',
      header: 'Kullanım',
      render: (_, template) => (
        <span className="font-medium">{template.usageCount || 0}</span>
      )
    },
    {
      key: 'createdAt',
      header: 'Oluşturulma',
      render: (_, template) => (
        <span className="text-sm">{template.createdAt}</span>
      )
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (_, template) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewTemplate(template)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Görüntüle"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleCopyTemplate(template)}
            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
            title="Kopyala"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditTemplate(template)}
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
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesaj Şablonları</h1>
          <p className="text-gray-600 mt-1">Hazır mesaj şablonlarını yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Upload className="h-4 w-4" />
            İçe Aktar
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            Dışa Aktar
          </button>
          <button
            onClick={handleNewTemplate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Şablon
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
            placeholder="Şablon adı, konu veya içerik ara..."
          />
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtreler:</span>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Türler</option>
            <option value="sms">SMS</option>
            <option value="email">E-posta</option>
            <option value="notification">Bildirim</option>
          </select>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Toplam Şablon</p>
              <p className="text-2xl font-bold text-gray-900">{messageTemplates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Favori Şablonlar</p>
              <p className="text-2xl font-bold text-gray-900">
                {messageTemplates.filter(t => t.isFavorite).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">En Çok Kullanılan</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...messageTemplates.map(t => t.usageCount || 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Kategoriler</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Şablon Listesi */}
      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Şablon Görüntüleme Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Şablon Detayları"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şablon Adı</label>
                <p className="text-sm text-gray-900">{selectedTemplate.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                {getCategoryBadge(selectedTemplate.category || 'general')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                {getTypeBadge(selectedTemplate.type)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanım Sayısı</label>
                <p className="text-sm text-gray-900">{selectedTemplate.usageCount || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
                <p className="text-sm text-gray-900">{selectedTemplate.createdAt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favori</label>
                <p className="text-sm text-gray-900">{selectedTemplate.isFavorite ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-900">{selectedTemplate.subject}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTemplate.content}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => handleCopyTemplate(selectedTemplate)}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Kopyala
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  handleEditTemplate(selectedTemplate)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Düzenle
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Şablon Düzenleme Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Şablon Düzenle"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şablon Adı</label>
              <input
                type="text"
                value={templateName}
                onChange={createSanitizedChangeHandler(
                  (value) => setTemplateName(value),
                  'text'
                )}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şablon adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as 'notification' | 'sms' | 'email')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="notification">Bildirim</option>
                <option value="sms">SMS</option>
                <option value="email">E-posta</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Favori olarak işaretle</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
            <input
              type="text"
              value={templateSubject}
              onChange={createSanitizedChangeHandler(
                (value) => setTemplateSubject(value),
                'text'
              )}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mesaj konusu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
            <textarea
              value={templateContent}
              onChange={createSanitizedChangeHandler(
                (value) => setTemplateContent(value),
                'text'
              )}
              rows={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şablon içeriği..."
            />
            <div className="text-sm text-gray-500 mt-1">
              Karakter sayısı: {templateContent.length}
            </div>
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

      {/* Yeni Şablon Modal */}
      <Modal
        isOpen={isNewTemplateModalOpen}
        onClose={() => setIsNewTemplateModalOpen(false)}
        title="Yeni Şablon Oluştur"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şablon Adı</label>
              <input
                type="text"
                value={templateName}
                onChange={createSanitizedChangeHandler(
                  (value) => setTemplateName(value),
                  'text'
                )}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şablon adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as 'notification' | 'sms' | 'email')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="notification">Bildirim</option>
                <option value="sms">SMS</option>
                <option value="email">E-posta</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Favori olarak işaretle</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
            <input
              type="text"
              value={templateSubject}
              onChange={createSanitizedChangeHandler(
                (value) => setTemplateSubject(value),
                'text'
              )}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mesaj konusu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
            <textarea
              value={templateContent}
              onChange={createSanitizedChangeHandler(
                (value) => setTemplateContent(value),
                'text'
              )}
              rows={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şablon içeriği..."
            />
            <div className="text-sm text-gray-500 mt-1">
              Karakter sayısı: {templateContent.length}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsNewTemplateModalOpen(false)}
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
    </div>
  )
}
