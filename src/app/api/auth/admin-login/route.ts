import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Check admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123'
    
    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          name: 'Admin',
          email: adminEmail,
          role: 'ADMIN',
          status: 'APPROVED'
        }
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid admin credentials' 
      }, { status: 401 })
    }
    
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ 
      error: 'Login failed' 
    }, { status: 500 })
  }
}