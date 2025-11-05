-- Check what tables and columns actually exist
-- Run this in Supabase SQL Editor to see the actual structure

SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('Complaint', 'complaints', 'User', 'users')
ORDER BY table_name, ordinal_position;