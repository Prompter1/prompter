import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const INICIS_MID = process.env.INICIS_MID!
const INICIS_SIGN_KEY = process.env.INICIS_SIGN_KEY!

export async function POST(req: Request) {
  if (!INICIS_MID || !INICIS_SIGN_KEY) {
    return NextResponse.json({ error: 'KG이니시스 키가 설정되지 않았습니다.' }, { status: 503 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  let body: { postId?: number; amount?: number }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 }) }

  const { postId, amount } = body
  if (!postId || !amount || amount <= 0) {
    return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
  }

  const timestamp = Date.now().toString()
  const orderId = `pmt-${postId}-${randomBytes(4).toString('hex')}`

  // mKey = SHA256(signKey)
  const mKey = createHash('sha256').update(INICIS_SIGN_KEY).digest('hex')
  // signature = SHA256("oid=X&price=X&timestamp=X") — 알파벳 순, key=value 형식
  const signature = createHash('sha256')
    .update(`oid=${orderId}&price=${amount}&timestamp=${timestamp}`)
    .digest('hex')
  // verification = SHA256("oid=X&price=X&signKey=X&timestamp=X") — signKey 포함
  const verification = createHash('sha256')
    .update(`oid=${orderId}&price=${amount}&signKey=${INICIS_SIGN_KEY}&timestamp=${timestamp}`)
    .digest('hex')

  const adminSupabase = createSupabaseAdminClient()
  const { error } = await adminSupabase
    .from('inicis_pending_orders')
    .insert({ order_id: orderId, buyer_id: user.id, post_id: postId, amount })

  if (error) {
    console.error('[inicis-sign] insert error:', error)
    return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({
    mid: INICIS_MID,
    orderId,
    timestamp,
    mKey,
    signature,
    verification,
    buyerEmail: user.email ?? '',
  })
}
