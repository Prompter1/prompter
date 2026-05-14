// CTASection.tsx
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative border-t border-white/10 py-24">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            무료로 시작하세요
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          지금 바로 시작하세요
        </h2>

        <p className="text-surface-300 mx-auto mt-4 max-w-xl leading-7">
          무료로 가입하고 다양한 AI 프롬프트를 탐색하거나, 당신만의 프롬프트로
          수익을 창출해 보세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
          >
            무료로 시작하기
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <a
            href="/about"
            className="hover:border-brand-500/30 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.05]"
          >
            자세히 알아보기
          </a>
        </div>
      </div>
    </section>
  )
}
