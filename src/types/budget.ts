// Advanced Budget Management Types for Charity Management System

export interface BudgetPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  fiscalYear: number
  isActive: boolean
  created_at: string
  updated_at: string
}

export interface BudgetTemplate {
  id: string
  name: string
  description: string
  budgetType: 'annual' | 'project' | 'grant' | 'campaign' | 'department'
  categories: BudgetTemplateCategory[]
  isDefault: boolean
  created_at: string
  updated_at: string
}

export interface BudgetTemplateCategory {
  id: string
  templateId: string
  categoryName: string
  categoryCode: string
  accountCode?: string
  budgetType: 'revenue' | 'expense'
  parentCategoryId?: string
  defaultAmount?: number
  isRequired: boolean
  sortOrder: number
}

export interface AdvancedBudget {
  id: string
  name: string
  description?: string
  budgetPeriodId: string
  budgetType: 'annual' | 'project' | 'grant' | 'campaign' | 'department'
  templateId?: string
  totalBudgetRevenue: number
  totalBudgetExpense: number
  totalActualRevenue: number
  totalActualExpense: number
  netBudget: number
  netActual: number
  variance: number
  variancePercent: number
  status: 'draft' | 'submitted' | 'approved' | 'active' | 'closed' | 'rejected' | 'pending_approval'
  approvalWorkflow: BudgetApprovalWorkflow
  categories: AdvancedBudgetCategory[]
  monthlyBreakdown: BudgetMonthlyBreakdown[]
  notes?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  created_at: string
  updated_at: string
  totalAmount?: number
  startDate?: string
  endDate?: string
  period?: string
}

export interface AdvancedBudgetCategory {
  id: string
  budgetId: string
  categoryName: string
  categoryCode: string
  accountCode?: string
  budgetType: 'revenue' | 'expense'
  parentCategoryId?: string
  budgetedAmount: number
  actualAmount: number
  encumberedAmount: number // Taahhüt edilen tutar
  availableAmount: number // Kullanılabilir tutar
  variance: number
  variancePercent: number
  lastUpdated: string
  subcategories: AdvancedBudgetSubcategory[]
  monthlyAllocations: BudgetMonthlyAllocation[]
  notes?: string
  allocatedAmount?: number
  name?: string
  description?: string
}

export interface AdvancedBudgetSubcategory {
  id: string
  categoryId: string
  subcategoryName: string
  subcategoryCode: string
  budgetedAmount: number
  actualAmount: number
  encumberedAmount: number
  availableAmount: number
  variance: number
  variancePercent: number
  responsibleDepartment?: string
  responsiblePerson?: string
}

export interface BudgetMonthlyBreakdown {
  id: string
  budgetId: string
  month: number // 1-12
  year: number
  totalBudgetRevenue: number
  totalBudgetExpense: number
  totalActualRevenue: number
  totalActualExpense: number
  variance: number
  variancePercent: number
  budgetedAmount?: number
  actualAmount?: number
}

export interface BudgetMonthlyAllocation {
  id: string
  categoryId: string
  month: number // 1-12
  year: number
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
}

export interface BudgetApprovalWorkflow {
  id: string
  budgetId: string
  currentStep: number
  totalSteps: number
  status: 'pending' | 'in_progress' | 'approved' | 'rejected'
  steps: BudgetApprovalStep[]
  created_at: string
  updated_at: string
}

export interface BudgetApprovalStep {
  id: string
  workflowId: string
  stepNumber: number
  stepName: string
  approverRole: string
  approverId?: string
  approverName?: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped' | 'completed' | 'waiting'
  comments?: string
  approvedAt?: string
  isRequired: boolean
  order?: number
  completedAt?: string
  comment?: string
  assignedTo?: string
}

