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
        formDataToSend.append('state', formData.state)
        formDataToSend.append('district', formData.district)
        formDataToSend.append('police_station', formData.police_station)
        formDataToSend.append('department', formData.department)
        formDataToSend.append('designation', formData.designation)
        formDataToSend.append('experience', formData.experience)
        formDataToSend.append('reason', 'Professional registration request')
        
        if (formData.id_card) formDataToSend.append('id_card', formData.id_card)
        if (formData.document) formDataToSend.append('document', formData.document)

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

            {(formData.role === 'BANK_OFFICER' || formData.role === 'NODAL_OFFICER') && (
              <>
                <div>
                  <Label htmlFor="department">Organization</Label>
                  <Input
                    id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter your organization"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder="Enter your designation"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="Years of experience"
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