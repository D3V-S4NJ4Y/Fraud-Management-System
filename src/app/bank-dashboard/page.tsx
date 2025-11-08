'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Banknote,
  Shield,
  Eye
} from 'lucide-react'

interface BankAction {
  id: string
  complaint_id: string
  victim_name: string
  victim_email: string
  fraud_amount: number
  bank_name: string
  account_number: string
  ifsc_code: string
  transaction_id: string
  action_type: string
  status: string
  requested_at: string
  police_station: string
  assigned_officer: string
  priority: string
  notes?: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
}

const priorityColors = {
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-orange-100 text-orange-800',
  LOW: 'bg-gray-100 text-gray-800'
}

function BankDashboardContent() {
  const [bankActions, setBankActions] = useState<BankAction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<BankAction | null>(null)
  const { user, logout } = useAuth()

  const fetchBankActions = async () => {
    try {
      const response = await fetch('/api/bank-actions')
      const result = await response.json()
      if (result.success) {
        setBankActions(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching bank actions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBankActions()
  }, [])

  const handleActionUpdate = async (actionId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/bank-actions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          actionId, 
          status, 
          notes,
          processedBy: user?.name 
        })
      })
      
      if (response.ok) {
        fetchBankActions()
        setSelectedAction(null)
      }
    } catch (error) {
      console.error('Error updating bank action:', error)
    }
  }

  const pendingActions = bankActions.filter(action => action.status === 'PENDING')
  const completedActions = bankActions.filter(action => action.status === 'COMPLETED')
  const totalAmount = bankActions.reduce((sum, action) => sum + action.fraud_amount, 0)
  const frozenAmount = completedActions.reduce((sum, action) => sum + action.fraud_amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bank Dashboard</h1>
                <p className="text-sm text-gray-600">Cyber Fraud Action Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingActions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Actions</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedActions.length}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <Banknote className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frozen Amount</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{frozenAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Successfully frozen</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Actions ({pendingActions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Actions</TabsTrigger>
            <TabsTrigger value="all">All Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Bank Actions</CardTitle>
                <CardDescription>Actions requested by police that require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading actions...</div>
                ) : pendingActions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingActions.map((action) => (
                      <div key={action.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium text-lg">{action.complaint_id}</span>
                              <Badge className={statusColors[action.status as keyof typeof statusColors]}>
                                {action.status}
                              </Badge>
                              <Badge className={priorityColors[action.priority as keyof typeof priorityColors]}>
                                {action.priority} Priority
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Victim: {action.victim_name}</p>
                                <p className="text-sm text-gray-600">Email: {action.victim_email}</p>
                                <p className="text-sm text-gray-600">Amount: ₹{action.fraud_amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Bank: {action.bank_name}</p>
                                <p className="text-sm text-gray-600">Account: {action.account_number}</p>
                                <p className="text-sm text-gray-600">IFSC: {action.ifsc_code}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Police Station: {action.police_station}</span>
                              <span>Officer: {action.assigned_officer}</span>
                              <span>Requested: {new Date(action.requested_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => setSelectedAction(action)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No pending actions found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Actions</CardTitle>
                <CardDescription>Successfully processed bank actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium">{action.complaint_id}</span>
                            <Badge className="bg-green-100 text-green-800">COMPLETED</Badge>
                          </div>
                          <p className="text-sm text-gray-600">₹{action.fraud_amount.toLocaleString()} - {action.victim_name}</p>
                          <p className="text-xs text-gray-500">Completed on {new Date(action.requested_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Bank Actions</CardTitle>
                <CardDescription>Complete history of bank actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium">{action.complaint_id}</span>
                            <Badge className={statusColors[action.status as keyof typeof statusColors]}>
                              {action.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">₹{action.fraud_amount.toLocaleString()} - {action.victim_name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Bank Action Details - {selectedAction.complaint_id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Victim Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedAction.victim_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedAction.victim_email}</p>
                      <p><span className="font-medium">Amount:</span> ₹{selectedAction.fraud_amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Bank Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Bank:</span> {selectedAction.bank_name}</p>
                      <p><span className="font-medium">Account:</span> {selectedAction.account_number}</p>
                      <p><span className="font-medium">IFSC:</span> {selectedAction.ifsc_code}</p>
                      <p><span className="font-medium">Transaction ID:</span> {selectedAction.transaction_id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Police Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Station:</span> {selectedAction.police_station}</p>
                    <p><span className="font-medium">Officer:</span> {selectedAction.assigned_officer}</p>
                    <p><span className="font-medium">Requested:</span> {new Date(selectedAction.requested_at).toLocaleString()}</p>
                  </div>
                </div>

                {selectedAction.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedAction.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleActionUpdate(selectedAction.id, 'COMPLETED', 'Account frozen successfully')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleActionUpdate(selectedAction.id, 'REJECTED', 'Unable to process request')}
                    variant="destructive"
                  >
                    Reject Action
                  </Button>
                  <Button
                    onClick={() => setSelectedAction(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default function BankDashboard() {
  return (
    <ProtectedRoute allowedRoles={['BANK_OFFICER']}>
      <BankDashboardContent />
    </ProtectedRoute>
  )
}