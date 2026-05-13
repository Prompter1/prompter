'use client'

import { useState } from 'react'
import { Lock, Tag } from 'lucide-react'
import { CopyPromptButton } from '@/components/prompt/CopyPromptButton'
import { UnlockModal } from '@/components/prompt/UnlockModal'

interface PromptContentSectionProps {
  postId: number
  title: string
  content: string
  price: number
  canViewFull: boolean
  isLoggedIn: boolean
  userPoints: number
}

export function PromptContentSection({
  postId,
  title,
  content,
  price,
  canViewFull,
  isLoggedIn,
  userPoints,
}: Readonly<PromptContentSectionProps>) {
  const [unlocked, setUnlocked] = useState(canViewFull)
  const [showModal, setShowModal] = useState(false)
  const [unlockedText, setUnlockedText] = useState(canViewFull ? content : '')

  function handleSuccess() {
    setUnlocked(true)
    setUnlockedText(content)
    setShowModal(false)
  }

  // 본문의 15% 미리보기 (최소 30자, 최대 200자)
  const previewLength = Math.min(
    Math.max(Math.floor(content.length * 0.15), 30),
    200
  )
  const previewText = content.slice(0, previewLength)

  return (
    <>
      {unlocked && (
        <CopyPromptButton
          text={unlockedText}
          className="mb-8 w-full sm:w-auto"
        />
      )}

      <div className="border-surface-700/50 bg-surface-800/25 relative rounded-2xl border">
        {/* 헤더 */}
        <div className="border-surface-700/50 flex items-center gap-2 border-b px-5 py-3">
          <Tag className="text-surface-500 h-4 w-4" />
          <span className="text-surface-300 text-sm font-medium">
            {price === 0 ? '프롬프트 본문' : '대표 프롬프트'}
          </span>
        </div>

        {unlocked ? (
          /* ── 해금 후: 전체 내용 ── */
          <pre className="text-surface-200 max-h-[min(28rem,50vh)] overflow-auto p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </pre>
        ) : (
          /* ── 미해금: 미리보기 + 해금 영역 ── */
          <>
            <div className="relative">
              <pre className="text-surface-200 p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {previewText}
              </pre>
              {/* 하단 페이드 */}
              <div className="from-surface-800/0 via-surface-800/80 to-surface-800 pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b" />
            </div>

            {/* 해금 영역 — absolute 없는 독립 블록 */}
            <div className="border-surface-700/40 bg-surface-800/60 flex flex-col items-center gap-3 rounded-b-2xl border-t px-5 py-6 text-center backdrop-blur-sm">
              <div className="bg-surface-700/50 flex h-11 w-11 items-center justify-center rounded-2xl">
                <Lock className="text-surface-300 h-5 w-5" />
              </div>
              <div>
                <p className="text-surface-300 text-sm font-medium">
                  유료 프롬프트입니다
                </p>
                <p className="text-surface-500 mt-0.5 text-xs">
                  {price.toLocaleString()}P를 사용해 전체 내용을 확인하세요
                </p>
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="bg-brand-500 hover:bg-brand-400 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  {price.toLocaleString()}P로 해금하기
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-brand-500 hover:bg-brand-400 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  로그인 후 구매하기
                </a>
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <UnlockModal
          postId={postId}
          title={title}
          price={price}
          userPoints={userPoints}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
