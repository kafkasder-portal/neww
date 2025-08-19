// Financial Management Types for Charity Management System

export interface ChartOfAccounts {
  id: string
  accountCode: string
  accountName: string
  accountNameTR: string
  accountType: 'varlık' | 'borç' | 'öz_kaynak' | 'gelir' | 'gider'
  accountTypeEN: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parentAccountId?: string
  isActive: boolean
  description?: string
  balanceType: 'debit' | 'credit' // Normal bakiye türü
  currentBalance: number
  created_at: string
  updated_at: string
}

export interface GeneralLedgerEntry {
  id: string
  transactionDate: string
  referenceNumber: string
  description: string
  documentType: 'donation' | 'payment' | 'transfer' | 'adjustment' | 'journal'
  documentId?: string
  entries: JournalEntry[]
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
  createdBy: string
  approvedBy?: string
  status: 'draft' | 'posted' | 'approved'
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  generalLedgerEntryId: string
  accountId: string
  accountCode: string
  accountName: string
  debitAmount: number
  creditAmount: number
  description: string
  fundId?: string
  projectId?: string
  grantId?: string
}

export interface Budget {
  id: string
  name: string
  fiscalYear: number
  startDate: string
  endDate: string
  budgetType: 'annual' | 'project' | 'grant' | 'campaign'
  totalBudgetRevenue: number
  totalBudgetExpense: number
  status: 'draft' | 'approved' | 'active' | 'closed'
  departments: BudgetDepartment[]
  created_at: string
  updated_at: string
}

export interface BudgetDepartment {
  id: string
  budgetId: string
  departmentName: string
  allocatedAmount: number
  spentAmount: number
  remainingAmount: number
  categories: BudgetCategory[]
}

export interface BudgetCategory {
  id: string
  departmentId: string
  categoryName: string
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
}

export interface Grant {
  id: string
  grantorName: string
  grantorContact: string
  grantAmount: number
  awardDate: string
  startDate: string
  endDate: string
  purpose: string
  restrictions: string[]
  complianceRequirements: GrantCompliance[]
  spentAmount: number
  remainingAmount: number
  status: 'awarded' | 'active' | 'completed' | 'terminated'
  reportingFrequency: 'monthly' | 'quarterly' | 'annually'
  nextReportDue?: string
  created_at: string
  updated_at: string
}

export interface GrantCompliance {
  id: string
  grantId: string
  requirementType: 'financial_report' | 'progress_report' | 'audit' | 'site_visit'
  description: string
  dueDate: string
  completedDate?: string
  status: 'pending' | 'completed' | 'overdue'
  notes?: string
}

export interface BankReconciliation {
  id: string
  bankAccountId: string
  statementDate: string
  bankBalance: number
  bookBalance: number
  reconciledAmount: number
  outstandingDeposits: number
  outstandingChecks: number
  adjustments: number
  status: 'in_progress' | 'completed' | 'reviewed'
  reconciliationItems: ReconciliationItem[]
  created_at: string
  updated_at: string
}

export interface ReconciliationItem {
  id: string
  reconciliationId: string
  transactionType: 'deposit' | 'withdrawal' | 'fee' | 'interest'
  amount: number
  description: string
  bankStatementRef?: string
  bookTransactionId?: string
  isMatched: boolean
  adjustmentReason?: string
}

export interface FinancialReport {
  id: string
  reportType: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'statement_of_activities' | 'functional_expenses'
  reportName: string
  periodStart: string
  periodEnd: string
  data: any // Specific structure per report type
  generatedBy: string
  generated_at: string
}

export interface TaxDocument {
  id: string
  donorId: string
  donationIds: string[]
  documentType: 'receipt' | 'annual_statement' | 'tax_exempt_certificate'
  taxYear: number
  totalAmount: number
  documentNumber: string
  issuedDate: string
  pdfPath?: string
  emailSent: boolean
  created_at: string
}

// Utility types for financial operations
export interface FinancialTransaction {
  id: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  exchangeRate?: number
  baseAmount: number // Amount in organization's base currency (TRY)
  date: string
  type: 'income' | 'expense' | 'transfer'
  category: string
  subcategory?: string
  description: string
  fundId?: string
  projectId?: string
  grantId?: string
  donorId?: string
  vendorId?: string
  receiptPath?: string
  approvalRequired: boolean
  approvedBy?: string
  approvedAt?: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
}

