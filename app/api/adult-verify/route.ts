import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

/**
 * POST /api/adult-verify
 * 로그인한 사용자의 members.adult_verified를 true로 설정합니다.
 * 실제 서비스에서는 본인인증(PASS, KCB 등) API 연동 필요.
 * 현재는 동의만으로 처리하는 심플 버전입니다.
 */
export async function POST() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { error } = await supabase
    .from('members')
    .update({ adult_verified: true })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

/**
 * GET /api/adult-verify
 * 현재 로그인 사용자의 adult_verified 값을 반환합니다.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ verified: false })
  }

  const { data } = await supabase
    .from('members')
    .select('adult_verified')
    .eq('id', user.id)
    .maybeSingle()

  return NextResponse.json({ verified: Boolean(data?.adult_verified) })
}
