import { NextResponse } from 'next/server'

// Add some test data
if (!global.applications) {
  global.applications = []
}

export async function POST() {
  const testApplications = [
    {
      id: 'APP001',
      application_id: 'APP001',
      name: 'Rajesh Kumar',
      email: 'rajesh@police.gov.in',
      phone: '9876543210',
      role: 'POLICE_OFFICER',
      status: 'PENDING',
      state: 'Delhi',
      district: 'Central Delhi',
      police_station: 'Connaught Place',
      department: 'Cyber Crime',
      designation: 'Inspector',
      experience: '5 years',
      password: 'password123',
      created_at: new Date().toISOString()
    },
    {
      id: 'APP002',
      application_id: 'APP002',
      name: 'Priya Sharma',
      email: 'priya@bank.com',
      phone: '9876543211',
      role: 'BANK_OFFICER',
      status: 'PENDING',
      department: 'Fraud Prevention',
      designation: 'Manager',
      experience: '3 years',
      password: 'password123',
      created_at: new Date().toISOString()
    },
    {
      id: 'APP003',
      application_id: 'APP003',
      name: 'Amit Singh',
      email: 'amit@nodal.gov.in',
      phone: '9876543212',
      role: 'NODAL_OFFICER',
      status: 'PENDING',
      department: 'Financial Intelligence',
      designation: 'Senior Officer',
      experience: '7 years',
      password: 'password123',
      created_at: new Date().toISOString()
    }
  ]

  global.applications.push(...testApplications)
  
  return NextResponse.json({ 
    success: true, 
    message: 'Test data added',
    count: testApplications.length 
  })
}

export async function GET() {
  return NextResponse.json({ 
    applications: global.applications || [],
    count: global.applications?.length || 0
  })
}