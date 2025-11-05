-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id VARCHAR UNIQUE NOT NULL,
  victim_name VARCHAR NOT NULL,
  victim_email VARCHAR NOT NULL,
  victim_phone VARCHAR NOT NULL,
  fraud_type VARCHAR NOT NULL,
  fraud_amount DECIMAL NOT NULL,
  fraud_date TIMESTAMP NOT NULL,
  fraud_description TEXT NOT NULL,
  bank_name VARCHAR,
  account_number VARCHAR,
  transaction_id VARCHAR,
  status VARCHAR DEFAULT 'PENDING',
  priority VARCHAR DEFAULT 'MEDIUM',
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
INSERT INTO complaints (complaint_id, victim_name, victim_email, victim_phone, fraud_type, fraud_amount, fraud_date, fraud_description, bank_name, account_number, transaction_id, status, priority, police_station, district) VALUES
('CF2024001', 'Rajesh Kumar', 'victim@example.com', '+91 9876543212', 'PHISHING', 50000, '2024-01-15', 'Received phishing email claiming to be from bank asking for OTP', 'State Bank of India', '****1234', 'TXN123456789', 'FUNDS_FROZEN', 'HIGH', 'Cyber Police Station, Bhubaneswar', 'Khordha'),
('CF2024002', 'Priya Sharma', 'priya@example.com', '+91 9123456789', 'ONLINE_SHOPPING', 25000, '2024-01-18', 'Fake online shopping website, paid but never received product', 'HDFC Bank', '****5678', 'TXN987654321', 'REFUND_PROCESSING', 'MEDIUM', 'Cyber Police Station, Cuttack', 'Cuttack');