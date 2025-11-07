"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Application {
  id: string
  application_id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  state?: string
  district?: string
  police_station?: string
  department?: string
  designation?: string
  experience?: string
  id_card_url?: string
  document_url?: string
  created_at: string
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated as admin
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === 'ADMIN' && user.status === 'APPROVED') {
        setIsAuthenticated(true)
        fetchApplications()
      }
    }
    setLoading(false)
  }, [])

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...')
      const response = await fetch('/api/applications')
      const data = await response.json()
      console.log('Fetched data:', data)
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setIsAuthenticated(true)
        fetchApplications()
      } else {
        alert(data.error || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      alert('Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleApproval = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          status,
          reviewedBy: 'Admin'
        })
      })

      if (response.ok) {
        fetchApplications()
        alert(`Application ${status.toLowerCase()} successfully!`)
      }
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Error updating application')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'APPROVED': return 'bg-green-500'
      case 'REJECTED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const pendingApplications = applications.filter(app => app.status === 'PENDING')
  const approvedApplications = applications.filter(app => app.status === 'APPROVED')
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED')

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard - Officer Applications</h1>
        <div className="flex gap-2">
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/setup-tables', { method: 'GET' })
                const result = await response.json()
                if (result.success) {
                  const tableInfo = Object.entries(result.tables)
                    .map(([name, info]: [string, any]) => `${name}: ${info.exists ? '✅' : '❌'}`)
                    .join('\n')
                  alert(`Table Status:\n${tableInfo}`)
                } else {
                  alert('Error checking tables')
                }
              } catch (error) {
                alert('Error checking tables')
              }
            }}
            variant="outline"
          >
            Check Tables
          </Button>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/create-tables', { method: 'POST' })
                const result = await response.json()
                if (result.success) {
                  // Copy SQL to clipboard
                  navigator.clipboard.writeText(result.sql)
                  alert('SQL copied to clipboard!\n\nGo to Supabase Dashboard → SQL Editor and paste to create tables')
                } else {
                  alert('Error getting SQL')
                }
              } catch (error) {
                alert('Error getting SQL')
              }
            }}
            variant="outline"
          >
            Create Tables
          </Button>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/test-supabase')
                const result = await response.json()
                const connectionStatus = result.tests?.connection?.success ? '✅' : '❌'
                const insertStatus = result.tests?.insert?.success ? '✅' : '❌'
                
                const errorDetails = result.tests?.insert?.error ? `\nError: ${result.tests.insert.error}` : ''
                alert(`Supabase Test Results:\n\nConnection: ${connectionStatus}\nInsert Test: ${insertStatus}${errorDetails}\n\nURL: ${result.url}\nService Key: ${result.serviceKey}`)
                
                if (!result.tests?.insert?.success) {
                  console.log('Full insert error:', result.tests?.insert)
                }
              } catch (error) {
                alert('Test failed')
              }
            }}
            variant="outline"
          >
            Test Supabase
          </Button>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/applications')
                const result = await response.json()
                console.log('API Response:', result)
                alert(`Found ${result.applications?.length || 0} applications`)
              } catch (error) {
                console.error('Debug error:', error)
                alert('Error fetching data')
              }
            }}
            variant="outline"
          >
            Debug Data
          </Button>
          <Button 
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('user')
                router.push('/login')
              }
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedApplications.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <p className="text-sm text-gray-600">ID: {app.application_id}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Email:</strong> {app.email}</p>
                      <p><strong>Phone:</strong> {app.phone}</p>
                      <p><strong>Role:</strong> {app.role}</p>
                      {app.state && <p><strong>State:</strong> {app.state}</p>}
                      {app.district && <p><strong>District:</strong> {app.district}</p>}
                      {app.police_station && <p><strong>Police Station:</strong> {app.police_station}</p>}
                    </div>
                    <div>
                      {app.department && <p><strong>Department:</strong> {app.department}</p>}
                      {app.designation && <p><strong>Designation:</strong> {app.designation}</p>}
                      {app.experience && <p><strong>Experience:</strong> {app.experience}</p>}
                      <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {(app.id_card_url || app.document_url) && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Documents:</h4>
                      <div className="flex gap-2">
                        {app.id_card_url ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(app.id_card_url, '_blank')}
                          >
                            View ID Card
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">No ID Card</span>
                        )}
                        {app.document_url ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(app.document_url, '_blank')}
                          >
                            View Document
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">No Document</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => handleApproval(app.application_id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleApproval(app.application_id, 'REJECTED')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingApplications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No pending applications</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="approved">
          <div className="grid gap-4">
            {approvedApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <p className="text-sm text-gray-600">ID: {app.application_id}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Role:</strong> {app.role}</p>
                  <p><strong>Approved:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
            {approvedApplications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No approved applications</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected">
          <div className="grid gap-4">
            {rejectedApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <p className="text-sm text-gray-600">ID: {app.application_id}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Role:</strong> {app.role}</p>
                  <p><strong>Rejected:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
            {rejectedApplications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No rejected applications</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}