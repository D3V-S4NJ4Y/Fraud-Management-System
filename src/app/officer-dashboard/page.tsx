"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, FileText, Users, AlertCircle } from 'lucide-react'

export default function OfficerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalRefunds: 0
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.status !== 'APPROVED') {
        alert('Access denied. Your account is not approved.')
        router.push('/login')
        return
      }
      setUser(parsedUser)
      
      // Mock data for now
      setStats({
        totalComplaints: 45,
        pendingComplaints: 12,
        resolvedComplaints: 33,
        totalRefunds: 2500000
      })
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Officer Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name} ({user.role})</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Complaint
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</div>
            <p className="text-xs text-muted-foreground">73% resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{stats.totalRefunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Amount recovered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="complaints" className="w-full">
        <TabsList>
          <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
          <TabsTrigger value="pending">Pending Actions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Complaint #{1000 + i}</h4>
                      <p className="text-sm text-gray-600">UPI Fraud - ₹{(Math.random() * 50000 + 5000).toFixed(0)}</p>
                      <p className="text-xs text-gray-500">Submitted 2 hours ago</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={i % 3 === 0 ? "destructive" : i % 2 === 0 ? "default" : "secondary"}>
                        {i % 3 === 0 ? "High Priority" : i % 2 === 0 ? "Medium" : "Low"}
                      </Badge>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800">Bank Freeze Request</h4>
                  <p className="text-sm text-yellow-700">3 requests pending bank response</p>
                  <Button size="sm" className="mt-2">Follow Up</Button>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">FIR Registration</h4>
                  <p className="text-sm text-blue-700">2 cases ready for FIR filing</p>
                  <Button size="sm" className="mt-2">Process FIR</Button>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">Refund Processing</h4>
                  <p className="text-sm text-green-700">5 refunds ready for processing</p>
                  <Button size="sm" className="mt-2">Process Refunds</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>UPI Fraud</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online Shopping</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Scam</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Others</span>
                    <span className="font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cases Resolved</span>
                    <span className="font-semibold text-green-600">33</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Resolution Time</span>
                    <span className="font-semibold">7.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recovery Rate</span>
                    <span className="font-semibold text-blue-600">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction Score</span>
                    <span className="font-semibold text-yellow-600">4.2/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}