'use client'

import Link from 'next/link'
import { Clock, Download, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react'
import type { PurchaseTransaction } from '@/components/mypage/MyPageContent'

interface PurchasesTabProps {
  purchases: PurchaseTransaction[]
  isLoading: boolean
}

function expiryDate(createdAt: string) {
  const d = new Date(createdAt)
  d.setFullYear(d.getFullYear() + 1)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function handleDownload(postId: number, title: string | null) {
  const res = await fetch(`/api/download/prompt/${postId}`)
  if (!res.ok) return
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title ?? `prompt-${postId}`}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export function PurchasesTab({
  purchases,
  isLoading,
}: Readonly<PurchasesTabProps>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Sparkles className="text-surface-600 h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (purchases.length === 0) {
    return (
      <div className="border-surface-700 bg-surface-800/30 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
        <div className="bg-surface-700/50 mb-4 rounded-2xl p-4">
          <ShoppingBag className="text-surface-500 h-8 w-8" />
        </div>
        <p className="font-medium text-white">구매 내역이 없습니다</p>
        <p className="text-surface-400 mt-1.5 flex items-center gap-1.5 text-sm">
          <Clock className="h-3.5 w-3.5" />
          마음에 드는 유료 프롬프트를 구매하여 해금해보세요.
        </p>
        <Link
          href="/prompt?sort=popular"
          className="bg-brand-500 hover:bg-brand-400 mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          인기 프롬프트 보기
        </Link>
      </div>
    )
  }

  return (
    <div className="border-surface-700/50 bg-surface-800/50 overflow-hidden rounded-2xl border">
      <div className="border-surface-700/50 flex items-center justify-between border-b px-6 py-4">
        <h3 className="text-sm font-semibold text-white">구매 내역</h3>
        <span className="text-surface-500 text-xs">{purchases.length}건</span>
      </div>
      <ul className="divide-surface-700/50 divide-y">
        {purchases.map((tx) => {
          const purchasedDate = new Date(tx.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          const title = tx.prompt_post?.title ?? null

          return (
            <li key={tx.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {title ?? `프롬프트 #${tx.prompt_post_id}`}
                </p>
                <p className="text-surface-500 mt-1 text-xs">구매일: {purchasedDate}</p>
                <p className="text-surface-600 mt-0.5 flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  플랫폼 이용 만료: {expiryDate(tx.created_at)} · 다운로드 시 영구 이용
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="text-right">
                  <p className="text-brand-400 text-sm font-bold">
                    {tx.amount.toLocaleString()}원
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(tx.prompt_post_id, title)}
                    className="border-surface-600 text-surface-300 hover:bg-surface-700 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    다운로드
                  </button>
                  <Link
                    href={`/prompt/${tx.prompt_post_id}`}
                    className="border-surface-600 text-surface-300 hover:bg-surface-700 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                  >
                    열기
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
