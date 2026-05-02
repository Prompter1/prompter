// ─── Member / Author ──────────────────────────────────────────────────────────
export interface Member {
  id: string
  nickname: string
  avatar_url: string
  points: number
  is_sponsor: boolean
}

// ─── Prompt ───────────────────────────────────────────────────────────────────
export interface PromptPost {
  id: number
  title: string
  content: string
  price: number
  ai_types: string[]
  categories: string[]
  author: Member
  is_verified: boolean
  result_media: string[]
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  name: string
  icon: React.ComponentType<{ className?: string }>
  prompts: number
  gradient: string
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
export interface Stat {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

// ─── Featured Prompt (lightweight, no author) ─────────────────────────────────
export interface FeaturedPrompt {
  id: number
  title: string
  category: string
  price: number
  verified: boolean
}
