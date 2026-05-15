'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { cn } from '@/src/lib/utils'

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)$/i.test(url)
}

interface PromptMediaGalleryProps {
  urls: string[]
  alt: string
  /** 외부에서 주입되는 현재 활성 URL 목록 (스텝 전환 시 사용). undefined면 urls 폴백 사용 */
  activeUrls?: string[] | null
}

export function PromptMediaGallery({
  urls,
  alt,
  activeUrls,
}: Readonly<PromptMediaGalleryProps>) {
  const [active, setActive] = useState(0)

  // activeUrls가 변경되면(스텝 전환) 인덱스 초기화
  useEffect(() => {
    setActive(0)
  }, [activeUrls])

  // activeUrls가 undefined/null이면 urls 폴백
  // activeUrls가 []이면 해당 스텝에 미디어 없음 → 빈 상태 표시
  const isControlled = activeUrls !== undefined && activeUrls !== null
  const displayUrls = isControlled ? activeUrls : urls

  if (displayUrls.length === 0) {
    return (
      <div className="border-surface-700/50 bg-surface-800/40 flex aspect-4/3 w-full items-center justify-center rounded-2xl border">
        <div className="flex flex-col items-center gap-3">
          <Sparkles
            className="text-surface-600/50 h-16 w-16"
            strokeWidth={1.25}
          />
          {isControlled && (
            <p className="text-surface-600 text-xs">
              이 스텝에는 미디어가 없습니다
            </p>
          )}
        </div>
      </div>
    )
  }

  const current = displayUrls[Math.min(active, displayUrls.length - 1)]!
  const mainIsVideo = isVideoUrl(current)

  return (
    <div className="space-y-3">
      {/* 메인 미디어 */}
      <div
        className={cn(
          'border-surface-700/50 bg-surface-800/30 relative aspect-4/3 w-full overflow-hidden rounded-2xl border transition-all duration-300',
          mainIsVideo && 'bg-black'
        )}
      >
        {mainIsVideo ? (
          <video
            key={current}
            src={current}
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <Image
            key={current}
            src={current}
            alt={alt}
            fill
            className="object-contain transition-opacity duration-200"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        )}
      </div>

      {/* 썸네일 목록 */}
      {displayUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayUrls.map((url, idx) => {
            const thumbVideo = isVideoUrl(url)
            return (
              <button
                key={url}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(
                  'border-surface-600 relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  active === idx
                    ? 'border-brand-500 ring-brand-500/30 ring-2'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                {thumbVideo ? (
                  <video
                    src={url}
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
