import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Check for admin login
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      return NextResponse.json({
        success: true,
        status: 'APPROVED',
        user: {
          id: 'admin',
          name: 'Admin',
          email: 'admin@gmail.com',
          role: 'ADMIN',
          status: 'APPROVED'
        }
      })
    }

    // Check for victim login
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
    
    console.log('Checking victim login for email:', email)
    
    const { data: victimData, error: victimError } = await supabase
      .from('victims')
      .select('*')
      .eq('email', email)

    console.log('Victim query result:', { victimData, victimError })

    if (victimData && victimData.length > 0 && !victimError) {
      console.log('Found victim, checking password')
      const victim = victimData[0]
      
      if (victim.password === password) {
        console.log('Password match, logging in victim')
        return NextResponse.json({
          success: true,
          status: 'APPROVED',
          user: {
            id: victim.id,
            name: victim.name,
            email: victim.email,
            role: 'VICTIM',
            status: 'APPROVED'
          }
        })
      } else {
        console.log('Password mismatch for victim')
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    } else {
      console.log('Victim not found or error:', victimError)
    }
    
    console.log('Moving to police officer check...')
    
    // Check for police officer login
    console.log('Checking police officer login for email:', email)
    
    const { data: policeData, error: policeError } = await supabase
      .from('police_officers')
      .select('*')
      .eq('email', email)

    console.log('Police query result:', { policeData, policeError })

    if (policeData && policeData.length > 0 && !policeError) {
      console.log('Found police officer, checking password')
      const officer = policeData[0]
      
      if (officer.password === password) {
        console.log('Password match, logging in police officer')
        return NextResponse.json({
          success: true,
          status: officer.status || 'PENDING',
          user: {
            id: officer.id,
            name: officer.name,
            email: officer.email,
            role: 'POLICE_OFFICER',
            status: officer.status || 'PENDING'
          }
        })
      } else {
        console.log('Password mismatch for police officer')
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    } else {
      console.log('Police officer not found or error:', policeError)
    }
    
    // Check for bank officer login
    const { data: bankData, error: bankError } = await supabase
      .from('bank_officers')
      .select('*')
      .eq('email', email)

    if (bankData && bankData.length > 0 && !bankError) {
      const officer = bankData[0]
      if (officer.password === password) {
        return NextResponse.json({
          success: true,
          status: officer.status || 'PENDING',
          user: {
            id: officer.id,
            name: officer.name,
            email: officer.email,
            role: 'BANK_OFFICER',
            status: officer.status || 'PENDING'
          }
        })
      } else {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }
    
    // Check for nodal officer login
    const { data: nodalData, error: nodalError } = await supabase
      .from('nodal_officers')
      .select('*')
      .eq('email', email)

    if (nodalData && nodalData.length > 0 && !nodalError) {
      const officer = nodalData[0]
      if (officer.password === password) {
        return NextResponse.json({
          success: true,
          status: officer.status || 'PENDING',
          user: {
            id: officer.id,
            name: officer.name,
            email: officer.email,
            role: 'NODAL_OFFICER',
            status: officer.status || 'PENDING'
          }
        })
      } else {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }
    
    return NextResponse.json({ error: 'User not found' }, { status: 404 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}