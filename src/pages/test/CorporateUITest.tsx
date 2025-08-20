import {
    BarChart3,
    DollarSign,
    FileText,
    Package,
    Settings,
    Users
} from 'lucide-react'
import React, { useState } from 'react'

import { 
  CorporateAlert,
  CorporateBadge,
  CorporateButton,
  CorporateCard,
  CorporateCardContent,
  CorporateCardHeader,
  CorporateCardTitle,
  CorporateModal,
  CorporateModalBody,
  CorporateModalFooter,
  CorporateModalHeader,
  CorporateModalTitle,
  CorporateProgress,
  CorporateSearch,
  CorporateTable,
  CorporateTableCell,
  CorporateTableHeader,
  CorporateTableHeaderCell,
  CorporateTableRow,
  KPICard,
  QuickAccessCard,
  StatisticsCard
} from '@components/ui/corporate/CorporateComponents'

const CorporateUITest: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const mockKPIData = [
        {
            title: 'Toplam Bağış',
            value: '₺2,847,500',
            change: { value: 12.5, isPositive: true },
            icon: <DollarSign className="w-8 h-8" />
        },
        {
            title: 'Aktif Bağışçı',
            value: '1,247',
            change: { value: 8.2, isPositive: true },
            icon: <Users className="w-8 h-8" />
        },
        {
            title: 'Yardım Edilen',
            value: '3,456',
            change: { value: 2.1, isPositive: false },
            icon: <Package className="w-8 h-8" />
        },
        {
            title: 'Bekleyen Başvuru',
            value: '89',
            change: { value: 15.3, isPositive: true },
            icon: <FileText className="w-8 h-8" />
        }
    ]

    const mockTableData = [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', status: 'active', role: 'Admin' },
        { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', status: 'inactive', role: 'User' },
        { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', status: 'active', role: 'Moderator' },
    ]

    return (
        <div className="max-w-7xl mx-auto p-6 bg-card rounded-lg border space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kurumsal UI Test Sayfası</h1>
                <p className="text-lg text-gray-600">Tüm kurumsal bileşenlerin test edildiği sayfa</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4">
                {mockKPIData.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </div>

            {/* Buttons */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Buton Bileşenleri</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <CorporateButton variant="primary">Primary Button</CorporateButton>
                            <CorporateButton variant="secondary">Secondary Button</CorporateButton>
                            <CorporateButton variant="success">Success Button</CorporateButton>
                            <CorporateButton variant="danger">Danger Button</CorporateButton>
                            <CorporateButton variant="ghost">Ghost Button</CorporateButton>
                        </div>
                        <div className="space-y-4">
                            <CorporateButton variant="primary" size="sm">Small Primary</CorporateButton>
                            <CorporateButton variant="secondary" size="lg">Large Secondary</CorporateButton>
                            <CorporateButton variant="success" disabled>Disabled Success</CorporateButton>
                        </div>
                    </div>
                </CorporateCardContent>
            </CorporateCard>

            {/* Search */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Arama Bileşeni</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <CorporateSearch
                        placeholder="Ara..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onSearch={() => console.log('Search:', searchValue)}
                    />
                </CorporateCardContent>
            </CorporateCard>

            {/* Table */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Tablo Bileşeni</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <CorporateTable>
                        <CorporateTableHeader>
                            <CorporateTableHeaderCell>ID</CorporateTableHeaderCell>
                            <CorporateTableHeaderCell>İsim</CorporateTableHeaderCell>
                            <CorporateTableHeaderCell>Email</CorporateTableHeaderCell>
                            <CorporateTableHeaderCell>Durum</CorporateTableHeaderCell>
                            <CorporateTableHeaderCell>Rol</CorporateTableHeaderCell>
                        </CorporateTableHeader>
                        {mockTableData.map((row) => (
                            <CorporateTableRow key={row.id}>
                                <CorporateTableCell>{row.id}</CorporateTableCell>
                                <CorporateTableCell>{row.name}</CorporateTableCell>
                                <CorporateTableCell>{row.email}</CorporateTableCell>
                                <CorporateTableCell>
                                    <CorporateBadge variant={row.status === 'active' ? 'success' : 'neutral'}>
                                        {row.status}
                                    </CorporateBadge>
                                </CorporateTableCell>
                                <CorporateTableCell>{row.role}</CorporateTableCell>
                            </CorporateTableRow>
                        ))}
                    </CorporateTable>
                </CorporateCardContent>
            </CorporateCard>

            {/* Badges */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Badge Bileşenleri</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <div className="space-x-4">
                        <CorporateBadge variant="success">Success</CorporateBadge>
                        <CorporateBadge variant="warning">Warning</CorporateBadge>
                        <CorporateBadge variant="danger">Danger</CorporateBadge>
                        <CorporateBadge variant="info">Info</CorporateBadge>
                        <CorporateBadge variant="outline">Neutral</CorporateBadge>
                    </div>
                </CorporateCardContent>
            </CorporateCard>

            {/* Progress */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Progress Bileşeni</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <div className="space-y-4">
                        <CorporateProgress value={75} />
                        <CorporateProgress value={45} />
                        <CorporateProgress value={90} />
                    </div>
                </CorporateCardContent>
            </CorporateCard>

            {/* Alert */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Alert Bileşenleri</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <div className="space-y-4">
                        <CorporateAlert variant="success">
                            İşlem başarıyla tamamlandı.
                        </CorporateAlert>
                        <CorporateAlert variant="warning">
                            Bu işlem geri alınamaz.
                        </CorporateAlert>
                        <CorporateAlert variant="danger">
                            Bir hata oluştu.
                        </CorporateAlert>
                        <CorporateAlert variant="info">
                            Yeni özellikler eklendi.
                        </CorporateAlert>
                    </div>
                </CorporateCardContent>
            </CorporateCard>

            {/* Modal */}
            <CorporateCard>
                <CorporateCardHeader>
                    <CorporateCardTitle>Modal Bileşeni</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent>
                    <CorporateButton variant="primary" onClick={() => setIsModalOpen(true)}>
                        Modal Aç
                    </CorporateButton>
                </CorporateCardContent>
            </CorporateCard>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-4">
                <QuickAccessCard
                    title="Bağış Yönetimi"
                    description="Bağışları görüntüle ve yönet"
                    icon={<DollarSign className="w-6 h-6" />}
                    iconBgColor="bg-blue-600"
                />
                <QuickAccessCard
                    title="Kullanıcı Yönetimi"
                    description="Kullanıcıları yönet"
                    icon={<Users className="w-6 h-6" />}
                    iconBgColor="bg-gray-600"
                />
                <QuickAccessCard
                    title="Raporlar"
                    description="Raporları görüntüle"
                    icon={<BarChart3 className="w-6 h-6" />}
                    iconBgColor="bg-green-600"
                />
                <QuickAccessCard
                    title="Ayarlar"
                    description="Sistem ayarları"
                    icon={<Settings className="w-6 h-6" />}
                    iconBgColor="bg-blue-600"
                />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2">
                <StatisticsCard
                    number="₺847,500"
                    label="Aylık Bağış"
                    change={{ value: 12.5, isPositive: true }}
                />
                <StatisticsCard
                    number="1,247"
                    label="Aktif Kullanıcı"
                    change={{ value: 2.1, isPositive: false }}
                />
            </div>

            {/* Modal */}
            <CorporateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CorporateModalHeader>
                    <CorporateModalTitle>Test Modal</CorporateModalTitle>
                </CorporateModalHeader>
                <CorporateModalBody>
                    <p>Bu bir test modal'ıdır. Kurumsal UI bileşenlerinin düzgün çalıştığını gösterir.</p>
                </CorporateModalBody>
                <CorporateModalFooter>
                    <CorporateButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                        İptal
                    </CorporateButton>
                    <CorporateButton variant="primary" onClick={() => setIsModalOpen(false)}>
                        Tamam
                    </CorporateButton>
                </CorporateModalFooter>
            </CorporateModal>
        </div>
    )
}

export default CorporateUITest
