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
    
    // Try to fetch from unified users table
    try {
      // Extract user ID from application ID (remove APP prefix)
      const userId = applicationId.replace('APP', '')
      
      // Find user by matching ID suffix
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .like('id', `%${userId}`)
      
      if (users && users.length > 0) {
        const user = users[0]
        const application = {
          id: user.id,
          application_id: applicationId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.is_active ? 'APPROVED' : 'PENDING',
          state: user.state,
          district: user.district,
          police_station: user.police_station,
          department: user.department,
          designation: user.designation,
          experience: user.experience,
          bank_name: user.bank_name,
          organization_name: user.organization_name,
          created_at: user.created_at
        }
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