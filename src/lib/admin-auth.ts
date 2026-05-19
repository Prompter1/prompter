import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function isMemberAdmin(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('members')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return false
  return Boolean(data.is_admin)
}

/** 관리자가 아니면 안내 페이지로 보냅니다. (Server Component / Page 전용) */
export async function requireAdmin() {
  const { supabase, user } = await getSessionUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const admin = await isMemberAdmin(supabase, user.id)

  if (!admin) {
    redirect('/admin-forbidden')
  }
  return { supabase, user }
}

/** API Route 전용 관리자 인증. 미인증이면 NextResponse를 반환합니다. */
export async function requireAdminAPI(): Promise<
  | { supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>; user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>['user']> }
  | NextResponse
> {
  const { supabase, user } = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  const admin = await isMemberAdmin(supabase, user.id)
  if (!admin) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }
  return { supabase, user }
}
