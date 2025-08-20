-- Create analytics tables for performance monitoring
-- Migration: 20241201000000_create_analytics_tables.sql

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API performance metrics table
CREATE TABLE IF NOT EXISTS api_performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Render performance metrics table
CREATE TABLE IF NOT EXISTS render_performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Error logs table (if not exists)
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    stack TEXT,
    level TEXT NOT NULL DEFAULT 'error',
    category TEXT,
    metadata JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_agent ON performance_metrics(user_agent);

CREATE INDEX IF NOT EXISTS idx_api_performance_metrics_timestamp ON api_performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_performance_metrics_type ON api_performance_metrics(type);

CREATE INDEX IF NOT EXISTS idx_render_performance_metrics_timestamp ON render_performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_render_performance_metrics_type ON render_performance_metrics(type);

CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON error_logs(category);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);

-- Create RLS policies for security
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE render_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert performance metrics (for monitoring)
CREATE POLICY "Allow all users to insert performance metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- Allow admins to read performance metrics
CREATE POLICY "Allow admins to read performance metrics" ON performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow all users to insert API performance metrics (for monitoring)
CREATE POLICY "Allow all users to insert API performance metrics" ON api_performance_metrics
    FOR INSERT WITH CHECK (true);

-- Allow admins to read API performance metrics
CREATE POLICY "Allow admins to read API performance metrics" ON api_performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow all users to insert render performance metrics (for monitoring)
CREATE POLICY "Allow all users to insert render performance metrics" ON render_performance_metrics
    FOR INSERT WITH CHECK (true);

-- Allow admins to read render performance metrics
CREATE POLICY "Allow admins to read render performance metrics" ON render_performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Allow all users to insert error logs (for monitoring)
CREATE POLICY "Allow all users to insert error logs" ON error_logs
    FOR INSERT WITH CHECK (true);

-- Allow admins to read error logs
CREATE POLICY "Allow admins to read error logs" ON error_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create function to clean old analytics data (keep last 30 days)
CREATE OR REPLACE FUNCTION clean_old_analytics_data()
RETURNS void AS $$
BEGIN
    DELETE FROM performance_metrics 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    DELETE FROM api_performance_metrics 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    DELETE FROM render_performance_metrics 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    DELETE FROM error_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean old data (runs daily)
SELECT cron.schedule(
    'clean-analytics-data',
    '0 2 * * *', -- Daily at 2 AM
    'SELECT clean_old_analytics_data();'
);
