'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'
import { UnlockModal } from '@/components/prompt/UnlockModal'

interface PromptContentSectionProps {
  postId: number
  title: string
  content: string // 한줄 소개 텍스트
  price: number
  canViewFull: boolean
  isLoggedIn: boolean
  userPoints: number
  userId: string
  // 해금 성공 시 부모(PromptStepsViewer 포함)에 알림용
  onUnlocked?: () => void
}

export function PromptContentSection({
  postId,
  title,
  content,
  price,
  canViewFull,
  isLoggedIn,
  userPoints,
  userId,
  onUnlocked,
}: Readonly<PromptContentSectionProps>) {
  const [, setUnlocked] = useState(canViewFull)
  const [showModal, setShowModal] = useState(false)

  function handleSuccess() {
    setUnlocked(true)
    setShowModal(false)
    onUnlocked?.()
  }

  return (
    <>
      {/* 프롬프트 한줄 소개 — 항상 공개 */}
      <div className="bg-surface-800/25 mb-6 rounded-2xl border border-white/20">
        <div className="flex items-center gap-2 border-b border-white/20 px-5 py-3">
          <Tag className="text-surface-500 h-4 w-4" />
          <span className="text-surface-300 text-sm font-medium">
            프롬프트 한줄 소개
          </span>
        </div>
        <pre className="text-surface-200 max-h-[min(28rem,50vh)] overflow-auto p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </pre>
      </div>

      {/* 해금 모달 트리거 — 유료 + 미해금 + 로그인 상태일 때만 */}
      {showModal && (
        <UnlockModal
          postId={postId}
          title={title}
          price={price}
          userId={userId}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
