'use client'

import {
  BarChart2,
  TrendingUp,
  Coins,
  Eye,
  Sparkles,
  Users,
  User,
} from 'lucide-react'
import Image from 'next/image'
import type { PromptPost } from '@/types'
import type { BuyerRecord } from '@/components/mypage/MyPageContent'

interface StatsTabProps {
  prompts: PromptPost[]
  isLoading: boolean
  totalRevenue: number
  buyers: BuyerRecord[]
}

export function StatsTab({
  prompts,
  isLoading,
  totalRevenue,
  buyers,
}: StatsTabProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Sparkles className="text-surface-600 h-8 w-8 animate-spin" />
      </div>
    )
  }

  // 통계 계산
  const totalPrompts = prompts.length
  const paidPrompts = prompts.filter((p) => p.price > 0)
  const freePrompts = prompts.filter((p) => p.price === 0)
  const totalPotentialRevenue = paidPrompts.reduce((sum, p) => sum + p.price, 0)
  const avgPrice =
    paidPrompts.length > 0
      ? Math.round(totalPotentialRevenue / paidPrompts.length)
      : 0

  const statCards = [
    {
      icon: BarChart2,
      label: '등록한 프롬프트',
      value: `${totalPrompts}개`,
      sub: `유료 ${paidPrompts.length}개 · 무료 ${freePrompts.length}개`,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
    },
    {
      icon: Coins,
      label: '평균 판매가',
      value: avgPrice > 0 ? `${avgPrice.toLocaleString()}원` : '-',
      sub: '유료 프롬프트 기준',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: TrendingUp,
      label: '누적 정산 수익',
      value: totalRevenue > 0 ? `${totalRevenue.toLocaleString()}P` : '-',
      sub: '수수료 공제 후',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Eye,
      label: '조회수',
      value: prompts
        .reduce((sum, prompt) => sum + (prompt.view_count ?? 0), 0)
        .toLocaleString(),
      sub: '내 프롬프트 전체',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
  ]

  return (
    <div>
      {/* 통계 카드 그리드 */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div
            key={label}
            className="border-surface-700/50 bg-surface-800/60 rounded-2xl border p-6"
          >
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-surface-400 text-xs font-medium">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-surface-500 mt-1 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* 하단: 유료 프롬프트 목록 + 구매자 목록 (2열) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 유료 프롬프트 목록 */}
        {paidPrompts.length > 0 ? (
          <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border">
            <div className="border-surface-700/50 border-b px-6 py-4">
              <h3 className="text-sm font-semibold text-white">
                유료 프롬프트 목록
              </h3>
            </div>
            <ul className="divide-surface-700/50 divide-y">
              {paidPrompts.map((prompt) => (
                <li
                  key={prompt.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {prompt.title}
                    </p>
                    <div className="mt-1 flex gap-1.5">
                      {prompt.ai_types.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="bg-surface-700 text-surface-300 rounded-full px-2 py-0.5 text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {prompt.price.toLocaleString()}P
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed">
            <TrendingUp className="text-surface-600 mb-3 h-8 w-8" />
            <p className="text-sm">등록된 유료 프롬프트가 없습니다.</p>
          </div>
        )}

        {/* 구매자 목록 */}
        <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border">
          <div className="border-surface-700/50 flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-sm font-semibold text-white">구매자 목록</h3>
            {buyers.length > 0 && (
              <span className="bg-surface-700 text-surface-300 rounded-full px-2.5 py-0.5 text-xs">
                총 {buyers.length}건
              </span>
            )}
          </div>

          {buyers.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2">
              <Users className="text-surface-600 h-8 w-8" />
              <p className="text-surface-400 text-sm">
                아직 구매자가 없습니다.
              </p>
            </div>
          ) : (
            <ul className="divide-surface-700/50 max-h-96 divide-y overflow-y-auto">
              {buyers.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 px-6 py-3.5">
                  {/* 아바타 */}
                  <div className="border-surface-600 relative h-8 w-8 shrink-0 overflow-hidden rounded-full border">
                    {tx.buyer?.avatar_url ? (
                      <Image
                        src={tx.buyer.avatar_url}
                        alt={tx.buyer.nickname ?? '구매자'}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-surface-700 flex h-full w-full items-center justify-center">
                        <User className="text-surface-400 h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* 구매자명 + 프롬프트 */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {tx.buyer?.nickname ?? '알 수 없음'}
                    </p>
                    <p className="text-surface-400 truncate text-xs">
                      {tx.prompt?.title ?? '삭제된 프롬프트'}
                      <span className="text-surface-500 ml-1">
                        ({(tx.prompt?.price ?? tx.amount).toLocaleString()}원)
                      </span>
                    </p>
                  </div>

                  {/* 날짜 */}
                  <time className="text-surface-500 shrink-0 text-xs">
                    {new Date(tx.created_at).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
