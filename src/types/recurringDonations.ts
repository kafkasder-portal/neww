// Recurring Donations Types for Charity Management System

export interface RecurringDonation {
  id: string
  donorId: string
  
  // Subscription Details
  subscriptionName: string
  description?: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  
  // Frequency and Scheduling
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  intervalCount: number // e.g., every 2 months = monthly + intervalCount=2
  startDate: string
  endDate?: string // Optional end date
  nextProcessDate: string
  
  // Payment Information
  paymentMethod: 'credit_card' | 'bank_transfer' | 'direct_debit' | 'mobile_payment'
  paymentDetails: {
    cardToken?: string
    bankAccountIban?: string
    mobilePaymentProvider?: string
    paymentProviderSubscriptionId?: string
  }
  
  // Status and Lifecycle
  status: 'active' | 'paused' | 'cancelled' | 'failed' | 'completed'
  pauseReason?: string
  cancellationReason?: string
  retryCount: number
  maxRetries: number
  
  // Tracking and Statistics
  totalCollected: number
  successfulPayments: number
  failedPayments: number
  lastPaymentDate?: string
  lastPaymentAmount?: number
  lastFailureDate?: string
  lastFailureReason?: string
  
  // Donor Communication
  sendReceipts: boolean
  sendReminders: boolean
  reminderDaysBefore: number
  
  // Tax and Legal
  isTaxDeductible: boolean
  generateTaxReceipts: boolean
  
  // Additional Settings
  allowAmountChanges: boolean
  allowFrequencyChanges: boolean
  allowPausing: boolean
  
  // Campaign Association
  campaignId?: string
  fundId?: string
  projectId?: string
  
  // System Fields
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface RecurringDonationPayment {
  id: string
  recurringDonationId: string
  
  // Payment Details
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  exchangeRate?: number
  baseAmount: number // Amount in organization's base currency
  
  // Processing Information
  scheduledDate: string
  processedDate?: string
  attemptNumber: number
  
  // Payment Provider Response
  paymentProviderTransactionId?: string
  paymentProviderResponse?: any
  
  // Status and Results
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'refunded'
  failureReason?: string
  
  // Financial Records
  donationId?: string // Links to main donations table
  receiptGenerated: boolean
  receiptSent: boolean
  
  // System Fields
  createdAt: string
  updatedAt: string
}

export interface RecurringDonationReminder {
  id: string
  recurringDonationId: string
  
  // Reminder Details
  reminderType: 'upcoming_payment' | 'payment_failed' | 'payment_success' | 'subscription_ending'
  scheduledDate: string
  sentDate?: string
  
  // Communication
  recipientEmail: string
  recipientPhone?: string
  subject: string
  message: string
  communicationChannel: 'email' | 'sms' | 'whatsapp' | 'push_notification'
  
  // Status
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled'
  failureReason?: string
  
  // Tracking
  opened: boolean
  clicked: boolean
  openedAt?: string
  clickedAt?: string
  
  createdAt: string
}

export interface RecurringDonationCampaign {
  id: string
  name: string
  description: string
  
  // Campaign Details
  campaignType: 'general' | 'emergency' | 'project_specific' | 'memorial' | 'seasonal'
  targetAmount?: number
  raisedAmount: number
  subscriberCount: number
  activeSubscriberCount: number
  
  // Suggested Amounts and Frequencies
  suggestedAmounts: number[]
  suggestedFrequencies: ('weekly' | 'monthly' | 'quarterly' | 'annually')[]
  defaultAmount?: number
  defaultFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  
  // Campaign Period
  startDate: string
  endDate?: string
  
  // Incentives and Benefits
  perks: RecurringDonationPerk[]
  
  // Communication Settings
  welcomeEmailTemplate?: string
  reminderEmailTemplate?: string
  thankyouEmailTemplate?: string
  
  // Status
  status: 'draft' | 'active' | 'paused' | 'completed'
  
  // Analytics
  conversionRate?: number
  averageSubscriptionValue?: number
  churnRate?: number
  
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface RecurringDonationPerk {
  id: string
  campaignId: string
  name: string
  description: string
  minimumAmount: number
  minimumFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  benefits: string[]
  isActive: boolean
  sortOrder: number
}

export interface SubscriptionManagement {
  id: string
  recurringDonationId: string
  
  // Change Request Details
  changeType: 'amount' | 'frequency' | 'payment_method' | 'pause' | 'cancel'
  requestedDate: string
  effectiveDate: string
  
  // Change Details
  oldValue?: any
  newValue?: any
  reason?: string
  
  // Approval Workflow
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'applied'
  
  // Communication
  donorNotified: boolean
  notificationSentAt?: string
  
