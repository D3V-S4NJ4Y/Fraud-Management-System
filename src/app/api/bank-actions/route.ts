import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, bankName, branchName, accountNumber, actionType, amount, notes } = body

    if (!complaintId || !bankName || !accountNumber || !actionType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const complaint = await db.complaint.findUnique({
      where: { complaintId }
    })

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      )
    }

    const bankAction = await db.bankAction.create({
      data: {
        complaintId: complaint.id,
        bankName,
        branchName,
        accountNumber,
        actionType,
        amount: amount ? parseFloat(amount) : null,
        notes,
        status: 'PENDING',
        referenceNumber: `BA${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      }
    })

    await db.caseUpdate.create({
      data: {
        complaintId: complaint.id,
        title: 'Bank Action Requested',
        description: `${actionType} request sent to ${bankName} for account ${accountNumber}`,
        status: 'BANK_FREEZE_REQUESTED',
        updatedBy: 'System'
      }
    })

    await db.complaint.update({
      where: { id: complaint.id },
      data: { status: 'BANK_FREEZE_REQUESTED' }
    })

    await db.notification.create({
      data: {
        complaintId: complaint.id,
        title: 'Bank Action Initiated',
        message: `${actionType} request has been sent to ${bankName}. Reference: ${bankAction.referenceNumber}`,
        type: 'BANK_ACTION',
        channel: 'EMAIL',
        status: 'PENDING'
      }
    })

    const zai = await import('z-ai-web-dev-sdk').then(m => m.default)
    const ai = await zai.create()
    
    try {
      await ai.functions.invoke('web_search', {
        query: `${bankName} cyber fraud department contact information ${complaint.district}`,
        num: 5
      })
    } catch (searchError) {
      console.error('Bank contact search failed:', searchError)
    }

    return NextResponse.json({
      success: true,
      data: bankAction,
      message: 'Bank action requested successfully'
    })
  } catch (error) {
    console.error('Error creating bank action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bank action' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionId, status, referenceNumber, notes } = body

    if (!actionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bankAction = await db.bankAction.update({
      where: { id: actionId },
      data: {
        status,
        referenceNumber: referenceNumber || undefined,
        notes: notes || undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      },
      include: {
        complaint: true
      }
    })

    let newComplaintStatus = bankAction.complaint.status
    if (status === 'COMPLETED') {
      newComplaintStatus = 'FUNDS_FROZEN'
    } else if (status === 'FAILED') {
      newComplaintStatus = 'UNDER_INVESTIGATION'
    }

    await db.complaint.update({
      where: { id: bankAction.complaint.id },
      data: { status: newComplaintStatus }
    })

    await db.caseUpdate.create({
      data: {
        complaintId: bankAction.complaint.id,
        title: 'Bank Action Updated',
        description: `Bank action ${bankAction.actionType} status updated to ${status}`,
        status: newComplaintStatus,
        updatedBy: 'Bank Officer'
      }
    })

    return NextResponse.json({
      success: true,
      data: bankAction,
      message: 'Bank action updated successfully'
    })
  } catch (error) {
    console.error('Error updating bank action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update bank action' },
      { status: 500 }
    )
  }
}