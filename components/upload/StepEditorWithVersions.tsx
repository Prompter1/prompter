'use client'

/**
 * StepEditor — AI 선택 시 해당 AI의 버전만 표시하는 업데이트 버전
 *
 * 기존 UploadForm.tsx 의 StepEditor 컴포넌트를 교체하세요.
 * useAiVersionMap 훅으로 카탈로그에서 버전을 동적으로 로드합니다.
 */

import { FileText } from 'lucide-react'
import { AI_TOOL_OPTIONS } from '@/src/lib/taxonomy'
import { useAiVersionMap, registerAiVersion } from '@/hooks/useAiVersionMap'
import type { MediaPreview } from '@/types/index'

const MAX_RESULT_MEDIA_FILES = 5

interface StepData {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: MediaPreview[]
  outputText: string
  outputMedia: MediaPreview[]
}

interface StepEditorProps {
  step: StepData
  stepIndex: number
  totalSteps: number
  onChange: (field: keyof StepData, value: string) => void
  onAddMedia: (kind: 'input' | 'output', files: FileList) => void
  onRemoveMedia: (kind: 'input' | 'output', idx: number) => void
  disabled: boolean
}

export function StepEditorWithVersions({
  step,
  stepIndex,
  onChange,
  onAddMedia,
  onRemoveMedia,
  disabled,
}: Readonly<StepEditorProps>) {
  const { map: versionMap } = useAiVersionMap()

  // 선택된 AI의 버전 목록 (카탈로그 + 직접 입력)
  const availableVersions = step.aiType ? (versionMap[step.aiType] ?? []) : []

  // AI 변경 시 버전 초기화
  const handleAiChange = (value: string) => {
    onChange('aiType', value)
    onChange('aiVersion', '')
  }

  // 버전 선택
  const handleVersionSelect = (version: string) => {
    onChange('aiVersion', version)
  }

  // 커스텀 버전 추가

  return (
    <div className="space-y-5">
      {/* AI 종류 선택 */}
      <div>
        <label className="text-foreground/90 mb-2 block text-sm font-medium">
          AI 종류 <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AI_TOOL_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleAiChange(opt)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                step.aiType === opt
                  ? 'border-brand-500/60 bg-brand-500/15 text-brand-300'
                  : 'border-border/50 bg-surface-800/50 text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {/* 직접 입력 */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={step.aiType}
            onChange={(e) => handleAiChange(e.target.value)}
            placeholder="목록에 없으면 직접 입력"
            className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full rounded-xl border px-3.5 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* AI 버전 선택 */}
      <div>
        <label className="text-foreground/90 mb-2 block text-sm font-medium">
          AI 버전 <span className="text-red-400">*</span>
          {step.aiType && (
            <span className="text-surface-500 ml-2 font-normal">
              ({step.aiType} 버전)
            </span>
          )}
        </label>

        {step.aiType ? (
          <>
            {availableVersions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableVersions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleVersionSelect(v)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      step.aiVersion === v
                        ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                        : 'border-border/50 bg-surface-800/50 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-surface-500 text-xs">
                {step.aiType}의 버전이 아직 없습니다. 아래에서 직접 추가하세요.
              </p>
            )}

            {/* 커스텀 버전 추가 */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={step.aiVersion}
                onChange={(e) => onChange('aiVersion', e.target.value)}
                onBlur={async () => {
                  if (step.aiVersion && step.aiType) {
                    await registerAiVersion(step.aiType, step.aiVersion)
                  }
                }}
                placeholder={`새 버전 입력 후 포커스 해제 시 자동 저장`}
                className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground w-full rounded-xl border px-3.5 py-2 text-sm outline-none focus:border-amber-500/60"
              />
            </div>
          </>
        ) : (
          <p className="text-surface-500 bg-surface-800/30 border-surface-700 rounded-xl border border-dashed px-4 py-3 text-xs">
            먼저 AI 종류를 선택하세요.
          </p>
        )}
      </div>

      {/* 입력 프롬프트 */}
      <div>
        <label className="text-foreground/90 mb-2 block text-sm font-medium">
          입력 프롬프트 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={step.inputPrompt}
          onChange={(e) => onChange('inputPrompt', e.target.value)}
          placeholder="AI에 입력한 프롬프트를 그대로 붙여넣으세요"
          rows={5}
          className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 focus:ring-brand-500/20 w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none focus:ring-1"
        />
      </div>

      {/* 결과 텍스트 */}
      <div>
        <label className="text-foreground/90 mb-2 flex items-center gap-1.5 text-sm font-medium">
          <FileText className="text-surface-400 h-4 w-4" />
          결과 텍스트{' '}
          <span className="text-muted-foreground font-normal">(선택)</span>
        </label>
        <textarea
          value={step.outputText}
          onChange={(e) => onChange('outputText', e.target.value)}
          placeholder="AI가 출력한 텍스트 결과물을 붙여넣으세요 (선택)"
          rows={4}
          className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 focus:ring-brand-500/20 w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none focus:ring-1"
        />
      </div>
    </div>
  )
}
