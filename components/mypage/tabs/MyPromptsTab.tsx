'use client'

import { FileText, Sparkles, Plus } from 'lucide-react'
import PromptCard from '@/components/prompt/PromptCard'
import { useRouter } from 'next/navigation'
import { navigationUtils } from '@/src/lib/navigation'
interface PromptPost {
  id: number
  title: string
  content: string
  price: number
  ai_types: string[]
  categories: string[]
  author: {
    id: string
    nickname: string
    avatar_url: string
    points: number
    is_sponsor: boolean
  }
  is_verified: boolean
  result_media: string[]
}

interface MyPromptsTabProps {
  prompts: PromptPost[]
  isLoading: boolean
}

export function MyPromptsTab({
  prompts,
  isLoading,
}: Readonly<MyPromptsTabProps>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Sparkles className="text-surface-600 h-8 w-8 animate-spin" />
      </div>
    )
  }

  const router = useRouter()

  if (prompts.length === 0) {
    return (
      <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
        <FileText className="text-surface-600 mb-4 h-10 w-10" />
        <p className="text-base font-medium">
          아직 등록한 프롬프트가 없습니다.
        </p>
        <p className="text-surface-500 mt-1 text-sm">
          첫 번째 프롬프트를 등록하고 수익을 창출해보세요.
        </p>
        <button
          className="bg-brand-500 hover:bg-brand-600 mt-6 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          onClick={() => navigationUtils.moveToUpload(router)}
        >
          <Plus className="h-4 w-4" />새 프롬프트 등록하기
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-surface-400 text-sm">
          총{' '}
          <span className="font-semibold text-white">{prompts.length}개</span>의
          프롬프트
        </p>
        <button
          className="bg-brand-500 hover:bg-brand-600 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors"
          onClick={() => navigationUtils.moveToUpload(router)}
        >
          <Plus className="h-4 w-4" />새 프롬프트
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  )
}
