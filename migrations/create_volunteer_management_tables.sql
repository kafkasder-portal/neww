-- Volunteer Management Tables for Charity Management System
-- This migration creates the necessary tables for volunteer management

-- Volunteers table (main volunteer profiles)
CREATE TABLE IF NOT EXISTS public.volunteers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Personal Information
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text NOT NULL,
    alternative_phone text,
    birth_date date,
    gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    national_id text,
    
    -- Address Information
    address text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    postal_code text,
    country text DEFAULT 'Turkey',
    
    -- Emergency Contact
    emergency_contact_name text NOT NULL,
    emergency_contact_phone text NOT NULL,
    emergency_contact_relation text NOT NULL,
    
    -- Volunteer Information
    volunteer_type text NOT NULL CHECK (volunteer_type IN ('regular', 'event_based', 'seasonal', 'professional', 'student')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated', 'blacklisted')),
    join_date date NOT NULL DEFAULT CURRENT_DATE,
    termination_date date,
    termination_reason text,
    
    -- Skills and Interests
    skills text[] DEFAULT '{}',
    interests text[] DEFAULT '{}',
    languages text[] DEFAULT '{}',
    education text,
    profession text,
    
    -- Availability
    availability_days text[] DEFAULT '{}', -- ['monday', 'tuesday', etc.]
    availability_time_slots jsonb DEFAULT '[]', -- Array of time slot objects
    max_hours_per_week integer,
    can_work_weekends boolean DEFAULT false,
    can_work_evenings boolean DEFAULT false,
    
    -- Experience and Training
    previous_volunteer_experience text,
    organization_experience text[] DEFAULT '{}',
    training_completed text[] DEFAULT '{}',
    certifications text[] DEFAULT '{}',
    
    -- Background Check
    background_check_required boolean DEFAULT false,
    background_check_completed boolean DEFAULT false,
    background_check_date date,
    background_check_expiry date,
    background_check_notes text,
    
    -- Preferences
    preferred_roles text[] DEFAULT '{}',
    preferred_departments text[] DEFAULT '{}',
    communication_preferences jsonb DEFAULT '{"email": true, "sms": false, "phone": false, "whatsapp": false}',
    newsletter_subscribed boolean DEFAULT true,
    
    -- Performance Metrics
    total_hours_worked numeric(10,2) DEFAULT 0.00,
    total_shifts_completed integer DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0.00,
    last_activity_date date,
    attendance_rate numeric(5,2) DEFAULT 100.00,
    
    -- Additional Information
    motivation text,
    notes text,
    tags text[] DEFAULT '{}',
    
    -- System Fields
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- Volunteer References table
CREATE TABLE IF NOT EXISTS public.volunteer_references (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    name text NOT NULL,
    organization text,
    position text,
    phone text NOT NULL,
    email text,
    relationship text NOT NULL,
    contacted boolean DEFAULT false,
    contacted_date date,
    contacted_by uuid REFERENCES auth.users(id),
    feedback text,
    recommendation text CHECK (recommendation IN ('excellent', 'good', 'satisfactory', 'not_recommended')),
    
    created_at timestamptz DEFAULT now()
);

-- Volunteer Applications table
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Applicant Information
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    
    -- Application Details
    application_date date NOT NULL DEFAULT CURRENT_DATE,
    preferred_roles text[] DEFAULT '{}',
    availability jsonb DEFAULT '[]', -- Array of time slot objects
    motivation text NOT NULL,
    experience text,
    skills text[] DEFAULT '{}',
    
    -- Application Status
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'interview_scheduled', 'approved', 'rejected', 'withdrawn')),
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamptz,
    review_notes text,
    rejection_reason text,
    
    -- Interview
    interview_scheduled boolean DEFAULT false,
    interview_date date,
    interview_time time,
    interview_type text CHECK (interview_type IN ('in_person', 'phone', 'video', 'group')),
    interviewer_name text,
    interview_notes text,
    interview_score integer CHECK (interview_score >= 0 AND interview_score <= 100),
    
    -- Decision
    decision_date date,
    decision_by uuid REFERENCES auth.users(id),
    approval_notes text,
    
    -- Follow-up
    orientation_scheduled boolean DEFAULT false,
    orientation_date date,
    onboarding_completed boolean DEFAULT false,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Volunteer Shifts table
