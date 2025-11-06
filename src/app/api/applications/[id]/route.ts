import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ application })
  } catch (error) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
}