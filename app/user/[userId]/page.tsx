// 🚨 가장 중요: 맨 위에 있던 'use client'를 완전히 삭제했습니다! (이 파일은 서버 컴포넌트여야 합니다) 🚨

import {
  Crown,
  Eye,
  ShoppingBag,
  Sparkles,
  User,
  ArrowLeft,
  TrendingUp,
  BarChart2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import PromptCard from '@/components/prompt/PromptCard'
import type { PromptPost } from '@/types'

// ─── 1. 인터페이스 ─────────────────────────────────────
interface Member {
  id: string
  nickname: string
  avatar_url: string | null
  is_sponsor: boolean
  total_revenue: number
  points: number
}

interface PublicProfileViewProps {
  member: Member
  prompts?: PromptPost[] // undefined가 들어올 수 있음을 명시
  isOwnProfile: boolean
}

// ─── 2. 화면을 그리는 UI 컴포넌트 (async가 절대 있으면 안 됩니다) ───
function PublicProfileView({
  member,
  prompts = [], // ✨ 핵심 방어 코드: 값을 안 주면 빈 배열([])을 기본으로 사용합니다.
  isOwnProfile,
}: Readonly<PublicProfileViewProps>) {
  // 한 번 더 안전하게 배열인지 확인
  const safePrompts = Array.isArray(prompts) ? prompts : []

  const totalViews = safePrompts.reduce(
    (sum, p) => sum + (p.view_count ?? 0),
    0
  )
  const totalSales = safePrompts.reduce(
    (sum, p) => sum + (p.sales_count ?? 0),
    0
  )
  const paidPrompts = safePrompts.filter((p) => p.price > 0)
  const freePrompts = safePrompts.filter((p) => p.price === 0)

  return (
    <main className="bg-surface-900 min-h-screen pt-24 pb-20 text-white">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-brand-500/10 absolute -top-32 left-1/2 h-80 w-175 -translate-x-1/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        {/* 뒤로가기 */}
        <Link
          href="/prompt"
          className="text-surface-400 hover:text-surface-200 mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          탐색으로 돌아가기
        </Link>

        {/* 프로필 헤더 */}
        <div className="border-surface-700/50 bg-surface-800/60 mb-8 rounded-3xl border p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="ring-brand-500/30 shrink-0 rounded-full ring-4">
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.nickname}
                  width={96}
                  height={96}
                  className="border-surface-700 h-24 w-24 rounded-full border-2 object-cover"
                />
              ) : (
                <div className="from-brand-400 to-brand-600 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold">{member.nickname}</h1>
                {member.is_sponsor && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
                    <Crown className="h-3 w-3" />
                    Sponsor
                  </span>
                )}
                {isOwnProfile && (
                  <span className="bg-brand-500/15 text-brand-400 border-brand-500/30 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    내 프로필
                  </span>
                )}
              </div>

              <div className="text-surface-400 flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="text-brand-400 h-3.5 w-3.5" />
                  {safePrompts.length}개 프롬프트
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  {totalViews.toLocaleString()} 조회
                </span>
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                  {totalSales.toLocaleString()} 판매
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <Link
                href="/mypage"
                className="bg-brand-500 hover:bg-brand-400 shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                마이페이지로 이동
              </Link>
            )}
          </div>

          {/* 스탯 카드 */}
          <div className="border-surface-700/50 mt-8 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
            {[
              {
                icon: Sparkles,
                color: 'text-brand-400',
                bg: 'bg-brand-500/10',
                label: '전체 프롬프트',
                value: `${safePrompts.length}개`,
              },
              {
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                label: '유료 프롬프트',
                value: `${paidPrompts.length}개`,
              },
              {
                icon: Eye,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10',
                label: '총 조회수',
                value: totalViews.toLocaleString(),
              },
              {
                icon: BarChart2,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                label: '총 판매수',
                value: totalSales.toLocaleString(),
              },
            ].map(({ icon: Icon, color, bg, label, value }) => (
              <div
                key={label}
                className="border-surface-700/40 bg-surface-800/40 rounded-2xl border p-4"
              >
                <div className={`mb-2 inline-flex rounded-xl p-2 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-surface-400 text-xs">{label}</p>
                <p className={`mt-0.5 text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 프롬프트 목록 */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              등록한 프롬프트
              <span className="text-surface-500 ml-2 text-sm font-normal">
                ({safePrompts.length}개)
              </span>
            </h2>
            <div className="text-surface-500 text-xs">
              유료 {paidPrompts.length}개 · 무료 {freePrompts.length}개
            </div>
          </div>

          {safePrompts.length === 0 ? (
            <div className="border-surface-700 bg-surface-800/30 flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed">
              <Sparkles className="text-surface-600 mb-3 h-8 w-8" />
              <p className="text-surface-400 text-sm">
                아직 등록한 프롬프트가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {safePrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// ─── 3. 메인 페이지 진입점 (Server Component, 오직 여기만 async 사용) ───
interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function UserProfilePage({ params }: Readonly<PageProps>) {
  // 서버에서 안전하게 params를 await로 꺼냅니다.
  const { userId } = await params

  // ⭐️ DB 연결 전, 에러를 방지할 가짜(Mock) 데이터입니다.
  const mockMember = {
    id: userId,
    nickname: '타인 프로필 테스트',
    avatar_url: null,
    is_sponsor: true,
    total_revenue: 0,
    points: 1500,
  }

  // 데이터가 비어있어도 방어 로직 덕분에 더 이상 터지지 않습니다.
  const mockPrompts: PromptPost[] = []

  return (
    <PublicProfileView
      member={mockMember}
      prompts={mockPrompts}
      isOwnProfile={false}
    />
  )
}
