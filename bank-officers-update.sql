-- Bank Officers Table Update Script
-- Run this in Supabase SQL Editor to add missing columns

-- First, create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS bank_officers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT,
  department TEXT,
  designation TEXT,
  experience TEXT,
  reason TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add new columns for bank verification
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS branch_name TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS branch_code TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS id_card_url TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS employment_certificate_url TEXT;
ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS bank_authorization_letter_url TEXT;

-- Create bank_actions table for police forwarded actions
CREATE TABLE IF NOT EXISTS bank_actions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  complaint_id TEXT NOT NULL,
  victim_name TEXT NOT NULL,
  victim_email TEXT NOT NULL,
  fraud_amount DECIMAL(15,2) NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  transaction_id TEXT,
  action_type TEXT DEFAULT 'FREEZE_ACCOUNT',
  status TEXT DEFAULT 'PENDING',
  police_station TEXT NOT NULL,
  assigned_officer TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  notes TEXT,
  processed_by TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create other required tables if they don't exist
CREATE TABLE IF NOT EXISTS victims (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS police_officers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  police_station TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  experience TEXT NOT NULL,
  id_card_url TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nodal_officers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT,
  department TEXT,
  designation TEXT,
  experience TEXT,
  reason TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_victims_email ON victims(email);
CREATE INDEX IF NOT EXISTS idx_police_status ON police_officers(status);
CREATE INDEX IF NOT EXISTS idx_police_email ON police_officers(email);
CREATE INDEX IF NOT EXISTS idx_bank_status ON bank_officers(status);
CREATE INDEX IF NOT EXISTS idx_bank_email ON bank_officers(email);
CREATE INDEX IF NOT EXISTS idx_nodal_status ON nodal_officers(status);
CREATE INDEX IF NOT EXISTS idx_nodal_email ON nodal_officers(email);
CREATE INDEX IF NOT EXISTS idx_bank_actions_status ON bank_actions(status);
CREATE INDEX IF NOT EXISTS idx_bank_actions_bank ON bank_actions(bank_name);
CREATE INDEX IF NOT EXISTS idx_bank_actions_complaint ON bank_actions(complaint_id);

-- Success message
SELECT 'Database setup completed successfully!' as message;