import { supabase } from '@/lib/supabase'
import axios from 'axios'
import { toast } from 'sonner'

export interface Donation {
  id: string
  donor_name: string
  donor_email?: string
  donor_phone?: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  payment_method: 'credit_card' | 'bank_transfer' | 'cash' | 'crypto'
  payment_provider?: 'iyzico' | 'paytr'
  purpose?: string
  campaign?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  provider_transaction_id?: string
  processing_fee?: number
  net_amount?: number
  is_recurring: boolean
  recurring_period?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
}

export interface PaymentInitiationRequest {
  donation_id: string
  provider: 'iyzico' | 'paytr'
  amount: number
  currency?: string
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  callback_url?: string
}

export interface PaymentInitiationResponse {
  success: boolean
  payment_url?: string
  payment_token?: string
  checkout_form?: string
  transaction_id?: string
  error?: string
}

export class DonationService {
  private static baseUrl = '/api'

  /**
   * Create a new donation
   */
  static async createDonation(donationData: Omit<Donation, 'id' | 'created_at' | 'updated_at'>): Promise<Donation | null> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...donationData,
          net_amount: donationData.amount - (donationData.processing_fee || 0),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating donation:', error)
        toast.error('Bağış oluşturulamadı')
        return null
      }

      toast.success('Bağış başarıyla oluşturuldu')
      return data
    } catch (error) {
      console.error('Donation creation error:', error)
      toast.error('Bağış oluşturulurken hata oluştu')
      return null
    }
  }

  /**
   * Get all donations with filtering
   */
  static async getDonations(filters: {
    status?: string
    payment_method?: string
    from_date?: string
    to_date?: string
    page?: number
    limit?: number
  } = {}): Promise<Donation[]> {
    try {
      let query = supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.payment_method) {
        query = query.eq('payment_method', filters.payment_method)
      }

      if (filters.from_date) {
        query = query.gte('created_at', filters.from_date)
      }

      if (filters.to_date) {
        query = query.lte('created_at', filters.to_date)
      }

      if (filters.page && filters.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit - 1
        query = query.range(start, end)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching donations:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Donations fetch error:', error)
      return []
    }
  }

  /**
   * Update donation
   */
  static async updateDonation(donationId: string, updates: Partial<Donation>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId)

      if (error) {
        console.error('Error updating donation:', error)
        toast.error('Bağış güncellenemedi')
        return false
      }

      toast.success('Bağış başarıyla güncellendi')
      return true
    } catch (error) {
      console.error('Donation update error:', error)
      toast.error('Bağış güncellenirken hata oluştu')
      return false
    }
  }

  /**
   * Delete donation
   */
  static async deleteDonation(donationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', donationId)

      if (error) {
        console.error('Error deleting donation:', error)
        toast.error('Bağış silinemedi')
        return false
      }

      toast.success('Bağış başarıyla silindi')
      return true
    } catch (error) {
      console.error('Donation deletion error:', error)
      toast.error('Bağış silinirken hata oluştu')
      return false
    }
  }

  /**
   * Initiate payment for a donation
   */
  static async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/initiate`, request)
      
      if (response.data.success) {
        return {
          success: true,
          payment_url: response.data.payment_url,
          payment_token: response.data.payment_token,
          checkout_form: response.data.checkout_form,
          transaction_id: response.data.transaction_id
        }
      } else {
        return {
          success: false,
          error: response.data.error || 'Payment initiation failed'
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      return {
        success: false,
        error: 'Network error during payment initiation'
      }
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(provider: 'iyzico' | 'paytr', token: string, donationId: string): Promise<{
    success: boolean
    status?: string
    error?: string
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/verify`, {
        provider,
        token,
        donation_id: donationId
      })

      return {
        success: response.data.success,
        status: response.data.status,
        error: response.data.error
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        error: 'Payment verification failed'
      }
    }
  }

  /**
   * Get available payment providers
   */
  static async getPaymentProviders(): Promise<{
    providers: string[]
    default_provider: string
    currencies: string[]
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/payments/providers`)
      return response.data
    } catch (error) {
      console.error('Error fetching payment providers:', error)
      return {
        providers: [],
        default_provider: '',
        currencies: ['TRY']
      }
    }
  }

  /**
   * Process refund
   */
  static async processRefund(
    provider: 'iyzico' | 'paytr',
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/refund`, {
        provider,
        transaction_id: transactionId,
        amount,
        reason
      })

      if (response.data.success) {
        toast.success('İade işlemi başarıyla tamamlandı')
        return { success: true }
      } else {
        toast.error('İade işlemi başarısız: ' + response.data.error)
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error('Refund processing error:', error)
      toast.error('İade işleminde hata oluştu')
      return { success: false, error: 'Network error during refund' }
    }
  }

  /**
   * Get donation statistics
   */
  static async getDonationStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    total_amount: number
    total_count: number
    successful_count: number
    failed_count: number
    pending_count: number
    average_amount: number
    top_payment_method: string
  }> {
    try {
      const { data, error } = await supabase
        .rpc('get_donation_statistics', { period_type: period })

      if (error) {
        console.error('Error fetching donation stats:', error)
        return {
          total_amount: 0,
          total_count: 0,
          successful_count: 0,
          failed_count: 0,
          pending_count: 0,
          average_amount: 0,
          top_payment_method: 'credit_card'
        }
      }

      return data || {
        total_amount: 0,
        total_count: 0,
        successful_count: 0,
        failed_count: 0,
        pending_count: 0,
        average_amount: 0,
        top_payment_method: 'credit_card'
      }
    } catch (error) {
      console.error('Donation stats error:', error)
      return {
        total_amount: 0,
        total_count: 0,
        successful_count: 0,
        failed_count: 0,
        pending_count: 0,
        average_amount: 0,
        top_payment_method: 'credit_card'
      }
    }
  }

  /**
   * Create online donation with payment processing
   */
  static async createOnlineDonation(donationData: {
    donor_name: string
    donor_email: string
    donor_phone?: string
    amount: number
    currency?: string
    payment_provider: 'iyzico' | 'paytr'
    purpose?: string
    campaign?: string
    is_recurring?: boolean
    recurring_period?: string
  }): Promise<{
    success: boolean
    donation_id?: string
    payment_url?: string
    error?: string
  }> {
    try {
      // 1. Create donation record
      const donation = await this.createDonation({
        ...donationData,
        currency: (donationData.currency as 'TRY' | 'USD' | 'EUR') || 'TRY',
        payment_method: 'credit_card',
        payment_provider: donationData.payment_provider,
        status: 'pending',
        is_recurring: donationData.is_recurring || false,
        processing_fee: donationData.amount * 0.025, // %2.5 processing fee
        net_amount: donationData.amount * 0.975
      })

      if (!donation) {
        return { success: false, error: 'Failed to create donation record' }
      }

      // 2. Initiate payment
      const paymentResponse = await this.initiatePayment({
        donation_id: donation.id,
        provider: donationData.payment_provider,
        amount: donationData.amount,
        currency: donationData.currency || 'TRY',
        customer_email: donationData.donor_email,
        customer_name: donationData.donor_name,
        customer_phone: donationData.donor_phone,
        callback_url: `${process.env.APP_URL || window.location.origin}/donations/callback`
      })

      if (!paymentResponse.success) {
        // Update donation status to failed
        await this.updateDonation(donation.id, { status: 'failed' })
        return { 
          success: false, 
          error: paymentResponse.error || 'Payment initiation failed' 
        }
      }

      return {
        success: true,
        donation_id: donation.id,
        payment_url: paymentResponse.payment_url
      }

    } catch (error) {
      console.error('Online donation creation error:', error)
      return { 
        success: false, 
        error: 'Failed to create online donation' 
      }
    }
  }

  /**
   * Handle payment callback/verification
   */
  static async handlePaymentCallback(
    provider: 'iyzico' | 'paytr',
    token: string,
    donationId: string
  ): Promise<{ success: boolean; donation?: Donation; error?: string }> {
    try {
      // Verify payment with provider
      const verification = await this.verifyPayment(provider, token, donationId)

      if (!verification.success) {
        return { 
          success: false, 
          error: verification.error || 'Payment verification failed' 
        }
      }

      // Update donation status based on verification
      const updateData: Partial<Donation> = {
        status: verification.status === 'success' ? 'completed' : 'failed',
        provider_transaction_id: token,
        updated_at: new Date().toISOString()
      }

      const updateSuccess = await this.updateDonation(donationId, updateData)

      if (!updateSuccess) {
        return { success: false, error: 'Failed to update donation status' }
      }

      // Get updated donation
      const donations = await this.getDonations()
      const updatedDonation = donations.find(d => d.id === donationId)

      return { 
        success: true, 
        donation: updatedDonation 
      }

    } catch (error) {
      console.error('Payment callback handling error:', error)
      return { 
        success: false, 
        error: 'Payment callback processing failed' 
      }
    }
  }
}

// Export singleton service
export const donationService = DonationService
