import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!

const CHARGE_PACKAGES = new Map<number, number>([
  [1000, 1000],
  [3000, 3000],
  [5000, 5300],
  [10000, 11000],
  [30000, 35000],
  [50000, 60000],
])

export async function POST(req: Request) {
  // ── 1. 요청 파싱 ──────────────────────────────────────────────────────────
  let body: {
    paymentKey?: string
    orderId?: string
    amount?: number
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const { paymentKey, orderId, amount } = body
  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    )
  }

  const points = CHARGE_PACKAGES.get(amount)
  if (!points) {
    return NextResponse.json(
      { error: '지원하지 않는 충전 금액입니다.' },
      { status: 400 }
    )
  }

  if (!TOSS_SECRET_KEY) {
    return NextResponse.json(
      { error: '토스페이먼츠 시크릿 키가 아직 설정되지 않았습니다.' },
      { status: 503 }
    )
  }

  // ── 2. 로그인 유저 확인 ───────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // ── 3. 토스페이먼츠 결제 승인 API 호출 ───────────────────────────────────
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
    console.error('토스 승인 실패:', tossData)
    return NextResponse.json(
      { error: tossData.message ?? '결제 승인에 실패했습니다.' },
      { status: tossRes.status }
    )
  }

  // ── 4. 결제 내역 저장 + 포인트 증가를 DB 함수 하나로 처리 ────────────────
  const { data: totalPoints, error: confirmErr } = await supabase.rpc(
    'confirm_credit_charge',
    {
      order_id: orderId,
      payment_key: paymentKey,
      charge_amount: amount,
      charge_points: points,
      toss_payload: tossData,
    }
  )

  if (confirmErr) {
    const message = confirmErr.message ?? '포인트 업데이트에 실패했습니다.'
    console.error('confirm_credit_charge error:', confirmErr)
    return NextResponse.json(
      { error: message },
      { status: message.includes('이미') ? 409 : 500 }
    )
  }

  return NextResponse.json({ ok: true, totalPoints })
}
