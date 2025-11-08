import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxamtrY2NycXZnc3Rqcm9yd2tyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIzNjM2NSwiZXhwIjoyMDc2ODEyMzY1fQ.qXVvF78kfLrkRKuxEamTusyvrUojwfJmksgvs9BcOpUEQWU3HIGojR04wmMFQrIiMkreuCE3y+aAQpDRZAmhlw'
)

export async function POST() {
  try {
    // Execute SQL commands one by one
    const sqlCommands = [
      `CREATE TABLE IF NOT EXISTS victims (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,
      
      `CREATE TABLE IF NOT EXISTS police_officers (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS bank_officers (
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
      )`,
      
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS bank_name TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS branch_name TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS branch_code TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS ifsc_code TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS employee_id TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS address TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS city TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS state TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS pincode TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS id_card_url TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS employment_certificate_url TEXT`,
      `ALTER TABLE bank_officers ADD COLUMN IF NOT EXISTS bank_authorization_letter_url TEXT`,
      
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS organization_name TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS organization_type TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS employee_id TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS office_address TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS city TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS state TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS pincode TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS jurisdiction_area TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS id_card_url TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS appointment_letter_url TEXT`,
      `ALTER TABLE nodal_officers ADD COLUMN IF NOT EXISTS authorization_certificate_url TEXT`,
      
      `CREATE TABLE IF NOT EXISTS nodal_officers (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS bank_actions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        complaint_id TEXT NOT NULL,
        victim_name TEXT NOT NULL,
        victim_email TEXT NOT NULL,
        fraud_amount DECIMAL(15,2) NOT NULL,
        bank_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        ifsc_code TEXT NOT NULL,
        transaction_id TEXT,
        action_type TEXT DEFAULT 'FREEZE_ACCOUNT',
        status TEXT DEFAULT 'PENDING',
        police_station TEXT NOT NULL,
        assigned_officer TEXT NOT NULL,
        priority TEXT DEFAULT 'MEDIUM',
        notes TEXT,
        processed_by TEXT,
        requested_at TIMESTAMP DEFAULT NOW(),
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`
    ]
    
    for (const sql of sqlCommands) {
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.error('SQL execution error:', error)
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to execute SQL',
          error: error.message,
          sql: sql
        })
      }
    }

    return NextResponse.json({ success: true, message: 'All user tables created/updated successfully' })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error creating tables',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}