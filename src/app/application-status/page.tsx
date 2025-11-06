'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  application_id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

function ApplicationStatusContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get('id')
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (applicationId) {
      fetchApplication()
    }
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`)
      const data = await response.json()
      setApplication(data.application)
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-8 w-8 text-yellow-600" />
      case 'APPROVED':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-8 w-8 text-red-600" />
      default:
        return <FileText className="h-8 w-8 text-gray-600" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Your application is under review. Please wait while we verify your documents and information.'
      case 'APPROVED':
        return 'Congratulations! Your application has been approved. You can now login to access your dashboard.'
      case 'REJECTED':
        return 'Your application has been rejected. Please contact admin for more information.'
      default:
        return 'Application status unknown.'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading application status...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-4">The application ID you provided could not be found.</p>
            <Link href="/register" className="text-blue-600 hover:underline">
              Submit New Application
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getStatusIcon(application.status)}
        </div>
        <CardTitle className="text-2xl">Application Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Badge 
            variant={
              application.status === 'APPROVED' ? 'default' :
              application.status === 'REJECTED' ? 'destructive' : 'secondary'
            }
            className="text-lg px-4 py-2"
          >
            {application.status}
          </Badge>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Application Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Application ID:</span>
              <p>{application.application_id}</p>
            </div>
            <div>
              <span className="font-medium">Name:</span>
              <p>{application.name}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p>{application.email}</p>
            </div>
            <div>
              <span className="font-medium">Role:</span>
              <p>{application.role.replace('_', ' ')}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Submitted:</span>
              <p>{new Date(application.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800">Status Information</h3>
          <p className="text-blue-700">{getStatusMessage(application.status)}</p>
        </div>

        {application.status === 'APPROVED' && (
          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          <p>For any queries, contact admin at admin@gmail.com</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ApplicationStatus() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading application status...</p>
        </div>
      }>
        <ApplicationStatusContent />
      </Suspense>
    </div>
  )
}