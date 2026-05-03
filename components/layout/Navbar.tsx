'use client'

import { Sparkles, LogOut, UserCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { navigationUtils } from '@/src/lib/navigation'
import { useIsAdmin } from '@/hooks/useIsAdmin'

const NAV_LINKS = [
  { label: '탐색', href: '#' },
  { label: '랭킹', href: '#' },
  { label: '커뮤니티', href: '#' },
]

export function Navbar() {
  const { user, isLoading, signOut } = useAuth()
  const { isAdmin } = useIsAdmin()
  const router = useRouter()

  return (
    <nav className="border-surface-700/50 bg-surface-900/80 fixed top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="from-brand-400 to-brand-600 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PROMPTER</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-surface-300 text-sm transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="bg-surface-700 h-8 w-24 animate-pulse rounded-xl" />
          ) : user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-brand-400 hover:text-brand-300 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  관리자
                </Link>
              )}
              <button
                onClick={() => navigationUtils.moveToMyPage(router)}
                className="text-surface-300 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                <UserCircle className="h-4 w-4" />
                마이페이지
              </button>

              <button
                onClick={signOut}
                className="border-surface-600 bg-surface-800 hover:border-surface-500 hover:bg-surface-700 flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium text-white transition-all"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="text-surface-300 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:text-white"
              >
                로그인
              </button>

              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="bg-brand-500 hover:bg-brand-600 hover:shadow-brand-500/25 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
              >
                시작하기
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
