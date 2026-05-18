'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

function FailContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'
  const code = searchParams.get('code')

  return (
    <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="border-surface-700/50 bg-surface-800/30 w-full max-w-md rounded-3xl border p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">결제 실패</h1>
        <p className="text-surface-400 mb-1 text-sm">{message}</p>
        {code && (
          <p className="text-surface-600 mb-4 text-xs">오류 코드: {code}</p>
        )}
        <Link
          href="/"
          className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default function PromptPurchaseFailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-900 flex min-h-screen items-center justify-center">
          <Loader2 className="text-brand-400 h-10 w-10 animate-spin" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  )
}
