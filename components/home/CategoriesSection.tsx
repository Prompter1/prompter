import { ArrowRight, Image as ImageIcon, Bot, Zap } from 'lucide-react'

const categories = [
  {
    name: 'Midjourney',
    icon: ImageIcon,
    prompts: 1205,
    gradient: 'from-indigo-500 via-violet-500 to-purple-600',
    description: '이미지 생성의 정석',
  },
  {
    name: 'Stable Diffusion',
    icon: ImageIcon,
    prompts: 840,
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    description: '오픈소스 AI 아트',
  },
  {
    name: 'LLM Agents',
    icon: Bot,
    prompts: 2150,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    description: '자동화와 생산성',
  },
  {
    name: 'Video Prompts',
    icon: Zap,
    prompts: 560,
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    description: '영상 제작의 혁신',
  },
]

export default function CategorySection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      {/* 헤더 */}
      <div className="mb-16 max-w-2xl">
        <p className="text-brand-400 mb-3 text-xs font-semibold tracking-[0.25em] uppercase">
          Categories
        </p>

        <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl">
          카테고리별 탐색
        </h2>

        <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
          다양한 AI 도구에 최적화된 프롬프트를 탐색하고, 당신의 워크플로우를
          확장하세요.
        </p>
      </div>

      {/* 카드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon

          return (
            <a
              key={category.name}
              href={`/prompt?ai=${encodeURIComponent(category.name)}`}
              className="group hover:border-brand-500/40 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.04] hover:shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
            >
              {/* glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="from-brand-500/20 to-brand-600/20 absolute -inset-[1px] rounded-2xl bg-gradient-to-br via-transparent blur-xl" />
              </div>

              {/* 상단 라인 */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* 아이콘 */}
              <div
                className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-3.5 shadow-lg shadow-black/30 transition-all duration-300 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* 텍스트 */}
              <h3 className="text-foreground group-hover:text-brand-300 text-lg font-semibold transition-colors">
                {category.name}
              </h3>

              <p className="text-muted-foreground mt-2 text-sm">
                {category.description}
              </p>

              {/* stats */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {category.prompts.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">
                    prompts
                  </span>
                </span>

                <ArrowRight className="text-muted-foreground/40 group-hover:text-brand-400 h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
