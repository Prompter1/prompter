import { createSupabaseServerClient } from './supabase-server'
import type { PromptPost } from '@/types'

// ─── 인기 프롬프트 (prompt_rankings 캐시 테이블 기준) ──────────────────────
export async function fetchFeaturedPrompts(): Promise<
  (PromptPost & { is_adult?: boolean })[]
> {
  const supabase = await createSupabaseServerClient()

  // 1차: 사전 계산된 순위 테이블에서 읽기 (정렬 없음)
  const { data: rankings, error: rankErr } = await supabase
    .from('prompt_rankings')
    .select('rank, prompt_post_id')
    .order('rank', { ascending: true })

  if (!rankErr && rankings && rankings.length > 0) {
    const ids = rankings.map((r: any) => r.prompt_post_id)

    const { data: posts, error: postsErr } = await supabase
      .from('prompt_posts')
      .select(
        `id, title, content, price, ai_types, ai_versions, categories,
         is_verified, is_adult, result_media,
         author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
      )
      .in('id', ids)

    if (!postsErr && posts) {
      // 순위 테이블 순서대로 재정렬
      const postMap = new Map(posts.map((p: any) => [p.id, p]))
      return ids
        .map((id: number) => postMap.get(id))
        .filter(Boolean)
        .map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          price: row.price,
          ai_types: row.ai_types ?? [],
          ai_versions: row.ai_versions ?? [],
          categories: row.categories ?? [],
          is_verified: row.is_verified,
          is_adult: Boolean(row.is_adult),
          result_media: normalizeMedia(row.result_media),
          author: row.author,
        }))
    }
  }

  // 2차 폴백: 순위 테이블이 비었을 때 직접 정렬
  const { data, error } = await supabase
    .from('prompt_posts')
    .select(
      `id, title, content, price, ai_types, ai_versions, categories,
       is_verified, is_adult, result_media,
       author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
    )
    .order('is_verified', { ascending: false })
    .order('sales_count', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(12)

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
    is_adult: Boolean(row.is_adult),
    result_media: normalizeMedia(row.result_media),
    author: row.author,
  }))
}

// ─── 급상승 프롬프트 (view_count 상위) ──
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
