import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Access global applications storage
if (!global.applications) {
  global.applications = []
}
let applications = global.applications

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params
    
    // First check in-memory storage
    const memoryApp = applications.find(app => app.application_id === applicationId)
    if (memoryApp) {
      return NextResponse.json({ application: memoryApp })
    }
    
    // Try to fetch from Supabase tables
    try {
      const [policeResult, bankResult, nodalResult] = await Promise.all([
        supabase.from('police_officers').select('*').eq('application_id', applicationId).single(),
        supabase.from('bank_officers').select('*').eq('application_id', applicationId).single(),
        supabase.from('nodal_officers').select('*').eq('application_id', applicationId).single()
      ])
      
      let application = null
      if (policeResult.data) {
        application = { ...policeResult.data, role: 'POLICE_OFFICER' }
      } else if (bankResult.data) {
        application = { ...bankResult.data, role: 'BANK_OFFICER' }
      } else if (nodalResult.data) {
        application = { ...nodalResult.data, role: 'NODAL_OFFICER' }
      }
      
      if (application) {
        return NextResponse.json({ application })
      }
    } catch (supabaseError) {
      console.error('Supabase fetch error:', supabaseError)
    }
    
    // Return mock data if not found in Supabase
    const mockApplication = {
      id: applicationId,
      application_id: applicationId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      role: 'POLICE_OFFICER',
      status: 'PENDING',
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json({ application: mockApplication })
    
  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json({ 
      error: 'Application not found' 
    }, { status: 404 })
  }
}