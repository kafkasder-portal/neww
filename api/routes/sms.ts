import { Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { validateRequest } from '../middleware/validation';
import { supabase } from '../config/supabase';

const router = Router();

// NetGSM Configuration
const NETGSM_CONFIG = {
  baseUrl: 'https://api.netgsm.com.tr',
  username: process.env.NETGSM_USERNAME || '',
  password: process.env.NETGSM_PASSWORD || '',
  sender: process.env.NETGSM_SENDER || 'KAFKASDER',
  testMode: process.env.NODE_ENV !== 'production'
};

// Validation schemas
const sendSMSSchema = z.object({
  to: z.string().regex(/^(\+90|90|0)?[5][0-9]{9}$/, 'Invalid Turkish phone number'),
  message: z.string().min(1).max(1600),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  scheduleAt: z.string().datetime().optional()
});

const bulkSMSSchema = z.object({
  recipients: z.array(z.string().regex(/^(\+90|90|0)?[5][0-9]{9}$/)).min(1).max(1000),
  message: z.string().min(1).max(1600),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  scheduleAt: z.string().datetime().optional()
});

const templateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  variables: z.array(z.string()).optional(),
  category: z.string().optional()
});

// Helper functions
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '90' + cleaned.slice(1);
  } else if (!cleaned.startsWith('90')) {
    cleaned = '90' + cleaned;
  }
  
  return cleaned;
}

async function sendNetGSMSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (NETGSM_CONFIG.testMode) {
    console.log('TEST MODE - SMS would be sent to:', to, 'Message:', message);
    return { 
      success: true, 
      messageId: `test_${Date.now()}` 
    };
  }

  try {
    const response = await fetch(`${NETGSM_CONFIG.baseUrl}/sms/send/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        usercode: NETGSM_CONFIG.username,
        password: NETGSM_CONFIG.password,
        gsmno: to,
        message: message,
        msgheader: NETGSM_CONFIG.sender,
        filter: '0'
      })
    });

    const result = await response.text();
    
    if (result.startsWith('00')) {
      return { 
        success: true, 
        messageId: result.split(' ')[1] || `msg_${Date.now()}` 
      };
    } else {
      return { 
        success: false, 
        error: getNetGSMErrorMessage(result) 
      };
    }

  } catch (error) {
    return { 
      success: false, 
      error: 'Network error: ' + (error as Error).message 
    };
  }
}

function getNetGSMErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    '01': 'Mesaj gövdesi boş',
    '02': 'Kullanıcı adı ya da şifre hatalı',
    '03': 'Kullanıcı adı ya da şifre boş',
    '04': 'Müşteri aktif değil',
    '05': 'Müşteri SMS göndermeye yetkili değil',
    '06': 'Kredi yetersiz',
    '07': 'Gönderici adı sistemde bulunamadı',
    '08': 'Mesaj tipi tanımlanamadı',
    '09': 'Mesaj uzunluğu maximum karakter sayısını aşıyor',
    '10': 'Geçersiz telefon numarası',
    '11': 'Tekrarlayan mesaj',
    '12': 'Mesaj metni kara listede',
    '13': 'Mesaj gönderim tarihsaat formatı hatalı',
    '14': 'Optout olan numara'
  };

  return errorMessages[errorCode] || `Bilinmeyen hata: ${errorCode}`;
}

// Routes

/**
 * Send single SMS
 * POST /api/sms/send
 */
router.post('/send', 
  authenticateUser, 
  requirePermission('messages', 'send'),
  validateRequest(sendSMSSchema),
  async (req, res) => {
    try {
      const { to, message, templateId, templateVariables } = req.body;
      
      let finalMessage = message;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('sms_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'SMS template not found' });
        }

        finalMessage = template.content;
        if (templateVariables) {
          Object.entries(templateVariables).forEach(([key, value]) => {
            finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
        }
      }

      const formattedPhone = formatPhoneNumber(to);
      const result = await sendNetGSMSMS(formattedPhone, finalMessage);

      // Save to database
      const { data: smsRecord, error: dbError } = await supabase
        .from('sms_logs')
        .insert([{
          to: formattedPhone,
          message: finalMessage,
          status: result.success ? 'sent' : 'failed',
          provider_message_id: result.messageId,
          error_message: result.error,
          sent_by: req.user?.id,
          sent_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Error saving SMS log:', dbError);
      }

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
          smsId: smsRecord?.id
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('SMS send error:', error);
      res.status(500).json({ error: 'Failed to send SMS' });
    }
  }
);

/**
 * Send bulk SMS
 * POST /api/sms/bulk
 */
router.post('/bulk',
  authenticateUser,
  requirePermission('messages', 'bulk_send'),
  validateRequest(bulkSMSSchema),
  async (req, res) => {
    try {
      const { recipients, message, templateId, templateVariables } = req.body;
      
      let finalMessage = message;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('sms_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'SMS template not found' });
        }

        finalMessage = template.content;
        if (templateVariables) {
          Object.entries(templateVariables).forEach(([key, value]) => {
            finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
        }
      }

      const results = [];
      let successCount = 0;
      let failCount = 0;

      for (const recipient of recipients) {
        const formattedPhone = formatPhoneNumber(recipient);
        const result = await sendNetGSMSMS(formattedPhone, finalMessage);
        
        // Save to database
        const { data: smsRecord, error: dbError } = await supabase
          .from('sms_logs')
          .insert([{
            to: formattedPhone,
            message: finalMessage,
            status: result.success ? 'sent' : 'failed',
            provider_message_id: result.messageId,
            error_message: result.error,
            sent_by: req.user?.id,
            sent_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (dbError) {
          console.error('Error saving SMS log:', dbError);
        }

        results.push({
          recipient: formattedPhone,
          success: result.success,
          messageId: result.messageId,
          smsId: smsRecord?.id,
          error: result.error
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }

        // Rate limiting - 1 second between messages
        if (recipients.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      res.json({
        success: true,
        total: recipients.length,
        successful: successCount,
        failed: failCount,
        results
      });

    } catch (error) {
      console.error('Bulk SMS error:', error);
      res.status(500).json({ error: 'Failed to send bulk SMS' });
    }
  }
);

/**
 * Get SMS logs
 * GET /api/sms/logs
 */
router.get('/logs',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, status, from_date, to_date } = req.query;
      
      let query = supabase
        .from('sms_logs')
        .select(`
          *,
          sender:user_profiles!sms_logs_sent_by_fkey(full_name)
        `)
        .order('sent_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (from_date) {
        query = query.gte('sent_at', from_date);
      }

      if (to_date) {
        query = query.lte('sent_at', to_date);
      }

      const offset = ((page as number) - 1) * (limit as number);
      query = query.range(offset, offset + (limit as number) - 1);

      const { data: logs, error } = await query;

      if (error) {
        console.error('Error fetching SMS logs:', error);
        return res.status(500).json({ error: 'Failed to fetch SMS logs' });
      }

      res.json({ data: logs || [] });

    } catch (error) {
      console.error('SMS logs error:', error);
      res.status(500).json({ error: 'Failed to fetch SMS logs' });
    }
  }
);

/**
 * Get SMS balance
 * GET /api/sms/balance
 */
router.get('/balance',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      if (NETGSM_CONFIG.testMode) {
        return res.json({ balance: 1000, currency: 'TRY' });
      }

      const response = await fetch(`${NETGSM_CONFIG.baseUrl}/balance/list/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          usercode: NETGSM_CONFIG.username,
          password: NETGSM_CONFIG.password
        })
      });

      const balance = await response.text();
      
      res.json({ 
        balance: parseFloat(balance) || 0, 
        currency: 'TRY' 
      });

    } catch (error) {
      console.error('Balance check error:', error);
      res.status(500).json({ error: 'Failed to check SMS balance' });
    }
  }
);

