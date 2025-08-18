import { Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth.ts';
import { requirePermission } from '../middleware/rbac.ts';
import { validateRequest } from '../middleware/validation.ts';
import { supabase } from '../config/supabase.ts';
import nodemailer from 'nodemailer';

const router = Router();

// SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true, // Default to true for Hostinger SSL
  username: process.env.SMTP_USERNAME || '',
  password: process.env.SMTP_PASSWORD || '',
  fromName: process.env.SMTP_FROM_NAME || 'KAFKASDER',
  fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@kafkasder.org',
  testMode: process.env.NODE_ENV !== 'production'
};

// Create transporter
let transporter: nodemailer.Transporter | null = null;

try {
  if (!SMTP_CONFIG.testMode && SMTP_CONFIG.username && SMTP_CONFIG.password) {
    transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      auth: {
        user: SMTP_CONFIG.username,
        pass: SMTP_CONFIG.password
      }
    });
  }
} catch (error) {
  console.error('SMTP transporter initialization error:', error);
}

// Validation schemas
const sendEmailSchema = z.object({
  to: z.string().email(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1),
  content: z.string().min(1),
  htmlContent: z.string().optional(),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(),
    contentType: z.string()
  })).optional(),
  scheduleAt: z.string().datetime().optional()
});

const bulkEmailSchema = z.object({
  recipients: z.array(z.string().email()).min(1).max(500),
  subject: z.string().min(1),
  content: z.string().min(1),
  htmlContent: z.string().optional(),
  templateId: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(),
    contentType: z.string()
  })).optional(),
  scheduleAt: z.string().datetime().optional()
});

const emailTemplateSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  htmlContent: z.string().optional(),
  variables: z.array(z.string()).optional(),
  category: z.string().optional()
});