CREATE TABLE IF NOT EXISTS public.volunteer_shifts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    
    -- Shift Details
    title text NOT NULL,
    description text,
    department text NOT NULL,
    location text NOT NULL,
    shift_type text NOT NULL CHECK (shift_type IN ('regular', 'event', 'emergency', 'training')),
    
    -- Scheduling
    shift_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    duration integer NOT NULL, -- in minutes
    
    -- Requirements
    required_skills text[] DEFAULT '{}',
    min_volunteers integer DEFAULT 1,
    max_volunteers integer DEFAULT 1,
    current_volunteers integer DEFAULT 0,
    
    -- Coordinator
    coordinator_id uuid REFERENCES auth.users(id),
    coordinator_name text,
    
    -- Status
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    cancellation_reason text,
    
    -- Check-in/Check-out
    checked_in boolean DEFAULT false,
    check_in_time timestamptz,
    checked_out boolean DEFAULT false,
    check_out_time timestamptz,
    actual_hours_worked numeric(5,2),
    
    -- Rating and Feedback
    performance_rating integer CHECK (performance_rating >= 1 AND performance_rating <= 5),
    feedback text,
    supervisor_feedback text,
    
    -- Additional Information
    notes text,
    attachments text[],
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Volunteer Shift Assignments table (many-to-many)
CREATE TABLE IF NOT EXISTS public.volunteer_shift_assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id uuid NOT NULL REFERENCES volunteer_shifts(id) ON DELETE CASCADE,
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    
    -- Assignment Details
    assigned_at timestamptz DEFAULT now(),
    assigned_by uuid REFERENCES auth.users(id),
    status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'checked_in', 'completed', 'no_show', 'cancelled')),
    
    -- Participation
    checked_in boolean DEFAULT false,
    check_in_time timestamptz,
    checked_out boolean DEFAULT false,
    check_out_time timestamptz,
    hours_worked numeric(5,2),
    
    -- Performance
    performance_rating integer CHECK (performance_rating >= 1 AND performance_rating <= 5),
    feedback text,
    supervisor_feedback text,
    
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(shift_id, volunteer_id)
);

-- Volunteer Trainings table
CREATE TABLE IF NOT EXISTS public.volunteer_trainings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Training Details
    title text NOT NULL,
    description text NOT NULL,
    training_type text NOT NULL CHECK (training_type IN ('orientation', 'skills', 'safety', 'leadership', 'specialized')),
    department text,
    
    -- Scheduling
    training_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    duration integer NOT NULL, -- in minutes
    location text NOT NULL,
    
    -- Training Content
    curriculum text[] DEFAULT '{}',
    materials text[] DEFAULT '{}',
    prerequisites text[] DEFAULT '{}',
    
    -- Capacity
    max_participants integer NOT NULL,
    current_participants integer DEFAULT 0,
    
    -- Instructor
    instructor_name text NOT NULL,
    instructor_id uuid REFERENCES auth.users(id),
    
    -- Status
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Requirements
    is_mandatory boolean DEFAULT false,
    certificate_issued boolean DEFAULT false,
    validity_period integer, -- in months
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Volunteer Training Enrollments table
CREATE TABLE IF NOT EXISTS public.volunteer_training_enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    training_id uuid NOT NULL REFERENCES volunteer_trainings(id) ON DELETE CASCADE,
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    
    -- Enrollment Details
    enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
    enrollment_status text NOT NULL DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'waitlisted', 'attended', 'no_show', 'cancelled')),
    
    -- Attendance
    attended boolean DEFAULT false,
    attendance_time timestamptz,
    
    -- Performance
    participation_score integer CHECK (participation_score >= 0 AND participation_score <= 100),
    test_score integer CHECK (test_score >= 0 AND test_score <= 100),
    passed boolean DEFAULT false,
    certificate_issued boolean DEFAULT false,
    certificate_date date,
    certificate_number text,
    
    -- Feedback
    feedback text,
    instructor_feedback text,
    
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(training_id, volunteer_id)
);

