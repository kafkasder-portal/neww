import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation schemas
const financialRecordSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'transfer']),
  category_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('TRY'),
  description: z.string().min(1),
  transaction_date: z.string().optional(),
  reference_number: z.string().optional(),
  account_from: z.string().optional(),
  account_to: z.string().optional(),
  payment_method: z.enum(['cash', 'bank_transfer', 'check', 'credit_card', 'online']).optional(),
  related_donation_id: z.string().uuid().optional(),
  related_aid_record_id: z.string().uuid().optional(),
  receipt_url: z.string().url().optional(),
  notes: z.string().optional()
});

const budgetCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parent_category_id: z.string().uuid().optional(),
  is_income: z.boolean().default(false),
  is_active: z.boolean().default(true)
});

const grantSchema = z.object({
  grant_name: z.string().min(1),
  grantor_name: z.string().min(1),
  grantor_contact_email: z.string().email().optional(),
  grantor_contact_phone: z.string().optional(),
  grant_amount: z.number().positive(),
  currency: z.string().length(3).default('TRY'),
  application_date: z.string().optional(),
  approval_date: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  purpose: z.string().optional(),
  reporting_requirements: z.string().optional(),
  conditions: z.string().optional(),
  manager_id: z.string().uuid().optional()
});

// GET /financial/records - List financial records
router.get('/records', authenticateUser, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      transaction_type, 
      category_id, 
      start_date, 
      end_date,
      is_approved 
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('financial_records')
      .select(`
        *,
        category:budget_categories(*),
        created_by_user:user_profiles!created_by(*),
        approved_by_user:user_profiles!approved_by(*)
      `, { count: 'exact' })
      .order('transaction_date', { ascending: false });

    // Apply filters
    if (transaction_type) {
      query = query.eq('transaction_type', transaction_type);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (start_date) {
      query = query.gte('transaction_date', start_date);
    }

    if (end_date) {
      query = query.lte('transaction_date', end_date);
    }

    if (is_approved !== undefined) {
      query = query.eq('is_approved', is_approved === 'true');
    }

    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Error fetching financial records:', error);
      return res.status(500).json({ error: 'Failed to fetch financial records' });
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
    console.error('Error in financial records list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /financial/records/:id - Get financial record by ID
router.get('/records/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('financial_records')
      .select(`
        *,
        category:budget_categories(*),
        created_by_user:user_profiles!created_by(*),
        approved_by_user:user_profiles!approved_by(*),
        related_donation:donations(*),
        related_aid_record:aid_records(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching financial record:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Financial record not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch financial record' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in financial record detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /financial/records - Create financial record
router.post('/records', authenticateUser, validateRequest(financialRecordSchema), async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('financial_records')
      .insert(recordData)
      .select(`
        *,
        category:budget_categories(*),
        created_by_user:user_profiles!created_by(*)
      `)
      .single();

    if (error) {
      console.error('Error creating financial record:', error);
      return res.status(400).json({ error: 'Failed to create financial record' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in financial record creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /financial/records/:id/approve - Approve financial record
router.put('/records/:id/approve', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('financial_records')
      .update({
        is_approved: true,
        approved_by: req.user.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        category:budget_categories(*),
        approved_by_user:user_profiles!approved_by(*)
      `)
      .single();

    if (error) {
      console.error('Error approving financial record:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Financial record not found' });
      }
      return res.status(400).json({ error: 'Failed to approve financial record' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in financial record approval:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /financial/categories - List budget categories
router.get('/categories', authenticateUser, async (req, res) => {
  try {
    const { is_income, is_active = true } = req.query;

    let query = supabase
      .from('budget_categories')
      .select(`
        *,
        parent_category:budget_categories!parent_category_id(*)
      `)
      .order('name');

    if (is_income !== undefined) {
      query = query.eq('is_income', is_income === 'true');
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching budget categories:', error);
      return res.status(500).json({ error: 'Failed to fetch budget categories' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in budget categories list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /financial/categories - Create budget category
router.post('/categories', authenticateUser, validateRequest(budgetCategorySchema), async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('budget_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating budget category:', error);
      return res.status(400).json({ error: 'Failed to create budget category' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in budget category creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /financial/summary - Financial summary report
router.get('/summary', authenticateUser, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    // Get total income and expenses
    const { data: summary, error: summaryError } = await supabase
      .rpc('get_financial_summary', {
        start_date: startDate,
        end_date: endDate
      });

    if (summaryError) {
      console.error('Error fetching financial summary:', summaryError);
      // Fallback to manual calculation if RPC doesn't exist
      const incomeQuery = supabase
        .from('financial_records')
        .select('amount')
        .eq('transaction_type', 'income')
        .eq('is_approved', true)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      const expenseQuery = supabase
        .from('financial_records')
        .select('amount')
        .eq('transaction_type', 'expense')
        .eq('is_approved', true)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      const [incomeResult, expenseResult] = await Promise.all([
        incomeQuery,
        expenseQuery
      ]);

      const totalIncome = incomeResult.data?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const totalExpenses = expenseResult.data?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;

      res.json({
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_balance: totalIncome - totalExpenses,
        period: { start_date: startDate, end_date: endDate }
      });
    } else {
      res.json(summary);
    }
  } catch (error) {
    console.error('Error in financial summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /financial/grants - List grants
router.get('/grants', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('grants')
      .select(`
        *,
        manager:user_profiles!manager_id(*),
        created_by_user:user_profiles!created_by(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Error fetching grants:', error);
      return res.status(500).json({ error: 'Failed to fetch grants' });
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
    console.error('Error in grants list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /financial/grants - Create grant
router.post('/grants', authenticateUser, validateRequest(grantSchema), async (req, res) => {
  try {
    const grantData = {
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('grants')
      .insert(grantData)
      .select(`
        *,
        manager:user_profiles!manager_id(*),
        created_by_user:user_profiles!created_by(*)
      `)
      .single();

    if (error) {
      console.error('Error creating grant:', error);
      return res.status(400).json({ error: 'Failed to create grant' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in grant creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
