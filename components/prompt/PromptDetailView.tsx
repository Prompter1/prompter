import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  Eye,
  FolderOpen,
  ShieldCheck,
  ShoppingBag,
  ShieldAlert,
} from 'lucide-react'
import type { PromptPost } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { PromptMediaGallery } from '@/components/prompt/PromptMediaGallery'
import { PromptContentSection } from '@/components/prompt/PromptContentSection'
import { PromptStepsViewer } from '@/components/prompt/PromptStepsViewer'
import { AdultContentGate } from '@/components/ui/AdultContentGate'
import { PromptOwnerActions } from '@/components/prompt/PromptOwnerActions'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

interface PromptDetailViewProps {
  post: PromptPost & { is_adult?: boolean }
  createdAt: string | null
}

export async function PromptDetailView({
  post,
  createdAt,
}: Readonly<PromptDetailViewProps>) {
  const {
    title,
    content,
    price,
    ai_types,
    ai_versions,
    categories,
    author,
    is_verified,
    result_media,
    view_count,
    sales_count,
  } = post

  const isAdult = Boolean((post as any).is_adult)

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasPurchased = false
  let userPoints = 0
  let isAdultVerified = false

  if (user) {
    const [txRes, memberRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('prompt_post_id', post.id)
        .maybeSingle(),
      supabase
        .from('members')
        .select('points, adult_verified')
        .eq('id', user.id)
        .single(),
    ])

    hasPurchased = !!txRes.data
    userPoints = memberRes.data?.points ?? 0
    isAdultVerified = Boolean(memberRes.data?.adult_verified)
  }

  const { data: stepsRaw } = await supabase
    .from('prompt_steps')
    .select(
      'id, step_order, ai_type, ai_version, input_prompt, input_media, output_text, output_media'
    )
    .eq('prompt_post_id', post.id)
    .order('step_order', { ascending: true })

  const steps = (stepsRaw ?? []).map((s: any) => ({
    id: s.id,
    step_order: s.step_order,
    ai_type: s.ai_type ?? '',
    ai_version: s.ai_version ?? '',
    input_prompt: s.input_prompt ?? '',
    input_media: Array.isArray(s.input_media)
      ? s.input_media.filter((v: unknown) => typeof v === 'string')
      : [],
    output_text: s.output_text ?? '',
    output_media: Array.isArray(s.output_media)
      ? s.output_media.filter((v: unknown) => typeof v === 'string')
      : [],
  }))

  const isFree = price === 0
  const isOwner = user?.id === author.id
  const canViewFull = isFree || isOwner || hasPurchased

  // 성인 컨텐츠인데 미인증이면 콘텐츠 전체를 차단
  const isAdultBlocked = isAdult && !isAdultVerified

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="bg-surface-900 relative min-h-screen pt-20 pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-brand-500/10 absolute -top-32 right-0 h-80 w-80 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/"
          className="text-surface-400 hover:text-surface-200 mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          {/* 좌측: 미디어 + 스텝 */}
          <div className="space-y-6">
            {/* 미디어 갤러리 — 성인 컨텐츠면 게이트 적용 */}
            <AdultContentGate
              isAdult={isAdult}
              isLoggedIn={!!user}
              isAdultVerified={isAdultVerified}
            >
              <PromptMediaGallery urls={result_media} alt={title} />
            </AdultContentGate>

            {/* 스텝 뷰어 — 성인 컨텐츠면 동일하게 게이트 적용 */}
            {steps.length > 0 && (
              <AdultContentGate
                isAdult={isAdult}
                isLoggedIn={!!user}
                isAdultVerified={isAdultVerified}
              >
                <PromptStepsViewer
                  steps={steps}
                  price={price}
                  canViewFull={canViewFull}
                  isLoggedIn={!!user}
                  postId={post.id}
                  title={title}
                  userPoints={userPoints}
                />
              </AdultContentGate>
            )}
          </div>

          {/* 우측: 메타 정보 */}
          <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
            {/* 배지 행 */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {ai_types.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
              {(ai_versions ?? []).map((v) => (
                <Badge key={v} variant="paid">
                  {v}
                </Badge>
              ))}
              {is_verified && (
                <Badge variant="verified">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    인증됨
                  </span>
                </Badge>
              )}
              {isAdult && (
                <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                  <ShieldAlert className="h-3 w-3" />
                  19+
                </span>
              )}
              {isFree ? (
                <Badge variant="free">무료</Badge>
              ) : (
                <Badge variant="paid">유료</Badge>
              )}
            </div>

            <h1 className="text-surface-50 mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            {/* 작성자 카드 */}
            <div className="border-surface-700/50 bg-surface-800/40 mb-6 flex flex-wrap items-center gap-4 rounded-2xl border p-4">
              <div className="border-surface-600 relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2">
                <Image
                  src={author.avatar_url || '/images/default-avatar.png'}
                  alt={author.nickname}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/user/${author.id}`}
                    className="hover:text-brand-400 font-semibold text-white transition-colors"
                  >
                    {author.nickname}
                  </Link>
                  {author.is_sponsor && (
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400 uppercase">
                      <Crown className="h-3 w-3" />
                      Sponsor
                    </span>
                  )}
                </div>
                <div className="text-surface-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {dateLabel && <span>{dateLabel}</span>}
                  <span>{author.points.toLocaleString()} P</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(view_count ?? 0).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    {(sales_count ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full shrink-0 text-right sm:w-auto">
                <p className="text-surface-500 text-xs">가격</p>
                <p
                  className={`text-xl font-bold ${isFree ? 'text-emerald-400' : 'text-brand-400'}`}
                >
                  {isFree ? '무료' : `${price.toLocaleString()}P`}
                </p>
              </div>
            </div>

            {/* 카테고리 */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="text-surface-400 border-surface-700/80 bg-surface-800/60 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
                >
                  <FolderOpen className="h-3 w-3" />
                  {c}
                </span>
              ))}
            </div>

            {/* 오너 액션 (수정/삭제) */}
            {isOwner && (
              <div className="mb-6">
                <PromptOwnerActions postId={post.id} title={title} />
              </div>
            )}

            {/* 한줄 소개 — 성인 컨텐츠여도 항상 공개 */}
            <PromptContentSection
              postId={post.id}
              title={title}
              content={content}
              price={price}
              canViewFull={canViewFull}
              isLoggedIn={!!user}
              userPoints={userPoints}
            />

            {/* 성인 컨텐츠 안내 박스 */}
            {isAdultBlocked && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-red-300">
                    성인 인증이 필요합니다
                  </p>
                  <p className="text-surface-400 mt-1 text-xs">
                    이 게시물은 만 19세 이상만 열람 가능합니다.
                    {!user && (
                      <Link
                        href="/login"
                        className="text-brand-400 ml-1 hover:underline"
                      >
                        로그인 후 인증하세요.
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
