import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const results = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
      tests: {}
    }

    // Test service role connection
    try {
      const { data, error } = await serviceSupabase.from('victims').select('count', { count: 'exact', head: true })
      results.tests.connection = { success: !error, error: error?.message }
    } catch (err) {
      results.tests.connection = { success: false, error: err.message }
    }

    // Test insert
    try {
      const testData = {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        phone: '1234567890',
        password: 'test123',
        role: 'VICTIM'
      }

      const { data, error } = await serviceSupabase
        .from('victims')
        .insert([testData])
        .select()

      if (error) {
        results.tests.insert = { 
          success: false, 
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      } else {
        results.tests.insert = { success: true, data: data[0] }
        // Clean up
        await serviceSupabase.from('victims').delete().eq('id', data[0].id)
      }
    } catch (err) {
      results.tests.insert = { success: false, error: err.message }
    }

    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}