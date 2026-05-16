import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

// GET /api/ai-versions?ai=Midjourney  → 해당 AI의 버전 목록 반환
// GET /api/ai-versions                 → 전체 ai_name -> versions 맵 반환
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const aiName = searchParams.get('ai')

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('ai_version_catalog')
    .select('ai_name, version_name')
    .order('ai_name')
    .order('created_at', { ascending: true })

  if (aiName) {
    query = query.eq('ai_name', aiName)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (aiName) {
    // 단일 AI의 버전 배열
    return NextResponse.json({
      versions: (data ?? []).map((r) => r.version_name),
    })
  }

  // 전체 맵: { Midjourney: ['v6.1', ...], ChatGPT: [...] }
  const map: Record<string, string[]> = {}
  for (const row of data ?? []) {
    if (!map[row.ai_name]) map[row.ai_name] = []
    map[row.ai_name].push(row.version_name)
  }
  return NextResponse.json({ map })
}

// POST /api/ai-versions  body: { aiName, versionName }
// 새 버전을 카탈로그에 upsert
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: { aiName?: string; versionName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { aiName, versionName } = body
  if (!aiName?.trim() || !versionName?.trim()) {
    return NextResponse.json(
      { error: 'aiName과 versionName이 필요합니다.' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('ai_version_catalog')
    .upsert(
      { ai_name: aiName.trim(), version_name: versionName.trim() },
      { onConflict: 'ai_name,version_name' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
