import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // SQL to create all required tables
    const createTablesSQL = `
      -- Create victims table
      CREATE TABLE IF NOT EXISTS victims (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'VICTIM',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create police_officers table
      CREATE TABLE IF NOT EXISTS police_officers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          application_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255) NOT NULL,
          state VARCHAR(100),
          district VARCHAR(100),
          police_station VARCHAR(255),
          department VARCHAR(255),
          designation VARCHAR(255),
          experience VARCHAR(100),
          reason TEXT,
          id_card_url TEXT,
          document_url TEXT,
          status VARCHAR(50) DEFAULT 'PENDING',
          reviewed_by VARCHAR(255),
          reviewed_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create bank_officers table
      CREATE TABLE IF NOT EXISTS bank_officers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          application_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255),
          department VARCHAR(255),
          designation VARCHAR(255),
          experience VARCHAR(100),
          reason TEXT,
          id_card_url TEXT,
          document_url TEXT,
          status VARCHAR(50) DEFAULT 'PENDING',
          reviewed_by VARCHAR(255),
          reviewed_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create nodal_officers table
      CREATE TABLE IF NOT EXISTS nodal_officers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          application_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password VARCHAR(255),
          department VARCHAR(255),
          designation VARCHAR(255),
          experience VARCHAR(100),
          reason TEXT,
          id_card_url TEXT,
          document_url TEXT,
          status VARCHAR(50) DEFAULT 'PENDING',
          reviewed_by VARCHAR(255),
          reviewed_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Please run this SQL in Supabase SQL Editor',
      sql: createTablesSQL
    })

  } catch (error) {
    console.error('Setup tables error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if tables exist
    const tables = ['victims', 'police_officers', 'bank_officers', 'nodal_officers']
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { data, error } = await adminSupabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        tableStatus[table] = {
          exists: !error,
          error: error?.message || null
        }
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err.message
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      tables: tableStatus
    })

  } catch (error) {
    console.error('Check tables error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}