'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  X,
  ImageIcon,
  Video,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileText,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { uploadMediaFile, isAllowedMediaType } from '@/src/lib/storage'
import {
  AI_TOOL_OPTIONS,
  AI_VERSION_OPTIONS,
  CONTENT_CATEGORY_OPTIONS,
} from '@/src/lib/taxonomy'
import { formatMediaFile, TARGET_IMAGE_SIZE_MB } from '@/src/lib/mediaFormatter'
import { cn } from '@/src/lib/utils'

const MAX_RESULT_MEDIA_FILES = 5
const MAX_STEPS = 10

// ── 타입 ──────────────────────────────────────────────
// 기존 URL 또는 새로 업로드할 파일
interface MediaItem {
  /** 이미 업로드된 URL (기존 미디어) */
  existingUrl?: string
  /** 새로 추가된 파일 */
  file?: File
  previewUrl: string
  type: 'image' | 'video'
  wasCompressed?: boolean
  compressionRatio?: number
  isExisting: boolean
}

interface StepData {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: MediaItem[]
  outputText: string
  outputMedia: MediaItem[]
}

interface InitialStepData {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: string[]
  outputText: string
  outputMedia: string[]
}

interface InitialData {
  postId: number
  title: string
  content: string
  price: number
  ai_types: string[]
  ai_versions: string[]
  categories: string[]
  steps: InitialStepData[]
}

type UploadStatus = 'idle' | 'formatting' | 'uploading' | 'success' | 'error'

function isVideoUrl(url: string) {
  return /\.(mp4|webm)$/i.test(url)
}

function urlToMediaItem(url: string): MediaItem {
  return {
    existingUrl: url,
    previewUrl: url,
    type: isVideoUrl(url) ? 'video' : 'image',
    isExisting: true,
  }
}

function initialStepToStepData(s: InitialStepData): StepData {
  return {
    aiType: s.aiType,
    aiVersion: s.aiVersion,
    inputPrompt: s.inputPrompt,
    inputMedia: s.inputMedia.map(urlToMediaItem),
    outputText: s.outputText,
    outputMedia: s.outputMedia.map(urlToMediaItem),
  }
}

// ── TagSelector ─────────────────────────────────────────
function TagSelector({
  label,
  options,
  selected,
  onChange,
  placeholder = '목록에 없는 항목 직접 추가',
}: Readonly<{
  label: string
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
  placeholder?: string
}>) {
  const [customValue, setCustomValue] = useState('')
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    )
  const addCustom = () => {
    const value = customValue.trim()
    if (!value) return
    if (!selected.includes(value)) onChange([...selected, value])
    setCustomValue('')
  }
  return (
    <div>
      <label className="text-foreground/90 mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
              selected.includes(opt)
                ? 'border-brand-500/60 bg-brand-500/15 text-brand-300'
                : 'border-border/50 bg-surface-800/50 text-muted-foreground hover:border-border hover:text-foreground'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
          placeholder={placeholder}
          className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 focus:ring-brand-500/20 min-w-0 flex-1 rounded-xl border px-3.5 py-2 text-sm outline-none focus:ring-1"
        />
        <button
          type="button"
          onClick={addCustom}
          className="border-border/50 bg-surface-800/70 text-surface-200 hover:border-brand-500/50 inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors hover:text-white"
        >
          <Plus className="h-4 w-4" />
          추가
        </button>
      </div>
    </div>
  )
}

