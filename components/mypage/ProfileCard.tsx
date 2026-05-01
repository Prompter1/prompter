'use client'

import Image from 'next/image'
import {
  Mail,
  Shield,
  Calendar,
  LogOut,
  User,
  Coins,
  Crown,
} from 'lucide-react'

interface ProfileCardProps {
  fullName: string
  email: string
  provider: string
  createdAt: string
  avatarUrl?: string
  points: number
  isSponsor: boolean
  onSignOut: () => void
}

export function ProfileCard({
  fullName,
  email,
  provider,
  createdAt,
  avatarUrl,
  points,
  isSponsor,
  onSignOut,
}: Readonly<ProfileCardProps>) {
  return (
    <header className="border-surface-700/50 bg-surface-800/80 mb-10 rounded-3xl border p-8 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        {/* 아바타 + 기본 정보 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          <div className="ring-brand-500/30 rounded-full ring-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={96}
                height={96}
                className="border-surface-700 h-24 w-24 rounded-full border-2 object-cover"
                priority
              />
            ) : (
              <div className="from-brand-400 to-brand-600 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              {isSponsor && (
                <span className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase">
                  <Crown className="h-3 w-3" />
                  Sponsor
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </span>
              <span className="text-surface-400 flex items-center gap-1.5 text-sm capitalize">
                <Shield className="h-3.5 w-3.5" />
                {provider}
              </span>
              <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* 크레딧 + 로그아웃 */}
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-end">
          <div className="border-surface-700/50 bg-surface-900/50 w-full rounded-2xl border p-6 text-center md:w-60 md:text-right">
            <div className="text-surface-400 flex items-center justify-center gap-2 md:justify-end">
              <Coins className="h-4 w-4" />
              <p className="text-sm font-medium">보유 크레딧</p>
            </div>
            <p className="text-brand-400 mt-2 text-3xl font-bold">
              {points.toLocaleString()}
              <span className="text-surface-500 ml-1 text-xl">P</span>
            </p>
          </div>

          <button
            onClick={onSignOut}
            className="group border-surface-600 bg-surface-700/50 text-surface-300 flex items-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-medium transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
