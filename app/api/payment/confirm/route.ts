import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!

export async function POST(req: Request) {
  // ── 1. 요청 파싱 ──────────────────────────────────────────────────────────
  let body: {
    paymentKey?: string
    orderId?: string
    amount?: number
    points?: number
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const { paymentKey, orderId, amount, points } = body
  if (!paymentKey || !orderId || !amount || !points) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
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

  // ── 4. 중복 처리 방지 — orderId 검사 ─────────────────────────────────────
  const { data: existing } = await supabase
    .from('payment_orders')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: '이미 처리된 주문입니다.' },
      { status: 409 }
    )
  }

  // ── 5. 결제 내역 저장 ─────────────────────────────────────────────────────
  const { error: insertErr } = await supabase.from('payment_orders').insert({
    user_id: user.id,
    order_id: orderId,
    payment_key: paymentKey,
    amount,
    points,
    status: 'DONE',
    raw: tossData,
  })

  if (insertErr) {
    console.error('payment_orders insert error:', insertErr)
    return NextResponse.json(
      { error: '결제 내역 저장에 실패했습니다.' },
      { status: 500 }
    )
  }

  // ── 6. 유저 포인트 증가 ───────────────────────────────────────────────────
  const { data: member, error: fetchErr } = await supabase
    .from('members')
    .select('points')
    .eq('id', user.id)
    .single()

  if (fetchErr || !member) {
    return NextResponse.json(
      { error: '유저 정보를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  const newPoints = member.points + points
  const { error: updateErr } = await supabase
    .from('members')
    .update({ points: newPoints })
    .eq('id', user.id)

  if (updateErr) {
    console.error('points update error:', updateErr)
    return NextResponse.json(
      { error: '포인트 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, totalPoints: newPoints })
}
