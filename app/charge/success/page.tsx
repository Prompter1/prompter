'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'

function PurchaseSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const postId = searchParams.get('postId')
    if (!postId) {
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      setStatus('error')
      return
    }

    // inicis-confirm(P_NEXT_URL)에서 이미 DB 처리 완료됨
    // transactions 테이블에서 구매 여부 확인으로 성공 판단
    const verify = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrorMsg('로그인이 필요합니다.')
        setStatus('error')
        return
      }

      // 최대 8초 동안 0.5초 간격으로 확인 (서버 콜백 처리 지연 대비)
      for (let i = 0; i < 16; i++) {
        const { data } = await supabase
          .from('transactions')
          .select('id')
          .eq('prompt_post_id', Number(postId))
          .eq('buyer_id', user.id)
          .maybeSingle()

        if (data) {
          setStatus('success')
          setTimeout(() => router.push(`/prompt/${postId}`), 2000)
          return
        }

        await new Promise((r) => setTimeout(r, 500))
      }

      setErrorMsg('결제 처리 확인에 실패했습니다. 고객센터에 문의해 주세요.')
      setStatus('error')
    }

    verify()
  }, [searchParams, router])

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
            href="/"
            className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="border-surface-700/50 bg-surface-800/30 w-full max-w-md rounded-3xl border p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">결제 완료!</h1>
        <p className="text-surface-400 mb-1 text-sm">
          프롬프트가 성공적으로 구매되었습니다.
        </p>
        <p className="text-surface-500 mb-6 text-xs">
          잠시 후 프롬프트 페이지로 이동합니다...
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
          <Zap className="h-4 w-4" />
          프롬프트가 해금되었습니다
        </div>
      </div>
    </div>
  )
}

export default function PromptPurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-900 flex min-h-screen items-center justify-center">
          <Loader2 className="text-brand-400 h-10 w-10 animate-spin" />
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  )
}
