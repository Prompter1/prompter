'use client'

import {
  BarChart2,
  TrendingUp,
  Coins,
  Eye,
  Sparkles,
  Users,
  User,
  ArrowRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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

      {/* 정산 받기 CTA 배너 */}
      <div className="border-brand-500/20 bg-brand-500/5 mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-surface-100 font-semibold">
            누적 정산 수익 확인 및 정산 신청
          </p>
          <p className="text-surface-400 mt-0.5 text-sm">
            수수료 안내, 세무 처리, 정산 주기 등 정산 상세 정보를 확인하세요.
          </p>
        </div>
        <Link
          href="/mypage/settlement"
          className="bg-brand-500 hover:bg-brand-400 inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          정산 받기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 하단: 유료 프롬프트 목록 + 구매자 목록 (2열) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 유료 프롬프트 목록 */}
        {paidPrompts.length > 0 ? (
          <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border">
            <div className="border-surface-700/50 border-b px-4 py-3">
              <h3 className="text-surface-100 text-sm font-semibold">
                유료 프롬프트 목록
              </h3>
            </div>
            <ul className="divide-surface-700/40 divide-y">
              {paidPrompts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="text-surface-200 line-clamp-1 text-sm">
                    {p.title}
                  </span>
                  <span className="text-brand-400 shrink-0 text-sm font-semibold">
                    {p.price.toLocaleString()}P
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="border-surface-700/50 bg-surface-800/20 flex flex-col items-center justify-center rounded-2xl border py-12">
            <p className="text-surface-400 text-sm">유료 프롬프트가 없습니다</p>
          </div>
        )}

        {/* 구매자 목록 */}
        <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border">
          <div className="border-surface-700/50 border-b px-4 py-3">
            <h3 className="text-surface-100 text-sm font-semibold">
              최근 구매자
            </h3>
          </div>
          {buyers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-surface-700/50 mb-3 rounded-2xl p-3">
                <Users className="text-surface-500 h-6 w-6" />
              </div>
              <p className="text-surface-400 text-sm">아직 구매자가 없습니다</p>
            </div>
          ) : (
            <ul className="divide-surface-700/40 divide-y">
              {buyers.slice(0, 10).map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                  {b.buyer?.avatar_url ? (
                    <Image
                      src={b.buyer.avatar_url}
                      alt={b.buyer.nickname ?? ''}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-surface-700 flex h-7 w-7 items-center justify-center rounded-full">
                      <User className="text-surface-400 h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-surface-200 truncate text-sm">
                      {b.buyer?.nickname ?? '알 수 없음'}
                    </p>
                    {b.prompt && (
                      <p className="text-surface-500 truncate text-xs">
                        {b.prompt.title}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-medium text-emerald-400">
                    +{b.amount.toLocaleString()}P
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
