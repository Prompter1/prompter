'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export function CopyPromptButton({
  text,
  className,
}: Readonly<{ text: string; className?: string }>) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 클립보드 거부 등은 무시 */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'border-surface-600 bg-surface-800 hover:border-brand-500/50 hover:bg-surface-700 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-white transition-all',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="text-surface-400 h-4 w-4" />
          프롬프트 복사
        </>
      )}
    </button>
  )
}
