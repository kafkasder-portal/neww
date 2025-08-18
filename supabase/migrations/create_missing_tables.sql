-- Create missing tables and fix permissions
-- This migration creates tables that are referenced but don't exist

-- Create students table (referenced in fix_permissions.sql)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_number VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
    grade_level VARCHAR(10),
    department VARCHAR(100),
    advisor_id UUID REFERENCES public.user_profiles(id),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_categories table (referenced in fix_permissions.sql)
CREATE TABLE IF NOT EXISTS public.task_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to tasks table if it doesn't exist
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.task_categories(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_number ON public.students(student_number);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_date ON public.students(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_task_categories_name ON public.task_categories(name);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON public.tasks(category_id);

-- Enable RLS on new tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students table
CREATE POLICY "Users can view their own student record" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all student records" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update their own student record" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all student records" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for task_categories table
CREATE POLICY "Everyone can view active task categories" ON public.task_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage task categories" ON public.task_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert some default task categories
INSERT INTO public.task_categories (name, description, color, icon) VALUES
('Genel', 'Genel görevler', '#6B7280', 'folder'),
('Geliştirme', 'Yazılım geliştirme görevleri', '#3B82F6', 'code'),
('Tasarım', 'UI/UX tasarım görevleri', '#8B5CF6', 'palette'),
('Test', 'Test ve kalite kontrol görevleri', '#10B981', 'check-circle'),
('Dokümantasyon', 'Dokümantasyon görevleri', '#F59E0B', 'book-open'),
('Acil', 'Acil müdahale gerektiren görevler', '#EF4444', 'alert-triangle')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions to anon role for new tables
GRANT SELECT ON public.students TO anon;
GRANT SELECT ON public.task_categories TO anon;

-- Grant full permissions to authenticated role for new tables
GRANT ALL PRIVILEGES ON public.students TO authenticated;
GRANT ALL PRIVILEGES ON public.task_categories TO authenticated;

-- Update existing tasks to have a default category
UPDATE public.tasks 
SET category_id = (
    SELECT id FROM public.task_categories 
    WHERE name = 'Genel' 
    LIMIT 1
)
WHERE category_id IS NULL;