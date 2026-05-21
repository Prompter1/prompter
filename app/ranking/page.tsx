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
  Trophy,
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
    supabase
      .from('prompt_posts')
      .select(
        `id, title, price, ai_types, is_verified, sales_count, view_count,
         author:members!author_id(id, nickname, avatar_url, is_sponsor)`
      )
      .order('sales_count', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(10),

    supabase
      .from('members')
      .select('id, nickname, avatar_url, is_sponsor, total_revenue')
      .order('total_revenue', { ascending: false })
      .limit(10),

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

const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-amber-700']
const RANK_BG = [
  'bg-amber-500/15 border-amber-500/30',
  'bg-slate-600/30 border-slate-500/30',
  'bg-amber-700/15 border-amber-700/30',
]

export default async function RankingPage() {
  const { topPrompts, topCreators, topViews } = await fetchRankingData()

  const top3 = topCreators.slice(0, 3)
  const rest = topCreators.slice(3)

  // 시상대 순서: 2위(왼쪽), 1위(가운데), 3위(오른쪽)
  const podium = [top3[1], top3[0], top3[2]]

  const podiumConfig = [
    {
      rank: 2,
      baseH: 'h-24',
      avatarSize: 'h-16 w-16',
      borderColor: 'border-slate-400/60',
      baseColor: 'bg-slate-600/30 border-slate-400/40',
      rankColor: 'text-slate-300',
      revenueColor: 'text-slate-400',
      textSize: 'text-sm',
    },
    {
      rank: 1,
      baseH: 'h-36',
      avatarSize: 'h-24 w-24',
      borderColor: 'border-amber-400',
      baseColor: 'bg-amber-500/20 border-amber-400/50',
      rankColor: 'text-amber-400',
      revenueColor: 'text-amber-400',
      textSize: 'text-base',
      showCrown: true,
    },
    {
      rank: 3,
      baseH: 'h-16',
      avatarSize: 'h-14 w-14',
      borderColor: 'border-amber-700/60',
      baseColor: 'bg-amber-700/20 border-amber-700/40',
      rankColor: 'text-amber-700',
      revenueColor: 'text-amber-700/80',
      textSize: 'text-sm',
    },
  ]

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

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">

          {/* ── 크리에이터 TOP 10 ── */}
          <section className="mb-20">
            <div className="mb-10 flex items-center gap-3">
              <Trophy className="h-7 w-7 text-amber-400" />
              <h2 className="text-3xl font-extrabold tracking-tight">크리에이터 TOP 10</h2>
            </div>

            {topCreators.length === 0 ? (
              <EmptyRanking label="크리에이터 데이터" />
            ) : (
              <>
                {/* 시상대 */}
                <div className="mb-10 flex items-end justify-center gap-3">
                  {podium.map((creator, i) => {
                    if (!creator) return null
                    const cfg = podiumConfig[i]
                    return (
                      <Link
                        key={creator.id}
                        href={`/user/${creator.id}`}
                        className="group flex w-36 flex-col items-center"
                      >
                        {/* 아바타 + 정보 */}
                        <div className="mb-3 flex flex-col items-center gap-1.5 px-1 text-center">
                          {cfg.showCrown && (
                            <Crown className="mb-1 h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                          )}
                          <div
                            className={`relative overflow-hidden rounded-full border-2 ${cfg.avatarSize} ${cfg.borderColor} shrink-0`}
                          >
                            {creator.avatar_url ? (
                              <Image
                                src={creator.avatar_url}
                                alt={creator.nickname}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="from-brand-400 to-brand-600 flex h-full w-full items-center justify-center bg-linear-to-br">
                                <User className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <p className={`font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 w-full ${cfg.textSize}`}>
                            {creator.nickname}
                          </p>
                          <p className={`text-xs font-semibold ${cfg.revenueColor}`}>
                            {(creator.total_revenue ?? 0).toLocaleString()}P
                          </p>
                        </div>

                        {/* 시상대 기둥 */}
                        <div
                          className={`flex w-full items-center justify-center rounded-t-2xl border-t-2 ${cfg.baseH} ${cfg.baseColor}`}
                        >
                          <span className={`text-3xl font-black ${cfg.rankColor}`}>
                            {cfg.rank}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* 4위 ~ 10위 */}
                {rest.length > 0 && (
                  <div className="space-y-2">
                    {rest.map((creator, idx) => (
                      <CreatorRankCard
                        key={creator.id}
                        rank={idx + 4}
                        creator={creator}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* ── 판매 TOP 10 ── */}
          <section className="mb-20">
            <div className="mb-6 flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-emerald-400" />
              <h2 className="text-3xl font-extrabold tracking-tight">판매 TOP 10</h2>
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
          </section>

          {/* ── 조회 TOP 10 ── */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-400" />
              <h2 className="text-3xl font-extrabold tracking-tight">조회 TOP 10</h2>
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
          </section>

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
      className="group border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/60 flex items-center gap-4 rounded-2xl border p-4 transition-all"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${rankBgClass} ${rankColorClass}`}
      >
        {rank <= 3 ? <Crown className="h-4 w-4" /> : rank}
      </div>

      <div className="min-w-0 flex-1">
        <p className="group-hover:text-brand-400 line-clamp-1 text-sm font-semibold text-white transition-colors">
          {prompt.title}
        </p>
        <div className="text-surface-500 mt-0.5 flex items-center gap-1.5 text-xs">
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

      <div className="shrink-0 text-right">
        <p className={`text-sm font-semibold ${metricColor}`}>{metric}</p>
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
  return (
    <Link
      href={`/user/${creator.id}`}
      className="group border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/60 flex items-center gap-4 rounded-2xl border p-4 transition-all"
    >
      <div className="bg-surface-800/40 border-surface-700/40 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold text-surface-400">
        {rank}
      </div>

      <div className="border-surface-600 relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.nickname}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="from-brand-400 to-brand-600 flex h-full w-full items-center justify-center bg-linear-to-br">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="group-hover:text-brand-400 line-clamp-1 text-sm font-semibold text-white transition-colors">
            {creator.nickname}
          </p>
          {creator.is_sponsor && (
            <Crown className="h-3 w-3 shrink-0 text-amber-400" />
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-brand-400 text-sm font-semibold">
          {(creator.total_revenue ?? 0).toLocaleString()}P
        </p>
        <p className="text-surface-500 text-xs">누적 수익</p>
      </div>
    </Link>
  )
}
