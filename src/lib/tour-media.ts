import { supabase } from '@/lib/supabase'

function isAbsoluteUrl(value: string) {
  return /^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')
}

export function getTourMediaUrl(rawUrl?: string | null) {
  const normalizedUrl = rawUrl?.trim()

  if (!normalizedUrl) return ''
  if (isAbsoluteUrl(normalizedUrl)) return normalizedUrl

  const cleanPath = normalizedUrl.replace(/^\/+/, '')

  let bucket = 'tours'
  let path = cleanPath

  if (cleanPath.startsWith('tours/')) {
    path = cleanPath.replace(/^tours\//, '')
  } else if (cleanPath.startsWith('tour-media/')) {
    bucket = 'tour-media'
    path = cleanPath.replace(/^tour-media\//, '')
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
