import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function POST(req: Request) {
  let body: {
    title: string
    content: string
    price: number
    ai_types: string[]
    ai_versions: string[]
    categories: string[]
    result_media: { type: string; url: string; name: string }[]
    is_verified: boolean
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
  if (!user)
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const { data: post, error: postErr } = await supabase
    .from('prompt_posts')
    .insert({
      title: body.title,
      content: body.content,
      price: body.price,
      ai_types: body.ai_types,
      ai_versions: body.ai_versions,
      categories: body.categories,
      author_id: user.id,
      result_media: body.result_media,
      is_verified: body.is_verified,
    })
    .select('id')
    .single()

  if (postErr || !post) {
    return NextResponse.json(
      { error: postErr?.message ?? '저장 실패' },
      { status: 500 }
    )
  }

  if (body.steps?.length > 0) {
    const { error: stepsErr } = await supabase.from('prompt_steps').insert(
      body.steps.map((s, idx) => ({
        prompt_post_id: post.id,
        step_order: idx + 1,
        ai_type: s.aiType,
        ai_version: s.aiVersion,
        input_prompt: s.inputPrompt,
        input_media: s.inputMedia,
        output_text: s.outputText,
        output_media: s.outputMedia,
      }))
    )
    if (stepsErr) console.error('prompt_steps insert error:', stepsErr)
  }

  return NextResponse.json({ id: post.id })
}
