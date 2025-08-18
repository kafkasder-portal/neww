import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

// Interface for audit log data
interface AuditLogData {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  metadata?: any;
}

// Helper function to log audit events
export const logAuditEvent = async (data: AuditLogData): Promise<string | null> => {
  try {
    const { data: result, error } = await supabase.rpc('log_audit_event', {
      p_user_id: data.userId || null,
      p_action: data.action,
      p_resource_type: data.resourceType,
      p_resource_id: data.resourceId || null,
      p_old_values: data.oldValues ? JSON.stringify(data.oldValues) : null,
      p_new_values: data.newValues ? JSON.stringify(data.newValues) : null,
      p_ip_address: data.ipAddress || null,
      p_user_agent: data.userAgent || null,
      p_session_id: data.sessionId || null,
      p_severity: data.severity || 'info',
      p_metadata: data.metadata ? JSON.stringify(data.metadata) : null
    });

    if (error) {
      console.error('Audit logging error:', error);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Audit logging exception:', error);
    return null;
  }
};

// Helper function to log security events
export const logSecurityEvent = async (
  eventType: string,
  userId?: string,
  ipAddress?: string,
  userAgent?: string,
  success: boolean = false,
  details?: any,
  riskScore: number = 0
): Promise<string | null> => {
  try {
    const { data: result, error } = await supabase.rpc('log_security_event', {
      p_event_type: eventType,
      p_user_id: userId || null,
      p_ip_address: ipAddress || null,
      p_user_agent: userAgent || null,
      p_success: success,
      p_details: details ? JSON.stringify(details) : null,
      p_risk_score: riskScore
    });

    if (error) {
      console.error('Security event logging error:', error);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Security event logging exception:', error);
    return null;
  }
};

// Get client IP address from request
const getClientIP = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.connection.remoteAddress || req.socket.remoteAddress;
  
  return ip || 'unknown';
};

// Middleware to automatically log API requests
export const auditLogger = (options: {
  includeBody?: boolean;
  excludePaths?: string[];
  logLevel?: 'info' | 'warning' | 'error' | 'critical';
} = {}) => {
  const { includeBody = false, excludePaths = [], logLevel = 'info' } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for excluded paths
    if (excludePaths.some(path => req.path.includes(path))) {
      return next();
    }

    const startTime = Date.now();
    const originalSend = res.send;

    // Store original response body
    let responseBody: any;
    res.send = function(data: any) {
      responseBody = data;
      return originalSend.call(this, data);
    };

    // Continue with request processing
    res.on('finish', async () => {
      try {
        const duration = Date.now() - startTime;
        const userId = req.user?.id;
        const ipAddress = getClientIP(req);
        const userAgent = req.headers['user-agent'] || '';

        // Determine action based on HTTP method and path
        const action = `${req.method.toUpperCase()} ${req.path}`;
        
        // Extract resource type from path
        const pathParts = req.path.split('/').filter(part => part);
        const resourceType = pathParts[1] || 'unknown'; // Skip 'api' prefix

        // Prepare audit data
        const auditData: AuditLogData = {
          userId,
          action,
          resourceType,
          resourceId: req.params.id,
          ipAddress,
          userAgent,
          severity: res.statusCode >= 400 ? 'error' : logLevel,
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            query: req.query,
            ...(includeBody && {
              requestBody: req.body,
              responseBody: responseBody
            })
          }
        };

        // Log the audit event
        await logAuditEvent(auditData);

        // Log security events for authentication failures
        if (res.statusCode === 401 || res.statusCode === 403) {
          await logSecurityEvent(
            'authentication_failure',
            userId,
            ipAddress,
            userAgent,
            false,
            {
              path: req.path,
              method: req.method,
              statusCode: res.statusCode
            },
            res.statusCode === 401 ? 30 : 20
          );
        }

      } catch (error) {
        console.error('Audit logging middleware error:', error);
      }
    });

    next();
  };
};

