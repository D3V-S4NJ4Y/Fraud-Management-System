import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, type, message, recipient } = body
    
    const notificationId = `NT${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        notification_id: notificationId,
        complaint_id: complaintId,
        type, // SMS, EMAIL, PUSH
        message,
        recipient,
        status: 'SENT',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Simulate sending notification
    await sendNotification(type, recipient, message)

    return NextResponse.json({
      success: true,
      data,
      message: 'Notification sent successfully'
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complaintId = searchParams.get('complaintId')
    
    let query = supabase.from('notifications').select('*')
    
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
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

async function sendNotification(type: string, recipient: string, message: string) {
  console.log(`${type} NOTIFICATION SENT:`)
  console.log(`To: ${recipient}`)
  console.log(`Message: ${message}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  
  // In real implementation, integrate with:
  // - SMS gateway (Twilio, AWS SNS)
  // - Email service (SendGrid, AWS SES)
  // - Push notification service
}