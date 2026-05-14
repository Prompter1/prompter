import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

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

  // 본인 게시물 확인
  const { data: post, error: fetchErr } = await supabase
    .from('prompt_posts')
    .select('id, author_id')
    .eq('id', postId)
    .maybeSingle()

  if (fetchErr || !post) {
    return NextResponse.json(
      { error: '게시물을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (post.author_id !== user.id) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  // prompt_steps 먼저 삭제 (cascade가 없을 경우 대비)
  await supabase.from('prompt_steps').delete().eq('prompt_post_id', postId)

  // prompt_posts 삭제
  const { error: deleteErr } = await supabase
    .from('prompt_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
