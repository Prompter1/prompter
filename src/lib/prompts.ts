import { createSupabaseServerClient } from './supabase-server'

interface PromptStep {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: string[]
  outputText: string
  outputMedia: string[]
}

interface CreatePromptPostParams {
  title: string
  content: string
  price: number
  ai_types: string[]
  ai_versions: string[]
  categories: string[]
  author_id: string
  result_media: { type: string; url: string; name: string }[]
  is_verified: boolean
  steps?: PromptStep[]
}

export async function createPromptPost(
  params: CreatePromptPostParams
): Promise<{ id: number }> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('prompt_posts')
    .insert({
      title: params.title,
      content: params.content,
      price: params.price,
      ai_types: params.ai_types,
      ai_versions: params.ai_versions,
      categories: params.categories,
      author_id: params.author_id,
      result_media: params.result_media,
      is_verified: params.is_verified,
    })
    .select('id')
    .single()

  if (error || !data)
    throw new Error(error?.message ?? 'prompt_posts insert 실패')

  const postId = data.id

  // prompt_steps 삽입
  if (params.steps && params.steps.length > 0) {
    const stepsToInsert = params.steps.map((s, idx) => ({
      prompt_post_id: postId,
      step_order: idx + 1,
      ai_type: s.aiType,
      ai_version: s.aiVersion,
      input_prompt: s.inputPrompt,
      input_media: s.inputMedia,
      output_text: s.outputText,
      output_media: s.outputMedia,
    }))

    const { error: stepsErr } = await supabase
      .from('prompt_steps')
      .insert(stepsToInsert)

    if (stepsErr) {
      console.error('prompt_steps insert error:', stepsErr)
      // 스텝 삽입 실패는 전체 롤백하지 않고 로깅만 (post는 이미 생성됨)
    }
  }

  return { id: postId }
}
