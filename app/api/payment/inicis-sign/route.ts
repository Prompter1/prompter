import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { nanoid } from 'nanoid'

const INICIS_MID = process.env.INICIS_MID!
const INICIS_SIGN_KEY = process.env.INICIS_SIGN_KEY!

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

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
  const orderId = `pmt-${postId}-${nanoid(8)}`

  // INIStdPay 신형 방식
  // mKey = SHA256(signKey) — 가맹점 키 해시, 주문별 아님
  const mKey = createHash('sha256').update(INICIS_SIGN_KEY).digest('hex')
  // signature = SHA256(oid + price + timestamp + signKey) — 주문별 위변조 방지
  const signature = createHash('sha256')
    .update(`${orderId}${amount}${timestamp}${INICIS_SIGN_KEY}`)
    .digest('hex')

  const { error } = await adminSupabase
    .from('inicis_pending_orders')
    .insert({ order_id: orderId, buyer_id: user.id, post_id: postId, amount })

  if (error) {
    console.error('[inicis-sign] insert error:', error)
    return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ mid: INICIS_MID, orderId, timestamp, mKey, signature })
}
