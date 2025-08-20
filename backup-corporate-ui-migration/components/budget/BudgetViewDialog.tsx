import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CorporateBadge } from '@/components/ui/corporate/CorporateComponents'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { AdvancedBudget } from '@/types/budget'
import { formatCurrency } from '@/utils/formatters'

interface BudgetViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: AdvancedBudget | null
}

export function BudgetViewDialog({ open, onOpenChange, budget }: BudgetViewDialogProps) {
  if (!budget) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'Taslak', variant: 'secondary' as const },
      'submitted': { label: 'Gönderildi', variant: 'default' as const },
      'approved': { label: 'Onaylandı', variant: 'default' as const },
      'active': { label: 'Aktif', variant: 'default' as const },
      'completed': { label: 'Tamamlandı', variant: 'default' as const },
      'cancelled': { label: 'İptal Edildi', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const }
    return <CorporateBadge variant={config.variant}>{config.label}</CorporateBadge>
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4" />
    if (variance < 0) return <TrendingDown className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  const utilizationPercentage = budget.totalBudgetExpense > 0 
    ? (budget.totalActualExpense / budget.totalBudgetExpense) * 100 
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{budget.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {budget.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(budget.status)}
              <CorporateBadge variant="neutral">
                {budget.budgetType === 'annual' ? 'Yıllık' : 
                 budget.budgetType === 'monthly' ? 'Aylık' : 
                 budget.budgetType === 'project' ? 'Proje' : 'Diğer'}
              </CorporateBadge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="monthly">Aylık Dağılım</TabsTrigger>
            <TabsTrigger value="approval">Onay Süreci</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Toplam Gelir</p>
                      <p className="text-2xl font-bold">{formatCurrency(budget.totalBudgetRevenue, 'TRY', 'tr-TR')}</p>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>

              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Toplam Gider</p>
                      <p className="text-2xl font-bold">{formatCurrency(budget.totalBudgetExpense, 'TRY', 'tr-TR')}</p>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>

              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getVarianceColor(budget.variance)}`}>
                      {getVarianceIcon(budget.variance)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Net Bütçe</p>
                        <p className="text-2xl font-bold">{formatCurrency(budget.netBudget, 'TRY', 'tr-TR')}</p>
                      </div>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>

              <CorporateCard>
                <CorporateCardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Kullanım Oranı</p>
                      <p className="text-2xl font-bold">{utilizationPercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>

            {/* Progress Bar */}
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Bütçe Kullanım Durumu</CorporateCardTitle>
                <CardDescription>
                  Toplam bütçenin ne kadarının kullanıldığını gösterir
                </CardDescription>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="corporate-form-group">
                  <div className="flex justify-between text-sm">
                    <span>Kullanılan: {formatCurrency(budget.totalActualExpense, 'TRY', 'tr-TR')}</span>
                    <span>Toplam: {formatCurrency(budget.totalBudgetExpense, 'TRY', 'tr-TR')}</span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>{utilizationPercentage.toFixed(1)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CorporateCardContent>
            </CorporateCard>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>Finansal Özet</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bütçelenen Gelir:</span>
                    <span className="font-medium">{formatCurrency(budget.totalBudgetRevenue, 'TRY', 'tr-TR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gerçekleşen Gelir:</span>
                    <span className="font-medium">{formatCurrency(budget.totalActualRevenue, 'TRY', 'tr-TR')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bütçelenen Gider:</span>
                    <span className="font-medium">{formatCurrency(budget.totalBudgetExpense, 'TRY', 'tr-TR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gerçekleşen Gider:</span>
                    <span className="font-medium">{formatCurrency(budget.totalActualExpense, 'TRY', 'tr-TR')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net Sonuç:</span>
                    <span className={`font-bold ${getVarianceColor(budget.netActual)}`}>
                      {formatCurrency(budget.netActual, 'TRY', 'tr-TR')}
                    </span>
                  </div>
                </CorporateCardContent>
              </CorporateCard>

              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>Bütçe Bilgileri</CorporateCardTitle>
                </CorporateCardHeader>
                <CorporateCardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Oluşturulma:</span>
                    <span className="font-medium">
                      {new Date(budget.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Son Güncelleme:</span>
                    <span className="font-medium">
                      {new Date(budget.updated_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  {budget.approvedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Onaylanma:</span>
                      <span className="font-medium">
                        {new Date(budget.approvedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Kategori Sayısı:</span>
                    <span className="font-medium">{budget.categories.length}</span>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4">
              {budget.categories.map((category, index) => (
                <CorporateCard key={index}>
                  <CorporateCardHeader>
                    <div className="flex items-center justify-between">
                      <CorporateCardTitle className="text-base">{category.categoryName}</CorporateCardTitle>
                      <CorporateBadge variant={category.budgetType === 'revenue' ? 'default' : 'secondary'}>
                        {category.budgetType === 'revenue' ? 'Gelir' : 'Gider'}
                      </CorporateBadge>
                    </div>
                    <CardDescription>{category.categoryCode}</CardDescription>
                  </CorporateCardHeader>
                  <CorporateCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bütçelenen</p>
                        <p className="text-lg font-semibold">{formatCurrency(category.budgetedAmount, 'TRY', 'tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gerçekleşen</p>
                        <p className="text-lg font-semibold">{formatCurrency(category.actualAmount || 0, 'TRY', 'tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Varyans</p>
                        <p className={`text-lg font-semibold ${getVarianceColor((category.actualAmount || 0) - category.budgetedAmount)}`}>
                          {formatCurrency((category.actualAmount || 0) - category.budgetedAmount, 'TRY', 'tr-TR')}
                        </p>
                      </div>
                    </div>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Alt Kategoriler</h4>
                        <div className="corporate-form-group">
                          {category.subcategories.map((sub, subIndex) => (
                            <div key={subIndex} className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">{sub.subcategoryName}</span>
                              <span className="text-sm font-medium">{formatCurrency(sub.budgetedAmount, 'TRY', 'tr-TR')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CorporateCardContent>
                </CorporateCard>
              ))}
            </div>
          </TabsContent>

          {/* Monthly Breakdown Tab */}
          <TabsContent value="monthly" className="space-y-4">
            <CorporateCard>
              <CorporateCardHeader>
                <CorporateCardTitle>Aylık Dağılım</CorporateCardTitle>
                <CardDescription>
                  Bütçenin aylara göre dağılımı
                </CardDescription>
              </CorporateCardHeader>
              <CorporateCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {budget.monthlyBreakdown.map((month, index) => (
                    <CorporateCard key={index}>
                      <CorporateCardContent className="pt-4">
                        <div className="text-center">
                          <h4 className="font-medium">{month.month}</h4>
                          <p className="text-2xl font-bold mt-2">{formatCurrency(month.budgetedAmount, 'TRY', 'tr-TR')}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Gerçekleşen: {formatCurrency(month.actualAmount || 0, 'TRY', 'tr-TR')}
                          </p>
                        </div>
                      </CorporateCardContent>
                    </CorporateCard>
                  ))}
                </div>
              </CorporateCardContent>
            </CorporateCard>
          </TabsContent>

          {/* Approval Process Tab */}
          <TabsContent value="approval" className="space-y-4">
            {budget.approvalWorkflow && (
              <CorporateCard>
                <CorporateCardHeader>
                  <CorporateCardTitle>Onay Süreci</CorporateCardTitle>
                  <CardDescription>
                    Bütçe onay sürecinin durumu
                  </CardDescription>
                </CorporateCardHeader>
                <CorporateCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durum:</span>
                      <div className="flex items-center gap-2">
                        {budget.approvalWorkflow.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {budget.approvalWorkflow.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {budget.approvalWorkflow.status === 'rejected' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        <CorporateBadge variant={
                          budget.approvalWorkflow.status === 'approved' ? 'default' :
                          budget.approvalWorkflow.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {budget.approvalWorkflow.status === 'approved' ? 'Onaylandı' :
                           budget.approvalWorkflow.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                        </CorporateBadge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">İlerleme:</span>
                      <span className="text-sm">
                        {budget.approvalWorkflow.currentStep} / {budget.approvalWorkflow.totalSteps}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(budget.approvalWorkflow.currentStep / budget.approvalWorkflow.totalSteps) * 100} 
                      className="h-2"
                    />
                    
                    <div className="corporate-form-group">
                      <span className="text-sm font-medium">Onay Adımları:</span>
                      <div className="corporate-form-group">
                        {budget.approvalWorkflow.steps.map((step, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {step.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                              {step.status === 'rejected' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                              <span className="text-sm">{step.stepName}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{step.assignedTo}</p>
                              {step.completedAt && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(step.completedAt).toLocaleDateString('tr-TR')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CorporateCardContent>
              </CorporateCard>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}