-- Recurring Donations Tables for Charity Management System
-- This migration creates the necessary tables for recurring donation management

-- Recurring Donations table (main subscription records)
CREATE TABLE IF NOT EXISTS public.recurring_donations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
    
    -- Subscription Details
    subscription_name text NOT NULL,
    description text,
    amount numeric(15,2) NOT NULL CHECK (amount > 0),
    currency text NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    
    -- Frequency and Scheduling
    frequency text NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'annually')),
    interval_count integer NOT NULL DEFAULT 1 CHECK (interval_count > 0),
    start_date date NOT NULL,
    end_date date, -- Optional end date
    next_process_date date NOT NULL,
    
    -- Payment Information
    payment_method text NOT NULL CHECK (payment_method IN ('credit_card', 'bank_transfer', 'direct_debit', 'mobile_payment')),
    payment_details jsonb DEFAULT '{}', -- Store encrypted payment details/tokens
    
    -- Status and Lifecycle
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'failed', 'completed')),
    pause_reason text,
    cancellation_reason text,
    retry_count integer DEFAULT 0,
    max_retries integer DEFAULT 3,
    
    -- Tracking and Statistics
    total_collected numeric(15,2) DEFAULT 0.00,
    successful_payments integer DEFAULT 0,
    failed_payments integer DEFAULT 0,
    last_payment_date date,
    last_payment_amount numeric(15,2),
    last_failure_date date,
    last_failure_reason text,
    
    -- Donor Communication
    send_receipts boolean DEFAULT true,
    send_reminders boolean DEFAULT true,
    reminder_days_before integer DEFAULT 3,
    
    -- Tax and Legal
    is_tax_deductible boolean DEFAULT true,
    generate_tax_receipts boolean DEFAULT true,
    
    -- Additional Settings
    allow_amount_changes boolean DEFAULT true,
    allow_frequency_changes boolean DEFAULT true,
    allow_pausing boolean DEFAULT true,
    
    -- Campaign Association
    campaign_id uuid,
    fund_id text,
    project_id text,
    
    -- System Fields
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- Recurring Donation Payments table (individual payment records)
CREATE TABLE IF NOT EXISTS public.recurring_donation_payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recurring_donation_id uuid NOT NULL REFERENCES recurring_donations(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount numeric(15,2) NOT NULL,
    currency text NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    exchange_rate numeric(10,4) DEFAULT 1.0000,
    base_amount numeric(15,2) NOT NULL, -- Amount in organization's base currency
    
    -- Processing Information
    scheduled_date date NOT NULL,
    processed_date timestamptz,
    attempt_number integer DEFAULT 1,
    
    -- Payment Provider Response
    payment_provider_transaction_id text,
    payment_provider_response jsonb,
    
    -- Status and Results
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed', 'refunded')),
    failure_reason text,
    
    -- Financial Records
    donation_id uuid, -- Links to main donations table when created
    receipt_generated boolean DEFAULT false,
    receipt_sent boolean DEFAULT false,
    
    -- System Fields
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Recurring Donation Reminders table
CREATE TABLE IF NOT EXISTS public.recurring_donation_reminders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recurring_donation_id uuid NOT NULL REFERENCES recurring_donations(id) ON DELETE CASCADE,
    
    -- Reminder Details
    reminder_type text NOT NULL CHECK (reminder_type IN ('upcoming_payment', 'payment_failed', 'payment_success', 'subscription_ending')),
    scheduled_date date NOT NULL,
    sent_date timestamptz,
    
    -- Communication
    recipient_email text NOT NULL,
    recipient_phone text,
    subject text NOT NULL,
    message text NOT NULL,
    communication_channel text NOT NULL CHECK (communication_channel IN ('email', 'sms', 'whatsapp', 'push_notification')),
    
    -- Status
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
    failure_reason text,
    
    -- Tracking
    opened boolean DEFAULT false,
    clicked boolean DEFAULT false,
    opened_at timestamptz,
    clicked_at timestamptz,
    
    created_at timestamptz DEFAULT now()
);

