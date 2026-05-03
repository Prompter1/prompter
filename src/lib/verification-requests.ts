import { supabase } from '@/src/lib/supabase'

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface CreateVerificationRequestInput {
  prompt_post_id: number
  author_id: string
  evidence_paths: string[]
}

/**
 * 유료 프롬프트 검수 요청을 PENDING 상태로 등록합니다.
 */
export async function createVerificationRequest(
  input: CreateVerificationRequestInput
): Promise<void> {
  const { error } = await supabase.from('verification_requests').insert({
    prompt_post_id: input.prompt_post_id,
    author_id: input.author_id,
    status: 'PENDING' satisfies VerificationStatus,
    evidence_paths: input.evidence_paths,
  })

  if (error) throw new Error(error.message)
}
