'use client'

import { useState, useCallback } from 'react'
import { ShieldAlert, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface AdultContentGateProps {
  /** 성인 컨텐츠 여부 */
  isAdult: boolean
  /** 로그인 여부 */
  isLoggedIn: boolean
  /** 이미 성인 인증된 사용자 여부 (서버에서 members.adult_verified 값) */
  isAdultVerified: boolean
  /** 감싸는 콘텐츠 */
  children: React.ReactNode
  className?: string
}

/**
 * 성인 컨텐츠 블러 게이트
 * - isAdult=false면 그냥 children 렌더
 * - isAdult=true + 미인증 → 블러 오버레이 + 인증 버튼
 * - isAdult=true + 인증 완료 → 언블러 토글 버튼
 */
export function AdultContentGate({
  isAdult,
  isLoggedIn,
  isAdultVerified: initialVerified,
  children,
  className,
}: Readonly<AdultContentGateProps>) {
  const [verified, setVerified] = useState(initialVerified)
  const [revealed, setRevealed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // 성인 컨텐츠가 아니면 그냥 렌더
  if (!isAdult) return <>{children}</>

  // 인증됐고 공개 중이면 콘텐츠 노출 + 숨기기 버튼
  if (verified && revealed) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity hover:bg-black/90"
        >
          <EyeOff className="h-3.5 w-3.5" />
          숨기기
        </button>
      </div>
    )
  }

  // 블러 오버레이
  return (
    <>
      <div className={cn('relative overflow-hidden', className)}>
        {/* 블러 처리된 콘텐츠 */}
        <div
          className="pointer-events-none select-none"
          style={{ filter: 'blur(24px)' }}
        >
          {children}
        </div>

        {/* 오버레이 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>
          <div className="px-4 text-center">
            <p className="text-sm font-semibold text-white">성인 컨텐츠</p>
            <p className="text-surface-400 mt-0.5 text-xs">
              만 19세 이상만 열람 가능합니다
            </p>
          </div>

          {isLoggedIn ? (
            verified ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Eye className="h-3.5 w-3.5" />
                열람하기
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
              >
                <Lock className="h-3.5 w-3.5" />
                성인 인증하기
              </button>
            )
          ) : (
            <a
              href="/login"
              className="bg-brand-500 hover:bg-brand-400 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              로그인 후 인증하기
            </a>
          )}
        </div>
      </div>

      {/* 성인 인증 모달 */}
      {showModal && (
        <AdultVerifyModal
          onClose={() => setShowModal(false)}
          onVerified={() => {
            setVerified(true)
            setRevealed(true)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

// ── 성인 인증 모달 ─────────────────────────────────────────────────────────

function AdultVerifyModal({
  onClose,
  onVerified,
}: Readonly<{
  onClose: () => void
  onVerified: () => void
}>) {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = useCallback(async () => {
    if (!agreed) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/adult-verify', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? '인증에 실패했습니다.')
        return
      }
      onVerified()
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [agreed, onVerified])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl">
        {/* 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
          <ShieldAlert className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="mb-1 text-center text-lg font-bold text-white">
          성인 인증
        </h2>
        <p className="text-surface-400 mb-5 text-center text-xs leading-relaxed">
          본 컨텐츠는 만 19세 이상만 열람 가능합니다.
          <br />
          인증 후에는 세션 동안 성인 컨텐츠를 열람할 수 있습니다.
        </p>

        {/* 경고 박스 */}
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-200">
              미성년자가 성인 컨텐츠를 열람하면 관련 법령에 따라 처벌받을 수
              있습니다. 본인이 만 19세 이상임을 확인해주세요.
            </p>
          </div>
        </div>

        {/* 동의 체크박스 */}
        <label className="mb-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="border-surface-600 mt-0.5 h-4 w-4 rounded accent-red-500"
          />
          <span className="text-surface-300 text-xs leading-relaxed">
            본인은 만 19세 이상이며, 성인 컨텐츠 열람에 동의합니다.
          </span>
        </label>

        {error && (
          <p className="mb-3 text-center text-xs text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-surface-600 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-3 text-sm font-medium transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={!agreed || loading}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? '처리 중...' : '인증하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
