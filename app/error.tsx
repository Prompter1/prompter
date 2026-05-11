'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="bg-surface-900 flex min-h-screen items-center justify-center px-4 text-white">
      <div className="border-surface-700/60 bg-surface-800/50 w-full max-w-md rounded-2xl border p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold">화면을 불러오지 못했습니다</h1>
        <p className="text-surface-400 mt-2 text-sm leading-6">
          잠시 후 다시 시도하거나 이전 화면에서 작업을 이어가세요.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="bg-brand-500 hover:bg-brand-400 mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    </main>
  )
}
