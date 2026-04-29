import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 'default' 키워드를 추가하여 Next.js가 확실히 인식하게 합니다.
export default async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 유저 세션 확인 (getUser가 보안상 가장 권장됨)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 가드가 필요한 경로들
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/prompt/write') ||
    request.nextUrl.pathname.startsWith('/profile')

  // 1. 비로그인 유저가 보호된 경로 접근 시 로그인 페이지로
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. 이미 로그인한 유저가 로그인 페이지 접근 시 메인으로
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

// 이 설정이 있어야 모든 페이지에서 미들웨어가 돌지 않고 효율적으로 작동합니다.
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico, sitemap.xml, robots.txt (메타데이터 파일)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
