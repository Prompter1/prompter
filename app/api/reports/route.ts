import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const body = await req.json()
  const postId = Number(body.postId)
  const content = String(body.content ?? '').trim()

  if (!postId || !content) {
    return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 })
  }

  if (content.length > 500) {
    return NextResponse.json({ error: '신고 내용은 500자를 초과할 수 없습니다.' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', user.id)
    .eq('post_id', postId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: '이미 신고한 게시물입니다.' }, { status: 409 })
  }

  const { error } = await supabase
    .from('reports')
    .insert({ reporter_id: user.id, post_id: postId, content })

  if (error) return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
