'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Pencil, Loader2, AlertTriangle, X } from 'lucide-react'

interface PromptOwnerActionsProps {
  postId: number
  title: string
}

function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
  isDeleting,
}: Readonly<{
  title: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="border-surface-700/50 bg-surface-800 relative w-full max-w-md rounded-3xl border p-6 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="text-surface-400 hover:text-surface-200 absolute top-4 right-4 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="mb-1 text-center text-lg font-bold text-white">
          프롬프트 삭제
        </h2>
        <p className="text-surface-400 mb-1 line-clamp-2 text-center text-sm">
          &ldquo;{title}&rdquo;
        </p>
        <p className="text-surface-500 mb-6 text-center text-xs">
          삭제하면 복구할 수 없습니다. 구매자들의 접근도 차단됩니다.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="border-surface-600 text-surface-300 hover:bg-surface-700 flex-1 rounded-xl border py-3 text-sm font-medium transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            삭제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export function PromptOwnerActions({ postId, title }: PromptOwnerActionsProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)

    const res = await fetch('/api/prompt/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error ?? '삭제에 실패했습니다.')
      setIsDeleting(false)
      return
    }

    router.push('/mypage')
    router.refresh()
  }

  return (
    <>
      <div className="border-surface-700/50 bg-surface-800/40 flex items-center gap-2 rounded-2xl border p-3">
        <span className="text-surface-400 mr-1 text-xs font-medium">
          내 프롬프트
        </span>
        <button
          type="button"
          onClick={() => router.push(`/prompt/${postId}/edit`)}
          className="border-surface-600 bg-surface-700/50 hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-300 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium text-white transition-all"
        >
          <Pencil className="h-3.5 w-3.5" />
          수정
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="border-surface-600 bg-surface-700/50 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          삭제
        </button>
      </div>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {showDeleteModal && (
        <DeleteConfirmModal
          title={title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
