import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    await supabase.from('complaints').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Create sample complaints directly
    const complaints = [
      {
        complaint_id: 'CF2024001',
        victim_name: 'Rajesh Kumar',
        victim_email: 'victim@example.com',
        victim_phone: '+91 9876543212',
        fraud_type: 'PHISHING',
        fraud_amount: 50000,
        fraud_date: '2024-01-15',
        fraud_description: 'Received phishing email claiming to be from bank asking for OTP',
        bank_name: 'State Bank of India',
        account_number: '****1234',
        transaction_id: 'TXN123456789',
        status: 'FUNDS_FROZEN',
        priority: 'HIGH',
        police_station: 'Cyber Police Station, Bhubaneswar',
        district: 'Khordha'
      },
      {
        complaint_id: 'CF2024002',
        victim_name: 'Priya Sharma',
        victim_email: 'priya@example.com',
        victim_phone: '+91 9123456789',
        fraud_type: 'ONLINE_SHOPPING',
        fraud_amount: 25000,
        fraud_date: '2024-01-18',
        fraud_description: 'Fake online shopping website, paid but never received product',
        bank_name: 'HDFC Bank',
        account_number: '****5678',
        transaction_id: 'TXN987654321',
        status: 'REFUND_PROCESSING',
        priority: 'MEDIUM',
        police_station: 'Cyber Police Station, Cuttack',
        district: 'Cuttack'
      }
    ]

    const { data: createdComplaints, error: complaintsError } = await supabase
      .from('complaints')
      .insert(complaints)
      .select()

    if (complaintsError) {
      console.error('Error creating complaints:', complaintsError)
      return NextResponse.json({ success: false, error: 'Failed to create sample complaints' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        complaints: createdComplaints?.length || 0
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: 'Failed to seed data' }, { status: 500 })
  }
}