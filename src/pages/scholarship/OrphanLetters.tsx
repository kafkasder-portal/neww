import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  Mail,
  Plus,
  Send,
  Reply,
  Download,
  Search,
  Calendar,
  // User,
  FileText,
  // Heart,
  // MessageCircle,
  Archive
} from 'lucide-react'

export default function OrphanLetters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [_selectedLetter, setSelectedLetter] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'templates'>('received')

  const receivedLetters = [
    {
      id: 1,
      studentName: 'Ayşe Yılmaz',
      studentId: 'YTM001',
      subject: 'Teşekkür Mektubu',
      content: 'Sevgili dernek ailesi, bana verdiğiniz destekten dolayı çok mutluyum. Okulda çok başarılıyım ve sizleri gururlandırmak istiyorum...',
      date: '2024-01-15',
      type: 'Teşekkür',
      hasResponse: false,
      attachments: ['resim1.jpg'],
      mood: 'happy'
    },
    {
      id: 2,
      studentName: 'Mehmet Demir',
      studentId: 'YTM002',
      subject: 'Okul Hayatım',
      content: 'Merhaba, bu dönem matematik dersinde çok zorlanıyorum. Ama vazgeçmiyorum, çalışmaya devam ediyorum...',
      date: '2024-01-12',
      type: 'Günlük Hayat',
      hasResponse: true,
      attachments: [],
      mood: 'neutral'
    },
    {
      id: 3,
      studentName: 'Fatma Kaya',
      studentId: 'YTM003',
      subject: 'Rüyalarım',
      content: 'Büyüdüğümde doktor olmak istiyorum. Hasta insanlara yardım etmek çok güzel bir şey olmalı...',
      date: '2024-01-10',
      type: 'Hedefler',
      hasResponse: false,
      attachments: ['çizim1.pdf'],
      mood: 'excited'
    }
  ]

  const sentLetters = [
    {
      id: 1,
      recipientName: 'Ayşe Yılmaz',
      subject: 'Doğum Günü Kutlaması',
      content: 'Sevgili Ayşe, doğum gününü kutlarız. Bu özel günde mutluluğun hiç eksilmesin...',
      date: '2024-01-08',
      sentBy: 'Fatma Hanım',
      status: 'Delivered'
    },
    {
      id: 2,
      recipientName: 'Mehmet Demir',
      subject: 'Matematik Desteği',
      content: 'Merhaba Mehmet, matematik konusunda zorlandığını duydum. Sana yardımcı olacak kaynaklar gönderdik...',
      date: '2024-01-13',
      sentBy: 'Ahmet Bey',
      status: 'Read'
    }
  ]

  const letterTemplates = [
    {
      id: 1,
      name: 'Hoş Geldin Mektubu',
      description: 'Yeni katılan öğrenciler için',
      content: 'Sevgili [ÖĞRENCİ_ADI], dernek ailemize hoş geldin...',
      category: 'Karşılama'
    },
    {
      id: 2,
      name: 'Doğum Günü Kutlaması',
      description: 'Doğum günü kutlama mektubu',
      content: 'Sevgili [ÖĞRENCİ_ADI], doğum gününü kutlarız...',
      category: 'Kutlama'
    },
    {
      id: 3,
      name: 'Akademik Başarı Tebriği',
      description: 'Başarılı öğrenciler için',
      content: 'Tebrikler [ÖĞRENCİ_ADI], akademik başarın...',
      category: 'Tebrik'
    },
    {
      id: 4,
      name: 'Motivasyon Mektubu',
      description: 'Zorlandığı dönemlerde destek',
      content: 'Sevgili [ÖĞRENCİ_ADI], bazen hayat zor olabilir...',
      category: 'Destek'
    }
  ]

  const stats = {
    totalReceived: receivedLetters.length,
    totalSent: sentLetters.length,
    pendingResponse: receivedLetters.filter(l => !l.hasResponse).length,
    templates: letterTemplates.length
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '😊'
      case 'sad':
        return '😔'
      case 'excited':
        return '🤗'
      case 'worried':
        return '😟'
      default:
        return '😐'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Teşekkür':
        return 'bg-green-100 text-green-800'
      case 'Günlük Hayat':
        return 'bg-blue-100 text-blue-800'
      case 'Hedefler':
        return 'bg-purple-100 text-purple-800'
      case 'Sorun':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredLetters = receivedLetters.filter(letter =>
    letter.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Mail className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Yetim Mektupları</h1>
        </div>
        <p className="text-white/90">
          Yetim öğrenciler ile yazışma ve iletişim yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gelen Mektup</p>
              <p className="text-2xl font-bold">{stats.totalReceived}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gönderilen</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalSent}</p>
            </div>
            <Send className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yanıt Bekleyen</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingResponse}</p>
            </div>
            <Reply className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Şablon</p>
              <p className="text-2xl font-bold text-purple-600">{stats.templates}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'received'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-4 w-4" />
            Gelen Mektuplar
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'sent'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Send className="h-4 w-4" />
            Gönderilen Mektuplar
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'templates'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            Mektup Şablonları
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Mektup ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-80"
            />
          </div>
          <div className="flex gap-2">
            {activeTab === 'templates' && (
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Şablon
              </Button>
            )}
            {activeTab !== 'templates' && (
              <>
                <Button variant="outline" className="gap-2">
                  <Archive className="h-4 w-4" />
                  Arşivle
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni Mektup
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {filteredLetters.map((letter) => (
              <div 
                key={letter.id} 
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedLetter(letter)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getMoodIcon(letter.mood)}</span>
                        <div>
                          <h3 className="font-semibold">{letter.studentName}</h3>
                          <p className="text-sm text-muted-foreground">{letter.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(letter.type)}`}>
                          {letter.type}
                        </span>
                        {!letter.hasResponse && (
                          <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                            Yanıt Bekliyor
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">{letter.subject}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {letter.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(letter.date).toLocaleDateString('tr-TR')}
                        </span>
                        {letter.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <FileText className="h-4 w-4" />
                            {letter.attachments.length} ek
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Reply className="h-4 w-4 mr-1" />
                          Yanıtla
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentLetters.map((letter) => (
              <div key={letter.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{letter.recipientName}</h3>
                        <p className="text-sm text-muted-foreground">Gönderen: {letter.sentBy}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        letter.status === 'Read' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {letter.status === 'Read' ? 'Okundu' : 'Teslim Edildi'}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">{letter.subject}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {letter.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(letter.date).toLocaleDateString('tr-TR')}
                      </span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letterTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="line-clamp-3">{template.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Düzenle
                    </Button>
                    <Button size="sm" className="flex-1">
                      Kullan
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
