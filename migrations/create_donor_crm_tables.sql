-- Donor CRM Tables for Charity Management System
-- This migration creates the necessary tables for donor relationship management

-- Donors table (main donor profiles)
CREATE TABLE IF NOT EXISTS public.donors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    donor_type text NOT NULL CHECK (donor_type IN ('individual', 'corporate', 'foundation', 'government')),
    title text, -- Mr., Mrs., Dr., etc.
    first_name text NOT NULL,
    last_name text NOT NULL,
    company_name text,
    position text, -- For corporate donors
    
    -- Contact Information
    email text NOT NULL UNIQUE,
    phone text,
    alternative_phone text,
    address text,
    city text,
    district text,
    postal_code text,
    country text DEFAULT 'Turkey',
    
    -- Digital Presence
    website text,
    social_media jsonb DEFAULT '{}', -- {facebook, twitter, linkedin, instagram}
    
    -- Donation Information
    total_donated numeric(15,2) DEFAULT 0.00,
    first_donation_date date,
    last_donation_date date,
    donation_count integer DEFAULT 0,
    average_donation_amount numeric(15,2) DEFAULT 0.00,
    largest_donation numeric(15,2) DEFAULT 0.00,
    preferred_payment_method text CHECK (preferred_payment_method IN ('bank_transfer', 'credit_card', 'cash', 'check', 'mobile_payment')),
    
    -- Segmentation & Classification
    donor_segment text CHECK (donor_segment IN ('major_donor', 'regular_donor', 'occasional_donor', 'first_time_donor', 'lapsed_donor')),
    donor_tier text DEFAULT 'standard' CHECK (donor_tier IN ('platinum', 'gold', 'silver', 'bronze', 'standard')),
    interests text[], -- Education, Health, Emergency Relief, etc.
    preferred_causes text[],
    
    -- Communication Preferences
    communication_preferences jsonb DEFAULT '{"email": true, "sms": false, "phone": false, "postal": false, "whatsapp": false}',
    newsletter_subscribed boolean DEFAULT true,
    communication_frequency text DEFAULT 'monthly' CHECK (communication_frequency IN ('weekly', 'monthly', 'quarterly', 'annually', 'event_based')),
    preferred_language text DEFAULT 'tr' CHECK (preferred_language IN ('tr', 'en', 'ar')),
    
    -- Tax & Legal
    tax_number text,
    is_eligible_for_tax_deduction boolean DEFAULT true,
    wants_tax_receipt boolean DEFAULT true,
    kvkk_consent boolean DEFAULT false,
    kvkk_consent_date date,
    
    -- Relationship & Engagement
    acquisition_source text CHECK (acquisition_source IN ('website', 'social_media', 'referral', 'event', 'direct_mail', 'telemarketing', 'walk_in')),
    referred_by text,
    assigned_to uuid REFERENCES auth.users(id),
    relationship_status text DEFAULT 'prospect' CHECK (relationship_status IN ('prospect', 'active', 'lapsed', 'churned', 'blacklisted')),
    last_contact_date date,
    next_follow_up_date date,
    
    -- Additional Information
    birth_date date,
    gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    occupation text,
    notes text,
    tags text[],
    
    -- System Fields
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- Donor Interactions table
CREATE TABLE IF NOT EXISTS public.donor_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    interaction_type text NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'event', 'letter', 'sms', 'social_media', 'website_visit')),
    subject text NOT NULL,
    description text NOT NULL,
    outcome text CHECK (outcome IN ('positive', 'neutral', 'negative', 'follow_up_required')),
    staff_member text NOT NULL,
    scheduled_date timestamptz,
    actual_date timestamptz NOT NULL,
    duration_minutes integer, -- Duration in minutes
    follow_up_required boolean DEFAULT false,
    follow_up_date date,
    attachments text[], -- File paths or URLs
    created_at timestamptz DEFAULT now()
);

