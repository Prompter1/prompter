import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY
const PLATFORM_FEE_RATE = 0.15

export async function POST(req: Request) {
  let body: {
    paymentKey?: string
    orderId?: string
    amount?: number
    postId?: number
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const { paymentKey, orderId, amount, postId } = body
  if (!paymentKey || !orderId || !amount || !postId) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    )
  }

  if (!TOSS_SECRET_KEY) {
    return NextResponse.json(
      { error: '토스페이먼츠 시크릿 키가 설정되지 않았습니다.' },
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

  const { data: post, error: postError } = await supabase
    .from('prompt_posts')
    .select('price')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    return NextResponse.json(
      { error: '프롬프트를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (post.price !== amount) {
    return NextResponse.json(
      { error: '결제 금액이 프롬프트 가격과 일치하지 않습니다.' },
      { status: 400 }
    )
  }

  // 토스페이먼츠 결제 승인
  const encryptedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')
  const tossRes = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  )

  const tossData = await tossRes.json()

  if (!tossRes.ok) {
    return NextResponse.json(
      { error: tossData.message ?? '결제 승인에 실패했습니다.' },
      { status: tossRes.status }
    )
  }

  const { data, error } = await supabase
    .rpc('purchase_prompt_direct', {
      post_id: postId,
      order_id: orderId,
      payment_key: paymentKey,
      paid_amount: amount,
      platform_fee_rate: PLATFORM_FEE_RATE,
      toss_payload: tossData,
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
