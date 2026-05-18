'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Sparkles,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { UnlockModal } from '@/components/prompt/UnlockModal'
import { CopyPromptButton } from './CopyPromptButton'

export interface PromptStep {
  id: number
  step_order: number
  ai_type: string
  ai_version: string
  input_prompt: string
  input_media: string[]
  output_text: string
  output_media: string[]
}

// ── 개별 스텝의 입력 프롬프트 (해금 로직 포함) ──────────────────────────────
function StepInputPrompt({
  prompt,
  unlocked,
  price,
  isLoggedIn,
  onRequestUnlock,
}: Readonly<{
  prompt: string
  unlocked: boolean
  price: number
  isLoggedIn: boolean
  onRequestUnlock: () => void
}>) {
  const previewLength = Math.min(
    Math.max(Math.floor(prompt.length * 0.15), 10),
    200
  )
  const previewText = prompt.slice(0, previewLength)

  return (
    <div>
      {unlocked && (
        <CopyPromptButton text={prompt} className="mb-8 w-full sm:w-auto" />
      )}

      <p className="text-surface-500 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
        <MessageSquare className="h-3.5 w-3.5" />
        입력 프롬프트
      </p>

      <div className="relative overflow-hidden rounded-xl border border-white/20">
        {unlocked ? (
          <pre className="text-surface-200 bg-surface-900/50 max-h-48 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {prompt}
          </pre>
        ) : (
          <>
            <div className="bg-surface-900/50 select-none">
              <pre className="text-surface-200 p-4 pb-0 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {previewText}
              </pre>
              <pre
                className="text-surface-200 px-4 pt-1 pb-4 font-mono text-sm leading-relaxed whitespace-pre-wrap select-none"
                style={{
                  filter: 'blur(4px)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {prompt.slice(previewLength, previewLength + 300)}
              </pre>
            </div>
            <div className="bg-surface-800/70 flex flex-col items-center gap-2.5 border-t border-white/20 px-4 py-4 text-center backdrop-blur-sm">
              <div className="bg-surface-700/50 flex h-9 w-9 items-center justify-center rounded-xl">
                <Lock className="text-surface-300 h-4 w-4" />
              </div>
              <div>
                <p className="text-surface-300 text-xs font-medium">
                  유료 프롬프트입니다
                </p>
                <p className="text-surface-500 mt-0.5 text-[11px]">
                  {price.toLocaleString()}원으로 전체 내용을 확인하세요
                </p>
              </div>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={onRequestUnlock}
                  className="bg-brand-500 hover:bg-brand-400 flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {price.toLocaleString()}원으로 구매하기
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-brand-500 hover:bg-brand-400 flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  로그인 후 구매하기
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── PromptStepsViewer ─────────────────────────────────────────────────────────
export function PromptStepsViewer({
  steps,
  price,
  canViewFull,
  isLoggedIn,
  postId,
  title,
  userId,
  onStepChange,
}: Readonly<{
  steps: PromptStep[]
  price: number
  canViewFull: boolean
  isLoggedIn: boolean
  postId: number
  title: string
  userId: string
  /** 스텝 변경 시 상단 갤러리에 표시할 미디어 URL 목록을 전달하는 콜백 */
  onStepChange?: (outputMedia: string[], inputMedia: string[]) => void
}>) {
  const [activeStep, setActiveStep] = useState(0)
  const [unlocked, setUnlocked] = useState(canViewFull)
  const [showModal, setShowModal] = useState(false)

  if (steps.length === 0) return null

  const step = steps[activeStep]
  const isFree = price === 0

  const handleStepChange = (idx: number) => {
    setActiveStep(idx)
    const targetStep = steps[idx]
    // 결과물 미디어 우선, 없으면 입력 미디어
    const mediaToShow =
      targetStep.output_media.length > 0
        ? targetStep.output_media
        : targetStep.input_media
    onStepChange?.(targetStep.output_media, targetStep.input_media)
  }

  return (
    <>
      <div className="bg-surface-800/25 overflow-hidden rounded-2xl border border-white/20">
        {/* 스텝 탭 */}
        {steps.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto border-b border-white/20 px-4 py-2">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStepChange(idx)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  idx === activeStep
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-surface-400 hover:text-surface-200'
                )}
              >
                Step {s.step_order}
              </button>
            ))}
          </div>
        )}

        {/* 스텝 콘텐츠 */}
        <div className="space-y-5 p-5">
          {/* AI 정보 */}
          <div className="flex flex-wrap gap-2">
            {step.ai_type && (
              <span className="bg-surface-700/50 text-surface-300 rounded-lg px-2.5 py-1 text-xs">
                {step.ai_type}
              </span>
            )}
            {step.ai_version && (
              <span className="bg-surface-700/50 text-surface-300 rounded-lg px-2.5 py-1 text-xs">
                {step.ai_version}
              </span>
            )}
          </div>

          {/* 입력 프롬프트 */}
          <StepInputPrompt
            prompt={step.input_prompt}
            unlocked={isFree || unlocked}
            price={price}
            isLoggedIn={isLoggedIn}
            onRequestUnlock={() => setShowModal(true)}
          />

          {/* 출력 텍스트 */}
          {step.output_text && (isFree || unlocked) && (
            <div>
              <p className="text-surface-500 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <FileText className="h-3.5 w-3.5" />
                출력 결과
              </p>
              <pre className="text-surface-200 bg-surface-900/50 max-h-48 overflow-auto rounded-xl border border-white/20 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {step.output_text}
              </pre>
            </div>
          )}

          {/* 미디어 안내 */}
          {(step.output_media.length > 0 || step.input_media.length > 0) && (
            <div className="bg-surface-800/20 flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5">
              <Sparkles className="text-brand-400 h-3.5 w-3.5 shrink-0" />
              <p className="text-surface-400 text-xs">
                이 스텝의 미디어는 상단 갤러리에서 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* 도트 페이지네이션 */}
        {steps.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 border-t border-white/20 px-5 py-3">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStepChange(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  idx === activeStep
                    ? 'bg-brand-500 w-5'
                    : 'bg-surface-600 hover:bg-surface-500 w-1.5'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 해금 모달 */}
      {showModal && (
        <UnlockModal
          postId={postId}
          title={title}
          price={price}
          userId={userId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setUnlocked(true)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}
