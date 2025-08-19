-- Create AI Compliance Checks table
CREATE TABLE IF NOT EXISTS ai_compliance_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    regulation VARCHAR(255) NOT NULL,
    requirement TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'compliant', 'non_compliant', 'review_required')),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_check TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    details JSONB DEFAULT '{}',
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_status ON ai_compliance_checks(status);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_risk_level ON ai_compliance_checks(risk_level);
CREATE INDEX IF NOT EXISTS idx_ai_compliance_checks_next_check ON ai_compliance_checks(next_check);

-- Insert some default compliance checks
INSERT INTO ai_compliance_checks (regulation, requirement, status, risk_level, details) VALUES
('GDPR', 'Data minimization principle', 'compliant', 'low', '{"description": "Only necessary data is collected and processed"}'),
('GDPR', 'User consent management', 'compliant', 'medium', '{"description": "Clear consent mechanisms in place"}'),
('AI Ethics', 'Bias detection and mitigation', 'pending', 'high', '{"description": "AI systems must be monitored for bias"}'),
('Security', 'Data encryption at rest', 'compliant', 'medium', '{"description": "All sensitive data is encrypted"}'),
('Security', 'Access control and authentication', 'compliant', 'high', '{"description": "Multi-factor authentication implemented"}');

-- Enable RLS
ALTER TABLE ai_compliance_checks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON ai_compliance_checks
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for service role" ON ai_compliance_checks
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role" ON ai_compliance_checks
    FOR UPDATE USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_compliance_checks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ai_compliance_checks_updated_at
    BEFORE UPDATE ON ai_compliance_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_compliance_checks_updated_at();
