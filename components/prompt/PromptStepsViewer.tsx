'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Sparkles,
  Video,
} from 'lucide-react'
import { cn } from '@/src/lib/utils'

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

function isVideo(url: string) {
  return /\.(mp4|webm)$/i.test(url)
}

function MediaGrid({
  urls,
  label,
}: Readonly<{ urls: string[]; label: string }>) {
  const [active, setActive] = useState(0)
  if (urls.length === 0) return null

  const current = urls[Math.min(active, urls.length - 1)]
  return (
    <div className="space-y-2">
      <p className="text-surface-500 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="border-surface-700/50 bg-surface-900/40 relative aspect-video overflow-hidden rounded-xl border">
        {isVideo(current) ? (
          <video
            src={current}
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <Image
            src={current}
            alt={label}
            fill
            className="object-contain"
            sizes="600px"
          />
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {urls.map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                'border-surface-600 relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                active === idx
                  ? 'border-brand-500'
                  : 'opacity-60 hover:opacity-90'
              )}
            >
              {isVideo(url) ? (
                <div className="bg-surface-800 flex h-full items-center justify-center">
                  <Video className="text-surface-400 h-4 w-4" />
                </div>
              ) : (
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PromptStepsViewer({
  steps,
}: Readonly<{ steps: PromptStep[] }>) {
  const [activeStep, setActiveStep] = useState(0)

  if (steps.length === 0) return null

  const step = steps[activeStep]

  return (
    <div className="border-surface-700/50 bg-surface-800/25 rounded-2xl border">
      {/* 헤더 + 탭 */}
      <div className="border-surface-700/50 border-b px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-400 h-4 w-4" />
            <span className="text-surface-300 text-sm font-medium">
              AI 활용 단계
            </span>
            <span className="text-surface-500 text-xs">
              ({steps.length}단계)
            </span>
          </div>
          {steps.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="text-surface-400 hover:text-surface-200 rounded p-1 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-surface-400 text-xs">
                {activeStep + 1} / {steps.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                }
                disabled={activeStep === steps.length - 1}
                className="text-surface-400 hover:text-surface-200 rounded p-1 transition-colors disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 스텝 탭 */}
        {steps.length > 1 && (
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                  activeStep === idx
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-700/50 text-surface-400 hover:bg-surface-700 hover:text-surface-200'
                )}
              >
                STEP {idx + 1}
                {s.ai_type && (
                  <span className="ml-1 opacity-70">· {s.ai_type}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 스텝 내용 */}
      <div className="space-y-5 p-5">
        {/* AI 정보 */}
        <div className="flex flex-wrap gap-2">
          {step.ai_type && (
            <span className="border-brand-500/30 bg-brand-500/10 text-brand-300 rounded-full border px-3 py-1 text-xs font-semibold">
              {step.ai_type}
            </span>
          )}
          {step.ai_version && (
            <span className="border-surface-600 bg-surface-700/50 text-surface-300 rounded-full border px-3 py-1 text-xs font-semibold">
              {step.ai_version}
            </span>
          )}
        </div>

        {/* 입력 미디어 */}
        {step.input_media.length > 0 && (
          <MediaGrid urls={step.input_media} label="입력 미디어" />
        )}

        {/* 입력 프롬프트 */}
        {step.input_prompt && (
          <div>
            <p className="text-surface-500 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <MessageSquare className="h-3.5 w-3.5" />
              입력 프롬프트
            </p>
            <pre className="text-surface-200 bg-surface-900/50 max-h-48 overflow-auto rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {step.input_prompt}
            </pre>
          </div>
        )}

        {/* 결과 텍스트 */}
        {step.output_text && (
          <div>
            <p className="text-surface-500 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <FileText className="h-3.5 w-3.5" />
              결과 텍스트
            </p>
            <pre className="text-surface-200 bg-surface-900/50 max-h-48 overflow-auto rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {step.output_text}
            </pre>
          </div>
        )}

        {/* 결과물 미디어 */}
        {step.output_media.length > 0 && (
          <MediaGrid urls={step.output_media} label="결과물 미디어" />
        )}
      </div>

      {/* 스텝 도트 페이지네이션 */}
      {steps.length > 1 && (
        <div className="border-surface-700/50 flex items-center justify-center gap-1.5 border-t px-5 py-3">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStep(idx)}
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
  )
}
