import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    // Create applications table using direct SQL
    const { error } = await supabase
      .from('applications')
      .select('id')
      .limit(1)

    // If table doesn't exist, create it
    if (error && error.message.includes('relation "public.applications" does not exist')) {
      // Since we can't execute DDL directly, we'll return instructions
      return NextResponse.json({ 
        success: false, 
        error: 'Applications table does not exist. Please run the SQL in create-applications-table.sql in your Supabase dashboard.',
        sql: `
CREATE TABLE IF NOT EXISTS applications (
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
);`
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Applications table exists' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to check applications table' }, { status: 500 })
  }
}