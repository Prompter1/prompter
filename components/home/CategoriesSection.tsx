import { ArrowRight, Image as ImageIcon, Bot, Zap } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

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
      <Reveal variant="up" distance={18} duration={650}>
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
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => {
          const Icon = category.icon
          const variant =
            index % 4 === 0
              ? 'up'
              : index % 4 === 1
                ? 'left'
                : index % 4 === 2
                  ? 'right'
                  : 'scale'

          return (
            <Reveal
              key={category.name}
              variant={variant}
              delay={index * 90}
              distance={24}
              duration={720}
              className="h-full"
            >
              <a
                href={`/prompt?ai=${encodeURIComponent(category.name)}`}
                className="group hover:border-brand-500/40 relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/2 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/4 hover:shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="from-brand-500/20 to-brand-600/20 absolute -inset-px rounded-2xl bg-linear-to-br via-transparent blur-xl" />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

                <div
                  className={`mb-6 inline-flex rounded-xl bg-linear-to-br ${category.gradient} p-3.5 shadow-lg shadow-black/30 transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-foreground group-hover:text-brand-300 mt-6 text-2xl font-semibold transition-colors">
                  {category.name}
                </h3>

                <p className="text-muted-foreground mt-2 text-sm">
                  {category.description}
                </p>
              </a>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
