import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await db.user.count()
    const complaintCount = await db.complaint.count()
    
    // Get sample data
    const users = await db.user.findMany({ take: 3 })
    const complaints = await db.complaint.findMany({ take: 3 })
    
    return NextResponse.json({
      success: true,
      connection: 'Connected to Supabase',
      data: {
        userCount,
        complaintCount,
        sampleUsers: users.map(u => ({ id: u.id, email: u.email, role: u.role })),
        sampleComplaints: complaints.map(c => ({ 
          id: c.id, 
          complaintId: c.complaintId, 
          status: c.status,
          fraudAmount: c.fraudAmount 
        }))
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}