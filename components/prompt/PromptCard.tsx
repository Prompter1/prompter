'use client'

import { Eye, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PromptPost } from '@/types'

interface PromptCardProps {
  prompt: PromptPost
}

export default function PromptCard({ prompt }: Readonly<PromptCardProps>) {
  const {
    title,
    price,
    ai_types,
    ai_versions,
    author,
    is_verified,
    result_media,
    view_count,
    sales_count,
  } = prompt

  const firstMediaRaw = result_media?.length > 0 ? result_media[0] : null

  const firstMedia = typeof firstMediaRaw === 'string' ? firstMediaRaw : null
  const isVideo =
    typeof firstMedia === 'string'
      ? new RegExp(/\.(mp4|webm)$/i).exec(firstMedia)
      : false

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group border-surface-700/50 hover:border-brand-500/50 hover:shadow-brand-500/10 relative flex min-h-full flex-col overflow-hidden rounded-2xl border bg-[#12121A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* 썸네일 영역 (이미지 or 영상 or 플레이스홀더) */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#1A1A24]">
        {firstMedia ? (
          isVideo ? (
            <video
              src={firstMedia}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={firstMedia}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          // 미디어가 없을 경우 기본 플레이스홀더 아이콘
          <Sparkles
            className="text-surface-600/50 h-12 w-12"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col p-5">
        {/* 태그 영역 (AI 타입 & 인증 마크) */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {ai_types?.[0] && (
            <span className="bg-surface-700/50 text-surface-300 rounded-full px-3 py-1 text-xs font-medium">
              {ai_types[0]}
            </span>
          )}
          {ai_versions?.[0] && (
            <span className="border-surface-600/70 text-surface-400 rounded-full border px-2.5 py-1 text-xs font-medium">
              {ai_versions[0]}
            </span>
          )}

          {is_verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              인증됨
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-surface-50 group-hover:text-brand-400 mb-6 line-clamp-2 text-lg font-semibold transition-colors">
          {title}
        </h3>

        {/* 푸터 영역 (작성자 & 가격) */}
        <div className="text-surface-500 mb-4 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {(view_count ?? 0).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShoppingBag className="h-3.5 w-3.5" />
            {(sales_count ?? 0).toLocaleString()}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-surface-500 truncate text-sm font-medium">
            by {author.nickname}
          </span>

          <span
            className={`shrink-0 text-base font-bold ${price === 0 ? 'text-emerald-400' : 'text-brand-400'}`}
          >
            {price === 0 ? '무료' : `${price.toLocaleString()}P`}
          </span>
        </div>
      </div>
    </Link>
  )
}
