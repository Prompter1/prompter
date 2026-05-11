import type { PromptPost } from '@/types'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { getRankedAiTools } from '@/src/lib/taxonomy'

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
  view_count?: number | null
  sales_count?: number | null
  author: {
    id: string
    nickname: string
    avatar_url: string
    points: number
    is_sponsor: boolean
  } | null
}

export type PromptSort = 'latest' | 'popular' | 'views'

export type PromptExploreParams = {
  q?: string
  ai?: string
  version?: string
  category?: string
  verified?: boolean
  sort?: PromptSort
}

export type PromptExploreResult = {
  prompts: PromptPost[]
  aiRankings: ReturnType<typeof getRankedAiTools>
  categories: { name: string; count: number }[]
  versions: { name: string; count: number }[]
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
      id, title, content, price, ai_types, ai_versions, categories, is_verified, result_media, created_at, view_count, sales_count,
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
    ai_versions: row.ai_versions ?? [],
    categories: row.categories ?? [],
    author: row.author,
    is_verified: row.is_verified,
    result_media: normalizeResultMedia(row.result_media),
    view_count: row.view_count ?? 0,
    sales_count: row.sales_count ?? 0,
    created_at: row.created_at,
  }

  return {
    post,
    createdAt: row.created_at,
  }
}

function countArrayValues(
  rows: unknown[],
  key: string
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const value = row && typeof row === 'object' ? (row as any)[key] : null
    if (!Array.isArray(value)) continue
    for (const item of value) {
      if (typeof item !== 'string' || item.trim() === '') continue
      counts[item] = (counts[item] ?? 0) + 1
    }
  }
  return counts
}

function toCountList(counts: Record<string, number>) {
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

function sanitizeSearch(value: string) {
  return value.replace(/[,%]/g, ' ').trim()
}

function mapPromptRow(row: any): PromptPost {
  return {
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
    created_at: row.created_at ?? null,
  }
}

export async function fetchPromptExplore(
  params: PromptExploreParams
): Promise<PromptExploreResult> {
  const supabase = await createSupabaseServerClient()

  const { data: facetRows } = await supabase
    .from('prompt_posts')
    .select('ai_types, ai_versions, categories')

  const aiCounts = countArrayValues(facetRows ?? [], 'ai_types')
  const categoryCounts = countArrayValues(facetRows ?? [], 'categories')
  const versionCounts = countArrayValues(facetRows ?? [], 'ai_versions')

  let query = supabase.from('prompt_posts').select(`
    id, title, content, price, ai_types, ai_versions, categories,
    is_verified, result_media, created_at, view_count, sales_count,
    author:members!author_id(id, nickname, avatar_url, points, is_sponsor)
  `)

  const search = params.q ? sanitizeSearch(params.q) : ''
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }
  if (params.ai) query = query.contains('ai_types', [params.ai])
  if (params.version) query = query.contains('ai_versions', [params.version])
  if (params.category) query = query.contains('categories', [params.category])
  if (params.verified) query = query.eq('is_verified', true)

  if (params.sort === 'popular') {
    query = query.order('sales_count', { ascending: false })
  } else if (params.sort === 'views') {
    query = query.order('view_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(48)

  if (error || !data) {
    console.error('fetchPromptExplore:', error)
    return {
      prompts: [],
      aiRankings: getRankedAiTools(aiCounts),
      categories: toCountList(categoryCounts),
      versions: toCountList(versionCounts),
    }
  }

  return {
    prompts: data.map(mapPromptRow),
    aiRankings: getRankedAiTools(aiCounts),
    categories: toCountList(categoryCounts),
    versions: toCountList(versionCounts),
  }
}