// Legacy type aliases for backward compatibility
export type Budget = AdvancedBudget
export type BudgetCategory = AdvancedBudgetCategory
export type BudgetApproval = BudgetApprovalWorkflow
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'skipped' | 'waiting' | 'completed'
export type ApprovalStep = BudgetApprovalStep
export type ActualExpense = {
  categoryId: string
  amount: number
  date: string
  description?: string
}
export type BudgetRevision = {
  id: string
  budgetId: string
  revisionNumber: number
  changes: any
  reason: string
  createdBy: string
  created_at: string
  revisionNote?: string
  revisedAt?: string
}

export interface BudgetVarianceAnalysis {
  id: string
  budgetId: string
  analysisDate: string
  totalVariance: number
  totalVariancePercent: number
  significantVariances: SignificantVariance[]
  recommendations: string[]
  generatedBy: string
  generated_at: string
}

export interface SignificantVariance {
  categoryId: string
  categoryName: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
  varianceType: 'favorable' | 'unfavorable'
  reason?: string
  impact: 'low' | 'medium' | 'high'
  actionRequired: boolean
  recommendedAction?: string
}

export interface BudgetComparison {
  id: string
  name: string
  description?: string
  comparisonType: 'year_over_year' | 'budget_vs_actual' | 'multi_budget' | 'trend_analysis'
  budgetIds: string[]
  periodStart: string
  periodEnd: string
  comparisonData: BudgetComparisonData[]
  insights: BudgetInsight[]
  generatedBy: string
  generated_at: string
}

export interface BudgetComparisonData {
  categoryName: string
  categoryCode: string
  periods: BudgetPeriodData[]
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile'
  averageGrowthRate: number
}

export interface BudgetPeriodData {
  periodName: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
}

export interface BudgetInsight {
  id: string
  type: 'trend' | 'variance' | 'efficiency' | 'risk' | 'opportunity'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  category?: string
  recommendation?: string
  priority: number
}

export interface BudgetForecast {
  id: string
  budgetId: string
  forecastType: 'linear' | 'seasonal' | 'trend_based' | 'manual'
  forecastPeriod: string // 'quarterly' | 'annual'
  projectedRevenue: number
  projectedExpense: number
  projectedNetIncome: number
  confidenceLevel: number // 0-100
  assumptions: string[]
  riskFactors: string[]
  generatedBy: string
  generated_at: string
}

export interface BudgetAlert {
  id: string
  budgetId: string
  categoryId?: string
  alertType: 'overspend' | 'underspend' | 'variance_threshold' | 'approval_required' | 'deadline_approaching'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  threshold?: number
  currentValue?: number
  isActive: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  created_at: string
}

export interface BudgetReport {
  id: string
  reportType: 'summary' | 'detailed' | 'variance' | 'forecast' | 'comparison'
  name: string
  description?: string
  budgetIds: string[]
  periodStart: string
  periodEnd: string
  filters: BudgetReportFilter[]
  data: any // Specific structure per report type
  charts: BudgetChart[]
  generatedBy: string
  generated_at: string
}

export interface BudgetReportFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between'
  value: any
  label: string
}

export interface BudgetChart {
  id: string
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
  title: string
  data: ChartDataPoint[]
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
}

export interface ChartDataPoint {
  label: string
  value: number
  category?: string
  color?: string
  metadata?: Record<string, any>
}

// Budget Dashboard Types
export interface BudgetDashboardData {
  totalBudgets: number
  activeBudgets: number
  pendingApprovals: number
  totalBudgetedAmount: number
  totalActualAmount: number
  overallVariance: number
  overallVariancePercent: number
  topVariances: SignificantVariance[]
  monthlyTrends: BudgetMonthlyTrend[]
  categoryPerformance: CategoryPerformance[]
  alerts: BudgetAlert[]
  upcomingDeadlines: BudgetDeadline[]
}

export interface BudgetMonthlyTrend {
  month: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
}

