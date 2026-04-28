import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CATEGORIES } from '@/data/constants'

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        title="카테고리별 탐색"
        subtitle="다양한 AI 도구에 최적화된 프롬프트를 찾아보세요"
        linkLabel="전체 카테고리 보기"
        linkHref="#"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <a
            key={category.name}
            href="#"
            className="group border-surface-700/50 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800 relative overflow-hidden rounded-2xl border p-6 backdrop-blur transition-all"
          >
            <div
              className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-3`}
            >
              <category.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-surface-400 mt-1 text-sm">
              {category.prompts.toLocaleString()}개의 프롬프트
            </p>
            <ArrowRight className="text-surface-600 group-hover:text-surface-400 absolute right-6 bottom-6 h-5 w-5 transition-all group-hover:translate-x-1" />
          </a>
        ))}
      </div>
    </section>
  )
}
