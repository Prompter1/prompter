import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BackgroundEffects } from '@/components/ui/BackgroundEffects'
import { STATS } from '@/data/constants'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <BackgroundEffects />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Live badge */}
        <div className="border-brand-500/30 bg-brand-500/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="bg-brand-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-brand-500 relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-brand-400 text-sm font-medium">새로운 프롬프트가 매일 업데이트됩니다</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">
          AI 프롬프트의
          <br />
          <span className="text-gradient">새로운 기준</span>
        </h1>

        <p className="text-surface-400 mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
          검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로 수익을 창출하세요.
          AI 창작의 효율과 신뢰를 높이는 마켓플레이스입니다.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="group bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 hover:shadow-brand-500/30 flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
          >
            프롬프트 탐색하기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="group border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800 flex items-center gap-2 rounded-2xl border px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all"
          >
            내 프롬프트 판매하기
          </a>
        </div>

        {/* Stats */}
        <div className="border-surface-700/50 mt-16 grid grid-cols-3 gap-8 border-t pt-12">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="text-brand-400 h-5 w-5" />
              <span className="text-3xl font-bold text-white">{value}</span>
              <span className="text-surface-400 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
