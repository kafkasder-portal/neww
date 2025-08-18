import { supabase } from '@lib/supabase'
import type { 
  ChartOfAccounts, 
  GeneralLedgerEntry, 
  JournalEntry, 
  FinancialTransaction,
  Budget,
  Grant,
  STANDARD_CHART_OF_ACCOUNTS
} from '@/types/accounting'
import { toast } from 'sonner'

export class AccountingService {
  // Chart of Accounts Management
  static async initializeChartOfAccounts(): Promise<boolean> {
    try {
      const { data: existingAccounts, error: checkError } = await supabase
        .from('chart_of_accounts')
        .select('accountCode')
        .limit(5)

      if (checkError && !checkError.message.includes('relation')) {
        throw checkError
      }

      // If table doesn't exist or is empty, create default accounts
      if (!existingAccounts || existingAccounts.length === 0) {
        const accountsToInsert = STANDARD_CHART_OF_ACCOUNTS.map(account => ({
          ...account,
          currentBalance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        const { error: insertError } = await supabase
          .from('chart_of_accounts')
          .insert(accountsToInsert)

        if (insertError) {
          console.error('Error creating chart of accounts:', insertError)
          return false
        }

        toast.success('Hesap planı başarıyla oluşturuldu')
        return true
      }

      return true
    } catch (error) {
      console.error('Error initializing chart of accounts:', error)
      toast.error('Hesap planı oluşturulamadı')
      return false
    }
  }

  static async getChartOfAccounts(): Promise<ChartOfAccounts[]> {
    try {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('isActive', true)
        .order('accountCode')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching chart of accounts:', error)
      return []
    }
  }

  static async getAccountByCode(accountCode: string): Promise<ChartOfAccounts | null> {
    try {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('accountCode', accountCode)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching account:', error)
      return null
    }
  }

  // General Ledger Operations
  static async createJournalEntry(entry: Omit<GeneralLedgerEntry, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      // Validate that debits equal credits
      const totalDebits = entry.entries.reduce((sum, e) => sum + e.debitAmount, 0)
      const totalCredits = entry.entries.reduce((sum, e) => sum + e.creditAmount, 0)

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        toast.error('Borç ve alacak toplamları eşit olmalıdır')
        return null
      }

      // Generate reference number if not provided
      const referenceNumber = entry.referenceNumber || await this.generateReferenceNumber()

      const entryData = {
        ...entry,
        referenceNumber,
        totalDebit: totalDebits,
        totalCredit: totalCredits,
        isBalanced: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: ledgerEntry, error: ledgerError } = await supabase
        .from('general_ledger_entries')
        .insert([entryData])
        .select()
        .single()

      if (ledgerError) throw ledgerError

      // Create individual journal entries
      const journalEntries = entry.entries.map(je => ({
        ...je,
        generalLedgerEntryId: ledgerEntry.id,
        id: undefined // Let Supabase generate
      }))

      const { error: journalError } = await supabase
        .from('journal_entries')
        .insert(journalEntries)

      if (journalError) throw journalError

      // Update account balances
      await this.updateAccountBalances(entry.entries)

      toast.success('Muhasebe kaydı oluşturuldu')
      return ledgerEntry.id
    } catch (error) {
      console.error('Error creating journal entry:', error)
      toast.error('Muhasebe kaydı oluşturulamadı')
      return null
    }
  }

  private static async generateReferenceNumber(): Promise<string> {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    
    // Get count of entries for this month
    const { count } = await supabase
      .from('general_ledger_entries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-${month}-01`)
      .lt('created_at', `${year}-${month}-31`)

    const sequence = String((count || 0) + 1).padStart(4, '0')
    return `JE${year}${month}${sequence}`
  }

  private static async updateAccountBalances(entries: Omit<JournalEntry, 'id' | 'generalLedgerEntryId'>[]): Promise<void> {
    for (const entry of entries) {
      const account = await this.getAccountByCode(entry.accountCode)
      if (!account) continue

      const balanceChange = account.balanceType === 'debit' 
        ? entry.debitAmount - entry.creditAmount
        : entry.creditAmount - entry.debitAmount

      const newBalance = account.currentBalance + balanceChange

      await supabase
        .from('chart_of_accounts')
        .update({ 
          currentBalance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id)
    }
  }

  // Automated journal entries for existing transactions
  static async recordDonationEntry(donationId: string, amount: number, donorType: 'individual' | 'corporate', currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): Promise<void> {
    const revenueAccount = donorType === 'individual' ? '401' : '402' // Individual vs Corporate donations
    const bankAccount = '102' // Bank - General Account

    const exchangeRate = currency === 'TRY' ? 1 : await this.getExchangeRate(currency)
    const baseAmount = amount * exchangeRate

    const journalEntry: Omit<GeneralLedgerEntry, 'id' | 'created_at' | 'updated_at'> = {
      transactionDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      description: `Bağış kaydı - ${donorType === 'individual' ? 'Bireysel' : 'Kurumsal'}`,
      documentType: 'donation',
      documentId: donationId,
      status: 'posted',
      createdBy: 'system',
      entries: [
        {
          accountId: '', // Will be resolved by account code
          accountCode: bankAccount,
          accountName: 'Banka - Genel Hesap',
          debitAmount: baseAmount,
          creditAmount: 0,
          description: `Bağış alındı - ${currency} ${amount}`,
        },
        {
          accountId: '',
          accountCode: revenueAccount,
          accountName: donorType === 'individual' ? 'Bireysel Bağışlar' : 'Kurumsal Bağışlar',
          debitAmount: 0,
          creditAmount: baseAmount,
          description: `Bağış geliri - ${currency} ${amount}`,
        }
      ],
      totalDebit: baseAmount,
      totalCredit: baseAmount,
      isBalanced: true
    }

    await this.createJournalEntry(journalEntry)
  }

  static async recordAidPaymentEntry(aidId: string, amount: number, aidType: string): Promise<void> {
    const expenseAccount = '501' // Aid Payments
    const bankAccount = '102' // Bank - General Account

    const journalEntry: Omit<GeneralLedgerEntry, 'id' | 'created_at' | 'updated_at'> = {
      transactionDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      description: `Yardım ödemesi - ${aidType}`,
      documentType: 'payment',
      documentId: aidId,
      status: 'posted',
      createdBy: 'system',
      entries: [
        {
          accountId: '',
          accountCode: expenseAccount,
          accountName: 'Yardım Ödemeleri',
          debitAmount: amount,
          creditAmount: 0,
          description: `Yardım - ${aidType}`,
        },
        {
          accountId: '',
          accountCode: bankAccount,
          accountName: 'Banka - Genel Hesap',
          debitAmount: 0,
          creditAmount: amount,
          description: `Yardım ödemesi - ${aidType}`,
        }
      ],
      totalDebit: amount,
      totalCredit: amount,
      isBalanced: true
    }

    await this.createJournalEntry(journalEntry)
  }

  private static async getExchangeRate(currency: 'USD' | 'EUR'): Promise<number> {
    // In production, this would fetch real exchange rates
    // For now, return mock rates
    const rates = {
      'USD': 32.50,
      'EUR': 35.20
    }
    return rates[currency] || 1
  }

  // Financial Reports
  static async generateTrialBalance(asOfDate?: string): Promise<any[]> {
    const dateFilter = asOfDate || new Date().toISOString().split('T')[0]
    
    try {
      const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('isActive', true)
        .order('accountCode')

      if (error) throw error

      return accounts.map(account => ({
        accountCode: account.accountCode,
        accountName: account.accountNameTR,
        accountType: account.accountType,
        debitBalance: account.balanceType === 'debit' && account.currentBalance > 0 ? account.currentBalance : 0,
        creditBalance: account.balanceType === 'credit' && account.currentBalance > 0 ? account.currentBalance : 0,
        balance: account.currentBalance
      }))
    } catch (error) {
      console.error('Error generating trial balance:', error)
      return []
    }
  }

  static async generateIncomeStatement(startDate: string, endDate: string): Promise<any> {
    try {
      const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .in('accountType', ['gelir', 'gider'])
        .eq('isActive', true)

      if (error) throw error

      const revenues = accounts
        .filter(acc => acc.accountType === 'gelir')
        .reduce((sum, acc) => sum + acc.currentBalance, 0)

      const expenses = accounts
        .filter(acc => acc.accountType === 'gider')
        .reduce((sum, acc) => sum + acc.currentBalance, 0)

      return {
        totalRevenues: revenues,
        totalExpenses: expenses,
        netIncome: revenues - expenses,
        revenueAccounts: accounts.filter(acc => acc.accountType === 'gelir'),
        expenseAccounts: accounts.filter(acc => acc.accountType === 'gider'),
        periodStart: startDate,
        periodEnd: endDate
      }
    } catch (error) {
      console.error('Error generating income statement:', error)
      return null
    }
  }

  static async generateBalanceSheet(asOfDate?: string): Promise<any> {
    const dateFilter = asOfDate || new Date().toISOString().split('T')[0]
    
    try {
      const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .in('accountType', ['varlık', 'borç', 'öz_kaynak'])
        .eq('isActive', true)

      if (error) throw error

      const assets = accounts
        .filter(acc => acc.accountType === 'varlık')
        .reduce((sum, acc) => sum + acc.currentBalance, 0)

      const liabilities = accounts
        .filter(acc => acc.accountType === 'borç')
        .reduce((sum, acc) => sum + acc.currentBalance, 0)

      const equity = accounts
        .filter(acc => acc.accountType === 'öz_kaynak')
        .reduce((sum, acc) => sum + acc.currentBalance, 0)

      return {
        totalAssets: assets,
        totalLiabilities: liabilities,
        totalEquity: equity,
        asOfDate: dateFilter,
        assetAccounts: accounts.filter(acc => acc.accountType === 'varlık'),
        liabilityAccounts: accounts.filter(acc => acc.accountType === 'borç'),
        equityAccounts: accounts.filter(acc => acc.accountType === 'öz_kaynak')
      }
    } catch (error) {
      console.error('Error generating balance sheet:', error)
      return null
    }
  }

  // Budget Management
  static async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          ...budget,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Bütçe başarıyla oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating budget:', error)
      toast.error('Bütçe oluşturulamadı')
      return null
    }
  }

  static async getBudgets(): Promise<Budget[]> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('fiscalYear', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching budgets:', error)
      return []
    }
  }

  // Grant Management
  static async createGrant(grant: Omit<Grant, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('grants')
        .insert([{
          ...grant,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Hibe kaydı oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating grant:', error)
      toast.error('Hibe kaydı oluşturulamadı')
      return null
    }
  }

  static async getGrants(): Promise<Grant[]> {
    try {
      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .order('awardDate', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching grants:', error)
      return []
    }
  }
}
