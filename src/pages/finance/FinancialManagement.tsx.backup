import { useState, useEffect } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Modal } from '@components/Modal'
import { AccountingService } from '@services/accountingService'
import type { ChartOfAccounts, GeneralLedgerEntry, Budget, Grant } from '@/types/accounting'
import { toast } from 'sonner'
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  FileText, 
  CreditCard, 
  BanknoteIcon,
  Plus,
  Download,
  Eye,
  Settings,
  DollarSign,
  Receipt,
  Building,
  Target
} from 'lucide-react'
import { BudgetManagement } from '@/components/budget/BudgetManagement'

export default function FinancialManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'journal' | 'reports' | 'budget' | 'grants'>('dashboard')
  const [accounts, setAccounts] = useState<ChartOfAccounts[]>([])
  const [loading, setLoading] = useState(true)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showGrantModal, setShowGrantModal] = useState(false)
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    netIncome: 0
  })

  const [trialBalance, setTrialBalance] = useState<any[]>([])
  const [incomeStatement, setIncomeStatement] = useState<any>(null)
  const [balanceSheet, setBalanceSheet] = useState<any>(null)

  useEffect(() => {
    initializeFinancialSystem()
  }, [])

  const initializeFinancialSystem = async () => {
    setLoading(true)
    try {
      // Initialize chart of accounts if needed
      await AccountingService.initializeChartOfAccounts()
      
      // Load data
      await loadFinancialData()
    } catch (error) {
      console.error('Error initializing financial system:', error)
      toast.error('Mali sistem başlatılamadı')
    } finally {
      setLoading(false)
    }
  }

  const loadFinancialData = async () => {
    try {
      // Load chart of accounts
      const accountsData = await AccountingService.getChartOfAccounts()
      setAccounts(accountsData)

      // Generate dashboard data
      const balanceSheetData = await AccountingService.generateBalanceSheet()
      const incomeStatementData = await AccountingService.generateIncomeStatement(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      )

      if (balanceSheetData) {
        setBalanceSheet(balanceSheetData)
        setDashboardData(prev => ({
          ...prev,
          totalAssets: balanceSheetData.totalAssets,
          totalLiabilities: balanceSheetData.totalLiabilities,
          totalEquity: balanceSheetData.totalEquity
        }))
      }

      if (incomeStatementData) {
        setIncomeStatement(incomeStatementData)
        setDashboardData(prev => ({
          ...prev,
          monthlyRevenue: incomeStatementData.totalRevenues,
          monthlyExpenses: incomeStatementData.totalExpenses,
          netIncome: incomeStatementData.netIncome
        }))
      }

      // Load trial balance
      const trialBalanceData = await AccountingService.generateTrialBalance()
      setTrialBalance(trialBalanceData)

    } catch (error) {
      console.error('Error loading financial data:', error)
      toast.error('Mali veriler yüklenemedi')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Varlıklar</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.totalAssets)}</p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Borçlar</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(dashboardData.totalLiabilities)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aylık Gelir</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.monthlyRevenue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Gelir</p>
              <p className={`text-2xl font-bold ${dashboardData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(dashboardData.netIncome)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setShowJournalModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Plus className="h-6 w-6 mb-2" />
            Yevmiye Kaydı
          </Button>
          
          <Button 
            onClick={() => setActiveTab('reports')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <FileText className="h-6 w-6 mb-2" />
            Mali Raporlar
          </Button>
          
          <Button 
            onClick={() => setActiveTab('budget')}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Target className="h-6 w-6 mb-2" />
            Bütçe Yönetimi
          </Button>
          
          <Button 
            onClick={() => setShowGrantModal(true)}
            className="flex flex-col items-center p-4 h-auto"
            variant="outline"
          >
            <Receipt className="h-6 w-6 mb-2" />
            Hibe Kaydı
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Son İşlemler</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Bağış Kaydı #12345</p>
              <p className="text-sm text-gray-600">15 dakika önce</p>
            </div>
            <span className="text-green-600 font-bold">+{formatCurrency(1500)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Yardım Ödemesi #987</p>
              <p className="text-sm text-gray-600">2 saat önce</p>
            </div>
            <span className="text-red-600 font-bold">-{formatCurrency(800)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Ofis Kirası</p>
              <p className="text-sm text-gray-600">1 gün önce</p>
            </div>
            <span className="text-red-600 font-bold">-{formatCurrency(5000)}</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const AccountsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Hesap Planı</h2>
        <Button onClick={() => setShowAccountModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hesap
        </Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Hesap Kodu</th>
                <th className="text-left p-2">Hesap Adı</th>
                <th className="text-left p-2">Tip</th>
                <th className="text-left p-2">Bakiye</th>
                <th className="text-left p-2">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">{account.accountCode}</td>
                  <td className="p-2">{account.accountNameTR}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      account.accountType === 'varlık' ? 'bg-green-100 text-green-800' :
                      account.accountType === 'borç' ? 'bg-red-100 text-red-800' :
                      account.accountType === 'öz_kaynak' ? 'bg-blue-100 text-blue-800' :
                      account.accountType === 'gelir' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {account.accountType}
                    </span>
                  </td>
                  <td className="p-2 font-mono">{formatCurrency(account.currentBalance)}</td>
                  <td className="p-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const ReportsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mali Raporlar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trial Balance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mizan</h3>
          <p className="text-sm text-gray-600 mb-4">Tüm hesapların borç/alacak durumu</p>
          <Button 
            onClick={() => {
              // Generate and download trial balance
              toast.success('Mizan raporu oluşturuluyor...')
            }}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>
        </Card>

        {/* Income Statement */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gelir Gider Tablosu</h3>
          <p className="text-sm text-gray-600 mb-4">Belirli dönem gelir ve gider analizi</p>
          <Button 
            onClick={() => {
              toast.success('Gelir gider raporu oluşturuluyor...')
            }}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>
        </Card>

        {/* Balance Sheet */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bilanço</h3>
          <p className="text-sm text-gray-600 mb-4">Finansal durum raporu</p>
          <Button 
            onClick={() => {
              toast.success('Bilanço raporu oluşturuluyor...')
            }}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>
        </Card>
      </div>

      {/* Quick Trial Balance Preview */}
      {trialBalance.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mizan Özeti</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Hesap Kodu</th>
                  <th className="text-left p-2">Hesap Adı</th>
                  <th className="text-right p-2">Borç</th>
                  <th className="text-right p-2">Alacak</th>
                </tr>
              </thead>
              <tbody>
                {trialBalance.slice(0, 10).map((account, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{account.accountCode}</td>
                    <td className="p-2">{account.accountName}</td>
                    <td className="p-2 text-right font-mono">
                      {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : '-'}
                    </td>
                    <td className="p-2 text-right font-mono">
                      {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {trialBalance.length > 10 && (
            <p className="text-sm text-gray-600 mt-2">
              ve {trialBalance.length - 10} hesap daha...
            </p>
          )}
        </Card>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p>Mali sistem yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mali Yönetim</h1>
          <p className="text-gray-600">Muhasebe, bütçe ve finansal raporlama</p>
        </div>
        <Button onClick={() => loadFinancialData()}>
          <Settings className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { key: 'dashboard', label: 'Panel', icon: PieChart },
            { key: 'accounts', label: 'Hesap Planı', icon: Building },
            { key: 'journal', label: 'Yevmiye', icon: FileText },
            { key: 'reports', label: 'Raporlar', icon: TrendingUp },
            { key: 'budget', label: 'Bütçe', icon: Target },
            { key: 'grants', label: 'Hibeler', icon: Receipt }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'accounts' && <AccountsTab />}
      {activeTab === 'reports' && <ReportsTab />}
      {activeTab === 'journal' && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Yevmiye defteri modülü yakında...</p>
        </div>
      )}
      {activeTab === 'budget' && <BudgetManagement />}
      {activeTab === 'grants' && (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Hibe yönetimi modülü yakında...</p>
        </div>
      )}

      {/* Modals placeholder */}
      {showJournalModal && (
        <Modal
          isOpen={showJournalModal}
          onClose={() => setShowJournalModal(false)}
          title="Yeni Yevmiye Kaydı"
        >
          <div className="p-4">
            <p>Yevmiye kayıt formu burada olacak...</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
