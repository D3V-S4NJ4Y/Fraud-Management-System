import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, complaintId, title, message, type, channel, scheduledAt } = body

    if (!title || !message || !type || !channel) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = await db.notification.create({
      data: {
        userId,
        complaintId,
        title,
        message,
        type,
        channel,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'PENDING'
      }
    })

    if (channel === 'EMAIL' && !scheduledAt) {
      await sendEmailNotification(notification)
    } else if (channel === 'SMS' && !scheduledAt) {
      await sendSMSNotification(notification)
    }

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const complaintId = searchParams.get('complaintId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereClause: any = {}
    
    if (userId) whereClause.userId = userId
    if (complaintId) whereClause.complaintId = complaintId
    if (status) whereClause.status = status

    const notifications = await db.notification.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        complaint: {
          select: {
            id: true,
            complaintId: true,
            victimName: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: notifications
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

async function sendEmailNotification(notification: any) {
  try {
    console.log(`Sending email notification: ${notification.title}`)
    console.log(`To: ${notification.user?.email}`)
    console.log(`Message: ${notification.message}`)
    
    await db.notification.update({
      where: { id: notification.id },
      data: {
        status: 'SENT',
        sentAt: new Date()
      }
    })

    const ZAI = await import('z-ai-web-dev-sdk').then(m => m.default)
    const zai = await ZAI.create()
    
    try {
      await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a cyber fraud support assistant. Generate professional and empathetic email notifications for victims of cyber fraud.'
          },
          {
            role: 'user',
            content: `Generate a professional email notification with the following details:
            Subject: ${notification.title}
            Message: ${notification.message}
            Recipient: ${notification.user?.name}
            
            Make it empathetic, professional, and include helpful guidance.`
          }
        ]
      })
    } catch (aiError) {
      console.error('AI email generation failed:', aiError)
    }
  } catch (error) {
    console.error('Error sending email notification:', error)
    await db.notification.update({
      where: { id: notification.id },
      data: { status: 'FAILED' }
    })
  }
}

async function sendSMSNotification(notification: any) {
  try {
    console.log(`Sending SMS notification: ${notification.title}`)
    console.log(`To: ${notification.user?.phone}`)
    console.log(`Message: ${notification.message}`)
    
    await db.notification.update({
      where: { id: notification.id },
      data: {
        status: 'SENT',
        sentAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error sending SMS notification:', error)
    await db.notification.update({
      where: { id: notification.id },
      data: { status: 'FAILED' }
    })
  }
}