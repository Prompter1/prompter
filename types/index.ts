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
  ai_versions: string[]
  categories: string[]
  author: Member
  is_verified: boolean
  result_media: string[]
  view_count?: number
  sales_count?: number
  created_at?: string | null
}

// ─── Featured Prompt (lightweight, no author) ─────────────────────────────────
export interface FeaturedPrompt {
  id: number
  title: string
  category: string
  price: number
  verified: boolean
}
