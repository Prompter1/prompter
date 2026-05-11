'use client'

import { Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PromptPost } from '@/types'
import { cn } from '@/src/lib/utils'

interface PromptCardProps {
  prompt: PromptPost
}

export default function PromptCard({ prompt }: Readonly<PromptCardProps>) {
  const { id, title, price, ai_types, author, is_verified, result_media } = prompt
  
  const firstMediaRaw = result_media?.length > 0 ? result_media[0] : null
  const firstMedia = typeof firstMediaRaw === 'string'
    ? firstMediaRaw
    : (firstMediaRaw as any)?.url || null

  const isVideo = typeof firstMedia === 'string'
    ? /\.(mp4|webm)$/i.test(firstMedia)
    : false

  return (
    <Link
      href={`/prompt/${id}`}
      className="group relative flex flex-col overflow-hidden bg-[#0A0A0A] border border-white/5 transition-all duration-500 hover:border-white/20"
    >
      {/* 썸네일 영역 - 미니멀하고 고대비 스타일 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden grayscale transition-all duration-700 group-hover:grayscale-0">
        {firstMedia ? (
          isVideo ? (
            <video
              src={firstMedia}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <Image
              src={firstMedia}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900">
            <Sparkles className="h-8 w-8 text-zinc-800" strokeWidth={1} />
          </div>
        )}
        
        {/* 오버레이 효과 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-40" />
      </div>

      {/* 콘텐츠 영역 - 타이포그래피 중심 */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {ai_types?.[0] && (
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {ai_types[0]}
              </span>
            )}
            {is_verified && (
              <div className="flex items-center gap-1 text-white">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
              </div>
            )}
          </div>
          <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="mb-8 line-clamp-2 text-xl font-black tracking-tight text-white transition-colors">
          {title}
        </h3>

        {/* 푸터 영역 - 가격과 작성자 */}
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500">
              {author.nickname.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
              {author.nickname}
            </span>
          </div>
          <span className="text-sm font-black tracking-tighter text-white">
            {price === 0 ? 'FREE' : `₩${price.toLocaleString()}`}
          </span>
        </div>
      </div>
    </Link>
  )
}
