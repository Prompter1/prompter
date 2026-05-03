import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  ShieldCheck,
  Tag,
  FolderOpen,
} from 'lucide-react'
import type { PromptPost } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { PromptMediaGallery } from '@/components/prompt/PromptMediaGallery'
import { CopyPromptButton } from '@/components/prompt/CopyPromptButton'

interface PromptDetailViewProps {
  post: PromptPost
  createdAt: string | null
}

export function PromptDetailView({
  post,
  createdAt,
}: Readonly<PromptDetailViewProps>) {
  const {
    title,
    content,
    price,
    ai_types,
    categories,
    author,
    is_verified,
    result_media,
  } = post

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
          <div>
            <PromptMediaGallery urls={result_media} alt={title} />
          </div>

          <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {ai_types.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
              {is_verified && (
                <Badge variant="verified">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    인증됨
                  </span>
                </Badge>
              )}
              {price === 0 ? (
                <Badge variant="free">무료</Badge>
              ) : (
                <Badge variant="paid">유료</Badge>
              )}
            </div>

            <h1 className="text-surface-50 mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h1>

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
                  <span className="font-semibold text-white">
                    {author.nickname}
                  </span>
                  {author.is_sponsor && (
                    <span className="text-amber-400 flex items-center gap-0.5 text-xs font-bold uppercase">
                      <Crown className="h-3 w-3" />
                      Sponsor
                    </span>
                  )}
                </div>
                <div className="text-surface-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {dateLabel && <span>{dateLabel}</span>}
                  <span>{author.points.toLocaleString()} P</span>
                </div>
              </div>
              <div className="w-full shrink-0 text-right sm:w-auto">
                <p className="text-surface-500 text-xs">가격</p>
                <p
                  className={`text-xl font-bold ${price === 0 ? 'text-emerald-400' : 'text-brand-400'}`}
                >
                  {price === 0 ? '무료' : `${price.toLocaleString()}원`}
                </p>
              </div>
            </div>

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

            <CopyPromptButton text={content} className="mb-8 w-full sm:w-auto" />

            <div className="border-surface-700/50 bg-surface-800/25 rounded-2xl border">
              <div className="border-surface-700/50 flex items-center gap-2 border-b px-5 py-3">
                <Tag className="text-surface-500 h-4 w-4" />
                <span className="text-surface-300 text-sm font-medium">
                  프롬프트 본문
                </span>
              </div>
              <pre className="text-surface-200 max-h-[min(28rem,50vh)] overflow-auto p-5 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
