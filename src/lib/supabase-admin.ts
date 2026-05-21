import { createClient } from '@supabase/supabase-js'

/**
 * Service role 키를 사용하는 서버 전용 admin 클라이언트.
 * @supabase/ssr의 createServerClient는 쿠키 세션 JWT를 Authorization에 주입하여
 * service role 권한을 덮어쓰므로, supabase-js의 createClient를 직접 사용한다.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
