'use client'

import { useState, useEffect } from 'react'
import { Zap, X, Loader2, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react'
import Script from 'next/script'
import { useToast } from '@/components/ui/Toast'

interface UnlockModalProps {
  postId: number
  title: string
  price: number
  userId: string
  onClose: () => void
  onSuccess: () => void
}

interface SignData {
  mid: string
  orderId: string
  timestamp: string
  mKey: string
  signature: string
  verification: string
  buyerEmail: string
}

declare global {
  // eslint-disable-next-line no-var
  var INIStdPay: { pay: (form: HTMLFormElement | string) => void } | undefined
}

export function UnlockModal({
  postId,
  title,
  price,
  onClose,
}: Readonly<UnlockModalProps>) {
  const { error: toastError } = useToast()
  const [scriptReady, setScriptReady] = useState(false)
  const [signData, setSignData] = useState<SignData | null>(null)
  const [signError, setSignError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    if (globalThis.INIStdPay) { setScriptReady(true); return }
    const id = setInterval(() => {
      if (globalThis.INIStdPay) { setScriptReady(true); clearInterval(id) }
    }, 100)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setSignData(null)
    setSignError(null)
    fetch('/api/payment/inicis-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, amount: price }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setSignData(data as SignData)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : '결제 준비에 실패했습니다.'
        setSignError(msg)
        toastError('오류', msg)
      })
  }, [postId, price, toastError, fetchKey])

  function handlePayment() {
    const ini = globalThis.INIStdPay
    if (!ini || !signData) return

    const origin = globalThis.location.origin
    // NEXT_PUBLIC_PAYMENT_CALLBACK_URL: 로컬 개발 시 ngrok 등 외부 URL 설정
    // 미설정 시 현재 origin 사용 (배포 환경에서는 자동으로 올바른 도메인이 됨)
    const callbackBase =
      process.env.NEXT_PUBLIC_PAYMENT_CALLBACK_URL?.replace(/\/$/, '') ?? origin

    document.getElementById('inicis-pay-form')?.remove()

    const form = document.createElement('form')
    form.id = 'inicis-pay-form'
    form.method = 'post'
    form.style.display = 'none'

    const fields: [string, string][] = [
      ['version',      '1.0'],
      ['gopaymethod',  'Card'],
      ['mid',          signData.mid],
      ['oid',          signData.orderId],
      ['price',        String(price)],
      ['currency',     'WON'],
      ['timestamp',    signData.timestamp],
      ['use_chkfake',  'Y'],
      ['mKey',         signData.mKey],
      ['signature',    signData.signature],
      ['verification', signData.verification],
      ['goodname',     title.slice(0, 40)],
      ['buyername',    '구매자'],
      ['buyertel',     '01000000000'],
      ['buyeremail',   signData.buyerEmail],
      ['charset',      'UTF-8'],
      ['acceptmethod', 'HPP(1):below1000:centerCd(Y)'],
      // nextUrl: 서버-서버 콜백 — 외부 URL이 설정된 경우(배포 환경)에만 포함
      // 로컬에서 nextUrl을 localhost로 보내면 KG이니시스가 도달 못해 authToken을 무효화함
      ...(callbackBase === origin
        ? []
        : ([['nextUrl', `${callbackBase}/api/payment/inicis-confirm`]] as [string, string][])),
      ['returnUrl',    `${origin}/api/payment/inicis-return?postId=${postId}`],
      ['closeUrl',     `${origin}/prompt/${postId}`],
    ]

    for (const [name, value] of fields) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    document.body.appendChild(form)
    ini.pay('inicis-pay-form')
    // 다음 재시도를 위해 새 orderId 발급 — 팝업이 열린 사이 백그라운드에서 fetch
    setFetchKey((k) => k + 1)
  }

  const ready = scriptReady && signData !== null
  const loading = !signError && !signData

  return (
    <>
      <Script
        src={
          process.env.NEXT_PUBLIC_INICIS_DEV_BYPASS === 'true'
            ? 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js'
            : 'https://stdpay.inicis.com/stdjs/INIStdPay.js'
        }
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setSignError('결제 스크립트 로드에 실패했습니다.')}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-md rounded-3xl border p-6 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="text-surface-400 hover:text-surface-200 absolute top-4 right-4 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

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

          <div className="border-surface-700/50 bg-surface-900/30 mb-6 rounded-2xl border px-4 py-3">
            <div className="flex items-start gap-2 text-sm text-white/60">
              <CreditCard className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
              <span>
                신용카드·체크카드·계좌이체·가상계좌 등 다양한 결제 수단을
                지원합니다.
              </span>
            </div>
          </div>

          {signError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {signError}
            </div>
          )}

          <button
            type="button"
            onClick={handlePayment}
            disabled={!ready}
            className="bg-brand-500 hover:bg-brand-400 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
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
            KG이니시스 보안 결제
          </div>
        </div>
      </div>
    </>
  )
}
