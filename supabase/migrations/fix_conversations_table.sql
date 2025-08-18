-- Fix conversations table structure
-- Add missing columns and fix column name mismatches

-- Add missing description column
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add type column as alias for conversation_type to maintain compatibility
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS type TEXT;

-- Update type column to match conversation_type values
UPDATE public.conversations 
SET type = conversation_type 
WHERE type IS NULL;

-- Add constraint to type column
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_type_check 
CHECK (type IN ('direct', 'group', 'announcement', 'support'))
NOT VALID;

-- Validate the constraint
ALTER TABLE public.conversations 
VALIDATE CONSTRAINT conversations_type_check;

-- Create a trigger to keep type and conversation_type in sync
CREATE OR REPLACE FUNCTION sync_conversation_type()
RETURNS TRIGGER AS $$
BEGIN
    -- If type is updated, update conversation_type
    IF NEW.type IS DISTINCT FROM OLD.type THEN
        NEW.conversation_type = NEW.type;
    END IF;
    
    -- If conversation_type is updated, update type
    IF NEW.conversation_type IS DISTINCT FROM OLD.conversation_type THEN
        NEW.type = NEW.conversation_type;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sync
DROP TRIGGER IF EXISTS sync_conversation_type_trigger ON public.conversations;
CREATE TRIGGER sync_conversation_type_trigger
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION sync_conversation_type();

-- Set default values for existing records
UPDATE public.conversations 
SET description = 'Varsayılan açıklama'
WHERE description IS NULL;

UPDATE public.conversations 
SET type = COALESCE(conversation_type, 'direct')
WHERE type IS NULL;