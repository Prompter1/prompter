'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [finalPoints, setFinalPoints] = useState(0)

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey')
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    const points = Number(searchParams.get('points') ?? 0)

    if (!paymentKey || !orderId || !amount) {
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      setStatus('error')
      return
    }

    // 서버에 결제 승인 요청
    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
        points,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setFinalPoints(data.totalPoints)
          setStatus('success')
        } else {
          setErrorMsg(data.error ?? '결제 승인에 실패했습니다.')
          setStatus('error')
        }
      })
      .catch(() => {
        setErrorMsg('네트워크 오류가 발생했습니다.')
        setStatus('error')
      })
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="text-brand-400 mb-4 h-10 w-10 animate-spin" />
        <p className="text-surface-400 text-sm">결제를 처리하고 있습니다...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="border-surface-700/50 bg-surface-800/30 w-full max-w-md rounded-3xl border p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="mb-2 text-xl font-bold text-white">결제 오류</h1>
          <p className="text-surface-400 mb-6 text-sm">{errorMsg}</p>
          <Link
            href="/charge"
            className="bg-brand-500 hover:bg-brand-400 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors"
          >
            다시 시도
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="border-surface-700/50 bg-surface-800/30 w-full max-w-md rounded-3xl border p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mb-1 text-xl font-bold text-white">충전 완료!</h1>
        <p className="text-surface-400 mb-6 text-sm">
          크레딧이 성공적으로 충전되었습니다
        </p>

        <div className="border-surface-700/50 bg-surface-900/50 mb-6 rounded-2xl border p-4">
          <div className="flex items-center justify-center gap-2">
            <Zap className="text-brand-400 h-5 w-5" />
            <span className="text-brand-400 text-2xl font-bold">
              {finalPoints.toLocaleString()}P
            </span>
          </div>
          <p className="text-surface-500 mt-1 text-xs">현재 보유 포인트</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="border-surface-600 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-3 text-center text-sm font-medium transition-colors"
          >
            홈으로
          </Link>
          <Link
            href="/charge"
            className="bg-brand-500 hover:bg-brand-400 flex-1 rounded-xl py-3 text-center text-sm font-semibold text-white transition-colors"
          >
            추가 충전
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ChargeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-900 flex min-h-screen items-center justify-center">
          <Loader2 className="text-brand-400 h-8 w-8 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
