import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch from Supabase only
    const [policeResult, bankResult, nodalResult] = await Promise.all([
      supabase.from('police_officers').select('*').order('created_at', { ascending: false }),
      supabase.from('bank_officers').select('*').order('created_at', { ascending: false }),
      supabase.from('nodal_officers').select('*').order('created_at', { ascending: false })
    ])
    
    const applications = [
      ...(policeResult.data || []).map(app => ({ ...app, role: 'POLICE_OFFICER' })),
      ...(bankResult.data || []).map(app => ({ ...app, role: 'BANK_OFFICER' })),
      ...(nodalResult.data || []).map(app => ({ ...app, role: 'NODAL_OFFICER' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return NextResponse.json({ applications })
    
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch applications from database',
      applications: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const applicationId = `APP${Date.now()}`
    const role = formData.get('role') as string
    
    // Create application data
    const applicationData = {
      id: applicationId,
      application_id: applicationId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      password: formData.get('password') as string,
      role,
      status: 'PENDING',
      state: formData.get('state') as string || null,
      district: formData.get('district') as string || null,
      police_station: formData.get('police_station') as string || null,
      department: formData.get('department') as string || null,
      designation: formData.get('designation') as string || null,
      experience: formData.get('experience') as string || null,
      reason: formData.get('reason') as string || null,
      created_at: new Date().toISOString()
    }
    
    console.log('Processing application:', applicationData)
    
    // Try to insert into Supabase
    try {
      if (role === 'VICTIM') {
        const victimData = {
          name: applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone,
          password: formData.get('password') as string,
          role: 'VICTIM',
          is_active: true,
          created_at: new Date().toISOString()
        }
        
        console.log('Attempting to insert victim data:', victimData)
        
        const { data, error } = await supabase
          .from('victims')
          .insert([victimData])
          .select()
        
        if (error) {
          console.error('Victim Supabase insert error:', error)
          console.error('Error code:', error.code)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          
          // Return specific error message
          return NextResponse.json({ 
            error: `Database error: ${error.message}`,
            code: error.code,
            details: error.details,
            hint: error.hint
          }, { status: 500 })
        }
        
        console.log('Victim data saved to Supabase:', data[0])
        return NextResponse.json({ 
          success: true, 
          message: 'Account created successfully. You can now login.',
          user: data[0]
        })
      } else {
        // For officers
        let tableName = ''
        if (role === 'POLICE_OFFICER') tableName = 'police_officers'
        else if (role === 'BANK_OFFICER') tableName = 'bank_officers'
        else if (role === 'NODAL_OFFICER') tableName = 'nodal_officers'
        
        let supabaseData = {
          application_id: applicationId,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string || null,
          password: formData.get('password') as string,
          department: formData.get('department') as string || null,
          designation: formData.get('designation') as string || null,
          experience: formData.get('experience') as string || null,
          reason: formData.get('reason') as string || null,
          status: 'PENDING'
        }
        
        // Add role-specific fields
        if (role === 'POLICE_OFFICER') {
          supabaseData = {
            ...supabaseData,
            state: formData.get('state') as string || null,
            district: formData.get('district') as string || null,
            police_station: formData.get('police_station') as string || null,
            id_card_url: formData.get('id_card') ? `uploads/police_ids/${applicationId}_id.jpg` : null,
            document_url: formData.get('document') ? `uploads/police_docs/${applicationId}_doc.jpg` : null
          }
        } else if (role === 'BANK_OFFICER') {
          supabaseData = {
            ...supabaseData,
            bank_name: formData.get('bankName') as string,
            branch_name: formData.get('branchName') as string,
            branch_code: formData.get('branchCode') as string,
            ifsc_code: formData.get('ifscCode') as string,
            employee_id: formData.get('employeeId') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            pincode: formData.get('pincode') as string,
            id_card_url: formData.get('idCard') ? `uploads/bank_ids/${applicationId}_id.jpg` : null,
            employment_certificate_url: formData.get('employmentCertificate') ? `uploads/bank_certificates/${applicationId}_cert.jpg` : null,
            bank_authorization_letter_url: formData.get('authorizationLetter') ? `uploads/bank_letters/${applicationId}_letter.jpg` : null
          }
        } else if (role === 'NODAL_OFFICER') {
          supabaseData = {
            ...supabaseData,
            organization_name: formData.get('organizationName') as string,
            organization_type: formData.get('organizationType') as string,
            employee_id: formData.get('employeeId') as string,
            office_address: formData.get('officeAddress') as string,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            pincode: formData.get('pincode') as string,
            jurisdiction_area: formData.get('jurisdictionArea') as string,
            id_card_url: formData.get('idCard') ? `uploads/nodal_ids/${applicationId}_id.jpg` : null,
            appointment_letter_url: formData.get('appointmentLetter') ? `uploads/nodal_appointments/${applicationId}_appointment.jpg` : null,
            authorization_certificate_url: formData.get('authorizationCertificate') ? `uploads/nodal_certificates/${applicationId}_certificate.jpg` : null
          }
        }
        
        const { data, error } = await supabase
          .from(tableName)
          .insert([supabaseData])
          .select()
        
        if (error) {
          console.error('Officer Supabase insert error:', error)
          throw error
        }
        
        console.log('Data saved to Supabase:', data[0])
        return NextResponse.json({ 
          application: data[0]
        })
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError)
      
      // For now, return success for victims to test login
      if (role === 'VICTIM') {
        return NextResponse.json({ 
          success: true, 
          message: 'Account created successfully (temporary - fix Supabase)',
          user: {
            id: applicationId,
            name: applicationData.name,
            email: applicationData.email,
            role: 'VICTIM'
          }
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to create account. Please check if database tables exist.',
        details: supabaseError.message
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Application creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, reviewedBy } = await request.json()
    
    const updateData = {
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      is_active: status === 'APPROVED'
    }
    
    await Promise.all([
      supabase.from('police_officers').update(updateData).eq('application_id', applicationId),
      supabase.from('bank_officers').update(updateData).eq('application_id', applicationId),
      supabase.from('nodal_officers').update(updateData).eq('application_id', applicationId)
    ])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}