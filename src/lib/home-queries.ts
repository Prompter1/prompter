import { createSupabaseServerClient } from './supabase-server'
import type { PromptPost } from '@/types'

// ─── 인기 프롬프트 (sales_count 기준 상위 8개) ────────────────────────────
export async function fetchFeaturedPrompts(): Promise<PromptPost[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('prompt_posts')
    .select(
      `
      id, title, content, price, ai_types, ai_versions, categories,
      is_verified, result_media,
      author:members!author_id(id, nickname, avatar_url, points, is_sponsor)
    `
    )
    .order('sales_count', { ascending: false })
    .limit(8)

  if (error || !data) {
    console.error('fetchFeaturedPrompts:', error)
    return []
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    price: row.price,
    ai_types: row.ai_types ?? [],
    ai_versions: row.ai_versions ?? [],
    categories: row.categories ?? [],
    is_verified: row.is_verified,
    result_media: normalizeMedia(row.result_media),
    author: row.author,
  }))
}

// ─── 급상승 프롬프트 (view_count 최근 증가 기준 — 여기서는 view_count 상위) ──
export async function fetchTrendingPrompts(): Promise<
  {
    id: number
    title: string
    category: string
    price: number
    viewCount: number
  }[]
> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('prompt_posts')
    .select('id, title, ai_types, price, view_count')
    .order('view_count', { ascending: false })
    .limit(4)

  if (error || !data) {
    console.error('fetchTrendingPrompts:', error)
    return []
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.ai_types?.[0] ?? '기타',
    price: row.price,
    viewCount: row.view_count ?? 0,
  }))
}

// ─── 인기 크리에이터 (total_revenue 기준 상위 3명) ────────────────────────
export async function fetchTopCreators(): Promise<
  {
    id: string
    name: string
    avatar: string
    prompts: number
    sales: number
    isSponsor: boolean
  }[]
> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('members')
    .select('id, nickname, avatar_url, is_sponsor, total_revenue')
    .order('total_revenue', { ascending: false })
    .limit(3)

  if (error || !data) {
    console.error('fetchTopCreators:', error)
    return []
  }

  // 각 크리에이터의 프롬프트 수 + 판매 수 조회
  const results = await Promise.all(
    data.map(async (member: any) => {
      const { count: promptCount } = await supabase
        .from('prompt_posts')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', member.id)

      const { count: salesCount } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('seller_id', member.id)

      return {
        id: member.id,
        name: member.nickname ?? '이름 없음',
        avatar: member.avatar_url || '/images/default-avatar.png',
        prompts: promptCount ?? 0,
        sales: salesCount ?? 0,
        isSponsor: member.is_sponsor ?? false,
      }
    })
  )

  return results
}

// ─── 히어로 통계 (실시간) ────────────────────────────────────────────────
export async function fetchHeroStats(): Promise<{
  promptCount: number
  memberCount: number
  transactionCount: number
}> {
  const supabase = await createSupabaseServerClient()

  const [
    { count: promptCount },
    { count: memberCount },
    { count: transactionCount },
  ] = await Promise.all([
    supabase.from('prompt_posts').select('id', { count: 'exact', head: true }),
    supabase.from('members').select('id', { count: 'exact', head: true }),
    supabase.from('transactions').select('id', { count: 'exact', head: true }),
  ])

  return {
    promptCount: promptCount ?? 0,
    memberCount: memberCount ?? 0,
    transactionCount: transactionCount ?? 0,
  }
}

// ─── 카테고리별 프롬프트 수 ───────────────────────────────────────────────
export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('prompt_posts').select('ai_types')

  if (error || !data) return {}

  const counts: Record<string, number> = {}
  for (const row of data) {
    for (const type of row.ai_types ?? []) {
      counts[type] = (counts[type] ?? 0) + 1
    }
  }
  return counts
}

// ─── 유틸 ─────────────────────────────────────────────────────────────────
function normalizeMedia(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) =>
      typeof item === 'string' ? item : ((item as any)?.url ?? '')
    )
    .filter(Boolean)
}
