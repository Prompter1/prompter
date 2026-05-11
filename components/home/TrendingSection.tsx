import Image from 'next/image'
import Link from 'next/link'
import { Flame, Crown, ArrowRight } from 'lucide-react'
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
        {/* 급상승 프롬프트 */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white">급상승 프롬프트</h2>
          </div>
          <div className="space-y-3">
            {trendingPrompts.length === 0 ? (
              <p className="text-surface-500 text-sm">데이터가 없습니다.</p>
            ) : (
              trendingPrompts.map((prompt, idx) => (
                <Link
                  key={prompt.id}
                  href={`/prompt/${prompt.id}`}
                  className="group border-surface-700/50 bg-surface-800/30 hover:border-surface-600 hover:bg-surface-800/50 flex items-center gap-4 rounded-2xl border p-4 transition-all"
                >
                  <span className="bg-surface-700/50 text-surface-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-surface-500 text-xs">
                      {prompt.category}
                    </span>
                    <h3 className="group-hover:text-brand-400 truncate font-medium text-white">
                      {prompt.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-surface-500 text-xs">
                      {formatNumber(prompt.viewCount)} views
                    </p>
                    <p
                      className={`text-sm font-bold ${prompt.price === 0 ? 'text-emerald-400' : 'text-brand-400'}`}
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

        {/* 인기 크리에이터 */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">인기 크리에이터</h2>
          </div>
          <div className="border-surface-700/50 bg-surface-800/30 rounded-2xl border p-4">
            <div className="space-y-4">
              {topCreators.length === 0 ? (
                <p className="text-surface-500 text-sm">데이터가 없습니다.</p>
              ) : (
                topCreators.map((creator, idx) => (
                  <div
                    key={creator.id}
                    className="group hover:bg-surface-700/30 flex items-center gap-3 rounded-xl p-2 transition-colors"
                  >
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
                    <div className="border-surface-600 relative h-10 w-10 overflow-hidden rounded-full border-2">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-white">
                          {creator.name}
                        </span>
                        {creator.isSponsor && (
                          <Crown className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-surface-500 text-xs">
                        {creator.prompts} prompts &bull; {creator.sales} sales
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <a
              href="/prompt?sort=popular"
              className="text-brand-400 hover:text-brand-300 mt-4 flex items-center justify-center gap-1 text-sm font-medium transition-colors"
            >
              전체 랭킹 보기 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
