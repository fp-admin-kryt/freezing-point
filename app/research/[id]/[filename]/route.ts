import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BUCKET = 'pdfs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; filename: string } }
) {
  const { id, filename } = params

  if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Not found', { status: 404 })
  }

  const path = `research/${id}/${decodeURIComponent(filename)}`

  const { data, error } = await supabase.storage.from(BUCKET).download(path)

  if (error || !data) {
    return new NextResponse('Not found', { status: 404 })
  }

  const bytes = await data.arrayBuffer()

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
