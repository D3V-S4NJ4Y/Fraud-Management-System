-- Create storage bucket for complaint documents
-- Run this in Supabase SQL Editor

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-documents', 'complaint-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policy for the bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'complaint-documents');

CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'complaint-documents');

-- Alternative: If you prefer to create bucket via Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: complaint-documents
-- 4. Make it public
-- 5. Save