import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  BarChart3,
  Calendar
} from 'lucide-react'
import { 
  AdvancedBudget, 
  BudgetDashboardData, 
  BudgetSearchFilters, 
  BUDGET_TYPES, 
  BUDGET_STATUSES
} from '@/types/budget'
import { formatCurrency } from '@/utils/formatters'
import { BudgetCreateDialog } from './BudgetCreateDialog'
import { BudgetEditDialog } from './BudgetEditDialog'
import { BudgetViewDialog } from './BudgetViewDialog'
import { BudgetVarianceChart } from './BudgetVarianceChart'

interface BudgetManagementProps {
  className?: string
}

export function BudgetManagement({ className }: BudgetManagementProps) {
  const [dashboardData, setDashboardData] = useState<BudgetDashboardData | null>(null)
  const [budgets, setBudgets] = useState<AdvancedBudget[]>([])
  const [filteredBudgets, setFilteredBudgets] = useState<AdvancedBudget[]>([])
  const [searchFilters, setSearchFilters] = useState<BudgetSearchFilters>({})
  const [selectedBudget, setSelectedBudget] = useState<AdvancedBudget | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    loadDashboardData()
    loadBudgets()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [budgets, searchFilters])

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDashboardData: BudgetDashboardData = {
        totalBudgets: 12,
        activeBudgets: 8,
        pendingApprovals: 3,
        totalBudgetedAmount: 2500000,
        totalActualAmount: 1875000,
        overallVariance: -625000,
        overallVariancePercent: -25,
        topVariances: [
          {
            categoryId: '1',
            categoryName: 'Yardım Ödemeleri',
            budgetedAmount: 800000,
            actualAmount: 650000,
            variance: -150000,
            variancePercent: -18.75,
            varianceType: 'favorable',
            impact: 'high',
            actionRequired: false
          },
          {
            categoryId: '2',
            categoryName: 'Pazarlama ve Reklam',
            budgetedAmount: 100000,
            actualAmount: 135000,
            variance: 35000,
            variancePercent: 35,
            varianceType: 'unfavorable',
            impact: 'medium',
            actionRequired: true,
            recommendedAction: 'Pazarlama harcamalarını gözden geçirin'
          }
        ],
        monthlyTrends: [
          { month: 'Ocak', budgeted: 200000, actual: 185000, variance: -15000, variancePercent: -7.5 },
          { month: 'Şubat', budgeted: 220000, actual: 210000, variance: -10000, variancePercent: -4.5 },
          { month: 'Mart', budgeted: 250000, actual: 240000, variance: -10000, variancePercent: -4 },
          { month: 'Nisan', budgeted: 230000, actual: 245000, variance: 15000, variancePercent: 6.5 }
        ],
        categoryPerformance: [
          { categoryName: 'Yardım Ödemeleri', budgeted: 800000, actual: 650000, variance: -150000, variancePercent: -18.75, performance: 'excellent' },
          { categoryName: 'Maaş ve Yan Haklar', budgeted: 600000, actual: 590000, variance: -10000, variancePercent: -1.67, performance: 'good' },
          { categoryName: 'Ofis Kirası', budgeted: 120000, actual: 120000, variance: 0, variancePercent: 0, performance: 'excellent' },
          { categoryName: 'Pazarlama ve Reklam', budgeted: 100000, actual: 135000, variance: 35000, variancePercent: 35, performance: 'poor' }
        ],
        alerts: [
          {
            id: '1',
            budgetId: 'budget-1',
            alertType: 'overspend',
            severity: 'high',
            title: 'Bütçe Aşımı Uyarısı',
            message: 'Pazarlama kategorisinde bütçe %35 aşıldı',
            threshold: 10,
            currentValue: 35,
            isActive: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            budgetId: 'budget-2',
            alertType: 'approval_required',
            severity: 'medium',
            title: 'Onay Bekleyen Bütçe',
            message: '2024 Yıllık Bütçesi onay bekliyor',
            isActive: true,
            created_at: new Date().toISOString()
          }
        ],
        upcomingDeadlines: [
          {
            id: '1',
            budgetId: 'budget-1',
            budgetName: '2024 Yıllık Bütçesi',
            deadlineType: 'approval',
            dueDate: '2024-02-15',
            daysRemaining: 5,
            status: 'upcoming',
            priority: 'high'
          }
        ]
      }
      setDashboardData(mockDashboardData)
    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error)
    }
  }

  const loadBudgets = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockBudgets: AdvancedBudget[] = [
        {
          id: 'budget-1',
          name: '2024 Yıllık Bütçesi',
          description: 'Derneğin 2024 yılı ana bütçesi',
          budgetPeriodId: 'period-2024',
          budgetType: 'annual',
          totalBudgetRevenue: 1500000,
          totalBudgetExpense: 1400000,
          totalActualRevenue: 1200000,
          totalActualExpense: 1100000,
          netBudget: 100000,
          netActual: 100000,
          variance: 0,
          variancePercent: 0,
          status: 'active',
          approvalWorkflow: {
            id: 'workflow-1',
            budgetId: 'budget-1',
            currentStep: 3,
            totalSteps: 3,
            status: 'approved',
            steps: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          categories: [],
          monthlyBreakdown: [],
          createdBy: 'user-1',
          approvedBy: 'user-2',
          approvedAt: '2024-01-15T10:00:00Z',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'budget-2',
          name: 'Eğitim Projesi Bütçesi',
          description: 'Çocuklar için eğitim projesi bütçesi',
          budgetPeriodId: 'period-2024',
          budgetType: 'project',
          totalBudgetRevenue: 500000,
          totalBudgetExpense: 480000,
          totalActualRevenue: 300000,
          totalActualExpense: 280000,
          netBudget: 20000,
          netActual: 20000,
          variance: 0,
          variancePercent: 0,
          status: 'submitted',
          approvalWorkflow: {
            id: 'workflow-2',
            budgetId: 'budget-2',
            currentStep: 1,
            totalSteps: 3,
            status: 'pending',
            steps: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          categories: [],
          monthlyBreakdown: [],
          createdBy: 'user-3',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        }
      ]
      setBudgets(mockBudgets)
    } catch (error) {
      console.error('Bütçeler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...budgets]

    if (searchFilters.searchText) {
      filtered = filtered.filter(budget => 
        budget.name.toLowerCase().includes(searchFilters.searchText!.toLowerCase()) ||
        budget.description?.toLowerCase().includes(searchFilters.searchText!.toLowerCase())
      )
    }

    if (searchFilters.budgetType?.length) {
      filtered = filtered.filter(budget => 
        searchFilters.budgetType!.includes(budget.budgetType)
      )
    }

    if (searchFilters.status?.length) {
      filtered = filtered.filter(budget => 
        searchFilters.status!.includes(budget.status)
      )
    }

    setFilteredBudgets(filtered)
  }

  const handleCreateBudget = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditBudget = (budget: AdvancedBudget) => {
    setSelectedBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleViewBudget = (budget: AdvancedBudget) => {
    setSelectedBudget(budget)
    setIsViewDialogOpen(true)
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (confirm('Bu bütçeyi silmek istediğinizden emin misiniz?')) {
      try {
        // API call to delete budget
        setBudgets(budgets.filter(b => b.id !== budgetId))
      } catch (error) {
        console.error('Bütçe silinirken hata:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = BUDGET_STATUSES.find(s => s.value === status)
    return (
      <Badge variant={status === 'approved' || status === 'active' ? 'default' : 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    )
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-green-600" />
    return <Target className="h-4 w-4 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bütçe Yönetimi</h1>
          <p className="text-muted-foreground">
            Dernek bütçelerini oluşturun, yönetin ve analiz edin
          </p>
        </div>
        <Button onClick={handleCreateBudget} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Bütçe
        </Button>
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="space-y-2">
          {dashboardData.alerts.slice(0, 2).map((alert) => (
            <Alert key={alert.id} className={alert.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.title}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budgets">Bütçeler</TabsTrigger>
          <TabsTrigger value="analysis">Analiz</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardData && (
            <>
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Bütçe</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(dashboardData.totalBudgetedAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.totalBudgets} aktif bütçe
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gerçekleşen</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(dashboardData.totalActualAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Toplam harcama
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Varyans</CardTitle>
                    {getVarianceIcon(dashboardData.overallVariance)}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getVarianceColor(dashboardData.overallVariance)}`}>
                      {formatCurrency(Math.abs(dashboardData.overallVariance))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      %{Math.abs(dashboardData.overallVariancePercent).toFixed(1)} 
                      {dashboardData.overallVariance < 0 ? 'tasarruf' : 'aşım'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Onay Bekleyen</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.pendingApprovals}</div>
                    <p className="text-xs text-muted-foreground">
                      Bütçe onayı gerekli
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Aylık Trend</CardTitle>
                    <CardDescription>
                      Bütçe vs gerçekleşen karşılaştırması
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BudgetComparisonChart data={dashboardData.monthlyTrends} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kategori Performansı</CardTitle>
                    <CardDescription>
                      En yüksek varyansa sahip kategoriler
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BudgetVarianceChart data={dashboardData.categoryPerformance} />
                  </CardContent>
                </Card>
              </div>

              {/* Top Variances */}
              <Card>
                <CardHeader>
                  <CardTitle>Önemli Varyanslar</CardTitle>
                  <CardDescription>
                    Dikkat gerektiren bütçe sapmaları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.topVariances.map((variance, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getVarianceIcon(variance.variance)}
                          <div>
                            <p className="font-medium">{variance.categoryName}</p>
                            <p className="text-sm text-muted-foreground">
                              Bütçe: {formatCurrency(variance.budgetedAmount)} | 
                              Gerçekleşen: {formatCurrency(variance.actualAmount)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getVarianceColor(variance.variance)}`}>
                            {formatCurrency(Math.abs(variance.variance))}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            %{Math.abs(variance.variancePercent).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Bütçe ara..."
                      className="pl-10"
                      value={searchFilters.searchText || ''}
                      onChange={(e) => setSearchFilters({ ...searchFilters, searchText: e.target.value })}
                    />
                  </div>
                </div>
                <Select
                  value={searchFilters.budgetType?.[0] || ''}
                  onValueChange={(value) => setSearchFilters({ ...searchFilters, budgetType: value ? [value] : [] })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bütçe Türü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    {BUDGET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={searchFilters.status?.[0] || ''}
                  onValueChange={(value) => setSearchFilters({ ...searchFilters, status: value ? [value] : [] })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tümü</SelectItem>
                    {BUDGET_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Budget List */}
          <div className="grid gap-4">
            {filteredBudgets.map((budget) => (
              <Card key={budget.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{budget.name}</h3>
                        {getStatusBadge(budget.status)}
                        <Badge variant="outline">
                          {BUDGET_TYPES.find(t => t.value === budget.budgetType)?.label}
                        </Badge>
                      </div>
                      {budget.description && (
                        <p className="text-muted-foreground mb-3">{budget.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bütçe Gelir</p>
                          <p className="font-medium">{formatCurrency(budget.totalBudgetRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bütçe Gider</p>
                          <p className="font-medium">{formatCurrency(budget.totalBudgetExpense)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gerçekleşen</p>
                          <p className="font-medium">{formatCurrency(budget.totalActualExpense)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Varyans</p>
                          <p className={`font-medium ${getVarianceColor(budget.variance)}`}>
                            {formatCurrency(Math.abs(budget.variance))}
                          </p>
                        </div>
                      </div>
                      {budget.variance !== 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Bütçe Kullanımı</span>
                            <span>{((budget.totalActualExpense / budget.totalBudgetExpense) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(budget.totalActualExpense / budget.totalBudgetExpense) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBudget(budget)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBudget(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBudgets.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bütçe bulunamadı</h3>
                  <p className="text-muted-foreground mb-4">
                    Arama kriterlerinize uygun bütçe bulunamadı.
                  </p>
                  <Button onClick={handleCreateBudget}>
                    İlk bütçenizi oluşturun
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gelişmiş Analiz</h3>
                <p className="text-muted-foreground">
                  Bütçe analiz araçları yakında eklenecek.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Bütçe Raporları</h3>
                <p className="text-muted-foreground">
                  Rapor oluşturma araçları yakında eklenecek.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BudgetCreateDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          setIsCreateDialogOpen(false)
          loadBudgets()
        }}
      />
      
      {selectedBudget && (
        <>
          <BudgetEditDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen}
            budget={selectedBudget}
            onSuccess={() => {
              setIsEditDialogOpen(false)
              setSelectedBudget(null)
              loadBudgets()
            }}
          />
          
          <BudgetViewDialog 
            open={isViewDialogOpen} 
            onOpenChange={setIsViewDialogOpen}
            budget={selectedBudget}
            onClose={() => {
              setIsViewDialogOpen(false)
              setSelectedBudget(null)
            }}
          />
        </>
      )}
    </div>
  )
}