'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export function PublicationReviewActions({
  postId,
}: Readonly<{ postId: number }>) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reason, setReason] = useState('')

  async function approve() {
    setError(null)
    setLoading('approve')
    try {
      const res = await fetch(`/api/admin/publication/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : '처리에 실패했습니다.')
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

  async function reject() {
    if (!reason.trim()) {
      setError('반려 사유를 입력해주세요.')
      return
    }
    setError(null)
    setLoading('reject')
    try {
      const res = await fetch(`/api/admin/publication/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason: reason.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : '처리에 실패했습니다.')
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

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading !== null}
            onClick={approve}
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
            승인 (판매 활성화)
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => { setError(null); setShowRejectModal(true) }}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all',
              loading === null
                ? 'border-surface-600 bg-surface-800 border text-red-400 hover:bg-red-500/10'
                : 'bg-surface-700 text-surface-500 cursor-not-allowed'
            )}
          >
            <XCircle className="h-4 w-4" />
            반려
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {/* 반려 사유 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-md rounded-3xl border p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="text-surface-400 hover:text-surface-200 absolute top-4 right-4 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-1 text-lg font-bold text-white">반려 사유 입력</h2>
            <p className="text-surface-400 mb-4 text-sm">
              작성자에게 이메일로 반려 사유가 전달됩니다. 게시물은 삭제됩니다.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="반려 사유를 구체적으로 입력해주세요."
              rows={5}
              className="border-surface-600 bg-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-brand-500 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
            />

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="border-surface-600 bg-surface-700/50 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                disabled={loading === 'reject'}
                onClick={reject}
                className={cn(
                  'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all',
                  loading !== 'reject'
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-surface-700 text-surface-500 cursor-not-allowed'
                )}
              >
                {loading === 'reject' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    처리 중…
                  </span>
                ) : (
                  '반려 및 삭제'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
