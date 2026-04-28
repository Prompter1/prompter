import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // 1. 에러가 있는 경우 로그인 페이지로 리다이렉트 (기존 로직 유지)
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (code) {
    // Next.js 15 이상에서는 cookies()가 비동기이므로 await가 필요합니다.
    const cookieStore = await cookies()

    // 2. 최신 createServerClient를 통한 Supabase 객체 생성
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    try {
      // 3. 인증 코드를 세션으로 교환 (기존 로직 유지)
      await supabase.auth.exchangeCodeForSession(code)
    } catch (err) {
      console.error('Error exchanging code for session:', err)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('인증 처리 중 오류가 발생했습니다.')}`
      )
    }
  }

  // 4. 로그인 완료 후 메인 페이지로 이동 (기존 로직 유지)
  return NextResponse.redirect(requestUrl.origin)
}