-- Volunteer Events table
CREATE TABLE IF NOT EXISTS public.volunteer_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Event Details
    title text NOT NULL,
    description text NOT NULL,
    event_type text NOT NULL CHECK (event_type IN ('fundraising', 'community_service', 'awareness', 'emergency_response', 'administrative')),
    
    -- Scheduling
    event_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    duration integer NOT NULL, -- in minutes
    
    -- Location
    location text NOT NULL,
    address text,
    
    -- Requirements
    required_volunteers integer NOT NULL,
    registered_volunteers integer DEFAULT 0,
    required_skills text[] DEFAULT '{}',
    minimum_age integer,
    
    -- Coordinator
    coordinator_id uuid NOT NULL REFERENCES auth.users(id),
    coordinator_name text NOT NULL,
    
    -- Status
    status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'open_registration', 'registration_closed', 'in_progress', 'completed', 'cancelled')),
    
    -- Registration
    registration_deadline date,
    allow_waitlist boolean DEFAULT false,
    
    -- Additional Information
    materials text[] DEFAULT '{}',
    instructions text,
    dress_code text,
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Volunteer Event Registrations table
CREATE TABLE IF NOT EXISTS public.volunteer_event_registrations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid NOT NULL REFERENCES volunteer_events(id) ON DELETE CASCADE,
    volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    
    -- Registration Details
    registration_date date NOT NULL DEFAULT CURRENT_DATE,
    registration_status text NOT NULL DEFAULT 'registered' CHECK (registration_status IN ('registered', 'waitlisted', 'confirmed', 'no_show', 'cancelled')),
    
    -- Participation
    attended boolean DEFAULT false,
    check_in_time timestamptz,
    check_out_time timestamptz,
    hours_worked numeric(5,2),
    
    -- Role Assignment
    assigned_role text,
    assigned_task text,
    
    -- Performance
    performance_rating integer CHECK (performance_rating >= 1 AND performance_rating <= 5),
    feedback text,
    supervisor_feedback text,
    
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(event_id, volunteer_id)
);

-- Volunteer Departments table
CREATE TABLE IF NOT EXISTS public.volunteer_departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text NOT NULL,
    
    -- Management
    manager_id uuid REFERENCES auth.users(id),
    manager_name text,
    coordinators text[] DEFAULT '{}',
    
    -- Volunteers
    active_volunteers integer DEFAULT 0,
    total_volunteers integer DEFAULT 0,
    
    -- Requirements
    required_skills text[] DEFAULT '{}',
    background_check_required boolean DEFAULT false,
    minimum_age integer,
    
    -- Status
    is_active boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Volunteer Roles table
CREATE TABLE IF NOT EXISTS public.volunteer_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    department text NOT NULL,
    
    -- Requirements
    required_skills text[] DEFAULT '{}',
    minimum_experience text,
    background_check_required boolean DEFAULT false,
    minimum_age integer,
    
    -- Time Commitment
    time_commitment text,
    expected_hours_per_week integer,
    
    -- Responsibilities
    responsibilities text[] DEFAULT '{}',
    
    -- Status
    is_active boolean DEFAULT true,
    positions_available integer DEFAULT 1,
    current_volunteers integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_volunteer_type ON volunteers(volunteer_type);
CREATE INDEX IF NOT EXISTS idx_volunteers_city ON volunteers(city);
CREATE INDEX IF NOT EXISTS idx_volunteers_skills ON volunteers USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_volunteers_join_date ON volunteers(join_date);

CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_date ON volunteer_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);

