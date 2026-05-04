'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Check,
  Loader2,
  ChevronRight,
  Shield,
  CreditCard,
} from 'lucide-react'
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import { supabase } from '@/src/lib/supabase'

// ─── 충전 옵션 ────────────────────────────────────────────────────────────────
type ChargeOption = {
  points: number
  price: number
  label: string
  bonus: number
  popular?: boolean
}

const CHARGE_OPTIONS: ChargeOption[] = [
  { points: 1000, price: 1000, label: '1,000P', bonus: 0 },
  { points: 3000, price: 3000, label: '3,000P', bonus: 0 },
  { points: 5000, price: 5000, label: '5,000P', bonus: 300, popular: true },
  { points: 10000, price: 10000, label: '10,000P', bonus: 1000 },
  { points: 30000, price: 30000, label: '30,000P', bonus: 5000 },
  { points: 50000, price: 50000, label: '50,000P', bonus: 10000 },
]

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

export default function ChargePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<ChargeOption>(CHARGE_OPTIONS[2])
  const [step, setStep] = useState<'select' | 'pay'>('select')
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingWidget, setLoadingWidget] = useState(false)

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  const paymentMethodsRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null)

  // 로그인 확인
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: { id: string } | null } }) => {
        if (!data.user) {
          router.push('/login?next=/charge')
          return
        }
        setUserId(data.user.id)
      })
  }, [router])

  // 결제 위젯 마운트
  useEffect(() => {
    if (step !== 'pay' || !userId) return
    let cancelled = false

    setLoadingWidget(true)
    ;(async () => {
      const widget = await loadPaymentWidget(CLIENT_KEY, userId)
      if (cancelled) return

      paymentWidgetRef.current = widget

      paymentMethodsRef.current = widget.renderPaymentMethods(
        '#toss-payment-widget',
        { value: selected.price },
        { variantKey: 'DEFAULT' }
      )
      widget.renderAgreement('#toss-agreement', { variantKey: 'AGREEMENT' })
      setLoadingWidget(false)
    })()

    return () => {
      cancelled = true
    }
  }, [step, userId, selected.price])

  // 금액 변경 시 위젯 업데이트
  useEffect(() => {
    paymentMethodsRef.current?.updateAmount(selected.price)
  }, [selected.price])

  async function handlePayment() {
    if (!paymentWidgetRef.current || !userId) return
    const orderId = `charge-${nanoid()}`

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: `${(selected.points + selected.bonus).toLocaleString()}P 크레딧 충전`,
        successUrl: `${globalThis.location.origin}/charge/success?points=${selected.points + selected.bonus}`,
        failUrl: `${globalThis.location.origin}/charge/fail`,
      })
    } catch (err: unknown) {
      // 사용자가 직접 취소한 경우는 조용히 처리
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code: string }).code
        if (code === 'USER_CANCEL') return
      }
      console.error('결제 요청 오류:', err)
    }
  }

  return (
    <div className="bg-surface-900 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="from-brand-400 to-brand-600 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">크레딧 충전</h1>
          <p className="text-surface-400 mt-2 text-sm">
            충전한 크레딧으로 프롬프트를 구매하세요
          </p>
        </div>

        {step === 'select' ? (
          <>
            {/* 금액 선택 */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CHARGE_OPTIONS.map((opt) => {
                const isSelected = selected.price === opt.price
                return (
                  <button
                    key={opt.price}
                    onClick={() => setSelected(opt)}
                    className={[
                      'relative rounded-2xl border p-4 text-left transition-all',
                      isSelected
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600',
                    ].join(' ')}
                  >
                    {opt.popular && (
                      <span className="bg-brand-500 absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        인기
                      </span>
                    )}
                    <div className="text-lg font-bold text-white">
                      {opt.label}
                    </div>
                    <div className="text-surface-300 mt-0.5 text-sm">
                      {opt.price.toLocaleString()}원
                    </div>
                    {opt.bonus > 0 && (
                      <div className="text-brand-400 mt-2 text-xs font-medium">
                        +{opt.bonus.toLocaleString()}P 보너스
                      </div>
                    )}
                    {isSelected && (
                      <div className="border-brand-500 bg-brand-500 absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 요약 */}
            <div className="border-surface-700/50 bg-surface-800/30 mt-6 rounded-2xl border p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-400">충전 금액</span>
                <span className="text-white">
                  {selected.price.toLocaleString()}원
                </span>
              </div>
              {selected.bonus > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-surface-400">보너스 포인트</span>
                  <span className="text-brand-400">
                    +{selected.bonus.toLocaleString()}P
                  </span>
                </div>
              )}
              <div className="border-surface-700/50 mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">합계 포인트</span>
                  <span className="text-brand-400 text-xl font-bold">
                    {(selected.points + selected.bonus).toLocaleString()}P
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('pay')}
              className="bg-brand-500 hover:bg-brand-400 mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white transition-colors"
            >
              결제하기
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="text-surface-500 mt-4 flex items-center justify-center gap-2 text-xs">
              <Shield className="h-3.5 w-3.5" />
              토스페이먼츠 보안 결제
            </div>
          </>
        ) : (
          <>
            {/* 결제 위젯 */}
            <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CreditCard className="text-brand-400 h-4 w-4" />
                  결제 수단 선택
                </div>
                <span className="text-brand-400 font-semibold">
                  {selected.price.toLocaleString()}원
                </span>
              </div>

              {loadingWidget && (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="text-brand-400 h-6 w-6 animate-spin" />
                </div>
              )}

              <div id="toss-payment-widget" />
              <div id="toss-agreement" className="mt-2" />
            </div>

            <button
              onClick={handlePayment}
              disabled={loadingWidget}
              className="bg-brand-500 hover:bg-brand-400 mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingWidget ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `${selected.price.toLocaleString()}원 결제하기`
              )}
            </button>

            <button
              onClick={() => setStep('select')}
              className="text-surface-400 hover:text-surface-200 mt-3 w-full text-center text-sm transition-colors"
            >
              ← 금액 다시 선택
            </button>
          </>
        )}
      </div>
    </div>
  )
}
