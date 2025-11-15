import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, bankName, nodalOfficerName, nodalOfficerEmail, nodalOfficerPhone, actionRequired } = body
    
    const nodalId = `NO${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const { data, error } = await supabase
      .from('nodal_actions')
      .insert({
        complaint_id: complaintId,
        victim_name: 'Unknown', // Will be updated with actual victim name
        victim_email: 'unknown@example.com', // Will be updated
        fraud_amount: 0, // Will be updated
        bank_name: bankName,
        coordination_type: 'BANK_COORDINATION',
        status: 'PENDING',
        assigned_officer: nodalOfficerName,
        notes: actionRequired,
        processed_by: nodalOfficerEmail
      })
      .select()
      .single()

    if (error) throw error

    // Send alert to nodal officer
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintId,
        type: 'EMAIL',
        message: `New cyber fraud case ${complaintId} assigned. Action required: ${actionRequired}`,
        recipient: nodalOfficerEmail
      })
    })

    return NextResponse.json({
      success: true,
      data,
      message: 'Nodal officer assigned successfully'
    })
  } catch (error) {
    console.error('Error assigning nodal officer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to assign nodal officer' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complaintId = searchParams.get('complaintId')
    
    let query = supabase.from('nodal_actions').select('*')
    
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
    console.error('Error fetching nodal officers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nodal officers' },
      { status: 500 }
    )
  }
}