'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

// 토스페이먼츠 에러 코드 → 한국어 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: '결제를 취소했습니다.',
  PAY_PROCESS_ABORTED: '결제가 중단되었습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했습니다.',
  INVALID_CARD_EXPIRY: '카드 유효기간이 올바르지 않습니다.',
  INVALID_STOPPED_CARD: '정지된 카드입니다.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '일일 결제 한도를 초과했습니다.',
  NOT_ENOUGH_MONEY: '잔액이 부족합니다.',
}

function FailContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') ?? ''
  const message = searchParams.get('message') ?? ''

  const displayMessage =
    ERROR_MESSAGES[code] || message || '알 수 없는 오류가 발생했습니다.'
  const isCanceled = code === 'PAY_PROCESS_CANCELED'

  return (
    <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="border-surface-700/50 bg-surface-800/30 w-full max-w-md rounded-3xl border p-8 text-center">
        <div
          className={[
            'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
            isCanceled ? 'bg-surface-700/50' : 'bg-red-500/15',
          ].join(' ')}
        >
          <XCircle
            className={[
              'h-8 w-8',
              isCanceled ? 'text-surface-400' : 'text-red-400',
            ].join(' ')}
          />
        </div>

        <h1 className="mb-1 text-xl font-bold text-white">
          {isCanceled ? '결제 취소' : '결제 실패'}
        </h1>
        <p className="text-surface-400 mb-2 text-sm">{displayMessage}</p>
        {code && (
          <p className="text-surface-600 mb-6 font-mono text-xs">
            오류 코드: {code}
          </p>
        )}

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
            다시 시도
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ChargeFailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-900 flex min-h-screen items-center justify-center">
          <Loader2 className="text-brand-400 h-8 w-8 animate-spin" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  )
}
