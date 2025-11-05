import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, amount, refundMethod, processedBy } = body

    if (!complaintId || !amount) {
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

    const refund = await db.refund.create({
      data: {
        complaintId: complaint.id,
        amount: parseFloat(amount),
        refundDate: new Date(),
        bankName: complaint.bankName || 'Unknown',
        accountNumber: complaint.accountNumber || 'Unknown',
        transactionId: `RF${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        refundMethod: refundMethod || 'BANK_TRANSFER',
        processedBy: processedBy || 'System',
        status: 'PROCESSING'
      }
    })

    await db.caseUpdate.create({
      data: {
        complaintId: complaint.id,
        title: 'Refund Initiated',
        description: `Refund of ₹${amount} initiated via ${refundMethod}`,
        status: 'REFUND_PROCESSING',
        updatedBy: processedBy || 'System'
      }
    })

    await db.complaint.update({
      where: { id: complaint.id },
      data: { status: 'REFUND_PROCESSING' }
    })

    await db.notification.create({
      data: {
        complaintId: complaint.id,
        title: 'Refund Processing Started',
        message: `Your refund of ₹${amount} has been initiated. Transaction ID: ${refund.transactionId}`,
        type: 'REFUND_UPDATE',
        channel: 'EMAIL',
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      data: refund,
      message: 'Refund initiated successfully'
    })
  } catch (error) {
    console.error('Error creating refund:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create refund' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { refundId, status, transactionId } = body

    if (!refundId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const refund = await db.refund.update({
      where: { id: refundId },
      data: {
        status,
        transactionId: transactionId || undefined
      },
      include: {
        complaint: true
      }
    })

    if (status === 'COMPLETED') {
      await db.complaint.update({
        where: { id: refund.complaint.id },
        data: { status: 'REFUNDED' }
      })

      await db.caseUpdate.create({
        data: {
          complaintId: refund.complaint.id,
          title: 'Refund Completed',
          description: `Refund of ₹${refund.amount} completed successfully`,
          status: 'REFUNDED',
          updatedBy: 'System'
        }
      })

      await db.notification.create({
        data: {
          complaintId: refund.complaint.id,
          title: 'Refund Completed',
          message: `Your refund of ₹${refund.amount} has been completed successfully!`,
          type: 'REFUND_UPDATE',
          channel: 'EMAIL',
          status: 'PENDING'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: refund,
      message: 'Refund status updated successfully'
    })
  } catch (error) {
    console.error('Error updating refund:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update refund' },
      { status: 500 }
    )
  }
}