// Middleware for specific resource operations
export const auditResourceOperation = (
  resourceType: string,
  getResourceId?: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    let responseData: any;

    res.send = function(data: any) {
      responseData = data;
      return originalSend.call(this, data);
    };

    res.on('finish', async () => {
      try {
        if (res.statusCode < 400) { // Only log successful operations
          const userId = req.user?.id;
          const resourceId = getResourceId ? getResourceId(req) : req.params.id;
          const ipAddress = getClientIP(req);
          const userAgent = req.headers['user-agent'] || '';

          let action = '';
          let newValues = null;

          switch (req.method.toUpperCase()) {
            case 'POST':
              action = 'CREATE';
              newValues = req.body;
              break;
            case 'PUT':
            case 'PATCH':
              action = 'UPDATE';
              newValues = req.body;
              break;
            case 'DELETE':
              action = 'DELETE';
              break;
            case 'GET':
              action = 'READ';
              break;
            default:
              action = req.method.toUpperCase();
          }

          await logAuditEvent({
            userId,
            action: `${action}_${resourceType.toUpperCase()}`,
            resourceType,
            resourceId,
            newValues,
            ipAddress,
            userAgent,
            metadata: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode
            }
          });
        }
      } catch (error) {
        console.error('Resource audit logging error:', error);
      }
    });

    next();
  };
};

// Middleware for high-risk operations
export const auditHighRiskOperation = (
  operationType: string,
  getRiskScore?: (req: Request) => number
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const riskScore = getRiskScore ? getRiskScore(req) : 50;

    // Log before operation
    await logAuditEvent({
      userId,
      action: `ATTEMPT_${operationType}`,
      resourceType: 'high_risk_operation',
      ipAddress,
      userAgent,
      severity: 'warning',
      metadata: {
        operation: operationType,
        riskScore,
        requestData: req.body
      }
    });

    const originalSend = res.send;
    res.send = function(data: any) {
      // Log after operation
      (async () => {
        await logAuditEvent({
          userId,
          action: res.statusCode < 400 ? `SUCCESS_${operationType}` : `FAILED_${operationType}`,
          resourceType: 'high_risk_operation',
          ipAddress,
          userAgent,
          severity: res.statusCode < 400 ? 'warning' : 'error',
          metadata: {
            operation: operationType,
            statusCode: res.statusCode,
            success: res.statusCode < 400
          }
        });
      })();

      return originalSend.call(this, data);
    };

    next();
  };
};

// Middleware to detect suspicious activities
export const suspiciousActivityDetector = (req: Request, res: Response, next: NextFunction) => {
  const ipAddress = getClientIP(req);
  const userAgent = req.headers['user-agent'] || '';
  const userId = req.user?.id;

  // Detect potential security issues
  const suspiciousIndicators = [];
  let riskScore = 0;

  // Check for SQL injection patterns
  const sqlInjectionPatterns = [
    /('|(\')|(\-\-)|(\;)|(\/\*))/i,
    /((\%27)|(\')|(\')|(\%2D\D))/i,
    /(union|select|insert|delete|update|drop|exec|script)/i
  ];

  const requestString = JSON.stringify(req.query) + JSON.stringify(req.body);
  sqlInjectionPatterns.forEach(pattern => {
    if (pattern.test(requestString)) {
      suspiciousIndicators.push('sql_injection_attempt');
      riskScore += 40;
    }
  });

  // Check for XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  xssPatterns.forEach(pattern => {
    if (pattern.test(requestString)) {
      suspiciousIndicators.push('xss_attempt');
      riskScore += 30;
    }
  });

  // Check for suspicious user agents
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /curl/i,
    /wget/i
  ];

  suspiciousUserAgents.forEach(pattern => {
    if (pattern.test(userAgent)) {
      suspiciousIndicators.push('suspicious_user_agent');
      riskScore += 10;
    }
  });

  // Log suspicious activity if detected
  if (suspiciousIndicators.length > 0) {
    logSecurityEvent(
      'suspicious_activity',
      userId,
      ipAddress,
      userAgent,
      false,
      {
        indicators: suspiciousIndicators,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body
      },
      riskScore
    );

    // Block high-risk requests
    if (riskScore >= 50) {
      return res.status(403).json({
        error: 'Request blocked due to suspicious activity'
      });
    }
  }

  next();
};

export default {
  auditLogger,
  auditResourceOperation,
  auditHighRiskOperation,
  suspiciousActivityDetector,
  logAuditEvent,
  logSecurityEvent
};
