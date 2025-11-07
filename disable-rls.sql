-- Disable Row Level Security for all tables

-- Disable RLS for victims table
ALTER TABLE victims DISABLE ROW LEVEL SECURITY;

-- Disable RLS for police_officers table  
ALTER TABLE police_officers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for bank_officers table
ALTER TABLE bank_officers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for nodal_officers table
ALTER TABLE nodal_officers DISABLE ROW LEVEL SECURITY;