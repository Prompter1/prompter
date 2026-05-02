'use client'

import { useState, useRef, useCallback } from 'react'
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
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { uploadMediaFile, isAllowedMediaType } from '@/src/lib/storage'
import { createPromptPost } from '@/src/lib/prompts'
import {
  formatMediaFile,
  formatFileSize,
  TARGET_IMAGE_SIZE_MB,
} from '@/src/lib/mediaFormatter'
import { cn } from '@/src/lib/utils'

// ── 상수 ──────────────────────────────────────────────
const AI_TYPE_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Midjourney',
  'Stable Diffusion',
  'DALL-E',
  'Gemini',
  'Runway',
  'Sora',
]

const CATEGORY_OPTIONS = [
  'Art',
  'Coding',
  'Writing',
  'Marketing',
  'Game',
  'Education',
  'Business',
  'Other',
]

// ── 타입 ──────────────────────────────────────────────
interface MediaPreview {
  file: File // 포매팅 완료된 최종 파일
  originalFile: File // 원본 (크기 비교용)
  previewUrl: string
  type: 'image' | 'video'
  wasCompressed: boolean
  compressionRatio: number
}

type UploadStatus = 'idle' | 'formatting' | 'uploading' | 'success' | 'error'

// ── TagSelector ────────────────────────────────────────
function TagSelector({
  label,
  options,
  selected,
  onChange,
}: Readonly<{
  label: string
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
}>) {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    )

  return (
    <div>
      <label className="text-surface-200 mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              selected.includes(opt)
                ? 'bg-brand-500/20 border-brand-500/60 text-brand-300'
                : 'border-surface-600 bg-surface-800 text-surface-400 hover:border-surface-500 hover:text-surface-200'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── ProgressBar ────────────────────────────────────────
function ProgressBar({
  progress,
  label,
}: Readonly<{ progress: number; label?: string }>) {
  return (
    <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-surface-300 text-sm font-medium">
          {label ?? '처리 중...'}
        </span>
        <span className="text-brand-400 text-sm font-bold">{progress}%</span>
      </div>
      <div className="bg-surface-700 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-brand-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ── MediaDropZone ──────────────────────────────────────
function MediaDropZone({
  previews,
  onAdd,
  onRemove,
  error,
  disabled,
}: Readonly<{
  previews: MediaPreview[]
  onAdd: (files: FileList) => void
  onRemove: (idx: number) => void
  error?: string
  disabled?: boolean
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
      <label className="text-surface-200 mb-2 block text-sm font-medium">
        결과물 미디어{' '}
        <span className="text-surface-500 font-normal">
          (선택, 최대 5개 · {TARGET_IMAGE_SIZE_MB}MB 초과 시 자동 압축)
        </span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'border-surface-600 bg-surface-800/50 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-brand-500/50 hover:bg-surface-800 cursor-pointer',
          error && 'border-red-500/50'
        )}
      >
        <div className="bg-surface-700/50 mb-3 rounded-xl p-3">
          <Upload className="text-surface-400 h-6 w-6" />
        </div>
        <p className="text-surface-300 text-sm font-medium">
          클릭하거나 파일을 드래그하세요
        </p>
        <p className="text-surface-500 mt-1 text-xs">
          이미지 및 영상 → WebP 압축 / 5초 트리밍
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

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
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
                  <Video className="text-surface-400 h-6 w-6" />
                  <span className="text-surface-500 px-1 text-center text-[10px] leading-tight">
                    {p.file.name}
                  </span>
                </div>
              )}

              {/* 압축 뱃지 */}
              {p.wasCompressed && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5">
                  <Scissors className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400">
                    {Math.round((1 - p.compressionRatio) * 100)}% 압축
                  </span>
                </div>
              )}

              {/* 파일 크기 */}
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

          {previews.length < 5 && !disabled && (
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

// ── UploadForm (메인) ──────────────────────────────────
export function UploadForm() {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [aiTypes, setAiTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([])
  const [mediaError, setMediaError] = useState('')
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // ── 파일 추가 → 포매팅 → 미리보기 등록 ──
  const handleAddFiles = useCallback(
    async (files: FileList) => {
      setMediaError('')
      const remaining = 5 - mediaPreviews.length
      const incoming = Array.from(files).slice(0, remaining)

      for (const file of incoming) {
        if (!isAllowedMediaType(file)) {
          setMediaError(`${file.name}: 지원하지 않는 파일 형식입니다.`)
          continue
        }

        const isVideo = file.type.startsWith('video/')
        setStatus('formatting')
        setProgress(0)
        setProgressLabel(`${file.name} ${isVideo ? '트리밍' : '압축'} 중...`)

        const result = await formatMediaFile(file, (p) => setProgress(p))

        setStatus('idle')
        setProgress(0)
        setProgressLabel('')

        setMediaPreviews((prev) => [
          ...prev,
          {
            file: result.file,
            originalFile: file,
            previewUrl: URL.createObjectURL(result.file),
            type: result.file.type.startsWith('video/') ? 'video' : 'image',
            wasCompressed: result.wasCompressed,
            compressionRatio: result.compressionRatio,
          },
        ])
      }
    },
    [mediaPreviews.length]
  )

  // ── 파일 제거 ──
  const handleRemoveFile = useCallback((idx: number) => {
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }, [])

  // ── 유효성 검사 ──
  const validate = () => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = '제목을 입력해주세요.'
    if (title.length > 100) errors.title = '제목은 100자 이내로 입력해주세요.'
    if (!content.trim()) errors.content = '프롬프트 내용을 입력해주세요.'
    if (aiTypes.length === 0)
      errors.aiTypes = 'AI 종류를 1개 이상 선택해주세요.'
    if (categories.length === 0)
      errors.categories = '카테고리를 1개 이상 선택해주세요.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── 제출 ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validate()) return

    setStatus('uploading')
    setProgress(0)
    setErrorMsg('')

    try {
      const mediaUrls: string[] = []
      const totalFiles = mediaPreviews.length

      for (let i = 0; i < totalFiles; i++) {
        const preview = mediaPreviews[i]
        setProgressLabel(
          `업로드 중 (${i + 1}/${totalFiles}) — ${preview.file.name}`
        )

        const { url } = await uploadMediaFile(preview.file, user.id, (p) => {
          const base = (i / Math.max(totalFiles, 1)) * 90
          setProgress(
            Math.round(base + (p / 100) * (90 / Math.max(totalFiles, 1)))
          )
        })
        mediaUrls.push(url)
      }

      setProgress(94)
      setProgressLabel('프롬프트 저장 중...')

      await createPromptPost({
        title: title.trim(),
        content: content.trim(),
        price: 0,
        ai_types: aiTypes,
        categories,
        author_id: user.id,
        result_media: mediaPreviews.map((p, idx) => ({
          type: p.type,
          url: mediaUrls[idx],
          name: p.file.name,
        })),
        is_verified: false,
      })

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

  const isBusy =
    status === 'formatting' || status === 'uploading' || status === 'success'

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-8 px-4 py-28"
    >
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">프롬프트 등록</h1>
        <p className="text-surface-400 mt-1 text-sm">
          무료 프롬프트를 등록하고 커뮤니티와 공유하세요.
        </p>
      </div>

      {/* 제목 */}
      <div>
        <label className="text-surface-200 mb-2 block text-sm font-medium">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프롬프트 제목을 입력하세요"
          maxLength={100}
          className={cn(
            'border-surface-600 bg-surface-800 placeholder-surface-500 focus:border-brand-500/70 w-full rounded-xl border px-4 py-3 text-sm text-white transition-colors outline-none',
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

      {/* 프롬프트 내용 */}
      <div>
        <label className="text-surface-200 mb-2 block text-sm font-medium">
          프롬프트 내용 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="프롬프트 내용을 입력하세요. AI에 입력할 텍스트를 그대로 붙여넣어도 됩니다."
          rows={8}
          className={cn(
            'border-surface-600 bg-surface-800 placeholder-surface-500 focus:border-brand-500/70 w-full resize-none rounded-xl border px-4 py-3 text-sm text-white transition-colors outline-none',
            fieldErrors.content && 'border-red-500/60'
          )}
        />
        {fieldErrors.content && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.content}
          </p>
        )}
      </div>

      {/* AI 종류 */}
      <div>
        <TagSelector
          label="AI 종류 *"
          options={AI_TYPE_OPTIONS}
          selected={aiTypes}
          onChange={setAiTypes}
        />
        {fieldErrors.aiTypes && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.aiTypes}
          </p>
        )}
      </div>

      {/* 카테고리 */}
      <div>
        <TagSelector
          label="카테고리 *"
          options={CATEGORY_OPTIONS}
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

      {/* 미디어 업로드 */}
      <MediaDropZone
        previews={mediaPreviews}
        onAdd={handleAddFiles}
        onRemove={handleRemoveFile}
        error={mediaError}
        disabled={isBusy}
      />

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
            등록 완료! 마이페이지로 이동합니다...
          </p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isBusy}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all',
          isBusy
            ? 'bg-surface-700 text-surface-400 cursor-not-allowed'
            : 'bg-brand-500 hover:bg-brand-600 hover:shadow-brand-500/20 hover:shadow-lg'
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
