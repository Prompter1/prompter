import type { MetadataRoute } from 'next'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/explore`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.95,
  },
  {
    url: `${SITE_URL}/prompt`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.95,
  },
  {
    url: `${SITE_URL}/ranking`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  },
  {
    url: `${SITE_URL}/sell`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  },
  {
    url: `${SITE_URL}/login`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${SITE_URL}/footer/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${SITE_URL}/footer/faq`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.45,
  },
  {
    url: `${SITE_URL}/footer/terms`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/footer/privacy`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/footer/refund`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/footer/seller-policy`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/footer/delivery`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/footer/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.35,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createSupabaseAdminClient()

    // 검증된 프롬프트 상세 페이지
    const { data: posts } = await supabase
      .from('prompt_posts')
      .select('id, updated_at')
      .eq('is_verified', true)
      .order('updated_at', { ascending: false })
      .limit(5000)

    const promptPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${SITE_URL}/prompt/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 검증된 프롬프트가 있는 크리에이터 프로필 페이지
    const { data: authorRows } = await supabase
      .from('prompt_posts')
      .select('author_id, updated_at')
      .eq('is_verified', true)
      .order('updated_at', { ascending: false })

    // author_id 중복 제거 (가장 최근 updated_at 유지)
    const authorMap = new Map<string, Date>()
    for (const row of authorRows ?? []) {
      if (!authorMap.has(row.author_id)) {
        authorMap.set(row.author_id, new Date(row.updated_at))
      }
    }

    const userPages: MetadataRoute.Sitemap = Array.from(authorMap.entries()).map(
      ([userId, lastModified]) => ({
        url: `${SITE_URL}/user/${userId}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    )

    return [...STATIC_PAGES, ...promptPages, ...userPages]
  } catch {
    // DB 연결 실패 시 정적 페이지만 반환
    return STATIC_PAGES
  }
}
