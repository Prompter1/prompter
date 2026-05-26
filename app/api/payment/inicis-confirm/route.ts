import { NextRequest } from 'next/server'
import { createHash } from 'node:crypto'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { resolveFeeRate } from '@/src/lib/settlement-utils'

const INICIS_MID = process.env.INICIS_MID!
const INICIS_SIGN_KEY = process.env.INICIS_SIGN_KEY!

function fail(msg: string, status = 400) {
  return new Response(msg, { status })
}

// POST /api/payment/inicis-confirm  (KG이니시스 nextUrl 서버 콜백 — INIStdPay 2단계 인증)
// KG이니시스 서버에서 직접 호출 — 사용자 세션 없음
export async function POST(req: NextRequest) {
  const adminSupabase = createSupabaseAdminClient()

  const markFailed = (orderId: string) =>
    adminSupabase
      .from('inicis_pending_orders')
      .update({ status: 'failed' })
      .eq('order_id', orderId)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return fail('INVALID_FORM', 400)
  }

  const get = (k: string) => (form.get(k) as string | null) ?? ''

  // ── 1단계: 이니시스 → 우리 서버 콜백 ────────────────────────────────────
  const resultCode  = get('resultCode')
  const authToken   = get('authToken')
  const authUrl     = get('authUrl')
  const orderNumber = get('orderNumber')   // 우리가 보낸 oid

  if (!orderNumber) return fail('MISSING_ORDER_NUMBER')

  if (resultCode !== '0000') {
    await markFailed(orderNumber)
    return new Response('OK', { status: 200 })
  }

  if (!authToken || !authUrl) return fail('MISSING_AUTH_PARAMS')

  // ── 2단계: 우리 서버 → 이니시스 인증 완료 요청 ──────────────────────────
  const ts      = Date.now().toString()
  const authSig = createHash('sha256').update(authToken + ts).digest('hex')

  let authData: Record<string, string>
  try {
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ mid: INICIS_MID, authToken, timestamp: ts, signature: authSig }),
    })
    authData = (await authRes.json()) as Record<string, string>
  } catch {
    return fail('AUTH_FETCH_ERROR', 500)
  }

  if (authData.resultCode !== '0000') {
    await markFailed(orderNumber)
    return new Response('OK', { status: 200 })
  }

  const tid      = authData.tid ?? ''
  const oid      = authData.MOID ?? orderNumber
  const totPrice = authData.TotPrice ?? ''
  const amount   = Number(totPrice)

  if (!tid || !totPrice || Number.isNaN(amount) || amount <= 0) {
    return fail('INVALID_AUTH_RESPONSE')
  }

  // 서명 검증: SHA256(TotPrice + signKey)
  const expectedSig = createHash('sha256').update(totPrice + INICIS_SIGN_KEY).digest('hex')
  if (authData.signature && authData.signature !== expectedSig) return fail('SIGN_MISMATCH')

  // ── 주문 조회 ──────────────────────────────────────────────────────────────
  const { data: pending } = await adminSupabase
    .from('inicis_pending_orders')
    .select('buyer_id, post_id, amount')
    .eq('order_id', oid)
    .eq('status', 'pending')
    .single()

  if (!pending) return fail('ORDER_NOT_FOUND')
  if (pending.amount !== amount) return fail('AMOUNT_MISMATCH')

  // ── 판매자 수수료율 결정 ───────────────────────────────────────────────────
  const { data: post } = await adminSupabase
    .from('prompt_posts')
    .select('author_id, price')
    .eq('id', pending.post_id)
    .single()

  if (!post || post.price !== amount) return fail('PRICE_MISMATCH')

  const { data: seller } = await adminSupabase
    .from('members')
    .select('seller_type, is_promotion')
    .eq('id', post.author_id)
    .maybeSingle()

  const feeRate = resolveFeeRate(
    seller?.seller_type ?? null,
    Boolean(seller?.is_promotion)
  )

  // ── 구매 처리 (원자적 RPC) ─────────────────────────────────────────────────
  const { error } = await adminSupabase.rpc('purchase_prompt_by_admin', {
    p_buyer_id: pending.buyer_id,
    p_post_id:  pending.post_id,
    p_order_id: oid,
    p_tid:      tid,
    p_amount:   amount,
    p_fee_rate: feeRate,
  })

  if (error && !error.message.includes('이미')) {
    return fail('DB_ERROR', 500)
  }

  await adminSupabase
    .from('inicis_pending_orders')
    .update({ status: 'confirmed', tid })
    .eq('order_id', oid)

  return new Response('OK', { status: 200 })
}
