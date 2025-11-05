-- Fix complaints table structure
-- Run this in Supabase SQL Editor

-- Drop existing table if it has wrong structure
DROP TABLE IF EXISTS "complaints" CASCADE;

-- Create complaints table with correct snake_case columns
CREATE TABLE "complaints" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    complaint_id TEXT UNIQUE NOT NULL,
    victim_name TEXT NOT NULL,
    victim_email TEXT NOT NULL,
    victim_phone TEXT NOT NULL,
    fraud_type TEXT NOT NULL,
    fraud_amount DECIMAL NOT NULL,
    fraud_date TIMESTAMP NOT NULL,
    fraud_description TEXT NOT NULL,
    other_fraud_type TEXT,
    bank_name TEXT,
    ifsc_code TEXT,
    account_number TEXT,
    transaction_id TEXT,
    police_station TEXT,
    district TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'PENDING',
    priority TEXT DEFAULT 'MEDIUM',
    assigned_officer TEXT,
    cfccrms_id TEXT,
    helpline_1930_id TEXT,
    fir_number TEXT,
    fir_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO "complaints" (complaint_id, victim_name, victim_email, victim_phone, fraud_type, fraud_amount, fraud_date, fraud_description, bank_name, account_number, transaction_id, status, priority, police_station, district, assigned_officer) VALUES
('CF2024001', 'Rajesh Kumar', 'victim@example.com', '+91 9876543212', 'PHISHING', 50000, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'State Bank of India', '****1234', 'TXN123456789', 'FUNDS_FROZEN', 'HIGH', 'Cyber Police Station, Bhubaneswar', 'Khordha', 'Inspector S. Patnaik'),
('CF2024002', 'Priya Sharma', 'priya@example.com', '+91 9123456789', 'ONLINE_SHOPPING', 25000, '2024-01-18', 'Fake online shopping website, paid but never received product', 'HDFC Bank', '****5678', 'TXN987654321', 'REFUND_PROCESSING', 'MEDIUM', 'Cyber Police Station, Cuttack', 'Cuttack', null)
ON CONFLICT (complaint_id) DO NOTHING;