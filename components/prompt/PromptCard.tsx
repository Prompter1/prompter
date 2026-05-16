'use client'

import { Sparkles, ShieldCheck, ShieldAlert } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // 1. useRouter 임포트 추가
import type { PromptPost } from '@/types'

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
  prompt: PromptPost & { is_adult?: boolean }
}

export default function PromptCard({ prompt }: Readonly<PromptCardProps>) {
  const router = useRouter() // 2. 라우터 인스턴스 생성
  const { title, price, ai_types, author, is_verified, result_media } = prompt
  const isAdult = Boolean((prompt as any).is_adult)

  const firstMediaRaw = result_media?.length > 0 ? result_media[0] : null
  const firstMedia =
    typeof firstMediaRaw === 'string'
      ? firstMediaRaw
      : ((firstMediaRaw as any)?.url ?? null)

  const isVideo =
    typeof firstMedia === 'string' && /\.(mp4|webm)$/i.test(firstMedia)
  const gradient = getGradient(ai_types ?? [])

  return (
    // 3. ❌ 기존 <Link href=...> 태그를 지우고, ⭕ 아래와 같이 div 태그와 onClick 함수로 교체합니다.
    <div
      onClick={() => router.push(`/prompt/${prompt.id}`)}
      className="group border-surface-700/50 hover:border-brand-500/50 hover:shadow-brand-500/10 relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#12121A] transition-all duration-300 hover:shadow-lg"
    >
      {/* 썸네일 */}
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden">
        {firstMedia ? (
          isAdult ? (
            <div className="relative h-full w-full">
              {isVideo ? (
                <video
                  src={firstMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                  style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                />
              ) : (
                <Image
                  src={firstMedia}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40">
                <ShieldAlert className="h-8 w-8 text-red-400" />
                <span className="text-xs font-bold text-white">19+</span>
              </div>
            </div>
          ) : isVideo ? (
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
          </div>
        )}

        {/* 배지 영역 */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {isAdult && (
            <span className="rounded-full border border-red-500/40 bg-red-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              19+
            </span>
          )}
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
        <div className="mb-3 flex flex-wrap items-center gap-2">
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
          {/* 4. 내부 작성자 링크를 유지하되, 클릭 이벤트 버블링을 확실하게 막아줍니다. */}
          <Link
            href={`/user/${author.id}`}
            onClick={(e) => {
              e.stopPropagation() // 카드가 중복 클릭되어 상세페이지로 넘어가는 현상을 차단합니다.
            }}
            className="text-surface-500 hover:text-brand-400 relative z-10 text-sm font-medium transition-colors"
          >
            by {author.nickname}
          </Link>
        </div>
      </div>
    </div>
  )
}
