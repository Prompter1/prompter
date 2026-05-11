'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Bell, Menu, X, Shield } from 'lucide-react'
import { useState } from 'react'
import { useIsAdmin } from '@/hooks/useIsAdmin'

interface User {
  nickname: string
  avatar_url: string
}

interface AuthNavbarProps {
  user: User
}

const navLinks = [
  { href: '/explore', label: '탐색' },
  { href: '/ranking', label: '랭킹' },
  { href: '/community', label: '커뮤니티' },
]

export default function AuthNavbar({ user }: Readonly<AuthNavbarProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAdmin } = useIsAdmin()

  return (
    <nav className="border-border/40 bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="from-brand-400 via-brand-500 to-brand-600 shadow-brand-500/25 group-hover:shadow-brand-500/40 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
          <span className="text-foreground text-xl font-bold tracking-tight">
            PROMPTER
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground relative px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="bg-surface-700/0 hover:bg-surface-700/50 absolute inset-0 rounded-lg transition-colors duration-200" />
            </Link>
          ))}
        </div>

        {/* Desktop right section */}
        <div className="hidden items-center gap-2 md:flex">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              관리자
            </Link>
          )}

          {/* Notification button */}
          <button className="text-muted-foreground hover:bg-surface-700/50 hover:text-foreground relative rounded-xl p-2.5 transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="bg-brand-500 ring-background absolute top-2 right-2 h-2 w-2 rounded-full ring-2" />
          </button>

          {/* Avatar */}
          <Link
            href="/mypage"
            className="ring-brand-500/50 hover:ring-brand-400 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 transition-all duration-300 hover:scale-105"
          >
            <Image
              src={user.avatar_url}
              alt={user.nickname}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="text-muted-foreground hover:bg-surface-700/50 hover:text-foreground rounded-xl p-2 transition-colors duration-200 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-border/40 bg-background/95 border-t px-6 py-6 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-brand-400 hover:bg-brand-500/10 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                관리자
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:bg-surface-700/50 hover:text-foreground rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* User section */}
            <div className="border-border/40 mt-4 flex items-center gap-3 border-t pt-4">
              <Link
                href="/mypage"
                className="flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src={user.avatar_url}
                  alt={user.nickname}
                  width={36}
                  height={36}
                  className="ring-brand-500/50 rounded-full ring-2"
                />
                <span className="text-foreground text-sm font-medium">
                  {user.nickname}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
