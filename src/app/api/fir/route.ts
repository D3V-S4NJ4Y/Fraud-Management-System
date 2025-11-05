import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, firNumber, firDate, policeStation, investigatingOfficer } = body
    
    const { data, error } = await supabase
      .from('complaints')
      .update({
        fir_number: firNumber,
        fir_date: firDate,
        police_station: policeStation,
        assigned_officer: investigatingOfficer,
        status: 'UNDER_INVESTIGATION',
        updated_at: new Date().toISOString()
      })
      .eq('complaint_id', complaintId)
      .select()
      .single()

    if (error) throw error

    const updateId = `CU${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    await supabase
      .from('case_updates')
      .insert({
        update_id: updateId,
        complaint_id: complaintId,
        title: 'FIR Filed',
        description: `FIR ${firNumber} filed at ${policeStation}. Investigation assigned to ${investigatingOfficer}.`,
        status: 'UNDER_INVESTIGATION',
        updated_by: investigatingOfficer
      })

    return NextResponse.json({
      success: true,
      data,
      message: 'FIR details updated successfully'
    })
  } catch (error) {
    console.error('Error updating FIR:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update FIR details' },
      { status: 500 }
    )
  }
}