// Helper functions
async function sendSMTPEmail(emailData: {
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  htmlContent?: string;
  attachments?: any[];
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  
  if (SMTP_CONFIG.testMode || !transporter) {
    console.log('TEST MODE - Email would be sent:', emailData);
    return { 
      success: true, 
      messageId: `test_email_${Date.now()}` 
    };
  }

  try {
    const mailOptions = {
      from: `${SMTP_CONFIG.fromName} <${SMTP_CONFIG.fromEmail}>`,
      to: emailData.to,
      cc: emailData.cc?.join(', '),
      bcc: emailData.bcc?.join(', '),
      subject: emailData.subject,
      text: emailData.content,
      html: emailData.htmlContent || emailData.content,
      attachments: emailData.attachments || []
    };

    const result = await transporter.sendMail(mailOptions);
    
    return { 
      success: true, 
      messageId: result.messageId 
    };

  } catch (error) {
    console.error('SMTP Error:', error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

// Routes

/**
 * Send single email
 * POST /api/email/send
 */
router.post('/send',
  authenticateUser,
  requirePermission('messages', 'send'),
  validateRequest(sendEmailSchema),
  async (req, res) => {
    try {
      const { 
        to, 
        cc, 
        bcc, 
        subject, 
        content, 
        htmlContent, 
        templateId, 
        templateVariables,
        attachments 
      } = req.body;
      
      let finalSubject = subject;
      let finalContent = content;
      let finalHtmlContent = htmlContent;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'Email template not found' });
        }

        finalSubject = template.subject;
        finalContent = template.content;
        finalHtmlContent = template.html_content;

        if (templateVariables) {
          Object.entries(templateVariables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalSubject = finalSubject.replace(regex, value);
            finalContent = finalContent.replace(regex, value);
            if (finalHtmlContent) {
              finalHtmlContent = finalHtmlContent.replace(regex, value);
            }
          });
        }
      }

      const result = await sendSMTPEmail({
        to,
        cc,
        bcc,
        subject: finalSubject,
        content: finalContent,
        htmlContent: finalHtmlContent,
        attachments
      });

      // Save to database
      const { data: emailRecord, error: dbError } = await supabase
        .from('email_logs')
        .insert([{
          to,
          cc,
          bcc,
          subject: finalSubject,
          content: finalContent,
          html_content: finalHtmlContent,
          status: result.success ? 'sent' : 'failed',
          provider_message_id: result.messageId,
          error_message: result.error,
          sent_by: req.user?.id,
          sent_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Error saving email log:', dbError);
      }

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
          emailId: emailRecord?.id
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }
);

/**
 * Send bulk email
 * POST /api/email/bulk
 */
router.post('/bulk',
  authenticateUser,
  requirePermission('messages', 'bulk_send'),
  validateRequest(bulkEmailSchema),
  async (req, res) => {
    try {
      const { 
        recipients, 
        subject, 
        content, 
        htmlContent, 
        templateId, 
        templateVariables,
        attachments 
      } = req.body;
      
      let finalSubject = subject;
      let finalContent = content;
      let finalHtmlContent = htmlContent;
      
      // Apply template if provided
      if (templateId) {
        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError || !template) {
          return res.status(400).json({ error: 'Email template not found' });
        }

        finalSubject = template.subject;
        finalContent = template.content;
        finalHtmlContent = template.html_content;

        if (templateVariables) {
          Object.entries(templateVariables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalSubject = finalSubject.replace(regex, value);
            finalContent = finalContent.replace(regex, value);
            if (finalHtmlContent) {
              finalHtmlContent = finalHtmlContent.replace(regex, value);
            }
          });
        }
      }

      const results = [];
      let successCount = 0;
      let failCount = 0;

      for (const recipient of recipients) {
        const result = await sendSMTPEmail({
          to: recipient,
          subject: finalSubject,
          content: finalContent,
          htmlContent: finalHtmlContent,
          attachments
        });
        
        // Save to database
        const { data: emailRecord, error: dbError } = await supabase
          .from('email_logs')
          .insert([{
            to: recipient,
            subject: finalSubject,
            content: finalContent,
            html_content: finalHtmlContent,
            status: result.success ? 'sent' : 'failed',
            provider_message_id: result.messageId,
            error_message: result.error,
            sent_by: req.user?.id,
            sent_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (dbError) {
          console.error('Error saving email log:', dbError);
        }

        results.push({
          recipient,
          success: result.success,
          messageId: result.messageId,
          emailId: emailRecord?.id,
          error: result.error
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }

        // Rate limiting - 2 seconds between emails
        if (recipients.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
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
      console.error('Bulk email error:', error);
      res.status(500).json({ error: 'Failed to send bulk email' });
    }
  }
);

/**
 * Get email logs
 * GET /api/email/logs
 */
router.get('/logs',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, status, from_date, to_date } = req.query;
      
      let query = supabase
        .from('email_logs')
        .select(`
          *,
          sender:user_profiles!email_logs_sent_by_fkey(full_name)
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
        console.error('Error fetching email logs:', error);
        return res.status(500).json({ error: 'Failed to fetch email logs' });
      }

      res.json({ data: logs || [] });

    } catch (error) {
      console.error('Email logs error:', error);
      res.status(500).json({ error: 'Failed to fetch email logs' });
    }
  }
);

/**
 * Get email templates
 * GET /api/email/templates
 */
router.get('/templates',
  authenticateUser,
  async (req, res) => {
    try {
      const { data: templates, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching email templates:', error);
        return res.status(500).json({ error: 'Failed to fetch email templates' });
      }

      res.json({ data: templates || [] });

    } catch (error) {
      console.error('Email templates error:', error);
      res.status(500).json({ error: 'Failed to fetch email templates' });
    }
  }
);

/**
 * Create email template
 * POST /api/email/templates
 */
router.post('/templates',
  authenticateUser,
  requirePermission('messages', 'templates'),
  validateRequest(emailTemplateSchema),
  async (req, res) => {
    try {
      const { name, subject, content, htmlContent, variables = [], category = 'general' } = req.body;

      const { data: template, error } = await supabase
        .from('email_templates')
        .insert([{
          name,
          subject,
          content,
          html_content: htmlContent,
          variables,
          category,
          is_active: true,
          created_by: req.user?.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating email template:', error);
        return res.status(400).json({ error: 'Failed to create email template' });
      }

      res.status(201).json({ 
        success: true, 
        template 
      });

    } catch (error) {
      console.error('Email template creation error:', error);
      res.status(500).json({ error: 'Failed to create email template' });
    }
  }
);

/**
 * Test SMTP connection
 * GET /api/email/test-connection
 */
router.get('/test-connection',
  authenticateUser,
  requirePermission('system', 'settings'),
  async (req, res) => {
    try {
      if (!transporter) {
        return res.json({
          success: false,
          error: 'SMTP transporter not configured'
        });
      }

      await transporter.verify();
      
      res.json({
        success: true,
        message: 'SMTP connection successful'
      });

    } catch (error) {
      console.error('SMTP connection test error:', error);
      res.status(500).json({
        success: false,
        error: 'SMTP connection failed: ' + (error as Error).message
      });
    }
  }
);

/**
 * Get email statistics
 * GET /api/email/stats
 */
router.get('/stats',
  authenticateUser,
  requirePermission('messages', 'view'),
  async (req, res) => {
    try {
      const { from_date, to_date } = req.query;
      
      let query = supabase
        .from('email_logs')
        .select('status, sent_at, opened_at, clicked_at');

      if (from_date) {
        query = query.gte('sent_at', from_date);
      }

      if (to_date) {
        query = query.lte('sent_at', to_date);
      }

      const { data: logs, error } = await query;

      if (error) {
        console.error('Error fetching email stats:', error);
        return res.status(500).json({ error: 'Failed to fetch email statistics' });
      }

      const stats = {
        total: logs?.length || 0,
        sent: logs?.filter(log => log.status === 'sent').length || 0,
        delivered: logs?.filter(log => log.status === 'delivered').length || 0,
        opened: logs?.filter(log => log.opened_at).length || 0,
        clicked: logs?.filter(log => log.clicked_at).length || 0,
        bounced: logs?.filter(log => log.status === 'bounced').length || 0,
        failed: logs?.filter(log => log.status === 'failed').length || 0
      };

      stats.successRate = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;
      stats.openRate = stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0;
      stats.clickRate = stats.opened > 0 ? (stats.clicked / stats.opened) * 100 : 0;
      stats.bounceRate = stats.total > 0 ? (stats.bounced / stats.total) * 100 : 0;

      res.json({ stats });

    } catch (error) {
      console.error('Email stats error:', error);
      res.status(500).json({ error: 'Failed to fetch email statistics' });
    }
  }
);

export default router;
