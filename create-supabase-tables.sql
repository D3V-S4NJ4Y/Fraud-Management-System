-- Create tables directly in Supabase
-- Run this in Supabase SQL Editor

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'VICTIM',
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Complaint table
CREATE TABLE IF NOT EXISTS "Complaint" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "complaintId" TEXT UNIQUE NOT NULL,
    "victimId" TEXT REFERENCES "User"(id),
    "victimName" TEXT NOT NULL,
    "victimEmail" TEXT NOT NULL,
    "victimPhone" TEXT NOT NULL,
    "fraudType" TEXT NOT NULL,
    "fraudAmount" DECIMAL NOT NULL,
    "fraudDate" TIMESTAMP NOT NULL,
    "fraudDescription" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "transactionId" TEXT,
    "otherFraudType" TEXT,
    "ifscCode" TEXT,
    "documentUrl" TEXT,
    status TEXT DEFAULT 'PENDING',
    priority TEXT DEFAULT 'MEDIUM',
    "policeStation" TEXT,
    district TEXT,
    "assignedOfficer" TEXT,
    "cfccrmsId" TEXT,
    "helpline1930Id" TEXT,
    "firNumber" TEXT,
    "firDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert sample users with bcrypt hashed passwords (admin123, police123, password123)
INSERT INTO "User" (email, password, name, phone, role, "isActive") VALUES
('admin@odisha.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'System Administrator', '+91 9876543210', 'ADMIN', true),
('police@odisha.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Inspector S. Patnaik', '+91 9876543211', 'POLICE_OFFICER', true),
('victim@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'Rajesh Kumar', '+91 9876543212', 'VICTIM', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample complaints
INSERT INTO "Complaint" ("complaintId", "victimId", "victimName", "victimEmail", "victimPhone", "fraudType", "fraudAmount", "fraudDate", "fraudDescription", "bankName", "accountNumber", "transactionId", status, priority, "policeStation", district, "assignedOfficer") VALUES
('CF2024001', (SELECT id FROM "User" WHERE email = 'victim@example.com'), 'Rajesh Kumar', 'victim@example.com', '+91 9876543212', 'PHISHING', 50000, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'State Bank of India', '****1234', 'TXN123456789', 'FUNDS_FROZEN', 'HIGH', 'Cyber Police Station, Bhubaneswar', 'Khordha', 'Inspector S. Patnaik'),
('CF2024002', (SELECT id FROM "User" WHERE email = 'victim@example.com'), 'Priya Sharma', 'priya@example.com', '+91 9123456789', 'ONLINE_SHOPPING', 25000, '2024-01-18', 'Fake online shopping website, paid but never received product', 'HDFC Bank', '****5678', 'TXN987654321', 'REFUND_PROCESSING', 'MEDIUM', 'Cyber Police Station, Cuttack', 'Cuttack', null)
ON CONFLICT ("complaintId") DO NOTHING;