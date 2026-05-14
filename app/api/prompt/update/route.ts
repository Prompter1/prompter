import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function PATCH(req: Request) {
  let body: {
    postId: number
    title: string
    content: string
    price: number
    ai_types: string[]
    ai_versions: string[]
    categories: string[]
    result_media: { type: string; url: string; name: string }[]
    steps: {
      aiType: string
      aiVersion: string
      inputPrompt: string
      inputMedia: string[]
      outputText: string
      outputMedia: string[]
    }[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // 본인 게시물 확인
  const { data: existing, error: fetchErr } = await supabase
    .from('prompt_posts')
    .select('id, author_id')
    .eq('id', body.postId)
    .maybeSingle()

  if (fetchErr || !existing) {
    return NextResponse.json(
      { error: '게시물을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  // 게시물 업데이트
  const { error: updateErr } = await supabase
    .from('prompt_posts')
    .update({
      title: body.title,
      content: body.content,
      price: body.price,
      ai_types: body.ai_types,
      ai_versions: body.ai_versions,
      categories: body.categories,
      result_media: body.result_media,
      //is_verified: false, // 수정 시 검증 필요로 변경
    })
    .eq('id', body.postId)
    .eq('author_id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // 기존 스텝 삭제 후 재삽입
  await supabase.from('prompt_steps').delete().eq('prompt_post_id', body.postId)

  if (body.steps?.length > 0) {
    const { error: stepsErr } = await supabase.from('prompt_steps').insert(
      body.steps.map((s, idx) => ({
        prompt_post_id: body.postId,
        step_order: idx + 1,
        ai_type: s.aiType,
        ai_version: s.aiVersion,
        input_prompt: s.inputPrompt,
        input_media: s.inputMedia,
        output_text: s.outputText,
        output_media: s.outputMedia,
      }))
    )
    if (stepsErr) console.error('prompt_steps update error:', stepsErr)
  }

  return NextResponse.json({ ok: true, id: body.postId })
}
