'use client'

import { Sparkles, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PromptPost } from '@/types'

interface PromptCardProps {
  prompt: PromptPost
}

export default function PromptCard({ prompt }: Readonly<PromptCardProps>) {
  const { title, price, ai_types, author, is_verified, result_media } = prompt

  // 1. 데이터가 있는지 먼저 확인
  const firstMediaRaw = result_media?.length > 0 ? result_media[0] : null

  // 2. firstMediaRaw가 문자열인지 확인 후 처리 (객체라면 .url 같은 속성을 참조해야 할 수도 있음)
  const firstMedia =
    typeof firstMediaRaw === 'string'
      ? firstMediaRaw
      : (firstMediaRaw as any)?.url || null // 객체일 경우를 대비한 처리

  // 3. 문자열일 때만 match 실행
  const isVideo =
    typeof firstMedia === 'string'
      ? new RegExp(/\.(mp4|webm)$/i).exec(firstMedia)
      : false

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group border-surface-700/50 hover:border-brand-500/50 hover:shadow-brand-500/10 relative flex flex-col overflow-hidden rounded-2xl border bg-[#12121A] transition-all duration-300 hover:shadow-lg"
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
        <div className="mb-3 flex items-center gap-2">
          {ai_types?.[0] && (
            <span className="bg-surface-700/50 text-surface-300 rounded-full px-3 py-1 text-xs font-medium">
              {ai_types[0]}
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
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-surface-500 text-sm font-medium">
            by {author.nickname}
          </span>

          <span
            className={`text-base font-bold ${price === 0 ? 'text-emerald-400' : 'text-brand-400'}`}
          >
            {price === 0 ? '무료' : `${price.toLocaleString()}원`}
          </span>
        </div>
      </div>
    </Link>
  )
}
