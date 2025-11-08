import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Sample data for nodal actions
    const sampleData = [
      {
        id: '1',
        complaint_id: 'CF202401001',
        victim_name: 'John Doe',
        victim_email: 'john@example.com',
        fraud_amount: 50000,
        bank_name: 'State Bank of India',
        account_number: '1234567890',
        transaction_id: 'TXN123456789',
        coordination_type: 'BANK_COORDINATION',
        status: 'PENDING',
        requested_at: new Date().toISOString(),
        police_station: 'Cyber Crime Cell Delhi',
        assigned_officer: 'Inspector Sharma',
        priority: 'HIGH'
      },
      {
        id: '2',
        complaint_id: 'CF202401002',
        victim_name: 'Jane Smith',
        victim_email: 'jane@example.com',
        fraud_amount: 75000,
        bank_name: 'HDFC Bank',
        account_number: '9876543210',
        transaction_id: 'TXN987654321',
        coordination_type: 'RBI_COORDINATION',
        status: 'COORDINATED',
        requested_at: new Date().toISOString(),
        police_station: 'Cyber Crime Cell Mumbai',
        assigned_officer: 'Inspector Patel',
        priority: 'MEDIUM'
      }
    ]

    return NextResponse.json({
      success: true,
      data: sampleData
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch nodal actions',
      data: []
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionId, status, notes, processedBy } = body

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: { id: actionId, status, notes, processedBy }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update nodal action'
    }, { status: 500 })
  }
}