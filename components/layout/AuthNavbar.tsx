'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'

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

  return (
    <nav className="border-surface-700/50 bg-surface-900/80 fixed top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="from-brand-400 to-brand-600 shadow-brand-500/20 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PROMPTER</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-surface-300 text-sm transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-surface-400 hover:bg-surface-800 relative rounded-xl p-2 transition-colors hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="bg-brand-500 absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
          </button>
          <Link
            href="/mypage"
            className="border-brand-500 hover:border-brand-400 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 transition-all"
          >
            <Image
              src={user.avatar_url}
              alt={user.nickname}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="text-surface-300 h-6 w-6" />
          ) : (
            <Menu className="text-surface-300 h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-surface-700/50 bg-surface-900/95 border-t px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface-300 text-sm transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-surface-700/50 flex items-center gap-3 border-t pt-4">
              <Link
                href="/mypage"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src={user.avatar_url}
                  alt={user.nickname}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-white">{user.nickname}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
