-- Add missing columns to complaints table
-- Run this in Supabase SQL Editor

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS other_fraud_type TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS police_station TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS document_url TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'MEDIUM';
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS assigned_officer TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS cfccrms_id TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS helpline_1930_id TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS fir_number TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS fir_date TEXT;