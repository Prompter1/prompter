import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PromptCard from '@/components/prompt/PromptCard'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import type { PromptPost } from '@/types'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function UserProfilePage({ params }: Readonly<PageProps>) {
  const { userId } = await params

  const supabase = await createSupabaseServerClient()

  // 현재 로그인 유저 + 성인인증 여부
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  let isAdultVerified = false
  const isLoggedIn = !!currentUser

  if (currentUser) {
    const { data: member } = await supabase
      .from('members')
      .select('adult_verified')
      .eq('id', currentUser.id)
      .maybeSingle()
    isAdultVerified = Boolean(member?.adult_verified)
  }

  // 프로필 대상 멤버 조회
  const { data: member, error: memberErr } = await supabase
    .from('members')
    .select('id, nickname, avatar_url, is_sponsor, total_revenue, points')
    .eq('id', userId)
    .maybeSingle()

  if (memberErr || !member) notFound()

  // 해당 멤버의 프롬프트 조회 — is_adult 포함
  const { data: promptsRaw } = await supabase
    .from('prompt_posts')
    .select(
      `id, title, content, price, ai_types, ai_versions, categories,
       is_verified, is_adult, result_media, view_count, sales_count,
       author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
    )
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  const prompts: PromptPost[] = ((promptsRaw ?? []) as any[])
    .filter((r) => r.author)
    .map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      price: r.price,
      ai_types: r.ai_types ?? [],
      ai_versions: r.ai_versions ?? [],
      categories: r.categories ?? [],
      author: r.author,
      is_verified: r.is_verified,
      is_adult: Boolean(r.is_adult),
      result_media: Array.isArray(r.result_media)
        ? r.result_media
            .map((m: any) => (typeof m === 'string' ? m : (m?.url ?? '')))
            .filter(Boolean)
        : [],
      view_count: r.view_count ?? 0,
      sales_count: r.sales_count ?? 0,
    }))

  const isOwnProfile = currentUser?.id === userId

  const totalViews = prompts.reduce((sum, p) => sum + (p.view_count ?? 0), 0)
  const totalSales = prompts.reduce((sum, p) => sum + (p.sales_count ?? 0), 0)
  const paidPrompts = prompts.filter((p) => p.price > 0)
  const freePrompts = prompts.filter((p) => p.price === 0)

  return (
    <>
      <Navbar />
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
              {/* 아바타 */}
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

              {/* 이름 + 뱃지 */}
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

                {/* 간단 통계 */}
                <div className="text-surface-400 flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="text-brand-400 h-3.5 w-3.5" />
                    {prompts.length}개 프롬프트
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

              {/* 내 프로필이면 마이페이지 링크 */}
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
                  value: `${prompts.length}개`,
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
                  ({prompts.length}개)
                </span>
              </h2>
              <div className="text-surface-500 text-xs">
                유료 {paidPrompts.length}개 · 무료 {freePrompts.length}개
              </div>
            </div>

            {prompts.length === 0 ? (
              <div className="border-surface-700 bg-surface-800/30 flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed">
                <Sparkles className="text-surface-600 mb-3 h-8 w-8" />
                <p className="text-surface-400 text-sm">
                  아직 등록한 프롬프트가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isLoggedIn={isLoggedIn}
                    isAdultVerified={isAdultVerified}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
