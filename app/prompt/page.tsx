import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PromptIndexPage() {
  return (
    <>
      <Navbar />
      <main className="bg-surface-900 relative min-h-[70vh] px-4 pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-brand-500/10 absolute top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-lg text-center">
          <div className="from-brand-400 to-brand-600 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-surface-50 mb-3 text-2xl font-bold">
            프롬프트 상세
          </h1>
          <p className="text-surface-400 mb-8 text-sm leading-relaxed">
            목록에서 카드를 선택하거나 홈의 인기·급상승 프롬프트로 이동해
            상세 페이지를 열 수 있습니다.
          </p>
          <Link
            href="/"
            className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors"
          >
            홈에서 둘러보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
