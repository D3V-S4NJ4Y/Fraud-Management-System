-- Complete database schema for Cyber Fraud Support System
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS case_updates CASCADE;
DROP TABLE IF EXISTS refunds CASCADE;
DROP TABLE IF EXISTS bank_actions CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'VICTIM',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE complaints (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    complaint_id TEXT UNIQUE NOT NULL,
    victim_id TEXT REFERENCES users(id),
    victim_name TEXT NOT NULL,
    victim_email TEXT NOT NULL,
    victim_phone TEXT NOT NULL,
    victim_address TEXT,
    victim_state TEXT,
    victim_gender TEXT,
    fraud_type TEXT NOT NULL,
    fraud_amount DECIMAL NOT NULL,
    fraud_date TEXT NOT NULL,
    fraud_description TEXT NOT NULL,
    other_fraud_type TEXT,
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
    fir_date TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create bank_actions table
CREATE TABLE bank_actions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action_id TEXT UNIQUE NOT NULL,
    complaint_id TEXT REFERENCES complaints(complaint_id),
    bank_name TEXT NOT NULL,
    branch_name TEXT,
    account_number TEXT NOT NULL,
    action_type TEXT NOT NULL,
    amount DECIMAL,
    notes TEXT,
    status TEXT DEFAULT 'PENDING',
    requested_by TEXT,
    processed_by TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create refunds table
CREATE TABLE refunds (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    refund_id TEXT UNIQUE NOT NULL,
    complaint_id TEXT REFERENCES complaints(complaint_id),
    amount DECIMAL NOT NULL,
    refund_method TEXT NOT NULL,
    processed_by TEXT,
    status TEXT DEFAULT 'PROCESSING',
    transaction_reference TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create case_updates table
CREATE TABLE case_updates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    update_id TEXT UNIQUE NOT NULL,
    complaint_id TEXT REFERENCES complaints(complaint_id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    notification_id TEXT UNIQUE NOT NULL,
    complaint_id TEXT REFERENCES complaints(complaint_id),
    type TEXT NOT NULL, -- SMS, EMAIL, PUSH
    message TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample users
INSERT INTO users (email, password, name, phone, role, is_active) VALUES
('admin@police.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'System Administrator', '+91 9876543210', 'ADMIN', true),
('police@cybercrime.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Inspector R. Kumar', '+91 9876543211', 'POLICE_OFFICER', true),
('nodal@sbi.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Mr. Rajesh Gupta', '+91 9876543213', 'NODAL_OFFICER', true),
('nodal@hdfc.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Ms. Priya Sharma', '+91 9876543214', 'NODAL_OFFICER', true),
('victim@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Rajesh Kumar', '+91 9876543212', 'VICTIM', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample complaints
INSERT INTO complaints (complaint_id, victim_name, victim_email, victim_phone, victim_address, victim_state, victim_gender, fraud_type, fraud_amount, fraud_date, fraud_description, bank_name, account_number, transaction_id, status, priority, police_station, district, assigned_officer, cfccrms_id, helpline_1930_id) VALUES
('CF2025764719', 'Rajesh Kumar', 'victim@example.com', '+91 9876543212', '123 MG Road, Andheri', 'Maharashtra', 'Male', 'PHISHING', 50000, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'State Bank of India', '****1234', 'TXN123456789', 'FUNDS_FROZEN', 'HIGH', 'Cyber Crime Police Station', 'Mumbai', 'Inspector R. Kumar', 'CFCFRMS2024001', '1930REF001'),
('CF2025764720', 'Priya Sharma', 'priya@example.com', '+91 9123456789', '456 CP Road, Karol Bagh', 'Delhi', 'Female', 'ONLINE_SHOPPING', 25000, '2024-01-18', 'Fake online shopping website, paid but never received product', 'HDFC Bank', '****5678', 'TXN987654321', 'REFUND_PROCESSING', 'MEDIUM', 'Cyber Crime Police Station', 'Delhi', 'Inspector R. Kumar', 'CFCFRMS2024002', '1930REF002'),
('CF2025764721', 'Amit Singh', 'amit@example.com', '+91 9876543213', '789 Steel City, Sector 1', 'Odisha', 'Male', 'UPI_FRAUD', 15000, '2024-01-20', 'Unauthorized UPI transactions from my account', 'Bank of Baroda', '43423432', '12345', 'IN_PROGRESS', 'HIGH', 'Cyber Crime Police Station', 'Raurkela', 'Inspector R. Kumar', 'CFCFRMS2024003', '1930REF003')
ON CONFLICT (complaint_id) DO NOTHING;

-- Insert sample bank actions
INSERT INTO bank_actions (action_id, complaint_id, bank_name, account_number, action_type, status, requested_by) VALUES
('BA2025001', 'CF2025764719', 'State Bank of India', '****1234', 'FREEZE_ACCOUNT', 'COMPLETED', 'Inspector R. Kumar'),
('BA2025002', 'CF2025764720', 'HDFC Bank', '****5678', 'HOLD_FUNDS', 'PENDING', 'Inspector R. Kumar')
ON CONFLICT (action_id) DO NOTHING;

-- Insert sample case updates
INSERT INTO case_updates (update_id, complaint_id, title, description, status, updated_by) VALUES
('CU2025001', 'CF2025764719', 'Account Frozen', 'Bank account has been frozen successfully. Investigation in progress.', 'FUNDS_FROZEN', 'Inspector R. Kumar'),
('CU2025002', 'CF2025764720', 'Refund Initiated', 'Refund process has been started with the bank.', 'REFUND_PROCESSING', 'Inspector R. Kumar')
ON CONFLICT (update_id) DO NOTHING;