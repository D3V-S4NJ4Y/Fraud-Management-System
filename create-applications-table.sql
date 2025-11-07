-- Create applications table for police officer registration
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    application_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    password TEXT,
    role TEXT NOT NULL,
    state TEXT,
    district TEXT,
    police_station TEXT,
    department TEXT,
    designation TEXT,
    experience TEXT,
    reason TEXT,
    id_card_url TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'PENDING',
    reviewed_by TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);