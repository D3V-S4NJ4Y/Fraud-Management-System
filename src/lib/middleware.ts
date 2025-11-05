import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from './auth'
import { db } from './db'

export async function authMiddleware(request: NextRequest, requiredRoles?: string[]) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await validateSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  if (requiredRoles && !requiredRoles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return session
}

export async function rateLimitMiddleware(request: NextRequest, limit = 100, window = 3600) {
  const ip = request.ip || 'unknown'
  const key = `rate_limit:${ip}`
  
  const now = new Date()
  const resetAt = new Date(now.getTime() + window * 1000)
  
  const existing = await db.rateLimit.findFirst({ where: { key } })
  
  if (existing) {
    if (existing.resetAt > now) {
      if (existing.count >= limit) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
      }
      await db.rateLimit.update({
        where: { key },
        data: { count: existing.count + 1 }
      })
    } else {
      await db.rateLimit.update({
        where: { key },
        data: { count: 1, resetAt }
      })
    }
  } else {
    await db.rateLimit.create({
      data: { key, count: 1, resetAt }
    })
  }
  
  return null
}

export async function auditLog(userId: string | null, action: string, resource: string, resourceId?: string, details?: string, request?: NextRequest) {
  await db.auditLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: request?.ip || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown'
    }
  })
}