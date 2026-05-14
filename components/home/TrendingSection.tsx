import Image from 'next/image'
import Link from 'next/link'
import { Flame, Crown, ArrowRight } from 'lucide-react'
import { fetchTrendingPrompts, fetchTopCreators } from '@/src/lib/home-queries'

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default async function TrendingSection() {
  const [trendingPrompts] = await Promise.all([
    fetchTrendingPrompts(),
    fetchTopCreators(),
  ])

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* 중앙 정렬 wrapper */}
      <div className="flex flex-col items-center">
        {/* 제목 */}
        <div className="mb-6 flex items-center justify-center gap-2 text-center">
          <Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            급상승 프롬프트
          </h2>
        </div>

        {/* 카드 영역 */}
        <div className="w-full max-w-2xl space-y-3">
          {trendingPrompts.length === 0 ? (
            <p className="text-surface-300 text-center text-sm">
              데이터가 없습니다.
            </p>
          ) : (
            trendingPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompt/${prompt.id}`}
                className="group hover:border-brand-500/30 relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.04] hover:shadow-[0_15px_50px_rgba(0,0,0,0.45)]"
              >
                {/* glass highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="min-w-0 flex-1">
                  <span className="text-surface-300 text-xs sm:text-sm">
                    {prompt.category}
                  </span>
                  <h3 className="group-hover:text-brand-300 truncate text-base font-semibold text-white transition-colors sm:text-lg">
                    {prompt.title}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-surface-300 text-xs sm:text-sm">
                    {formatNumber(prompt.viewCount)} views
                  </p>
                  <p
                    className={`text-sm font-bold sm:text-base ${
                      prompt.price === 0 ? 'text-emerald-400' : 'text-brand-400'
                    }`}
                  >
                    {prompt.price === 0
                      ? '무료'
                      : `${prompt.price.toLocaleString()}P`}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
