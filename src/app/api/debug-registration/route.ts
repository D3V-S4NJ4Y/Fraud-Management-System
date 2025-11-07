import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if victims table exists
    try {
      const { data, error } = await adminSupabase
        .from('victims')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        return NextResponse.json({
          success: false,
          error: 'Victims table does not exist',
          details: error.message,
          solution: 'Please create the victims table first'
        })
      }

      // Try to insert test data
      const testData = {
        name: 'Test User',
        email: email || 'test@example.com',
        phone: '1234567890',
        password: 'test123',
        role: 'VICTIM',
        is_active: true
      }

      const { data: insertData, error: insertError } = await adminSupabase
        .from('victims')
        .insert([testData])
        .select()

      if (insertError) {
        return NextResponse.json({
          success: false,
          error: 'Failed to insert test data',
          details: insertError.message,
          testData
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Victims table exists and working',
        insertedData: insertData[0]
      })

    } catch (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Table check failed',
        details: tableError.message
      })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}