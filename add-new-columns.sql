-- Add new columns to existing complaints table
-- Run this in Supabase SQL Editor if you want to keep existing data

ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS victim_address TEXT,
ADD COLUMN IF NOT EXISTS victim_state TEXT,
ADD COLUMN IF NOT EXISTS victim_gender TEXT;

-- Update existing records with sample data (optional)
UPDATE complaints 
SET 
    victim_address = CASE 
        WHEN complaint_id = 'CF2025764719' THEN '123 MG Road, Andheri'
        WHEN complaint_id = 'CF2025764720' THEN '456 CP Road, Karol Bagh'
        WHEN complaint_id = 'CF2025764721' THEN '789 Steel City, Sector 1'
        ELSE 'Address not provided'
    END,
    victim_state = CASE 
        WHEN complaint_id = 'CF2025764719' THEN 'Maharashtra'
        WHEN complaint_id = 'CF2025764720' THEN 'Delhi'
        WHEN complaint_id = 'CF2025764721' THEN 'Odisha'
        ELSE 'State not provided'
    END,
    victim_gender = CASE 
        WHEN victim_name LIKE '%Priya%' THEN 'Female'
        ELSE 'Male'
    END
WHERE victim_address IS NULL;