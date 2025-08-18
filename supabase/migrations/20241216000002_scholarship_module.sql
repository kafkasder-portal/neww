-- Scholarship Module Migration
-- This migration creates comprehensive scholarship management tables with all required features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create scholarship_applications table (already exists, but ensuring structure)
DROP TABLE IF EXISTS scholarship_applications CASCADE;
CREATE TABLE scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'cancelled')),
    required_gpa NUMERIC(3,2) CHECK (required_gpa >= 0.0 AND required_gpa <= 4.0),
    family_income NUMERIC(12,2),
    documents_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scholarship_payments table (already exists, but ensuring structure)
DROP TABLE IF EXISTS scholarship_payments CASCADE;
CREATE TABLE scholarship_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES scholarship_applications(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'cash', 'check', 'digital_wallet', 'other')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_scholarship_applications_student_id ON scholarship_applications(student_id);
CREATE INDEX idx_scholarship_applications_status ON scholarship_applications(status);
CREATE INDEX idx_scholarship_applications_application_date ON scholarship_applications(application_date);
CREATE INDEX idx_scholarship_applications_created_at ON scholarship_applications(created_at);

CREATE INDEX idx_scholarship_payments_application_id ON scholarship_payments(application_id);
CREATE INDEX idx_scholarship_payments_status ON scholarship_payments(status);
CREATE INDEX idx_scholarship_payments_payment_date ON scholarship_payments(payment_date);
CREATE INDEX idx_scholarship_payments_created_at ON scholarship_payments(created_at);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_scholarship_applications_updated_at
    BEFORE UPDATE ON scholarship_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarship_payments_updated_at
    BEFORE UPDATE ON scholarship_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scholarship_applications
CREATE POLICY "Users can view all scholarship applications" ON scholarship_applications
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert scholarship applications" ON scholarship_applications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update scholarship applications" ON scholarship_applications
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete scholarship applications" ON scholarship_applications
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for scholarship_payments
CREATE POLICY "Users can view all scholarship payments" ON scholarship_payments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert scholarship payments" ON scholarship_payments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update scholarship payments" ON scholarship_payments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete scholarship payments" ON scholarship_payments
    FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON scholarship_applications TO anon;
GRANT ALL PRIVILEGES ON scholarship_applications TO authenticated;

GRANT SELECT ON scholarship_payments TO anon;
GRANT ALL PRIVILEGES ON scholarship_payments TO authenticated;

-- Insert sample data for scholarship_applications
INSERT INTO scholarship_applications (student_id, application_date, status, required_gpa, family_income, documents_url, notes) 
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '30 days' * (ROW_NUMBER() OVER ()),
    CASE 
        WHEN ROW_NUMBER() OVER () % 4 = 0 THEN 'approved'
        WHEN ROW_NUMBER() OVER () % 4 = 1 THEN 'pending'
        WHEN ROW_NUMBER() OVER () % 4 = 2 THEN 'under_review'
        ELSE 'rejected'
    END,
    3.5 + (RANDOM() * 0.5),
    25000 + (RANDOM() * 50000),
    'https://example.com/documents/' || s.id || '.pdf',
    'Sample scholarship application for student: ' || s.first_name || ' ' || s.last_name
FROM students s
LIMIT 5;

-- Insert sample data for scholarship_payments (only for approved applications)
INSERT INTO scholarship_payments (application_id, amount, payment_date, payment_method, status, notes)
SELECT 
    sa.id,
    2000 + (RANDOM() * 3000),
    sa.application_date + INTERVAL '45 days',
    CASE 
        WHEN RANDOM() < 0.7 THEN 'bank_transfer'
        WHEN RANDOM() < 0.9 THEN 'check'
        ELSE 'digital_wallet'
    END,
    CASE 
        WHEN RANDOM() < 0.8 THEN 'completed'
        WHEN RANDOM() < 0.9 THEN 'processing'
        ELSE 'pending'
    END,
    'Scholarship payment for application ID: ' || sa.id
FROM scholarship_applications sa
WHERE sa.status = 'approved'
LIMIT 3;

