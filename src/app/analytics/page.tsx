'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Shield,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalComplaints: number
    totalAmount: number
    totalRefunded: number
    totalFrozen: number
    recoveryRate: number
    avgResolutionTime: number
  }
  statusBreakdown: Record<string, number>
  fraudTypeBreakdown: Record<string, number>
  districtBreakdown: Record<string, number>
  dailyStats: Array<{
    date: string
    complaints: number
    amount: number
  }>
  period: string
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      const result = await response.json()
      if (result.success) {
        setAnalytics(result.data)
      } else {
        // Set default analytics if no data
        setAnalytics({
          overview: {
            totalComplaints: 0,
            totalAmount: 0,
            totalRefunded: 0,
            totalFrozen: 0,
            recoveryRate: 0,
            avgResolutionTime: 0
          },
          statusBreakdown: {},
          fraudTypeBreakdown: {},
          districtBreakdown: {},
          dailyStats: [],
          period
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
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

  const fraudTypeColors = {
    PHISHING: 'bg-red-500',
    ONLINE_SHOPPING: 'bg-blue-500',
    BANKING_FRAUD: 'bg-green-500',
    INVESTMENT_SCAM: 'bg-purple-500',
    JOB_SCAM: 'bg-orange-500',
    MATRIMONIAL_SCAM: 'bg-pink-500',
    LOTTERY_SCAM: 'bg-yellow-500',
    UPI_FRAUD: 'bg-indigo-500',
    CARD_FRAUD: 'bg-teal-500',
    OTHER: 'bg-gray-500'
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
          <button 
            onClick={async () => {
              await fetch('/api/seed-supabase', { method: 'POST' })
              fetchAnalytics()
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Sample Data
          </button>
        </div>
      </div>
    )
  }

  const { overview, statusBreakdown, fraudTypeBreakdown, districtBreakdown, dailyStats } = analytics

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Cyber Fraud Tracking System Insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalComplaints}</div>
              <p className="text-xs text-muted-foreground">
                {period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'This year'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fraud Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{overview.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Recovered</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{overview.totalRefunded.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {overview.recoveryRate}% recovery rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.avgResolutionTime} days</div>
              <p className="text-xs text-muted-foreground">
                Average case resolution
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                {Object.entries(statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColors[status as keyof typeof statusColors]}>
                        {status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">{count} cases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / overview.totalComplaints) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round((count / overview.totalComplaints) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Fraud Type Analysis</span>
              </CardTitle>
              <CardDescription>Most common fraud types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(fraudTypeBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${fraudTypeColors[type as keyof typeof fraudTypeColors]}`} />
                        <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / overview.totalComplaints) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>District-wise Complaints</span>
              </CardTitle>
              <CardDescription>Complaints by district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(districtBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([district, count]) => (
                    <div key={district} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{district}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / overview.totalComplaints) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recovery Metrics</span>
              </CardTitle>
              <CardDescription>Financial recovery performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Recovery Rate</span>
                    <span className="text-sm text-gray-600">{overview.recoveryRate}%</span>
                  </div>
                  <Progress value={overview.recoveryRate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Banknote className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-600">₹{overview.totalRefunded.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Amount Refunded</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-600">₹{overview.totalFrozen.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Amount Frozen</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Daily Trends</span>
            </CardTitle>
            <CardDescription>Complaint trends over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyStats.slice(-7).reverse().map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-600">{day.complaints} complaints</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">₹{day.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Total amount</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}