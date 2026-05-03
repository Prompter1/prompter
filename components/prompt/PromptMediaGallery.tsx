'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { cn } from '@/src/lib/utils'

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)$/i.test(url)
}

export function PromptMediaGallery({
  urls,
  alt,
}: Readonly<{ urls: string[]; alt: string }>) {
  const [active, setActive] = useState(0)

  if (urls.length === 0) {
    return (
      <div className="border-surface-700/50 bg-surface-800/40 flex aspect-4/3 w-full items-center justify-center rounded-2xl border">
        <Sparkles
          className="text-surface-600/50 h-16 w-16"
          strokeWidth={1.25}
        />
      </div>
    )
  }

  const current = urls[Math.min(active, urls.length - 1)]!
  const mainIsVideo = isVideoUrl(current)

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'border-surface-700/50 bg-surface-800/30 relative aspect-4/3 w-full overflow-hidden rounded-2xl border',
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
            src={current}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        )}
      </div>

      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, idx) => {
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
