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
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-brand-400 mb-2 text-sm font-medium">CATEGORIES</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            카테고리별 탐색
          </h2>
          <p className="text-surface-400 mt-3">
            다양한 AI 도구에 최적화된 프롬프트를 찾아보세요
          </p>
        </div>
        <a
          href="/categories"
          className="text-brand-400 hover:text-brand-300 hidden items-center gap-1 text-sm font-medium transition-colors sm:flex"
        >
          전체 카테고리 보기 <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <a
            key={category.name}
            href={`/explore?category=${category.name}`}
            className="group border-surface-700/50 bg-surface-800/30 hover:border-brand-500/30 hover:bg-surface-800/50 hover:shadow-brand-500/5 relative overflow-hidden rounded-2xl border p-6 backdrop-blur transition-all hover:shadow-lg"
          >
            <div
              className={`mb-4 inline-flex rounded-xl bg-linear-to-br ${category.gradient} p-3.5 shadow-lg`}
            >
              <category.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {category.name}
            </h3>
            <p className="text-surface-500 mt-1 text-sm">
              {category.description}
            </p>
            <p className="text-surface-400 mt-3 text-sm font-medium">
              <span className="text-white">
                {category.prompts.toLocaleString()}
              </span>
              개의 프롬프트
            </p>
            <ArrowRight className="text-surface-600 group-hover:text-brand-400 absolute right-6 bottom-6 h-5 w-5 transition-all group-hover:translate-x-1" />
          </a>
        ))}
      </div>
    </section>
  )
}
