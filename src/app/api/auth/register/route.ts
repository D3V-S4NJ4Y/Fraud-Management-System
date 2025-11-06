import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Registration request received:', body)
    
    // Basic validation
    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const { email, password, name, phone, role } = body

    // Only allow victim registration through this endpoint
    if (role !== 'VICTIM') {
      return NextResponse.json({ success: false, error: 'Only victims can register directly. Officers must submit applications.' }, { status: 400 })
    }

    // Check if user exists in Supabase
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
    
    if (checkError) {
      console.error('Error checking existing user:', checkError)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in Supabase
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role,
        is_active: true
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error creating user:', insertError)
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    }

    console.log('User created successfully in Supabase:', user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    }, { status: 500 })
  }
}

// Get all users for testing
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role')
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }
    
    return NextResponse.json({ success: true, users: users || [] })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' })
  }
}