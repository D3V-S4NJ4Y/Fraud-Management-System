'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Shield className="h-20 w-20 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Odisha Police Cyber Fraud Support System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Comprehensive victim support and tracking system for cyber fraud cases
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <UserPlus className="h-6 w-6" />
                <span>New User</span>
              </CardTitle>
              <CardDescription>Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full" size="lg">
                  Register Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <LogIn className="h-6 w-6" />
                <span>Existing User</span>
              </CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button variant="outline" className="w-full" size="lg">
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-sm text-gray-500">
          <p>Emergency Helpline: <strong>1930</strong> | Email: cyber@odishapolice.gov.in</p>
        </div>
      </div>
    </div>
  )
}