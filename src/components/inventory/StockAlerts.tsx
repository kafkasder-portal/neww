import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CorporateButton, CorporateBadge, CorporateCard, CorporateCardContent, CorporateCardHeader, CorporateCardTitle, CorporateTable, CorporateTableHeader, CorporateTableHeaderCell, CorporateTableRow } from '@/components/ui/corporate/CorporateComponents'

import { Input } from '@/components/ui/input'

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Plus, 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell,
  BellOff,
  Package,
  TrendingDown,
  Calendar,
  Clock,
  Settings,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Send,
  Users,
  Mail
} from 'lucide-react'
import { StockAlert, StockAlertFilters, AlertRule, AlertRuleForm } from '@/types/inventory'
import { formatNumber } from '@/utils/formatters'
import { StockAlertNotifications } from './StockAlertNotifications'
import { useStockAlerts } from '@/hooks/useStockAlerts'

interface StockAlertsProps {
  onAlertResolve?: (alertId: string) => void
  onAlertDismiss?: (alertId: string) => void
  onRuleCreate?: (rule: AlertRuleForm) => void
  onRuleUpdate?: (ruleId: string, rule: AlertRuleForm) => void
  onRuleDelete?: (ruleId: string) => void
}

// Mock data - gerçek uygulamada API'den gelecek
const mockAlerts: StockAlert[] = [
  {
    id: '1',
    type: 'low_stock',
    alertType: 'low_stock',
    severity: 'high',
    itemId: 'item-1',
    itemName: 'Pirinç (1kg)',
    itemCode: 'FOOD-001',
    currentStock: 5,
    threshold: 20,
    location: 'loc-1',
    locationName: 'Ana Depo',
    message: 'Pirinç stoku kritik seviyede (5 adet kaldı)',
    isResolved: false,
    isRead: false,
    isActive: true,
    createdAt: '2024-01-22T10:30:00Z',
    updatedAt: '2024-01-22T10:30:00Z'
  },
  {
    id: '2',
    type: 'out_of_stock',
    alertType: 'out_of_stock',
    severity: 'critical',
    itemId: 'item-2',
    itemName: 'Deterjan (5L)',
    itemCode: 'CLEAN-002',
    currentStock: 0,
    threshold: 10,
    location: 'loc-2',
    locationName: 'Temizlik Deposu',
    message: 'Deterjan stoku tükendi',
    isResolved: false,
    isRead: false,
    isActive: true,
    createdAt: '2024-01-21T15:45:00Z',
    updatedAt: '2024-01-21T15:45:00Z'
  },
  {
    id: '3',
    type: 'expiry_warning',
    alertType: 'expiry_warning',
    severity: 'medium',
    itemId: 'item-3',
    itemName: 'Süt (1L)',
    itemCode: 'FOOD-003',
    currentStock: 25,
    threshold: 7,
    location: 'loc-3',
    locationName: 'Soğuk Depo',
    message: '25 adet süt 7 gün içinde son kullanma tarihini geçecek',
    expiryDate: '2024-01-29T00:00:00Z',
    isResolved: false,
    isRead: false,
    isActive: true,
    createdAt: '2024-01-22T08:15:00Z',
    updatedAt: '2024-01-22T08:15:00Z'
  },
  {
    id: '4',
    type: 'overstock',
    alertType: 'overstock',
    severity: 'low',
    itemId: 'item-4',
    itemName: 'Kağıt Havlu',
    itemCode: 'OFFICE-001',
    currentStock: 500,
    threshold: 100,
    location: 'loc-1',
    locationName: 'Ana Depo',
    message: 'Kağıt havlu stoku normalin 5 katı (500 adet)',
    isResolved: false,
    isRead: false,
    isActive: true,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z'
  },
  {
    id: '5',
    type: 'low_stock',
    alertType: 'low_stock',
    severity: 'medium',
    itemId: 'item-5',
    itemName: 'Eldiven (Kutu)',
    itemCode: 'MED-001',
    currentStock: 8,
    threshold: 15,
    location: 'loc-4',
    locationName: 'Tıbbi Malzeme',
    message: 'Eldiven stoku azalıyor (8 kutu kaldı)',
    isResolved: true,
    resolvedAt: '2024-01-22T14:20:00Z',
    resolvedBy: 'admin',
    isRead: true,
    isActive: false,
    createdAt: '2024-01-19T09:30:00Z',
    updatedAt: '2024-01-22T14:20:00Z'
  }
]

