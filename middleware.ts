import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Supabase/Google 설정이 Site URL(/)로만 돌려보내는 경우,
 * ?code= 가 루트에 붙어 세션 교환이 스킵되는 문제를 막습니다.
 * 쿼리(code, state, next 등)는 그대로 /auth/callback 으로 전달합니다.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname === '/' && searchParams.has('code')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
