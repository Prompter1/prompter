import { Bot, Image as ImageIcon, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'
import type { Category, FeaturedPrompt, Stat } from '@/types'

export const CATEGORIES: Category[] = [
  {
    name: 'Midjourney',
    icon: ImageIcon,
    prompts: 1205,
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Stable Diffusion',
    icon: ImageIcon,
    prompts: 840,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'LLM Agents',
    icon: Bot,
    prompts: 2150,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Video Prompts',
    icon: Zap,
    prompts: 560,
    gradient: 'from-amber-500 to-orange-600',
  },
]

export const STATS: Stat[] = [
  { label: '등록된 프롬프트', value: '12,000+', icon: Sparkles },
  { label: '활성 사용자', value: '5,000+', icon: Users },
  { label: '거래 완료', value: '8,500+', icon: TrendingUp },
]

export const FEATURED_PROMPTS: FeaturedPrompt[] = [
  { id: 1, title: '시네마틱 영화 포스터 생성', category: 'Midjourney', price: 0, verified: true },
  { id: 2, title: '코드 리뷰 자동화 에이전트', category: 'LLM Agents', price: 5000, verified: true },
  { id: 3, title: '아이소메트릭 게임 에셋', category: 'Stable Diffusion', price: 3000, verified: false },
  { id: 4, title: '유튜브 썸네일 최적화', category: 'Midjourney', price: 0, verified: true },
  { id: 5, title: 'SEO 콘텐츠 작성 봇', category: 'LLM Agents', price: 8000, verified: true },
  { id: 6, title: '제품 목업 생성기', category: 'Stable Diffusion', price: 4500, verified: false },
  { id: 7, title: '인스타그램 릴스 스크립트', category: 'Video Prompts', price: 2000, verified: true },
  { id: 8, title: '3D 캐릭터 컨셉아트', category: 'Midjourney', price: 6000, verified: true },
]

export const AI_TYPE_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Midjourney: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Claude: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Stable Diffusion': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'DALL-E': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  default: 'bg-surface-500/15 text-surface-400 border-surface-500/20',
}

export const CATEGORY_COLORS: Record<string, string> = {
  Game: 'text-red-400',
  Art: 'text-purple-400',
  Coding: 'text-blue-400',
  Writing: 'text-yellow-400',
  Marketing: 'text-green-400',
  default: 'text-surface-400',
}
