import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation schemas
const donationSchema = z.object({
  donor_id: z.string().uuid(),
  donation_type_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('TRY'),
  description: z.string().optional(),
  donation_date: z.string().optional()
});

const donorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

const updateDonationSchema = donationSchema.partial();

// GET /donations - List all donations
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, donor_id } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('donations')
      .select(`
        *,
        donor:donors(*),
        donation_type:donation_types(*),
        payment_transactions(*)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (donor_id) {
      query = query.eq('donor_id', donor_id);
    }

    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1)
      .limit(Number(limit));

    if (error) {
      console.error('Error fetching donations:', error);
      return res.status(500).json({ error: 'Failed to fetch donations' });
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
    console.error('Error in donations list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /donations/:id - Get donation by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donor:donors(*),
        donation_type:donation_types(*),
        payment_transactions(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching donation:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Donation not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch donation' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in donation detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /donations - Create new donation
router.post('/', authenticateUser, validateRequest(donationSchema), async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('donations')
      .insert(donationData)
      .select(`
        *,
        donor:donors(*),
        donation_type:donation_types(*)
      `)
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      return res.status(400).json({ error: 'Failed to create donation' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in donation creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /donations/:id - Update donation
router.put('/:id', authenticateUser, validateRequest(updateDonationSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        donor:donors(*),
        donation_type:donation_types(*)
      `)
      .single();

    if (error) {
      console.error('Error updating donation:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Donation not found' });
      }
      return res.status(400).json({ error: 'Failed to update donation' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in donation update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /donations/:id - Delete donation
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if donation has related payment transactions
    const { data: transactions } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('donation_id', id);

    if (transactions && transactions.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete donation with existing payment transactions' 
      });
    }

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting donation:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Donation not found' });
      }
      return res.status(400).json({ error: 'Failed to delete donation' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in donation deletion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /donations/:id/payment - Process payment for donation
router.post('/:id/payment', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, transaction_id } = req.body;

    // Start transaction
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();

    if (donationError || !donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Create payment transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        donation_id: id,
        transaction_id,
        payment_method,
        amount: donation.amount,
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating payment transaction:', transactionError);
      return res.status(400).json({ error: 'Failed to process payment' });
    }

    // Update donation status
    const { error: updateError } = await supabase
      .from('donations')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating donation status:', updateError);
      return res.status(400).json({ error: 'Failed to update donation status' });
    }

    res.json({ transaction, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error in payment processing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /donors - List all donors
router.get('/donors', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('donors')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Error fetching donors:', error);
      return res.status(500).json({ error: 'Failed to fetch donors' });
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
    console.error('Error in donors list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /donors - Create new donor
router.post('/donors', authenticateUser, validateRequest(donorSchema), async (req, res) => {
  try {
    const donorData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('donors')
      .insert(donorData)
      .select()
      .single();

    if (error) {
      console.error('Error creating donor:', error);
      return res.status(400).json({ error: 'Failed to create donor' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in donor creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /donation-types - List all donation types
router.get('/donation-types', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donation_types')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching donation types:', error);
      return res.status(500).json({ error: 'Failed to fetch donation types' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in donation types list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
