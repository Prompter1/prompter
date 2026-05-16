import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

function extractPathFromUrl(url: string) {
  try {
    const u = new URL(url)

    // pathname:
    // /storage/v1/object/public/prompt-media/{authorId}/{file}
    const parts = u.pathname.split('/')

    const publicIndex = parts.indexOf('public')
    const bucket = parts[publicIndex + 1] // prompt-media

    if (bucket !== 'prompt-media') return null

    // 👉 여기서부터가 우리가 필요한 path
    return parts.slice(publicIndex + 2).join('/')
    // 결과: {authorId}/{filename}
  } catch {
    return null
  }
}

export async function DELETE(req: Request) {
  let body: { postId?: number }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { postId } = body
  if (!postId || typeof postId !== 'number') {
    return NextResponse.json({ error: 'postId가 필요합니다.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // ────────────────
  // 1. 게시물 조회
  // ────────────────
  const { data: post } = await supabase
    .from('prompt_posts')
    .select('id, author_id, result_media')
    .eq('id', postId)
    .maybeSingle()

  if (!post) {
    return NextResponse.json({ error: '게시물 없음' }, { status: 404 })
  }

  if (post.author_id !== user.id) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  // ────────────────
  // 2. steps 조회
  // ────────────────
  const { data: steps } = await supabase
    .from('prompt_steps')
    .select('input_media, output_media')
    .eq('prompt_post_id', postId)

  // ────────────────
  // 3. 모든 URL 수집
  // ────────────────
  const urls: string[] = []

  // result_media
  if (Array.isArray(post.result_media)) {
    urls.push(...post.result_media.map((m: any) => m.url))
  }

  // step media
  steps?.forEach((s: any) => {
    if (Array.isArray(s.input_media)) urls.push(...s.input_media)
    if (Array.isArray(s.output_media)) urls.push(...s.output_media)
  })

  // ────────────────
  // 4. path 변환
  // ────────────────
  const paths = [
    ...new Set(urls.map(extractPathFromUrl).filter((v): v is string => !!v)),
  ]

  // ────────────────
  // 5. storage 삭제
  // ────────────────
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('prompt-media')
      .remove(paths)

    if (storageError) {
      console.error('storage delete error:', storageError)
    }
  }

  await supabase.from('prompt_steps').delete().eq('prompt_post_id', postId)

  const { error } = await supabase
    .from('prompt_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
