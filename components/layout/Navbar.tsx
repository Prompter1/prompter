'use client'

import { Sparkles, LogOut, UserCircle, Shield, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { navigationUtils, ROUTES } from '@/src/lib/navigation'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { cn } from '@/src/lib/utils'

const NAV_LINKS = [
  { label: 'Explore', href: '#' },
  { label: 'Rankings', href: '#' },
  { label: 'Community', href: '#' },
]

export function Navbar() {
  const { user, isLoading, signOut } = useAuth()
  const { isAdmin } = useIsAdmin()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* 로고 영역 - 현대적인 폰트와 그라데이션 */}
        <Link 
          href={ROUTES.HOME} 
          className="group flex items-center gap-2.5 transition-transform active:scale-95"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            Prompter<span className="text-zinc-500">™</span>
          </span>
        </Link>

        {/* 네비게이션 링크 - 간결하고 세련된 스타일 */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all",
                pathname === href 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 액션 버튼 영역 - 고대비 스타일 */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-900" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex h-8 items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 text-[10px] font-black uppercase tracking-wider text-amber-400 transition-all hover:bg-amber-500/20"
                >
                  <Shield className="h-3 w-3" />
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => navigationUtils.moveToMyPage(router)}
                className="text-[10px] font-black uppercase tracking-wider text-zinc-400 transition-all hover:text-white"
              >
                My Page
              </button>

              <button
                onClick={signOut}
                className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="text-[10px] font-black uppercase tracking-wider text-zinc-400 transition-all hover:text-white"
              >
                Sign in
              </button>
              <button
                onClick={() => navigationUtils.moveToLogin(router)}
                className="flex h-9 items-center rounded-full bg-white px-5 text-[10px] font-black uppercase tracking-wider text-black transition-all hover:bg-zinc-200 active:scale-95"
              >
                Start creating
              </button>
            </div>
          )}
          
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400 md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
