import Image from 'next/image'
import { Flame, Crown, ArrowRight } from 'lucide-react'

interface TrendingPrompt {
  id: number
  title: string
  category: string
  price: number
  views: number
  trend: string
}

interface Creator {
  id: number
  name: string
  avatar: string
  prompts: number
  sales: number
  isSponsor: boolean
}

const trendingPrompts: TrendingPrompt[] = [
  {
    id: 5,
    title: 'SEO 콘텐츠 작성 봇',
    category: 'LLM Agents',
    price: 8000,
    views: 4500,
    trend: '+125%',
  },
  {
    id: 6,
    title: '제품 목업 생성기',
    category: 'Stable Diffusion',
    price: 4500,
    views: 3800,
    trend: '+89%',
  },
  {
    id: 7,
    title: '인스타그램 릴스 스크립트',
    category: 'Video Prompts',
    price: 2000,
    views: 5200,
    trend: '+156%',
  },
  {
    id: 8,
    title: '3D 캐릭터 컨셉아트',
    category: 'Midjourney',
    price: 6000,
    views: 4100,
    trend: '+78%',
  },
]

const topCreators: Creator[] = [
  {
    id: 1,
    name: 'PromptMaster',
    avatar: '/images/default-avatar.png',
    prompts: 42,
    sales: 1250,
    isSponsor: true,
  },
  {
    id: 2,
    name: 'AICreator',
    avatar: '/images/default-avatar.png',
    prompts: 38,
    sales: 980,
    isSponsor: false,
  },
  {
    id: 3,
    name: 'ContentPro',
    avatar: '/images/default-avatar.png',
    prompts: 29,
    sales: 756,
    isSponsor: true,
  },
]

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default function TrendingSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Trending */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white">급상승 프롬프트</h2>
          </div>
          <div className="space-y-3">
            {trendingPrompts.map((prompt, idx) => (
              <a
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
                  <span className="text-sm font-semibold text-emerald-400">
                    {prompt.trend}
                  </span>
                  <p className="text-surface-500 text-xs">
                    {formatNumber(prompt.views)} views
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">인기 크리에이터</h2>
          </div>
          <div className="border-surface-700/50 bg-surface-800/30 rounded-2xl border p-4">
            <div className="space-y-4">
              {topCreators.map((creator, idx) => (
                <a
                  key={creator.id}
                  href={`/creator/${creator.id}`}
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
                      <span className="group-hover:text-brand-400 font-medium text-white">
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
                </a>
              ))}
            </div>
            <a
              href="/ranking"
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
