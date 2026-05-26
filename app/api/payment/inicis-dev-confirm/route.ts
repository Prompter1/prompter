import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { resolveFeeRate } from '@/src/lib/settlement-utils'

// 개발 전용 — nextUrl 콜백 없이 로컬에서 결제 흐름을 완성하기 위한 우회 엔드포인트
// INICIS_DEV_BYPASS=true 설정 시에만 동작
export async function GET(req: NextRequest) {
  if (process.env.INICIS_DEV_BYPASS !== 'true') {
    return NextResponse.json({ error: '개발 모드에서만 사용 가능합니다.' }, { status: 403 })
  }

  const oid = req.nextUrl.searchParams.get('oid')
  if (!oid) return NextResponse.json({ error: 'oid 파라미터 필요' }, { status: 400 })

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const adminSupabase = createSupabaseAdminClient()

  const { data: pending } = await adminSupabase
    .from('inicis_pending_orders')
    .select('buyer_id, post_id, amount')
    .eq('order_id', oid)
    .eq('buyer_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!pending) {
    return NextResponse.json({ error: '유효한 주문을 찾을 수 없습니다.' }, { status: 404 })
  }

  const { data: post } = await adminSupabase
    .from('prompt_posts')
    .select('author_id, price')
    .eq('id', pending.post_id)
    .single()

  if (!post || post.price !== pending.amount) {
    return NextResponse.json({ error: '가격 불일치' }, { status: 400 })
  }

  const { data: seller } = await adminSupabase
    .from('members')
    .select('seller_type, is_promotion')
    .eq('id', post.author_id)
    .maybeSingle()

  const feeRate = resolveFeeRate(
    seller?.seller_type ?? null,
    Boolean(seller?.is_promotion)
  )

  const devTid = `DEV-${oid}`

  const { error } = await adminSupabase.rpc('purchase_prompt_by_admin', {
    p_buyer_id: pending.buyer_id,
    p_post_id:  pending.post_id,
    p_order_id: oid,
    p_tid:      devTid,
    p_amount:   pending.amount,
    p_fee_rate: feeRate,
  })

  if (error && !error.message.includes('이미')) {
    return NextResponse.json({ error: 'DB 처리 실패', detail: error.message }, { status: 500 })
  }

  await adminSupabase
    .from('inicis_pending_orders')
    .update({ status: 'confirmed', tid: devTid })
    .eq('order_id', oid)

  return NextResponse.json({ ok: true })
}
