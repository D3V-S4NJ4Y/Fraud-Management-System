'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Phone, 
  Mail, 
  FileText,
  Banknote,
  TrendingUp,
  Users,
  AlertCircle,
  Eye,
  HelpCircle
} from 'lucide-react'

interface Complaint {
  id: string
  complaintId?: string
  complaint_id?: string
  victimName?: string
  victim_name?: string
  victimEmail?: string
  victim_email?: string
  victimPhone?: string
  victim_phone?: string
  fraudType?: string
  fraud_type?: string
  fraudAmount?: number
  fraud_amount?: number
  fraudDate?: string
  fraud_date?: string
  fraudDescription?: string
  fraud_description?: string
  bankName?: string
  bank_name?: string
  accountNumber?: string
  account_number?: string
  transactionId?: string
  transaction_id?: string
  status: string
  priority?: string
  policeStation?: string
  police_station?: string
  district?: string
  assignedOfficer?: string
  assigned_officer?: string
  cfccrmsId?: string
  cfccrms_id?: string
  helpline1930Id?: string
  helpline_1930_id?: string
  firNumber?: string
  fir_number?: string
  firDate?: string
  fir_date?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
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

const statusProgress = {
  PENDING: 10,
  IN_PROGRESS: 25,
  UNDER_INVESTIGATION: 40,
  BANK_FREEZE_REQUESTED: 55,
  FUNDS_FROZEN: 70,
  REFUND_PROCESSING: 85,
  REFUNDED: 100,
  CLOSED: 100,
  REJECTED: 0
}

function HomeContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [searchId, setSearchId] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    victimName: '',
    victimEmail: '',
    victimPhone: '',
    victimAddress: '',
    victimState: '',
    victimGender: '',
    fraudType: '',
    otherFraudType: '',
    fraudAmount: '',
    fraudDate: '',
    fraudDescription: '',
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    transactionId: '',
    policeStation: '',
    district: '',
    documentFile: null as File | null
  })

  const fraudTypes = [
    'PHISHING',
    'ONLINE_SHOPPING',
    'BANKING_FRAUD',
    'INVESTMENT_SCAM',
    'JOB_SCAM',
    'MATRIMONIAL_SCAM',
    'LOTTERY_SCAM',
    'UPI_FRAUD',
    'CARD_FRAUD',
    'OTHER'
  ]

  const indianBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'IndusInd Bank',
    'Yes Bank',
    'IDFC First Bank',
    'Federal Bank',
    'South Indian Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'Central Bank of India',
    'Indian Overseas Bank',
    'UCO Bank',
    'Bank of Maharashtra',
    'Punjab & Sind Bank',
    'Indian Bank',
    'IDBI Bank',
    'Bandhan Bank',
    'RBL Bank',
    'City Union Bank',
    'Karur Vysya Bank',
    'Tamilnad Mercantile Bank',
    'DCB Bank',
    'Lakshmi Vilas Bank',
    'Dhanlaxmi Bank'
  ]

  const fetchComplaints = async () => {
    try {
      let url = '/api/complaints'
      
      // Add user-specific parameters if user is logged in
      if (user) {
        const params = new URLSearchParams({
          userId: user.id,
          userRole: user.role,
          userEmail: user.email
        })
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setComplaints(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      fetchComplaints()
    }
  }, [mounted, user])

  // Fetch complaints when switching to tracking tab
  useEffect(() => {
    if (activeTab === 'tracking' && mounted) {
      fetchComplaints()
    }
  }, [activeTab, mounted])



  const handleSearch = async () => {
    // This function is now mainly for backward compatibility
    // Real-time search happens in the onChange event
    if (!searchId.trim()) return
    
    const found = complaints.find(c => 
      (c.complaintId || c.complaint_id || '').toLowerCase() === searchId.toLowerCase()
    )
    
    if (found) {
      setSelectedComplaint(found)
      setSearchId('')
    }
  }

  const handleSubmitComplaint = async () => {
    if (!formData.victimName || !formData.victimEmail || !formData.victimPhone || !formData.victimAddress || !formData.victimState || !formData.victimGender || !formData.fraudType || !formData.fraudAmount || !formData.fraudDate || !formData.fraudDescription || !formData.district) {
      alert('Please fill in all required fields')
      return
    }
    if (formData.fraudType === 'OTHER' && !formData.otherFraudType) {
      alert('Please specify the fraud type')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.victimEmail)) {
      alert('Please enter a valid email address')
      return
    }
    if (parseFloat(formData.fraudAmount) <= 0) {
      alert('Please enter a valid fraud amount')
      return
    }
    setLoading(true)
    try {
      let documentUrl = ''
      
      // Upload document if provided
      if (formData.documentFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.documentFile)
        uploadFormData.append('complaintId', `CF${new Date().getFullYear()}${Date.now().toString().slice(-6)}`)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          documentUrl = uploadResult.data.url
        }
      }
      
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          fraudAmount: parseFloat(formData.fraudAmount),
          victimEmail: user?.email || formData.victimEmail,
          victimName: user?.name || formData.victimName,
          documentUrl,
          documentFile: undefined // Remove file object from JSON
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchComplaints() // Refresh the complaints list
        // setShowComplaintForm(false) // Remove this line as setShowComplaintForm is not defined
        setFormData({
          victimName: '',
          victimEmail: '',
          victimPhone: '',
          victimAddress: '',
          victimState: '',
          victimGender: '',
          fraudType: '',
          otherFraudType: '',
          fraudAmount: '',
          fraudDate: '',
          fraudDescription: '',
          bankName: '',
          ifscCode: '',
          accountNumber: '',
          transactionId: '',
          policeStation: '',
          district: '',
          documentFile: null
        })
        alert('Complaint registered successfully!')
      } else {
        alert('Failed to register complaint: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert('Error submitting complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalComplaints = complaints.length
  const totalAmount = complaints.reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)
  const refundedAmount = complaints
    .filter(c => c.status === 'REFUNDED')
    .reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)
  const frozenAmount = complaints
    .filter(c => c.status === 'FUNDS_FROZEN')
    .reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cyber Fraud Support System</h1>
                <p className="text-sm text-gray-600">Victim Support & Tracking System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>1930 Helpline</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>cybercrime@police.gov.in</span>
              </div>
              {mounted && (
                user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                    {(user.role === 'ADMIN' || user.role === 'POLICE_OFFICER' || user.role === 'NODAL_OFFICER') && (
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/police'}>
                        Police Panel
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                      Login
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/register'}>
                      Register
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tracking">Track Complaint</TabsTrigger>
            <TabsTrigger value="register">Register Complaint</TabsTrigger>
            <TabsTrigger value="awareness">Awareness</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalComplaints}</div>
                  <p className="text-xs text-muted-foreground">Registered this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fraud Amount</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across all cases</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Amount Refunded</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{refundedAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Successfully recovered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Amount Frozen</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">₹{frozenAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Under investigation</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Latest cyber fraud complaints registered</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading complaints...</div>
                ) : (
                <div className="space-y-4">
                  {complaints.length > 0 ? complaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{complaint.complaintId || complaint.complaint_id}</span>
                          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{complaint.victimName || complaint.victim_name} - {complaint.fraudType || complaint.fraud_type}</p>
                        <p className="text-sm text-gray-500">₹{Number(complaint.fraudAmount || complaint.fraud_amount || 0).toLocaleString()} - {complaint.district}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedComplaint(complaint)
                          setActiveTab('tracking')
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500">
                      {user?.role === 'VICTIM' ? (
                        <>
                          You haven't filed any complaints yet. <br/>
                          <Button 
                            onClick={() => setActiveTab('register')} 
                            className="mt-2"
                          >
                            File Your First Complaint
                          </Button>
                        </>
                      ) : (
                        <>
                          No complaints found. <br/>
                          <button 
                        onClick={async () => {
                          try {
                            setLoading(true)
                            const response = await fetch('/api/seed-supabase', { method: 'POST' })
                            const result = await response.json()
                            if (result.success) {
                              await fetchComplaints()
                              alert('Sample data created successfully!')
                            } else {
                              alert('Failed to create sample data. Please check database connection.')
                            }
                          } catch (error) {
                            console.error('Error seeding data:', error)
                            alert('Error creating sample data. Please check database connection.')
                          } finally {
                            setLoading(false)
                          }
                        }}
                        className="text-blue-600 underline mt-2"
                        disabled={loading}
                      >
                            {loading ? 'Creating...' : 'Create sample data'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Your Complaint</CardTitle>
                <CardDescription>Search by complaint ID or browse all complaints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Type to search complaints (ID, Name, District)..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                
                {/* Show filtered complaints */}
                {!selectedComplaint && (
                  <div className="mt-4">
                    {(() => {
                      const filteredComplaints = complaints.filter(c => {
                        if (!searchId) return true
                        const search = searchId.toLowerCase()
                        const id = (c.complaintId || c.complaint_id || '').toLowerCase()
                        const name = (c.victimName || c.victim_name || '').toLowerCase()
                        const district = (c.district || '').toLowerCase()
                        return id.includes(search) || name.includes(search) || district.includes(search)
                      })
                      
                      return (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">
                              {searchId ? `Search Results (${filteredComplaints.length})` : `All Complaints (${complaints.length})`}
                            </h4>
                            {searchId && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSearchId('')}
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                          
                          {loading ? (
                            <div className="text-center py-4">Loading complaints...</div>
                          ) : filteredComplaints.length > 0 ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {filteredComplaints.map((complaint) => {
                                const id = complaint.complaintId || complaint.complaint_id || ''
                                const name = complaint.victimName || complaint.victim_name || ''
                                const district = complaint.district || ''
                                
                                return (
                                  <div 
                                    key={complaint.id} 
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => {
                                      setSelectedComplaint(complaint)
                                      setSearchId('')
                                    }}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">{id}</span>
                                        <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                                          {complaint.status.replace('_', ' ')}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">{name}</p>
                                      <p className="text-xs text-gray-500">₹{Number(complaint.fraudAmount || complaint.fraud_amount || 0).toLocaleString()} - {district}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          ) : searchId ? (
                            <div className="text-center py-8 text-gray-500">
                              No complaints found matching "{searchId}"
                              <br />
                              <Button 
                                variant="link" 
                                onClick={() => setSearchId('')}
                                className="p-0 h-auto font-normal mt-2"
                              >
                                Show all complaints
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No complaints found. 
                              <Button 
                                variant="link" 
                                onClick={() => setActiveTab('register')}
                                className="p-0 h-auto font-normal"
                              >
                                Register your first complaint
                              </Button>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedComplaint && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Complaint Details - {selectedComplaint.complaintId || selectedComplaint.complaint_id}</span>
                    <Badge className={statusColors[selectedComplaint.status as keyof typeof statusColors]}>
                      {selectedComplaint.status.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Case Progress</span>
                      <span className="text-sm text-gray-600">{statusProgress[selectedComplaint.status as keyof typeof statusProgress]}%</span>
                    </div>
                    <Progress value={statusProgress[selectedComplaint.status as keyof typeof statusProgress]} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Victim Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedComplaint.victimName || selectedComplaint.victim_name}</p>
                        <p><span className="font-medium">Email:</span> {selectedComplaint.victimEmail || selectedComplaint.victim_email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedComplaint.victimPhone || selectedComplaint.victim_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Fraud Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> {selectedComplaint.fraudType || selectedComplaint.fraud_type}</p>
                        <p><span className="font-medium">Amount:</span> ₹{(selectedComplaint.fraudAmount || selectedComplaint.fraud_amount || 0).toLocaleString()}</p>
                        <p><span className="font-medium">Date:</span> {selectedComplaint.fraudDate || selectedComplaint.fraud_date}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Bank Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Bank:</span> {selectedComplaint.bankName || selectedComplaint.bank_name || 'Not provided'}</p>
                        <p><span className="font-medium">IFSC Code:</span> {selectedComplaint.ifscCode || selectedComplaint.ifsc_code || 'Not provided'}</p>
                        <p><span className="font-medium">Account:</span> {selectedComplaint.accountNumber || selectedComplaint.account_number || 'Not provided'}</p>
                        <p><span className="font-medium">Transaction ID:</span> {selectedComplaint.transactionId || selectedComplaint.transaction_id || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Police Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Police Station:</span> {selectedComplaint.policeStation || selectedComplaint.police_station || 'Not assigned'}</p>
                        <p><span className="font-medium">District:</span> {selectedComplaint.district || 'Not provided'}</p>
                        <p><span className="font-medium">Assigned Officer:</span> {selectedComplaint.assignedOfficer || selectedComplaint.assigned_officer || 'Not assigned'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Reference IDs</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">CFCFRMS ID:</span> {selectedComplaint.cfccrmsId || selectedComplaint.cfccrms_id || 'Not generated'}</p>
                        <p><span className="font-medium">1930 Helpline:</span> {selectedComplaint.helpline1930Id || selectedComplaint.helpline_1930_id || 'Not generated'}</p>
                        <p><span className="font-medium">FIR Number:</span> {selectedComplaint.firNumber || selectedComplaint.fir_number || 'Not filed'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {(selectedComplaint.documentUrl || selectedComplaint.document_url) && (
                    <div>
                      <h4 className="font-medium mb-2">Supporting Documents</h4>
                      <div className="space-y-2">
                        <a 
                          href={selectedComplaint.documentUrl || selectedComplaint.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="h-4 w-4" />
                          <span>View Uploaded Document</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Case Timeline & Real-time Updates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Complaint Registered</p>
                          <p className="text-xs text-gray-500">{new Date(selectedComplaint.createdAt || selectedComplaint.created_at || '').toLocaleString()}</p>
                          <p className="text-xs text-blue-600">1930 Helpline: {selectedComplaint.helpline1930Id || selectedComplaint.helpline_1930_id || 'Pending'}</p>
                        </div>
                      </div>
                      
                      {(selectedComplaint.cfccrmsId || selectedComplaint.cfccrms_id) && (
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">CFCFRMS Registration</p>
                            <p className="text-xs text-blue-600">ID: {selectedComplaint.cfccrmsId || selectedComplaint.cfccrms_id}</p>
                          </div>
                        </div>
                      )}
                      
                      {(selectedComplaint.firNumber || selectedComplaint.fir_number) && (
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">FIR Filed</p>
                            <p className="text-xs text-gray-500">{selectedComplaint.firDate || selectedComplaint.fir_date}</p>
                            <p className="text-xs text-blue-600">FIR: {selectedComplaint.firNumber || selectedComplaint.fir_number}</p>
                            <p className="text-xs text-blue-600">Officer: {selectedComplaint.assignedOfficer || selectedComplaint.assigned_officer}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedComplaint.status === 'BANK_FREEZE_REQUESTED' && (
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm font-medium">Nodal Officer Assigned</p>
                            <p className="text-xs text-gray-500">Financial coordination in progress</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        {selectedComplaint.status === 'REFUNDED' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : selectedComplaint.status === 'CLOSED' ? (
                          <CheckCircle className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Status: {selectedComplaint.status.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">Updated: {new Date(selectedComplaint.updatedAt || selectedComplaint.updated_at || '').toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedComplaint.status === 'FUNDS_FROZEN' && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">✓ Bank Action Completed</p>
                          <p className="text-xs text-blue-600">Funds frozen. Refund process starting.</p>
                        </div>
                      )}
                      
                      {selectedComplaint.status === 'REFUND_PROCESSING' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-800">💰 Refund in Progress</p>
                          <p className="text-xs text-green-600">SMS/Email updates will be sent.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedComplaint && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedComplaint(null)}
                >
                  ← Back to All Complaints
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Cyber Fraud Complaint</CardTitle>
                <CardDescription>Fill in the details to register your complaint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="victimName">Victim Name *</Label>
                      <Input
                        id="victimName"
                        value={formData.victimName}
                        onChange={(e) => setFormData({...formData, victimName: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="victimEmail">Email Address *</Label>
                      <Input
                        id="victimEmail"
                        type="email"
                        value={formData.victimEmail}
                        onChange={(e) => setFormData({...formData, victimEmail: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="victimPhone">Phone Number *</Label>
                      <Input
                        id="victimPhone"
                        value={formData.victimPhone}
                        onChange={(e) => setFormData({...formData, victimPhone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="victimGender">Gender *</Label>
                      <Select value={formData.victimGender} onValueChange={(value) => setFormData({...formData, victimGender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="victimAddress">Address *</Label>
                      <Input
                        id="victimAddress"
                        value={formData.victimAddress}
                        onChange={(e) => setFormData({...formData, victimAddress: e.target.value})}
                        placeholder="Enter your complete address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="victimState">State *</Label>
                      <Select value={formData.victimState} onValueChange={(value) => setFormData({...formData, victimState: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                          <SelectItem value="Assam">Assam</SelectItem>
                          <SelectItem value="Bihar">Bihar</SelectItem>
                          <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                          <SelectItem value="Goa">Goa</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Haryana">Haryana</SelectItem>
                          <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Kerala">Kerala</SelectItem>
                          <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Manipur">Manipur</SelectItem>
                          <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="Mizoram">Mizoram</SelectItem>
                          <SelectItem value="Nagaland">Nagaland</SelectItem>
                          <SelectItem value="Odisha">Odisha</SelectItem>
                          <SelectItem value="Punjab">Punjab</SelectItem>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Sikkim">Sikkim</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="Tripura">Tripura</SelectItem>
                          <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="West Bengal">West Bengal</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                          <SelectItem value="Puducherry">Puducherry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fraudType">Fraud Type *</Label>
                      <Select value={formData.fraudType} onValueChange={(value) => setFormData({...formData, fraudType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fraud type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fraudTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        placeholder="Enter district"
                      />
                    </div>
                  </div>
                  
                  {formData.fraudType === 'OTHER' && (
                    <div>
                      <Label htmlFor="otherFraudType">Specify Fraud Type *</Label>
                      <Input
                        id="otherFraudType"
                        value={formData.otherFraudType}
                        onChange={(e) => setFormData({...formData, otherFraudType: e.target.value})}
                        placeholder="Please specify the fraud type"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fraudAmount">Fraud Amount (₹) *</Label>
                      <Input
                        id="fraudAmount"
                        type="number"
                        value={formData.fraudAmount}
                        onChange={(e) => setFormData({...formData, fraudAmount: e.target.value})}
                        placeholder="Enter amount lost"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fraudDate">Fraud Date *</Label>
                      <Input
                        id="fraudDate"
                        type="date"
                        value={formData.fraudDate}
                        onChange={(e) => setFormData({...formData, fraudDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select value={formData.bankName} onValueChange={(value) => setFormData({...formData, bankName: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                        placeholder="Enter IFSC code (e.g., SBIN0001234)"
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="transactionId">Transaction ID</Label>
                      <Input
                        id="transactionId"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                        placeholder="Enter transaction ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policeStation">Police Station</Label>
                      <Input
                        id="policeStation"
                        value={formData.policeStation}
                        onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                        placeholder="Enter police station"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        placeholder="Enter district"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="documentFile">Upload Supporting Document</Label>
                    <Input
                      id="documentFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setFormData({...formData, documentFile: e.target.files?.[0] || null})}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fraudDescription">Fraud Description *</Label>
                  <Textarea
                    id="fraudDescription"
                    value={formData.fraudDescription}
                    onChange={(e) => setFormData({...formData, fraudDescription: e.target.value})}
                    placeholder="Describe the fraud incident in detail"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitComplaint} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </Button>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="awareness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Identify Phishing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Check sender's email address carefully</p>
                    <p>• Look for spelling and grammar errors</p>
                    <p>• Verify URLs before clicking</p>
                    <p>• Never share OTP or passwords</p>
                    <p>• Contact bank directly for verification</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span>Online Shopping Safety</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Shop from trusted websites only</p>
                    <p>• Check reviews and ratings</p>
                    <p>• Use secure payment methods</p>
                    <p>• Avoid cash on demand requests</p>
                    <p>• Keep transaction records safe</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-green-500" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Cyber Crime Helpline: 1930</p>
                    <p>• Police Emergency: 100</p>
                    <p>• Women Helpline: 1091</p>
                    <p>• Child Helpline: 1098</p>
                    <p>• Police Emergency: 112</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Banknote className="h-5 w-5 text-purple-500" />
                    <span>Banking Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Never share banking credentials</p>
                    <p>• Use strong, unique passwords</p>
                    <p>• Enable two-factor authentication</p>
                    <p>• Regularly check account statements</p>
                    <p>• Report suspicious transactions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    <span>Social Media Safety</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Be cautious with friend requests</p>
                    <p>• Don't share personal information</p>
                    <p>• Verify identity before sharing</p>
                    <p>• Report fake profiles</p>
                    <p>• Use privacy settings effectively</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-red-500" />
                    <span>Report Cyber Crime</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Report immediately to 1930</p>
                    <p>• Preserve digital evidence</p>
                    <p>• Document all communications</p>
                    <p>• File FIR at local police station</p>
                    <p>• Follow up regularly</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> If you've been a victim of cyber fraud, act immediately. 
                Call 1930 within the golden hour (first 24 hours) for the best chance of recovering your funds.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}