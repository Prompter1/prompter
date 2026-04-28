import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="text-surface-400 mx-auto mt-4 max-w-xl">
          무료로 가입하고 다양한 AI 프롬프트를 탐색하거나, 당신만의 프롬프트로 수익을 창출해
          보세요.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all"
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </section>
  )
}
