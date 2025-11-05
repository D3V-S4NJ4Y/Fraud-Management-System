'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute, useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Users, 
  FileText, 
  Banknote,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  Bell,
  User,
  Building,
  AlertCircle
} from 'lucide-react'

interface Complaint {
  id: string
  complaintId: string
  victimName: string
  victimEmail: string
  victimPhone: string
  fraudType: string
  fraudAmount: number
  fraudDate: string
  fraudDescription: string
  bankName?: string
  accountNumber?: string
  transactionId?: string
  status: string
  priority: string
  policeStation?: string
  district?: string
  assignedOfficer?: string
  cfccrmsId?: string
  helpline1930Id?: string
  firNumber?: string
  firDate?: string
  createdAt: string
  updatedAt: string
  bankActions?: any[]
  refunds?: any[]
  caseUpdates?: any[]
}

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showBankActionDialog, setShowBankActionDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  const [updateData, setUpdateData] = useState({
    title: '',
    description: '',
    status: ''
  })

  const [bankActionData, setBankActionData] = useState({
    bankName: '',
    branchName: '',
    accountNumber: '',
    actionType: '',
    amount: '',
    notes: ''
  })

  const [refundData, setRefundData] = useState({
    amount: '',
    refundMethod: '',
    processedBy: ''
  })

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

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800'
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/complaints')
      const result = await response.json()
      if (result.success) {
        setComplaints(result.data)
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !updateData.title || !updateData.description || !updateData.status) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/complaints/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.complaintId || selectedComplaint.complaint_id,
          status: updateData.status,
          title: updateData.title,
          description: updateData.description,
          updatedBy: 'Admin Officer'
        })
      })

      if (response.ok) {
        setShowUpdateDialog(false)
        fetchComplaints()
        setUpdateData({ title: '', description: '', status: '' })
      }
    } catch (error) {
      console.error('Error updating complaint:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBankAction = async () => {
    if (!selectedComplaint || !bankActionData.bankName || !bankActionData.accountNumber || !bankActionData.actionType) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/bank-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.complaintId || selectedComplaint.complaint_id,
          ...bankActionData
        })
      })

      if (response.ok) {
        setShowBankActionDialog(false)
        fetchComplaints()
        setBankActionData({
          bankName: '',
          branchName: '',
          accountNumber: '',
          actionType: '',
          amount: '',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error creating bank action:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!selectedComplaint || !refundData.amount) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.complaintId || selectedComplaint.complaint_id,
          ...refundData
        })
      })

      if (response.ok) {
        setShowRefundDialog(false)
        fetchComplaints()
        setRefundData({
          amount: '',
          refundMethod: '',
          processedBy: ''
        })
      }
    } catch (error) {
      console.error('Error creating refund:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = (complaint.complaintId || complaint.complaint_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.victimName || complaint.victim_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (complaint.victimEmail || complaint.victim_email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === 'ALL' || complaint.status === statusFilter
    const matchesPriority = !priorityFilter || priorityFilter === 'ALL' || complaint.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalComplaints = complaints.length
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length
  const highPriorityComplaints = complaints.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length
  const totalAmount = complaints.reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)

  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Odisha Police - Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Cyber Fraud Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user?.name || 'Officer'}
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="bank-actions">Bank Actions</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">Registered cases</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingComplaints}</div>
                  <p className="text-xs text-muted-foreground">Awaiting action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{highPriorityComplaints}</div>
                  <p className="text-xs text-muted-foreground">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across all cases</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Latest cases requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{complaint.complaintId || complaint.complaint_id}</span>
                            <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={priorityColors[complaint.priority as keyof typeof priorityColors]}>
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{complaint.victimName || complaint.victim_name} - {complaint.fraudType || complaint.fraud_type}</p>
                          <p className="text-xs text-gray-500">₹{(complaint.fraudAmount || complaint.fraud_amount || 0).toLocaleString()} - {complaint.district}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint)
                            setActiveTab('complaints')
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col items-center justify-center">
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">New Complaint</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Search className="h-6 w-6 mb-2" />
                      <span className="text-sm">Search Cases</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Building className="h-6 w-6 mb-2" />
                      <span className="text-sm">Bank Actions</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Management</CardTitle>
                <CardDescription>View and manage all cyber fraud complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by ID, name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                      <SelectItem value="FUNDS_FROZEN">Funds Frozen</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Priority</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{complaint.complaintId || complaint.complaint_id}</span>
                          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={priorityColors[complaint.priority as keyof typeof priorityColors]}>
                            {complaint.priority}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint)
                              setShowUpdateDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Victim: {complaint.victimName || complaint.victim_name}</p>
                          <p className="text-gray-600">{complaint.victimEmail || complaint.victim_email}</p>
                          <p className="text-gray-600">{complaint.victimPhone || complaint.victim_phone}</p>
                        </div>
                        <div>
                          <p className="font-medium">Fraud Details:</p>
                          <p className="text-gray-600">Type: {complaint.fraudType || complaint.fraud_type}</p>
                          <p className="text-gray-600">Amount: ₹{(complaint.fraudAmount || complaint.fraud_amount || 0).toLocaleString()}</p>
                          <p className="text-gray-600">Date: {complaint.fraudDate || complaint.fraud_date}</p>
                        </div>
                        <div>
                          <p className="font-medium">Location:</p>
                          <p className="text-gray-600">District: {complaint.district}</p>
                          <p className="text-gray-600">Police Station: {complaint.policeStation || complaint.police_station}</p>
                          <p className="text-gray-600">FIR: {complaint.firNumber || complaint.fir_number}</p>
                        </div>
                      </div>

                      {selectedComplaint?.id === complaint.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowBankActionDialog(true)}
                            >
                              <Building className="h-4 w-4 mr-2" />
                              Bank Action
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowRefundDialog(true)}
                            >
                              <Banknote className="h-4 w-4 mr-2" />
                              Process Refund
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Coordination</CardTitle>
                <CardDescription>Manage bank actions and fund freeze requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bank actions are automatically coordinated with RBI and NPCI frameworks for faster processing.
                  </AlertDescription>
                </Alert>
                <div className="mt-6">
                  <p className="text-center text-gray-500">Bank actions will appear here when complaints are processed.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Refund Management</CardTitle>
                <CardDescription>Process and track refund requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500">
                  <p>Refund requests will appear here when bank actions are completed.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate comprehensive reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span className="text-sm">Monthly Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Activity className="h-6 w-6 mb-2" />
                    <span className="text-sm">Performance</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>Update the status and add notes for {selectedComplaint?.complaintId || selectedComplaint?.complaint_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Update Title</Label>
              <Input
                id="title"
                value={updateData.title}
                onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                placeholder="Enter update title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={updateData.description}
                onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                placeholder="Enter update description"
              />
            </div>
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData({...updateData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                  <SelectItem value="BANK_FREEZE_REQUESTED">Bank Freeze Requested</SelectItem>
                  <SelectItem value="FUNDS_FROZEN">Funds Frozen</SelectItem>
                  <SelectItem value="REFUND_PROCESSING">Refund Processing</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleStatusUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update Status'}
              </Button>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBankActionDialog} onOpenChange={setShowBankActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Bank Action</DialogTitle>
            <DialogDescription>Request bank action for {selectedComplaint?.complaintId || selectedComplaint?.complaint_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankActionData.bankName}
                onChange={(e) => setBankActionData({...bankActionData, bankName: e.target.value})}
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={bankActionData.branchName}
                onChange={(e) => setBankActionData({...bankActionData, branchName: e.target.value})}
                placeholder="Enter branch name"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankActionData.accountNumber}
                onChange={(e) => setBankActionData({...bankActionData, accountNumber: e.target.value})}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <Select value={bankActionData.actionType} onValueChange={(value) => setBankActionData({...bankActionData, actionType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREEZE_ACCOUNT">Freeze Account</SelectItem>
                  <SelectItem value="FREEZE_TRANSACTION">Freeze Transaction</SelectItem>
                  <SelectItem value="HOLD_FUNDS">Hold Funds</SelectItem>
                  <SelectItem value="INVESTIGATE_TRANSACTION">Investigate Transaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (Optional)</Label>
              <Input
                id="amount"
                type="number"
                value={bankActionData.amount}
                onChange={(e) => setBankActionData({...bankActionData, amount: e.target.value})}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={bankActionData.notes}
                onChange={(e) => setBankActionData({...bankActionData, notes: e.target.value})}
                placeholder="Enter additional notes"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleBankAction} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Bank Action'}
              </Button>
              <Button variant="outline" onClick={() => setShowBankActionDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>Initiate refund for {selectedComplaint?.complaintId || selectedComplaint?.complaint_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundData.amount}
                onChange={(e) => setRefundData({...refundData, amount: e.target.value})}
                placeholder="Enter refund amount"
              />
            </div>
            <div>
              <Label htmlFor="refundMethod">Refund Method</Label>
              <Select value={refundData.refundMethod} onValueChange={(value) => setRefundData({...refundData, refundMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select refund method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="DIGITAL_WALLET">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="processedBy">Processed By</Label>
              <Input
                id="processedBy"
                value={refundData.processedBy}
                onChange={(e) => setRefundData({...refundData, processedBy: e.target.value})}
                placeholder="Enter processor name"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleRefund} disabled={loading}>
                {loading ? 'Processing...' : 'Process Refund'}
              </Button>
              <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'POLICE_OFFICER', 'NODAL_OFFICER']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}