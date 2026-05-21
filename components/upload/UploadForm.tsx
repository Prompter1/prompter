'use client'

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
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
  Banknote,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldAlert,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import {
  uploadMediaFile,
  uploadEvidenceFile,
  isAllowedMediaType,
} from '@/src/lib/storage'
import { createVerificationRequest } from '@/src/lib/verification-requests'
import { AI_TOOL_OPTIONS, CONTENT_CATEGORY_OPTIONS } from '@/src/lib/taxonomy'
import {
  formatMediaFile,
  formatFileSize,
  VERIFICATION_EVIDENCE_MAX_VIDEO_SEC,
} from '@/src/lib/mediaFormatter'
import { cn } from '@/src/lib/utils'

const MIN_PRICE_WON = 100
const MAX_PRICE_WON = 50_000_000
const MAX_RESULT_MEDIA_FILES = 5
const MAX_EVIDENCE_FILES = 10
const MAX_STEPS = 10

function parsePriceWon(raw: string): number | null {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return null
  const n = Number.parseInt(digits, 10)
  return Number.isFinite(n) ? n : null
}

// ── 타입 ──────────────────────────────────────────────
interface MediaPreview {
  file: File
  originalFile: File
  previewUrl: string
  type: 'image' | 'video'
  wasCompressed: boolean
  compressionRatio: number
}

interface StepData {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: MediaPreview[]
  outputText: string
  outputMedia: MediaPreview[]
}

function emptyStep(): StepData {
  return {
    aiType: '',
    aiVersion: '',
    inputPrompt: '',
    inputMedia: [],
    outputText: '',
    outputMedia: [],
  }
}

type UploadStatus = 'idle' | 'formatting' | 'uploading' | 'success' | 'error'