  createdAt: string
  createdBy: string
}

export interface RecurringDonationAnalytics {
  // Overview Metrics
  totalActiveSubscriptions: number
  totalMonthlyRecurringRevenue: number
  averageSubscriptionValue: number
  newSubscriptionsThisMonth: number
  churnedSubscriptionsThisMonth: number
  
  // Retention Metrics
  churnRate: number // Monthly churn rate
  retentionRate: number
  averageLifetimeValue: number
  paymentSuccessRate: number
  
  // Growth Metrics
  monthOverMonthGrowth: number
  yearOverYearGrowth: number
  conversionRateFromOneTime: number
  
  // Frequency Analysis
  frequencyDistribution: {
    weekly: number
    monthly: number
    quarterly: number
    annually: number
  }
  
  // Amount Analysis
  amountRanges: {
    range: string // "0-100", "100-500", etc.
    count: number
    totalAmount: number
  }[]
  
  // Failure Analysis
  paymentFailureReasons: {
    reason: string
    count: number
    percentage: number
  }[]
  
  // Trends
  monthlyTrends: {
    month: string
    newSubscriptions: number
    cancelledSubscriptions: number
    totalRevenue: number
    activeCount: number
  }[]
  
  // Performance by Campaign
  campaignPerformance: {
    campaignId: string
    campaignName: string
    subscriberCount: number
    totalRevenue: number
    averageAmount: number
    churnRate: number
  }[]
  
  lastCalculated: string
}

export interface RecurringDonationDashboard {
  // Key Metrics
  totalMRR: number // Monthly Recurring Revenue
  totalARR: number // Annual Recurring Revenue
  activeSubscriptions: number
  newThisMonth: number
  churnThisMonth: number
  netGrowth: number
  
  // Quick Stats
  averageAmount: number
  paymentSuccessRate: number
  upcomingPayments: number
  overduePayments: number
  
  // Recent Activity
  recentSubscriptions: {
    id: string
    donorName: string
    amount: number
    frequency: string
    startDate: string
  }[]
  
  recentPayments: {
    id: string
    donorName: string
    amount: number
    status: string
    processedDate: string
  }[]
  
  recentFailures: {
    id: string
    donorName: string
    amount: number
    reason: string
    failedDate: string
  }[]
  
  // Alerts and Notifications
  alerts: {
    type: 'payment_failure' | 'subscription_ending' | 'high_churn' | 'processing_issue'
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    count: number
    actionRequired: boolean
  }[]
}

// Form and UI Types
export interface RecurringDonationForm {
  // Donor Information
  donorId?: string
  newDonor?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  
  // Donation Details
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  startDate: string
  endDate?: string
  
  // Payment Information
  paymentMethod: 'credit_card' | 'bank_transfer' | 'direct_debit'
  paymentDetails: any
  
  // Preferences
  sendReceipts: boolean
  sendReminders: boolean
  allowChanges: boolean
  
  // Campaign Association
  campaignId?: string
  
  // Terms and Conditions
  acceptedTerms: boolean
  kvkkConsent: boolean
}

export interface RecurringDonationFilters {
  status?: ('active' | 'paused' | 'cancelled' | 'failed')[]
  frequency?: ('weekly' | 'monthly' | 'quarterly' | 'annually')[]
  amountRange?: {
    min?: number
    max?: number
  }
  dateRange?: {
    start?: string
    end?: string
  }
  campaignId?: string
  paymentMethod?: ('credit_card' | 'bank_transfer' | 'direct_debit')[]
  searchQuery?: string
}

// Payment Provider Integration Types
export interface PaymentProviderConfig {
  providerId: string
  providerName: string
  apiKey: string
  apiSecret: string
  webhookSecret: string
  sandboxMode: boolean
  supportedCurrencies: string[]
  supportedPaymentMethods: string[]
  fees: {
    percentage: number
    fixedAmount: number
    currency: string
  }
  isActive: boolean
}

export interface PaymentWebhook {
  id: string
  providerId: string
  eventType: string
  eventData: any
  recurringDonationId?: string
  paymentId?: string
  processedAt?: string
  status: 'pending' | 'processed' | 'failed'
  retryCount: number
  createdAt: string
}

// Utility Types
export type RecurringDonationStatus = RecurringDonation['status']
export type PaymentStatus = RecurringDonationPayment['status']
export type ReminderType = RecurringDonationReminder['reminderType']
export type ChangeType = SubscriptionManagement['changeType']

export interface RecurringDonationValidationError {
  field: string
  message: string
}

export interface BulkOperationResult {
  success: boolean
  processedCount: number
  successCount: number
  failureCount: number
  errors: {
    id: string
    error: string
  }[]
}
