import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxamtrY2NycXZnc3Rqcm9yd2tyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIzNjM2NSwiZXhwIjoyMDc2ODEyMzY1fQ.qXVvF78kfLrkRKuxEamTusyvrUojwfJmksgvs9BcOpUEQWU3HIGojR04wmMFQrIiMkreuCE3y+aAQpDRZAmhlw'
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bankName = searchParams.get('bankName')
    const status = searchParams.get('status')

    let query = supabase
      .from('bank_actions')
      .select('*')
      .order('created_at', { ascending: false })

    if (bankName) {
      query = query.eq('bank_name', bankName)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: bankActions, error } = await query

    if (error) {
      console.error('Error fetching bank actions:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        data: []
      })
    }

    return NextResponse.json({
      success: true,
      data: bankActions || []
    })
  } catch (error) {
    console.error('Bank actions fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bank actions',
      data: []
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const bankActionData = {
      complaint_id: body.complaint_id,
      victim_name: body.victim_name,
      victim_email: body.victim_email,
      fraud_amount: body.fraud_amount,
      bank_name: body.bank_name,
      account_number: body.account_number,
      ifsc_code: body.ifsc_code,
      transaction_id: body.transaction_id,
      action_type: body.action_type || 'FREEZE_ACCOUNT',
      status: 'PENDING',
      police_station: body.police_station,
      assigned_officer: body.assigned_officer,
      priority: body.priority || 'MEDIUM',
      notes: body.notes,
      requested_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bank_actions')
      .insert([bankActionData])
      .select()

    if (error) {
      console.error('Error creating bank action:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Bank action creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create bank action'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionId, status, notes, processedBy } = body

    const updateData = {
      status,
      notes,
      processed_by: processedBy,
      processed_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bank_actions')
      .update(updateData)
      .eq('id', actionId)
      .select()

    if (error) {
      console.error('Error updating bank action:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Bank action update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update bank action'
    }, { status: 500 })
  }
}