import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Crown,
  Flame,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export const metadata: Metadata = {
  title: '랭킹 | PROMPTER',
  description: '가장 인기 있는 프롬프트와 크리에이터 랭킹을 확인하세요.',
}

async function fetchRankingData() {
  const supabase = await createSupabaseServerClient()

  const [topPromptsRes, topCreatorsRes, topViewsRes] = await Promise.all([
    // 판매 상위 프롬프트
    supabase
      .from('prompt_posts')
      .select(
        `id, title, price, ai_types, is_verified, sales_count, view_count,
         result_media,
         author:members!author_id(id, nickname, avatar_url, is_sponsor)`
      )
      .order('sales_count', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(12),

    // 수익 상위 크리에이터
    supabase
      .from('members')
      .select('id, nickname, avatar_url, is_sponsor, total_revenue')
      .order('total_revenue', { ascending: false })
      .limit(10),

    // 조회수 상위 프롬프트
    supabase
      .from('prompt_posts')
      .select(
        `id, title, price, ai_types, is_verified, sales_count, view_count,
         author:members!author_id(id, nickname, avatar_url, is_sponsor)`
      )
      .order('view_count', { ascending: false })
      .limit(10),
  ])

  return {
    topPrompts: (topPromptsRes.data ?? []) as any[],
    topCreators: (topCreatorsRes.data ?? []) as any[],
    topViews: (topViewsRes.data ?? []) as any[],
  }
}

const RANK_COLORS = ['text-amber-400', 'text-surface-300', 'text-amber-700']
const RANK_BG = [
  'bg-amber-500/15 border-amber-500/30',
  'bg-surface-700/30 border-surface-600/30',
  'bg-amber-700/15 border-amber-700/30',
]

export default async function RankingPage() {
  const { topPrompts, topCreators, topViews } = await fetchRankingData()

  return (
    <>
      <Navbar />
      <main className="bg-surface-900 min-h-screen pt-24 pb-20 text-white">
        {/* 헤더 */}
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-64 w-150 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">
                PROMPTER 랭킹
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              이번 주 인기 차트
            </h1>
            <p className="text-surface-400 mt-3 text-sm">
              판매량, 조회수, 수익 기준으로 집계된 실시간 랭킹입니다.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── 판매 TOP 10 ── */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold">판매 TOP 10</h2>
              </div>
              <div className="space-y-2">
                {topPrompts.length === 0 ? (
                  <EmptyRanking label="판매 데이터" />
                ) : (
                  topPrompts.map((p, idx) => (
                    <PromptRankCard
                      key={p.id}
                      rank={idx + 1}
                      prompt={p}
                      metric={`${(p.sales_count ?? 0).toLocaleString()} 판매`}
                      metricColor="text-emerald-400"
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── 조회 TOP 10 ── */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <h2 className="text-lg font-bold">조회 TOP 10</h2>
              </div>
              <div className="space-y-2">
                {topViews.length === 0 ? (
                  <EmptyRanking label="조회 데이터" />
                ) : (
                  topViews.map((p, idx) => (
                    <PromptRankCard
                      key={p.id}
                      rank={idx + 1}
                      prompt={p}
                      metric={`${(p.view_count ?? 0).toLocaleString()} 조회`}
                      metricColor="text-orange-400"
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── 크리에이터 TOP 10 ── */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp className="text-brand-400 h-5 w-5" />
                <h2 className="text-lg font-bold">크리에이터 TOP 10</h2>
              </div>
              <div className="space-y-2">
                {topCreators.length === 0 ? (
                  <EmptyRanking label="크리에이터 데이터" />
                ) : (
                  topCreators.map((creator, idx) => (
                    <CreatorRankCard
                      key={creator.id}
                      rank={idx + 1}
                      creator={creator}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// ── 서브 컴포넌트들 ──────────────────────────────────────

function EmptyRanking({ label }: Readonly<{ label: string }>) {
  return (
    <div className="border-surface-700 bg-surface-800/30 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed">
      <Sparkles className="text-surface-600 mb-2 h-7 w-7" />
      <p className="text-surface-500 text-sm">{label}가 없습니다.</p>
    </div>
  )
}

function PromptRankCard({
  rank,
  prompt,
  metric,
  metricColor,
}: Readonly<{
  rank: number
  prompt: any
  metric: string
  metricColor: string
}>) {
  const rankColorClass = rank <= 3 ? RANK_COLORS[rank - 1] : 'text-surface-500'
  const rankBgClass =
    rank <= 3 ? RANK_BG[rank - 1] : 'bg-surface-800/40 border-surface-700/40'

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/60 flex items-center gap-3 rounded-xl border p-3 transition-all"
    >
      {/* 순위 */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${rankBgClass} ${rankColorClass}`}
      >
        {rank <= 3 ? <Crown className="h-4 w-4" /> : rank}
      </div>

      {/* 정보 */}
      <div className="min-w-0 flex-1">
        <p className="group-hover:text-brand-400 line-clamp-1 text-sm font-medium text-white transition-colors">
          {prompt.title}
        </p>
        <div className="text-surface-500 flex items-center gap-1.5 text-xs">
          {prompt.ai_types?.[0] && (
            <span className="bg-surface-700/50 rounded-full px-2 py-0.5">
              {prompt.ai_types[0]}
            </span>
          )}
          {prompt.is_verified && (
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
          )}
        </div>
      </div>

      {/* 지표 */}
      <div className="text-right">
        <p className={`text-xs font-semibold ${metricColor}`}>{metric}</p>
        <p className="text-surface-500 text-xs">
          {prompt.price === 0 ? '무료' : `${prompt.price.toLocaleString()}P`}
        </p>
      </div>
    </Link>
  )
}

function CreatorRankCard({
  rank,
  creator,
}: Readonly<{ rank: number; creator: any }>) {
  const rankColorClass = rank <= 3 ? RANK_COLORS[rank - 1] : 'text-surface-500'
  const rankBgClass =
    rank <= 3 ? RANK_BG[rank - 1] : 'bg-surface-800/40 border-surface-700/40'

  return (
    <Link
      href={`/user/${creator.id}`}
      className="group border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/60 flex items-center gap-3 rounded-xl border p-3 transition-all"
    >
      {/* 순위 */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${rankBgClass} ${rankColorClass}`}
      >
        {rank <= 3 ? <Crown className="h-4 w-4" /> : rank}
      </div>

      {/* 아바타 */}
      <div className="border-surface-600 relative h-9 w-9 shrink-0 overflow-hidden rounded-full border">
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.nickname}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <div className="from-brand-400 to-brand-600 flex h-full w-full items-center justify-center bg-linear-to-br">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* 이름 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="group-hover:text-brand-400 line-clamp-1 text-sm font-medium text-white transition-colors">
            {creator.nickname}
          </p>
          {creator.is_sponsor && (
            <Crown className="h-3 w-3 shrink-0 text-amber-400" />
          )}
        </div>
      </div>

      {/* 수익 */}
      <div className="text-right">
        <p className="text-brand-400 text-xs font-semibold">
          {(creator.total_revenue ?? 0).toLocaleString()}P
        </p>
        <p className="text-surface-500 text-xs">누적 수익</p>
      </div>
    </Link>
  )
}