/**
 * Get SMS templates
 * GET /api/sms/templates
 */
router.get('/templates',
  authenticateUser,
  async (req, res) => {
    try {
      const { data: templates, error } = await supabase
        .from('sms_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching SMS templates:', error);
        return res.status(500).json({ error: 'Failed to fetch SMS templates' });
      }

      res.json({ data: templates || [] });

    } catch (error) {
      console.error('SMS templates error:', error);
      res.status(500).json({ error: 'Failed to fetch SMS templates' });
    }
  }
);

/**
 * Create SMS template
 * POST /api/sms/templates
 */
router.post('/templates',
  authenticateUser,
  requirePermission('messages', 'templates'),
  validateRequest(templateSchema),
  async (req, res) => {
    try {
      const { name, content, variables = [], category = 'general' } = req.body;

      const { data: template, error } = await supabase
        .from('sms_templates')
        .insert([{
          name,
          content,
          variables,
          category,
          is_active: true,
          created_by: req.user?.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating SMS template:', error);
        return res.status(400).json({ error: 'Failed to create SMS template' });
      }

      res.status(201).json({ 
        success: true, 
        template 
      });

    } catch (error) {
      console.error('SMS template creation error:', error);
      res.status(500).json({ error: 'Failed to create SMS template' });
    }
  }
);

/**
 * Get SMS statistics
 * GET /api/sms/stats
 */
router.get('/stats',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { from_date, to_date } = req.query;
      
      let query = supabase
        .from('sms_logs')
        .select('status, created_at');

      if (from_date) {
        query = query.gte('sent_at', from_date);
      }

      if (to_date) {
        query = query.lte('sent_at', to_date);
      }

      const { data: logs, error } = await query;

      if (error) {
        console.error('Error fetching SMS stats:', error);
        return res.status(500).json({ error: 'Failed to fetch SMS statistics' });
      }

      const stats = {
        total: logs?.length || 0,
        sent: logs?.filter(log => log.status === 'sent').length || 0,
        delivered: logs?.filter(log => log.status === 'delivered').length || 0,
        failed: logs?.filter(log => log.status === 'failed').length || 0,
        pending: logs?.filter(log => log.status === 'pending').length || 0
      };

      stats.successRate = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;

      res.json({ stats });

    } catch (error) {
      console.error('SMS stats error:', error);
      res.status(500).json({ error: 'Failed to fetch SMS statistics' });
    }
  }
);

export default router;
