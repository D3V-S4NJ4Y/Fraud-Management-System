import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'
import { auditLog } from '@/lib/middleware'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('auth-token')?.value

    if (token) {
      await deleteSession(token)
      await auditLog(null, 'LOGOUT', 'USER', null, 'User logged out', request)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('auth-token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}