import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminAPI } from '@/src/lib/admin-auth'

// Uses supabase-js directly (not SSR) because the SSR client sends the user JWT,
// which cannot invoke service-role-only RPCs. Service role key is required here.
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(req: Request) {
  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

  let year: number | null = null
  let month: number | null = null

  const body = await req.json().catch(() => ({}))
  if (typeof body.year === 'number') year = body.year
  if (typeof body.month === 'number') month = body.month

  if (
    (year !== null && (year < 2020 || year > 2100)) ||
    (month !== null && (month < 1 || month > 12))
  ) {
    return NextResponse.json(
      { error: '유효하지 않은 연/월 값입니다.' },
      { status: 400 }
    )
  }

  if ((year === null) !== (month === null)) {
    return NextResponse.json(
      { error: 'year 와 month 는 함께 지정해야 합니다.' },
      { status: 400 }
    )
  }

  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.rpc('run_monthly_settlement', {
      target_year: year,
      target_month: month,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message ?? '정산 집계 실패' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, result: data })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '서버 설정 오류'
    return NextResponse.json({ error: msg }, { status: 503 })
  }
}
