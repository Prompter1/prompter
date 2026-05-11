import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const PLATFORM_FEE_RATE = 0.1 // 10%

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

  const { data: post, error: postErr } = await supabase
    .from('prompt_posts')
    .select('id, price, author_id')
    .eq('id', postId)
    .maybeSingle()

  if (postErr || !post) {
    return NextResponse.json(
      { error: '프롬프트를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (post.price === 0) {
    return NextResponse.json({ error: '무료 프롬프트입니다.' }, { status: 400 })
  }

  if (post.author_id === user.id) {
    return NextResponse.json(
      { error: '본인의 프롬프트는 구매할 수 없습니다.' },
      { status: 400 }
    )
  }

  const { data: alreadyBought } = await supabase
    .from('transactions')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('prompt_post_id', postId)
    .maybeSingle()

  if (alreadyBought) {
    return NextResponse.json(
      { error: '이미 구매한 프롬프트입니다.' },
      { status: 409 }
    )
  }

  const { data: buyer, error: buyerErr } = await supabase
    .from('members')
    .select('points')
    .eq('id', user.id)
    .single()

  if (buyerErr || !buyer) {
    return NextResponse.json(
      { error: '사용자 정보를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (buyer.points < post.price) {
    return NextResponse.json({ error: '크레딧이 부족합니다.' }, { status: 402 })
  }

  // ── 8. 수수료 계산 ────────────────────────────────────────
  const fee = Math.floor(post.price * PLATFORM_FEE_RATE)
  const sellerRevenue = post.price - fee

  // ── 9. 구매자 포인트 차감 ────────────────────────────────
  const { error: deductErr } = await supabase
    .from('members')
    .update({ points: buyer.points - post.price })
    .eq('id', user.id)

  if (deductErr) {
    return NextResponse.json(
      { error: '포인트 차감에 실패했습니다.' },
      { status: 500 }
    )
  }

  const { data: seller } = await supabase
    .from('members')
    .select('total_revenue')
    .eq('id', post.author_id)
    .single()

  const { error: revenueErr } = await supabase
    .from('members')
    .update({ total_revenue: (seller?.total_revenue ?? 0) + sellerRevenue })
    .eq('id', post.author_id)

  if (revenueErr) {
    await supabase
      .from('members')
      .update({ points: buyer.points }) // 원복
      .eq('id', user.id)
    return NextResponse.json(
      { error: '판매자 수익 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }

  const { error: txErr } = await supabase.from('transactions').insert({
    prompt_post_id: postId,
    buyer_id: user.id,
    seller_id: post.author_id,
    amount: post.price,
    fee,
    seller_revenue: sellerRevenue,
  })

  if (txErr) {
    console.error('transaction insert error:', txErr)
  }

  await supabase.rpc('increment_sales_count', { post_id: postId })

  return NextResponse.json({
    ok: true,
    remainingPoints: buyer.points - post.price,
  })
}
