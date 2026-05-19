'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface Props {
  profileId: number
  onDone?: () => void
}

export function BusinessProfileActions({ profileId, onDone }: Readonly<Props>) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(action: 'approve' | 'reject') {
    setError(null)
    setLoading(action)
    try {
      const res = await fetch(
        `/api/admin/business-profile/${profileId}/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? '처리에 실패했습니다.')
        return
      }
      onDone ? onDone() : router.refresh()
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => submit('approve')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
            loading === null
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-surface-700 text-surface-500 cursor-not-allowed'
          )}
        >
          {loading === 'approve' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          승인
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => submit('reject')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
            loading === null
              ? 'border-surface-600 bg-surface-800 text-red-400 hover:bg-red-500/10'
              : 'bg-surface-700 text-surface-500 cursor-not-allowed border-transparent'
          )}
        >
          {loading === 'reject' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          반려
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
