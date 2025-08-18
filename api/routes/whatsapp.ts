import { Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth.ts';
import { requirePermission } from '../middleware/rbac.ts';
import { validateRequest } from '../middleware/validation.ts';
import { supabase } from '../config/supabase.ts';

const router = Router();

// WhatsApp Business API Configuration
const WHATSAPP_CONFIG = {
  apiUrl: 'https://graph.facebook.com/v18.0',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
  testMode: process.env.NODE_ENV !== 'production'
};

// Validation schemas
const sendWhatsAppSchema = z.object({
  to: z.string().regex(/^(\+90|90|0)?[5][0-9]{9}$/, 'Invalid Turkish phone number'),
  message: z.string().min(1),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(['image', 'video', 'audio', 'document']).optional(),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional()
});

const bulkWhatsAppSchema = z.object({
  recipients: z.array(z.string().regex(/^(\+90|90|0)?[5][0-9]{9}$/)).min(1).max(100),
  message: z.string().min(1),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(['image', 'video', 'audio', 'document']).optional(),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional()
});

const whatsappTemplateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  mediaUrl: z.string().url().optional(),
  variables: z.array(z.string()).optional(),
  category: z.string().optional()
});

// Helper functions
function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '90' + cleaned.slice(1);
  } else if (!cleaned.startsWith('90')) {
    cleaned = '90' + cleaned;
  }
  
  return cleaned;
}

async function sendWhatsAppBusinessMessage(
  to: string, 
  message: string, 
  mediaUrl?: string, 
  mediaType?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  
  if (WHATSAPP_CONFIG.testMode || !WHATSAPP_CONFIG.accessToken) {
    console.log('TEST MODE - WhatsApp message would be sent:', { to, message, mediaUrl, mediaType });
    return { 
      success: true, 
      messageId: `test_wa_${Date.now()}` 
    };
  }

  try {
    const url = `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
    
    let messageData: any = {
      messaging_product: 'whatsapp',
      to: to,
      type: mediaUrl ? mediaType || 'image' : 'text'
    };

    if (mediaUrl) {
      messageData[mediaType || 'image'] = {
        link: mediaUrl,
        caption: message
      };
    } else {
      messageData.text = {
        body: message
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
    
    if (response.ok && result.messages) {
      return { 
        success: true, 
        messageId: result.messages[0].id 
      };
    } else {
      return { 
        success: false, 
        error: result.error?.message || 'WhatsApp API error' 
      };
    }

  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return { 
      success: false, 
      error: 'Network error: ' + (error as Error).message 
    };
  }
}

// Routes

/**
 * Send single WhatsApp message
 * POST /api/whatsapp/send
 */
router.post('/send',
  authenticateUser,
  requirePermission('messages', 'send'),
  validateRequest(sendWhatsAppSchema),
  async (req, res) => {
    try {
      const { to, message, mediaUrl, mediaType, templateId, templateVariables } = req.body;
      
      let finalMessage = message;
      let finalMediaUrl = mediaUrl;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('whatsapp_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'WhatsApp template not found' });
        }

        finalMessage = template.content;
        finalMediaUrl = template.media_url || mediaUrl;

        if (templateVariables) {
          Object.entries(templateVariables).forEach(([key, value]) => {
            finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
        }
      }

      const formattedPhone = formatWhatsAppNumber(to);
      const result = await sendWhatsAppBusinessMessage(
        formattedPhone, 
        finalMessage, 
        finalMediaUrl, 
        mediaType
      );

      // Save to database
      const { data: whatsappRecord, error: dbError } = await supabase
        .from('whatsapp_logs')
        .insert([{
          to: formattedPhone,
          message: finalMessage,
          media_url: finalMediaUrl,
          media_type: mediaType,
          status: result.success ? 'sent' : 'failed',
          provider_message_id: result.messageId,
          error_message: result.error,
          sent_by: req.user?.id,
          sent_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Error saving WhatsApp log:', dbError);
      }

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
          whatsappId: whatsappRecord?.id
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('WhatsApp send error:', error);
      res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
  }
);

/**
 * Send bulk WhatsApp messages
 * POST /api/whatsapp/bulk
 */
router.post('/bulk',
  authenticateUser,
  requirePermission('messages', 'bulk_send'),
  validateRequest(bulkWhatsAppSchema),
  async (req, res) => {
    try {
      const { recipients, message, mediaUrl, mediaType, templateId, templateVariables } = req.body;
      
      let finalMessage = message;
      let finalMediaUrl = mediaUrl;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('whatsapp_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'WhatsApp template not found' });
        }

        finalMessage = template.content;
        finalMediaUrl = template.media_url || mediaUrl;

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
        const formattedPhone = formatWhatsAppNumber(recipient);
        const result = await sendWhatsAppBusinessMessage(
          formattedPhone, 
          finalMessage, 
          finalMediaUrl, 
          mediaType
        );
        
        // Save to database
        const { data: whatsappRecord, error: dbError } = await supabase
          .from('whatsapp_logs')
          .insert([{
            to: formattedPhone,
            message: finalMessage,
            media_url: finalMediaUrl,
            media_type: mediaType,
            status: result.success ? 'sent' : 'failed',
            provider_message_id: result.messageId,
            error_message: result.error,
            sent_by: req.user?.id,
            sent_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (dbError) {
          console.error('Error saving WhatsApp log:', dbError);
        }

        results.push({
          recipient: formattedPhone,
          success: result.success,
          messageId: result.messageId,
          whatsappId: whatsappRecord?.id,
          error: result.error
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }

        // Rate limiting - 3 seconds between WhatsApp messages
        if (recipients.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
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
      console.error('Bulk WhatsApp error:', error);
      res.status(500).json({ error: 'Failed to send bulk WhatsApp messages' });
    }
  }
);

/**
 * WhatsApp webhook for receiving status updates
 * POST /api/whatsapp/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    
    // Verify webhook (optional security)
    if (req.query['hub.verify_token'] === WHATSAPP_CONFIG.webhookVerifyToken) {
      res.send(req.query['hub.challenge']);
      return;
    }

    // Process webhook data
    if (body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.value.statuses) {
              // Update message status
              for (const status of change.value.statuses) {
                await supabase
                  .from('whatsapp_logs')
                  .update({
                    status: status.status,
                    delivered_at: status.status === 'delivered' ? new Date().toISOString() : null,
                    read_at: status.status === 'read' ? new Date().toISOString() : null
                  })
                  .eq('provider_message_id', status.id);
              }
            }
          }
        }
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

/**
 * Get WhatsApp logs
 * GET /api/whatsapp/logs
 */
router.get('/logs',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, status, from_date, to_date } = req.query;
      
      let query = supabase
        .from('whatsapp_logs')
        .select(`
          *,
          sender:user_profiles!whatsapp_logs_sent_by_fkey(full_name)
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
        console.error('Error fetching WhatsApp logs:', error);
        return res.status(500).json({ error: 'Failed to fetch WhatsApp logs' });
      }

      res.json({ data: logs || [] });

    } catch (error) {
      console.error('WhatsApp logs error:', error);
      res.status(500).json({ error: 'Failed to fetch WhatsApp logs' });
    }
  }
);