CREATE INDEX IF NOT EXISTS idx_volunteer_shifts_volunteer ON volunteer_shifts(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_shifts_date ON volunteer_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_shifts_status ON volunteer_shifts(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_shifts_department ON volunteer_shifts(department);

CREATE INDEX IF NOT EXISTS idx_shift_assignments_shift ON volunteer_shift_assignments(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_volunteer ON volunteer_shift_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_status ON volunteer_shift_assignments(status);

CREATE INDEX IF NOT EXISTS idx_volunteer_trainings_date ON volunteer_trainings(training_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_trainings_status ON volunteer_trainings(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_trainings_type ON volunteer_trainings(training_type);

CREATE INDEX IF NOT EXISTS idx_training_enrollments_training ON volunteer_training_enrollments(training_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_volunteer ON volunteer_training_enrollments(volunteer_id);

CREATE INDEX IF NOT EXISTS idx_volunteer_events_date ON volunteer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_events_status ON volunteer_events(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_events_coordinator ON volunteer_events(coordinator_id);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON volunteer_event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_volunteer ON volunteer_event_registrations(volunteer_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_applications_updated_at BEFORE UPDATE ON volunteer_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_shifts_updated_at BEFORE UPDATE ON volunteer_shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_shift_assignments_updated_at BEFORE UPDATE ON volunteer_shift_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_trainings_updated_at BEFORE UPDATE ON volunteer_trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_training_enrollments_updated_at BEFORE UPDATE ON volunteer_training_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_events_updated_at BEFORE UPDATE ON volunteer_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_event_registrations_updated_at BEFORE UPDATE ON volunteer_event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_departments_updated_at BEFORE UPDATE ON volunteer_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_roles_updated_at BEFORE UPDATE ON volunteer_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Volunteer Management Tables
-- Volunteers policies
CREATE POLICY "Everyone can view volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage volunteers" ON volunteers FOR ALL USING (auth.role() = 'authenticated');

-- References policies
CREATE POLICY "Everyone can view references" ON volunteer_references FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage references" ON volunteer_references FOR ALL USING (auth.role() = 'authenticated');

-- Applications policies
CREATE POLICY "Everyone can view applications" ON volunteer_applications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage applications" ON volunteer_applications FOR ALL USING (auth.role() = 'authenticated');

-- Shifts policies
CREATE POLICY "Everyone can view shifts" ON volunteer_shifts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage shifts" ON volunteer_shifts FOR ALL USING (auth.role() = 'authenticated');

-- Shift Assignments policies
CREATE POLICY "Everyone can view shift assignments" ON volunteer_shift_assignments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage assignments" ON volunteer_shift_assignments FOR ALL USING (auth.role() = 'authenticated');

-- Trainings policies
CREATE POLICY "Everyone can view trainings" ON volunteer_trainings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage trainings" ON volunteer_trainings FOR ALL USING (auth.role() = 'authenticated');

-- Training Enrollments policies
CREATE POLICY "Everyone can view enrollments" ON volunteer_training_enrollments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage enrollments" ON volunteer_training_enrollments FOR ALL USING (auth.role() = 'authenticated');

-- Events policies
CREATE POLICY "Everyone can view events" ON volunteer_events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage events" ON volunteer_events FOR ALL USING (auth.role() = 'authenticated');

-- Event Registrations policies
CREATE POLICY "Everyone can view registrations" ON volunteer_event_registrations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage registrations" ON volunteer_event_registrations FOR ALL USING (auth.role() = 'authenticated');

-- Departments policies
CREATE POLICY "Everyone can view departments" ON volunteer_departments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage departments" ON volunteer_departments FOR ALL USING (auth.role() = 'authenticated');

-- Roles policies
CREATE POLICY "Everyone can view roles" ON volunteer_roles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage roles" ON volunteer_roles FOR ALL USING (auth.role() = 'authenticated');

-- Create functions for volunteer management automation
CREATE OR REPLACE FUNCTION update_volunteer_stats_on_shift_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Update volunteer statistics when a shift is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE volunteers 
        SET 
            total_shifts_completed = total_shifts_completed + 1,
            total_hours_worked = total_hours_worked + COALESCE(NEW.actual_hours_worked, 0),
            last_activity_date = CURRENT_DATE,
            updated_at = now()
        WHERE id = NEW.volunteer_id;
        
        -- Update average rating if performance rating is provided
        IF NEW.performance_rating IS NOT NULL THEN
            UPDATE volunteers 
            SET 
                average_rating = (
                    SELECT AVG(performance_rating)::numeric(3,2)
                    FROM volunteer_shifts 
                    WHERE volunteer_id = NEW.volunteer_id 
                    AND performance_rating IS NOT NULL
                ),
                updated_at = now()
            WHERE id = NEW.volunteer_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for volunteer stats update
CREATE TRIGGER update_volunteer_stats_trigger
    AFTER UPDATE ON volunteer_shifts
    FOR EACH ROW EXECUTE FUNCTION update_volunteer_stats_on_shift_completion();

-- Function to calculate attendance rate
CREATE OR REPLACE FUNCTION calculate_attendance_rate(volunteer_id_param uuid)
RETURNS numeric AS $$
DECLARE
    total_assigned integer;
    total_attended integer;
    attendance_rate numeric;
BEGIN
    -- Count total assignments
    SELECT COUNT(*) INTO total_assigned
    FROM volunteer_shift_assignments
    WHERE volunteer_id = volunteer_id_param;
    
    -- Count attended assignments
    SELECT COUNT(*) INTO total_attended
    FROM volunteer_shift_assignments
    WHERE volunteer_id = volunteer_id_param
    AND status IN ('completed', 'checked_in');
    
    -- Calculate attendance rate
    IF total_assigned > 0 THEN
        attendance_rate := (total_attended::numeric / total_assigned::numeric) * 100;
    ELSE
        attendance_rate := 100; -- Default to 100% for new volunteers
    END IF;
    
    RETURN ROUND(attendance_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON TABLE volunteers IS 'Main volunteer profiles and information';
COMMENT ON TABLE volunteer_applications IS 'Volunteer applications and application process tracking';
COMMENT ON TABLE volunteer_shifts IS 'Individual volunteer work shifts';
COMMENT ON TABLE volunteer_shift_assignments IS 'Assignment of volunteers to shifts';
COMMENT ON TABLE volunteer_trainings IS 'Training programs for volunteers';
COMMENT ON TABLE volunteer_events IS 'Special events requiring volunteers';
COMMENT ON TABLE volunteer_departments IS 'Organizational departments that use volunteers';
COMMENT ON TABLE volunteer_roles IS 'Defined volunteer roles and responsibilities';

-- Insert sample departments
INSERT INTO volunteer_departments (name, description, required_skills, background_check_required) VALUES 
('Yardım Dağıtımı', 'İhtiyaç sahiplerine yardım malzemelerinin dağıtımı', ARRAY['communication', 'organization'], false),
('Bağış Toplama', 'Bağış toplama etkinlikleri ve kampanyalar', ARRAY['communication', 'sales', 'public_speaking'], false),
('Eğitim ve Öğretim', 'Eğitim programları ve kurslar', ARRAY['teaching', 'education'], true),
('Saha Çalışması', 'Saha araştırmaları ve ihtiyaç tespiti', ARRAY['research', 'communication'], false),
('İdari İşler', 'Ofis ve idari destek', ARRAY['administration', 'computer_skills'], false)
ON CONFLICT (name) DO NOTHING;

-- Insert sample volunteer roles
INSERT INTO volunteer_roles (title, description, department, required_skills, time_commitment, responsibilities) VALUES 
('Yardım Dağıtım Gönüllüsü', 'İhtiyaç sahiplerine yardım malzemelerinin dağıtımında görev alır', 'Yardım Dağıtımı', ARRAY['communication'], 'Haftalık 4-6 saat', ARRAY['Yardım malzemelerini hazırlama', 'İhtiyaç sahipleriyle iletişim', 'Dağıtım kayıtlarını tutma']),
('Bağış Toplama Koordinatörü', 'Bağış toplama etkinliklerinin organizasyonunda görev alır', 'Bağış Toplama', ARRAY['organization', 'communication'], 'Haftalık 6-8 saat', ARRAY['Etkinlik planlama', 'Gönüllü koordinasyonu', 'Bağışçılarla iletişim']),
('Eğitim Gönüllüsü', 'Eğitim programlarında öğretmen desteği sağlar', 'Eğitim ve Öğretim', ARRAY['teaching', 'patience'], 'Haftalık 3-5 saat', ARRAY['Ders desteği', 'Öğrenci takibi', 'Materyal hazırlama'])
ON CONFLICT DO NOTHING;
