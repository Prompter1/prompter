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
  is_adult: boolean | null
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
       is_verified, is_adult, result_media, created_at, view_count, sales_count,
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
    is_adult: Boolean(row.is_adult),
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

  // ── 메인 프롬프트 쿼리 (모든 필터 적용) ──────────────────────────────────
  let mainQ = supabase.from('prompt_posts').select(
    `id, title, content, price, ai_types, ai_versions, categories,
       is_verified, is_adult, result_media, view_count, sales_count,
       author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
  )
  if (q) mainQ = mainQ.ilike('title', `%${q}%`)
  if (ai) mainQ = mainQ.contains('ai_types', [ai])
  if (version) mainQ = mainQ.contains('ai_versions', [version])
  if (category) mainQ = mainQ.contains('categories', [category])
  if (verified) mainQ = mainQ.eq('is_verified', true)
  if (sort === 'popular')
    mainQ = mainQ
      .order('is_verified', { ascending: false })
      .order('sales_count', { ascending: false })
      .order('view_count', { ascending: false })
  else if (sort === 'views')
    mainQ = mainQ.order('view_count', { ascending: false })
  else mainQ = mainQ.order('created_at', { ascending: false })

  // ── 카테고리 카운트 쿼리: category 제외한 나머지 필터 적용 ──────────────
  let catQ = supabase.from('prompt_posts').select('categories')
  if (q) catQ = catQ.ilike('title', `%${q}%`)
  if (ai) catQ = catQ.contains('ai_types', [ai])
  if (version) catQ = catQ.contains('ai_versions', [version])
  if (verified) catQ = catQ.eq('is_verified', true)

  // ── 버전 카운트 쿼리: version 제외한 나머지 필터 적용 ─────────────────────
  let verQ = supabase.from('prompt_posts').select('ai_versions')
  if (q) verQ = verQ.ilike('title', `%${q}%`)
  if (ai) verQ = verQ.contains('ai_types', [ai])
  if (category) verQ = verQ.contains('categories', [category])
  if (verified) verQ = verQ.eq('is_verified', true)

  // ── AI 랭킹 카운트: 필터 없이 전체 기준 (사이드바 순위) ──────────────────
  const aiQ = supabase.from('prompt_posts').select('ai_types')

  const [mainRes, catRes, verRes, aiRes] = await Promise.all([
    mainQ.limit(60),
    catQ,
    verQ,
    aiQ,
  ])

  if (mainRes.error || !mainRes.data)
    return { prompts: [], aiRankings: [], categories: [], versions: [] }

  const rows = mainRes.data as unknown as PromptRow[]

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
      is_adult: Boolean(r.is_adult),
      result_media: normalizeResultMedia(r.result_media),
      view_count: r.view_count ?? 0,
      sales_count: r.sales_count ?? 0,
    }))

  // ── 집계 ─────────────────────────────────────────────────────────────────
  const catCount: Record<string, number> = {}
  for (const row of catRes.data ?? [])
    for (const c of (row as any).categories ?? [])
      catCount[c] = (catCount[c] ?? 0) + 1

  const verCount: Record<string, number> = {}
  for (const row of verRes.data ?? [])
    for (const v of (row as any).ai_versions ?? [])
      verCount[v] = (verCount[v] ?? 0) + 1

  const aiCount: Record<string, number> = {}
  for (const row of aiRes.data ?? [])
    for (const t of (row as any).ai_types ?? [])
      aiCount[t] = (aiCount[t] ?? 0) + 1

  const toRanking = (obj: Record<string, number>) =>
    Object.entries(obj)
      .map(([name, count]) => ({ name, count }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)

  return {
    prompts,
    aiRankings: toRanking(aiCount),
    categories: toRanking(catCount),
    versions: toRanking(verCount),
  }
}
