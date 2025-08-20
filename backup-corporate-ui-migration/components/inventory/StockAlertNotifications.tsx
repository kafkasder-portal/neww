import React, { useState, useEffect } from 'react'
import { Bell, AlertTriangle, AlertCircle, Info, X, Check, Eye, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useStockAlerts } from '@/hooks/useStockAlerts'
import { StockAlert, StockAlertRule } from '@/types/inventory'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface StockAlertNotificationsProps {
  className?: string
  showSettings?: boolean
  maxHeight?: string
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'destructive'
    case 'warning':
      return 'secondary'
    case 'info':
      return 'outline'
    default:
      return 'outline'
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    low_stock: 'Düşük Stok',
    critical_stock: 'Kritik Stok',
    out_of_stock: 'Stok Tükendi',
    overstock: 'Fazla Stok',
    expiry_warning: 'Son Kullanma Tarihi',
    custom: 'Özel Kural'
  }
  return labels[type] || type
}

const AlertItem: React.FC<{
  alert: StockAlert
  onResolve: (id: string, note?: string) => void
  onDismiss: (id: string) => void
  onMarkAsRead: (id: string) => void
  isRead: boolean
}> = ({ alert, onResolve, onDismiss, onMarkAsRead, isRead }) => {
  const [resolveNote, setResolveNote] = useState('')
  const [showResolveDialog, setShowResolveDialog] = useState(false)

  const handleResolve = () => {
    onResolve(alert.id, resolveNote)
    setShowResolveDialog(false)
    setResolveNote('')
  }

  return (
    <div className={`p-3 border rounded-lg ${!isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'} ${alert.isResolved ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {getSeverityIcon(alert.severity)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CorporateBadge variant={getSeverityColor(alert.severity)} className="text-xs">
                {getTypeLabel(alert.type)}
              </CorporateBadge>
              {!isRead && (
                <CorporateBadge variant="neutral" className="text-xs bg-blue-100 text-blue-700">
                  Yeni
                </CorporateBadge>
              )}
              {alert.isResolved && (
                <CorporateBadge variant="neutral" className="text-xs bg-green-100 text-green-700">
                  Çözümlendi
                </CorporateBadge>
              )}
            </div>
            <h4 className="font-medium text-sm mb-1">{alert.itemName}</h4>
            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>📍 {alert.location}</span>
              <span>📦 Mevcut: {alert.currentStock}</span>
              {alert.threshold && <span>⚠️ Eşik: {alert.threshold}</span>}
              <span>🕒 {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: tr })}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {!isRead && (
            <CorporateButton
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(alert.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3 w-3" />
            </CorporateButton>
          )}
          
          {!alert.isResolved && (
            <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
              <DialogTrigger asChild>
                <CorporateButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <Check className="h-3 w-3" />
                </CorporateButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Uyarıyı Çözümle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resolve-note">Çözüm Notu (İsteğe bağlı)</Label>
                    <Input
                      id="resolve-note"
                      value={resolveNote}
                      onChange={(e) => setResolveNote(e.target.value)}
                      placeholder="Bu uyarı nasıl çözüldü?"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <CorporateButton variant="neutral" onClick={() => setShowResolveDialog(false)}>
                      İptal
                    </CorporateButton>
                    <CorporateButton onClick={handleResolve}>
                      Çözümle
                    </CorporateButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <CorporateButton
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(alert.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </CorporateButton>
        </div>
      </div>
    </div>
  )
}

const AlertRuleForm: React.FC<{
  rule?: StockAlertRule
  onSave: (rule: Omit<StockAlertRule, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}> = ({ rule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    type: rule?.type || 'low_stock',
    threshold: rule?.threshold || 10,
    severity: rule?.severity || 'warning',
    isActive: rule?.isActive ?? true,
    categoryId: rule?.categoryId || '',
    locationId: rule?.locationId || '',
    itemId: rule?.itemId || '',
    notificationMethods: rule?.notificationMethods || ['system'],
    recipients: rule?.recipients || []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rule-name">Kural Adı</Label>
        <Input
          id="rule-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Uyarı kuralı adı"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rule-type">Uyarı Türü</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low_stock">Düşük Stok</SelectItem>
              <SelectItem value="critical_stock">Kritik Stok</SelectItem>
              <SelectItem value="out_of_stock">Stok Tükendi</SelectItem>
              <SelectItem value="overstock">Fazla Stok</SelectItem>
              <SelectItem value="expiry_warning">Son Kullanma Tarihi</SelectItem>
              <SelectItem value="custom">Özel Kural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="rule-severity">Önem Derecesi</Label>
          <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Bilgi</SelectItem>
              <SelectItem value="warning">Uyarı</SelectItem>
              <SelectItem value="critical">Kritik</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="rule-threshold">Eşik Değeri</Label>
        <Input
          id="rule-threshold"
          type="number"
          value={formData.threshold}
          onChange={(e) => setFormData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
          placeholder="Uyarı eşik değeri"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="rule-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="rule-active">Aktif</Label>
      </div>
      
      <div className="flex justify-end gap-2">
        <CorporateButton type="button" variant="neutral" onClick={onCancel}>
          İptal
        </CorporateButton>
        <CorporateButton type="submit">
          {rule ? 'Güncelle' : 'Oluştur'}
        </CorporateButton>
      </div>
    </form>
  )
}

export const StockAlertNotifications: React.FC<StockAlertNotificationsProps> = ({
  className = '',
  showSettings = true,
  maxHeight = '400px'
}) => {
  const {
    alerts,
    unreadAlerts,
    alertStats,
    alertRules,
    config,
    loading,
    error,
    resolveAlert,
    dismissAlert,
    markAsRead,
    markAllAsRead,
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    updateConfig,
    runStockCheck
  } = useStockAlerts()

  const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [showRuleDialog, setShowRuleDialog] = useState(false)
  const [editingRule, setEditingRule] = useState<StockAlertRule | undefined>()
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set())

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread' && readAlerts.has(alert.id)) return false
    if (filter === 'resolved' && !alert.isResolved) return false
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
    return true
  })

  const handleMarkAsRead = (alertId: string) => {
    setReadAlerts(prev => new Set([...prev, alertId]))
    markAsRead(alertId)
  }

  const handleMarkAllAsRead = () => {
    const allAlertIds = alerts.map(alert => alert.id)
    setReadAlerts(new Set(allAlertIds))
    markAllAsRead()
  }

  const handleSaveRule = async (ruleData: Omit<StockAlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingRule) {
        await updateAlertRule(editingRule.id, ruleData)
      } else {
        await createAlertRule(ruleData)
      }
      setShowRuleDialog(false)
      setEditingRule(undefined)
    } catch (error) {
      console.error('Kural kaydedilemedi:', error)
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (confirm('Bu kuralı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAlertRule(ruleId)
      } catch (error) {
        console.error('Kural silinemedi:', error)
      }
    }
  }

  const handleRunStockCheck = async () => {
    try {
      await runStockCheck()
      toast.success('Stok kontrolü tamamlandı')
    } catch (error) {
      console.error('Stok kontrolü başarısız:', error)
    }
  }

  if (error) {
    return (
      <CorporateCard className={className}>
        <CorporateCardContent className="p-4">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Uyarılar yüklenemedi: {error}</p>
          </div>
        </CorporateCardContent>
      </CorporateCard>
    )
  }

  return (
    <CorporateCard className={className}>
      <CorporateCardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CorporateCardTitle className="text-lg">Stok Uyarıları</CorporateCardTitle>
            {unreadAlerts.length > 0 && (
              <CorporateBadge variant="danger" className="text-xs">
                {unreadAlerts.length}
              </CorporateBadge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <CorporateButton
              variant="neutral"
              size="sm"
              onClick={handleRunStockCheck}
              disabled={loading}
            >
              Kontrol Et
            </CorporateButton>
            
            {showSettings && (
              <Dialog>
                <DialogTrigger asChild>
                  <CorporateButton variant="neutral" size="sm">
                    <Settings className="h-4 w-4" />
                  </CorporateButton>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Uyarı Ayarları</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="rules" className="w-full">
                    <TabsList>
                      <TabsTrigger value="rules">Kurallar</TabsTrigger>
                      <TabsTrigger value="config">Genel Ayarlar</TabsTrigger>
                      <TabsTrigger value="stats">İstatistikler</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="rules" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Uyarı Kuralları</h3>
                        <CorporateButton onClick={() => setShowRuleDialog(true)}>
                          Yeni Kural
                        </CorporateButton>
                      </div>
                      
                      <div className="corporate-form-group">
                        {alertRules.map(rule => (
                          <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{rule.name}</h4>
                              <p className="text-sm text-gray-600">
                                {getTypeLabel(rule.type)} - Eşik: {rule.threshold}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <CorporateBadge variant={rule.isActive ? 'default' : 'secondary'}>
                                {rule.isActive ? 'Aktif' : 'Pasif'}
                              </CorporateBadge>
                              <CorporateButton
                                variant="neutral"
                                size="sm"
                                onClick={() => {
                                  setEditingRule(rule)
                                  setShowRuleDialog(true)
                                }}
                              >
                                Düzenle
                              </CorporateButton>
                              <CorporateButton
                                variant="neutral"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                Sil
                              </CorporateButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="config" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={config?.enableSystemNotifications ?? true}
                            onCheckedChange={(checked) => updateConfig({ enableSystemNotifications: checked })}
                          />
                          <Label>Sistem bildirimleri</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={config?.enableEmailNotifications ?? false}
                            onCheckedChange={(checked) => updateConfig({ enableEmailNotifications: checked })}
                          />
                          <Label>E-posta bildirimleri</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={config?.enableSmsNotifications ?? false}
                            onCheckedChange={(checked) => updateConfig({ enableSmsNotifications: checked })}
                          />
                          <Label>SMS bildirimleri</Label>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="stats" className="space-y-4">
                      {alertStats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{alertStats.total}</div>
                            <div className="text-sm text-gray-600">Toplam Uyarı</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{alertStats.unresolved}</div>
                            <div className="text-sm text-gray-600">Çözülmemiş</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{alertStats.critical}</div>
                            <div className="text-sm text-gray-600">Kritik</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{Object.keys(alertStats.byType).length}</div>
                            <div className="text-sm text-gray-600">Uyarı Türü</div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        {/* Filtreler */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Filtre:</Label>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="unread">Okunmamış</SelectItem>
                <SelectItem value="resolved">Çözümlenen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm">Önem:</Label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="critical">Kritik</SelectItem>
                <SelectItem value="warning">Uyarı</SelectItem>
                <SelectItem value="info">Bilgi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {unreadAlerts.length > 0 && (
            <CorporateButton variant="neutral" size="sm" onClick={handleMarkAllAsRead}>
              Tümünü Okundu İşaretle
            </CorporateButton>
          )}
        </div>
      </CorporateCardHeader>
      
      <CorporateCardContent className="p-0">
        <ScrollArea className="px-4" style={{ maxHeight }}>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Uyarılar yükleniyor...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filter === 'all' ? 'Henüz uyarı bulunmuyor' : 'Filtreye uygun uyarı bulunamadı'}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredAlerts.map(alert => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onResolve={resolveAlert}
                  onDismiss={dismissAlert}
                  onMarkAsRead={handleMarkAsRead}
                  isRead={readAlerts.has(alert.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CorporateCardContent>
      
      {/* Kural Ekleme/Düzenleme Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Kuralı Düzenle' : 'Yeni Kural Oluştur'}
            </DialogTitle>
          </DialogHeader>
          <AlertRuleForm
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={() => {
              setShowRuleDialog(false)
              setEditingRule(undefined)
            }}
          />
        </DialogContent>
      </Dialog>
    </CorporateCard>
  )
}

export default StockAlertNotifications