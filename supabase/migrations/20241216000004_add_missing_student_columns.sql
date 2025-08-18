-- Add missing columns to students table for scholarship module
-- This migration only adds the missing columns that are needed for scholarship applications

-- Add missing columns to existing students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS university VARCHAR(200);
ALTER TABLE students ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2) CHECK (gpa >= 0.0 AND gpa <= 4.0);
ALTER TABLE students ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_students_university ON students(university);
CREATE INDEX IF NOT EXISTS idx_students_gpa ON students(gpa);

-- Update sample students with the new column data (only if they don't have university set)
UPDATE students 
SET 
    university = 'İstanbul Üniversitesi',
    gpa = 3.75,
    birth_date = '2002-05-15'
WHERE email = 'ahmet.yilmaz@university.edu' AND university IS NULL;

UPDATE students 
SET 
    university = 'Ankara Üniversitesi',
    gpa = 3.50,
    birth_date = '2001-08-22'
WHERE email = 'fatma.kaya@university.edu' AND university IS NULL;

UPDATE students 
SET 
    university = 'İzmir Teknoloji Enstitüsü',
    gpa = 3.25,
    birth_date = '2003-01-10'
WHERE email = 'mehmet.demir@university.edu' AND university IS NULL;

-- Insert sample students if they don't exist
INSERT INTO students (first_name, last_name, email, phone, student_number, university, department, gpa, birth_date, address)
SELECT 'Ahmet', 'Yılmaz', 'ahmet.yilmaz@university.edu', '+90 555 123 4567', 'STU2024001', 'İstanbul Üniversitesi', 'Bilgisayar Mühendisliği', 3.75, '2002-05-15', 'İstanbul, Türkiye'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE email = 'ahmet.yilmaz@university.edu');

INSERT INTO students (first_name, last_name, email, phone, student_number, university, department, gpa, birth_date, address)
SELECT 'Fatma', 'Kaya', 'fatma.kaya@university.edu', '+90 555 234 5678', 'STU2024002', 'Ankara Üniversitesi', 'Elektrik Mühendisliği', 3.50, '2001-08-22', 'Ankara, Türkiye'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE email = 'fatma.kaya@university.edu');

INSERT INTO students (first_name, last_name, email, phone, student_number, university, department, gpa, birth_date, address)
SELECT 'Mehmet', 'Demir', 'mehmet.demir@university.edu', '+90 555 345 6789', 'STU2024003', 'İzmir Teknoloji Enstitüsü', 'Makine Mühendisliği', 3.25, '2003-01-10', 'İzmir, Türkiye'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE email = 'mehmet.demir@university.edu');

-- Drop existing views to avoid conflicts and recreate them
DROP VIEW IF EXISTS student_scholarship_summary;
DROP VIEW IF EXISTS scholarship_statistics;
DROP VIEW IF EXISTS scholarship_payment_statistics;

-- Recreate the scholarship statistics views
CREATE VIEW scholarship_statistics AS
SELECT 
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_applications,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications,
    AVG(required_gpa) as average_required_gpa,
    AVG(family_income) as average_family_income
FROM scholarship_applications;

CREATE VIEW scholarship_payment_statistics AS
SELECT 
    COUNT(*) as total_payments,
    SUM(amount) as total_amount_paid,
    AVG(amount) as average_payment_amount,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments
FROM scholarship_payments;

CREATE VIEW student_scholarship_summary AS
SELECT 
    s.id as student_id,
    s.first_name,
    s.last_name,
    s.email,
    s.student_number,
    s.university,
    s.department,
    s.gpa,
    COUNT(sa.id) as total_applications,
    COUNT(CASE WHEN sa.status = 'approved' THEN 1 END) as approved_applications,
    COALESCE(SUM(sp.amount), 0) as total_scholarship_received
FROM students s
LEFT JOIN scholarship_applications sa ON s.id = sa.student_id
LEFT JOIN scholarship_payments sp ON sa.id = sp.application_id AND sp.status = 'completed'
GROUP BY s.id, s.first_name, s.last_name, s.email, s.student_number, s.university, s.department, s.gpa;

-- Grant permissions on the views
GRANT SELECT ON scholarship_statistics TO anon, authenticated;
GRANT SELECT ON scholarship_payment_statistics TO anon, authenticated;
GRANT SELECT ON student_scholarship_summary TO anon, authenticated;