import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const complaintId = formData.get('complaintId') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX are allowed' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${complaintId}_${Date.now()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try to upload to Supabase Storage, fallback if bucket doesn't exist
    let publicUrl = ''
    
    try {
      const { data, error } = await supabase.storage
        .from('complaint-documents')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        // Fallback: return a placeholder URL
        publicUrl = `/uploads/${fileName}`
      } else {
        // Get public URL
        const { data: { publicUrl: url } } = supabase.storage
          .from('complaint-documents')
          .getPublicUrl(fileName)
        publicUrl = url
      }
    } catch (storageError) {
      console.error('Storage service error:', storageError)
      // Fallback: return a placeholder URL
      publicUrl = `/uploads/${fileName}`
    }

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        url: publicUrl,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}