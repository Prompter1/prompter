import type { PromptPost } from '@/types'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export function normalizeResultMedia(result_media: unknown): string[] {
  if (!Array.isArray(result_media)) return []
  const urls: string[] = []
  for (const item of result_media) {
    if (typeof item === 'string') {
      urls.push(item)
    } else if (
      item &&
      typeof item === 'object' &&
      'url' in item &&
      typeof (item as { url: unknown }).url === 'string'
    ) {
      urls.push((item as { url: string }).url)
    }
  }
  return urls
}

type PromptRow = {
  id: number
  title: string
  content: string
  price: number
  ai_types: string[] | null
  categories: string[] | null
  is_verified: boolean
  result_media: unknown
  created_at: string | null
  author: {
    id: string
    nickname: string
    avatar_url: string
    points: number
    is_sponsor: boolean
  } | null
}

export async function fetchPromptPostById(
  rawId: string
): Promise<{ post: PromptPost; createdAt: string | null } | null> {
  const id = Number.parseInt(rawId, 10)
  if (!Number.isFinite(id) || id < 1) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('prompt_posts')
    .select(
      `
      id, title, content, price, ai_types, categories, is_verified, result_media, created_at,
      author:members!author_id(id, nickname, avatar_url, points, is_sponsor)
    `
    )
    .eq('id', id)
    .single()

  if (error || !data) return null

  const row = data as unknown as PromptRow
  if (!row.author) return null

  const post: PromptPost = {
    id: row.id,
    title: row.title,
    content: row.content,
    price: row.price,
    ai_types: row.ai_types ?? [],
    categories: row.categories ?? [],
    author: row.author,
    is_verified: row.is_verified,
    result_media: normalizeResultMedia(row.result_media),
  }

  return {
    post,
    createdAt: row.created_at,
  }
}
