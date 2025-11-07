import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxamtrY2NycXZnc3Rqcm9yd2tyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIzNjM2NSwiZXhwIjoyMDc2ODEyMzY1fQ.qXVvF78kfLrkRKuxEamTusyvrUojwfJmksgvs9BcOpUEQWU3HIGojR04wmMFQrIiMkreuCE3y+aAQpDRZAmhlw'
)

export async function POST() {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Victims table
        CREATE TABLE IF NOT EXISTS victims (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Police officers table
        CREATE TABLE IF NOT EXISTS police_officers (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          application_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          state TEXT NOT NULL,
          district TEXT NOT NULL,
          police_station TEXT NOT NULL,
          department TEXT NOT NULL,
          designation TEXT NOT NULL,
          experience TEXT NOT NULL,
          id_card_url TEXT,
          document_url TEXT,
          status TEXT DEFAULT 'PENDING',
          reviewed_by TEXT,
          reviewed_at TIMESTAMP,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Bank officers table
        CREATE TABLE IF NOT EXISTS bank_officers (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          application_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT,
          department TEXT,
          designation TEXT,
          experience TEXT,
          reason TEXT,
          status TEXT DEFAULT 'PENDING',
          reviewed_by TEXT,
          reviewed_at TIMESTAMP,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Nodal officers table
        CREATE TABLE IF NOT EXISTS nodal_officers (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          application_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT,
          department TEXT,
          designation TEXT,
          experience TEXT,
          reason TEXT,
          status TEXT DEFAULT 'PENDING',
          reviewed_by TEXT,
          reviewed_at TIMESTAMP,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_victims_email ON victims(email);
        CREATE INDEX IF NOT EXISTS idx_police_status ON police_officers(status);
        CREATE INDEX IF NOT EXISTS idx_police_email ON police_officers(email);
        CREATE INDEX IF NOT EXISTS idx_bank_status ON bank_officers(status);
        CREATE INDEX IF NOT EXISTS idx_bank_email ON bank_officers(email);
        CREATE INDEX IF NOT EXISTS idx_nodal_status ON nodal_officers(status);
        CREATE INDEX IF NOT EXISTS idx_nodal_email ON nodal_officers(email);
      `
    })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create tables',
        error: error.message 
      })
    }

    return NextResponse.json({ success: true, message: 'All user tables created successfully' })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error creating tables',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}