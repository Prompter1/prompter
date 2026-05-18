'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, X, Loader2, ShieldCheck, CreditCard } from 'lucide-react'
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import { useToast } from '@/components/ui/Toast'

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

interface UnlockModalProps {
  postId: number
  title: string
  price: number
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export function UnlockModal({
  postId,
  title,
  price,
  userId,
  onClose,
  onSuccess,
}: Readonly<UnlockModalProps>) {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [loadingWidget, setLoadingWidget] = useState(true)
  const [widgetReady, setWidgetReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)

  // 결제 위젯 마운트
  useEffect(() => {
    if (!userId) return
    let cancelled = false

    console.log('CLIENT_KEY:', process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY)

    setLoadingWidget(true)
    setWidgetReady(false)
    ;(async () => {
      try {
        const widget = await loadPaymentWidget(CLIENT_KEY, userId)
        if (cancelled) return

        paymentWidgetRef.current = widget

        await Promise.all([
          widget.renderPaymentMethods(
            '#toss-unlock-widget',
            { value: price },
            { variantKey: 'DEFAULT' }
          ),
          widget.renderAgreement('#toss-unlock-agreement', {
            variantKey: 'AGREEMENT',
          }),
        ])

        if (cancelled) return
        setLoadingWidget(false)
        setWidgetReady(true)
      } catch (err) {
        if (!cancelled) {
          console.error('위젯 렌더링 실패:', err)
          setLoadingWidget(false)
          setError('결제 위젯을 불러오는 데 실패했습니다.')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [userId, price])

  async function handlePayment() {
    if (!paymentWidgetRef.current) return
    setError(null)

    const orderId = `prompt-${postId}-${nanoid()}`

    try {
      // UnlockModal.tsx - handlePayment 함수 안
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: `프롬프트: ${title}`,
        successUrl: `${window.location.origin}/charge/success?postId=${postId}`, // ✅ 수정
        failUrl: `${window.location.origin}/charge/fail`, // ✅ 수정
        metadata: { postId: String(postId) },
      })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code: string }).code
        if (code === 'USER_CANCEL') return
      }
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : '결제 요청에 실패했습니다.'
      setError(msg)
      toastError('결제 실패', msg)
    }
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
          프롬프트 구매
        </h2>
        <p className="text-surface-400 mb-2 line-clamp-2 text-center text-sm">
          {title}
        </p>
        <p className="text-brand-400 mb-6 text-center text-2xl font-bold">
          {price.toLocaleString()}원
        </p>

        {/* 결제 위젯 */}
        <div className="border-surface-700/50 bg-surface-900/30 mb-4 rounded-2xl border p-3">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <CreditCard className="text-brand-400 h-4 w-4" />
            결제 수단 선택
          </div>

          {loadingWidget && (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="text-brand-400 h-6 w-6 animate-spin" />
            </div>
          )}

          <div id="toss-unlock-widget" />
          <div id="toss-unlock-agreement" className="mt-2" />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mb-3 rounded-xl bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {/* 결제 버튼 */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={!widgetReady}
          className="bg-brand-500 hover:bg-brand-400 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!widgetReady ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              준비 중...
            </>
          ) : (
            `${price.toLocaleString()}원 결제하기`
          )}
        </button>

        <div className="text-surface-500 mt-3 flex items-center justify-center gap-2 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          토스페이먼츠 보안 결제
        </div>
      </div>
    </div>
  )
}