// ── AdultContentToggle ───────────────────────────────
function AdultContentToggle({
  checked,
  onChange,
  disabled,
}: Readonly<{
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}>) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all',
        checked
          ? 'border-red-500/40 bg-red-500/5'
          : 'border-surface-700/50 bg-surface-800/30'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            checked ? 'bg-red-500/20' : 'bg-surface-700/50'
          )}
        >
          <ShieldAlert
            className={cn(
              'h-5 w-5',
              checked ? 'text-red-400' : 'text-surface-400'
            )}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                성인 컨텐츠 (19+)
              </p>
              <p className="text-surface-400 mt-0.5 text-xs">
                성인용 이미지·영상·프롬프트를 포함하는 경우 체크하세요.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onChange(!checked)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none',
                checked ? 'bg-red-500' : 'bg-surface-600',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  checked ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {checked && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-200">
                성인 컨텐츠로 표시된 게시물의 결과물 미디어는 미인증 사용자에게
                블러 처리되며, 만 19세 이상 인증 후 열람 가능합니다. 허위
                표시·미표시 시 계정이 제재될 수 있으며, 범죄에 활용될 수 있는
                컨텐츠는 엄격히 금지됩니다. 자세한 내용은{' '}
                <a href="/footer/faq" className="underline">
                  FAQ
                </a>
                를 참고하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
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
                : 'border-surface-600 bg-surface-800/50 text-muted-foreground hover:border-surface-400 hover:text-foreground'
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
          className="border-surface-600 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-400 focus:ring-brand-500/20 min-w-0 flex-1 rounded-xl border px-3.5 py-2 text-sm transition-colors outline-none focus:ring-1"
        />
        <button
          type="button"
          onClick={addCustom}
          className="border-surface-600 bg-surface-800/70 text-surface-200 hover:border-brand-500/50 inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors hover:text-white"
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
  previews,
  onAdd,
  onRemove,
  error,
  disabled,
  title = '미디어',
  sizeHint,
  footnote = '이미지 및 영상 → WebP 압축 / 5초 트리밍',
  maxFiles = 5,
}: Readonly<{
  previews: MediaPreview[]
  onAdd: (files: FileList) => void
  onRemove: (idx: number) => void
  error?: string
  disabled?: boolean
  title?: string
  sizeHint?: ReactNode
  footnote?: string
  maxFiles?: number
}>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled && e.dataTransfer.files.length) onAdd(e.dataTransfer.files)
    },
    [onAdd, disabled]
  )
  return (
    <div>
      <label className="text-foreground/90 mb-2 block text-sm font-medium">
        {title}{' '}
        <span className="text-muted-foreground font-normal">{sizeHint}</span>
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'border-surface-600 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-brand-500/40 hover:bg-surface-800/50 cursor-pointer',
          error && 'border-red-500/50'
        )}
      >
        <div className="bg-surface-700/50 mb-3 rounded-xl p-3">
          <Upload className="text-muted-foreground h-5 w-5" />
        </div>
        <p className="text-foreground/80 text-sm font-medium">
          클릭하거나 파일을 드래그하세요
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{footnote}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && onAdd(e.target.files)}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {previews.map((p, idx) => (
            <div
              key={idx}
              className="border-surface-700 bg-surface-800 group relative aspect-square overflow-hidden rounded-xl border"
            >
              {p.type === 'image' ? (
                <Image
                  src={p.previewUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <Video className="text-surface-400 h-5 w-5" />
                  <span className="text-surface-500 px-1 text-center text-[10px]">
                    {p.file.name}
                  </span>
                </div>
              )}
              {p.wasCompressed && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5">
                  <Scissors className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400">
                    {Math.round((1 - p.compressionRatio) * 100)}% 압축
                  </span>
                </div>
              )}
              <div className="absolute top-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5">
                <span className="text-[9px] text-white">
                  {formatFileSize(p.file.size)}
                </span>
              </div>
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
          {previews.length < maxFiles && !disabled && (
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
  const [versionOptions, setVersionOptions] = useState<string[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchVersions = async () => {
      const ai = step.aiType.trim()
      if (!ai) {
        setVersionOptions([])
        return
      }
      setLoadingVersions(true)
      try {
        const res = await fetch(
          `/api/ai-versions?ai=${encodeURIComponent(ai)}`,
          { cache: 'no-store' }
        )
        const data = await res.json().catch(() => ({}))
        if (!cancelled)
          setVersionOptions(Array.isArray(data.versions) ? data.versions : [])
      } catch {
        if (!cancelled) setVersionOptions([])
      } finally {
        if (!cancelled) setLoadingVersions(false)
      }
    }
    fetchVersions()
    return () => {
      cancelled = true
    }
  }, [step.aiType])

  useEffect(() => {
    onChange('aiVersion', '')
  }, [step.aiType])

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
            placeholder="예: ChatGPT, Midjourney (또는 직접 입력)"
            className="border-surface-600 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-400 w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors outline-none"
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
            placeholder={
              step.aiType
                ? loadingVersions
                  ? '버전 불러오는 중...'
                  : '해당 AI 버전 선택 (또는 직접 입력)'
                : 'AI 종류 먼저 선택'
            }
            disabled={!step.aiType.trim()}
            className="border-surface-600 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-400 w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors outline-none disabled:opacity-50"
          />
          <datalist id={`ai-version-list-${stepIndex}`}>
            {versionOptions.map((v) => (
              <option key={v} value={v} />
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
          rows={5}
          placeholder="AI에 입력한 프롬프트"
          className="border-surface-600 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-400 w-full resize-none rounded-xl border px-3.5 py-3 text-sm transition-colors outline-none"
        />
      </div>

      <MediaDropZone
        previews={step.inputMedia}
        onAdd={(files) => onAddMedia('input', files)}
        onRemove={(idx) => onRemoveMedia('input', idx)}
        disabled={disabled}
        title="입력 미디어 (프롬프트와 함께 넣은 미디어가 있을 시 반드시 함께 올려주세요)"
        maxFiles={5}
      />

      <div>
        <label className="text-foreground/90 mb-2 text-sm font-medium">
          결과 텍스트
        </label>
        <textarea
          value={step.outputText}
          onChange={(e) => onChange('outputText', e.target.value)}
          rows={4}
          placeholder="AI 출력 결과"
          className="border-surface-600 bg-surface-800/50 text-foreground placeholder-muted-foreground focus:border-brand-400 w-full resize-none rounded-xl border px-3.5 py-3 text-sm transition-colors outline-none"
        />
      </div>

      <MediaDropZone
        previews={step.outputMedia}
        onAdd={(files) => onAddMedia('output', files)}
        onRemove={(idx) => onRemoveMedia('output', idx)}
        disabled={disabled}
        title="결과물 미디어"
        maxFiles={5}
      />
    </div>
  )
}

// ── UploadForm (메인) ────────────────────────────────────
export function UploadForm() {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [isPaidSale, setIsPaidSale] = useState(false)
  const [priceInput, setPriceInput] = useState('')
  const [evidencePreviews, setEvidencePreviews] = useState<MediaPreview[]>([])
  const [evidenceError, setEvidenceError] = useState('')
  const [isAdult, setIsAdult] = useState(false) // ✅ 성인 컨텐츠 토글

  const [steps, setSteps] = useState<StepData[]>([emptyStep()])
  const [activeStep, setActiveStep] = useState(0)

  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isBusy =
    status === 'formatting' || status === 'uploading' || status === 'success'

  useEffect(() => {
    if (!isPaidSale) {
      setEvidencePreviews((prev) => {
        for (const p of prev) URL.revokeObjectURL(p.previewUrl)
        return []
      })
      setEvidenceError('')
      setPriceInput('')
    }
  }, [isPaidSale])

  const addStep = () => {
    if (steps.length >= MAX_STEPS) return
    setSteps((prev) => [...prev, emptyStep()])
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

  const processMediaFiles = useCallback(
    async (
      files: FileList,
      current: MediaPreview[],
      maxFiles: number,
      labelPrefix: string,
      opts?: { maxTrimSeconds?: number }
    ): Promise<MediaPreview[]> => {
      const remaining = maxFiles - current.length
      const incoming = Array.from(files).slice(0, remaining)
      const results: MediaPreview[] = []

      for (const file of incoming) {
        if (!isAllowedMediaType(file)) continue
        const isVideo = file.type.startsWith('video/')
        setStatus('formatting')
        setProgress(0)
        setProgressLabel(
          `${labelPrefix}${file.name} ${isVideo ? '트리밍' : '압축'} 중...`
        )

        const result = await formatMediaFile(file, (p) => setProgress(p), opts)
        setStatus('idle')
        setProgress(0)
        setProgressLabel('')

        results.push({
          file: result.file,
          originalFile: file,
          previewUrl: URL.createObjectURL(result.file),
          type: result.file.type.startsWith('video/') ? 'video' : 'image',
          wasCompressed: result.wasCompressed,
          compressionRatio: result.compressionRatio,
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
      const newPreviews = await processMediaFiles(
        files,
        current,
        MAX_RESULT_MEDIA_FILES,
        `[스텝 ${stepIdx + 1}] `
      )
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i !== stepIdx) return s
          return kind === 'input'
            ? { ...s, inputMedia: [...s.inputMedia, ...newPreviews] }
            : { ...s, outputMedia: [...s.outputMedia, ...newPreviews] }
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
            URL.revokeObjectURL(s.inputMedia[idx].previewUrl)
            return {
              ...s,
              inputMedia: s.inputMedia.filter((_, j) => j !== idx),
            }
          }
          URL.revokeObjectURL(s.outputMedia[idx].previewUrl)
          return {
            ...s,
            outputMedia: s.outputMedia.filter((_, j) => j !== idx),
          }
        })
      )
    },
    []
  )

  const handleAddEvidenceFiles = useCallback(
    async (files: FileList) => {
      setEvidenceError('')
      const newPreviews = await processMediaFiles(
        files,
        evidencePreviews,
        MAX_EVIDENCE_FILES,
        '[증빙] ',
        { maxTrimSeconds: VERIFICATION_EVIDENCE_MAX_VIDEO_SEC }
      )
      setEvidencePreviews((prev) => [...prev, ...newPreviews])
    },
    [evidencePreviews, processMediaFiles]
  )

  const handleRemoveEvidence = useCallback((idx: number) => {
    setEvidencePreviews((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }, [])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = '제목을 입력해주세요.'
    if (title.length > 100) errors.title = '제목은 100자 이내로 입력해주세요.'
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

    if (isPaidSale) {
      const price = parsePriceWon(priceInput)
      if (price == null) errors.price = '판매 가격을 입력해주세요.'
      else if (price < MIN_PRICE_WON)
        errors.price = `가격은 ${MIN_PRICE_WON.toLocaleString()}원 이상이어야 합니다.`
      else if (price > MAX_PRICE_WON)
        errors.price = `가격은 ${MAX_PRICE_WON.toLocaleString()}원 이하여야 합니다.`
    }

    setFieldErrors(errors)
    for (let i = 0; i < steps.length; i++) {
      if (
        errors[`step_${i}_aiType`] ||
        errors[`step_${i}_aiVersion`] ||
        errors[`step_${i}_prompt`]
      ) {
        setActiveStep(i)
        break
      }
    }
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validate()) return

    setStatus('uploading')
    setProgress(0)
    setErrorMsg('')

    try {
      const priceWon = isPaidSale ? (parsePriceWon(priceInput) ?? 0) : 0

      const totalMediaCount =
        steps.reduce(
          (acc, s) => acc + s.inputMedia.length + s.outputMedia.length,
          0
        ) + (isPaidSale ? evidencePreviews.length : 0)
      const totalUploads = Math.max(totalMediaCount, 1)
      let done = 0

      const bumpProgress = () => {
        done += 1
        setProgress(Math.min(90, Math.round((done / totalUploads) * 90)))
      }

      const uploadedSteps: {
        aiType: string
        aiVersion: string
        inputPrompt: string
        inputMedia: string[]
        outputText: string
        outputMedia: string[]
      }[] = []

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i]
        const inputUrls: string[] = []
        const outputUrls: string[] = []

        for (const p of s.inputMedia) {
          setProgressLabel(`스텝 ${i + 1} 입력 미디어 업로드 — ${p.file.name}`)
          const { url } = await uploadMediaFile(p.file, user.id)
          inputUrls.push(url)
          bumpProgress()
        }

        for (const p of s.outputMedia) {
          setProgressLabel(
            `스텝 ${i + 1} 결과물 미디어 업로드 — ${p.file.name}`
          )
          const { url } = await uploadMediaFile(p.file, user.id)
          outputUrls.push(url)
          bumpProgress()
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
      const representativeMedia = uploadedSteps
        .flatMap((s) => s.outputMedia)
        .slice(0, 5)

      setProgressLabel('프롬프트 저장 중...')
      setProgress(91)

      const createRes = await fetch('/api/prompt/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content,
          price: priceWon,
          ai_types: aiTypes,
          ai_versions: aiVersions,
          categories,
          result_media: representativeMedia.map((url) => ({
            type: 'image',
            url,
            name: '',
          })),
          is_verified: false,
          is_adult: isAdult, // ✅ 성인 컨텐츠 여부 전송
          steps: uploadedSteps,
        }),
      })
      const createData = await createRes.json().catch(() => ({}))
      if (!createRes.ok)
        throw new Error(createData.error ?? '프롬프트 저장에 실패했습니다.')
      const postId: number = createData.id

      if (isPaidSale && evidencePreviews.length > 0) {
        const evidencePaths: string[] = []
        for (let i = 0; i < evidencePreviews.length; i++) {
          const p = evidencePreviews[i]
          setProgressLabel(
            `증빙 업로드 (${i + 1}/${evidencePreviews.length}) — ${p.file.name}`
          )
          const { path } = await uploadEvidenceFile(p.file, user.id)
          evidencePaths.push(path)
          bumpProgress()
        }
        setProgressLabel('검수 요청 등록 중...')
        setProgress(96)
        await createVerificationRequest({
          prompt_post_id: postId,
          author_id: user.id,
          evidence_paths: evidencePaths,
        })
      }

      setProgress(100)
      setStatus('success')
      setTimeout(() => router.push('/mypage'), 1500)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.'
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-6/12 space-y-8 px-4 py-28"
    >
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">프롬프트 등록</h1>
        <p className="text-surface-400 mt-2 text-sm">
          {isPaidSale
            ? '유료로 판매할 프롬프트입니다. 검수 통과 후 노출됩니다.'
            : '무료 프롬프트를 등록하고 커뮤니티와 공유하세요.'}
        </p>
      </div>

      {/* 무료/유료 토글 */}
      <div>
        <label className="mb-3 block text-sm font-medium text-white">
          등록 방식
        </label>
        <div className="border-surface-600 bg-surface-800/50 flex rounded-2xl border p-1">
          {[
            { label: '무료 공유', paid: false },
            { label: '유료 판매', paid: true },
          ].map(({ label, paid }) => (
            <button
              key={label}
              type="button"
              onClick={() => setIsPaidSale(paid)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all',
                isPaidSale === paid
                  ? 'from-brand-500 to-brand-600 shadow-brand-500/20 bg-linear-to-r text-white shadow-lg'
                  : 'text-surface-400 hover:text-white'
              )}
            >
              {paid && <Banknote className="h-4 w-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 유료 판매 설정 */}
      {isPaidSale && (
        <div className="card-premium border-brand-500/30 bg-surface-900/40 space-y-5 rounded-2xl border p-6">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-white"
            >
              판매 가격 (원) <span className="text-red-400">*</span>
            </label>
            <input
              id="price"
              type="text"
              inputMode="numeric"
              placeholder={`예: ${(5000).toLocaleString()}`}
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className={cn(
                'border-brand-500/60 bg-surface-800 placeholder-surface-500 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-xl border px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2',
                fieldErrors.price && 'border-red-500/60'
              )}
            />
            {fieldErrors.price && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {fieldErrors.price}
              </p>
            )}
          </div>
          <MediaDropZone
            previews={evidencePreviews}
            onAdd={handleAddEvidenceFiles}
            onRemove={handleRemoveEvidence}
            error={evidenceError || fieldErrors.evidence}
            disabled={isBusy}
            title="증빙 스크린샷 혹은 영상 (선택)"
            sizeHint={
              <>
                해당 프롬프트를 AI에 넣은 모습과 결과물을 스크린샷 혹은 영상으로
                올리세요. <br />
                첨부 시 관리자 심사를 거쳐 <strong>검수 혜택</strong>을 받을 수
                있습니다. 검수 혜택에 대한 자세한 내용은{' '}
                <a href="/footer/faq" className="underline">
                  FAQ
                </a>
                를 참고하세요.
              </>
            }
            footnote={`이미지 또는 영상 · 영상은 최대 ${VERIFICATION_EVIDENCE_MAX_VIDEO_SEC}초`}
            maxFiles={MAX_EVIDENCE_FILES}
          />
        </div>
      )}

      {/* 제목 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프롬프트 제목을 입력하세요"
          maxLength={100}
          className={cn(
            'border-brand-500/60 bg-surface-800 placeholder-surface-500 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-xl border px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2',
            fieldErrors.title && 'border-red-500/60'
          )}
        />
        <div className="mt-1 flex items-center justify-between">
          {fieldErrors.title ? (
            <p className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.title}
            </p>
          ) : (
            <span />
          )}
          <span className="text-surface-500 text-xs">{title.length}/100</span>
        </div>
      </div>

      {/* 한줄 소개 */}
      <div className="space-y-2">
        <label className="mb-2 block text-sm font-medium text-white">
          한줄 소개 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="프롬프트를 한 줄로 간단하게 설명해주세요 (검색 결과에 노출됩니다)"
          className="border-brand-500/60 bg-surface-800 placeholder-surface-500 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-xl border px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2"
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
          placeholder="예: 패션, 건축, 데이터 분석"
        />
        {fieldErrors.categories && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.categories}
          </p>
        )}
      </div>

      {/* ✅ 성인 컨텐츠 토글 */}
      <AdultContentToggle
        checked={isAdult}
        onChange={setIsAdult}
        disabled={isBusy}
      />

      {/* 스텝 에디터 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">
            AI 활용 단계{' '}
            <span className="text-surface-400 font-normal">
              ({steps.length}/{MAX_STEPS})
            </span>
          </label>
          {steps.length < MAX_STEPS && (
            <button
              type="button"
              onClick={addStep}
              disabled={isBusy}
              className="border-brand-500/40 text-brand-400 hover:bg-brand-500/10 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              스텝 추가
            </button>
          )}
        </div>

        {steps.length > 1 && (
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all',
                  activeStep === idx
                    ? 'bg-brand-500 border-brand-400 shadow-brand-500/20 text-white shadow-lg'
                    : 'bg-surface-800 border-surface-600 text-surface-400 hover:border-surface-500 hover:text-white'
                )}
              >
                STEP {idx + 1}
                {(fieldErrors[`step_${idx}_aiType`] ||
                  fieldErrors[`step_${idx}_aiVersion`] ||
                  fieldErrors[`step_${idx}_prompt`]) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="border-surface-600 bg-surface-800/30 rounded-2xl border p-5 shadow-inner">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-surface-400 rounded-lg p-1 transition-colors hover:text-white"
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
                  className="text-surface-400 rounded-lg p-1 transition-colors hover:text-white"
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

          {(fieldErrors[`step_${activeStep}_aiType`] ||
            fieldErrors[`step_${activeStep}_aiVersion`] ||
            fieldErrors[`step_${activeStep}_prompt`]) && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5">
              {(['aiType', 'aiVersion', 'prompt'] as const).map((k) =>
                fieldErrors[`step_${activeStep}_${k}`] ? (
                  <p
                    key={k}
                    className="flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldErrors[`step_${activeStep}_${k}`]}
                  </p>
                ) : null
              )}
            </div>
          )}

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
                  'h-1.5 rounded-full transition-all',
                  idx === activeStep
                    ? 'bg-brand-500 w-6'
                    : 'bg-surface-600 hover:bg-surface-500 w-1.5'
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
          <p className="text-sm font-medium text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* 성공 */}
      {status === 'success' && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm font-medium text-emerald-400">
            {isPaidSale
              ? '등록 완료! 검수 요청이 접수되었습니다.'
              : '등록 완료!'}{' '}
            마이페이지로 이동합니다...
          </p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isBusy}
        className={cn(
          'relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-sm font-bold text-white transition-all',
          isBusy
            ? 'bg-surface-700/50 text-surface-500 border-surface-600 cursor-not-allowed border'
            : 'from-brand-500 to-brand-600 shadow-brand-500/30 hover:shadow-brand-500/40 bg-linear-to-r shadow-lg hover:scale-[1.01] hover:brightness-110'
        )}
      >
        {status === 'formatting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            미디어 처리 중...
          </>
        ) : status === 'uploading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            업로드 중...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            등록 완료
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            프롬프트 등록하기
          </>
        )}
      </button>
    </form>
  )
}
