-- Enhanced AI Systems Migration
-- This migration adds comprehensive AI capabilities including learning, data analysis, security, and privacy

-- AI Learning Patterns Table
CREATE TABLE IF NOT EXISTS ai_learning_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern TEXT NOT NULL,
    context TEXT,
    success_rate DECIMAL(3,2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence DECIMAL(3,2) DEFAULT 0.0,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI User Preferences Table
CREATE TABLE IF NOT EXISTS ai_user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL CHECK (preference_type IN ('command_style', 'response_format', 'automation_level', 'notification_preference')),
    value JSONB,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Context Memories Table
CREATE TABLE IF NOT EXISTS ai_context_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    context TEXT NOT NULL,
    entities JSONB,
    intent TEXT,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes')
);

-- AI Performance Metrics Table
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    command TEXT NOT NULL,
    result TEXT NOT NULL CHECK (result IN ('success', 'failure', 'partial')),
    response_time INTEGER, -- in milliseconds
    confidence DECIMAL(3,2) DEFAULT 0.0,
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    context JSONB
);

-- AI Data Insights Table
CREATE TABLE IF NOT EXISTS ai_data_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('trend', 'anomaly', 'pattern', 'prediction', 'recommendation')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT,
    actionable BOOLEAN DEFAULT false,
    action TEXT
);

-- AI Security Events Table
CREATE TABLE IF NOT EXISTS ai_security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('authentication', 'authorization', 'data_access', 'privacy_violation', 'anomaly', 'compliance')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    action TEXT NOT NULL,
    resource TEXT,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- AI Privacy Audits Table
CREATE TABLE IF NOT EXISTS ai_privacy_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data_type TEXT NOT NULL CHECK (data_type IN ('personal', 'financial', 'sensitive', 'public')),
    access_type TEXT NOT NULL CHECK (access_type IN ('read', 'write', 'delete', 'export')),
    purpose TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    authorized BOOLEAN DEFAULT false,
    consent_given BOOLEAN DEFAULT false,
    data_retention_period INTEGER,
    data_anonymized BOOLEAN DEFAULT false
);

-- AI Compliance Checks Table
CREATE TABLE IF NOT EXISTS ai_compliance_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation TEXT NOT NULL CHECK (regulation IN ('GDPR', 'KVKK', 'SOX', 'HIPAA', 'PCI_DSS')),
    requirement TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'pending', 'exempt')),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_check TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    details JSONB,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical'))
);

-- AI Data Classifications Table
CREATE TABLE IF NOT EXISTS ai_data_classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL,
    sensitivity TEXT NOT NULL CHECK (sensitivity IN ('public', 'internal', 'confidential', 'restricted')),
    classification TEXT NOT NULL CHECK (classification IN ('PII', 'PHI', 'financial', 'operational', 'public')),
    retention_period INTEGER NOT NULL,
    encryption_required BOOLEAN DEFAULT false,
    access_controls TEXT[],
    audit_required BOOLEAN DEFAULT false
);

-- AI Threat Detections Table
CREATE TABLE IF NOT EXISTS ai_threat_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    threat_type TEXT NOT NULL CHECK (threat_type IN ('brute_force', 'sql_injection', 'xss', 'csrf', 'privilege_escalation', 'data_exfiltration')),
    confidence DECIMAL(3,2) DEFAULT 0.0,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    source TEXT,
    target TEXT,
    indicators TEXT[],
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked BOOLEAN DEFAULT false,
    false_positive BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_learning_patterns_user_id ON ai_learning_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_patterns_pattern ON ai_learning_patterns(pattern);
CREATE INDEX IF NOT EXISTS idx_ai_learning_patterns_category ON ai_learning_patterns(category);
CREATE INDEX IF NOT EXISTS idx_ai_learning_patterns_last_used ON ai_learning_patterns(last_used);

CREATE INDEX IF NOT EXISTS idx_ai_user_preferences_user_id ON ai_user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_preferences_type ON ai_user_preferences(preference_type);

