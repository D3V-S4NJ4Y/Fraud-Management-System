import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Clear existing data first
    await db.user.deleteMany({})
    await db.complaint.deleteMany({})
    
    // Admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await db.user.create({
      data: {
        email: 'admin@odisha.gov.in',
        password: adminPassword,
        name: 'System Administrator',
        phone: '+91 9876543210',
        role: 'ADMIN',
        isActive: true
      }
    })

    // Police officer
    const policePassword = await hashPassword('police123')
    const police = await db.user.create({
      data: {
        email: 'police@odisha.gov.in',
        password: policePassword,
        name: 'Inspector S. Patnaik',
        phone: '+91 9876543211',
        role: 'POLICE_OFFICER',
        isActive: true
      }
    })

    // Victim user
    const victimPassword = await hashPassword('password123')
    const victim = await db.user.create({
      data: {
        email: 'victim@example.com',
        password: victimPassword,
        name: 'Rajesh Kumar',
        phone: '+91 9876543212',
        role: 'VICTIM',
        isActive: true
      }
    })

    // Sample complaints
    const complaint1 = await db.complaint.create({
      data: {
        complaintId: 'CF2024001',
        victimId: victim.id,
        victimName: victim.name!,
        victimEmail: victim.email,
        victimPhone: victim.phone!,
        fraudType: 'PHISHING',
        fraudAmount: 50000,
        fraudDate: new Date('2024-01-15'),
        fraudDescription: 'Received phishing email claiming to be from bank asking for OTP',
        bankName: 'State Bank of India',
        accountNumber: '****1234',
        transactionId: 'TXN123456789',
        status: 'FUNDS_FROZEN',
        priority: 'HIGH',
        policeStation: 'Cyber Police Station, Bhubaneswar',
        district: 'Khordha',
        assignedOfficer: 'Inspector S. Patnaik'
      }
    })

    const complaint2 = await db.complaint.create({
      data: {
        complaintId: 'CF2024002',
        victimId: victim.id,
        victimName: 'Priya Sharma',
        victimEmail: 'priya@example.com',
        victimPhone: '+91 9123456789',
        fraudType: 'ONLINE_SHOPPING',
        fraudAmount: 25000,
        fraudDate: new Date('2024-01-18'),
        fraudDescription: 'Fake online shopping website, paid but never received product',
        bankName: 'HDFC Bank',
        accountNumber: '****5678',
        transactionId: 'TXN987654321',
        status: 'REFUND_PROCESSING',
        priority: 'MEDIUM',
        policeStation: 'Cyber Police Station, Cuttack',
        district: 'Cuttack'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        users: [
          { email: admin.email, password: 'admin123', role: 'ADMIN' },
          { email: police.email, password: 'police123', role: 'POLICE_OFFICER' },
          { email: victim.email, password: 'password123', role: 'VICTIM' }
        ],
        complaints: [complaint1.complaintId, complaint2.complaintId]
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to create test data' }, { status: 500 })
  }
}