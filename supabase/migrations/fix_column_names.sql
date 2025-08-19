-- Fix column name inconsistencies between tables and policies
-- This migration aligns column names to match existing table structure

-- Update meetings table to use consistent column naming
-- The existing table uses 'created_by' but policies expect 'organizer_id'
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);

-- Copy data from created_by to organizer_id if organizer_id is null
UPDATE public.meetings 
SET organizer_id = created_by 
WHERE organizer_id IS NULL;

-- Make organizer_id NOT NULL
ALTER TABLE public.meetings 
ALTER COLUMN organizer_id SET NOT NULL;

-- Update meeting_participants table structure if needed
-- Check if we need to add any missing columns
ALTER TABLE public.meeting_participants 
ADD COLUMN IF NOT EXISTS response_status VARCHAR(20) DEFAULT 'pending';

ALTER TABLE public.meeting_participants 
ADD COLUMN IF NOT EXISTS attendance_status VARCHAR(20) DEFAULT 'not_started';

ALTER TABLE public.meeting_participants 
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.meeting_participants 
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

-- Update meeting_agenda table name if it exists as meeting_agenda_items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meeting_agenda' AND table_schema = 'public') THEN
        -- Rename meeting_agenda to meeting_agenda_items if needed
        ALTER TABLE public.meeting_agenda RENAME TO meeting_agenda_items_temp;
        
        -- Create the expected table structure
        CREATE TABLE IF NOT EXISTS public.meeting_agenda_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            presenter_id UUID REFERENCES auth.users(id),
            duration_minutes INTEGER,
            order_index INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Copy data from old table to new table
        INSERT INTO public.meeting_agenda_items (id, meeting_id, title, description, duration_minutes, order_index)
        SELECT id, meeting_id, title, description, duration_minutes, order_index
        FROM public.meeting_agenda_items_temp;
        
        -- Drop the old table
        DROP TABLE public.meeting_agenda_items_temp;
    END IF;
END $$;

-- Update meeting_minutes table name if it exists as meeting_notes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meeting_notes' AND table_schema = 'public') THEN
        -- Add missing columns to meeting_notes if they don't exist
        ALTER TABLE public.meeting_notes 
        ADD COLUMN IF NOT EXISTS content TEXT;
        
        -- Update content from existing columns if needed
        UPDATE public.meeting_notes 
        SET content = COALESCE(content, '')
        WHERE content IS NULL;
    END IF;
END $$;

-- Ensure all required indexes exist
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON public.meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_response_status ON public.meeting_participants(response_status);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_attendance_status ON public.meeting_participants(attendance_status);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_agenda_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_action_items TO authenticated;