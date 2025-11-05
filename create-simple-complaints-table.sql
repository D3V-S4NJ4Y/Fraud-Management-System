-- Create a simple complaints table that matches the API
-- Run this in Supabase SQL Editor

DROP TABLE IF EXISTS complaints CASCADE;

CREATE TABLE complaints (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    complaint_id TEXT UNIQUE NOT NULL,
    victim_name TEXT NOT NULL,
    victim_email TEXT NOT NULL,
    victim_phone TEXT NOT NULL,
    fraud_type TEXT NOT NULL,
    fraud_amount DECIMAL NOT NULL,
    fraud_date TEXT NOT NULL,
    fraud_description TEXT NOT NULL,
    district TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);