import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { isMemberAdmin } from '@/src/lib/admin-auth'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteContext) {
  const { id: requestId } = await context.params

  // ✅ parseInt 제거 — UUID 형식 검증으로 교체
  if (!UUID_REGEX.test(requestId)) {
    return NextResponse.json({ error: '잘못된 요청 ID' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const admin = await isMemberAdmin(supabase, user.id)
  if (!admin) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  let body: { action?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'JSON 본문이 필요합니다.' },
      { status: 400 }
    )
  }

  const action = body.action
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json(
      { error: 'action은 approve 또는 reject 여야 합니다.' },
      { status: 400 }
    )
  }

  const { data: vr, error: fetchErr } = await supabase
    .from('verification_requests')
    .select('id, status, prompt_post_id')
    .eq('id', requestId) // ✅ UUID string 그대로 사용
    .maybeSingle()

  if (fetchErr || !vr) {
    return NextResponse.json(
      { error: '검수 요청을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (vr.status !== 'PENDING') {
    return NextResponse.json(
      { error: '이미 처리된 요청입니다.' },
      { status: 409 }
    )
  }

  if (action === 'reject') {
    const { error } = await supabase
      .from('verification_requests')
      .update({ status: 'REJECTED' })
      .eq('id', requestId) // ✅
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, status: 'REJECTED' })
  }

  const { error: u1 } = await supabase
    .from('verification_requests')
    .update({ status: 'APPROVED' })
    .eq('id', requestId) // ✅

  if (u1) {
    return NextResponse.json({ error: u1.message }, { status: 500 })
  }

  const { error: u2 } = await supabase
    .from('prompt_posts')
    .update({ is_verified: true })
    .eq('id', vr.prompt_post_id)

  if (u2) {
    return NextResponse.json({ error: u2.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: 'APPROVED' })
}