export interface CategoryPerformance {
  categoryName: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
  performance: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface BudgetDeadline {
  id: string
  budgetId: string
  budgetName: string
  deadlineType: 'submission' | 'approval' | 'review' | 'reporting'
  dueDate: string
  daysRemaining: number
  status: 'upcoming' | 'due_today' | 'overdue'
  priority: 'low' | 'medium' | 'high'
}

// Utility types
export interface BudgetFormData {
  name: string
  description?: string
  budgetType: 'annual' | 'project' | 'grant' | 'campaign' | 'department'
  budgetPeriodId: string
  templateId?: string
  categories: BudgetCategoryFormData[]
  notes?: string
}

export interface BudgetCategoryFormData {
  categoryName: string
  categoryCode: string
  accountCode?: string
  budgetType: 'revenue' | 'expense'
  budgetedAmount: number
  monthlyAllocations?: number[]
  subcategories?: BudgetSubcategoryFormData[]
  notes?: string
}

export interface BudgetSubcategoryFormData {
  subcategoryName: string
  subcategoryCode: string
  budgetedAmount: number
  responsibleDepartment?: string
  responsiblePerson?: string
}

export interface BudgetSearchFilters {
  budgetType?: string[]
  status?: string[]
  fiscalYear?: number[]
  createdBy?: string[]
  dateRange?: {
    start: string
    end: string
  }
  amountRange?: {
    min: number
    max: number
  }
  searchText?: string
}

export interface BudgetExportOptions {
  format: 'excel' | 'pdf' | 'csv'
  includeCharts: boolean
  includeVarianceAnalysis: boolean
  includeMonthlyBreakdown: boolean
  includeComparisons: boolean
  customFields?: string[]
}

// Constants
export const BUDGET_TYPES = [
  { value: 'annual', label: 'Yıllık Bütçe' },
  { value: 'project', label: 'Proje Bütçesi' },
  { value: 'grant', label: 'Hibe Bütçesi' },
  { value: 'campaign', label: 'Kampanya Bütçesi' },
  { value: 'department', label: 'Departman Bütçesi' }
] as const

export const BUDGET_STATUSES = [
  { value: 'draft', label: 'Taslak', color: 'gray' },
  { value: 'submitted', label: 'Gönderildi', color: 'blue' },
  { value: 'approved', label: 'Onaylandı', color: 'green' },
  { value: 'active', label: 'Aktif', color: 'green' },
  { value: 'closed', label: 'Kapatıldı', color: 'gray' },
  { value: 'rejected', label: 'Reddedildi', color: 'red' }
] as const

export const VARIANCE_THRESHOLDS = {
  LOW: 5, // %5
  MEDIUM: 10, // %10
  HIGH: 20 // %20
} as const

export const BUDGET_CATEGORIES = [
  // Gelir Kategorileri
  { code: 'REV001', name: 'Bireysel Bağışlar', type: 'revenue', accountCode: '401' },
  { code: 'REV002', name: 'Kurumsal Bağışlar', type: 'revenue', accountCode: '402' },
  { code: 'REV003', name: 'Hibe Gelirleri', type: 'revenue', accountCode: '403' },
  { code: 'REV004', name: 'Yatırım Gelirleri', type: 'revenue', accountCode: '404' },
  { code: 'REV005', name: 'Diğer Gelirler', type: 'revenue', accountCode: '405' },

  // Gider Kategorileri
  { code: 'EXP001', name: 'Yardım Ödemeleri', type: 'expense', accountCode: '501' },
  { code: 'EXP002', name: 'Burs Ödemeleri', type: 'expense', accountCode: '502' },
  { code: 'EXP003', name: 'Sağlık Yardımları', type: 'expense', accountCode: '503' },
  { code: 'EXP004', name: 'Maaş ve Yan Haklar', type: 'expense', accountCode: '601' },
  { code: 'EXP005', name: 'Ofis Kirası', type: 'expense', accountCode: '602' },
  { code: 'EXP006', name: 'Faturalar', type: 'expense', accountCode: '603' },
  { code: 'EXP007', name: 'Ofis Malzemeleri', type: 'expense', accountCode: '604' },
  { code: 'EXP008', name: 'Pazarlama ve Reklam', type: 'expense', accountCode: '701' },
  { code: 'EXP009', name: 'Etkinlik Maliyetleri', type: 'expense', accountCode: '702' }
] as const