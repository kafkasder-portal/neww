import { Request, Response, Router } from 'express';
import { supabase } from '../config/supabase';
import { auditLogger } from '../middleware/audit';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

// Apply audit logging to all analytics routes
router.use(auditLogger);

/**
 * POST /api/analytics/performance
 * Store performance metrics
 * Note: This endpoint allows unauthenticated requests for performance monitoring
 */
router.post('/performance', async (req: Request, res: Response) => {
    try {
        const { type, metrics } = req.body;

        if (!type || !metrics || !Array.isArray(metrics)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request body. Required: type and metrics array',
                code: 'VALIDATION_ERROR'
            });
        }

        // Store metrics in database
        const { data, error } = await supabase
            .from('performance_metrics')
            .insert(metrics.map(metric => ({
                type,
                data: metric,
                timestamp: new Date().toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || req.connection.remoteAddress || ''
            })));

        if (error) {
            console.error('Error storing performance metrics:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to store performance metrics',
                code: 'DATABASE_ERROR'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Performance metrics stored successfully',
            count: metrics.length
        });

    } catch (error) {
        console.error('Analytics performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * POST /api/analytics/api-performance
 * Store API performance metrics
 * Note: This endpoint allows unauthenticated requests for performance monitoring
 */
router.post('/api-performance', async (req: Request, res: Response) => {
    try {
        const { type, metrics } = req.body;

        if (!type || !metrics || !Array.isArray(metrics)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request body. Required: type and metrics array',
                code: 'VALIDATION_ERROR'
            });
        }

        // Store API metrics in database
        const { data, error } = await supabase
            .from('api_performance_metrics')
            .insert(metrics.map(metric => ({
                type,
                data: metric,
                timestamp: new Date().toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || req.connection.remoteAddress || ''
            })));

        if (error) {
            console.error('Error storing API performance metrics:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to store API performance metrics',
                code: 'DATABASE_ERROR'
            });
        }

        res.status(201).json({
            success: true,
            message: 'API performance metrics stored successfully',
            count: metrics.length
        });

    } catch (error) {
        console.error('Analytics API performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * POST /api/analytics/render-performance
 * Store render performance metrics
 * Note: This endpoint allows unauthenticated requests for performance monitoring
 */
router.post('/render-performance', async (req: Request, res: Response) => {
    try {
        const { type, metrics } = req.body;

        if (!type || !metrics || !Array.isArray(metrics)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request body. Required: type and metrics array',
                code: 'VALIDATION_ERROR'
            });
        }

        // Store render metrics in database
        const { data, error } = await supabase
            .from('render_performance_metrics')
            .insert(metrics.map(metric => ({
                type,
                data: metric,
                timestamp: new Date().toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || req.connection.remoteAddress || ''
            })));

        if (error) {
            console.error('Error storing render performance metrics:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to store render performance metrics',
                code: 'DATABASE_ERROR'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Render performance metrics stored successfully',
            count: metrics.length
        });

    } catch (error) {
        console.error('Analytics render performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/analytics/performance/summary
 * Get performance summary (Admin only)
 */
router.get('/performance/summary', authenticateUser, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, type } = req.query;

        let query = supabase
            .from('performance_metrics')
            .select('*');

        if (startDate) {
            query = query.gte('timestamp', startDate as string);
        }

        if (endDate) {
            query = query.lte('timestamp', endDate as string);
        }

        if (type) {
            query = query.eq('type', type as string);
        }

        const { data, error } = await query
            .order('timestamp', { ascending: false })
            .limit(1000);

        if (error) {
            console.error('Error fetching performance summary:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch performance summary',
                code: 'DATABASE_ERROR'
            });
        }

        // Calculate summary statistics
        const summary = {
            totalMetrics: data.length,
            averageResponseTime: 0,
            slowestRequests: [],
            fastestRequests: [],
            errors: 0,
            successRate: 0
        };

        if (data.length > 0) {
            const responseTimes = data
                .map(item => item.data?.responseTime || item.data?.duration || 0)
                .filter(time => time > 0);

            if (responseTimes.length > 0) {
                summary.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

                // Get slowest and fastest requests
                const sortedByTime = data
                    .filter(item => item.data?.responseTime || item.data?.duration)
                    .sort((a, b) => (b.data?.responseTime || b.data?.duration || 0) - (a.data?.responseTime || a.data?.duration || 0));

                summary.slowestRequests = sortedByTime.slice(0, 5);
                summary.fastestRequests = sortedByTime.slice(-5).reverse();
            }

            // Calculate error rate
            const errors = data.filter(item => item.data?.error || item.data?.status >= 400);
            summary.errors = errors.length;
            summary.successRate = ((data.length - errors.length) / data.length) * 100;
        }

        res.json({
            success: true,
            data: summary,
            metrics: data.slice(0, 100) // Return first 100 metrics for detailed view
        });

    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

/**
 * GET /api/analytics/errors
 * Get error analytics (Admin only)
 */
router.get('/errors', authenticateUser, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, level } = req.query;

        let query = supabase
            .from('error_logs')
            .select('*');

        if (startDate) {
            query = query.gte('timestamp', startDate as string);
        }

        if (endDate) {
            query = query.lte('timestamp', endDate as string);
        }

        if (level) {
            query = query.eq('level', level as string);
        }

        const { data, error } = await query
            .order('timestamp', { ascending: false })
            .limit(1000);

        if (error) {
            console.error('Error fetching error analytics:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch error analytics',
                code: 'DATABASE_ERROR'
            });
        }

        // Calculate error statistics
        const errorStats = {
            totalErrors: data.length,
            errorByLevel: {} as Record<string, number>,
            errorByCategory: {} as Record<string, number>,
            recentErrors: data.slice(0, 50)
        };

        data.forEach(error => {
            // Count by level
            const level = error.level || 'unknown';
            errorStats.errorByLevel[level] = (errorStats.errorByLevel[level] || 0) + 1;

            // Count by category
            const category = error.category || 'unknown';
            errorStats.errorByCategory[category] = (errorStats.errorByCategory[category] || 0) + 1;
        });

        res.json({
            success: true,
            data: errorStats
        });

    } catch (error) {
        console.error('Error analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});

export default router;
