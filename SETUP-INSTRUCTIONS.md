# Setup Instructions for Police Registration

## Issue: "Failed to create application" when police officers register

### Root Cause
The `applications` table doesn't exist in your Supabase database.

### Solution
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Run this SQL command:

```sql
CREATE TABLE applications (
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

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_email ON applications(email);
```

### Alternative Quick Fix
1. Go to `/admin` page
2. Login with admin credentials
3. Click "Setup DB" button
4. Follow the instructions shown

### Test
1. Try registering as a police officer again
2. The application should be created successfully
3. Check the admin dashboard to see pending applications

### Admin Credentials
- Email: `admin@gmail.com`
- Password: `admin@123`