'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Users,
  Banknote,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalComplaints: number
    totalAmount: number
    refundedAmount: number
    recoveryRate: number
    avgTurnaroundTime: number
  }
  statusDistribution: Record<string, number>
  fraudTypeAnalysis: Record<string, number>
  performanceMetrics: {
    pendingCases: number
    inProgressCases: number
    resolvedCases: number
    resolutionRate: number
  }
}

function AnalyticsContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Failed to load analytics data</p>
      </div>
    )
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    UNDER_INVESTIGATION: 'bg-purple-100 text-purple-800',
    BANK_FREEZE_REQUESTED: 'bg-orange-100 text-orange-800',
    FUNDS_FROZEN: 'bg-indigo-100 text-indigo-800',
    REFUND_PROCESSING: 'bg-teal-100 text-teal-800',
    REFUNDED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Fraud Insights & Performance Metrics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.totalComplaints}</div>
                <p className="text-xs text-muted-foreground">Registered complaints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analytics.overview.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Fraud amount reported</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recovered</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{analytics.overview.refundedAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{analytics.overview.recoveryRate}% recovery rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.overview.avgTurnaroundTime}</div>
                <p className="text-xs text-muted-foreground">Days average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(analytics.performanceMetrics.resolutionRate)}%</div>
                <p className="text-xs text-muted-foreground">Cases resolved</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Case Status Distribution</span>
                </CardTitle>
                <CardDescription>Current status of all complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[status as keyof typeof statusColors]}>
                          {status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="w-20">
                          <Progress 
                            value={(count / analytics.overview.totalComplaints) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fraud Type Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Fraud Type Analysis</span>
                </CardTitle>
                <CardDescription>Most common types of fraud reported</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.fraudTypeAnalysis)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{count}</span>
                        <div className="w-20">
                          <Progress 
                            value={(count / analytics.overview.totalComplaints) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription>System performance and efficiency indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{analytics.performanceMetrics.pendingCases}</div>
                  <p className="text-sm text-gray-600">Pending Cases</p>
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analytics.performanceMetrics.inProgressCases}</div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analytics.performanceMetrics.resolvedCases}</div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{Math.round(analytics.overview.recoveryRate)}%</div>
                  <p className="text-sm text-gray-600">Recovery Rate</p>
                  <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
              <CardDescription>Data-driven insights for better fraud prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Fraud Trends</h4>
                  <div className="space-y-2 text-sm">
                    <p>• {Object.entries(analytics.fraudTypeAnalysis).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace('_', ' ')} is the most common fraud type</p>
                    <p>• Average case resolution time: {analytics.overview.avgTurnaroundTime} days</p>
                    <p>• {analytics.performanceMetrics.resolutionRate.toFixed(1)}% of cases are successfully resolved</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Focus awareness campaigns on top fraud types</p>
                    <p>• Improve bank coordination for faster fund recovery</p>
                    <p>• Enhance victim communication for better satisfaction</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function Analytics() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'POLICE_OFFICER']}>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}