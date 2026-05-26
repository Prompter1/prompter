import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { resolveFeeRate } from '@/src/lib/settlement-utils'

const PORTONE_API_KEY = process.env.PORTONE_API_KEY
const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET

interface PortOnePayment {
  status: string
  amount: number
  merchant_uid: string
  imp_uid: string
}

async function getPortOneToken(): Promise<string> {
  const res = await fetch('https://api.iamport.kr/users/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imp_key: PORTONE_API_KEY,
      imp_secret: PORTONE_API_SECRET,
    }),
  })
  const json = await res.json()
  if (json.code !== 0) throw new Error(json.message ?? 'PortOne 인증 실패')
  return json.response.access_token as string
}

async function fetchPortOnePayment(
  impUid: string,
  token: string
): Promise<PortOnePayment> {
  const res = await fetch(`https://api.iamport.kr/payments/${impUid}`, {
    headers: { Authorization: token },
  })
  const json = await res.json()
  if (json.code !== 0) throw new Error(json.message ?? '결제 정보 조회 실패')
  return json.response as PortOnePayment
}

export async function POST(req: Request) {
  let body: { impUid?: string; merchantUid?: string; postId?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const { impUid, merchantUid, postId } = body
  if (!impUid || !merchantUid || !postId) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    )
  }

  if (!PORTONE_API_KEY || !PORTONE_API_SECRET) {
    return NextResponse.json(
      { error: 'PortOne API 키가 설정되지 않았습니다.' },
      { status: 503 }
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // 1. PortOne 결제 검증
  let payment: PortOnePayment
  try {
    const token = await getPortOneToken()
    payment = await fetchPortOnePayment(impUid, token)
  } catch {
    return NextResponse.json(
      { error: '결제 검증에 실패했습니다.' },
      { status: 502 }
    )
  }

  if (payment.status !== 'paid') {
    return NextResponse.json(
      { error: '결제가 완료되지 않았습니다.' },
      { status: 400 }
    )
  }

  if (payment.merchant_uid !== merchantUid) {
    return NextResponse.json(
      { error: '주문 정보가 일치하지 않습니다.' },
      { status: 400 }
    )
  }

  // 2. 프롬프트 가격 확인
  const { data: post, error: postError } = await supabase
    .from('prompt_posts')
    .select('price, author_id')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    return NextResponse.json(
      { error: '프롬프트를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (post.price !== payment.amount) {
    return NextResponse.json(
      { error: '결제 금액이 프롬프트 가격과 일치하지 않습니다.' },
      { status: 400 }
    )
  }

  // 3. 판매자 수수료율 결정
  const { data: seller } = await supabase
    .from('members')
    .select('seller_type, is_promotion')
    .eq('id', post.author_id)
    .maybeSingle()

  const platformFeeRate = resolveFeeRate(
    seller?.seller_type ?? null,
    Boolean(seller?.is_promotion)
  )

  // 4. DB 처리
  const { data, error } = await supabase
    .rpc('purchase_prompt_direct', {
      post_id: postId,
      order_id: merchantUid,
      payment_key: impUid,
      paid_amount: payment.amount,
      platform_fee_rate: platformFeeRate,
      toss_payload: { imp_uid: impUid, merchant_uid: merchantUid },
    })
    .single()

  if (error) {
    const message = error.message ?? '구매 처리에 실패했습니다.'
    return NextResponse.json(
      { error: message },
      { status: message.includes('이미') ? 409 : 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    transactionId: (data as { transaction_id: number }).transaction_id,
  })
}
