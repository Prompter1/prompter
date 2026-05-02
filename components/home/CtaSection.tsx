import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="border-surface-700/50 from-surface-800/30 to-surface-900 border-t bg-linear-to-b py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            무료로 시작하세요
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          지금 바로 시작하세요
        </h2>

        <p className="text-surface-400 mx-auto mt-4 max-w-xl">
          무료로 가입하고 다양한 AI 프롬프트를 탐색하거나, 당신만의 프롬프트로
          수익을 창출해 보세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all"
          >
            무료로 시작하기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="/about"
            className="border-surface-700 bg-surface-800/50 hover:border-surface-600 rounded-2xl border px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all"
          >
            자세히 알아보기
          </a>
        </div>
      </div>
    </section>
  )
}