-- Recurring Donation Campaigns table
CREATE TABLE IF NOT EXISTS public.recurring_donation_campaigns (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    
    -- Campaign Details
    campaign_type text NOT NULL CHECK (campaign_type IN ('general', 'emergency', 'project_specific', 'memorial', 'seasonal')),
    target_amount numeric(15,2),
    raised_amount numeric(15,2) DEFAULT 0.00,
    subscriber_count integer DEFAULT 0,
    active_subscriber_count integer DEFAULT 0,
    
    -- Suggested Amounts and Frequencies
    suggested_amounts numeric(15,2)[],
    suggested_frequencies text[],
    default_amount numeric(15,2),
    default_frequency text CHECK (default_frequency IN ('weekly', 'monthly', 'quarterly', 'annually')),
    
    -- Campaign Period
    start_date date NOT NULL,
    end_date date,
    
    -- Communication Settings
    welcome_email_template text,
    reminder_email_template text,
    thankyou_email_template text,
    
    -- Status
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    
    -- Analytics
    conversion_rate numeric(5,2),
    average_subscription_value numeric(15,2),
    churn_rate numeric(5,2),
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Recurring Donation Perks table
CREATE TABLE IF NOT EXISTS public.recurring_donation_perks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id uuid NOT NULL REFERENCES recurring_donation_campaigns(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text NOT NULL,
    minimum_amount numeric(15,2) NOT NULL,
    minimum_frequency text CHECK (minimum_frequency IN ('weekly', 'monthly', 'quarterly', 'annually')),
    benefits text[],
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now()
);

-- Subscription Management table (for change requests)
CREATE TABLE IF NOT EXISTS public.subscription_management (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recurring_donation_id uuid NOT NULL REFERENCES recurring_donations(id) ON DELETE CASCADE,
    
    -- Change Request Details
    change_type text NOT NULL CHECK (change_type IN ('amount', 'frequency', 'payment_method', 'pause', 'cancel')),
    requested_date timestamptz NOT NULL,
    effective_date timestamptz NOT NULL,
    
    -- Change Details
    old_value jsonb,
    new_value jsonb,
    reason text,
    
    -- Approval Workflow
    requires_approval boolean DEFAULT false,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    rejection_reason text,
    
    -- Status
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
    
    -- Communication
    donor_notified boolean DEFAULT false,
    notification_sent_at timestamptz,
    
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Payment Provider Configurations table
CREATE TABLE IF NOT EXISTS public.payment_provider_configs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id text NOT NULL UNIQUE,
    provider_name text NOT NULL,
    api_key text NOT NULL,
    api_secret text NOT NULL,
    webhook_secret text,
    sandbox_mode boolean DEFAULT true,
    supported_currencies text[],
    supported_payment_methods text[],
    fees jsonb DEFAULT '{"percentage": 0, "fixedAmount": 0, "currency": "TRY"}',
    is_active boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Payment Webhooks table (for payment provider callbacks)
CREATE TABLE IF NOT EXISTS public.payment_webhooks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id text NOT NULL,
    event_type text NOT NULL,
    event_data jsonb NOT NULL,
    recurring_donation_id uuid REFERENCES recurring_donations(id),
    payment_id uuid REFERENCES recurring_donation_payments(id),
    processed_at timestamptz,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    retry_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recurring_donations_donor ON recurring_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_status ON recurring_donations(status);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_next_process ON recurring_donations(next_process_date);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_campaign ON recurring_donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_created ON recurring_donations(created_at);

CREATE INDEX IF NOT EXISTS idx_recurring_payments_subscription ON recurring_donation_payments(recurring_donation_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_scheduled ON recurring_donation_payments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_status ON recurring_donation_payments(status);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_provider_txn ON recurring_donation_payments(payment_provider_transaction_id);

CREATE INDEX IF NOT EXISTS idx_recurring_reminders_subscription ON recurring_donation_reminders(recurring_donation_id);
CREATE INDEX IF NOT EXISTS idx_recurring_reminders_scheduled ON recurring_donation_reminders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_recurring_reminders_status ON recurring_donation_reminders(status);

CREATE INDEX IF NOT EXISTS idx_recurring_campaigns_status ON recurring_donation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_recurring_campaigns_dates ON recurring_donation_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_subscription_management_recurring ON subscription_management(recurring_donation_id);
CREATE INDEX IF NOT EXISTS idx_subscription_management_status ON subscription_management(status);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_provider ON payment_webhooks(provider_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_status ON payment_webhooks(status);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_recurring ON payment_webhooks(recurring_donation_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_recurring_donations_updated_at BEFORE UPDATE ON recurring_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_donation_payments_updated_at BEFORE UPDATE ON recurring_donation_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_donation_campaigns_updated_at BEFORE UPDATE ON recurring_donation_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_provider_configs_updated_at BEFORE UPDATE ON payment_provider_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE recurring_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donation_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donation_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donation_perks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Recurring Donations Tables
-- Recurring Donations policies
CREATE POLICY "Everyone can view recurring donations" ON recurring_donations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage recurring donations" ON recurring_donations FOR ALL USING (auth.role() = 'authenticated');

-- Payments policies
CREATE POLICY "Everyone can view recurring payments" ON recurring_donation_payments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage payments" ON recurring_donation_payments FOR ALL USING (auth.role() = 'authenticated');

-- Reminders policies
CREATE POLICY "Everyone can view reminders" ON recurring_donation_reminders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage reminders" ON recurring_donation_reminders FOR ALL USING (auth.role() = 'authenticated');

-- Campaigns policies
CREATE POLICY "Everyone can view campaigns" ON recurring_donation_campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage campaigns" ON recurring_donation_campaigns FOR ALL USING (auth.role() = 'authenticated');

-- Perks policies
CREATE POLICY "Everyone can view perks" ON recurring_donation_perks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage perks" ON recurring_donation_perks FOR ALL USING (auth.role() = 'authenticated');

-- Subscription Management policies
CREATE POLICY "Everyone can view subscription changes" ON subscription_management FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage subscription changes" ON subscription_management FOR ALL USING (auth.role() = 'authenticated');

-- Payment Provider Configs policies (restricted)
CREATE POLICY "Admins can view payment configs" ON payment_provider_configs FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Admins can manage payment configs" ON payment_provider_configs FOR ALL USING (auth.role() = 'service_role');

-- Webhooks policies
CREATE POLICY "Service role can manage webhooks" ON payment_webhooks FOR ALL USING (auth.role() = 'service_role');

-- Create functions for recurring donation automation
CREATE OR REPLACE FUNCTION calculate_next_process_date(
    current_date date,
    frequency text,
    interval_count integer
) RETURNS date AS $$
BEGIN
    CASE frequency
        WHEN 'weekly' THEN
            RETURN current_date + (interval_count * interval '1 week');
        WHEN 'monthly' THEN
            RETURN current_date + (interval_count * interval '1 month');
        WHEN 'quarterly' THEN
            RETURN current_date + (interval_count * interval '3 months');
        WHEN 'annually' THEN
            RETURN current_date + (interval_count * interval '1 year');
        ELSE
            RETURN current_date + interval '1 month';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update campaign statistics
CREATE OR REPLACE FUNCTION update_campaign_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update subscriber counts when recurring donation is added/updated
    IF TG_OP = 'INSERT' THEN
        UPDATE recurring_donation_campaigns 
        SET 
            subscriber_count = subscriber_count + 1,
            active_subscriber_count = CASE WHEN NEW.status = 'active' THEN active_subscriber_count + 1 ELSE active_subscriber_count END,
            updated_at = now()
        WHERE id = NEW.campaign_id AND NEW.campaign_id IS NOT NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status != NEW.status AND NEW.campaign_id IS NOT NULL THEN
            UPDATE recurring_donation_campaigns 
            SET 
                active_subscriber_count = active_subscriber_count + 
                    CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END -
                    CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END,
                updated_at = now()
            WHERE id = NEW.campaign_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE recurring_donation_campaigns 
        SET 
            subscriber_count = subscriber_count - 1,
            active_subscriber_count = CASE WHEN OLD.status = 'active' THEN active_subscriber_count - 1 ELSE active_subscriber_count END,
            updated_at = now()
        WHERE id = OLD.campaign_id AND OLD.campaign_id IS NOT NULL;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign statistics
CREATE TRIGGER update_campaign_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON recurring_donations
    FOR EACH ROW EXECUTE FUNCTION update_campaign_statistics();

-- Function to schedule payment reminders
CREATE OR REPLACE FUNCTION schedule_payment_reminder(
    recurring_donation_id uuid,
    reminder_type text,
    days_before integer DEFAULT 3
) RETURNS void AS $$
DECLARE
    subscription_record recurring_donations%ROWTYPE;
    reminder_date date;
BEGIN
    -- Get subscription details
    SELECT * INTO subscription_record 
    FROM recurring_donations 
    WHERE id = recurring_donation_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Calculate reminder date
    reminder_date := subscription_record.next_process_date - (days_before || ' days')::interval;
    
    -- Only schedule if reminder date is in the future
    IF reminder_date > CURRENT_DATE THEN
        INSERT INTO recurring_donation_reminders (
            recurring_donation_id,
            reminder_type,
            scheduled_date,
            recipient_email,
            subject,
            message,
            communication_channel
        ) VALUES (
            recurring_donation_id,
            reminder_type,
            reminder_date,
            'donor@example.com', -- This should be fetched from donor record
            'Upcoming Payment Reminder',
            'Your recurring donation payment is scheduled for ' || subscription_record.next_process_date,
            'email'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON TABLE recurring_donations IS 'Main recurring donation subscriptions';
COMMENT ON TABLE recurring_donation_payments IS 'Individual payment records for recurring donations';
COMMENT ON TABLE recurring_donation_reminders IS 'Automated reminders and notifications';
COMMENT ON TABLE recurring_donation_campaigns IS 'Marketing campaigns for recurring donations';
COMMENT ON TABLE subscription_management IS 'Track subscription change requests and approvals';
COMMENT ON TABLE payment_provider_configs IS 'Payment provider configurations and credentials';
COMMENT ON TABLE payment_webhooks IS 'Webhook events from payment providers';

-- Insert sample payment provider configurations
INSERT INTO payment_provider_configs (
    provider_id, provider_name, api_key, api_secret, webhook_secret, 
    sandbox_mode, supported_currencies, supported_payment_methods
) VALUES 
('iyzico', 'Iyzico', 'sample_api_key', 'sample_api_secret', 'webhook_secret', 
 true, ARRAY['TRY', 'USD', 'EUR'], ARRAY['credit_card']),
('paytr', 'PayTR', 'sample_merchant_id', 'sample_merchant_key', 'merchant_salt', 
 true, ARRAY['TRY'], ARRAY['credit_card', 'bank_transfer']),
('stripe', 'Stripe', 'sk_test_...', 'pk_test_...', 'whsec_...', 
 true, ARRAY['TRY', 'USD', 'EUR'], ARRAY['credit_card'])
ON CONFLICT (provider_id) DO NOTHING;

-- Insert sample recurring donation campaign
INSERT INTO recurring_donation_campaigns (
    name, description, campaign_type, target_amount, 
    suggested_amounts, suggested_frequencies, default_amount, default_frequency,
    start_date, status
) VALUES 
('Monthly Supporters', 'Become a monthly supporter and help us make a consistent impact', 'general', 100000.00,
 ARRAY[50.00, 100.00, 250.00, 500.00, 1000.00], ARRAY['monthly', 'quarterly', 'annually'], 100.00, 'monthly',
 CURRENT_DATE, 'active'),
('Emergency Relief Fund', 'Monthly contributions for emergency response', 'emergency', 50000.00,
 ARRAY[25.00, 50.00, 100.00, 200.00], ARRAY['monthly'], 50.00, 'monthly',
 CURRENT_DATE, 'active')
ON CONFLICT DO NOTHING;
