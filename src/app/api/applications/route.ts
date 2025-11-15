import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase-service'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    console.log('Fetching applications from Supabase...')
    
    const { data: users, error } = await supabaseService
      .from('users')
      .select('*')
      .neq('role', 'VICTIM')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ applications: [], error: error.message })
    }

    console.log('Found users:', users?.length || 0)

    const applications = users?.map(user => ({
      id: user.id,
      application_id: `APP${user.id.slice(-6)}`,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.is_active ? 'APPROVED' : 'PENDING',
      created_at: user.created_at
    })) || []

    console.log('Mapped applications:', applications.length)
    return NextResponse.json({ applications })
  } catch (error) {
    console.error('GET applications error:', error)
    return NextResponse.json({ applications: [], error: 'Server error' })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/applications - Starting...')
    const formData = await request.formData()
    console.log('FormData received, role:', formData.get('role'))
    
    const applicationId = `APP${Date.now()}`
    const password = formData.get('password') as string
    
    if (!password) {
      console.error('No password provided')
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }
    
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const userData = {
      email: formData.get('email') as string,
      password: hashedPassword,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string,
      is_active: formData.get('role') === 'VICTIM' ? true : false
    }
    
    console.log('User data prepared:', { ...userData, password: '[HIDDEN]' })
    console.log('Inserting into Supabase...')

    const { data, error } = await supabaseService
      .from('users')
      .insert([userData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'Email already exists. Please use a different email or login with existing account.',
          details: error.message
        }, { status: 400 })
      }
      return NextResponse.json({ 
        error: 'Failed to create application',
        details: error.message
      }, { status: 500 })
    }

    console.log('User created successfully:', data[0].id)
    
    const mockApplication = {
      id: data[0].id,
      application_id: applicationId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.role === 'VICTIM' ? 'APPROVED' : 'PENDING',
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      application: mockApplication,
      success: true
    })
  } catch (error) {
    console.error('POST applications catch error:', error)
    return NextResponse.json({ 
      error: 'Failed to create application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status } = await request.json()
    console.log('Updating application:', applicationId, 'to status:', status)
    
    // Extract user ID from application ID (remove APP prefix and get last 6 chars)
    const userId = applicationId.replace('APP', '')
    
    // First, find the user by matching the ID suffix
    const { data: users, error: fetchError } = await supabaseService
      .from('users')
      .select('id')
      .like('id', `%${userId}`)
    
    if (fetchError || !users || users.length === 0) {
      console.error('User not found:', fetchError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const actualUserId = users[0].id
    console.log('Found user ID:', actualUserId)

    if (status === 'APPROVED') {
      const { error } = await supabaseService
        .from('users')
        .update({ is_active: true })
        .eq('id', actualUserId)

      if (error) {
        console.error('Approval error:', error)
        throw error
      }
    } else if (status === 'REJECTED') {
      const { error } = await supabaseService
        .from('users')
        .delete()
        .eq('id', actualUserId)

      if (error) {
        console.error('Rejection error:', error)
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT applications error:', error)
    return NextResponse.json({ 
      error: 'Failed to update application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}