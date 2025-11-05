import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    // Get all complaints for analytics
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')

    if (error) throw error

    // Calculate analytics
    const totalComplaints = complaints.length
    const totalAmount = complaints.reduce((sum, c) => sum + (c.fraud_amount || 0), 0)
    
    // Status distribution
    const statusCounts = complaints.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Fraud type analysis
    const fraudTypes = complaints.reduce((acc, c) => {
      acc[c.fraud_type] = (acc[c.fraud_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Amount recovery
    const refundedComplaints = complaints.filter(c => c.status === 'REFUNDED')
    const refundedAmount = refundedComplaints.reduce((sum, c) => sum + (c.fraud_amount || 0), 0)
    const recoveryRate = totalAmount > 0 ? (refundedAmount / totalAmount) * 100 : 0

    // Turnaround time analysis
    const resolvedComplaints = complaints.filter(c => 
      ['REFUNDED', 'CLOSED'].includes(c.status)
    )
    
    const avgTurnaroundTime = resolvedComplaints.length > 0 
      ? resolvedComplaints.reduce((sum, c) => {
          const created = new Date(c.created_at)
          const updated = new Date(c.updated_at)
          return sum + (updated.getTime() - created.getTime())
        }, 0) / resolvedComplaints.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    // Monthly trends
    const monthlyData = complaints.reduce((acc, c) => {
      const month = new Date(c.created_at).toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 }
      }
      acc[month].count++
      acc[month].amount += c.fraud_amount || 0
      return acc
    }, {} as Record<string, { count: number, amount: number }>)

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          totalAmount,
          refundedAmount,
          recoveryRate: Math.round(recoveryRate * 100) / 100,
          avgTurnaroundTime: Math.round(avgTurnaroundTime * 100) / 100
        },
        statusDistribution: statusCounts,
        fraudTypeAnalysis: fraudTypes,
        monthlyTrends: monthlyData,
        performanceMetrics: {
          pendingCases: statusCounts['PENDING'] || 0,
          inProgressCases: statusCounts['IN_PROGRESS'] || 0,
          resolvedCases: resolvedComplaints.length,
          resolutionRate: totalComplaints > 0 ? (resolvedComplaints.length / totalComplaints) * 100 : 0
        }
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