import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, amount, refundMethod, processedBy } = body
    
    const refundId = `RF${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const { data, error } = await supabase
      .from('refunds')
      .insert({
        refund_id: refundId,
        complaint_id: complaintId,
        amount: parseFloat(amount),
        refund_method: refundMethod,
        processed_by: processedBy,
        status: 'PROCESSING',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Update complaint status
    await supabase
      .from('complaints')
      .update({ status: 'REFUND_PROCESSING' })
      .eq('complaint_id', complaintId)

    // Send notification to victim
    await sendRefundNotification(complaintId, amount)

    return NextResponse.json({
      success: true,
      data,
      message: 'Refund initiated successfully'
    })
  } catch (error) {
    console.error('Error creating refund:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create refund' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complaintId = searchParams.get('complaintId')
    
    let query = supabase.from('refunds').select('*')
    
    if (complaintId) {
      query = query.eq('complaint_id', complaintId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching refunds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refunds' },
      { status: 500 }
    )
  }
}

async function sendRefundNotification(complaintId: string, amount: string) {
  // Simulate SMS/Email notification
  console.log(`REFUND NOTIFICATION SENT:`)
  console.log(`Complaint ID: ${complaintId}`)
  console.log(`Amount: ₹${amount}`)
  console.log(`Message: Your refund of ₹${amount} is being processed. You will receive updates via SMS/Email.`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
}