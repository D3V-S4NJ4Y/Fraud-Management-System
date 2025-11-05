import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, targetAudience, channels } = body

    if (!type || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const users = await db.user.findMany({
      where: {
        role: targetAudience || 'VICTIM'
      }
    })

    const notifications = await Promise.all(
      users.map(user =>
        db.notification.create({
          data: {
            userId: user.id,
            title: `Cyber Awareness Alert: ${type}`,
            message,
            type: 'AWARENESS_ALERT',
            channel: channels?.[0] || 'EMAIL',
            status: 'PENDING'
          }
        })
      )
    )

    const ZAI = await import('z-ai-web-dev-sdk').then(m => m.default)
    const zai = await ZAI.create()
    
    try {
      const searchResult = await zai.functions.invoke('web_search', {
        query: `latest cyber fraud trends ${type} India 2024 prevention tips`,
        num: 5
      })

      console.log('Awareness content enhanced with latest information:', searchResult)
    } catch (searchError) {
      console.error('Awareness content search failed:', searchError)
    }

    return NextResponse.json({
      success: true,
      data: {
        notificationsSent: notifications.length,
        recipients: users.length
      },
      message: 'Awareness alert sent successfully'
    })
  } catch (error) {
    console.error('Error sending awareness alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send awareness alert' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const awarenessContent = {
      phishing: {
        title: 'Phishing Awareness',
        tips: [
          'Always verify sender email addresses',
          'Never click on suspicious links',
          'Check for spelling and grammar errors',
          'Verify with the organization directly',
          'Never share OTP or passwords'
        ],
        emergency: 'If you clicked on suspicious links, immediately change your passwords and contact your bank'
      },
      onlineShopping: {
        title: 'Online Shopping Safety',
        tips: [
          'Shop from trusted websites only',
          'Check HTTPS and padlock symbol',
          'Read reviews and ratings',
          'Use secure payment methods',
          'Keep transaction records'
        ],
        emergency: 'If you paid but didn\'t receive products, file a complaint within 24 hours'
      },
      banking: {
        title: 'Banking Security',
        tips: [
          'Never share banking credentials',
          'Use strong, unique passwords',
          'Enable two-factor authentication',
          'Regularly check statements',
          'Report unauthorized transactions'
        ],
        emergency: 'If you notice unauthorized transactions, immediately call 1930 and your bank'
      },
      socialMedia: {
        title: 'Social Media Safety',
        tips: [
          'Be cautious with friend requests',
          'Don\'t share personal information',
          'Verify identity before sharing',
          'Report fake profiles',
          'Use privacy settings'
        ],
        emergency: 'If you\'re being scammed on social media, report the profile and file a complaint'
      }
    }

    return NextResponse.json({
      success: true,
      data: awarenessContent
    })
  } catch (error) {
    console.error('Error fetching awareness content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch awareness content' },
      { status: 500 }
    )
  }
}