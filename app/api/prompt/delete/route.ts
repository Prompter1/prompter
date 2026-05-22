import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

function extractPathFromUrl(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const publicIndex = parts.indexOf('public')
    const bucket = parts[publicIndex + 1]
    if (bucket !== 'prompt-media') return null
    return parts.slice(publicIndex + 2).join('/')
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

  // 게시물 조회
  const { data: post } = await supabase
    .from('prompt_posts')
    .select('id, author_id, result_media, price')
    .eq('id', postId)
    .maybeSingle()

  if (!post) {
    return NextResponse.json({ error: '게시물 없음' }, { status: 404 })
  }

  if (post.author_id !== user.id) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  // 구매 이력 확인 (유료 게시물에 한해)
  if (post.price > 0) {
    const { count: salesCount } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('prompt_post_id', postId)

    if (salesCount && salesCount > 0) {
      // 구매자가 있으면 소프트 삭제 — 데이터·미디어는 유지
      const { error } = await supabase
        .from('prompt_posts')
        .update({ is_deleted: true })
        .eq('id', postId)
        .eq('author_id', user.id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, softDeleted: true })
    }
  }

  // 구매자 없음 → 하드 삭제 (스토리지 포함)
  const { data: steps } = await supabase
    .from('prompt_steps')
    .select('input_media, output_media')
    .eq('prompt_post_id', postId)

  const urls: string[] = []
  if (Array.isArray(post.result_media)) {
    urls.push(...post.result_media.map((m: any) => m.url ?? m))
  }
  steps?.forEach((s: any) => {
    if (Array.isArray(s.input_media)) urls.push(...s.input_media)
    if (Array.isArray(s.output_media)) urls.push(...s.output_media)
  })

  const paths = [
    ...new Set(urls.map(extractPathFromUrl).filter((v): v is string => !!v)),
  ]

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('prompt-media')
      .remove(paths)
    if (storageError) console.error('storage delete error:', storageError)
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

  return NextResponse.json({ ok: true, softDeleted: false })
}
