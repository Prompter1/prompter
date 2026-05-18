import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  Eye,
  FolderOpen,
  ShieldCheck,
  Bookmark,
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
        .select('adult_verified')
        .eq('id', user.id)
        .single(),
    ])

    hasPurchased = !!txRes.data
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
            <AdultContentGate
              isAdult={isAdult}
              isLoggedIn={!!user}
              isAdultVerified={isAdultVerified}
            >
              <PromptMediaGallery urls={result_media} alt={title} />
            </AdultContentGate>

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
                  userId={user?.id ?? ''}
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
              {(ai_versions ?? []).map((v: string) => (
                <Badge key={v} variant="default">
                  {v}
                </Badge>
              ))}
              {isAdult && (
                <span className="flex items-center gap-1 rounded-lg bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  성인
                </span>
              )}
              {is_verified && (
                <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  검증됨
                </span>
              )}
            </div>

            {/* 제목 */}
            <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h1>

            {/* 한 줄 소개 */}
            {content && (
              <p className="text-surface-400 mb-4 text-sm leading-relaxed">
                {content.length > 100 ? `${content.slice(0, 100)}…` : content}
              </p>
            )}

            {/* 작성자 */}
            <Link
              href={`/profile/${author.id}`}
              className="mb-6 flex items-center gap-3"
            >
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.nickname}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-brand-500/20 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
                  {author.nickname?.[0] ?? '?'}
                </div>
              )}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-white">
                  {author.nickname}
                  {(author as any).is_sponsor && (
                    <Crown className="h-3.5 w-3.5 text-yellow-400" />
                  )}
                </p>
                {dateLabel && (
                  <p className="text-surface-500 text-xs">{dateLabel}</p>
                )}
              </div>
            </Link>

            {/* 카테고리 */}
            {(categories ?? []).length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {(categories ?? []).map((c: string) => (
                  <span
                    key={c}
                    className="bg-surface-500/50 text-surface-300 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs"
                  >
                    <FolderOpen className="h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* 가격 + 통계 */}
            <div className="border-surface-400/50 bg-surface-800/40 mb-6 divide-y divide-white/10 rounded-2xl border">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-surface-400 flex items-center gap-2 text-sm">
                  <span className="text-surface-400 text-base font-medium">
                    ₩
                  </span>
                  가격
                </span>
                <span className="text-brand-400 text-sm font-semibold">
                  {isFree ? '무료' : `${price.toLocaleString()}원`}
                </span>
              </div>

              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-surface-400 flex items-center gap-2 text-sm">
                  <Eye className="h-3.5 w-3.5" />
                  조회수
                </span>
                <span className="text-surface-300 text-sm">
                  {(view_count ?? 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-surface-400 flex items-center gap-2 text-sm">
                  <Bookmark className="h-3.5 w-3.5" />
                  저장
                </span>
                <span className="text-surface-300 text-sm">
                  {(sales_count ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 오너 액션 */}
            {isOwner && <PromptOwnerActions postId={post.id} title={title} />}
          </div>
        </div>
      </div>
    </main>
  )
}
