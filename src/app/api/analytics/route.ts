import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    
    let startDate = new Date()
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1)
    }

    const complaints = await db.complaint.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        bankActions: true,
        refunds: true
      }
    })

    const totalComplaints = complaints.length
    const totalAmount = complaints.reduce((sum, c) => sum + c.fraudAmount, 0)
    
    const statusCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.status] = (acc[complaint.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const fraudTypeCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.fraudType] = (acc[complaint.fraudType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const districtCounts = complaints.reduce((acc, complaint) => {
      if (complaint.district) {
        acc[complaint.district] = (acc[complaint.district] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const bankActions = complaints.flatMap(c => c.bankActions)
    const refunds = complaints.flatMap(c => c.refunds)

    const totalRefunded = refunds
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.amount, 0)

    const totalFrozen = bankActions
      .filter(ba => ba.status === 'COMPLETED')
      .reduce((sum, ba) => sum + (ba.amount || 0), 0)

    const recoveryRate = totalAmount > 0 ? (totalRefunded / totalAmount) * 100 : 0

    const avgResolutionTime = complaints
      .filter(c => c.status === 'CLOSED' || c.status === 'REFUNDED')
      .reduce((sum, c) => {
        const resolutionTime = new Date().getTime() - new Date(c.createdAt).getTime()
        return sum + resolutionTime
      }, 0) / Math.max(1, complaints.filter(c => c.status === 'CLOSED' || c.status === 'REFUNDED').length)

    const dailyStats = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayComplaints = complaints.filter(c => 
        c.createdAt.toISOString().split('T')[0] === dateStr
      )
      
      dailyStats.push({
        date: dateStr,
        complaints: dayComplaints.length,
        amount: dayComplaints.reduce((sum, c) => sum + c.fraudAmount, 0)
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          totalAmount,
          totalRefunded,
          totalFrozen,
          recoveryRate: Math.round(recoveryRate * 100) / 100,
          avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60 * 24))
        },
        statusBreakdown: statusCounts,
        fraudTypeBreakdown: fraudTypeCounts,
        districtBreakdown: districtCounts,
        dailyStats: dailyStats.reverse(),
        period
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}