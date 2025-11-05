-- Add new columns to existing Complaint table
ALTER TABLE "Complaint" 
ADD COLUMN IF NOT EXISTS "otherFraudType" TEXT,
ADD COLUMN IF NOT EXISTS "ifscCode" TEXT,
ADD COLUMN IF NOT EXISTS "documentUrl" TEXT;

-- Also add to complaints table (snake_case version)
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS other_fraud_type TEXT,
ADD COLUMN IF NOT EXISTS ifsc_code TEXT,
ADD COLUMN IF NOT EXISTS document_url TEXT;

-- Create storage bucket for complaint documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaint-documents', 'complaint-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'complaint-documents');

CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'complaint-documents');