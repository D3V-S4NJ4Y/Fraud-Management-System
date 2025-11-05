-- Add missing tables for FIR and Nodal Officers integration
-- Run this in Supabase SQL Editor

-- Create nodal_officers table
CREATE TABLE IF NOT EXISTS nodal_officers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nodal_id TEXT UNIQUE NOT NULL,
    complaint_id TEXT REFERENCES complaints(complaint_id),
    bank_name TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    officer_email TEXT NOT NULL,
    officer_phone TEXT NOT NULL,
    action_required TEXT NOT NULL,
    status TEXT DEFAULT 'ASSIGNED',
    response_received BOOLEAN DEFAULT false,
    response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample nodal officers will be created when complaints are processed