// ── ProgressBar ──────────────────────────────────────────
function ProgressBar({
  progress,
  label,
}: Readonly<{ progress: number; label?: string }>) {
  return (
    <div className="card-premium rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground/80 text-sm font-medium">
          {label ?? '처리 중...'}
        </span>
        <span className="text-brand-400 text-sm font-bold">{progress}%</span>
      </div>
      <div className="bg-surface-700/50 h-2 w-full overflow-hidden rounded-full">
        <div
          className="from-brand-500 to-brand-400 h-full rounded-full bg-linear-to-r transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ── MediaDropZone ────────────────────────────────────────
function MediaDropZone({
  items,
  onAdd,
  onRemove,
  disabled,
  title = '미디어',
  sizeHint,
  maxFiles = 5,
}: Readonly<{
  items: MediaItem[]
  onAdd: (files: FileList) => void
  onRemove: (idx: number) => void
  disabled?: boolean
  title?: string
  sizeHint?: ReactNode
  maxFiles?: number
}>) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label className="text-foreground/90 mb-2 block text-sm font-medium">
        {title}{' '}
        <span className="text-muted-foreground font-normal">{sizeHint}</span>
      </label>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'border-border/50 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 transition-all',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-brand-500/40 hover:bg-surface-800/50 cursor-pointer'
        )}
      >
        <Upload className="text-muted-foreground mb-2 h-5 w-5" />
        <p className="text-foreground/80 text-sm font-medium">
          클릭하여 파일 추가
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && onAdd(e.target.files)}
        />
      </div>
      {items.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border-surface-700 bg-surface-800 group relative aspect-square overflow-hidden rounded-xl border"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.previewUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <Video className="text-surface-400 h-5 w-5" />
                  <span className="text-surface-500 px-1 text-center text-[10px]">
                    {item.isExisting ? '기존 영상' : item.file?.name}
                  </span>
                </div>
              )}
              {item.isExisting && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5">
                  <span className="text-[9px] text-blue-400">기존</span>
                </div>
              )}
              {item.wasCompressed && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5">
                  <Scissors className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400">
                    {Math.round((1 - (item.compressionRatio ?? 1)) * 100)}% 압축
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(idx)
                }}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          ))}
          {items.length < maxFiles && !disabled && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border-surface-700 hover:border-brand-500/50 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed transition-colors"
            >
              <Plus className="text-surface-500 h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── StepEditor ────────────────────────────────────────────
function StepEditor({
  step,
  stepIndex,
  onChange,
  onAddMedia,
  onRemoveMedia,
  disabled,
}: Readonly<{
  step: StepData
  stepIndex: number
  onChange: (field: keyof StepData, value: string) => void
  onAddMedia: (kind: 'input' | 'output', files: FileList) => void
  onRemoveMedia: (kind: 'input' | 'output', idx: number) => void
  disabled: boolean
}>) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-foreground/90 mb-2 block text-sm font-medium">
            AI 종류 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            list={`ai-type-list-${stepIndex}`}
            value={step.aiType}
            onChange={(e) => onChange('aiType', e.target.value)}
            placeholder="예: Midjourney"
            className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
          />
          <datalist id={`ai-type-list-${stepIndex}`}>
            {AI_TOOL_OPTIONS.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-foreground/90 mb-2 block text-sm font-medium">
            AI 버전 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            list={`ai-version-list-${stepIndex}`}
            value={step.aiVersion}
            onChange={(e) => onChange('aiVersion', e.target.value)}
            placeholder="예: v6.1"
            className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
          />
          <datalist id={`ai-version-list-${stepIndex}`}>
            {AI_VERSION_OPTIONS.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="text-foreground/90 mb-2 block text-sm font-medium">
          입력 프롬프트 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={step.inputPrompt}
          onChange={(e) => onChange('inputPrompt', e.target.value)}
          placeholder="AI에 입력한 프롬프트를 그대로 붙여넣으세요"
          rows={5}
          className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none"
        />
      </div>

      <MediaDropZone
        items={step.inputMedia}
        onAdd={(files) => onAddMedia('input', files)}
        onRemove={(idx) => onRemoveMedia('input', idx)}
        disabled={disabled}
        title="입력 미디어"
        sizeHint={<>(선택)</>}
        maxFiles={MAX_RESULT_MEDIA_FILES}
      />

      <div>
        <label className="text-foreground/90 mb-2 flex items-center gap-1.5 text-sm font-medium">
          <FileText className="text-surface-400 h-4 w-4" />
          결과 텍스트{' '}
          <span className="text-muted-foreground font-normal">(선택)</span>
        </label>
        <textarea
          value={step.outputText}
          onChange={(e) => onChange('outputText', e.target.value)}
          placeholder="AI가 출력한 텍스트 결과물 (선택)"
          rows={4}
          className="border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none"
        />
      </div>

      <MediaDropZone
        items={step.outputMedia}
        onAdd={(files) => onAddMedia('output', files)}
        onRemove={(idx) => onRemoveMedia('output', idx)}
        disabled={disabled}
        title="결과물 미디어"
        sizeHint={
          <>
            (선택 · 최대 {MAX_RESULT_MEDIA_FILES}개 · {TARGET_IMAGE_SIZE_MB}MB
            초과 시 자동 압축)
          </>
        }
        maxFiles={MAX_RESULT_MEDIA_FILES}
      />
    </div>
  )
}

// ── EditForm (메인) ────────────────────────────────────────
export function EditForm({
  initialData,
}: Readonly<{ initialData: InitialData }>) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState(initialData.title)
  const [content, setContent] = useState(initialData.content || '')
  const [categories, setCategories] = useState<string[]>(initialData.categories)
  const [steps, setSteps] = useState<StepData[]>(
    initialData.steps.length > 0
      ? initialData.steps.map(initialStepToStepData)
      : [
          {
            aiType: '',
            aiVersion: '',
            inputPrompt: '',
            inputMedia: [],
            outputText: '',
            outputMedia: [],
          },
        ]
  )
  const [activeStep, setActiveStep] = useState(0)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isBusy =
    status === 'formatting' || status === 'uploading' || status === 'success'

  // ── 미디어 처리 ──
  const processMediaFiles = useCallback(
    async (
      files: FileList,
      current: MediaItem[],
      maxFiles: number,
      labelPrefix: string
    ): Promise<MediaItem[]> => {
      const remaining = maxFiles - current.length
      const incoming = Array.from(files).slice(0, remaining)
      const results: MediaItem[] = []

      for (const file of incoming) {
        if (!isAllowedMediaType(file)) continue
        const isVideo = file.type.startsWith('video/')
        setStatus('formatting')
        setProgress(0)
        setProgressLabel(
          `${labelPrefix}${file.name} ${isVideo ? '트리밍' : '압축'} 중...`
        )

        const result = await formatMediaFile(file, (p) => setProgress(p))
        setStatus('idle')
        setProgress(0)
        setProgressLabel('')

        results.push({
          file: result.file,
          previewUrl: URL.createObjectURL(result.file),
          type: result.file.type.startsWith('video/') ? 'video' : 'image',
          wasCompressed: result.wasCompressed,
          compressionRatio: result.compressionRatio,
          isExisting: false,
        })
      }
      return results
    },
    []
  )

  const handleAddStepMedia = useCallback(
    async (stepIdx: number, kind: 'input' | 'output', files: FileList) => {
      const step = steps[stepIdx]
      const current = kind === 'input' ? step.inputMedia : step.outputMedia
      const newItems = await processMediaFiles(
        files,
        current,
        MAX_RESULT_MEDIA_FILES,
        `[스텝 ${stepIdx + 1}] `
      )
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i !== stepIdx) return s
          return kind === 'input'
            ? { ...s, inputMedia: [...s.inputMedia, ...newItems] }
            : { ...s, outputMedia: [...s.outputMedia, ...newItems] }
        })
      )
    },
    [steps, processMediaFiles]
  )

  const handleRemoveStepMedia = useCallback(
    (stepIdx: number, kind: 'input' | 'output', idx: number) => {
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i !== stepIdx) return s
          if (kind === 'input') {
            const item = s.inputMedia[idx]
            if (!item.isExisting && item.previewUrl)
              URL.revokeObjectURL(item.previewUrl)
            return {
              ...s,
              inputMedia: s.inputMedia.filter((_, j) => j !== idx),
            }
          }
          const item = s.outputMedia[idx]
          if (!item.isExisting && item.previewUrl)
            URL.revokeObjectURL(item.previewUrl)
          return {
            ...s,
            outputMedia: s.outputMedia.filter((_, j) => j !== idx),
          }
        })
      )
    },
    []
  )

  const addStep = () => {
    if (steps.length >= MAX_STEPS) return
    setSteps((prev) => [
      ...prev,
      {
        aiType: '',
        aiVersion: '',
        inputPrompt: '',
        inputMedia: [],
        outputText: '',
        outputMedia: [],
      },
    ])
    setActiveStep(steps.length)
  }

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return
    setSteps((prev) => prev.filter((_, i) => i !== idx))
    setActiveStep(Math.min(activeStep, steps.length - 2))
  }

  const updateStep = (idx: number, field: keyof StepData, value: string) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    )
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = '제목을 입력해주세요.'
    if (categories.length === 0)
      errors.categories = '카테고리를 1개 이상 선택해주세요.'
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i]
      if (!s.aiType.trim())
        errors[`step_${i}_aiType`] = `스텝 ${i + 1}: AI 종류를 입력해주세요.`
      if (!s.aiVersion.trim())
        errors[`step_${i}_aiVersion`] = `스텝 ${i + 1}: AI 버전을 입력해주세요.`
      if (!s.inputPrompt.trim())
        errors[`step_${i}_prompt`] =
          `스텝 ${i + 1}: 입력 프롬프트를 입력해주세요.`
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validate()) return

    setStatus('uploading')
    setProgress(0)
    setErrorMsg('')

    try {
      // 새 미디어 파일 업로드 + 기존 URL 유지
      const uploadedSteps: {
        aiType: string
        aiVersion: string
        inputPrompt: string
        inputMedia: string[]
        outputText: string
        outputMedia: string[]
      }[] = []

      const newFileCount = steps.reduce(
        (acc, s) =>
          acc +
          s.inputMedia.filter((m) => !m.isExisting).length +
          s.outputMedia.filter((m) => !m.isExisting).length,
        0
      )
      const totalUploads = Math.max(newFileCount, 1)
      let done = 0

      const bumpProgress = () => {
        done += 1
        setProgress(Math.min(90, Math.round((done / totalUploads) * 90)))
      }

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i]
        const inputUrls: string[] = []
        const outputUrls: string[] = []

        for (const item of s.inputMedia) {
          if (item.isExisting && item.existingUrl) {
            inputUrls.push(item.existingUrl)
          } else if (item.file) {
            setProgressLabel(
              `스텝 ${i + 1} 입력 미디어 업로드 — ${item.file.name}`
            )
            const { url } = await uploadMediaFile(item.file, user.id)
            inputUrls.push(url)
            bumpProgress()
          }
        }

        for (const item of s.outputMedia) {
          if (item.isExisting && item.existingUrl) {
            outputUrls.push(item.existingUrl)
          } else if (item.file) {
            setProgressLabel(
              `스텝 ${i + 1} 결과물 미디어 업로드 — ${item.file.name}`
            )
            const { url } = await uploadMediaFile(item.file, user.id)
            outputUrls.push(url)
            bumpProgress()
          }
        }

        uploadedSteps.push({
          aiType: s.aiType.trim(),
          aiVersion: s.aiVersion.trim(),
          inputPrompt: s.inputPrompt.trim(),
          inputMedia: inputUrls,
          outputText: s.outputText.trim(),
          outputMedia: outputUrls,
        })
      }

      const aiTypes = [
        ...new Set(uploadedSteps.map((s) => s.aiType).filter(Boolean)),
      ]
      const aiVersions = [
        ...new Set(uploadedSteps.map((s) => s.aiVersion).filter(Boolean)),
      ]

      // 마지막 스텝의 마지막 output_media를 썸네일(result_media)로
      const allOutputMedia = uploadedSteps.flatMap((s) => s.outputMedia)
      const representativeMedia =
        allOutputMedia.length > 0 ? [allOutputMedia.at(-1)] : []

      setProgressLabel('저장 중...')
      setProgress(91)

      const res = await fetch('/api/prompt/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: initialData.postId,
          title: title.trim(),
          content: content,
          price: initialData.price,
          ai_types: aiTypes,
          ai_versions: aiVersions,
          categories,
          result_media: representativeMedia.map((url) => ({
            type: 'image',
            url,
            name: '',
          })),
          steps: uploadedSteps,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? '수정에 실패했습니다.')

      setProgress(100)
      setStatus('success')
      setTimeout(() => router.push(`/prompt/${initialData.postId}`), 1200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message : '수정 중 오류가 발생했습니다.'
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-8 px-4 py-28"
    >
      {/* 헤더 */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-surface-400 hover:text-surface-200 mb-4 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </button>
        <h1 className="text-foreground text-2xl font-bold">프롬프트 수정</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          내용을 수정하고 저장하세요. 가격 변경은 지원되지 않습니다.
        </p>
      </div>

      {/* 제목 */}
      <div>
        <label className="text-foreground/90 mb-2 block text-sm font-medium">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프롬프트 제목"
          maxLength={100}
          className={cn(
            'border-border/50 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-500/60 w-full rounded-xl border px-4 py-3 text-sm outline-none',
            fieldErrors.title && 'border-red-500/60'
          )}
        />
        {fieldErrors.title && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-surface-200 text-sm font-medium">
          한줄 소개
        </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="한 줄 소개를 수정하세요"
          className="border-surface-700 bg-surface-800 placeholder:text-surface-500 focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border px-4 py-3 text-sm text-white focus:ring-1 focus:outline-none"
          required
        />
      </div>
      {/* 카테고리 */}
      <div>
        <TagSelector
          label="카테고리 *"
          options={CONTENT_CATEGORY_OPTIONS}
          selected={categories}
          onChange={setCategories}
        />
        {fieldErrors.categories && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.categories}
          </p>
        )}
      </div>

      {/* 스텝 에디터 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-foreground/90 text-sm font-medium">
            AI 활용 단계{' '}
            <span className="text-muted-foreground font-normal">
              ({steps.length}/{MAX_STEPS})
            </span>
          </label>
          {steps.length < MAX_STEPS && (
            <button
              type="button"
              onClick={addStep}
              disabled={isBusy}
              className="border-brand-500/40 text-brand-300 hover:bg-brand-500/10 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              스텝 추가
            </button>
          )}
        </div>

        {steps.length > 1 && (
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                  activeStep === idx
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800/50 text-surface-300 hover:bg-surface-700'
                )}
              >
                STEP {idx + 1}
              </button>
            ))}
          </div>
        )}

        <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-surface-400 hover:text-surface-200 rounded-lg p-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <h3 className="text-sm font-semibold text-white">
                STEP {activeStep + 1}
                {steps[activeStep].aiType && (
                  <span className="text-brand-400 ml-2 font-normal">
                    — {steps[activeStep].aiType}
                  </span>
                )}
              </h3>
              {activeStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="text-surface-400 hover:text-surface-200 rounded-lg p-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(activeStep)}
                className="text-surface-500 flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                삭제
              </button>
            )}
          </div>

          <StepEditor
            step={steps[activeStep]}
            stepIndex={activeStep}
            onChange={(field, value) => updateStep(activeStep, field, value)}
            onAddMedia={(kind, files) =>
              handleAddStepMedia(activeStep, kind, files)
            }
            onRemoveMedia={(kind, idx) =>
              handleRemoveStepMedia(activeStep, kind, idx)
            }
            disabled={isBusy}
          />
        </div>

        {steps.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  idx === activeStep
                    ? 'bg-brand-500 w-6'
                    : 'bg-surface-600 hover:bg-surface-500 w-2'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 진행률 */}
      {(status === 'formatting' || status === 'uploading') && (
        <ProgressBar progress={progress} label={progressLabel} />
      )}

      {/* 에러 */}
      {status === 'error' && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* 성공 */}
      {status === 'success' && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-400">
            수정 완료! 상세 페이지로 이동합니다...
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isBusy}
          className="border-surface-600 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-4 text-sm font-medium transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isBusy}
          className={cn(
            'relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-sm font-semibold text-white transition-all',
            isBusy
              ? 'bg-surface-700/50 text-muted-foreground cursor-not-allowed'
              : 'from-brand-500 to-brand-600 shadow-brand-500/20 bg-linear-to-r shadow-lg hover:scale-[1.01]'
          )}
        >
          {status === 'formatting' || status === 'uploading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="h-4 w-4" />
              저장 완료
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              수정 저장하기
            </>
          )}
        </button>
      </div>
    </form>
  )
}
