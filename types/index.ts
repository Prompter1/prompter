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
  is_adult?: boolean
  publication_status?: 'pending' | 'approved' | 'rejected'
  is_deleted?: boolean
}

// ─── Featured Prompt (lightweight, no author) ────────────────────────────────
export interface FeaturedPrompt {
  id: number
  title: string
  category: string
  price: number
  verified: boolean
}

export interface MediaPreview {
  file?: File
  url: string
  type: 'image' | 'video' | 'audio' | 'document' | 'unknown'
  name: string
  size?: number
}
