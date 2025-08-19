import { Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { auditResourceOperation } from '../middleware/audit.js';
import { validateRequest } from '../middleware/validation.js';
import { TurkishPaymentService } from '../services/paymentGateway.js';
import { supabase } from '../config/supabase.js';

const router = Router();
const paymentService = new TurkishPaymentService();

// Validation schemas
const initiatePaymentSchema = z.object({
  provider: z.enum(['iyzico', 'paytr']),
  donation_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('TRY'),
  customer_email: z.string().email().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  description: z.string().optional(),
  callback_url: z.string().url().optional()
});

const verifyPaymentSchema = z.object({
  provider: z.enum(['iyzico', 'paytr']),
  token: z.string(),
  donation_id: z.string().uuid()
});

const refundPaymentSchema = z.object({
  provider: z.enum(['iyzico', 'paytr']),
  transaction_id: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional()
});

// GET /payments/providers - Get available payment providers
router.get('/providers', authenticateUser, async (req, res) => {
  try {
    const providers = paymentService.getAvailableProviders();
    res.json({
      providers,
      default_provider: providers.includes('iyzico') ? 'iyzico' : providers[0],
      currencies: ['TRY', 'USD', 'EUR']
    });
  } catch (error) {
    console.error('Error fetching payment providers:', error);
    res.status(500).json({ error: 'Failed to fetch payment providers' });
  }
});

// POST /payments/initiate - Initiate payment
router.post('/initiate', 
  authenticateUser,
  requirePermission('donations', 'process_payment'),
  validateRequest(initiatePaymentSchema),
  auditResourceOperation('payment'),
  async (req, res) => {
    try {
      const {
        provider,
        donation_id,
        amount,
        currency,
        customer_email,
        customer_name,
        customer_phone,
        description,
        callback_url
      } = req.body;

      // Verify donation exists and user has permission
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .select('*')
        .eq('id', donation_id)
        .single();

      if (donationError || !donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      // Check if donation amount matches
      if (donation.amount !== amount) {
        return res.status(400).json({ 
          error: 'Payment amount does not match donation amount' 
        });
      }

      // Check if donation is already processed
      if (donation.status === 'completed') {
        return res.status(400).json({ 
          error: 'Donation has already been processed' 
        });
      }

      // Generate unique order ID
      const orderId = `DON_${donation_id}_${Date.now()}`;

      // Prepare payment request
      const paymentRequest = {
        amount,
        currency: currency || 'TRY',
        orderId,
        customerEmail: customer_email,
        customerName: customer_name,
        customerPhone: customer_phone,
        description: description || `Donation #${donation.id}`,
        callbackUrl: callback_url || `${process.env.APP_URL}/api/payments/callback`,
        metadata: {
          donation_id,
          user_id: req.user?.id,
          created_at: new Date().toISOString()
        }
      };

      // Initiate payment with selected provider
      const paymentResponse = await paymentService.processPayment(provider, paymentRequest);

      if (!paymentResponse.success) {
        return res.status(400).json({
          error: 'Payment initiation failed',
          details: paymentResponse.errorMessage
        });
      }

      // Create payment transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          donation_id,
          transaction_id: paymentResponse.transactionId || paymentResponse.token,
          payment_method: provider,
          amount,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating payment transaction:', transactionError);
        return res.status(500).json({ error: 'Failed to create payment record' });
      }

      // Update donation status
      await supabase
        .from('donations')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', donation_id);

      res.json({
        success: true,
        transaction_id: transaction.id,
        payment_token: paymentResponse.token,
        payment_url: paymentResponse.paymentUrl,
        checkout_form: paymentResponse.checkoutFormContent,
        provider,
        order_id: orderId
      });

    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ error: 'Payment initiation failed' });
    }
  }
);

