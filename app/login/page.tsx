'use client'

import { Suspense, useState } from 'react'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { BackgroundEffects } from '@/components/ui/BackgroundEffects'

// ─── Social login buttons config ──────────────────────────────────────────────
const COMING_SOON_PROVIDERS = [
  {
    label: 'GitHub (준비 중)',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Discord (준비 중)',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
function LoginPageContent() {
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/'

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
      console.log('location.origin:', globalThis.location.origin)

      const callbackUrl = new URL(
        '/auth/callback',
        process.env.NEXT_PUBLIC_SITE_URL || globalThis.location.origin
      )

      console.log('callbackUrl:', callbackUrl.toString())
      callbackUrl.searchParams.set('next', nextPath)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (error) throw error
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.'
      )
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-surface-900 relative flex min-h-screen items-center justify-center px-4">
      <BackgroundEffects />

      <Link
        href="/"
        className="text-surface-400 absolute top-6 left-6 flex items-center gap-2 text-sm transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        홈으로 돌아가기
      </Link>

      <div className="relative w-full max-w-md">
        <div className="border-surface-700/50 bg-surface-800/80 rounded-3xl border p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="from-brand-400 to-brand-600 shadow-brand-500/25 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">PROMPTER</h1>
            <p className="text-surface-400 mt-2 text-center text-sm">
              AI 프롬프트 마켓플레이스에 오신 것을 환영합니다
            </p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="bg-surface-700 h-px flex-1" />
            <span className="text-surface-500 text-xs">소셜 계정으로 시작</span>
            <div className="bg-surface-700 h-px flex-1" />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group border-surface-600 bg-surface-700/50 hover:border-surface-500 hover:bg-surface-700 flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isLoading ? '로그인 중...' : 'Google로 계속하기'}</span>
          </button>

          {/* Coming-soon providers */}
          <div className="mt-4 space-y-3">
            {COMING_SOON_PROVIDERS.map(({ label, icon }) => (
              <button
                key={label}
                disabled
                className="border-surface-700/50 bg-surface-800/50 text-surface-500 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium opacity-50"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <p className="text-surface-500 mt-6 text-center text-xs">
            계속 진행하면{' '}
            <a href="#" className="text-brand-400 hover:underline">
              서비스 약관
            </a>{' '}
            및{' '}
            <a href="#" className="text-brand-400 hover:underline">
              개인정보 처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        <p className="text-surface-500 mt-6 text-center text-sm">
          계정이 없으신가요?{' '}
          <span className="text-surface-300">
            Google로 로그인하면 자동으로 가입됩니다
          </span>
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-surface-900 flex min-h-screen items-center justify-center">
          <Loader2 className="text-brand-400 h-8 w-8 animate-spin" />
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}

// ─── Google icon (extracted to keep JSX clean) ────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
