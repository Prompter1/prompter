'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export function VerificationReviewActions({
  requestId,
  canResolve,
}: Readonly<{ requestId: number; canResolve: boolean }>) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(action: 'approve' | 'reject') {
    setError(null)
    setLoading(action)
    try {
      // requestId가 문자열(UUID)이므로 템플릿 리터럴에 그대로 포함됩니다.
      const res = await fetch(`/api/admin/verification/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(
          typeof data.error === 'string' ? data.error : '처리에 실패했습니다.'
        )
        setLoading(null)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('네트워크 오류가 발생했습니다.')
      setLoading(null)
    }
  }

  if (!canResolve) {
    return (
      <p className="text-surface-500 text-sm">
        이 요청은 이미 처리되었습니다. 목록에서 상태를 확인하세요.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => submit('approve')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all',
            loading === null
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-surface-700 text-surface-500 cursor-not-allowed'
          )}
        >
          {loading === 'approve' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          승인 (Verified 반영)
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => submit('reject')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all',
            loading === null
              ? 'border-surface-600 bg-surface-800 border text-red-400 hover:bg-red-500/10'
              : 'bg-surface-700 text-surface-500 cursor-not-allowed'
          )}
        >
          {loading === 'reject' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          반려
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
