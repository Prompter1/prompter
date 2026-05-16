import Image from 'next/image'
import Link from 'next/link'
import { Flame, Crown, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import { fetchTrendingPrompts, fetchTopCreators } from '@/src/lib/home-queries'

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default async function TrendingSection() {
  const [trendingPrompts, topCreators] = await Promise.all([
    fetchTrendingPrompts(),
    fetchTopCreators(),
  ])

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-8 lg:grid-cols-3">
        <Reveal
          variant="left"
          distance={40}
          duration={700}
          className="lg:col-span-2"
        >
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                급상승 프롬프트
              </h2>
            </div>

            <div className="space-y-3">
              {trendingPrompts.length === 0 ? (
                <p className="text-surface-300 text-sm">데이터가 없습니다.</p>
              ) : (
                trendingPrompts.map((prompt, idx) => (
                  <Reveal
                    key={prompt.id}
                    variant={idx % 2 === 0 ? 'up' : 'scale'}
                    delay={idx * 70}
                    distance={14}
                    duration={650}
                  >
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="group hover:border-brand-500/30 relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-60" />

                      <span className="mx-5 flex h-11 shrink-0 items-center justify-center text-2xl font-semibold text-white/50">
                        {idx + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <span className="text-surface-300 text-xs">
                          {prompt.category}
                        </span>
                        <h3 className="group-hover:text-brand-300 truncate font-medium text-white transition-colors">
                          {prompt.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-surface-300 text-xs">
                          {formatNumber(prompt.viewCount)} views
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            prompt.price === 0
                              ? 'text-emerald-400'
                              : 'text-brand-400'
                          }`}
                        >
                          {prompt.price === 0
                            ? '무료'
                            : `${prompt.price.toLocaleString()}P`}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))
              )}
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" distance={40} duration={700}>
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                인기 크리에이터
              </h2>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="space-y-3">
                {topCreators.length === 0 ? (
                  <p className="text-surface-300 text-sm">데이터가 없습니다.</p>
                ) : (
                  topCreators.map((creator, idx) => (
                    <Reveal
                      key={creator.id}
                      variant={idx % 2 === 0 ? 'scale' : 'up'}
                      delay={idx * 70}
                      distance={12}
                      duration={600}
                    >
                      <div className="group flex items-center gap-3 rounded-2xl p-2 transition-all duration-300 hover:bg-white/[0.06]">
                        <span
                          className={`text-sm font-bold ${
                            idx === 0
                              ? 'text-amber-400'
                              : idx === 1
                                ? 'text-surface-300'
                                : 'text-amber-700'
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                          <Image
                            src={creator.avatar}
                            alt={creator.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-white">
                              {creator.name}
                            </span>
                            {creator.isSponsor && (
                              <Crown className="h-3.5 w-3.5 text-amber-400" />
                            )}
                          </div>
                          <p className="text-surface-300 text-xs">
                            {creator.prompts} prompts • {creator.sales} sales
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>

              <a
                href="/prompt?sort=popular"
                className="text-brand-400 hover:text-brand-300 mt-5 flex items-center justify-center gap-1 text-sm font-medium transition-colors"
              >
                전체 랭킹 보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
