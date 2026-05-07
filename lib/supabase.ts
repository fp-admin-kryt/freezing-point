import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BUCKET = 'pdfs'

export const uploadPdfToSupabase = async (file: File, postSlug: string): Promise<string> => {
  const path = `research/${postSlug}/${file.name}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: 'application/pdf',
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export const deletePdfFromSupabase = async (url: string): Promise<void> => {
  try {
    const marker = `/object/public/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = decodeURIComponent(url.slice(idx + marker.length))
    await supabase.storage.from(BUCKET).remove([path])
  } catch (err) {
    console.warn('Supabase PDF delete skipped:', err)
  }
}
