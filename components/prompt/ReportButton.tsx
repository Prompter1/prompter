'use client'

import { useState } from 'react'
import { Flag, X, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface ReportButtonProps {
  postId: number
  userId: string
}

export function ReportButton({ postId, userId }: Readonly<ReportButtonProps>) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { success, error: toastError } = useToast()

  if (!userId) return null

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: content.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? '신고 처리에 실패했습니다.')
      }
      success('신고 완료', '신고가 접수되었습니다.')
      setOpen(false)
      setContent('')
    } catch (err) {
      toastError('오류', err instanceof Error ? err.message : '신고 처리에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-surface-500 hover:text-red-400 flex items-center gap-1.5 text-xs transition-colors"
      >
        <Flag className="h-3.5 w-3.5" />
        신고
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-md rounded-3xl border p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-surface-400 hover:text-surface-200 absolute top-4 right-4 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/15">
                <Flag className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-white">게시물 신고</h2>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="신고 사유를 입력해주세요. (스팸, 불법 콘텐츠, 저작권 침해 등)"
              rows={4}
              maxLength={500}
              className="border-surface-700/50 bg-surface-900/50 placeholder-surface-500 focus:border-brand-500/60 focus:ring-brand-500/20 w-full resize-none rounded-2xl border px-4 py-3 text-sm text-white outline-none focus:ring-2"
            />
            <p className="mt-1 text-right text-xs text-surface-600">
              {content.length}/500
            </p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-surface-600 bg-surface-700 hover:bg-surface-600 flex-1 rounded-2xl border py-3 text-sm font-semibold text-surface-300 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
