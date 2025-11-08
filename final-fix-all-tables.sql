-- Final Fix for All Tables - Complete Solution
-- Run this in Supabase SQL Editor

-- 1. Drop and recreate nodal_officers table with all columns
DROP TABLE IF EXISTS nodal_officers CASCADE;

CREATE TABLE nodal_officers (
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
  organization_name TEXT,
  organization_type TEXT,
  employee_id TEXT,
  office_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  jurisdiction_area TEXT,
  id_card_url TEXT,
  appointment_letter_url TEXT,
  authorization_certificate_url TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Drop and recreate bank_officers table with all columns
DROP TABLE IF EXISTS bank_officers CASCADE;

CREATE TABLE bank_officers (
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
  bank_name TEXT,
  branch_name TEXT,
  branch_code TEXT,
  ifsc_code TEXT,
  employee_id TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  id_card_url TEXT,
  employment_certificate_url TEXT,
  bank_authorization_letter_url TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Ensure police_officers table exists
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

-- 4. Ensure victims table exists
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

-- 5. Create bank_actions table
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

-- 6. Create nodal_actions table
CREATE TABLE IF NOT EXISTS nodal_actions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  complaint_id TEXT NOT NULL,
  victim_name TEXT NOT NULL,
  victim_email TEXT NOT NULL,
  fraud_amount DECIMAL(15,2) NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  transaction_id TEXT,
  coordination_type TEXT DEFAULT 'BANK_COORDINATION',
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

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_victims_email ON victims(email);
CREATE INDEX IF NOT EXISTS idx_police_status ON police_officers(status);
CREATE INDEX IF NOT EXISTS idx_police_email ON police_officers(email);
CREATE INDEX IF NOT EXISTS idx_bank_status ON bank_officers(status);
CREATE INDEX IF NOT EXISTS idx_bank_email ON bank_officers(email);
CREATE INDEX IF NOT EXISTS idx_nodal_status ON nodal_officers(status);
CREATE INDEX IF NOT EXISTS idx_nodal_email ON nodal_officers(email);
CREATE INDEX IF NOT EXISTS idx_bank_actions_status ON bank_actions(status);
CREATE INDEX IF NOT EXISTS idx_nodal_actions_status ON nodal_actions(status);

-- Success message
SELECT 'All tables recreated successfully with all required columns!' as message;