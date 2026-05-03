import { supabase } from '@/src/lib/supabase'

export interface CreatePromptInput {
  title: string
  content: string
  price: number
  ai_types: string[]
  categories: string[]
  author_id: string
  media_urls?: string[]
  result_media?: any[]
  is_verified?: boolean
}

/**
 * prompt_posts 테이블에 새 프롬프트를 인서트합니다.
 */
export async function createPromptPost(
  input: CreatePromptInput
): Promise<{ id: number }> {
  const { data, error } = await supabase
    .from('prompt_posts')
    .insert({
      title: input.title,
      content: input.content,
      price: input.price,
      ai_types: input.ai_types,
      categories: input.categories,
      author_id: input.author_id,
      media_urls: input.media_urls,
      result_media: input.result_media,
      is_verified: input.is_verified,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data
}
