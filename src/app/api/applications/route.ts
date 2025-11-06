import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ applications })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const applicationId = `APP${Date.now()}`

    // Extract form data
    const applicationData = {
      application_id: applicationId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
      state: formData.get('state') as string,
      district: formData.get('district') as string,
      police_station: formData.get('police_station') as string,
      department: formData.get('department') as string,
      designation: formData.get('designation') as string,
      experience: formData.get('experience') as string,
      reason: formData.get('reason') as string,
      id_card_url: 'uploaded', // Simulate file upload
      document_url: 'uploaded' // Simulate file upload
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()

    if (error) throw error

    return NextResponse.json({ application: data[0] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status } = await request.json()

    const { error } = await supabase
      .from('applications')
      .update({ 
        status,
        reviewed_by: 'admin@gmail.com',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (error) throw error

    // If approved, create user account
    if (status === 'APPROVED') {
      const { data: application } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (application) {
        // Use the password from application if available, otherwise use default
        const password = application.password || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2'
        
        await supabase
          .from('users')
          .insert([{
            email: application.email,
            password: password,
            name: application.name,
            phone: application.phone,
            role: application.role,
            is_active: true
          }])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}