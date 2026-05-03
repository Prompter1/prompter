'use client'

import { BarChart2, TrendingUp, Coins, Eye, Sparkles } from 'lucide-react'
import type { PromptPost } from '@/types'

interface StatsTabProps {
  prompts: PromptPost[]
  isLoading: boolean
}

export function StatsTab({ prompts, isLoading }: StatsTabProps) {
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
      label: '예상 총 수익',
      value:
        totalPotentialRevenue > 0
          ? `${totalPotentialRevenue.toLocaleString()}원`
          : '-',
      sub: '판매가 합산 기준',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Eye,
      label: '조회수',
      value: '-',
      sub: '준비 중',
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

      {/* 프롬프트별 수익 리스트 */}
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
                  {prompt.price.toLocaleString()}원
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
    </div>
  )
}
