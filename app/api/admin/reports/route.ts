import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: member } = await supabase
    .from('members')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!member?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const reportId = Number(body.reportId)
  const status = String(body.status)

  if (!reportId || !['reviewed', 'dismissed'].includes(status)) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId)

  if (error) return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
