-- Create missing meeting-related tables

-- Create meeting_notes table
CREATE TABLE IF NOT EXISTS public.meeting_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_by uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create meeting_participants table
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'participant' CHECK (role IN ('organizer', 'participant', 'presenter', 'observer')),
    response_status text NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'declined', 'tentative')),
    joined_at timestamp with time zone,
    left_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(meeting_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_id ON public.meeting_notes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_created_by ON public.meeting_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user_id ON public.meeting_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_response_status ON public.meeting_participants(response_status);

-- Enable RLS
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meeting_notes
CREATE POLICY "Users can view meeting notes for meetings they participate in" ON public.meeting_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meeting_participants mp 
            WHERE mp.meeting_id = meeting_notes.meeting_id 
            AND mp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create meeting notes for meetings they participate in" ON public.meeting_notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meeting_participants mp 
            WHERE mp.meeting_id = meeting_notes.meeting_id 
            AND mp.user_id = auth.uid()
        )
        AND created_by = auth.uid()
    );

CREATE POLICY "Users can update their own meeting notes" ON public.meeting_notes
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own meeting notes" ON public.meeting_notes
    FOR DELETE USING (created_by = auth.uid());

-- Create RLS policies for meeting_participants
CREATE POLICY "Users can view meeting participants for meetings they participate in" ON public.meeting_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.meeting_participants mp 
            WHERE mp.meeting_id = meeting_participants.meeting_id 
            AND mp.user_id = auth.uid()
        )
    );

CREATE POLICY "Meeting organizers can manage participants" ON public.meeting_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.meetings m 
            WHERE m.id = meeting_participants.meeting_id 
            AND m.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update their own participation status" ON public.meeting_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Grant permissions to roles
GRANT SELECT ON public.meeting_notes TO anon;
GRANT ALL PRIVILEGES ON public.meeting_notes TO authenticated;

GRANT SELECT ON public.meeting_participants TO anon;
GRANT ALL PRIVILEGES ON public.meeting_participants TO authenticated;

-- Create updated_at trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_meeting_notes_updated_at BEFORE UPDATE ON public.meeting_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_participants_updated_at BEFORE UPDATE ON public.meeting_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();