-- Donor Campaigns table
CREATE TABLE IF NOT EXISTS public.donor_campaigns (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    campaign_type text NOT NULL CHECK (campaign_type IN ('fundraising', 'awareness', 'retention', 'acquisition', 'stewardship')),
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    start_date date NOT NULL,
    end_date date NOT NULL,
    target_amount numeric(15,2),
    raised_amount numeric(15,2) DEFAULT 0.00,
    target_donor_count integer,
    participant_count integer DEFAULT 0,
    
    -- Segmentation criteria
    target_segments text[],
    target_tiers text[],
    target_interests text[],
    
    -- Communication settings
    channels text[], -- email, sms, phone, postal, social_media
    message_template text,
    frequency text CHECK (frequency IN ('one_time', 'weekly', 'monthly')),
    
    -- Results tracking
    open_rate numeric(5,2),
    click_rate numeric(5,2),
    response_rate numeric(5,2),
    conversion_rate numeric(5,2),
    roi numeric(10,2),
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Donor Segments table
CREATE TABLE IF NOT EXISTS public.donor_segments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    criteria jsonb NOT NULL, -- Segmentation criteria as JSON
    donor_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Donor Tasks table
CREATE TABLE IF NOT EXISTS public.donor_tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    task_type text NOT NULL CHECK (task_type IN ('follow_up', 'thank_you', 'birthday_greeting', 'renewal_reminder', 'major_gift_ask', 'stewardship')),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title text NOT NULL,
    description text,
    due_date date NOT NULL,
    assigned_to uuid REFERENCES auth.users(id),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    completed_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Donor Communications table
CREATE TABLE IF NOT EXISTS public.donor_communications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    campaign_id uuid REFERENCES donor_campaigns(id),
    communication_type text NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone', 'postal', 'whatsapp')),
    subject text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    scheduled_date timestamptz,
    sent_date timestamptz,
    delivered_date timestamptz,
    opened_date timestamptz,
    clicked_date timestamptz,
    bounce_reason text,
    
    -- Tracking metrics
    opens integer DEFAULT 0,
    clicks integer DEFAULT 0,
    unsubscribed boolean DEFAULT false,
    complained boolean DEFAULT false,
    
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Donor Analytics table
CREATE TABLE IF NOT EXISTS public.donor_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    
    -- Donation patterns
    donation_frequency text CHECK (donation_frequency IN ('monthly', 'quarterly', 'annually', 'irregular')),
    seasonal_patterns jsonb DEFAULT '{"spring": 0, "summer": 0, "autumn": 0, "winter": 0}',
    monthly_patterns jsonb DEFAULT '{}', -- Monthly donation amounts
    
    -- Engagement metrics (0-100 scale)
    engagement_score integer DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
    responsiveness integer DEFAULT 0 CHECK (responsiveness >= 0 AND responsiveness <= 100),
    loyalty_score integer DEFAULT 0 CHECK (loyalty_score >= 0 AND loyalty_score <= 100),
    
    -- Risk assessment
    churn_risk text DEFAULT 'low' CHECK (churn_risk IN ('low', 'medium', 'high')),
    upgrade_opportunity text DEFAULT 'low' CHECK (upgrade_opportunity IN ('low', 'medium', 'high')),
    
    -- Predictions
    next_donation_prediction jsonb, -- {date, amount, confidence}
    
    -- Lifetime value
    current_ltv numeric(15,2) DEFAULT 0.00,
    predicted_ltv numeric(15,2) DEFAULT 0.00,
    
    last_calculated timestamptz DEFAULT now(),
    
    UNIQUE(donor_id)
);

