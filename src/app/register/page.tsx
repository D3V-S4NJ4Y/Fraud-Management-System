'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    state: '',
    district: '',
    police_station: '',
    department: '',
    designation: '',
    experience: '',
    // Bank officer specific fields
    bankName: '',
    branchName: '',
    branchCode: '',
    ifscCode: '',
    employeeId: '',
    address: '',
    city: '',
    pincode: '',
    idCard: null as File | null,
    employmentCertificate: null as File | null,
    authorizationLetter: null as File | null,
    // Nodal officer specific fields
    organizationName: '',
    organizationType: '',
    officeAddress: '',
    jurisdictionArea: '',
    appointmentLetter: null as File | null,
    authorizationCertificate: null as File | null,
    // Police officer fields
    id_card: null as File | null,
    document: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const roles = [
    { value: 'VICTIM', label: 'Victim/Citizen' },
    { value: 'POLICE_OFFICER', label: 'Police Officer' },
    { value: 'NODAL_OFFICER', label: 'Nodal Officer' },
    { value: 'BANK_OFFICER', label: 'Bank Officer' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.role) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.role === 'VICTIM') {
      if (!formData.password) {
        setError('Password is required')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    if (formData.role === 'POLICE_OFFICER') {
      if (!formData.state || !formData.district || !formData.police_station || !formData.department || !formData.designation || !formData.experience || !formData.password) {
        setError('Please fill in all required fields for police verification')
        return
      }
      if (!formData.id_card || !formData.document) {
        setError('Please upload ID card and service document')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }
    
    if (formData.role === 'BANK_OFFICER') {
      if (!formData.bankName || !formData.branchName || !formData.branchCode || !formData.ifscCode || !formData.employeeId || !formData.designation || !formData.experience || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.password) {
        setError('Please fill in all required fields for bank verification')
        return
      }
      if (!formData.idCard || !formData.employmentCertificate || !formData.authorizationLetter) {
        setError('Please upload all required documents (ID Card, Employment Certificate, Authorization Letter)')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (formData.ifscCode.length !== 11) {
        setError('IFSC code must be 11 characters')
        return
      }
      if (formData.pincode.length !== 6) {
        setError('Pincode must be 6 digits')
        return
      }
    }
    
    if (formData.role === 'NODAL_OFFICER') {
      if (!formData.organizationName || !formData.organizationType || !formData.employeeId || !formData.designation || !formData.experience || !formData.officeAddress || !formData.city || !formData.state || !formData.pincode || !formData.jurisdictionArea || !formData.password) {
        setError('Please fill in all required fields for nodal officer verification')
        return
      }
      if (!formData.idCard || !formData.appointmentLetter || !formData.authorizationCertificate) {
        setError('Please upload all required documents (ID Card, Appointment Letter, Authorization Certificate)')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (formData.pincode.length !== 6) {
        setError('Pincode must be 6 digits')
        return
      }
    }

    setLoading(true)
    try {
      if (formData.role === 'VICTIM') {
        // Direct registration for victims using applications API
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('phone', formData.phone)
        formDataToSend.append('password', formData.password)
        formDataToSend.append('role', formData.role)

        const response = await fetch('/api/applications', {
          method: 'POST',
          body: formDataToSend
        })

        const result = await response.json()
        if (result.success) {
          router.push('/login?message=Registration successful! Please login with your credentials.')
        } else {
          setError(result.error || result.details || 'Registration failed')
        }
      } else {
        // Application submission for officers
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('phone', formData.phone)
        formDataToSend.append('role', formData.role)
        formDataToSend.append('password', formData.password)
        if (formData.role === 'POLICE_OFFICER') {
          formDataToSend.append('state', formData.state)
          formDataToSend.append('district', formData.district)
          formDataToSend.append('police_station', formData.police_station)
          formDataToSend.append('department', formData.department)
          formDataToSend.append('designation', formData.designation)
          formDataToSend.append('experience', formData.experience)
          formDataToSend.append('reason', 'Police officer registration request')
          
          if (formData.id_card) formDataToSend.append('id_card', formData.id_card)
          if (formData.document) formDataToSend.append('document', formData.document)
        } else if (formData.role === 'BANK_OFFICER') {
          formDataToSend.append('bankName', formData.bankName)
          formDataToSend.append('branchName', formData.branchName)
          formDataToSend.append('branchCode', formData.branchCode)
          formDataToSend.append('ifscCode', formData.ifscCode)
          formDataToSend.append('employeeId', formData.employeeId)
          formDataToSend.append('designation', formData.designation)
          formDataToSend.append('department', formData.department)
          formDataToSend.append('experience', formData.experience)
          formDataToSend.append('address', formData.address)
          formDataToSend.append('city', formData.city)
          formDataToSend.append('state', formData.state)
          formDataToSend.append('pincode', formData.pincode)
          formDataToSend.append('reason', 'Bank officer registration for cyber fraud coordination')
          
          if (formData.idCard) formDataToSend.append('idCard', formData.idCard)
          if (formData.employmentCertificate) formDataToSend.append('employmentCertificate', formData.employmentCertificate)
          if (formData.authorizationLetter) formDataToSend.append('authorizationLetter', formData.authorizationLetter)
        } else if (formData.role === 'NODAL_OFFICER') {
          formDataToSend.append('organizationName', formData.organizationName)
          formDataToSend.append('organizationType', formData.organizationType)
          formDataToSend.append('employeeId', formData.employeeId)
          formDataToSend.append('designation', formData.designation)
          formDataToSend.append('department', formData.department)
          formDataToSend.append('experience', formData.experience)
          formDataToSend.append('officeAddress', formData.officeAddress)
          formDataToSend.append('city', formData.city)
          formDataToSend.append('state', formData.state)
          formDataToSend.append('pincode', formData.pincode)
          formDataToSend.append('jurisdictionArea', formData.jurisdictionArea)
          formDataToSend.append('reason', 'Nodal officer registration for financial crime coordination')
          
          if (formData.idCard) formDataToSend.append('idCard', formData.idCard)
          if (formData.appointmentLetter) formDataToSend.append('appointmentLetter', formData.appointmentLetter)
          if (formData.authorizationCertificate) formDataToSend.append('authorizationCertificate', formData.authorizationCertificate)
        } else {
          formDataToSend.append('department', formData.department)
          formDataToSend.append('designation', formData.designation)
          formDataToSend.append('experience', formData.experience)
          formDataToSend.append('reason', 'Officer registration request')
        }

        const response = await fetch('/api/applications', {
          method: 'POST',
          body: formDataToSend
        })

        const result = await response.json()
        if (result.application) {
          router.push('/application-status?id=' + result.application.application_id)
        } else {
          console.error('Application error:', result)
          if (result.error && result.error.includes('table does not exist')) {
            setError('Database setup required. Please contact administrator to create applications table.')
          } else {
            setError(result.error || result.details || 'Application submission failed')
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create your account for Cyber Fraud Support System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'POLICE_OFFICER' && (
              <>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Enter your state"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="Enter your district"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="police_station">Police Station *</Label>
                  <Input
                    id="police_station"
                    type="text"
                    value={formData.police_station}
                    onChange={(e) => setFormData({...formData, police_station: e.target.value})}
                    placeholder="Enter your police station"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g., Delhi Police, Mumbai Police"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder="e.g., Inspector, Sub-Inspector"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (years) *</Label>
                  <Input
                    id="experience"
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="Years of police service"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="id_card">Police ID Card *</Label>
                  <Input
                    id="id_card"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFormData({...formData, id_card: e.target.files?.[0] || null})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="document">Service Certificate/Document *</Label>
                  <Input
                    id="document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFormData({...formData, document: e.target.files?.[0] || null})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </>
            )}

            {formData.role === 'BANK_OFFICER' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Select value={formData.bankName} onValueChange={(value) => setFormData({...formData, bankName: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="State Bank of India">State Bank of India</SelectItem>
                        <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                        <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                        <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                        <SelectItem value="Punjab National Bank">Punjab National Bank</SelectItem>
                        <SelectItem value="Bank of Baroda">Bank of Baroda</SelectItem>
                        <SelectItem value="Canara Bank">Canara Bank</SelectItem>
                        <SelectItem value="Union Bank of India">Union Bank of India</SelectItem>
                        <SelectItem value="Bank of India">Bank of India</SelectItem>
                        <SelectItem value="Central Bank of India">Central Bank of India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="branchName">Branch Name *</Label>
                    <Input
                      id="branchName"
                      type="text"
                      value={formData.branchName}
                      onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                      placeholder="Enter branch name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="branchCode">Branch Code *</Label>
                    <Input
                      id="branchCode"
                      type="text"
                      value={formData.branchCode}
                      onChange={(e) => setFormData({...formData, branchCode: e.target.value})}
                      placeholder="Enter branch code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                      placeholder="Enter IFSC code"
                      maxLength={11}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation *</Label>
                    <Select value={formData.designation} onValueChange={(value) => setFormData({...formData, designation: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                        <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                        <SelectItem value="Deputy Manager">Deputy Manager</SelectItem>
                        <SelectItem value="Officer">Officer</SelectItem>
                        <SelectItem value="Senior Officer">Senior Officer</SelectItem>
                        <SelectItem value="Chief Manager">Chief Manager</SelectItem>
                        <SelectItem value="General Manager">General Manager</SelectItem>
                        <SelectItem value="Nodal Officer">Nodal Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="e.g., Cyber Crime Cell, Fraud Prevention"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (years) *</Label>
                    <Input
                      id="experience"
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Years of banking experience"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      placeholder="Enter pincode"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="idCard">Bank ID Card *</Label>
                    <Input
                      id="idCard"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, idCard: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentCertificate">Employment Certificate *</Label>
                    <Input
                      id="employmentCertificate"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, employmentCertificate: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorizationLetter">Bank Authorization Letter *</Label>
                    <Input
                      id="authorizationLetter"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, authorizationLetter: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </>
            )}
            
            {formData.role === 'NODAL_OFFICER' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select value={formData.organizationType} onValueChange={(value) => setFormData({...formData, organizationType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RBI">Reserve Bank of India (RBI)</SelectItem>
                        <SelectItem value="NPCI">National Payments Corporation of India (NPCI)</SelectItem>
                        <SelectItem value="SEBI">Securities and Exchange Board of India (SEBI)</SelectItem>
                        <SelectItem value="IRDAI">Insurance Regulatory and Development Authority (IRDAI)</SelectItem>
                        <SelectItem value="Ministry of Finance">Ministry of Finance</SelectItem>
                        <SelectItem value="Cyber Crime Cell">Cyber Crime Cell</SelectItem>
                        <SelectItem value="Financial Intelligence Unit">Financial Intelligence Unit (FIU)</SelectItem>
                        <SelectItem value="Other Government Agency">Other Government Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation *</Label>
                    <Select value={formData.designation} onValueChange={(value) => setFormData({...formData, designation: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nodal Officer">Nodal Officer</SelectItem>
                        <SelectItem value="Deputy Nodal Officer">Deputy Nodal Officer</SelectItem>
                        <SelectItem value="Assistant Nodal Officer">Assistant Nodal Officer</SelectItem>
                        <SelectItem value="Senior Officer">Senior Officer</SelectItem>
                        <SelectItem value="Joint Director">Joint Director</SelectItem>
                        <SelectItem value="Deputy Director">Deputy Director</SelectItem>
                        <SelectItem value="Assistant Director">Assistant Director</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="e.g., Financial Crimes Division"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (years) *</Label>
                    <Input
                      id="experience"
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Years of experience"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="officeAddress">Office Address *</Label>
                  <Input
                    id="officeAddress"
                    type="text"
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({...formData, officeAddress: e.target.value})}
                    placeholder="Enter complete office address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      placeholder="Enter pincode"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="jurisdictionArea">Jurisdiction Area *</Label>
                  <Input
                    id="jurisdictionArea"
                    type="text"
                    value={formData.jurisdictionArea}
                    onChange={(e) => setFormData({...formData, jurisdictionArea: e.target.value})}
                    placeholder="e.g., All India, Mumbai Circle, Delhi NCR"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="idCard">Government ID Card *</Label>
                    <Input
                      id="idCard"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, idCard: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointmentLetter">Appointment Letter *</Label>
                    <Input
                      id="appointmentLetter"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, appointmentLetter: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorizationCertificate">Authorization Certificate *</Label>
                    <Input
                      id="authorizationCertificate"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({...formData, authorizationCertificate: e.target.files?.[0] || null})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </>
            )}

            {formData.role === 'VICTIM' && (
              <>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 
                (formData.role === 'VICTIM' ? 'Creating Account...' : 'Submitting Application...') : 
                (formData.role === 'VICTIM' ? 'Register' : 'Submit Application')
              }
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}