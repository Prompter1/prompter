import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PromptNotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-surface-900 flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="from-brand-400 to-brand-600 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">
          프롬프트를 찾을 수 없습니다
        </h1>
        <p className="text-surface-400 mb-8 max-w-md text-center text-sm">
          삭제되었거나 주소가 잘못되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </main>
      <Footer />
    </>
  )
}
