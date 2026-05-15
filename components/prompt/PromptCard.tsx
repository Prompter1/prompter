'use client'

import { Sparkles, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PromptPost } from '@/types'

// ai_type별 그라디언트 색상 매핑
const AI_GRADIENTS: Record<string, string> = {
  Midjourney: 'from-violet-600 via-purple-600 to-indigo-700',
  'Stable Diffusion': 'from-pink-600 via-rose-500 to-orange-500',
  ChatGPT: 'from-emerald-500 via-teal-500 to-cyan-600',
  Claude: 'from-amber-500 via-orange-500 to-rose-500',
  'LLM Agents': 'from-cyan-500 via-blue-500 to-indigo-600',
  'Video Prompts': 'from-orange-500 via-amber-500 to-yellow-500',
  'DALL-E': 'from-blue-500 via-indigo-500 to-violet-600',
  Runway: 'from-fuchsia-500 via-pink-500 to-rose-500',
  Sora: 'from-sky-500 via-blue-600 to-indigo-700',
}

function getGradient(aiTypes: string[]): string {
  for (const t of aiTypes) {
    if (AI_GRADIENTS[t]) return AI_GRADIENTS[t]
  }
  return 'from-brand-500 via-violet-500 to-indigo-600'
}

interface PromptCardProps {
  prompt: PromptPost
}

export default function PromptCard({ prompt }: Readonly<PromptCardProps>) {
  const { title, price, ai_types, author, is_verified, result_media } = prompt

  // ✅ 배열의 마지막 요소를 선택하도록 수정
  const lastMediaRaw =
    result_media?.length > 0 ? result_media[result_media.length - 1] : null

  const lastMedia =
    typeof lastMediaRaw === 'string'
      ? lastMediaRaw
      : ((lastMediaRaw as any)?.url ?? null)

  const isVideo =
    typeof lastMedia === 'string' && /\.(mp4|webm)$/i.test(lastMedia)
  const gradient = getGradient(ai_types ?? [])

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group border-surface-700/50 hover:border-brand-500/50 hover:shadow-brand-500/10 relative flex flex-col overflow-hidden rounded-2xl border bg-[#12121A] transition-all duration-300 hover:shadow-lg"
    >
      {/* 썸네일 */}
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden">
        {lastMedia ? (
          isVideo ? (
            <video
              src={lastMedia}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={lastMedia}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          // ✅ 흑백 대신 컬러 그라디언트 플레이스홀더
          <div
            className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-80`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Sparkles className="h-10 w-10 text-white/60" strokeWidth={1.5} />
              {ai_types?.[0] && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {ai_types[0]}
                </span>
              )}
            </div>
            {/* 글로우 효과 */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          </div>
        )}

        {/* 가격 뱃지 — 썸네일 위 */}
        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-lg backdrop-blur-sm ${
              price === 0
                ? 'bg-emerald-500/80 text-white'
                : 'bg-brand-500/80 text-white'
            }`}
          >
            {price === 0 ? '무료' : `${price.toLocaleString()}P`}
          </span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col p-5">
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

        <h3 className="text-surface-50 group-hover:text-brand-400 mb-6 line-clamp-2 text-lg font-semibold transition-colors">
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-surface-500 text-sm font-medium">
            by {author.nickname}
          </span>
        </div>
      </div>
    </Link>
  )
}
