-- =====================================================
-- COMPLETE DATABASE SETUP FOR VICTIM SUPPORT SYSTEM
-- =====================================================

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS case_updates CASCADE;
DROP TABLE IF EXISTS nodal_actions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS refunds CASCADE;
DROP TABLE IF EXISTS bank_actions CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop legacy tables
DROP TABLE IF EXISTS bank_officers CASCADE;
DROP TABLE IF EXISTS police_officers CASCADE;
DROP TABLE IF EXISTS nodal_officers CASCADE;
DROP TABLE IF EXISTS victims CASCADE;
DROP TABLE IF EXISTS chatbot_interactions CASCADE;
DROP TABLE IF EXISTS fraud_patterns CASCADE;
DROP TABLE IF EXISTS nlp_training_data CASCADE;
DROP TABLE IF EXISTS user_behavior_profiles CASCADE;
DROP TABLE IF EXISTS "Complaint" CASCADE;

-- =====================================================
-- 1. USERS TABLE (Main authentication and user management)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('VICTIM', 'POLICE_OFFICER', 'BANK_OFFICER', 'NODAL_OFFICER', 'ADMIN')),
    is_active BOOLEAN DEFAULT false,
    state VARCHAR(100),
    district VARCHAR(100),
    police_station VARCHAR(255),
    department VARCHAR(255),
    designation VARCHAR(255),
    experience VARCHAR(100),
    bank_name VARCHAR(255),
    branch_name VARCHAR(255),
    organization_name VARCHAR(255),
    id_card_url TEXT,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. COMPLAINTS TABLE (Main complaint management)
-- =====================================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    victim_name VARCHAR(255) NOT NULL,
    victim_email VARCHAR(255) NOT NULL,
    victim_phone VARCHAR(20) NOT NULL,
    victim_address TEXT,
    victim_state VARCHAR(100),
    victim_gender VARCHAR(20) CHECK (victim_gender IN ('Male', 'Female', 'Other')),
    fraud_type VARCHAR(100) NOT NULL,
    fraud_amount DECIMAL(15,2) NOT NULL,
    fraud_date DATE NOT NULL,
    fraud_description TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    assigned_officer VARCHAR(255),
    fir_number VARCHAR(100),
    fir_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. BANK_ACTIONS TABLE (Bank coordination and actions)
-- =====================================================
CREATE TABLE bank_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) NOT NULL,
    victim_name VARCHAR(255) NOT NULL,
    victim_email VARCHAR(255) NOT NULL,
    fraud_amount DECIMAL(15,2) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    transaction_id VARCHAR(100),
    action_type VARCHAR(50) DEFAULT 'FREEZE_ACCOUNT',
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    processed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- =====================================================
-- 4. REFUNDS TABLE (Refund processing and tracking)
-- =====================================================
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_id VARCHAR(50) UNIQUE NOT NULL,
    complaint_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    refund_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PROCESSING',
    processed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- =====================================================
-- 5. NOTIFICATIONS TABLE (Communication tracking)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id VARCHAR(50) UNIQUE NOT NULL,
    complaint_id VARCHAR(50),
    type VARCHAR(20) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'SENT',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE SET NULL
);

-- =====================================================
-- 6. CASE_UPDATES TABLE (Complaint status tracking)
-- =====================================================
CREATE TABLE case_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update_id VARCHAR(50) UNIQUE NOT NULL,
    complaint_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- =====================================================
-- 7. NODAL_ACTIONS TABLE (Nodal officer coordination)
-- =====================================================
CREATE TABLE nodal_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) NOT NULL,
    victim_name VARCHAR(255) NOT NULL,
    victim_email VARCHAR(255) NOT NULL,
    fraud_amount DECIMAL(15,2) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    transaction_id VARCHAR(100),
    coordination_type VARCHAR(50) DEFAULT 'BANK_COORDINATION',
    status VARCHAR(50) DEFAULT 'PENDING',
    assigned_officer VARCHAR(255),
    notes TEXT,
    processed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_victim_email ON complaints(victim_email);
CREATE INDEX idx_bank_actions_complaint_id ON bank_actions(complaint_id);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================
INSERT INTO users (email, password, name, phone, role, is_active) VALUES
('admin@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9jm', 'System Admin', '+91 9999999999', 'ADMIN', true);

INSERT INTO complaints (complaint_id, victim_name, victim_email, victim_phone, fraud_type, fraud_amount, fraud_date, fraud_description, district, bank_name, account_number, transaction_id, status, priority) VALUES
('CF2024001', 'Rajesh Kumar', 'rajesh@example.com', '+91 9876543210', 'PHISHING', 50000.00, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'Khordha', 'State Bank of India', '****1234', 'TXN123456789', 'PENDING', 'HIGH'),
('CF2024002', 'Priya Sharma', 'priya@example.com', '+91 9123456789', 'ONLINE_SHOPPING', 25000.00, '2024-01-18', 'Fake online shopping website, paid but never received product', 'Cuttack', 'HDFC Bank', '****5678', 'TXN987654321', 'PENDING', 'MEDIUM');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'DATABASE SETUP COMPLETED SUCCESSFULLY!' as message;
SELECT 'Admin Login: admin@gmail.com / admin@123' as login_info;