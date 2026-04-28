import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('인증 코드가 없습니다.')}`
    )
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 기존 get, set, remove 대신 getAll, setAll을 사용합니다.
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트 내에서 호출될 경우를 대비한 예외 처리입니다.
            // 하지만 이 파일은 Route Handler(GET)이므로 문제없이 작동합니다.
          }
        },
      },
    }
  )

  try {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) throw exchangeError
  } catch (err) {
    console.error('Error exchanging code for session:', err)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('인증 처리 중 오류가 발생했습니다.')}`
    )
  }

  // 인증 성공 시 메인 페이지나 대시보드로 리다이렉트
  return NextResponse.redirect(origin)
}
