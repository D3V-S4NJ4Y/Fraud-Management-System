-- Supabase Database Setup for Victim Support System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('VICTIM', 'POLICE_OFFICER', 'BANK_OFFICER', 'NODAL_OFFICER', 'ADMIN');
CREATE TYPE fraud_type AS ENUM ('PHISHING', 'ONLINE_SHOPPING', 'BANKING_FRAUD', 'INVESTMENT_SCAM', 'JOB_SCAM', 'MATRIMONIAL_SCAM', 'LOTTERY_SCAM', 'UPI_FRAUD', 'CARD_FRAUD', 'OTHER');
CREATE TYPE complaint_status AS ENUM ('PENDING', 'IN_PROGRESS', 'UNDER_INVESTIGATION', 'BANK_FREEZE_REQUESTED', 'FUNDS_FROZEN', 'REFUND_PROCESSING', 'REFUNDED', 'CLOSED', 'REJECTED');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    name VARCHAR,
    phone VARCHAR,
    role user_role DEFAULT 'VICTIM',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id VARCHAR UNIQUE NOT NULL,
    victim_id UUID REFERENCES users(id),
    victim_name VARCHAR NOT NULL,
    victim_email VARCHAR NOT NULL,
    victim_phone VARCHAR NOT NULL,
    fraud_type fraud_type NOT NULL,
    fraud_amount DECIMAL NOT NULL,
    fraud_date TIMESTAMP NOT NULL,
    fraud_description TEXT NOT NULL,
    bank_name VARCHAR,
    account_number VARCHAR,
    transaction_id VARCHAR,
    status complaint_status DEFAULT 'PENDING',
    priority priority DEFAULT 'MEDIUM',
    police_station VARCHAR,
    district VARCHAR,
    assigned_officer VARCHAR,
    cfccrms_id VARCHAR,
    helpline_1930_id VARCHAR,
    fir_number VARCHAR,
    fir_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (email, password, name, phone, role, is_active) VALUES
('admin@odisha.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'System Administrator', '+91 9876543210', 'ADMIN', true),
('police@odisha.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Inspector S. Patnaik', '+91 9876543211', 'POLICE_OFFICER', true),
('victim@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Rajesh Kumar', '+91 9876543212', 'VICTIM', true);

-- Insert sample complaints
INSERT INTO complaints (complaint_id, victim_id, victim_name, victim_email, victim_phone, fraud_type, fraud_amount, fraud_date, fraud_description, bank_name, account_number, transaction_id, status, priority, police_station, district, assigned_officer) VALUES
('CF2024001', (SELECT id FROM users WHERE email = 'victim@example.com'), 'Rajesh Kumar', 'victim@example.com', '+91 9876543212', 'PHISHING', 50000, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'State Bank of India', '****1234', 'TXN123456789', 'FUNDS_FROZEN', 'HIGH', 'Cyber Police Station, Bhubaneswar', 'Khordha', 'Inspector S. Patnaik'),
('CF2024002', (SELECT id FROM users WHERE email = 'victim@example.com'), 'Priya Sharma', 'priya@example.com', '+91 9123456789', 'ONLINE_SHOPPING', 25000, '2024-01-18', 'Fake online shopping website, paid but never received product', 'HDFC Bank', '****5678', 'TXN987654321', 'REFUND_PROCESSING', 'MEDIUM', 'Cyber Police Station, Cuttack', 'Cuttack', null);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all users" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id::text = auth.uid()::text 
        AND role IN ('ADMIN', 'POLICE_OFFICER')
    )
);

CREATE POLICY "Users can view own complaints" ON complaints FOR SELECT USING (
    victim_id::text = auth.uid()::text OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id::text = auth.uid()::text 
        AND role IN ('ADMIN', 'POLICE_OFFICER', 'NODAL_OFFICER')
    )
);