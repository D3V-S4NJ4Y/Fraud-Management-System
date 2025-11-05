import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, bankName, branchName, accountNumber, actionType, amount, notes } = body
    
    const actionId = `BA${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const { data, error } = await supabase
      .from('bank_actions')
      .insert({
        action_id: actionId,
        complaint_id: complaintId,
        bank_name: bankName,
        branch_name: branchName,
        account_number: accountNumber,
        action_type: actionType,
        amount: amount ? parseFloat(amount) : null,
        notes,
        status: 'PENDING',
        requested_by: 'Police Officer',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Send automated alert to bank (simulated)
    await sendBankAlert(bankName, actionType, complaintId)

    return NextResponse.json({
      success: true,
      data,
      message: 'Bank action initiated successfully'
    })
  } catch (error) {
    console.error('Error creating bank action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bank action' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complaintId = searchParams.get('complaintId')
    
    let query = supabase.from('bank_actions').select('*')
    
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
    console.error('Error fetching bank actions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank actions' },
      { status: 500 }
    )
  }
}

async function sendBankAlert(bankName: string, actionType: string, complaintId: string) {
  // Simulate automated bank alert
  console.log(`AUTOMATED ALERT SENT TO ${bankName}:`)
  console.log(`Action: ${actionType}`)
  console.log(`Complaint ID: ${complaintId}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  
  // In real implementation, this would integrate with:
  // - RBI frameworks
  // - NPCI systems
  // - Bank APIs
  // - Email/SMS services
}