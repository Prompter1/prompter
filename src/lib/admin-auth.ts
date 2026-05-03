import { redirect } from 'next/navigation'
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

/** 관리자가 아니면 안내 페이지로 보냅니다. (홈으로 조용히 돌려보내지 않음) */
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
