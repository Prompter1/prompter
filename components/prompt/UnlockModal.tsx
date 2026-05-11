'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, X, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

interface UnlockModalProps {
  postId: number
  title: string
  price: number
  userPoints: number
  onClose: () => void
  onSuccess: () => void
}

export function UnlockModal({
  postId,
  title,
  price,
  userPoints,
  onClose,
  onSuccess,
}: Readonly<UnlockModalProps>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAfford = userPoints >= price

  async function handleUnlock() {
    setError(null)
    setLoading(true)

    const res = await fetch('/api/prompt/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error ?? '구매에 실패했습니다.')
      setLoading(false)
      return
    }

    onSuccess()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-md rounded-3xl border p-6 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="text-surface-400 hover:text-surface-200 absolute top-4 right-4 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 아이콘 */}
        <div className="from-brand-500/20 to-brand-600/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
          <Zap className="text-brand-400 h-7 w-7" />
        </div>

        <h2 className="mb-1 text-center text-lg font-bold text-white">
          크레딧으로 해금하기
        </h2>
        <p className="text-surface-400 mb-6 line-clamp-2 text-center text-sm">
          {title}
        </p>

        {/* 포인트 요약 */}
        <div className="border-surface-700/50 bg-surface-900/50 mb-4 space-y-2.5 rounded-2xl border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-400">보유 크레딧</span>
            <span className="font-medium text-white">
              {userPoints.toLocaleString()}P
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-400">차감 크레딧</span>
            <span className="text-brand-400 font-medium">
              -{price.toLocaleString()}P
            </span>
          </div>
          <div className="border-surface-700/50 flex items-center justify-between border-t pt-2.5 text-sm">
            <span className="text-surface-400">결제 후 잔여</span>
            <span
              className={`font-semibold ${canAfford ? 'text-white' : 'text-red-400'}`}
            >
              {(userPoints - price).toLocaleString()}P
            </span>
          </div>
        </div>

        {/* 크레딧 부족 경고 */}
        {!canAfford && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            크레딧이 부족합니다. 충전 후 다시 시도해주세요.
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-surface-600 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-3 text-sm font-medium transition-colors"
          >
            취소
          </button>

          {canAfford ? (
            <button
              type="button"
              onClick={handleUnlock}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-400 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {price.toLocaleString()}P 해금하기
                </>
              )}
            </button>
          ) : (
            <a
              href="/charge"
              className="bg-brand-500 hover:bg-brand-400 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors"
            >
              <Zap className="h-4 w-4" />
              크레딧 충전하기
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
