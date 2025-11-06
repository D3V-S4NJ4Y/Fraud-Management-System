'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, Users, FileText } from 'lucide-react'

interface Application {
  id: string
  application_id: string
  name: string
  email: string
  phone: string
  role: string
  department?: string
  designation?: string
  experience?: string
  reason?: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })

  const handleLogin = () => {
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || email === 'admin@gmail.com') {
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin@123') {
        setIsAuthenticated(true)
        fetchApplications()
      } else {
        alert('Invalid credentials')
      }
    } else {
      alert('Invalid credentials')
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      setApplications(data.applications || [])
      
      const pending = data.applications?.filter((app: Application) => app.status === 'PENDING').length || 0
      const approved = data.applications?.filter((app: Application) => app.status === 'APPROVED').length || 0
      const rejected = data.applications?.filter((app: Application) => app.status === 'REJECTED').length || 0
      setStats({ pending, approved, rejected })
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: action })
      })
      
      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-gray-600">Pending Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-gray-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
            <TabsTrigger value="all">All Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid gap-4">
              {applications.filter(app => app.status === 'PENDING').map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{application.name}</h3>
                        <p className="text-gray-600">{application.email}</p>
                        <p className="text-gray-600">{application.phone}</p>
                        <Badge variant="outline">{application.role.replace('_', ' ')}</Badge>
                        
                        {application.role === 'POLICE_OFFICER' && (
                          <div className="bg-blue-50 p-3 rounded-lg mt-3">
                            <h4 className="font-medium text-blue-800 mb-2">Police Verification Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="font-medium">State:</span> {application.state}</div>
                              <div><span className="font-medium">District:</span> {application.district}</div>
                              <div><span className="font-medium">Police Station:</span> {application.police_station}</div>
                              <div><span className="font-medium">Department:</span> {application.department}</div>
                              <div><span className="font-medium">Designation:</span> {application.designation}</div>
                              <div><span className="font-medium">Experience:</span> {application.experience}</div>
                            </div>
                            <div className="mt-2">
                              <span className="font-medium">Documents:</span>
                              <div className="flex gap-2 mt-1">
                                {application.id_card_url && (
                                  <Badge variant="secondary">ID Card Uploaded</Badge>
                                )}
                                {application.document_url && (
                                  <Badge variant="secondary">Service Document Uploaded</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {(application.role === 'BANK_OFFICER' || application.role === 'NODAL_OFFICER') && (
                          <>
                            {application.department && (
                              <p className="text-sm text-gray-500">Organization: {application.department}</p>
                            )}
                            {application.designation && (
                              <p className="text-sm text-gray-500">Designation: {application.designation}</p>
                            )}
                            {application.experience && (
                              <p className="text-sm text-gray-500">Experience: {application.experience}</p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'APPROVED')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'REJECTED')}
                          size="sm"
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{application.name}</h3>
                        <p className="text-gray-600">{application.email}</p>
                        <Badge variant={
                          application.status === 'APPROVED' ? 'default' :
                          application.status === 'REJECTED' ? 'destructive' : 'secondary'
                        }>
                          {application.status}
                        </Badge>
                        <Badge variant="outline">{application.role}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}