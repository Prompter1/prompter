import type { PromptPost } from '@/types'
import { createSupabaseServerClient } from './supabase-server'

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
  ai_versions: string[] | null
  categories: string[] | null
  is_verified: boolean
  result_media: unknown
  created_at: string | null
  view_count: number | null
  sales_count: number | null
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
      `id, title, content, price, ai_types, ai_versions, categories,
       is_verified, result_media, created_at, view_count, sales_count,
       author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
    )
    .eq('id', id)
    .single()

  if (error || !data) return null

  // 조회수 증가 (비동기 fire-and-forget)
  supabase.rpc('increment_view_count', { post_id: id }).then(() => {})

  const row = data as unknown as PromptRow
  if (!row.author) return null

  const post: PromptPost = {
    id: row.id,
    title: row.title,
    content: row.content,
    price: row.price,
    ai_types: row.ai_types ?? [],
    ai_versions: row.ai_versions ?? [],
    categories: row.categories ?? [],
    author: row.author,
    is_verified: row.is_verified,
    result_media: normalizeResultMedia(row.result_media),
    view_count: row.view_count ?? 0,
    sales_count: row.sales_count ?? 0,
  }

  return { post, createdAt: row.created_at }
}

// ── 탐색 페이지용 ───────────────────────────────────────────────────────────
export type PromptSort = 'latest' | 'popular' | 'views'

export async function fetchPromptExplore({
  q = '',
  ai = '',
  version = '',
  category = '',
  sort = 'latest',
  verified = false,
}: {
  q?: string
  ai?: string
  version?: string
  category?: string
  sort?: PromptSort
  verified?: boolean
}): Promise<{
  prompts: PromptPost[]
  aiRankings: { name: string; count: number }[]
  categories: { name: string; count: number }[]
  versions: { name: string; count: number }[]
}> {
  const supabase = await createSupabaseServerClient()

  let query = supabase.from('prompt_posts').select(
    `id, title, content, price, ai_types, ai_versions, categories,
       is_verified, result_media, view_count, sales_count,
       author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
  )

  if (q) query = query.ilike('title', `%${q}%`)
  if (ai) query = query.contains('ai_types', [ai])
  if (version) query = query.contains('ai_versions', [version])
  if (category) query = query.contains('categories', [category])
  if (verified) query = query.eq('is_verified', true)

  if (sort === 'popular')
    query = query.order('sales_count', { ascending: false })
  else if (sort === 'views')
    query = query.order('view_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, error } = await query.limit(60)
  if (error || !data)
    return { prompts: [], aiRankings: [], categories: [], versions: [] }

  const rows = data as unknown as PromptRow[]

  const prompts: PromptPost[] = rows
    .filter((r) => r.author)
    .map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      price: r.price,
      ai_types: r.ai_types ?? [],
      ai_versions: r.ai_versions ?? [],
      categories: r.categories ?? [],
      author: r.author!,
      is_verified: r.is_verified,
      result_media: normalizeResultMedia(r.result_media),
      view_count: r.view_count ?? 0,
      sales_count: r.sales_count ?? 0,
    }))

  // 필터 집계 — 전체 데이터 기준
  const { data: allData } = await supabase
    .from('prompt_posts')
    .select('ai_types, ai_versions, categories')

  const aiCount: Record<string, number> = {}
  const catCount: Record<string, number> = {}
  const verCount: Record<string, number> = {}

  for (const row of allData ?? []) {
    for (const t of row.ai_types ?? []) aiCount[t] = (aiCount[t] ?? 0) + 1
    for (const c of row.categories ?? []) catCount[c] = (catCount[c] ?? 0) + 1
    for (const v of row.ai_versions ?? []) verCount[v] = (verCount[v] ?? 0) + 1
  }

  const toRanking = (obj: Record<string, number>) =>
    Object.entries(obj)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

  return {
    prompts,
    aiRankings: toRanking(aiCount),
    categories: toRanking(catCount),
    versions: toRanking(verCount),
  }
}
