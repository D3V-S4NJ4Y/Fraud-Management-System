-- Complete Database Setup Script for Cyber Fraud System
-- Run this in Supabase SQL Editor to create/update all tables

-- 1. Create victims table
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

-- 2. Create police_officers table
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

-- 3. Create bank_officers table
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

-- 4. Add bank officer specific columns
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

-- 5. Create nodal_officers table
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

-- 6. Add nodal officer specific columns
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS organization_type TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS office_address TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS jurisdiction_area TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS id_card_url TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS appointment_letter_url TEXT;
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS authorization_certificate_url TEXT;

-- 7. Create bank_actions table for police forwarded actions
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

-- 8. Create nodal_actions table for police assigned coordination tasks
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

-- 9. Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  complaint_id TEXT UNIQUE NOT NULL,
  victim_name TEXT NOT NULL,
  victim_email TEXT NOT NULL,
  victim_phone TEXT,
  victim_address TEXT,
  victim_state TEXT,
  victim_gender TEXT,
  fraud_type TEXT NOT NULL,
  fraud_amount DECIMAL(15,2) NOT NULL,
  fraud_date DATE NOT NULL,
  fraud_description TEXT NOT NULL,
  bank_name TEXT,
  ifsc_code TEXT,
  account_number TEXT,
  transaction_id TEXT,
  police_station TEXT,
  district TEXT NOT NULL,
  document_url TEXT,
  status TEXT DEFAULT 'PENDING',
  priority TEXT DEFAULT 'MEDIUM',
  assigned_officer TEXT,
  cfccrms_id TEXT,
  helpline_1930_id TEXT,
  fir_number TEXT,
  fir_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Create performance indexes
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
CREATE INDEX IF NOT EXISTS idx_nodal_actions_status ON nodal_actions(status);
CREATE INDEX IF NOT EXISTS idx_nodal_actions_complaint ON nodal_actions(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_victim_email ON complaints(victim_email);
CREATE INDEX IF NOT EXISTS idx_complaints_complaint_id ON complaints(complaint_id);

-- 11. Insert sample data for testing (optional)
-- Sample bank actions for testing bank dashboard
INSERT INTO bank_actions (
  complaint_id, victim_name, victim_email, fraud_amount, bank_name, 
  account_number, ifsc_code, transaction_id, police_station, assigned_officer
) VALUES 
  ('CF202401001', 'John Doe', 'john@example.com', 50000.00, 'State Bank of India', 
   '1234567890', 'SBIN0001234', 'TXN123456789', 'Cyber Crime Cell Delhi', 'Inspector Sharma'),
  ('CF202401002', 'Jane Smith', 'jane@example.com', 75000.00, 'HDFC Bank', 
   '9876543210', 'HDFC0001234', 'TXN987654321', 'Cyber Crime Cell Mumbai', 'Inspector Patel')
ON CONFLICT (complaint_id) DO NOTHING;

-- Sample nodal actions for testing nodal dashboard
INSERT INTO nodal_actions (
  complaint_id, victim_name, victim_email, fraud_amount, bank_name, 
  account_number, transaction_id, coordination_type, police_station, assigned_officer
) VALUES 
  ('CF202401003', 'Alice Johnson', 'alice@example.com', 100000.00, 'ICICI Bank', 
   '5555666677', 'ICIC0001234', 'TXN555666777', 'BANK_COORDINATION', 'Cyber Crime Cell Bangalore', 'Inspector Kumar'),
  ('CF202401004', 'Bob Wilson', 'bob@example.com', 25000.00, 'Axis Bank', 
   '1111222233', 'UTIB0001234', 'TXN111222333', 'RBI_COORDINATION', 'Cyber Crime Cell Chennai', 'Inspector Reddy')
ON CONFLICT (complaint_id) DO NOTHING;

-- Success message
SELECT 'Complete database setup completed successfully! All tables created and sample data inserted.' as message;