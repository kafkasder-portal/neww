import { supabase } from '@lib/supabase'
import type { 
  RecurringDonation, 
  RecurringDonationPayment,
  RecurringDonationCampaign,
  RecurringDonationAnalytics,
  RecurringDonationDashboard,
  RecurringDonationFilters,
  SubscriptionManagement
} from '@/types/recurringDonations'
import { toast } from 'sonner'

export class RecurringDonationsService {
  // Recurring Donation Management
  static async createRecurringDonation(data: Omit<RecurringDonation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      // Calculate next process date based on frequency and start date
      const nextProcessDate = this.calculateNextProcessDate(data.startDate, data.frequency, data.intervalCount)

      const { data: created, error } = await supabase
        .from('recurring_donations')
        .insert([{
          ...data,
          nextProcessDate,
          totalCollected: 0,
          successfulPayments: 0,
          failedPayments: 0,
          retryCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Create first scheduled payment
      await this.scheduleNextPayment(created.id)

      toast.success('Düzenli bağış planı oluşturuldu')
      return created.id
    } catch (error) {
      console.error('Error creating recurring donation:', error)
      toast.error('Düzenli bağış planı oluşturulamadı')
      return null
    }
  }

  static async updateRecurringDonation(id: string, updates: Partial<RecurringDonation>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recurring_donations')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // If amount or frequency changed, update next payment
      if (updates.amount || updates.frequency) {
        await this.updateNextPayment(id)
      }

      toast.success('Düzenli bağış planı güncellendi')
      return true
    } catch (error) {
      console.error('Error updating recurring donation:', error)
      toast.error('Düzenli bağış planı güncellenemedi')
      return false
    }
  }

  static async pauseRecurringDonation(id: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recurring_donations')
        .update({
          status: 'paused',
          pauseReason: reason,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Cancel scheduled payments
      await this.cancelScheduledPayments(id)

      toast.success('Düzenli bağış planı durakladı')
      return true
    } catch (error) {
      console.error('Error pausing recurring donation:', error)
      toast.error('Düzenli bağış planı duraksatılamadı')
      return false
    }
  }

  static async resumeRecurringDonation(id: string): Promise<boolean> {
    try {
      const subscription = await this.getRecurringDonation(id)
      if (!subscription) return false

      const nextProcessDate = this.calculateNextProcessDate(
        new Date().toISOString().split('T')[0], 
        subscription.frequency, 
        subscription.intervalCount
      )

      const { error } = await supabase
        .from('recurring_donations')
        .update({
          status: 'active',
          pauseReason: null,
          nextProcessDate,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Schedule next payment
      await this.scheduleNextPayment(id)

      toast.success('Düzenli bağış planı yeniden başlatıldı')
      return true
    } catch (error) {
      console.error('Error resuming recurring donation:', error)
      toast.error('Düzenli bağış planı başlatılamadı')
      return false
    }
  }

  static async cancelRecurringDonation(id: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('recurring_donations')
        .update({
          status: 'cancelled',
          cancellationReason: reason,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Cancel all scheduled payments
      await this.cancelScheduledPayments(id)

      toast.success('Düzenli bağış planı iptal edildi')
      return true
    } catch (error) {
      console.error('Error cancelling recurring donation:', error)
      toast.error('Düzenli bağış planı iptal edilemedi')
      return false
    }
  }

  static async getRecurringDonation(id: string): Promise<RecurringDonation | null> {
    try {
      const { data, error } = await supabase
        .from('recurring_donations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching recurring donation:', error)
      return null
    }
  }

  static async searchRecurringDonations(filters: RecurringDonationFilters, page = 1, pageSize = 20): Promise<{ donations: RecurringDonation[], totalCount: number }> {
    try {
      let query = supabase
        .from('recurring_donations')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      if (filters.frequency && filters.frequency.length > 0) {
        query = query.in('frequency', filters.frequency)
      }

      if (filters.amountRange) {
        if (filters.amountRange.min !== undefined) {
          query = query.gte('amount', filters.amountRange.min)
        }
        if (filters.amountRange.max !== undefined) {
          query = query.lte('amount', filters.amountRange.max)
        }
      }

      if (filters.campaignId) {
        query = query.eq('campaignId', filters.campaignId)
      }

      if (filters.searchQuery) {
        // This would need to join with donors table for name search
        // For now, just search in subscription name
        query = query.ilike('subscriptionName', `%${filters.searchQuery}%`)
      }

      // Apply pagination and sorting
      const startIndex = (page - 1) * pageSize
      query = query
        .range(startIndex, startIndex + pageSize - 1)
        .order('createdAt', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        donations: data || [],
        totalCount: count || 0
      }
    } catch (error) {
      console.error('Error searching recurring donations:', error)
      return { donations: [], totalCount: 0 }
    }
  }

  // Payment Processing
  static async processScheduledPayments(): Promise<void> {
    try {
      // Get all payments scheduled for today or earlier
      const today = new Date().toISOString().split('T')[0]
      
      const { data: scheduledPayments, error } = await supabase
        .from('recurring_donation_payments')
        .select('*, recurring_donations(*)')
        .eq('status', 'scheduled')
        .lte('scheduledDate', today)

      if (error) throw error

      for (const payment of scheduledPayments || []) {
        await this.processPayment(payment.id)
      }
    } catch (error) {
      console.error('Error processing scheduled payments:', error)
    }
  }

  static async processPayment(paymentId: string): Promise<boolean> {
    try {
      // Update payment status to processing
      await supabase
        .from('recurring_donation_payments')
        .update({ 
          status: 'processing',
          updatedAt: new Date().toISOString()
        })
        .eq('id', paymentId)

      // Get payment and subscription details
      const { data: payment } = await supabase
        .from('recurring_donation_payments')
        .select('*, recurring_donations(*)')
        .eq('id', paymentId)
        .single()

      if (!payment) throw new Error('Payment not found')

      // Process payment with payment provider
      const paymentResult = await this.processWithPaymentProvider(payment)

      if (paymentResult.success) {
        // Update payment as completed
        await supabase
          .from('recurring_donation_payments')
          .update({
            status: 'completed',
            processedDate: new Date().toISOString(),
            paymentProviderTransactionId: paymentResult.transactionId,
            updatedAt: new Date().toISOString()
          })
          .eq('id', paymentId)

        // Update recurring donation statistics
        await this.updateRecurringDonationStats(payment.recurringDonationId, true)

        // Schedule next payment
        await this.scheduleNextPayment(payment.recurringDonationId)

        // Send success notification
        if (payment.recurring_donations.sendReceipts) {
          await this.sendPaymentReceipt(paymentId)
        }

        return true
      } else {
        // Handle payment failure
        await this.handlePaymentFailure(paymentId, paymentResult.error)
        return false
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      await this.handlePaymentFailure(paymentId, error.message)
      return false
    }
  }

  private static async processWithPaymentProvider(payment: any): Promise<{ success: boolean, transactionId?: string, error?: string }> {
    // Mock payment processing - in real implementation, integrate with payment providers
    // like Stripe, PayTR, Iyzico, etc.
    
    // Simulate random success/failure for demo
    const isSuccess = Math.random() > 0.1 // 90% success rate
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      const errors = [
        'Insufficient funds',
        'Card expired',
        'Invalid card number',
        'Bank declined transaction',
        'Network error'
      ]
      return {
        success: false,
        error: errors[Math.floor(Math.random() * errors.length)]
      }
    }
  }

  private static async handlePaymentFailure(paymentId: string, reason: string): Promise<void> {
    try {
      // Update payment as failed
      await supabase
        .from('recurring_donation_payments')
        .update({
          status: 'failed',
          failureReason: reason,
          updatedAt: new Date().toISOString()
        })
        .eq('id', paymentId)

      // Get payment details to update subscription
      const { data: payment } = await supabase
        .from('recurring_donation_payments')
        .select('*, recurring_donations(*)')
        .eq('id', paymentId)
        .single()

      if (payment) {
        // Update recurring donation statistics
        await this.updateRecurringDonationStats(payment.recurringDonationId, false)

        // Check if we should retry or pause subscription
        const subscription = payment.recurring_donations
        const newRetryCount = subscription.retryCount + 1

        if (newRetryCount < subscription.maxRetries) {
          // Schedule retry
          await supabase
            .from('recurring_donations')
            .update({
              retryCount: newRetryCount,
              lastFailureDate: new Date().toISOString().split('T')[0],
              lastFailureReason: reason,
              updatedAt: new Date().toISOString()
            })
            .eq('id', payment.recurringDonationId)

          // Schedule retry payment in 3 days
          const retryDate = new Date()
          retryDate.setDate(retryDate.getDate() + 3)
          
          await this.createScheduledPayment(
            payment.recurringDonationId,
            payment.amount,
            retryDate.toISOString().split('T')[0],
            newRetryCount + 1
          )
        } else {
          // Max retries reached, pause subscription
          await supabase
            .from('recurring_donations')
            .update({
              status: 'failed',
              lastFailureDate: new Date().toISOString().split('T')[0],
              lastFailureReason: reason,
              updatedAt: new Date().toISOString()
            })
            .eq('id', payment.recurringDonationId)

          // Send failure notification
          await this.sendPaymentFailureNotification(payment.recurringDonationId, reason)
        }
      }
    } catch (error) {
      console.error('Error handling payment failure:', error)
    }
  }

  // Scheduling and Calendar
  private static calculateNextProcessDate(currentDate: string, frequency: string, intervalCount: number): string {
    const date = new Date(currentDate)
    
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + (7 * intervalCount))
        break
      case 'monthly':
        date.setMonth(date.getMonth() + intervalCount)
        break
      case 'quarterly':
        date.setMonth(date.getMonth() + (3 * intervalCount))
        break
      case 'annually':
        date.setFullYear(date.getFullYear() + intervalCount)
        break
    }
    
    return date.toISOString().split('T')[0]
  }

  private static async scheduleNextPayment(recurringDonationId: string): Promise<void> {
    try {
      const subscription = await this.getRecurringDonation(recurringDonationId)
      if (!subscription || subscription.status !== 'active') return

      // Check if end date has passed
      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        await this.updateRecurringDonation(recurringDonationId, { status: 'completed' })
        return
      }

      await this.createScheduledPayment(
        recurringDonationId,
        subscription.amount,
        subscription.nextProcessDate,
        1
      )

      // Update next process date
      const nextDate = this.calculateNextProcessDate(
        subscription.nextProcessDate,
        subscription.frequency,
        subscription.intervalCount
      )

      await this.updateRecurringDonation(recurringDonationId, {
        nextProcessDate: nextDate,
        retryCount: 0
      })
    } catch (error) {
      console.error('Error scheduling next payment:', error)
    }
  }

  private static async createScheduledPayment(
    recurringDonationId: string, 
    amount: number, 
    scheduledDate: string, 
    attemptNumber: number
  ): Promise<void> {
    await supabase
      .from('recurring_donation_payments')
      .insert([{
        recurringDonationId,
        amount,
        currency: 'TRY', // Get from subscription
        baseAmount: amount, // Calculate with exchange rate if needed
        scheduledDate,
        attemptNumber,
        status: 'scheduled',
        receiptGenerated: false,
        receiptSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
  }

  private static async cancelScheduledPayments(recurringDonationId: string): Promise<void> {
    await supabase
      .from('recurring_donation_payments')
      .delete()
      .eq('recurringDonationId', recurringDonationId)
      .eq('status', 'scheduled')
  }

  private static async updateNextPayment(recurringDonationId: string): Promise<void> {
    // Cancel existing scheduled payments and create new ones with updated details
    await this.cancelScheduledPayments(recurringDonationId)
    await this.scheduleNextPayment(recurringDonationId)
  }

  private static async updateRecurringDonationStats(recurringDonationId: string, success: boolean): Promise<void> {
    const subscription = await this.getRecurringDonation(recurringDonationId)
    if (!subscription) return

    const updates: Partial<RecurringDonation> = {
      updatedAt: new Date().toISOString()
    }

    if (success) {
      updates.successfulPayments = subscription.successfulPayments + 1
      updates.totalCollected = subscription.totalCollected + subscription.amount
      updates.lastPaymentDate = new Date().toISOString().split('T')[0]
      updates.lastPaymentAmount = subscription.amount
    } else {
      updates.failedPayments = subscription.failedPayments + 1
    }

    await this.updateRecurringDonation(recurringDonationId, updates)
  }

  // Campaigns
  static async createCampaign(campaign: Omit<RecurringDonationCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('recurring_donation_campaigns')
        .insert([{
          ...campaign,
          raisedAmount: 0,
          subscriberCount: 0,
          activeSubscriberCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Düzenli bağış kampanyası oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Kampanya oluşturulamadı')
      return null
    }
  }

  static async getCampaigns(): Promise<RecurringDonationCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('recurring_donation_campaigns')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return []
    }
  }

  // Analytics and Dashboard
  static async getDashboardData(): Promise<RecurringDonationDashboard | null> {
    try {
      // Get basic statistics
      const { data: subscriptions } = await supabase
        .from('recurring_donations')
        .select('*')

      if (!subscriptions) return null

      const active = subscriptions.filter(s => s.status === 'active')
      const currentMonth = new Date().toISOString().slice(0, 7)
      
      const newThisMonth = subscriptions.filter(s => 
        s.createdAt.startsWith(currentMonth)
      ).length

      const churnThisMonth = subscriptions.filter(s => 
        s.status === 'cancelled' && s.updatedAt.startsWith(currentMonth)
      ).length

      // Calculate MRR (Monthly Recurring Revenue)
      const totalMRR = active.reduce((sum, s) => {
        let monthlyAmount = s.amount
        switch (s.frequency) {
          case 'weekly':
            monthlyAmount = s.amount * 4.33 // Average weeks per month
            break
          case 'quarterly':
            monthlyAmount = s.amount / 3
            break
          case 'annually':
            monthlyAmount = s.amount / 12
            break
        }
        return sum + monthlyAmount
      }, 0)

      // Get recent activities
      const { data: recentPayments } = await supabase
        .from('recurring_donation_payments')
        .select('*, recurring_donations(*)')
        .order('createdAt', { ascending: false })
        .limit(10)

      return {
        totalMRR,
        totalARR: totalMRR * 12,
        activeSubscriptions: active.length,
        newThisMonth,
        churnThisMonth,
        netGrowth: newThisMonth - churnThisMonth,
        averageAmount: active.length > 0 ? active.reduce((sum, s) => sum + s.amount, 0) / active.length : 0,
        paymentSuccessRate: 90, // Calculate from actual payment data
        upcomingPayments: 0, // Calculate from scheduled payments
        overduePayments: 0, // Calculate from failed payments
        recentSubscriptions: [], // Map from recent subscriptions
        recentPayments: [], // Map from recentPayments
        recentFailures: [], // Filter failed payments
        alerts: [] // Generate based on business rules
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return null
    }
  }

  // Notifications
  private static async sendPaymentReceipt(paymentId: string): Promise<void> {
    // Implementation for sending payment receipt via email/SMS
    console.log('Sending payment receipt for payment:', paymentId)
  }

  private static async sendPaymentFailureNotification(recurringDonationId: string, reason: string): Promise<void> {
    // Implementation for sending payment failure notification
    console.log('Sending payment failure notification for subscription:', recurringDonationId, 'Reason:', reason)
  }

  // Subscription Management Requests
  static async createSubscriptionChangeRequest(
    recurringDonationId: string,
    changeType: SubscriptionManagement['changeType'],
    newValue: any,
    reason?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_management')
        .insert([{
          recurringDonationId,
          changeType,
          newValue,
          reason,
          requestedDate: new Date().toISOString(),
          effectiveDate: new Date().toISOString(),
          requiresApproval: changeType === 'amount' && newValue > 10000, // Business rule
          status: 'pending',
          donorNotified: false,
          createdAt: new Date().toISOString(),
          createdBy: 'current-user-id'
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Değişiklik talebi oluşturuldu')
      return data.id
    } catch (error) {
      console.error('Error creating change request:', error)
      toast.error('Değişiklik talebi oluşturulamadı')
      return null
    }
  }
}
