-- Fix RLS (Row Level Security) issues for all tables

-- Disable RLS for victims table
ALTER TABLE victims DISABLE ROW LEVEL SECURITY;

-- Disable RLS for police_officers table  
ALTER TABLE police_officers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for bank_officers table
ALTER TABLE bank_officers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for nodal_officers table
ALTER TABLE nodal_officers DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled, create proper policies:

-- Enable RLS and create policies for victims
-- ALTER TABLE victims ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Enable all operations for service role" ON victims
--   FOR ALL USING (auth.role() = 'service_role');

-- CREATE POLICY "Enable read for authenticated users" ON victims
--   FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "Enable insert for authenticated users" ON victims
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Same for other tables...
-- ALTER TABLE police_officers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all operations for service role" ON police_officers
--   FOR ALL USING (auth.role() = 'service_role');

-- ALTER TABLE bank_officers ENABLE ROW LEVEL SECURITY;  
-- CREATE POLICY "Enable all operations for service role" ON bank_officers
--   FOR ALL USING (auth.role() = 'service_role');

-- ALTER TABLE nodal_officers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all operations for service role" ON nodal_officers
--   FOR ALL USING (auth.role() = 'service_role');