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

  return (
    <>
      {/* 복사 버튼 — 해금된 경우만 */}
      {unlocked && (
        <CopyPromptButton
          text={unlockedText}
          className="mb-8 w-full sm:w-auto"
        />
      )}

      {/* 프롬프트 본문 */}
      <div className="border-surface-700/50 bg-surface-800/25 relative rounded-2xl border">
        <div className="border-surface-700/50 flex items-center gap-2 border-b px-5 py-3">
          <Tag className="text-surface-500 h-4 w-4" />
          <span className="text-surface-300 text-sm font-medium">
            프롬프트 본문
          </span>
        </div>

        <div className="relative">
          {/* 실제 텍스트 */}
          <pre className="text-surface-200 max-h-[min(28rem,50vh)] overflow-auto p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {unlocked ? content : content.slice(0, 120) + '...'}
          </pre>

          {/* 블러 오버레이 — 미해금 시 */}
          {!unlocked && (
            <div className="via-surface-900/80 to-surface-900 absolute inset-0 flex flex-col items-center justify-center rounded-b-2xl bg-gradient-to-b from-transparent">
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="bg-surface-700/50 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Lock className="text-surface-300 h-6 w-6" />
                </div>
                <p className="text-surface-300 text-sm font-medium">
                  유료 프롬프트입니다
                </p>
                <p className="text-surface-500 text-xs">
                  {price.toLocaleString()}P를 사용해 전체 내용을 확인하세요
                </p>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-brand-500 hover:bg-brand-400 mt-2 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    {price.toLocaleString()}P로 해금하기
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="bg-brand-500 hover:bg-brand-400 mt-2 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    로그인 후 구매하기
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 해금 모달 */}
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
