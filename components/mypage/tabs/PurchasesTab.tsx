'use client'

import Link from 'next/link'
import { Clock, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react'
import type { PurchaseTransaction } from '@/components/mypage/MyPageContent'

interface PurchasesTabProps {
  purchases: PurchaseTransaction[]
  isLoading: boolean
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
          마음에 드는 유료 프롬프트를 크레딧으로 해금해보세요.
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
          const date = new Date(tx.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })

          return (
            <li
              key={tx.id}
              className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  프롬프트 #{tx.prompt_post_id}
                </p>
                <p className="text-surface-500 mt-1 text-xs">{date}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="text-brand-400 text-sm font-bold">
                    {tx.amount.toLocaleString()}P
                  </p>
                  <p className="text-surface-500 text-xs">
                    수수료 {tx.fee.toLocaleString()}P
                  </p>
                </div>
                <Link
                  href={`/prompt/${tx.prompt_post_id}`}
                  className="border-surface-600 text-surface-300 hover:bg-surface-700 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                >
                  열기
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
