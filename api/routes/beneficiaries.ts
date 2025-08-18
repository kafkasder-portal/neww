import { Router, type Request, type Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Middleware to extract user from authorization header
const authenticateUser = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as any).user = user;
  next();
};

// GET /api/beneficiaries - Get all beneficiaries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data: beneficiaries, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching beneficiaries:', error);
      return res.status(500).json({ error: 'Failed to fetch beneficiaries' });
    }

    res.json(beneficiaries);
  } catch (error) {
    console.error('Error in beneficiaries route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/beneficiaries/:id - Get single beneficiary
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: beneficiary, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching beneficiary:', error);
      return res.status(500).json({ error: 'Failed to fetch beneficiary' });
    }

    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    res.json(beneficiary);
  } catch (error) {
    console.error('Error in beneficiary route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/beneficiaries - Create new beneficiary
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const beneficiaryData = req.body;
    
    const { data: beneficiary, error } = await supabase
      .from('beneficiaries')
      .insert([beneficiaryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating beneficiary:', error);
      return res.status(500).json({ error: 'Failed to create beneficiary' });
    }

    res.status(201).json(beneficiary);
  } catch (error) {
    console.error('Error in create beneficiary route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/beneficiaries/:id - Update beneficiary
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data: beneficiary, error } = await supabase
      .from('beneficiaries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating beneficiary:', error);
      return res.status(500).json({ error: 'Failed to update beneficiary' });
    }

    res.json(beneficiary);
  } catch (error) {
    console.error('Error in update beneficiary route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/beneficiaries/:id - Delete beneficiary
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('beneficiaries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting beneficiary:', error);
      return res.status(500).json({ error: 'Failed to delete beneficiary' });
    }

    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Error in delete beneficiary route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;