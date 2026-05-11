import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const PLATFORM_FEE_RATE = 0.1

export async function POST(req: Request) {
  let body: { postId?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { postId } = body
  if (!postId || typeof postId !== 'number') {
    return NextResponse.json({ error: 'postId가 필요합니다.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .rpc('purchase_prompt_with_credits', {
      post_id: postId,
      platform_fee_rate: PLATFORM_FEE_RATE,
    })
    .single()

  if (error) {
    const message = error.message ?? '구매 처리에 실패했습니다.'
    const status = message.includes('부족')
      ? 402
      : message.includes('이미')
        ? 409
        : message.includes('찾을 수')
          ? 404
          : 400

    return NextResponse.json({ error: message }, { status })
  }

  const purchase = data as {
    remaining_points: number
    transaction_id: number
  }

  return NextResponse.json({
    ok: true,
    remainingPoints: purchase.remaining_points,
    transactionId: purchase.transaction_id,
  })
}
