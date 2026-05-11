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
    <nav className="border-border/40 bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="from-brand-400 via-brand-500 to-brand-600 shadow-brand-500/20 group-hover:shadow-brand-500/40 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
          <span className="text-foreground text-xl font-bold tracking-tight">
            PROMPTER
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-muted-foreground hover:text-foreground relative px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              <span className="relative z-10">{label}</span>
              <span className="bg-surface-700/0 hover:bg-surface-700/50 absolute inset-0 rounded-lg transition-colors duration-200" />
            </a>
          ))}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="bg-surface-700/50 h-9 w-24 animate-pulse rounded-xl" />
          ) : user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">관리자</span>
                </Link>
              )}
              <button
                onClick={() => navigationUtils.moveToMyPage(router)}
                className="text-muted-foreground hover:bg-surface-700/50 hover:text-foreground flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">마이페이지</span>
              </button>

              <button
                onClick={signOut}
                className="border-border/60 bg-surface-800/50 text-foreground hover:border-border hover:bg-surface-700/70 flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="text-muted-foreground hover:bg-surface-700/50 hover:text-foreground rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
              >
                로그인
              </button>

              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="from-brand-500 to-brand-600 shadow-brand-500/25 hover:shadow-brand-500/40 relative overflow-hidden rounded-xl bg-gradient-to-r px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">시작하기</span>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
