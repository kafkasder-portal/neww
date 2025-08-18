import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { 
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  GraduationCap,
  Calendar,
  Tag,
  Archive
} from 'lucide-react'

export default function ScholarshipDefinitions() {
  const [activeTab, setActiveTab] = useState('types')
  const [searchTerm, setSearchTerm] = useState('')

  const scholarshipTypes = [
    {
      id: 1,
      name: 'Eğitim Bursu',
      description: 'Temel eğitim masrafları için verilen burs',
      amount: 500,
      duration: '1 Akademik Yıl',
      isActive: true
    },
    {
      id: 2,
      name: 'Yetim Bursu',
      description: 'Yetim öğrenciler için özel burs programı',
      amount: 750,
      duration: 'Mezuniyete Kadar',
      isActive: true
    },
    {
      id: 3,
      name: 'Başarı Bursu',
      description: 'Akademik başarı gösteren öğrenciler için',
      amount: 1000,
      duration: '1 Dönem',
      isActive: true
    },
    {
      id: 4,
      name: 'İhtiyaç Bursu',
      description: 'Maddi imkanları yetersiz aileler için',
      amount: 400,
      duration: '6 Ay',
      isActive: false
    }
  ]

  const educationLevels = [
    {
      id: 1,
      name: 'İlkokul',
      description: '1-4. sınıf öğrencileri',
      minAmount: 200,
      maxAmount: 400,
      isActive: true
    },
    {
      id: 2,
      name: 'Ortaokul',
      description: '5-8. sınıf öğrencileri',
      minAmount: 300,
      maxAmount: 500,
      isActive: true
    },
    {
      id: 3,
      name: 'Lise',
      description: '9-12. sınıf öğrencileri',
      minAmount: 400,
      maxAmount: 700,
      isActive: true
    },
    {
      id: 4,
      name: 'Üniversite',
      description: 'Lisans ve önlisans öğrencileri',
      minAmount: 800,
      maxAmount: 1500,
      isActive: true
    }
  ]

  const paymentSchedules = [
    {
      id: 1,
      name: 'Aylık',
      description: 'Her ay düzenli ödeme',
      frequency: 12,
      isActive: true
    },
    {
      id: 2,
      name: 'Dönemlik',
      description: 'Dönem başında toplu ödeme',
      frequency: 2,
      isActive: true
    },
    {
      id: 3,
      name: 'Yıllık',
      description: 'Yıl başında tek seferde ödeme',
      frequency: 1,
      isActive: true
    },
    {
      id: 4,
      name: 'Çeyreklik',
      description: '3 ayda bir ödeme',
      frequency: 4,
      isActive: false
    }
  ]

  const categories = [
    {
      id: 1,
      name: 'Kitap ve Kırtasiye',
      description: 'Eğitim materyalleri desteği',
      budgetLimit: 200,
      isActive: true
    },
    {
      id: 2,
      name: 'Ulaşım',
      description: 'Okul servis ve ulaşım masrafları',
      budgetLimit: 150,
      isActive: true
    },
    {
      id: 3,
      name: 'Beslenme',
      description: 'Okul kantini ve yemek masrafları',
      budgetLimit: 300,
      isActive: true
    },
    {
      id: 4,
      name: 'Kıyafet',
      description: 'Okul forması ve kış kıyafetleri',
      budgetLimit: 250,
      isActive: true
    }
  ]

  const tabs = [
    { id: 'types', label: 'Burs Türleri', icon: <Tag className="h-4 w-4" /> },
    { id: 'levels', label: 'Eğitim Seviyeleri', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'payments', label: 'Ödeme Planları', icon: <Calendar className="h-4 w-4" /> },
    { id: 'categories', label: 'Harcama Kategorileri', icon: <Archive className="h-4 w-4" /> }
  ]

  const getCurrentData = () => {
    switch (activeTab) {
      case 'types': return scholarshipTypes
      case 'levels': return educationLevels
      case 'payments': return paymentSchedules
      case 'categories': return categories
      default: return []
    }
  }

  const getTableHeaders = () => {
    switch (activeTab) {
      case 'types':
        return ['Burs Türü', 'Açıklama', 'Tutar', 'Süre', 'Durum', 'İşlemler']
      case 'levels':
        return ['Eğitim Seviyesi', 'Açıklama', 'Min. Tutar', 'Max. Tutar', 'Durum', 'İşlemler']
      case 'payments':
        return ['Ödeme Planı', 'Açıklama', 'Yıllık Sıklık', 'Durum', 'İşlemler']
      case 'categories':
        return ['Kategori', 'Açıklama', 'Bütçe Limiti', 'Durum', 'İşlemler']
      default:
        return []
    }
  }

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'types':
        return (
          <tr key={item.id} className="border-b hover:bg-muted/50">
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3 text-muted-foreground">{item.description}</td>
            <td className="p-3">₺{item.amount}</td>
            <td className="p-3">{item.duration}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case 'levels':
        return (
          <tr key={item.id} className="border-b hover:bg-muted/50">
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3 text-muted-foreground">{item.description}</td>
            <td className="p-3">₺{item.minAmount}</td>
            <td className="p-3">₺{item.maxAmount}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case 'payments':
        return (
          <tr key={item.id} className="border-b hover:bg-muted/50">
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3 text-muted-foreground">{item.description}</td>
            <td className="p-3">{item.frequency} kez</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case 'categories':
        return (
          <tr key={item.id} className="border-b hover:bg-muted/50">
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3 text-muted-foreground">{item.description}</td>
            <td className="p-3">₺{item.budgetLimit}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Burs Tanımlamaları</h1>
        </div>
        <p className="text-white/90">
          Burs türleri, eğitim seviyeleri ve ödeme planlarının yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aktif Burs Türü</p>
              <p className="text-2xl font-bold">{scholarshipTypes.filter(t => t.isActive).length}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Eğitim Seviyesi</p>
              <p className="text-2xl font-bold">{educationLevels.length}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ödeme Planı</p>
              <p className="text-2xl font-bold">{paymentSchedules.filter(p => p.isActive).length}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Harcama Kategorisi</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-80"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Ekle
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {getTableHeaders().map((header, index) => (
                    <th key={index} className="p-3 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getCurrentData().map(renderTableRow)}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
