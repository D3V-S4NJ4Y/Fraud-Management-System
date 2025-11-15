import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase-client'
import { hashPassword } from '@/lib/auth'

const complaintSchema = z.object({
  victimName: z.string().min(1).max(100),
  victimEmail: z.string().email(),
  victimPhone: z.string().min(1).max(20),
  victimAddress: z.string().min(1).max(200),
  victimState: z.string().min(1).max(50),
  victimGender: z.enum(['Male', 'Female', 'Other']),
  fraudType: z.enum(['PHISHING', 'ONLINE_SHOPPING', 'BANKING_FRAUD', 'INVESTMENT_SCAM', 'JOB_SCAM', 'MATRIMONIAL_SCAM', 'LOTTERY_SCAM', 'UPI_FRAUD', 'CARD_FRAUD', 'OTHER']),
  otherFraudType: z.string().optional(),
  fraudAmount: z.number().positive(),
  fraudDate: z.string(),
  fraudDescription: z.string().min(1).max(1000),
  district: z.string().min(1)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complaintId = searchParams.get('complaintId')
    const status = searchParams.get('status')
    const district = searchParams.get('district')
    const userId = searchParams.get('userId')
    const userRole = searchParams.get('userRole')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase.from('complaints').select('*')
    
    // Role-based filtering

    if (userRole === 'VICTIM' && userId) {
      // Victims can only see their own complaints
      const userEmail = searchParams.get('userEmail') || ''

      query = query.eq('victim_email', userEmail)
    }
    // Admin/Police can see all complaints (no additional filter)
    
    if (complaintId) query = query.eq('complaint_id', complaintId)
    if (status) query = query.eq('status', status)
    if (district) query = query.eq('district', district)
    
    const { data: complaints, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: complaints || [],
      pagination: {
        total: complaints?.length || 0,
        limit,
        offset,
        hasMore: false
      }
    })
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = complaintSchema.parse(body)
    
    const {
      victimName,
      victimEmail,
      victimPhone,
      victimAddress,
      victimState,
      victimGender,
      fraudType,
      otherFraudType,
      fraudAmount,
      fraudDate,
      fraudDescription,
      district
    } = validatedData
    
    const { bankName, ifscCode, accountNumber, transactionId, policeStation, documentUrl } = body
    
    const complaintId = `CF${new Date().getFullYear()}${Date.now().toString().slice(-6)}`
    
    const insertData = {
      complaint_id: complaintId,
      victim_name: victimName,
      victim_email: victimEmail,
      victim_phone: victimPhone,
      victim_address: victimAddress,
      victim_state: victimState,
      victim_gender: victimGender,
      fraud_type: fraudType,
      fraud_amount: fraudAmount,
      fraud_date: fraudDate,
      fraud_description: fraudDescription,
      district,
      status: 'PENDING'
    }
    
    // Add optional fields if they exist
    if (otherFraudType) insertData.other_fraud_type = otherFraudType
    if (bankName) insertData.bank_name = bankName
    if (ifscCode) insertData.ifsc_code = ifscCode
    if (accountNumber) insertData.account_number = accountNumber
    if (transactionId) insertData.transaction_id = transactionId
    if (policeStation) insertData.police_station = policeStation
    if (documentUrl) insertData.document_url = documentUrl
    
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: complaint,
      message: 'Complaint registered successfully'
    })
  } catch (error) {
    console.error('Error creating complaint:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create complaint', details: error },
      { status: 500 }
    )
  }
}