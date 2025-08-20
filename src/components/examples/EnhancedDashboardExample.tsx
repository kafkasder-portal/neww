import {
  Calendar,
  DollarSign,
  Download,
  FileText,
  Heart,
  MessageSquare,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Search as CorporateSearch,
  EmptyState,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  KPICard,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Progress,
  QuickAccessCard,
  StatisticsCard,
  StatusIndicator,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '../ui/corporate/CorporateComponents'

// Mock data for demonstration
const mockKPIData = [
  {
    title: 'Toplam Bağışçı',
    value: '1,234',
    change: { value: 12.5, isPositive: true },
    icon: <Users className="w-6 h-6" />
  },
  {
    title: 'Aylık Bağış',
    value: '₺45,678',
    change: { value: 8.2, isPositive: true },
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    title: 'Aktif Kampanyalar',
    value: '8',
    change: { value: 3.1, isPositive: false },
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    title: 'Yardım Alanlar',
    value: '567',
    change: { value: 15.7, isPositive: true },
    icon: <Heart className="w-6 h-6" />
  }
]

const mockQuickAccessItems = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Bağışçı Yönetimi',
    description: 'Bağışçı bilgilerini görüntüle ve yönet',
    iconBgColor: 'bg-brand-primary-600'
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Finansal Raporlar',
    description: 'Gelir-gider raporlarını incele',
    iconBgColor: 'bg-semantic-success'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Etkinlik Takvimi',
    description: 'Yaklaşan etkinlikleri planla',
    iconBgColor: 'bg-semantic-warning'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'İletişim Merkezi',
    description: 'Mesajları ve bildirimleri yönet',
    iconBgColor: 'bg-semantic-info'
  }
]

const mockTableData = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    status: 'Aktif',
    amount: '₺1,500',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Fatma Demir',
    email: 'fatma@example.com',
    status: 'Aktif',
    amount: '₺2,300',
    date: '2024-01-14'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    status: 'Pasif',
    amount: '₺800',
    date: '2024-01-13'
  },
  {
    id: 4,
    name: 'Ayşe Özkan',
    email: 'ayse@example.com',
    status: 'Aktif',
    amount: '₺3,200',
    date: '2024-01-12'
  }
]

const EnhancedDashboardExample: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = mockTableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dernek Yönetim Paneli</h1>
        <p className="dashboard-subtitle">
          Bağışçılarınızı yönetin, finansal raporları inceleyin ve etkinliklerinizi planlayın
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4">
        {mockKPIData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-4">
        {mockQuickAccessItems.map((item, index) => (
          <QuickAccessCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            iconBgColor={item.iconBgColor}
            onClick={() => console.debug('Quick access clicked:', item.title)}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2">
        {/* Recent Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Son Bağışlar</CardTitle>
            <CardSubtitle>Son 30 gün içindeki bağışlar</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <CorporateSearch
                placeholder="Bağışçı ara..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>

            <Table
              columns={[
                {
                  key: 'donor',
                  title: 'Bağışçı',
                  render: (item) => (
                    <div className="flex items-center space-x-3">
                      <Avatar size="sm">
                        {item.name.charAt(0)}
                      </Avatar>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  )
                },
                {
                  key: 'email',
                  title: 'E-posta',
                  render: (item) => item.email
                },
                {
                  key: 'status',
                  title: 'Durum',
                  render: (item) => (
                    <Badge variant={item.status === 'Aktif' ? 'success' : 'neutral'}>
                      {item.status}
                    </Badge>
                  )
                },
                {
                  key: 'amount',
                  title: 'Tutar',
                  render: (item) => <span className="font-semibold">{item.amount}</span>
                },
                {
                  key: 'date',
                  title: 'Tarih',
                  render: (item) => item.date
                }
              ]}
              data={filteredData}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor İndir
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Bağış
            </Button>
          </CardFooter>
        </Card>

        {/* Statistics Cards */}
        <div className="space-y-6">
          <StatisticsCard
            title="Aylık Bağış Trendi"
            value="₺125,450"
            change={{ value: 12.5, isPositive: true }}
          />

          <StatisticsCard
            title="Aktif Bağışçı Sayısı"
            value="1,234"
            change={{ value: 8.2, isPositive: true }}
          />

          <StatisticsCard
            title="Ortalama Bağış Tutarı"
            value="₺450"
            change={{ value: 3.1, isPositive: false }}
          />
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kampanya Hedefleri</CardTitle>
            <CardSubtitle>Yıllık bağış hedefleri</CardSubtitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Genel Hedef</span>
                <span className="text-sm text-muted-foreground">₺1,500,000 / ₺2,000,000</span>
              </div>
              <Progress value={75} variant="success" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Acil Yardım</span>
                <span className="text-sm text-muted-foreground">₺300,000 / ₺500,000</span>
              </div>
              <Progress value={60} variant="warning" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Eğitim Desteği</span>
                <span className="text-sm text-muted-foreground">₺200,000 / ₺300,000</span>
              </div>
              <Progress value={67} variant="default" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Durumu</CardTitle>
            <CardSubtitle>Servis durumları</CardSubtitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIndicator status="online" />
                <span className="text-sm font-medium">Ana Sunucu</span>
              </div>
              <Badge variant="success">Aktif</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIndicator status="online" />
                <span className="text-sm font-medium">Veritabanı</span>
              </div>
              <Badge variant="success">Aktif</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIndicator status="away" />
                <span className="text-sm font-medium">E-posta Servisi</span>
              </div>
              <Badge variant="warning">Bakımda</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIndicator status="busy" />
                <span className="text-sm font-medium">Ödeme Sistemi</span>
              </div>
              <Badge variant="danger">Sorun</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <Alert variant="success">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Başarılı! Yeni bağışçı kaydı oluşturuldu.</span>
          </div>
        </Alert>

        <Alert variant="warning">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Dikkat! Bu ayki bağış hedefinin %80'i tamamlandı.</span>
          </div>
        </Alert>
      </div>

      {/* Modal Example */}
      <div className="flex justify-center">
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Bağışçı Ekle
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>
          <ModalTitle>Yeni Bağışçı Ekle</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="name">Ad Soyad</FormLabel>
              <FormInput id="name" placeholder="Bağışçının adı ve soyadı" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">E-posta</FormLabel>
              <FormInput id="email" type="email" placeholder="ornek@email.com" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="phone">Telefon</FormLabel>
              <FormInput id="phone" placeholder="0555 123 45 67" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="category">Kategori</FormLabel>
              <FormSelect id="category">
                <option value="">Kategori seçin</option>
                <option value="individual">Bireysel</option>
                <option value="corporate">Kurumsal</option>
                <option value="anonymous">Anonim</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="notes">Notlar</FormLabel>
              <FormTextarea id="notes" placeholder="Ek notlar..." rows={3} />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button onClick={() => setShowModal(false)}>
            Kaydet
          </Button>
        </ModalFooter>
      </Modal>

      {/* Empty State Example */}
      {filteredData.length === 0 && (
        <EmptyState
          icon={<FileText className="w-16 h-16" />}
          title="Bağış bulunamadı"
          description="Arama kriterlerinize uygun bağış kaydı bulunamadı. Farklı arama terimleri deneyebilirsiniz."
        />
      )}
    </div>
  )
}

export default EnhancedDashboardExample
