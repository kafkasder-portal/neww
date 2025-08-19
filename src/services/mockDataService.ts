/**
 * Mock data service to provide fallback data when database tables are not available
 */

import type { ChartOfAccounts } from '@/types/accounting'
import type { Donor } from '@/types/donors'

export class MockDataService {
  // Mock Chart of Accounts
  static getMockChartOfAccounts(): ChartOfAccounts[] {
    return [
      {
        id: 'mock-1',
        accountCode: '101',
        accountName: 'Cash',
        accountNameTR: 'Kasa',
        accountType: 'varlık',
        accountTypeEN: 'asset',
        isActive: true,
        balanceType: 'debit',
        currentBalance: 50000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        accountCode: '102',
        accountName: 'Bank Account',
        accountNameTR: 'Banka Hesabı',
        accountType: 'varlık',
        accountTypeEN: 'asset',
        isActive: true,
        balanceType: 'debit',
        currentBalance: 150000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-3',
        accountCode: '401',
        accountName: 'Donations',
        accountNameTR: 'Bağışlar',
        accountType: 'gelir',
        accountTypeEN: 'revenue',
        isActive: true,
        balanceType: 'credit',
        currentBalance: 200000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-4',
        accountCode: '501',
        accountName: 'Aid Payments',
        accountNameTR: 'Yardım Ödemeleri',
        accountType: 'gider',
        accountTypeEN: 'expense',
        isActive: true,
        balanceType: 'debit',
        currentBalance: 80000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  // Mock Financial Reports
  static getMockTrialBalance() {
    return [
      {
        accountCode: '101',
        accountName: 'Kasa',
        accountType: 'varlık',
        debitBalance: 50000,
        creditBalance: 0,
        balance: 50000
      },
      {
        accountCode: '102',
        accountName: 'Banka Hesabı',
        accountType: 'varlık',
        debitBalance: 150000,
        creditBalance: 0,
        balance: 150000
      },
      {
        accountCode: '401',
        accountName: 'Bağışlar',
        accountType: 'gelir',
        debitBalance: 0,
        creditBalance: 200000,
        balance: 200000
      },
      {
        accountCode: '501',
        accountName: 'Yardım Ödemeleri',
        accountType: 'gider',
        debitBalance: 80000,
        creditBalance: 0,
        balance: 80000
      }
    ]
  }

  static getMockIncomeStatement() {
    return {
      totalRevenues: 200000,
      totalExpenses: 80000,
      netIncome: 120000,
      revenueAccounts: [
        {
          accountCode: '401',
          accountName: 'Bağışlar',
          currentBalance: 200000
        }
      ],
      expenseAccounts: [
        {
          accountCode: '501',
          accountName: 'Yardım Ödemeleri',
          currentBalance: 80000
        }
      ],
      periodStart: '2024-01-01',
      periodEnd: '2024-12-31'
    }
  }

  static getMockBalanceSheet() {
    return {
      totalAssets: 200000,
      totalLiabilities: 0,
      totalEquity: 200000,
      asOfDate: new Date().toISOString().split('T')[0],
      assetAccounts: [
        {
          accountCode: '101',
          accountName: 'Kasa',
          currentBalance: 50000
        },
        {
          accountCode: '102',
          accountName: 'Banka Hesabı',
          currentBalance: 150000
        }
      ],
      liabilityAccounts: [],
      equityAccounts: [
        {
          accountCode: '301',
          accountName: 'Öz Kaynak',
          currentBalance: 200000
        }
      ]
    }
  }

  // Mock Donors
  static getMockDonors(): Donor[] {
    return [
      {
        id: 'mock-donor-1',
        donorType: 'individual',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 555 123 4567',
        city: 'Istanbul',
        country: 'Turkey',
        donorTier: 'gold',
        totalDonated: 25000,
        lastDonationAmount: 1000,
        lastDonationDate: '2024-01-15',
        relationshipStatus: 'active',
        isActive: true,
        createdAt: '2023-01-01',
        updatedAt: '2024-01-15',
        createdBy: 'system'
      },
      {
        id: 'mock-donor-2',
        donorType: 'corporate',
        companyName: 'ABC Şirketi',
        firstName: 'Mehmet',
        lastName: 'Özkan',
        email: 'info@abc.com',
        phone: '+90 212 555 9876',
        city: 'Ankara',
        country: 'Turkey',
        donorTier: 'platinum',
        totalDonated: 150000,
        lastDonationAmount: 5000,
        lastDonationDate: '2024-01-20',
        relationshipStatus: 'active',
        isActive: true,
        createdAt: '2022-06-01',
        updatedAt: '2024-01-20',
        createdBy: 'system'
      }
    ]
  }

  // Mock Upcoming Tasks
  static getMockUpcomingTasks() {
    return [
      {
        id: 'mock-task-1',
        donorId: 'mock-donor-1',
        taskType: 'follow_up',
        title: 'Ahmet Yılmaz ile görüşme',
        description: 'Yeni bağış fırsatlarını değerlendirmek için görüşme ayarla',
        dueDate: '2024-01-25',
        status: 'pending',
        priority: 'high',
        assignedTo: 'user1',
        createdAt: '2024-01-15'
      },
      {
        id: 'mock-task-2',
        donorId: 'mock-donor-2',
        taskType: 'thank_you',
        title: 'ABC Şirketi teşekkür mektubu',
        description: 'Son bağış için teşekkür mektubu gönder',
        dueDate: '2024-01-22',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'user2',
        createdAt: '2024-01-20'
      }
    ]
  }

  // Check if we should use mock data
  static shouldUseMockData(): boolean {
    // You can add logic here to determine when to use mock data
    // For now, we'll use environment variable or default to false
    return process.env.NODE_ENV === 'development' && 
           localStorage.getItem('use_mock_data') === 'true'
  }
}