// POST /payments/verify - Verify payment
router.post('/verify',
  authenticateUser,
  validateRequest(verifyPaymentSchema),
  auditResourceOperation('payment_verification'),
  async (req, res) => {
    try {
      const { provider, token, donation_id } = req.body;

      // Get payment transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('donation_id', donation_id)
        .eq('transaction_id', token)
        .single();

      if (transactionError || !transaction) {
        return res.status(404).json({ error: 'Payment transaction not found' });
      }

      // Verify payment with provider
      const verification = await paymentService.verifyPayment(provider, token);

      let transactionStatus = 'failed';
      let donationStatus = 'cancelled';

      if (verification.success && verification.status === 'completed') {
        transactionStatus = 'completed';
        donationStatus = 'completed';
      }

      // Update payment transaction
      const { error: updateTransactionError } = await supabase
        .from('payment_transactions')
        .update({
          status: transactionStatus,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateTransactionError) {
        console.error('Error updating payment transaction:', updateTransactionError);
        return res.status(500).json({ error: 'Failed to update payment status' });
      }

      // Update donation status
      const { error: updateDonationError } = await supabase
        .from('donations')
        .update({
          status: donationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', donation_id);

      if (updateDonationError) {
        console.error('Error updating donation status:', updateDonationError);
        return res.status(500).json({ error: 'Failed to update donation status' });
      }

      // If payment successful, create financial record
      if (verification.success && verification.status === 'completed') {
        await supabase
          .from('financial_records')
          .insert({
            transaction_type: 'income',
            amount: verification.amount,
            currency: verification.currency,
            description: `Donation payment - ${donation_id}`,
            transaction_date: new Date().toISOString().split('T')[0],
            reference_number: verification.transactionId,
            payment_method: provider,
            related_donation_id: donation_id,
            is_approved: true,
            approved_by: req.user?.id,
            approved_at: new Date().toISOString(),
            created_by: req.user?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      res.json({
        success: verification.success,
        status: verification.status,
        transaction_id: verification.transactionId,
        amount: verification.amount,
        currency: verification.currency,
        message: verification.success 
          ? 'Payment completed successfully' 
          : verification.errorMessage || 'Payment failed'
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  }
);

// POST /payments/refund - Refund payment
router.post('/refund',
  authenticateUser,
  requirePermission('financial', 'approve'),
  validateRequest(refundPaymentSchema),
  auditResourceOperation('payment_refund'),
  async (req, res) => {
    try {
      const { provider, transaction_id, amount, reason } = req.body;

      // Get payment transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('transaction_id', transaction_id)
        .single();

      if (transactionError || !transaction) {
        return res.status(404).json({ error: 'Payment transaction not found' });
      }

      if (transaction.status !== 'completed') {
        return res.status(400).json({ 
          error: 'Cannot refund transaction that is not completed' 
        });
      }

      // Process refund with payment provider
      const refundResponse = await paymentService.refundPayment(
        provider, 
        transaction_id, 
        amount
      );

      if (!refundResponse.success) {
        return res.status(400).json({
          error: 'Refund failed',
          details: refundResponse.errorMessage
        });
      }

      // Create refund record
      const { data: refundRecord, error: refundError } = await supabase
        .from('payment_transactions')
        .insert({
          donation_id: transaction.donation_id,
          transaction_id: refundResponse.transactionId || `REFUND_${transaction_id}`,
          payment_method: provider,
          amount: -(amount || transaction.amount),
          status: 'completed',
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (refundError) {
        console.error('Error creating refund record:', refundError);
        return res.status(500).json({ error: 'Failed to create refund record' });
      }

      // Create financial record for refund
      await supabase
        .from('financial_records')
        .insert({
          transaction_type: 'expense',
          amount: amount || transaction.amount,
          currency: 'TRY',
          description: `Refund for donation - ${transaction.donation_id}. Reason: ${reason || 'Not specified'}`,
          transaction_date: new Date().toISOString().split('T')[0],
          reference_number: refundResponse.transactionId,
          payment_method: provider,
          related_donation_id: transaction.donation_id,
          is_approved: true,
          approved_by: req.user?.id,
          approved_at: new Date().toISOString(),
          created_by: req.user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      res.json({
        success: true,
        refund_id: refundRecord.id,
        refund_amount: amount || transaction.amount,
        message: 'Refund processed successfully'
      });

    } catch (error) {
      console.error('Payment refund error:', error);
      res.status(500).json({ error: 'Refund processing failed' });
    }
  }
);

// POST /payments/callback - Payment callback (webhook)
router.post('/callback/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const callbackData = req.body;

    // Log callback for debugging
    console.log(`Payment callback from ${provider}:`, callbackData);

    // Process callback based on provider
    let isValid = false;
    let transactionData = null;

    if (provider === 'iyzico') {
      // İyzico callback processing
      const { token } = callbackData;
      if (token) {
        const verification = await paymentService.verifyPayment(provider, token);
        if (verification.success) {
          isValid = true;
          transactionData = verification;
        }
      }
    } else if (provider === 'paytr') {
      // PayTR callback processing
      // Implement PayTR-specific callback verification
      isValid = true;
      transactionData = callbackData;
    }

    if (isValid && transactionData) {
      // Update transaction and donation status
      // This logic should match the verify endpoint
      res.status(200).send('OK');
    } else {
      res.status(400).send('Invalid callback');
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).send('Callback processing failed');
  }
});

// GET /payments/transactions - List payment transactions
router.get('/transactions',
  authenticateUser,
  requirePermission('financial', 'read'),
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        donation_id,
        start_date,
        end_date 
      } = req.query;
      
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabase
        .from('payment_transactions')
        .select(`
          *,
          donation:donations(
            id,
            amount,
            currency,
            description,
            donor:donors(name, email)
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (donation_id) {
        query = query.eq('donation_id', donation_id);
      }

      if (start_date) {
        query = query.gte('created_at', start_date);
      }

      if (end_date) {
        query = query.lte('created_at', end_date);
      }

      const { data, error, count } = await query
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        console.error('Error fetching payment transactions:', error);
        return res.status(500).json({ error: 'Failed to fetch payment transactions' });
      }

      res.json({
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error in payment transactions list:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
