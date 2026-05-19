import { NextResponse } from 'next/server'
import { requireAdminAPI } from '@/src/lib/admin-auth'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const profileId = Number(id)

  if (!Number.isFinite(profileId) || profileId <= 0) {
    return NextResponse.json({ error: '잘못된 ID' }, { status: 400 })
  }

  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

  const body = await req.json().catch(() => ({}))
  const action = body.action
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json(
      { error: 'action은 approve 또는 reject 여야 합니다.' },
      { status: 400 }
    )
  }

  const adminClient = await createSupabaseAdminClient()

  const { data: bp, error: bpErr } = await adminClient
    .from('business_profiles')
    .select('id, member_id, verified')
    .eq('id', profileId)
    .maybeSingle()

  if (bpErr || !bp) {
    return NextResponse.json(
      { error: '사업자 정보를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (action === 'reject') {
    const { error: delErr } = await adminClient
      .from('business_profiles')
      .delete()
      .eq('id', profileId)

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 })
    }

    await adminClient
      .from('members')
      .update({ seller_type: null, settlement_status: 'pending' })
      .eq('id', bp.member_id)

    return NextResponse.json({ ok: true, action: 'rejected' })
  }

  const { error: upErr } = await adminClient
    .from('business_profiles')
    .update({ verified: true, updated_at: new Date().toISOString() })
    .eq('id', profileId)

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, action: 'approved' })
}