CREATE INDEX IF NOT EXISTS idx_ai_context_memories_user_id ON ai_context_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_memories_session_id ON ai_context_memories(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_memories_expires_at ON ai_context_memories(expires_at);

CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_user_id ON ai_performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_timestamp ON ai_performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_result ON ai_performance_metrics(result);

CREATE INDEX IF NOT EXISTS idx_ai_data_insights_type ON ai_data_insights(type);
CREATE INDEX IF NOT EXISTS idx_ai_data_insights_severity ON ai_data_insights(severity);
CREATE INDEX IF NOT EXISTS idx_ai_data_insights_timestamp ON ai_data_insights(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_data_insights_category ON ai_data_insights(category);

CREATE INDEX IF NOT EXISTS idx_ai_security_events_user_id ON ai_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_security_events_type ON ai_security_events(type);
CREATE INDEX IF NOT EXISTS idx_ai_security_events_severity ON ai_security_events(severity);
CREATE INDEX IF NOT EXISTS idx_ai_security_events_timestamp ON ai_security_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_security_events_resolved ON ai_security_events(resolved);

CREATE INDEX IF NOT EXISTS idx_ai_privacy_audits_user_id ON ai_privacy_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_privacy_audits_data_type ON ai_privacy_audits(data_type);
CREATE INDEX IF NOT EXISTS idx_ai_privacy_audits_timestamp ON ai_privacy_audits(timestamp);

CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_regulation ON ai_compliance_checks(regulation);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_status ON ai_compliance_checks(status);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_last_checked ON ai_compliance_checks(last_checked);

CREATE INDEX IF NOT EXISTS idx_ai_data_classifications_data_type ON ai_data_classifications(data_type);
CREATE INDEX IF NOT EXISTS idx_ai_data_classifications_sensitivity ON ai_data_classifications(sensitivity);

CREATE INDEX IF NOT EXISTS idx_ai_threat_detections_threat_type ON ai_threat_detections(threat_type);
CREATE INDEX IF NOT EXISTS idx_ai_threat_detections_severity ON ai_threat_detections(severity);
CREATE INDEX IF NOT EXISTS idx_ai_threat_detections_timestamp ON ai_threat_detections(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_context_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_data_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_privacy_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_data_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_threat_detections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own AI learning patterns
CREATE POLICY "Users can view own AI learning patterns" ON ai_learning_patterns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI learning patterns" ON ai_learning_patterns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI learning patterns" ON ai_learning_patterns
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access their own preferences
CREATE POLICY "Users can view own AI preferences" ON ai_user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI preferences" ON ai_user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI preferences" ON ai_user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access their own context memories
CREATE POLICY "Users can view own AI context memories" ON ai_context_memories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI context memories" ON ai_context_memories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access their own performance metrics
CREATE POLICY "Users can view own AI performance metrics" ON ai_performance_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI performance metrics" ON ai_performance_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Data insights are viewable by all authenticated users (for system-wide insights)
CREATE POLICY "Authenticated users can view AI data insights" ON ai_data_insights
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert AI data insights" ON ai_data_insights
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Security events are viewable by the user and admins
CREATE POLICY "Users can view own security events" ON ai_security_events
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert security events" ON ai_security_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Privacy audits are viewable by the user and admins
CREATE POLICY "Users can view own privacy audits" ON ai_privacy_audits
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert privacy audits" ON ai_privacy_audits
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Compliance checks are viewable by admins
CREATE POLICY "Admins can view compliance checks" ON ai_compliance_checks
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert compliance checks" ON ai_compliance_checks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Data classifications are viewable by all authenticated users
CREATE POLICY "Authenticated users can view data classifications" ON ai_data_classifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert data classifications" ON ai_data_classifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Threat detections are viewable by admins
CREATE POLICY "Admins can view threat detections" ON ai_threat_detections
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert threat detections" ON ai_threat_detections
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_learning_patterns_updated_at 
    BEFORE UPDATE ON ai_learning_patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired context memories
CREATE OR REPLACE FUNCTION cleanup_expired_context_memories()
RETURNS void AS $$
BEGIN
    DELETE FROM ai_context_memories 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired memories (runs every hour)
SELECT cron.schedule(
    'cleanup-expired-context-memories',
    '0 * * * *', -- Every hour
    'SELECT cleanup_expired_context_memories();'
);

-- Insert some initial data classifications
INSERT INTO ai_data_classifications (data_type, sensitivity, classification, retention_period, encryption_required, access_controls, audit_required) VALUES
('personal_info', 'confidential', 'PII', 2555, true, ARRAY['authenticated', 'role_based'], true),
('financial_data', 'confidential', 'financial', 1825, true, ARRAY['authenticated', 'role_based'], true),
('health_records', 'restricted', 'PHI', 2555, true, ARRAY['admin', 'authenticated', 'role_based'], true),
('operational_logs', 'internal', 'operational', 1095, false, ARRAY['authenticated'], false),
('public_announcements', 'public', 'public', 365, false, ARRAY['public'], false)
ON CONFLICT DO NOTHING;

-- Create a function to get AI analytics summary
CREATE OR REPLACE FUNCTION get_ai_analytics_summary(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_interactions', (SELECT COUNT(*) FROM ai_performance_metrics WHERE user_id = user_id_param),
        'success_rate', (SELECT COALESCE(AVG(CASE WHEN result = 'success' THEN 1.0 ELSE 0.0 END), 0.0) FROM ai_performance_metrics WHERE user_id = user_id_param),
        'average_response_time', (SELECT COALESCE(AVG(response_time), 0) FROM ai_performance_metrics WHERE user_id = user_id_param),
        'learning_patterns', (SELECT COUNT(*) FROM ai_learning_patterns WHERE user_id = user_id_param),
        'security_events', (SELECT COUNT(*) FROM ai_security_events WHERE user_id = user_id_param AND severity IN ('high', 'critical')),
        'privacy_audits', (SELECT COUNT(*) FROM ai_privacy_audits WHERE user_id = user_id_param AND NOT authorized)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create a view for AI dashboard data
CREATE OR REPLACE VIEW ai_dashboard_view AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT pm.id) as total_interactions,
    COALESCE(AVG(CASE WHEN pm.result = 'success' THEN 1.0 ELSE 0.0 END), 0.0) as success_rate,
    COALESCE(AVG(pm.response_time), 0) as avg_response_time,
    COUNT(DISTINCT lp.id) as learning_patterns,
    COUNT(DISTINCT CASE WHEN se.severity IN ('high', 'critical') THEN se.id END) as critical_security_events,
    COUNT(DISTINCT CASE WHEN pa.authorized = false THEN pa.id END) as privacy_violations
FROM auth.users u
LEFT JOIN ai_performance_metrics pm ON u.id = pm.user_id
LEFT JOIN ai_learning_patterns lp ON u.id = lp.user_id
LEFT JOIN ai_security_events se ON u.id = se.user_id
LEFT JOIN ai_privacy_audits pa ON u.id = pa.user_id
GROUP BY u.id, u.email;

-- Grant access to the view
GRANT SELECT ON ai_dashboard_view TO authenticated;

COMMENT ON TABLE ai_learning_patterns IS 'Stores AI learning patterns and user behavior analysis';
COMMENT ON TABLE ai_user_preferences IS 'Stores user preferences for AI interactions';
COMMENT ON TABLE ai_context_memories IS 'Stores contextual memory for AI conversations';
COMMENT ON TABLE ai_performance_metrics IS 'Stores AI performance and user satisfaction metrics';
COMMENT ON TABLE ai_data_insights IS 'Stores AI-generated insights and recommendations';
COMMENT ON TABLE ai_security_events IS 'Stores security events and threat detections';
COMMENT ON TABLE ai_privacy_audits IS 'Stores privacy compliance audits';
COMMENT ON TABLE ai_compliance_checks IS 'Stores regulatory compliance checks';
COMMENT ON TABLE ai_data_classifications IS 'Stores data sensitivity classifications';
COMMENT ON TABLE ai_threat_detections IS 'Stores detected security threats';
