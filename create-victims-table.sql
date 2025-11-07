-- Create victims table in Supabase
CREATE TABLE IF NOT EXISTS victims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'VICTIM',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_victims_email ON victims(email);

-- Enable Row Level Security
ALTER TABLE victims ENABLE ROW LEVEL SECURITY;

-- Create policy for victims to access their own data
CREATE POLICY "Users can view own data" ON victims
    FOR SELECT USING (auth.uid()::text = id::text);

-- Create policy for service role to manage all data
CREATE POLICY "Service role can manage all data" ON victims
    FOR ALL USING (auth.role() = 'service_role');