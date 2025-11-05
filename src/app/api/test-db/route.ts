import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('complaints').select('*').limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection works',
      data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      details: error
    })
  }
}

export async function POST() {
  try {
    // Test minimal insert
    const testData = {
      complaint_id: `TEST${Date.now()}`,
      victim_name: 'Test User',
      victim_email: 'test@example.com',
      victim_phone: '1234567890',
      fraud_type: 'PHISHING',
      fraud_amount: 1000,
      fraud_date: '2024-01-01',
      fraud_description: 'Test description',
      district: 'Test District',
      status: 'PENDING'
    }
    
    const { data, error } = await supabase
      .from('complaints')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Insert failed',
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Insert works',
      data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Insert failed',
      details: error
    })
  }
}