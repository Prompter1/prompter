import { NextRequest } from 'next/server'
import { createHash } from 'node:crypto'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { resolveFeeRate } from '@/src/lib/settlement-utils'

const INICIS_MID = process.env.INICIS_MID!
const INICIS_SIGN_KEY = process.env.INICIS_SIGN_KEY!

// POST /api/payment/inicis-return  (KG이니시스 returnUrl — 팝업 브라우저가 POST로 호출)
// nextUrl(서버-서버) 대신 브라우저 경유로 step 1 + 2 인증을 완성, charge/success로 redirect
export async function POST(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('postId') ?? ''
  const successUrl = `/charge/success?postId=${postId}`
  const fail = (reason: string) => redirect(`${successUrl}&err=${encodeURIComponent(reason)}`)

  const adminSupabase = createSupabaseAdminClient()

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return fail('form_parse_error')
  }

  const get = (k: string) => (form.get(k) as string | null) ?? ''

  // ── step 1: 이니시스가 POST로 보내는 인증 데이터 ──────────────────────────
  const resultCode  = get('resultCode')
  const authToken   = get('authToken')
  const authUrl     = get('authUrl')
  const orderNumber = get('orderNumber')

  console.log('[inicis-return] step1', { resultCode, authToken: authToken.slice(0, 8), authUrl, orderNumber })

  if (resultCode !== '0000' || !authToken || !authUrl || !orderNumber) {
    if (orderNumber) {
      await adminSupabase
        .from('inicis_pending_orders')
        .update({ status: 'failed' })
        .eq('order_id', orderNumber)
    }
    return fail(`step1_fail:${resultCode || 'missing_fields'}`)
  }

  // ── step 2: 이니시스 인증 완료 요청 (우리 서버 → 이니시스) ─────────────────
  const ts      = Date.now().toString()
  // authSig: SHA256(authToken + timestamp) — step2 인증용 단순 연결
  const authSig = createHash('sha256').update(authToken + ts).digest('hex')

  let authData: Record<string, string>
  try {
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ mid: INICIS_MID, authToken, timestamp: ts, signature: authSig }),
    })
    const text = await authRes.text()
    authData = parseXmlFlat(text)
    console.log('[inicis-return] step2 response', authData)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[inicis-return] step2 fetch error', authUrl, msg)
    return fail(`step2_fetch_error:${encodeURIComponent(msg)}`)
  }

  if (authData.resultCode !== '0000') {
    await adminSupabase
      .from('inicis_pending_orders')
      .update({ status: 'failed' })
      .eq('order_id', orderNumber)
    return fail(`step2_fail:${authData.resultCode}`)
  }

  const tid      = authData.tid ?? ''
  const oid      = authData.MOID ?? orderNumber
  const totPrice = authData.TotPrice ?? ''
  const amount   = Number(totPrice)

  if (!tid || !totPrice || Number.isNaN(amount) || amount <= 0) {
    return fail(`missing_tid_or_price:tid=${tid},price=${totPrice}`)
  }

  // 서명 검증: SHA256("TotPrice=X&signKey=X")
  const expectedSig = createHash('sha256').update(`TotPrice=${totPrice}&signKey=${INICIS_SIGN_KEY}`).digest('hex')
  if (authData.signature && authData.signature !== expectedSig) {
    return fail('sig_mismatch')
  }

  // ── 주문 조회 및 구매 처리 ─────────────────────────────────────────────────
  const { data: pending } = await adminSupabase
    .from('inicis_pending_orders')
    .select('buyer_id, post_id, amount')
    .eq('order_id', oid)
    .eq('status', 'pending')
    .single()

  if (!pending) return fail(`pending_not_found:oid=${oid}`)
  if (pending.amount !== amount) return fail(`amount_mismatch:pending=${pending.amount},paid=${amount}`)

  const { data: post } = await adminSupabase
    .from('prompt_posts')
    .select('author_id, price')
    .eq('id', pending.post_id)
    .single()

  if (!post || post.price !== amount) return fail(`post_price_mismatch`)

  const { data: seller } = await adminSupabase
    .from('members')
    .select('seller_type, is_promotion')
    .eq('id', post.author_id)
    .maybeSingle()

  const feeRate = resolveFeeRate(
    seller?.seller_type ?? null,
    Boolean(seller?.is_promotion)
  )

  const { error } = await adminSupabase.rpc('purchase_prompt_by_admin', {
    p_buyer_id: pending.buyer_id,
    p_post_id:  pending.post_id,
    p_order_id: oid,
    p_tid:      tid,
    p_amount:   amount,
    p_fee_rate: feeRate,
  })

  if (error && !error.message.includes('이미')) {
    console.error('[inicis-return] rpc error', error)
    return fail(`rpc_error:${error.message}`)
  }

  await adminSupabase
    .from('inicis_pending_orders')
    .update({ status: 'confirmed', tid })
    .eq('order_id', oid)

  return redirect(successUrl)
}

function redirect(location: string) {
  // 303 See Other: POST 후 브라우저가 GET으로 전환해 redirect
  return new Response(null, { status: 303, headers: { Location: location } })
}

// KG이니시스 step2 응답은 XML — 단순 태그 추출
function parseXmlFlat(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const m of xml.matchAll(/<([A-Za-z_]\w*)>([^<]*)<\/\1>/g)) {
    result[m[1]] = m[2]
  }
  return result
}
