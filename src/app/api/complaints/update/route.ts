import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, status, title, description, updatedBy } = body
    
    // Update complaint status
    const { data: complaint, error: updateError } = await supabase
      .from('complaints')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('complaint_id', complaintId)
      .select()
      .single()

    if (updateError) throw updateError

    // Create case update record
    const updateId = `CU${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const { data: caseUpdate, error: caseError } = await supabase
      .from('case_updates')
      .insert({
        update_id: updateId,
        complaint_id: complaintId,
        title,
        description,
        status,
        updated_by: updatedBy,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (caseError) throw caseError

    // Send notification to victim
    if (complaint) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId,
          type: 'SMS',
          message: `Update on your complaint ${complaintId}: ${title}. Status: ${status.replace('_', ' ')}`,
          recipient: complaint.victim_phone
        })
      })
    }

    return NextResponse.json({
      success: true,
      data: { complaint, caseUpdate },
      message: 'Complaint updated successfully'
    })
  } catch (error) {
    console.error('Error updating complaint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    )
  }
}