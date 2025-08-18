-- Donations Module Migration
-- Creates tables for donation management system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create donation_types table
CREATE TABLE IF NOT EXISTS donation_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    donation_type_id UUID NOT NULL REFERENCES donation_types(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'TRY',
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'bank_transfer', 'cash', 'paypal', 'stripe')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_created_at ON donors(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_type_id ON donations(donation_type_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_donation_id ON payment_transactions(donation_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_donation_types_updated_at BEFORE UPDATE ON donation_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE donation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- donation_types policies
CREATE POLICY "donation_types_select_policy" ON donation_types FOR SELECT USING (true);
CREATE POLICY "donation_types_insert_policy" ON donation_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "donation_types_update_policy" ON donation_types FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "donation_types_delete_policy" ON donation_types FOR DELETE USING (auth.role() = 'authenticated');

-- donors policies
CREATE POLICY "donors_select_policy" ON donors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "donors_insert_policy" ON donors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "donors_update_policy" ON donors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "donors_delete_policy" ON donors FOR DELETE USING (auth.role() = 'authenticated');

-- donations policies
CREATE POLICY "donations_select_policy" ON donations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "donations_insert_policy" ON donations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "donations_update_policy" ON donations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "donations_delete_policy" ON donations FOR DELETE USING (auth.role() = 'authenticated');

-- payment_transactions policies
CREATE POLICY "payment_transactions_select_policy" ON payment_transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "payment_transactions_insert_policy" ON payment_transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "payment_transactions_update_policy" ON payment_transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "payment_transactions_delete_policy" ON payment_transactions FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions to roles
GRANT SELECT ON donation_types TO anon;
GRANT ALL PRIVILEGES ON donation_types TO authenticated;
GRANT ALL PRIVILEGES ON donors TO authenticated;
GRANT ALL PRIVILEGES ON donations TO authenticated;
GRANT ALL PRIVILEGES ON payment_transactions TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert default donation types
INSERT INTO donation_types (name, description) VALUES
('Genel Bağış', 'Genel amaçlı bağışlar'),
('Eğitim Bağışı', 'Eğitim faaliyetleri için bağışlar'),
('Sağlık Bağışı', 'Sağlık hizmetleri için bağışlar'),
('Acil Yardım', 'Acil durum ve afet yardımları'),
('Kurban Bağışı', 'Kurban ve et dağıtımı bağışları'),
('Zakat', 'Zakat ödemeleri'),
('Fitre', 'Fitre ödemeleri')
ON CONFLICT (name) DO NOTHING;

-- Create view for donation statistics
CREATE OR REPLACE VIEW donation_statistics AS
SELECT 
    dt.name as donation_type,
    COUNT(d.id) as total_donations,
    SUM(d.amount) as total_amount,
    AVG(d.amount) as average_amount,
    COUNT(CASE WHEN d.status = 'completed' THEN 1 END) as completed_donations,
    SUM(CASE WHEN d.status = 'completed' THEN d.amount ELSE 0 END) as completed_amount
FROM donation_types dt
LEFT JOIN donations d ON dt.id = d.donation_type_id
GROUP BY dt.id, dt.name
ORDER BY total_amount DESC;

-- Grant view permissions
GRANT SELECT ON donation_statistics TO authenticated;

COMMIT;