export interface Fund {
  id: string
  name: string
  fundType: 'unrestricted' | 'temporarily_restricted' | 'permanently_restricted'
  purpose: string
  restrictions?: string[]
  currentBalance: number
  totalReceived: number
  totalSpent: number
  isActive: boolean
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  budget: number
  spentAmount: number
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  managerId: string
  fundIds: string[]
  grantIds: string[]
}

// Dashboard and analytics types
export interface FinancialDashboardData {
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  cashOnHand: number
  accountsReceivable: number
  accountsPayable: number
  monthlyTrends: MonthlyFinancialTrend[]
  topDonors: DonorSummary[]
  expensesByCategory: ExpenseCategory[]
  fundBalances: FundBalance[]
}

export interface MonthlyFinancialTrend {
  month: string
  revenue: number
  expenses: number
  netIncome: number
}

export interface DonorSummary {
  id: string
  name: string
  totalGiven: number
  lastDonationDate: string
  donationCount: number
}

export interface ExpenseCategory {
  category: string
  amount: number
  percentage: number
}

export interface FundBalance {
  fundId: string
  fundName: string
  balance: number
  restricted: boolean
}

// Standard Chart of Accounts for NGOs/Charities (Turkish version)
export const STANDARD_CHART_OF_ACCOUNTS: Omit<ChartOfAccounts, 'id' | 'created_at' | 'updated_at' | 'currentBalance'>[] = [
  // VARLIKlar (ASSETS)
  { accountCode: '100', accountName: 'Current Assets', accountNameTR: 'Dönen Varlıklar', accountType: 'varlık', accountTypeEN: 'asset', isActive: true, balanceType: 'debit' },
  { accountCode: '101', accountName: 'Cash', accountNameTR: 'Kasa', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '100', isActive: true, balanceType: 'debit' },
  { accountCode: '102', accountName: 'Bank - General Account', accountNameTR: 'Banka - Genel Hesap', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '100', isActive: true, balanceType: 'debit' },
  { accountCode: '103', accountName: 'Bank - Donation Account', accountNameTR: 'Banka - Bağış Hesabı', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '100', isActive: true, balanceType: 'debit' },
  { accountCode: '104', accountName: 'Accounts Receivable', accountNameTR: 'Alacaklar', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '100', isActive: true, balanceType: 'debit' },
  { accountCode: '105', accountName: 'Pledges Receivable', accountNameTR: 'Taahhüt Alacakları', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '100', isActive: true, balanceType: 'debit' },
  
  { accountCode: '150', accountName: 'Fixed Assets', accountNameTR: 'Duran Varlıklar', accountType: 'varlık', accountTypeEN: 'asset', isActive: true, balanceType: 'debit' },
  { accountCode: '151', accountName: 'Equipment', accountNameTR: 'Demirbaş', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '150', isActive: true, balanceType: 'debit' },
  { accountCode: '152', accountName: 'Vehicles', accountNameTR: 'Araçlar', accountType: 'varlık', accountTypeEN: 'asset', parentAccountId: '150', isActive: true, balanceType: 'debit' },
  
  // BORÇLAR (LIABILITIES)
  { accountCode: '200', accountName: 'Current Liabilities', accountNameTR: 'Kısa Vadeli Borçlar', accountType: 'borç', accountTypeEN: 'liability', isActive: true, balanceType: 'credit' },
  { accountCode: '201', accountName: 'Accounts Payable', accountNameTR: 'Borçlar', accountType: 'borç', accountTypeEN: 'liability', parentAccountId: '200', isActive: true, balanceType: 'credit' },
  { accountCode: '202', accountName: 'Accrued Expenses', accountNameTR: 'Tahakkuk Eden Giderler', accountType: 'borç', accountTypeEN: 'liability', parentAccountId: '200', isActive: true, balanceType: 'credit' },
  
  // ÖZ KAYNAK (EQUITY/NET ASSETS)
  { accountCode: '300', accountName: 'Net Assets', accountNameTR: 'Öz Kaynak', accountType: 'öz_kaynak', accountTypeEN: 'equity', isActive: true, balanceType: 'credit' },
  { accountCode: '301', accountName: 'Unrestricted Net Assets', accountNameTR: 'Sınırsız Öz Kaynak', accountType: 'öz_kaynak', accountTypeEN: 'equity', parentAccountId: '300', isActive: true, balanceType: 'credit' },
  { accountCode: '302', accountName: 'Temporarily Restricted Net Assets', accountNameTR: 'Geçici Sınırlı Öz Kaynak', accountType: 'öz_kaynak', accountTypeEN: 'equity', parentAccountId: '300', isActive: true, balanceType: 'credit' },
  { accountCode: '303', accountName: 'Permanently Restricted Net Assets', accountNameTR: 'Kalıcı Sınırlı Öz Kaynak', accountType: 'öz_kaynak', accountTypeEN: 'equity', parentAccountId: '300', isActive: true, balanceType: 'credit' },
  
  // GELİRLER (REVENUE)
  { accountCode: '400', accountName: 'Revenues', accountNameTR: 'Gelirler', accountType: 'gelir', accountTypeEN: 'revenue', isActive: true, balanceType: 'credit' },
  { accountCode: '401', accountName: 'Individual Donations', accountNameTR: 'Bireysel Bağışlar', accountType: 'gelir', accountTypeEN: 'revenue', parentAccountId: '400', isActive: true, balanceType: 'credit' },
  { accountCode: '402', accountName: 'Corporate Donations', accountNameTR: 'Kurumsal Bağışlar', accountType: 'gelir', accountTypeEN: 'revenue', parentAccountId: '400', isActive: true, balanceType: 'credit' },
  { accountCode: '403', accountName: 'Grant Revenue', accountNameTR: 'Hibe Gelirleri', accountType: 'gelir', accountTypeEN: 'revenue', parentAccountId: '400', isActive: true, balanceType: 'credit' },
  { accountCode: '404', accountName: 'Investment Income', accountNameTR: 'Yatırım Gelirleri', accountType: 'gelir', accountTypeEN: 'revenue', parentAccountId: '400', isActive: true, balanceType: 'credit' },
  { accountCode: '405', accountName: 'Other Income', accountNameTR: 'Diğer Gelirler', accountType: 'gelir', accountTypeEN: 'revenue', parentAccountId: '400', isActive: true, balanceType: 'credit' },
  
  // GİDERLER (EXPENSES)
  { accountCode: '500', accountName: 'Program Expenses', accountNameTR: 'Program Giderleri', accountType: 'gider', accountTypeEN: 'expense', isActive: true, balanceType: 'debit' },
  { accountCode: '501', accountName: 'Aid Payments', accountNameTR: 'Yardım Ödemeleri', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '500', isActive: true, balanceType: 'debit' },
  { accountCode: '502', accountName: 'Scholarship Payments', accountNameTR: 'Burs Ödemeleri', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '500', isActive: true, balanceType: 'debit' },
  { accountCode: '503', accountName: 'Medical Aid', accountNameTR: 'Sağlık Yardımları', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '500', isActive: true, balanceType: 'debit' },
  
  { accountCode: '600', accountName: 'Administrative Expenses', accountNameTR: 'Yönetim Giderleri', accountType: 'gider', accountTypeEN: 'expense', isActive: true, balanceType: 'debit' },
  { accountCode: '601', accountName: 'Salaries and Benefits', accountNameTR: 'Maaş ve Yan Haklar', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '600', isActive: true, balanceType: 'debit' },
  { accountCode: '602', accountName: 'Office Rent', accountNameTR: 'Ofis Kirası', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '600', isActive: true, balanceType: 'debit' },
  { accountCode: '603', accountName: 'Utilities', accountNameTR: 'Faturalar', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '600', isActive: true, balanceType: 'debit' },
  { accountCode: '604', accountName: 'Office Supplies', accountNameTR: 'Ofis Malzemeleri', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '600', isActive: true, balanceType: 'debit' },
  
  { accountCode: '700', accountName: 'Fundraising Expenses', accountNameTR: 'Bağış Toplama Giderleri', accountType: 'gider', accountTypeEN: 'expense', isActive: true, balanceType: 'debit' },
  { accountCode: '701', accountName: 'Marketing and Advertising', accountNameTR: 'Pazarlama ve Reklam', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '700', isActive: true, balanceType: 'debit' },
  { accountCode: '702', accountName: 'Event Costs', accountNameTR: 'Etkinlik Maliyetleri', accountType: 'gider', accountTypeEN: 'expense', parentAccountId: '700', isActive: true, balanceType: 'debit' },
]
