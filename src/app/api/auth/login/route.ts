import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt:', { email })
    
    // Check for admin login
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      return NextResponse.json({
        success: true,
        status: 'APPROVED',
        user: {
          id: 'admin',
          name: 'Admin',
          email: 'admin@gmail.com',
          role: 'ADMIN'
        }
      })
    }

    // Test police login
    if (email === 'police@gmail.com' && password === '123456') {
      return NextResponse.json({
        success: true,
        status: 'APPROVED',
        user: {
          id: 'police1',
          name: 'Police Officer',
          email: 'police@gmail.com',
          role: 'POLICE_OFFICER'
        }
      })
    }

    // Check users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)

    console.log('Database query result:', { users, error })

    if (error || !users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[0]
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Check if user is active (for officers)
    if (user.role !== 'VICTIM' && !user.is_active) {
      return NextResponse.json({
        success: true,
        status: 'PENDING',
        message: 'Your application is pending approval'
      })
    }

    return NextResponse.json({
      success: true,
      status: 'APPROVED',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Login API is working' })
}