/**
 * Get WhatsApp templates
 * GET /api/whatsapp/templates
 */
router.get('/templates',
  authenticateUser,
  async (req, res) => {
    try {
      const { data: templates, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching WhatsApp templates:', error);
        return res.status(500).json({ error: 'Failed to fetch WhatsApp templates' });
      }

      res.json({ data: templates || [] });

    } catch (error) {
      console.error('WhatsApp templates error:', error);
      res.status(500).json({ error: 'Failed to fetch WhatsApp templates' });
    }
  }
);

/**
 * Create WhatsApp template
 * POST /api/whatsapp/templates
 */
router.post('/templates',
  authenticateUser,
  requirePermission('messages', 'templates'),
  validateRequest(whatsappTemplateSchema),
  async (req, res) => {
    try {
      const { name, content, mediaUrl, variables = [], category = 'general' } = req.body;

      const { data: template, error } = await supabase
        .from('whatsapp_templates')
        .insert([{
          name,
          content,
          media_url: mediaUrl,
          variables,
          category,
          is_active: true,
          created_by: req.user?.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating WhatsApp template:', error);
        return res.status(400).json({ error: 'Failed to create WhatsApp template' });
      }

      res.status(201).json({ 
        success: true, 
        template 
      });

    } catch (error) {
      console.error('WhatsApp template creation error:', error);
      res.status(500).json({ error: 'Failed to create WhatsApp template' });
    }
  }
);

/**
 * Get WhatsApp Business API status
 * GET /api/whatsapp/status
 */
router.get('/status',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      if (WHATSAPP_CONFIG.testMode || !WHATSAPP_CONFIG.accessToken) {
        return res.json({
          connected: false,
          testMode: true,
          message: 'Running in test mode'
        });
      }

      // Check WhatsApp Business API status
      const response = await fetch(`${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`
        }
      });

      const result = await response.json();
      
      res.json({
        connected: response.ok,
        phoneNumber: result.display_phone_number,
        verifiedName: result.verified_name,
        quality: result.quality_rating,
        status: result.status
      });

    } catch (error) {
      console.error('WhatsApp status check error:', error);
      res.status(500).json({
        connected: false,
        error: 'Failed to check WhatsApp status'
      });
    }
  }
);

/**
 * Get communication statistics (combined)
 * GET /api/whatsapp/communication-stats
 */
router.get('/communication-stats',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { from_date, to_date } = req.query;
      
      const startDate = from_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = to_date || new Date().toISOString();

      const { data: stats, error } = await supabase
        .rpc('get_communication_stats', {
          start_date: startDate,
          end_date: endDate
        });

      if (error) {
        console.error('Error fetching communication stats:', error);
        return res.status(500).json({ error: 'Failed to fetch communication statistics' });
      }

      res.json({ stats: stats || {} });

    } catch (error) {
      console.error('Communication stats error:', error);
      res.status(500).json({ error: 'Failed to fetch communication statistics' });
    }
  }
);

export default router;
