'use client'

import { Crown, Sparkles, Zap, Shield } from 'lucide-react'
import Image from 'next/image'

interface Member {
  id: string
  nickname: string
  avatar_url: string
  points: number
  is_sponsor: boolean
}

interface PromptPost {
  id: number
  title: string
  content: string
  price: number
  ai_types: string[]
  categories: string[]
  author: Member
}

interface PromptCardProps {
  prompt: PromptPost
}

const AI_TYPE_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Midjourney: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Claude: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Stable Diffusion': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'DALL-E': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  default: 'bg-surface-500/15 text-surface-400 border-surface-500/20',
}

const CATEGORY_COLORS: Record<string, string> = {
  Game: 'text-red-400',
  Art: 'text-purple-400',
  Coding: 'text-blue-400',
  Writing: 'text-yellow-400',
  Marketing: 'text-green-400',
  default: 'text-surface-400',
}

function getPointsBadge(points: number) {
  if (points >= 1000) {
    return {
      label: 'Master',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      icon: Crown,
    }
  }
  if (points >= 500) {
    return {
      label: 'Expert',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      icon: Sparkles,
    }
  }
  if (points >= 100) {
    return {
      label: 'Active',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      icon: Zap,
    }
  }
  return null
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const { title, content, price, ai_types, categories, author } = prompt
  const pointsBadge = getPointsBadge(author.points)

  return (
    <article className="group border-surface-700/50 bg-surface-800/80 hover:border-brand-500/40 hover:shadow-brand-500/5 relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      {/* 가격 배지 */}
      <div className="absolute top-4 right-4 z-10">
        {price === 0 ? (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
            무료
          </span>
        ) : (
          <span className="bg-brand-500/15 text-brand-400 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            {price.toLocaleString()}원
          </span>
        )}
      </div>

      <div className="p-5">
        {/* 작성자 정보 */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <Image
              src={author.avatar_url || '/default-avatar.png'}
              alt={author.nickname}
              width={40}
              height={40}
              className="border-surface-600 rounded-full border-2 object-cover"
            />
            {author.is_sponsor && (
              <div className="absolute -right-0.5 -bottom-0.5 rounded-full bg-amber-500 p-0.5">
                <Crown className="text-surface-900 h-2.5 w-2.5" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-surface-100 text-sm font-medium">
                {author.nickname}
              </span>
              {author.is_sponsor && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                  Sponsor
                </span>
              )}
            </div>
            {pointsBadge && (
              <div
                className={`inline-flex w-fit items-center gap-1 rounded-full ${pointsBadge.bgColor} px-2 py-0.5`}
              >
                <pointsBadge.icon
                  className={`h-2.5 w-2.5 ${pointsBadge.color}`}
                />
                <span
                  className={`text-[10px] font-medium ${pointsBadge.color}`}
                >
                  {pointsBadge.label}
                </span>
                <span className="text-surface-500 text-[10px]">
                  {author.points.toLocaleString()}P
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 프롬프트 제목 및 내용 */}
        <h3 className="text-surface-50 group-hover:text-brand-400 mb-2 line-clamp-2 text-base font-semibold transition-colors">
          {title}
        </h3>
        <p className="text-surface-400 mb-4 line-clamp-2 text-sm leading-relaxed">
          {content}
        </p>

        {/* AI 종류 태그 */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {ai_types.map((type) => (
            <span
              key={type}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                AI_TYPE_COLORS[type] || AI_TYPE_COLORS.default
              }`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* 카테고리 태그 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className={`text-xs font-medium ${
                CATEGORY_COLORS[category] || CATEGORY_COLORS.default
              }`}
            >
              #{category}
            </span>
          ))}
        </div>
      </div>

      {/* 호버 시 그라데이션 효과 */}
      <div className="from-brand-500/5 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  )
}
