import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { PublicationReviewActions } from '@/components/admin/PublicationReviewActions'

type Props = Readonly<{ params: Promise<{ id: string }> }>

export default async function AdminPublicationReviewPage({ params }: Props) {
  const { id } = await params
  const postId = Number.parseInt(id, 10)
  if (!Number.isFinite(postId) || postId < 1) notFound()

  const adminClient = createSupabaseAdminClient()

  const { data: post } = await adminClient
    .from('prompt_posts')
    .select(
      'id, title, content, price, ai_types, categories, author_id, created_at, is_verified, publication_status'
    )
    .eq('id', postId)
    .maybeSingle()

  if (!post) notFound()

  const { data: author } = await adminClient
    .from('members')
    .select('nickname, email')
    .eq('id', post.author_id)
    .maybeSingle()

  const isPending = post.publication_status === 'pending'
  const created = post.created_at
    ? new Date(post.created_at).toLocaleString('ko-KR')
    : '—'

  return (
    <div>
      <Link
        href="/admin"
        className="text-surface-400 hover:text-surface-200 mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        대기 목록으로
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              인증 #{post.id}
            </h1>
            <span
              className={
                isPending
                  ? 'rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400'
                  : post.publication_status === 'approved'
                    ? 'rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400'
                    : 'rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400'
              }
            >
              {isPending ? 'PENDING' : post.publication_status?.toUpperCase()}
            </span>
          </div>
          <p className="text-surface-500 text-sm">
            {author?.nickname ?? '—'}
            {author?.email ? ` (${author.email})` : ''}
            {' · '}
            {created}
          </p>
        </div>
        {isPending && <PublicationReviewActions postId={post.id} />}
        {!isPending && (
          <p className="text-surface-500 text-sm">
            이 요청은 이미 처리되었습니다.
          </p>
        )}
      </div>

      <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border">
        <div className="border-surface-700/50 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-surface-100 text-sm font-semibold">
              {post.title}
            </h2>
            <span className="text-brand-400 text-xs font-semibold">
              {post.price.toLocaleString()}원
            </span>
            {(post.ai_types ?? []).map((t: string) => (
              <span
                key={t}
                className="bg-surface-700/50 text-surface-300 rounded-full px-2.5 py-0.5 text-xs"
              >
                {t}
              </span>
            ))}
            {(post.categories ?? []).map((c: string) => (
              <span
                key={c}
                className="bg-surface-700/50 text-surface-300 rounded-full px-2.5 py-0.5 text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <pre className="text-surface-200 max-h-[60vh] overflow-auto rounded-xl bg-black/25 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </pre>
        </div>
      </div>
    </div>
  )
}
