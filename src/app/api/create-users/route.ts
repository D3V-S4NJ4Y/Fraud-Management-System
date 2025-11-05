import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const users = [
      {
        email: 'admin@odisha.gov.in',
        password: await hashPassword('admin123'),
        name: 'System Administrator',
        phone: '+91 9876543210',
        role: 'ADMIN',
        isActive: true
      },
      {
        email: 'police@odisha.gov.in', 
        password: await hashPassword('police123'),
        name: 'Inspector S. Patnaik',
        phone: '+91 9876543211',
        role: 'POLICE_OFFICER',
        isActive: true
      },
      {
        email: 'victim@example.com',
        password: await hashPassword('password123'),
        name: 'Rajesh Kumar',
        phone: '+91 9876543212',
        role: 'VICTIM',
        isActive: true
      }
    ]

    // Clear existing data
    await prisma.user.deleteMany({})
    await prisma.complaint.deleteMany({})

    const createdUsers = []
    for (const userData of users) {
      const user = await prisma.user.create({ data: userData })
      createdUsers.push({ email: user.email, role: user.role })
    }

    // Create sample complaints
    const victim = createdUsers.find(u => u.email === 'victim@example.com')
    const victimUser = await prisma.user.findFirst({ where: { email: 'victim@example.com' } })

    const complaints = [
      {
        complaintId: 'CF2024001',
        victimId: victimUser!.id,
        victimName: 'Rajesh Kumar',
        victimEmail: 'victim@example.com',
        victimPhone: '+91 9876543212',
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
      },
      {
        complaintId: 'CF2024002',
        victimId: victimUser!.id,
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
    ]

    const createdComplaints = []
    for (const complaintData of complaints) {
      const complaint = await prisma.complaint.create({ data: complaintData })
      createdComplaints.push({ complaintId: complaint.complaintId, status: complaint.status })
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Users and complaints created successfully',
      users: createdUsers,
      complaints: createdComplaints
    })
  } catch (error) {
    console.error('Create users error:', error)
    return NextResponse.json({ error: 'Failed to create users' }, { status: 500 })
  }
}