const mockAlertRules: AlertRule[] = [
  {
    id: '1',
    name: 'Gıda Ürünleri Düşük Stok',
    type: 'low_stock',
    category: 'food',
    threshold: 20,
    isActive: true,
    notificationMethods: ['email', 'system'],
    recipients: ['admin@example.com', 'warehouse@example.com'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Temizlik Ürünleri Kritik Stok',
    type: 'out_of_stock',
    category: 'cleaning',
    threshold: 0,
    isActive: true,
    notificationMethods: ['email', 'sms', 'system'],
    recipients: ['admin@example.com'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z'
  },
  {
    id: '3',
    name: 'Son Kullanma Tarihi Uyarısı',
    type: 'expiry_warning',
    threshold: 7,
    isActive: true,
    notificationMethods: ['email', 'system'],
    recipients: ['quality@example.com', 'warehouse@example.com'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T12:00:00Z'
  }
]

const StockAlerts: React.FC<StockAlertsProps> = ({
  onAlertResolve,
  onAlertDismiss,
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete
}) => {
  const [alerts, setAlerts] = useState<StockAlert[]>(mockAlerts)
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules)
  const [filteredAlerts, setFilteredAlerts] = useState<StockAlert[]>(mockAlerts)
  const [filters, setFilters] = useState<StockAlertFilters>({})
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts')
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [newRule, setNewRule] = useState<AlertRuleForm>({
    name: '',
    type: 'low_stock',
    threshold: 10,
    isActive: true,
    notificationMethods: ['system'],
    recipients: []
  })

  // Gerçek stok uyarıları hook'u
  const {
    alerts: realAlerts,
    alertStats,
    runStockCheck,
    loading: alertsLoading
  } = useStockAlerts()

  useEffect(() => {
    applyFilters()
  }, [filters, alerts])

  const applyFilters = () => {
    let filtered = [...alerts]

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(alert => 
        alert.itemName.toLowerCase().includes(searchTerm) ||
        alert.itemCode.toLowerCase().includes(searchTerm) ||
        alert.locationName.toLowerCase().includes(searchTerm) ||
        alert.message.toLowerCase().includes(searchTerm)
      )
    }

    // Tür filtresi
    if (filters.type) {
      filtered = filtered.filter(alert => alert.type === filters.type)
    }

    // Önem derecesi filtresi
    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity)
    }

    // Durum filtresi
    if (filters.isResolved !== undefined) {
      filtered = filtered.filter(alert => alert.isResolved === filters.isResolved)
    }

    // Aktiflik filtresi
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(alert => alert.isActive === filters.isActive)
    }

    setFilteredAlerts(filtered)
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <TrendingDown className="h-4 w-4" />
      case 'out_of_stock': return <XCircle className="h-4 w-4" />
      case 'expiry_warning': return <Clock className="h-4 w-4" />
      case 'overstock': return <Package className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case 'low_stock': return 'Düşük Stok'
      case 'out_of_stock': return 'Stok Tükendi'
      case 'expiry_warning': return 'Son Kullanma Tarihi'
      case 'overstock': return 'Fazla Stok'
      default: return type
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200'
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityName = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Kritik'
      case 'high': return 'Yüksek'
      case 'medium': return 'Orta'
      case 'low': return 'Düşük'
      default: return severity
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActiveAlertsCount = () => {
    return alerts.filter(alert => alert.isActive && !alert.isResolved).length
  }

  const getCriticalAlertsCount = () => {
    return alerts.filter(alert => 
      alert.isActive && !alert.isResolved && alert.severity === 'critical'
    ).length
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            isResolved: true, 
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'current_user' // Gerçek uygulamada mevcut kullanıcı
          }
        : alert
    ))
    onAlertResolve?.(alertId)
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: false }
        : alert
    ))
    onAlertDismiss?.(alertId)
  }

  const handleCreateRule = () => {
    if (onRuleCreate) {
      onRuleCreate(newRule)
    }
    setIsRuleDialogOpen(false)
    setNewRule({
      name: '',
      type: 'low_stock',
      threshold: 10,
      isActive: true,
      notificationMethods: ['system'],
      recipients: []
    })
  }

  const handleEditRule = (rule: AlertRule) => {
    setSelectedRule(rule)
    setNewRule({
      name: rule.name,
      type: rule.type,
      category: rule.category,
      threshold: rule.threshold,
      isActive: rule.isActive,
      notificationMethods: rule.notificationMethods,
      recipients: rule.recipients
    })
    setIsRuleDialogOpen(true)
  }

  const handleUpdateRule = () => {
    if (selectedRule && onRuleUpdate) {
      onRuleUpdate(selectedRule.id, newRule)
    }
    setIsRuleDialogOpen(false)
    setSelectedRule(null)
    setNewRule({
      name: '',
      type: 'low_stock',
      threshold: 10,
      isActive: true,
      notificationMethods: ['system'],
      recipients: []
    })
  }

  const RuleDialog = () => (
    <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedRule ? 'Uyarı Kuralını Düzenle' : 'Yeni Uyarı Kuralı'}
          </DialogTitle>
          <DialogDescription>
            Stok uyarı kuralı ayarlarını yapılandırın
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-6-group">
            <Label htmlFor="ruleName">Kural Adı *</Label>
            <Input
              id="ruleName"
              value={newRule.name}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Gıda Ürünleri Düşük Stok"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-6-group">
              <Label htmlFor="ruleType">Uyarı Türü</Label>
              <Select 
                value={newRule.type} 
                onValueChange={(value: any) => setNewRule(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low_stock">Düşük Stok</SelectItem>
                  <SelectItem value="out_of_stock">Stok Tükendi</SelectItem>
                  <SelectItem value="expiry_warning">Son Kullanma Tarihi</SelectItem>
                  <SelectItem value="overstock">Fazla Stok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-6-group">
              <Label htmlFor="threshold">Eşik Değeri</Label>
              <Input
                id="threshold"
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-6-group">
            <Label htmlFor="category">Kategori (Opsiyonel)</Label>
            <Select 
              value={newRule.category || 'all'} 
              onValueChange={(value) => setNewRule(prev => ({ 
                ...prev, 
                category: value === 'all' ? undefined : value as any
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="food">Gıda</SelectItem>
                <SelectItem value="cleaning">Temizlik</SelectItem>
                <SelectItem value="office">Ofis</SelectItem>
                <SelectItem value="medical">Tıbbi</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6-group">
            <Label>Bildirim Yöntemleri</Label>
            <div className="space-y-6-group">
              {['system', 'email', 'sms'].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Switch
                    id={method}
                    checked={newRule.notificationMethods?.includes(method as any) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewRule(prev => ({
                          ...prev,
                          notificationMethods: [...(prev.notificationMethods || []), method as any]
                        }))
                      } else {
                        setNewRule(prev => ({
                          ...prev,
                          notificationMethods: (prev.notificationMethods || []).filter(m => m !== method)
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={method} className="capitalize">
                    {method === 'system' ? 'Sistem' : method === 'email' ? 'E-posta' : 'SMS'}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6-group">
            <Label htmlFor="recipients">Alıcılar (E-posta)</Label>
            <Input
              id="recipients"
              value={(newRule.recipients || []).join(', ')}
              onChange={(e) => setNewRule(prev => ({ 
                ...prev, 
                recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
              }))}
              placeholder="admin@example.com, warehouse@example.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={newRule.isActive}
              onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Aktif</Label>
          </div>
        </div>
        <DialogFooter>
          <CorporateButton onClick={selectedRule ? handleUpdateRule : handleCreateRule}>
            {selectedRule ? 'Güncelle' : 'Oluştur'}
          </CorporateButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-4">
      {/* Canlı Bildirimler */}
      {showNotifications && (
        <StockAlertNotifications 
          className="mb-6"
          showSettings={true}
          maxHeight="500px"
        />
      )}

      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CorporateCard>
          <CorporateCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Uyarılar</p>
                <p className="text-2xl font-bold">
                  {alertStats?.total || getActiveAlertsCount()}
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </CorporateCardContent>
        </CorporateCard>
        
        <CorporateCard>
          <CorporateCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kritik Uyarılar</p>
                <p className="text-2xl font-bold text-red-500">
                  {alertStats?.critical || getCriticalAlertsCount()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CorporateCardContent>
        </CorporateCard>
        
        <CorporateCard>
          <CorporateCardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Kurallar</p>
                <p className="text-2xl font-bold">{alertRules.filter(rule => rule.isActive).length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CorporateCardContent>
        </CorporateCard>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <CorporateButton
          variant={activeTab === 'alerts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('alerts')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Uyarılar
        </CorporateButton>
        <CorporateButton
          variant={activeTab === 'rules' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('rules')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Kurallar
        </CorporateButton>
        <CorporateButton
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-4 w-4 mr-2" />
          Canlı Bildirimler
        </CorporateButton>
      </div>

      {activeTab === 'alerts' && (
        <>
          {/* Filters */}
          <CorporateCard>
            <CorporateCardHeader>
              <CorporateCardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stok Uyarıları
                </span>
                <CorporateButton size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </CorporateButton>
              </CorporateCardTitle>
            </CorporateCardHeader>
            <CorporateCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Arama */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Uyarı ara..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>

                {/* Tür */}
                <Select 
                  value={filters.type || 'all'} 
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    type: value === 'all' ? undefined : value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tür" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Türler</SelectItem>
                    <SelectItem value="low_stock">Düşük Stok</SelectItem>
                    <SelectItem value="out_of_stock">Stok Tükendi</SelectItem>
                    <SelectItem value="expiry_warning">Son Kullanma Tarihi</SelectItem>
                    <SelectItem value="overstock">Fazla Stok</SelectItem>
                  </SelectContent>
                </Select>

                {/* Önem Derecesi */}
                <Select 
                  value={filters.severity || 'all'} 
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    severity: value === 'all' ? undefined : value as any
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Önem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Önem Dereceleri</SelectItem>
                    <SelectItem value="critical">Kritik</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="low">Düşük</SelectItem>
                  </SelectContent>
                </Select>

                {/* Çözüm Durumu */}
                <Select 
                  value={filters.isResolved === undefined ? 'all' : filters.isResolved.toString()} 
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    isResolved: value === 'all' ? undefined : value === 'true'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="false">Çözülmemiş</SelectItem>
                    <SelectItem value="true">Çözülmüş</SelectItem>
                  </SelectContent>
                </Select>

                {/* Aktiflik */}
                <Select 
                  value={filters.isActive === undefined ? 'all' : filters.isActive.toString()} 
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    isActive: value === 'all' ? undefined : value === 'true'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aktiflik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CorporateCardContent>
          </CorporateCard>

          {/* Alerts Table */}
          <CorporateCard>
            <CorporateCardContent className="p-0">
              <CorporateTable>
                <CorporateTableHeader>
                  <CorporateTableRow>
                    <CorporateTableHeaderCell>Uyarı</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Ürün</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Lokasyon</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Stok Durumu</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Önem</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Tarih</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>Durum</CorporateTableHeaderCell>
                    <CorporateTableHeaderCell>İşlemler</CorporateTableHeaderCell>
                  </CorporateTableRow>
                </CorporateTableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <CorporateTableRow key={alert.id}>
                      <CorporateTableCell>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                            {getAlertTypeIcon(alert.type)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {getAlertTypeName(alert.type)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {alert.message}
                            </div>
                          </div>
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div>
                          <div className="font-medium">{alert.itemName}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {alert.itemCode}
                          </div>
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {alert.locationName}
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{formatNumber(alert.currentStock)}</span>
                            {alert.threshold && (
                              <span className="text-muted-foreground"> / {formatNumber(alert.threshold)}</span>
                            )}
                          </div>
                          {alert.expiryDate && (
                            <div className="text-xs text-orange-600">
                              SKT: {formatDate(alert.expiryDate)}
                            </div>
                          )}
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <CorporateBadge className={getSeverityColor(alert.severity)}>
                          {getSeverityName(alert.severity)}
                        </CorporateBadge>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div className="text-sm">
                          <div>{formatDate(alert.createdAt)}</div>
                          {alert.resolvedAt && (
                            <div className="text-xs text-green-600">
                              Çözüldü: {formatDate(alert.resolvedAt)}
                            </div>
                          )}
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div className="flex items-center gap-2">
                          {alert.isResolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : alert.isActive ? (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-500" />
                          )}
                          <CorporateBadge variant={alert.isResolved ? 'default' : alert.isActive ? 'destructive' : 'secondary'}>
                            {alert.isResolved ? 'Çözüldü' : alert.isActive ? 'Aktif' : 'Pasif'}
                          </CorporateBadge>
                        </div>
                      </CorporateTableCell>
                      <CorporateTableCell>
                        <div className="flex gap-1">
                          {!alert.isResolved && alert.isActive && (
                            <>
                              <CorporateButton 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleResolveAlert(alert.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </CorporateButton>
                              <CorporateButton 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDismissAlert(alert.id)}
                              >
                                <XCircle className="h-3 w-3" />
                              </CorporateButton>
                            </>
                          )}
                        </div>
                      </CorporateTableCell>
                    </CorporateTableRow>
                  ))}
                </TableBody>
              </CorporateTable>
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">Uyarı bulunamadı</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arama kriterlerinizi değiştirin
                  </p>
                </div>
              )}
            </CorporateCardContent>
          </CorporateCard>
        </>
      )}

      {activeTab === 'rules' && (
        <CorporateCard>
          <CorporateCardHeader>
            <CorporateCardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Uyarı Kuralları
              </span>
              <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                <DialogTrigger asChild>
                  <CorporateButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Kural
                  </CorporateButton>
                </DialogTrigger>
              </Dialog>
            </CorporateCardTitle>
          </CorporateCardHeader>
          <CorporateCardContent className="p-0">
            <CorporateTable>
              <CorporateTableHeader>
                <CorporateTableRow>
                  <CorporateTableHeaderCell>Kural Adı</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>Tür</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>Eşik</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>Kategori</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>Bildirim</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>Durum</CorporateTableHeaderCell>
                  <CorporateTableHeaderCell>İşlemler</CorporateTableHeaderCell>
                </CorporateTableRow>
              </CorporateTableHeader>
              <TableBody>
                {alertRules.map((rule) => (
                  <CorporateTableRow key={rule.id}>
                    <CorporateTableCell>
                      <div className="font-medium">{rule.name}</div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <CorporateBadge variant="outline">
                        {getAlertTypeName(rule.type)}
                      </CorporateBadge>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <span className="font-mono">{rule.threshold}</span>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      {rule.category ? (
                        <CorporateBadge variant="outline">
                          {rule.category === 'food' ? 'Gıda' : 
                           rule.category === 'cleaning' ? 'Temizlik' :
                           rule.category === 'office' ? 'Ofis' :
                           rule.category === 'medical' ? 'Tıbbi' : 'Diğer'}
                        </CorporateBadge>
                      ) : (
                        <span className="text-muted-foreground">Tümü</span>
                      )}
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="flex gap-1">
                        {rule.notificationMethods.map((method) => (
                          <CorporateBadge key={method} variant="outline" className="text-xs">
                            {method === 'system' ? 'Sistem' : 
                             method === 'email' ? 'E-posta' : 'SMS'}
                          </CorporateBadge>
                        ))}
                      </div>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <CorporateBadge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Aktif' : 'Pasif'}
                      </CorporateBadge>
                    </CorporateTableCell>
                    <CorporateTableCell>
                      <div className="flex gap-1">
                        <CorporateButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-3 w-3" />
                        </CorporateButton>
                        <CorporateButton 
                          size="sm" 
                          variant="outline"
                          onClick={() => onRuleDelete?.(rule.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </CorporateButton>
                      </div>
                    </CorporateTableCell>
                  </CorporateTableRow>
                ))}
              </TableBody>
            </CorporateTable>
          </CorporateCardContent>
        </CorporateCard>
      )}

      <RuleDialog />
    </div>
  )
}

export default StockAlerts