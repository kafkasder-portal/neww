-- Financial Management Tables for Charity Management System
-- This migration creates the necessary tables for accounting functionality

-- Chart of Accounts table
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    account_code text NOT NULL UNIQUE,
    account_name text NOT NULL,
    account_name_tr text NOT NULL,
    account_type text NOT NULL CHECK (account_type IN ('varlık', 'borç', 'öz_kaynak', 'gelir', 'gider')),
    account_type_en text NOT NULL CHECK (account_type_en IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    parent_account_id uuid REFERENCES chart_of_accounts(id),
    is_active boolean DEFAULT true,
    description text,
    balance_type text NOT NULL CHECK (balance_type IN ('debit', 'credit')),
    current_balance numeric(15,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- General Ledger Entries table
CREATE TABLE IF NOT EXISTS public.general_ledger_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_date date NOT NULL,
    reference_number text NOT NULL UNIQUE,
    description text NOT NULL,
    document_type text NOT NULL CHECK (document_type IN ('donation', 'payment', 'transfer', 'adjustment', 'journal')),
    document_id uuid,
    total_debit numeric(15,2) NOT NULL DEFAULT 0.00,
    total_credit numeric(15,2) NOT NULL DEFAULT 0.00,
    is_balanced boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES auth.users(id),
    approved_by uuid REFERENCES auth.users(id),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'approved')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Journal Entries table (individual line items)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    general_ledger_entry_id uuid NOT NULL REFERENCES general_ledger_entries(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES chart_of_accounts(id),
    account_code text NOT NULL,
    account_name text NOT NULL,
    debit_amount numeric(15,2) DEFAULT 0.00,
    credit_amount numeric(15,2) DEFAULT 0.00,
    description text,
    fund_id text,
    project_id text,
    grant_id uuid,
    created_at timestamptz DEFAULT now()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    fiscal_year integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    budget_type text NOT NULL CHECK (budget_type IN ('annual', 'project', 'grant', 'campaign')),
    total_budget_revenue numeric(15,2) DEFAULT 0.00,
    total_budget_expense numeric(15,2) DEFAULT 0.00,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Budget Departments table
CREATE TABLE IF NOT EXISTS public.budget_departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_id uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    department_name text NOT NULL,
    allocated_amount numeric(15,2) DEFAULT 0.00,
    spent_amount numeric(15,2) DEFAULT 0.00,
    remaining_amount numeric(15,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Budget Categories table
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    department_id uuid NOT NULL REFERENCES budget_departments(id) ON DELETE CASCADE,
    category_name text NOT NULL,
    budgeted_amount numeric(15,2) DEFAULT 0.00,
    actual_amount numeric(15,2) DEFAULT 0.00,
    variance numeric(15,2) DEFAULT 0.00,
    variance_percent numeric(5,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Grants table
CREATE TABLE IF NOT EXISTS public.grants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    grantor_name text NOT NULL,
    grantor_contact text,
    grant_amount numeric(15,2) NOT NULL,
    award_date date NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    purpose text NOT NULL,
    restrictions text[],
    spent_amount numeric(15,2) DEFAULT 0.00,
    remaining_amount numeric(15,2),
    status text NOT NULL DEFAULT 'awarded' CHECK (status IN ('awarded', 'active', 'completed', 'terminated')),
    reporting_frequency text NOT NULL CHECK (reporting_frequency IN ('monthly', 'quarterly', 'annually')),
    next_report_due date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Grant Compliance table
CREATE TABLE IF NOT EXISTS public.grant_compliance (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    grant_id uuid NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
    requirement_type text NOT NULL CHECK (requirement_type IN ('financial_report', 'progress_report', 'audit', 'site_visit')),
    description text NOT NULL,
    due_date date NOT NULL,
    completed_date date,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Bank Reconciliation table
CREATE TABLE IF NOT EXISTS public.bank_reconciliations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_account_id text NOT NULL,
    statement_date date NOT NULL,
    bank_balance numeric(15,2) NOT NULL,
    book_balance numeric(15,2) NOT NULL,
    reconciled_amount numeric(15,2) DEFAULT 0.00,
    outstanding_deposits numeric(15,2) DEFAULT 0.00,
    outstanding_checks numeric(15,2) DEFAULT 0.00,
    adjustments numeric(15,2) DEFAULT 0.00,
    status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'reviewed')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Reconciliation Items table
CREATE TABLE IF NOT EXISTS public.reconciliation_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reconciliation_id uuid NOT NULL REFERENCES bank_reconciliations(id) ON DELETE CASCADE,
    transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'fee', 'interest')),
    amount numeric(15,2) NOT NULL,
    description text NOT NULL,
    bank_statement_ref text,
    book_transaction_id uuid,
    is_matched boolean DEFAULT false,
    adjustment_reason text,
    created_at timestamptz DEFAULT now()
);

-- Tax Documents table
CREATE TABLE IF NOT EXISTS public.tax_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id uuid,
    donation_ids uuid[],
    document_type text NOT NULL CHECK (document_type IN ('receipt', 'annual_statement', 'tax_exempt_certificate')),
    tax_year integer NOT NULL,
    total_amount numeric(15,2) NOT NULL,
    document_number text NOT NULL UNIQUE,
    issued_date date NOT NULL,
    pdf_path text,
    email_sent boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Financial Transactions table (unified transaction tracking)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    amount numeric(15,2) NOT NULL,
    currency text NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    exchange_rate numeric(10,4) DEFAULT 1.0000,
    base_amount numeric(15,2) NOT NULL, -- Amount in base currency (TRY)
    transaction_date date NOT NULL,
    transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
    category text NOT NULL,
    subcategory text,
    description text NOT NULL,
    fund_id text,
    project_id text,
    grant_id uuid REFERENCES grants(id),
    donor_id uuid,
    vendor_id uuid,
    receipt_path text,
    approval_required boolean DEFAULT false,
    approved_by uuid REFERENCES auth.users(id),
    approved_at timestamptz,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    journal_entry_id uuid REFERENCES general_ledger_entries(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_code ON chart_of_accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_type ON chart_of_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_parent ON chart_of_accounts(parent_account_id);

CREATE INDEX IF NOT EXISTS idx_general_ledger_date ON general_ledger_entries(transaction_date);
CREATE INDEX IF NOT EXISTS idx_general_ledger_ref ON general_ledger_entries(reference_number);
CREATE INDEX IF NOT EXISTS idx_general_ledger_doc ON general_ledger_entries(document_type, document_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_account ON journal_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_ledger ON journal_entries(general_ledger_entry_id);

CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_budgets_type ON budgets(budget_type);

CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_dates ON grants(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chart_of_accounts_updated_at BEFORE UPDATE ON chart_of_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_general_ledger_entries_updated_at BEFORE UPDATE ON general_ledger_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_departments_updated_at BEFORE UPDATE ON budget_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grant_compliance_updated_at BEFORE UPDATE ON grant_compliance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_reconciliations_updated_at BEFORE UPDATE ON bank_reconciliations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Financial Tables
-- Chart of Accounts policies
CREATE POLICY "Everyone can view chart of accounts" ON chart_of_accounts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert chart of accounts" ON chart_of_accounts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update chart of accounts" ON chart_of_accounts FOR UPDATE USING (auth.role() = 'authenticated');

-- General Ledger policies
CREATE POLICY "Everyone can view general ledger" ON general_ledger_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert general ledger" ON general_ledger_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update general ledger" ON general_ledger_entries FOR UPDATE USING (auth.role() = 'authenticated');

-- Journal Entries policies
CREATE POLICY "Everyone can view journal entries" ON journal_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert journal entries" ON journal_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update journal entries" ON journal_entries FOR UPDATE USING (auth.role() = 'authenticated');

-- Budget policies
CREATE POLICY "Everyone can view budgets" ON budgets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage budgets" ON budgets FOR ALL USING (auth.role() = 'authenticated');

-- Budget Departments policies
CREATE POLICY "Everyone can view budget departments" ON budget_departments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage budget departments" ON budget_departments FOR ALL USING (auth.role() = 'authenticated');

-- Budget Categories policies
CREATE POLICY "Everyone can view budget categories" ON budget_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage budget categories" ON budget_categories FOR ALL USING (auth.role() = 'authenticated');

-- Grants policies
CREATE POLICY "Everyone can view grants" ON grants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage grants" ON grants FOR ALL USING (auth.role() = 'authenticated');

-- Grant Compliance policies
CREATE POLICY "Everyone can view grant compliance" ON grant_compliance FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage grant compliance" ON grant_compliance FOR ALL USING (auth.role() = 'authenticated');

-- Bank Reconciliation policies
CREATE POLICY "Everyone can view bank reconciliations" ON bank_reconciliations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage bank reconciliations" ON bank_reconciliations FOR ALL USING (auth.role() = 'authenticated');

-- Reconciliation Items policies
CREATE POLICY "Everyone can view reconciliation items" ON reconciliation_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage reconciliation items" ON reconciliation_items FOR ALL USING (auth.role() = 'authenticated');

-- Tax Documents policies
CREATE POLICY "Everyone can view tax documents" ON tax_documents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tax documents" ON tax_documents FOR ALL USING (auth.role() = 'authenticated');

-- Financial Transactions policies
CREATE POLICY "Everyone can view financial transactions" ON financial_transactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage financial transactions" ON financial_transactions FOR ALL USING (auth.role() = 'authenticated');

-- Add some helpful comments
COMMENT ON TABLE chart_of_accounts IS 'Chart of accounts for double-entry bookkeeping system';
COMMENT ON TABLE general_ledger_entries IS 'Main general ledger entries with balanced debits and credits';
COMMENT ON TABLE journal_entries IS 'Individual journal entry line items';
COMMENT ON TABLE budgets IS 'Budget planning and management';
COMMENT ON TABLE grants IS 'Grant tracking and compliance management';
COMMENT ON TABLE financial_transactions IS 'Unified transaction tracking system';
