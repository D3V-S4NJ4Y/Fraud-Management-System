'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, X } from 'lucide-react'

interface FileUploadProps {
  complaintId: string
  onUploadSuccess?: (evidence: any) => void
}

export function FileUpload({ complaintId, onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('complaintId', complaintId)
      formData.append('description', description)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFile(null)
        setDescription('')
        onUploadSuccess?.(data.evidence)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium">Upload Evidence</h3>
      
      <div>
        <Label htmlFor="file">Select File</Label>
        <Input
          id="file"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.txt"
          onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPG, PNG, PDF, TXT (Max 10MB)
        </p>
      </div>

      {file && (
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
          <File className="h-4 w-4" />
          <span className="text-sm">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this evidence..."
          rows={3}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Evidence'}
      </Button>
    </div>
  )
}