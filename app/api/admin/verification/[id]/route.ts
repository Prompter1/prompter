import { NextResponse } from 'next/server'
import { requireAdminAPI } from '@/src/lib/admin-auth'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteContext) {
  const { id: requestId } = await context.params

  if (!UUID_REGEX.test(requestId)) {
    return NextResponse.json({ error: '잘못된 요청 ID' }, { status: 400 })
  }

  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

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

  const adminClient = await createSupabaseAdminClient()

  const { data: vr, error: fetchErr } = await adminClient
    .from('verification_requests')
    .select('id, status, prompt_post_id')
    .eq('id', requestId)
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
    const { error } = await adminClient
      .from('verification_requests')
      .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
      .eq('id', requestId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, status: 'REJECTED' })
  }

  const { error: u1 } = await adminClient
    .from('verification_requests')
    .update({ status: 'APPROVED', updated_at: new Date().toISOString() })
    .eq('id', requestId)

  if (u1) {
    return NextResponse.json({ error: u1.message }, { status: 500 })
  }

  const { error: u2 } = await adminClient
    .from('prompt_posts')
    .update({ is_verified: true })
    .eq('id', vr.prompt_post_id)

  if (u2) {
    return NextResponse.json({ error: u2.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: 'APPROVED' })
}