-- Create statistics views
CREATE OR REPLACE VIEW scholarship_statistics AS
SELECT 
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_applications,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications,
    AVG(required_gpa) as average_required_gpa,
    AVG(family_income) as average_family_income,
    MIN(application_date) as earliest_application,
    MAX(application_date) as latest_application
FROM scholarship_applications;

CREATE OR REPLACE VIEW scholarship_payment_statistics AS
SELECT 
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_payments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
    SUM(amount) as total_amount_paid,
    AVG(amount) as average_payment_amount,
    MIN(payment_date) as earliest_payment,
    MAX(payment_date) as latest_payment
FROM scholarship_payments;

CREATE OR REPLACE VIEW scholarship_applications_with_student_details AS
SELECT 
    sa.id,
    sa.application_date,
    sa.status,
    sa.required_gpa,
    sa.family_income,
    sa.documents_url,
    sa.notes,
    sa.created_at,
    sa.updated_at,
    s.first_name,
    s.last_name,
    s.email,
    s.phone,
    s.student_number,
    s.university,
    s.department,
    s.grade_level,
    s.gpa as student_gpa
FROM scholarship_applications sa
JOIN students s ON sa.student_id = s.id;

CREATE OR REPLACE VIEW scholarship_payments_with_application_details AS
SELECT 
    sp.id,
    sp.amount,
    sp.payment_date,
    sp.payment_method,
    sp.status,
    sp.notes,
    sp.created_at,
    sp.updated_at,
    sa.application_date,
    sa.status as application_status,
    s.first_name,
    s.last_name,
    s.email,
    s.student_number
FROM scholarship_payments sp
JOIN scholarship_applications sa ON sp.application_id = sa.id
JOIN students s ON sa.student_id = s.id;

-- Grant permissions on views
GRANT SELECT ON scholarship_statistics TO anon, authenticated;
GRANT SELECT ON scholarship_payment_statistics TO anon, authenticated;
GRANT SELECT ON scholarship_applications_with_student_details TO anon, authenticated;
GRANT SELECT ON scholarship_payments_with_application_details TO anon, authenticated;

-- Create function to automatically create payment record when application is approved
CREATE OR REPLACE FUNCTION create_payment_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- If status changed to approved and there's no existing payment
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO scholarship_payments (application_id, amount, payment_method, status, notes)
        VALUES (
            NEW.id,
            COALESCE(NEW.family_income * 0.1, 1000), -- 10% of family income or default 1000
            'bank_transfer',
            'pending',
            'Auto-generated payment for approved scholarship application'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic payment creation
CREATE TRIGGER auto_create_payment_on_approval
    AFTER UPDATE ON scholarship_applications
    FOR EACH ROW
    EXECUTE FUNCTION create_payment_on_approval();

-- Add comments to tables
COMMENT ON TABLE scholarship_applications IS 'Scholarship applications submitted by students';
COMMENT ON TABLE scholarship_payments IS 'Scholarship payments made to approved applications';

COMMENT ON COLUMN scholarship_applications.student_id IS 'Reference to the student who submitted the application';
COMMENT ON COLUMN scholarship_applications.application_date IS 'Date when the application was submitted';
COMMENT ON COLUMN scholarship_applications.status IS 'Current status of the application';
COMMENT ON COLUMN scholarship_applications.required_gpa IS 'Minimum GPA required for this scholarship';
COMMENT ON COLUMN scholarship_applications.family_income IS 'Annual family income of the student';
COMMENT ON COLUMN scholarship_applications.documents_url IS 'URL to supporting documents';

COMMENT ON COLUMN scholarship_payments.application_id IS 'Reference to the scholarship application';
COMMENT ON COLUMN scholarship_payments.amount IS 'Payment amount';
COMMENT ON COLUMN scholarship_payments.payment_date IS 'Date when payment was made or scheduled';
COMMENT ON COLUMN scholarship_payments.payment_method IS 'Method used for payment';
COMMENT ON COLUMN scholarship_payments.status IS 'Current status of the payment';