-- Campaign Participants table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.campaign_participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id uuid NOT NULL REFERENCES donor_campaigns(id) ON DELETE CASCADE,
    donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    participated_at timestamptz DEFAULT now(),
    response text CHECK (response IN ('positive', 'negative', 'no_response')),
    donation_amount numeric(15,2) DEFAULT 0.00,
    notes text,
    
    UNIQUE(campaign_id, donor_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_type ON donors(donor_type);
CREATE INDEX IF NOT EXISTS idx_donors_tier ON donors(donor_tier);
CREATE INDEX IF NOT EXISTS idx_donors_status ON donors(relationship_status);
CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_total_donated ON donors(total_donated);
CREATE INDEX IF NOT EXISTS idx_donors_last_donation ON donors(last_donation_date);
CREATE INDEX IF NOT EXISTS idx_donors_created ON donors(created_at);

CREATE INDEX IF NOT EXISTS idx_interactions_donor ON donor_interactions(donor_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON donor_interactions(actual_date);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON donor_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON donor_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON donor_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON donor_campaigns(campaign_type);

CREATE INDEX IF NOT EXISTS idx_tasks_donor ON donor_tasks(donor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON donor_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON donor_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON donor_tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_communications_donor ON donor_communications(donor_id);
CREATE INDEX IF NOT EXISTS idx_communications_campaign ON donor_communications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_communications_type ON donor_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_communications_status ON donor_communications(status);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donor_campaigns_updated_at BEFORE UPDATE ON donor_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donor_segments_updated_at BEFORE UPDATE ON donor_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Donor CRM Tables
-- Donors policies
CREATE POLICY "Everyone can view donors" ON donors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage donors" ON donors FOR ALL USING (auth.role() = 'authenticated');

-- Donor Interactions policies
CREATE POLICY "Everyone can view donor interactions" ON donor_interactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage interactions" ON donor_interactions FOR ALL USING (auth.role() = 'authenticated');

-- Campaigns policies
CREATE POLICY "Everyone can view campaigns" ON donor_campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage campaigns" ON donor_campaigns FOR ALL USING (auth.role() = 'authenticated');

-- Segments policies
CREATE POLICY "Everyone can view segments" ON donor_segments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage segments" ON donor_segments FOR ALL USING (auth.role() = 'authenticated');

-- Tasks policies
CREATE POLICY "Everyone can view tasks" ON donor_tasks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tasks" ON donor_tasks FOR ALL USING (auth.role() = 'authenticated');

-- Communications policies
CREATE POLICY "Everyone can view communications" ON donor_communications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage communications" ON donor_communications FOR ALL USING (auth.role() = 'authenticated');

-- Analytics policies
CREATE POLICY "Everyone can view analytics" ON donor_analytics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage analytics" ON donor_analytics FOR ALL USING (auth.role() = 'authenticated');

-- Campaign Participants policies
CREATE POLICY "Everyone can view campaign participants" ON campaign_participants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage participants" ON campaign_participants FOR ALL USING (auth.role() = 'authenticated');

-- Create functions for automatic donor tier calculation
CREATE OR REPLACE FUNCTION calculate_donor_tier(total_donated numeric)
RETURNS text AS $$
BEGIN
    IF total_donated >= 100000 THEN
        RETURN 'platinum';
    ELSIF total_donated >= 50000 THEN
        RETURN 'gold';
    ELSIF total_donated >= 25000 THEN
        RETURN 'silver';
    ELSIF total_donated >= 10000 THEN
        RETURN 'bronze';
    ELSE
        RETURN 'standard';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to update donor statistics
CREATE OR REPLACE FUNCTION update_donor_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called when donations are added/updated
    -- Update total_donated, donation_count, average_donation_amount, etc.
    -- Implementation would depend on how donations are structured
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to assess donor churn risk
CREATE OR REPLACE FUNCTION assess_churn_risk(donor_id uuid)
RETURNS text AS $$
DECLARE
    days_since_last_donation integer;
    avg_donation_interval numeric;
    result text;
BEGIN
    -- Get days since last donation
    SELECT EXTRACT(DAYS FROM (NOW() - last_donation_date))
    INTO days_since_last_donation
    FROM donors 
    WHERE id = donor_id;
    
    -- Simple churn risk assessment
    IF days_since_last_donation IS NULL OR days_since_last_donation > 365 THEN
        result := 'high';
    ELSIF days_since_last_donation > 180 THEN
        result := 'medium';
    ELSE
        result := 'low';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON TABLE donors IS 'Main donor profiles and contact information';
COMMENT ON TABLE donor_interactions IS 'Track all interactions with donors';
COMMENT ON TABLE donor_campaigns IS 'Marketing and fundraising campaigns';
COMMENT ON TABLE donor_segments IS 'Donor segmentation for targeted campaigns';
COMMENT ON TABLE donor_tasks IS 'Follow-up tasks and reminders for donor management';
COMMENT ON TABLE donor_communications IS 'Track all communications sent to donors';
COMMENT ON TABLE donor_analytics IS 'Advanced analytics and predictions for donor behavior';
COMMENT ON TABLE campaign_participants IS 'Track which donors participated in which campaigns';

-- Insert some sample donor segments
INSERT INTO donor_segments (name, description, criteria, is_active) VALUES 
('Major Donors', 'Donors who have given more than 50,000 TL', '{"totalDonatedMin": 50000}', true),
('Recent Donors', 'Donors who gave in the last 3 months', '{"daysSinceLastDonationMax": 90}', true),
('Corporate Donors', 'All corporate and foundation donors', '{"donorType": ["corporate", "foundation"]}', true),
('High Value Prospects', 'Prospects with high engagement scores', '{"relationshipStatus": ["prospect"], "engagementScoreMin": 70}', true),
('Lapsed Donors', 'Donors who haven\'t given in over a year', '{"daysSinceLastDonationMin": 365}', true)
ON CONFLICT DO NOTHING;
