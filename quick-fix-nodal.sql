-- Quick Fix for Nodal Officers Table
-- Run this in Supabase SQL Editor

-- Add missing application_id column to nodal_officers table
ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS application_id TEXT UNIQUE;

-- Add all other missing columns for nodal officers
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

-- Create nodal_actions table for coordination tasks
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

-- Success message
SELECT 'Nodal officers table fixed successfully!' as message;