import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { ADMIN_EVIDENCE_BUCKET } from '@/src/lib/storage'

export type PendingVerificationRow = {
  id: string                // ✅ UUID → string
  prompt_post_id: number
  author_id: string
  status: string
  evidence_paths: string[]
  created_at: string
  prompt_posts: {
    id: number
    title: string
    price: number
    author_id: string
    is_verified: boolean
  } | null
}

export async function fetchPendingVerifications(): Promise<
  PendingVerificationRow[]
> {
  const supabase = await createSupabaseServerClient()
  const { data: requests, error } = await supabase
    .from('verification_requests')
    .select('id, prompt_post_id, author_id, status, evidence_paths, created_at')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true })

  if (error || !requests?.length) {
    if (error) console.error('fetchPendingVerifications', error)
    return []
  }

  const postIds = [...new Set(requests.map((r) => r.prompt_post_id))]
  const { data: posts, error: postsErr } = await supabase
    .from('prompt_posts')
    .select('id, title, price, author_id, is_verified')
    .in('id', postIds)

  if (postsErr) {
    console.error('fetchPendingVerifications posts', postsErr)
  }

  const byId = new Map(
    (posts ?? []).map((p) => [
      p.id,
      p as PendingVerificationRow['prompt_posts'],
    ])
  )

  return requests.map((r) => ({
    ...r,
    evidence_paths: Array.isArray(r.evidence_paths) ? r.evidence_paths : [],
    prompt_posts: byId.get(r.prompt_post_id) ?? null,
  }))
}

export type VerificationReviewBundle = {
  request: {
    id: string              // ✅ UUID → string
    prompt_post_id: number
    author_id: string
    status: string
    evidence_paths: string[]
    created_at: string
  }
  prompt: {
    id: number
    title: string
    content: string
    price: number
    ai_types: string[] | null
    categories: string[] | null
    author_id: string
    created_at: string | null
    is_verified: boolean
    result_media: unknown
  } | null
  submitter: { nickname: string | null; email: string | null } | null
  evidenceSignedUrls: { path: string; url: string | null }[]
}

// ✅ requestId: number → string (UUID)
export async function fetchVerificationReviewBundle(
  requestId: string
): Promise<VerificationReviewBundle | null> {
  const supabase = await createSupabaseServerClient()

  const { data: reqRow, error: reqErr } = await supabase
    .from('verification_requests')
    .select('id, prompt_post_id, author_id, status, evidence_paths, created_at')
    .eq('id', requestId)
    .maybeSingle()

  if (reqErr || !reqRow) return null

  const { data: prompt } = await supabase
    .from('prompt_posts')
    .select(
      'id, title, content, price, ai_types, categories, author_id, created_at, is_verified, result_media'
    )
    .eq('id', reqRow.prompt_post_id)
    .maybeSingle()

  let submitter: VerificationReviewBundle['submitter'] = null
  if (reqRow.author_id) {
    const { data: mem } = await supabase
      .from('members')
      .select('nickname, email')
      .eq('id', reqRow.author_id)
      .maybeSingle()
    if (mem) submitter = { nickname: mem.nickname, email: mem.email }
  }

  const paths = Array.isArray(reqRow.evidence_paths)
    ? reqRow.evidence_paths
    : []
  const evidenceSignedUrls: { path: string; url: string | null }[] = []

  for (const path of paths) {
    const { data: signed, error: signErr } = await supabase.storage
      .from(ADMIN_EVIDENCE_BUCKET)
      .createSignedUrl(path, 3600)

    if (signErr) {
      evidenceSignedUrls.push({ path, url: null })
    } else {
      evidenceSignedUrls.push({ path, url: signed.signedUrl })
    }
  }

  return {
    request: {
      id: reqRow.id,
      prompt_post_id: reqRow.prompt_post_id,
      author_id: reqRow.author_id,
      status: reqRow.status,
      evidence_paths: paths,
      created_at: reqRow.created_at,
    },
    prompt: prompt ?? null,
    submitter,
    evidenceSignedUrls,
  }
}
