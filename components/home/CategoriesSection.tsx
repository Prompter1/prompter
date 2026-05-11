import { ArrowRight, Image as ImageIcon, Bot, Zap } from 'lucide-react'

const categories = [
  {
    name: 'Midjourney',
    icon: ImageIcon,
    prompts: 1205,
    gradient: 'from-indigo-500 to-purple-600',
    description: '이미지 생성의 정석',
  },
  {
    name: 'Stable Diffusion',
    icon: ImageIcon,
    prompts: 840,
    gradient: 'from-pink-500 to-rose-600',
    description: '오픈소스 AI 아트',
  },
  {
    name: 'LLM Agents',
    icon: Bot,
    prompts: 2150,
    gradient: 'from-emerald-500 to-teal-600',
    description: '자동화와 생산성',
  },
  {
    name: 'Video Prompts',
    icon: Zap,
    prompts: 560,
    gradient: 'from-amber-500 to-orange-600',
    description: '영상 제작의 혁신',
  },
]

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-brand-400 mb-3 text-sm font-semibold tracking-wider uppercase">
            Categories
          </p>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            카테고리별 탐색
          </h2>
          <p className="text-muted-foreground mt-3">
            다양한 AI 도구에 최적화된 프롬프트를 찾아보세요
          </p>
        </div>
        <a
          href="/prompt"
          className="text-brand-400 hover:text-brand-300 hidden items-center gap-1.5 text-sm font-medium transition-colors duration-200 sm:flex"
        >
          전체 카테고리 보기 <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, idx) => (
          <a
            key={category.name}
            href={`/prompt?ai=${encodeURIComponent(category.name)}`}
            className={`group card-premium relative overflow-hidden rounded-2xl p-6 stagger-${idx + 1}`}
            style={{ animationFillMode: 'backwards' }}
          >
            {/* Icon */}
            <div
              className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-3.5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <category.icon className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-foreground group-hover:text-brand-400 text-lg font-semibold transition-colors duration-200">
              {category.name}
            </h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {category.description}
            </p>
            <p className="text-muted-foreground mt-4 text-sm font-medium">
              <span className="text-foreground">
                {category.prompts.toLocaleString()}
              </span>
              개의 프롬프트
            </p>

            {/* Arrow indicator */}
            <ArrowRight className="text-muted-foreground/40 group-hover:text-brand-400 absolute right-6 bottom-6 h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />

            {/* Hover gradient overlay */}
            <div className="from-brand-500/0 to-brand-600/0 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
          </a>
        ))}
      </div>
    </section>
  )
}
