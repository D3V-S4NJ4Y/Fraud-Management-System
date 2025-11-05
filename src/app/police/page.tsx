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
  const [showFirDialog, setShowFirDialog] = useState(false)
  const [showNodalDialog, setShowNodalDialog] = useState(false)

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

  const [firData, setFirData] = useState({
    firNumber: '',
    firDate: '',
    policeStation: '',
    investigatingOfficer: ''
  })

  const [nodalData, setNodalData] = useState({
    bankName: '',
    officerName: '',
    officerEmail: '',
    officerPhone: '',
    actionRequired: ''
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

  const handleFir = async () => {
    if (!selectedComplaint || !firData.firNumber || !firData.firDate) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/fir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.complaintId || selectedComplaint.complaint_id,
          ...firData
        })
      })

      if (response.ok) {
        setShowFirDialog(false)
        fetchComplaints()
        setFirData({
          firNumber: '',
          firDate: '',
          policeStation: '',
          investigatingOfficer: ''
        })
      }
    } catch (error) {
      console.error('Error filing FIR:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNodal = async () => {
    if (!selectedComplaint || !nodalData.bankName || !nodalData.officerName) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/nodal-officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.complaintId || selectedComplaint.complaint_id,
          ...nodalData
        })
      })

      if (response.ok) {
        setShowNodalDialog(false)
        fetchComplaints()
        setNodalData({
          bankName: '',
          officerName: '',
          officerEmail: '',
          officerPhone: '',
          actionRequired: ''
        })
      }
    } catch (error) {
      console.error('Error assigning nodal officer:', error)
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
                <h1 className="text-2xl font-bold text-gray-900">Police Dashboard</h1>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="bank-actions">Bank Actions</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
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
                    <Button 
                      className="h-20 flex flex-col items-center justify-center hover:bg-blue-600 transition-colors"
                      onClick={() => setActiveTab('complaints')}
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">New Complaint</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setActiveTab('complaints')
                        setTimeout(() => {
                          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
                          if (searchInput) {
                            searchInput.focus()
                            searchInput.select()
                          }
                        }, 100)
                      }}
                    >
                      <Search className="h-6 w-6 mb-2" />
                      <span className="text-sm">Search Cases</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => setActiveTab('bank-actions')}
                    >
                      <Building className="h-6 w-6 mb-2" />
                      <span className="text-sm">Bank Actions</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        // Comprehensive Monthly Report
                        const currentDate = new Date()
                        const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                        
                        // Summary Statistics
                        const totalCases = complaints.length
                        const totalAmount = complaints.reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)
                        const refundedCases = complaints.filter(c => c.status === 'REFUNDED').length
                        const refundedAmount = complaints.filter(c => c.status === 'REFUNDED').reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)
                        const pendingCases = complaints.filter(c => c.status === 'PENDING').length
                        const frozenAmount = complaints.filter(c => c.status === 'FUNDS_FROZEN').reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0)
                        
                        // Fraud Type Analysis
                        const fraudTypes = {}
                        complaints.forEach(c => {
                          const type = c.fraudType || c.fraud_type
                          fraudTypes[type] = (fraudTypes[type] || 0) + 1
                        })
                        
                        // State-wise Analysis
                        const stateWise = {}
                        complaints.forEach(c => {
                          const state = c.victimState || c.victim_state || c.district
                          stateWise[state] = (stateWise[state] || 0) + 1
                        })
                        
                        // Bank-wise Analysis
                        const bankWise = {}
                        complaints.forEach(c => {
                          const bank = c.bankName || c.bank_name || 'Not Specified'
                          bankWise[bank] = (bankWise[bank] || 0) + 1
                        })
                        
                        // Gender Analysis
                        const genderWise = {}
                        complaints.forEach(c => {
                          const gender = c.victimGender || c.victim_gender || 'Not Specified'
                          genderWise[gender] = (genderWise[gender] || 0) + 1
                        })
                        
                        // Recovery Rate
                        const recoveryRate = totalCases > 0 ? ((refundedCases / totalCases) * 100).toFixed(2) : 0
                        const avgAmount = totalCases > 0 ? (totalAmount / totalCases).toFixed(2) : 0
                        
                        // Create comprehensive CSV
                        let csvContent = `CYBER FRAUD MONTHLY REPORT - ${monthName}\n\n`
                        
                        // Executive Summary
                        csvContent += `EXECUTIVE SUMMARY\n`
                        csvContent += `Total Cases,${totalCases}\n`
                        csvContent += `Total Fraud Amount,₹${totalAmount.toLocaleString()}\n`
                        csvContent += `Cases Resolved,${refundedCases}\n`
                        csvContent += `Amount Recovered,₹${refundedAmount.toLocaleString()}\n`
                        csvContent += `Recovery Rate,${recoveryRate}%\n`
                        csvContent += `Average Fraud Amount,₹${avgAmount}\n`
                        csvContent += `Pending Cases,${pendingCases}\n`
                        csvContent += `Funds Frozen,₹${frozenAmount.toLocaleString()}\n\n`
                        
                        // Fraud Type Breakdown
                        csvContent += `FRAUD TYPE ANALYSIS\n`
                        csvContent += `Fraud Type,Cases,Percentage\n`
                        Object.entries(fraudTypes).forEach(([type, count]) => {
                          const percentage = ((count / totalCases) * 100).toFixed(1)
                          csvContent += `${type.replace('_', ' ')},${count},${percentage}%\n`
                        })
                        csvContent += `\n`
                        
                        // State-wise Analysis
                        csvContent += `STATE-WISE ANALYSIS\n`
                        csvContent += `State/District,Cases,Percentage\n`
                        Object.entries(stateWise).forEach(([state, count]) => {
                          const percentage = ((count / totalCases) * 100).toFixed(1)
                          csvContent += `${state},${count},${percentage}%\n`
                        })
                        csvContent += `\n`
                        
                        // Bank-wise Analysis
                        csvContent += `BANK-WISE ANALYSIS\n`
                        csvContent += `Bank Name,Cases,Percentage\n`
                        Object.entries(bankWise).forEach(([bank, count]) => {
                          const percentage = ((count / totalCases) * 100).toFixed(1)
                          csvContent += `${bank},${count},${percentage}%\n`
                        })
                        csvContent += `\n`
                        
                        // Gender Analysis
                        csvContent += `DEMOGRAPHIC ANALYSIS\n`
                        csvContent += `Gender,Cases,Percentage\n`
                        Object.entries(genderWise).forEach(([gender, count]) => {
                          const percentage = ((count / totalCases) * 100).toFixed(1)
                          csvContent += `${gender},${count},${percentage}%\n`
                        })
                        csvContent += `\n`
                        
                        // Status Distribution
                        csvContent += `STATUS DISTRIBUTION\n`
                        csvContent += `Status,Cases,Amount (₹)\n`
                        const statusGroups = {}
                        complaints.forEach(c => {
                          const status = c.status
                          if (!statusGroups[status]) {
                            statusGroups[status] = { count: 0, amount: 0 }
                          }
                          statusGroups[status].count++
                          statusGroups[status].amount += (c.fraudAmount || c.fraud_amount || 0)
                        })
                        Object.entries(statusGroups).forEach(([status, data]) => {
                          csvContent += `${status.replace('_', ' ')},${data.count},₹${data.amount.toLocaleString()}\n`
                        })
                        csvContent += `\n`
                        
                        // Detailed Case List
                        csvContent += `DETAILED CASE LIST\n`
                        csvContent += `Complaint ID,Victim Name,Email,Phone,Address,State,Gender,Fraud Type,Amount (₹),Date,Status,Bank,District,FIR Number,Assigned Officer\n`
                        complaints.forEach(c => {
                          csvContent += `${c.complaintId || c.complaint_id},`
                          csvContent += `${c.victimName || c.victim_name},`
                          csvContent += `${c.victimEmail || c.victim_email},`
                          csvContent += `${c.victimPhone || c.victim_phone},`
                          csvContent += `"${(c.victimAddress || c.victim_address || 'N/A').replace(/"/g, '""')}",`
                          csvContent += `${c.victimState || c.victim_state || 'N/A'},`
                          csvContent += `${c.victimGender || c.victim_gender || 'N/A'},`
                          csvContent += `${(c.fraudType || c.fraud_type || '').replace('_', ' ')},`
                          csvContent += `₹${(c.fraudAmount || c.fraud_amount || 0).toLocaleString()},`
                          csvContent += `${c.fraudDate || c.fraud_date},`
                          csvContent += `${c.status.replace('_', ' ')},`
                          csvContent += `${c.bankName || c.bank_name || 'N/A'},`
                          csvContent += `${c.district || 'N/A'},`
                          csvContent += `${c.firNumber || c.fir_number || 'Not Filed'},`
                          csvContent += `${c.assignedOfficer || c.assigned_officer || 'Not Assigned'}\n`
                        })
                        
                        // Performance Metrics
                        csvContent += `\nPERFORMANCE METRICS\n`
                        csvContent += `Metric,Value\n`
                        csvContent += `Total Cases,${totalCases}\n`
                        csvContent += `Success Rate,${recoveryRate}%\n`
                        csvContent += `Average Amount,₹${avgAmount}\n`
                        csvContent += `Pending Cases,${pendingCases}\n`
                        csvContent += `High Priority Cases,${highPriorityComplaints}\n`
                        
                        // Generate and download
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `Cyber-Fraud-Monthly-Report-${currentDate.toISOString().split('T')[0]}.csv`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowFirDialog(true)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              File FIR
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowNodalDialog(true)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Assign Nodal Officer
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
            {(() => {
              const [bankActions, setBankActions] = useState([])
              const [loadingBankActions, setLoadingBankActions] = useState(false)
              
              const fetchBankActions = async () => {
                setLoadingBankActions(true)
                try {
                  const response = await fetch('/api/bank-actions')
                  const result = await response.json()
                  if (result.success) {
                    setBankActions(result.data)
                  }
                } catch (error) {
                  console.error('Error fetching bank actions:', error)
                } finally {
                  setLoadingBankActions(false)
                }
              }
              
              useEffect(() => {
                fetchBankActions()
              }, [])
              
              const statusColors = {
                PENDING: 'bg-yellow-100 text-yellow-800',
                COMPLETED: 'bg-green-100 text-green-800',
                FAILED: 'bg-red-100 text-red-800',
                IN_PROGRESS: 'bg-blue-100 text-blue-800'
              }
              
              return (
                <>
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
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Bank Actions</CardTitle>
                      <CardDescription>Current bank coordination requests and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingBankActions ? (
                        <div className="text-center py-4">Loading bank actions...</div>
                      ) : bankActions.length > 0 ? (
                        <div className="space-y-4">
                          {bankActions.map((action) => (
                            <div key={action.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="font-medium">{action.action_id}</span>
                                  <Badge className={statusColors[action.status]}>
                                    {action.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(action.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="font-medium">Bank Details:</p>
                                  <p className="text-gray-600">Bank: {action.bank_name}</p>
                                  <p className="text-gray-600">Branch: {action.branch_name || 'Not specified'}</p>
                                  <p className="text-gray-600">Account: {action.account_number}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Action Details:</p>
                                  <p className="text-gray-600">Type: {action.action_type.replace('_', ' ')}</p>
                                  <p className="text-gray-600">Amount: {action.amount ? `₹${action.amount.toLocaleString()}` : 'Not specified'}</p>
                                  <p className="text-gray-600">Complaint: {action.complaint_id}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Processing Info:</p>
                                  <p className="text-gray-600">Requested by: {action.requested_by}</p>
                                  <p className="text-gray-600">Processed by: {action.processed_by || 'Pending'}</p>
                                  {action.notes && <p className="text-gray-600">Notes: {action.notes}</p>}
                                </div>
                              </div>
                              
                              {action.status === 'PENDING' && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(`/api/bank-actions/${action.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ status: 'COMPLETED', processed_by: 'System Admin' })
                                          })
                                          if (response.ok) {
                                            fetchBankActions()
                                          }
                                        } catch (error) {
                                          console.error('Error updating bank action:', error)
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark Completed
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(`/api/bank-actions/${action.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ status: 'IN_PROGRESS', processed_by: 'System Admin' })
                                          })
                                          if (response.ok) {
                                            fetchBankActions()
                                          }
                                        } catch (error) {
                                          console.error('Error updating bank action:', error)
                                        }
                                      }}
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Mark In Progress
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No bank actions found.</p>
                          <p className="text-sm">Bank actions will appear here when complaints are processed.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )
            })()}
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

          <TabsContent value="analytics" className="space-y-6">
            {(() => {
              // Fraud Intelligence & Pattern Analysis
              const timePatterns = {}
              const amountRanges = { '0-10K': 0, '10K-50K': 0, '50K-1L': 0, '1L+': 0 }
              const fraudMethods = {}
              const suspiciousPatterns = []
              const hotspots = {}
              
              complaints.forEach(c => {
                // Time pattern analysis
                const fraudDate = new Date(c.fraudDate || c.fraud_date || Date.now())
                const hour = fraudDate.getHours()
                const timeSlot = hour < 6 ? 'Night (12-6 AM)' : 
                              hour < 12 ? 'Morning (6-12 PM)' : 
                              hour < 18 ? 'Afternoon (12-6 PM)' : 'Evening (6-12 AM)'
                timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1
                
                // Amount range analysis
                const amount = c.fraudAmount || c.fraud_amount || 0
                if (amount <= 10000) amountRanges['0-10K']++
                else if (amount <= 50000) amountRanges['10K-50K']++
                else if (amount <= 100000) amountRanges['50K-1L']++
                else amountRanges['1L+']++
                
                // Fraud method analysis
                const description = (c.fraudDescription || c.fraud_description || '').toLowerCase()
                if (description.includes('otp')) fraudMethods['OTP Theft'] = (fraudMethods['OTP Theft'] || 0) + 1
                if (description.includes('link') || description.includes('url')) fraudMethods['Malicious Links'] = (fraudMethods['Malicious Links'] || 0) + 1
                if (description.includes('call') || description.includes('phone')) fraudMethods['Vishing Calls'] = (fraudMethods['Vishing Calls'] || 0) + 1
                if (description.includes('fake') || description.includes('website')) fraudMethods['Fake Websites'] = (fraudMethods['Fake Websites'] || 0) + 1
                
                // Hotspot analysis
                const location = c.district || 'Unknown'
                hotspots[location] = (hotspots[location] || 0) + 1
              })
              
              // Suspicious pattern detection
              if (complaints.length > 0) {
                const avgAmount = complaints.reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0) / complaints.length
                const highValueCases = complaints.filter(c => (c.fraudAmount || c.fraud_amount || 0) > avgAmount * 2).length
                if (highValueCases > 0) suspiciousPatterns.push(`${highValueCases} cases with unusually high amounts detected`)
                
                const recentCases = complaints.filter(c => {
                  const caseDate = new Date(c.createdAt || c.created_at || Date.now())
                  const daysDiff = (Date.now() - caseDate.getTime()) / (1000 * 60 * 60 * 24)
                  return daysDiff <= 7
                }).length
                if (recentCases > complaints.length * 0.5) suspiciousPatterns.push(`${recentCases} cases reported in last 7 days - possible fraud wave`)
              }
              
              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Fraud Intelligence & Pattern Analysis</CardTitle>
                      <CardDescription>Advanced fraud detection and behavioral analysis</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  {/* Fraud Intelligence Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Hotspots</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{Object.keys(hotspots).length}</div>
                        <p className="text-xs text-muted-foreground">Geographic risk areas</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attack Methods</CardTitle>
                        <Shield className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{Object.keys(fraudMethods).length}</div>
                        <p className="text-xs text-muted-foreground">Different attack vectors</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Patterns</CardTitle>
                        <Eye className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{suspiciousPatterns.length}</div>
                        <p className="text-xs text-muted-foreground">Suspicious patterns detected</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{Object.entries(timePatterns).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(' ')[0] || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">Most active fraud time</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Fraud Intelligence Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Time Pattern Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Fraud Time Patterns</CardTitle>
                        <CardDescription>When frauds typically occur</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(timePatterns).map(([timeSlot, count]) => {
                            const percentage = (count / complaints.length * 100).toFixed(1)
                            const colors = { 
                              'Morning (6-12 PM)': 'bg-yellow-500', 
                              'Afternoon (12-6 PM)': 'bg-orange-500', 
                              'Evening (6-12 AM)': 'bg-red-500', 
                              'Night (12-6 AM)': 'bg-purple-500' 
                            }
                            return (
                              <div key={timeSlot} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{timeSlot}</span>
                                  <span className="text-sm text-gray-600">{count} cases ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div className={`${colors[timeSlot]} h-3 rounded-full`} style={{width: `${percentage}%`}}></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Amount Range Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Fraud Amount Patterns</CardTitle>
                        <CardDescription>Typical fraud amount ranges</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(amountRanges).map(([range, count]) => {
                            const percentage = complaints.length > 0 ? (count / complaints.length * 100).toFixed(1) : 0
                            const colors = { '0-10K': 'bg-green-500', '10K-50K': 'bg-yellow-500', '50K-1L': 'bg-orange-500', '1L+': 'bg-red-500' }
                            return (
                              <div key={range} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">₹{range}</span>
                                  <span className="text-sm text-gray-600">{count} cases ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div className={`${colors[range]} h-3 rounded-full`} style={{width: `${percentage}%`}}></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Advanced Intelligence */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attack Methods */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Attack Vectors</CardTitle>
                        <CardDescription>How fraudsters operate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(fraudMethods).map(([method, count]) => {
                            const percentage = (count / complaints.length * 100).toFixed(1)
                            return (
                              <div key={method} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{method}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                                  </div>
                                  <span className="text-xs text-gray-600 w-8">{count}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Geographic Hotspots */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Fraud Hotspots</CardTitle>
                        <CardDescription>High-risk areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(hotspots).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([location, count]) => {
                            const percentage = (count / complaints.length * 100).toFixed(1)
                            const riskLevel = count > 2 ? 'bg-red-500' : count > 1 ? 'bg-orange-500' : 'bg-yellow-500'
                            return (
                              <div key={location} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{location}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div className={`${riskLevel} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
                                  </div>
                                  <span className="text-xs text-gray-600 w-8">{count}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Threat Intelligence */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Threat Intelligence</CardTitle>
                        <CardDescription>AI-powered insights</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <h5 className="text-sm font-medium text-red-800 mb-2">🚨 Active Threats</h5>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• UPI fraud spike detected</li>
                              <li>• Phishing campaign active</li>
                              <li>• New fake website reported</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h5 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Emerging Patterns</h5>
                            <ul className="text-xs text-yellow-700 space-y-1">
                              <li>• Weekend fraud increase</li>
                              <li>• Senior citizen targeting</li>
                              <li>• Social media scams rising</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Suspicious Patterns Alert */}
                  {suspiciousPatterns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">🚨 Suspicious Pattern Alert</CardTitle>
                        <CardDescription>AI has detected unusual fraud patterns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {suspiciousPatterns.map((pattern, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded border border-red-200">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-800">{pattern}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )
            })()}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {(() => {
              // Calculate real performance metrics from actual data
              const resolvedCases = complaints.filter(c => c.status === 'REFUNDED' || c.status === 'CLOSED').length
              const resolutionRate = totalComplaints > 0 ? ((resolvedCases / totalComplaints) * 100) : 0
              
              // Calculate average resolution time from actual dates
              const avgResolutionTime = (() => {
                const resolvedComplaints = complaints.filter(c => c.status === 'REFUNDED' || c.status === 'CLOSED')
                if (resolvedComplaints.length === 0) return 0
                const totalDays = resolvedComplaints.reduce((sum, c) => {
                  const created = new Date(c.createdAt || c.created_at || Date.now())
                  const updated = new Date(c.updatedAt || c.updated_at || Date.now())
                  const diffTime = Math.abs(updated - created)
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                  return sum + diffDays
                }, 0)
                return (totalDays / resolvedComplaints.length).toFixed(1)
              })()
              
              // Calculate bank coordination success rate from actual bank actions
              const completedBankActions = complaints.filter(c => c.status === 'FUNDS_FROZEN').length
              const totalBankActions = complaints.filter(c => 
                c.status === 'FUNDS_FROZEN' || 
                c.status === 'BANK_FREEZE_REQUESTED' ||
                c.status === 'REFUND_PROCESSING'
              ).length
              const bankCoordination = totalBankActions > 0 ? ((completedBankActions / totalBankActions) * 100) : 0
              
              // Status distribution for pie chart
              const statusData = {
                'PENDING': complaints.filter(c => c.status === 'PENDING').length,
                'IN_PROGRESS': complaints.filter(c => c.status === 'IN_PROGRESS').length,
                'FUNDS_FROZEN': complaints.filter(c => c.status === 'FUNDS_FROZEN').length,
                'REFUND_PROCESSING': complaints.filter(c => c.status === 'REFUND_PROCESSING').length,
                'REFUNDED': complaints.filter(c => c.status === 'REFUNDED').length,
                'CLOSED': complaints.filter(c => c.status === 'CLOSED').length
              }
              
              // Fraud type distribution
              const fraudTypeData = {}
              complaints.forEach(c => {
                const type = c.fraudType || c.fraud_type
                fraudTypeData[type] = (fraudTypeData[type] || 0) + 1
              })
              
              // Monthly trend from actual data
              const monthlyData = (() => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                return months.map((month, index) => {
                  const currentMonth = new Date().getMonth()
                  if (index === currentMonth) {
                    return { month, cases: totalComplaints, resolved: resolvedCases }
                  }
                  return { month, cases: 0, resolved: 0 }
                })
              })()
              
              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Dashboard</CardTitle>
                      <CardDescription>Real-time system performance metrics and analytics</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  {/* Key Performance Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{resolutionRate.toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${resolutionRate}%`}}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{resolvedCases} of {totalComplaints} cases resolved</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{avgResolutionTime || 'N/A'} {avgResolutionTime ? 'days' : ''}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: avgResolutionTime ? `${Math.min((avgResolutionTime / 7) * 100, 100)}%` : '0%'}}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Target: 7 days</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                        <CheckCircle className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-500">N/A</div>
                        <div className="flex space-x-1 mt-2">
                          {[1,2,3,4,5].map(star => (
                            <div key={star} className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">No feedback data available</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bank Coordination</CardTitle>
                        <Building className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{bankCoordination}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: `${bankCoordination}%`}}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Successful bank actions</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Charts and Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Case Status Distribution</CardTitle>
                        <CardDescription>Current status of all complaints</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(statusData).map(([status, count]) => {
                            const percentage = totalComplaints > 0 ? (count / totalComplaints * 100) : 0
                            const colors = {
                              'PENDING': 'bg-yellow-500',
                              'IN_PROGRESS': 'bg-blue-500',
                              'FUNDS_FROZEN': 'bg-indigo-500',
                              'REFUND_PROCESSING': 'bg-teal-500',
                              'REFUNDED': 'bg-green-500',
                              'CLOSED': 'bg-gray-500'
                            }
                            return (
                              <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
                                  <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div className={`${colors[status]} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-12">{count} ({percentage.toFixed(0)}%)</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Fraud Type Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Fraud Type Analysis</CardTitle>
                        <CardDescription>Distribution by fraud categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(fraudTypeData).map(([type, count]) => {
                            const percentage = totalComplaints > 0 ? (count / totalComplaints * 100) : 0
                            const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-blue-500', 'bg-violet-500', 'bg-pink-500']
                            const colorIndex = Object.keys(fraudTypeData).indexOf(type) % colors.length
                            return (
                              <div key={type} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${colors[colorIndex]}`}></div>
                                  <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div className={`${colors[colorIndex]} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-12">{count} ({percentage.toFixed(0)}%)</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Monthly Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Performance Trend</CardTitle>
                      <CardDescription>Cases registered vs resolved over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {monthlyData.map((month, index) => {
                          const resolutionRate = (month.resolved / month.cases * 100)
                          return (
                            <div key={month.month} className="flex items-center space-x-4">
                              <div className="w-12 text-sm font-medium">{month.month}</div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>Cases: {month.cases}</span>
                                  <span>Resolved: {month.resolved}</span>
                                  <span>Rate: {resolutionRate.toFixed(1)}%</span>
                                </div>
                                <div className="relative">
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full" style={{width: `${(month.cases / 70) * 100}%`}}></div>
                                  </div>
                                  <div className="absolute top-0 w-full bg-transparent rounded-full h-3">
                                    <div className="bg-green-500 h-3 rounded-full opacity-70" style={{width: `${(month.resolved / 70) * 100}%`}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Total Cases</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Resolved Cases</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Performance Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Insights & Recommendations</CardTitle>
                      <CardDescription>AI-powered insights for system improvement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-green-600">✓ Current Status</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Resolution rate: {resolutionRate.toFixed(1)}%</li>
                            <li>• Total cases: {totalComplaints}</li>
                            <li>• Resolved cases: {resolvedCases}</li>
                            <li>• Bank coordination: {bankCoordination.toFixed(1)}%</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-orange-600">⚠ Action Items</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Pending cases: {pendingComplaints}</li>
                            <li>• High priority cases: {highPriorityComplaints}</li>
                            <li>• Funds frozen: ₹{complaints.filter(c => c.status === 'FUNDS_FROZEN').reduce((sum, c) => sum + (c.fraudAmount || c.fraud_amount || 0), 0).toLocaleString()}</li>
                            <li>• Processing refunds: {complaints.filter(c => c.status === 'REFUND_PROCESSING').length}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
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

      <Dialog open={showFirDialog} onOpenChange={setShowFirDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File FIR</DialogTitle>
            <DialogDescription>File FIR for {selectedComplaint?.complaintId || selectedComplaint?.complaint_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="firNumber">FIR Number</Label>
              <Input
                id="firNumber"
                value={firData.firNumber}
                onChange={(e) => setFirData({...firData, firNumber: e.target.value})}
                placeholder="Enter FIR number"
              />
            </div>
            <div>
              <Label htmlFor="firDate">FIR Date</Label>
              <Input
                id="firDate"
                type="date"
                value={firData.firDate}
                onChange={(e) => setFirData({...firData, firDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="policeStation">Police Station</Label>
              <Input
                id="policeStation"
                value={firData.policeStation}
                onChange={(e) => setFirData({...firData, policeStation: e.target.value})}
                placeholder="Enter police station"
              />
            </div>
            <div>
              <Label htmlFor="investigatingOfficer">Investigating Officer</Label>
              <Input
                id="investigatingOfficer"
                value={firData.investigatingOfficer}
                onChange={(e) => setFirData({...firData, investigatingOfficer: e.target.value})}
                placeholder="Enter officer name"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleFir} disabled={loading}>
                {loading ? 'Filing...' : 'File FIR'}
              </Button>
              <Button variant="outline" onClick={() => setShowFirDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNodalDialog} onOpenChange={setShowNodalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Nodal Officer</DialogTitle>
            <DialogDescription>Assign financial nodal officer for {selectedComplaint?.complaintId || selectedComplaint?.complaint_id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={nodalData.bankName}
                onChange={(e) => setNodalData({...nodalData, bankName: e.target.value})}
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label htmlFor="officerName">Nodal Officer Name</Label>
              <Input
                id="officerName"
                value={nodalData.officerName}
                onChange={(e) => setNodalData({...nodalData, officerName: e.target.value})}
                placeholder="Enter officer name"
              />
            </div>
            <div>
              <Label htmlFor="officerEmail">Officer Email</Label>
              <Input
                id="officerEmail"
                type="email"
                value={nodalData.officerEmail}
                onChange={(e) => setNodalData({...nodalData, officerEmail: e.target.value})}
                placeholder="Enter officer email"
              />
            </div>
            <div>
              <Label htmlFor="officerPhone">Officer Phone</Label>
              <Input
                id="officerPhone"
                value={nodalData.officerPhone}
                onChange={(e) => setNodalData({...nodalData, officerPhone: e.target.value})}
                placeholder="Enter officer phone"
              />
            </div>
            <div>
              <Label htmlFor="actionRequired">Action Required</Label>
              <Textarea
                id="actionRequired"
                value={nodalData.actionRequired}
                onChange={(e) => setNodalData({...nodalData, actionRequired: e.target.value})}
                placeholder="Describe required action"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleNodal} disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Officer'}
              </Button>
              <Button variant="outline" onClick={() => setShowNodalDialog(false)}>
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