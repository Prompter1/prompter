'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, User, Calendar, Shield, LogOut, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'

export function MyPageContent() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="from-brand-400 to-brand-600 flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-linear-to-br">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-surface-400 text-sm">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const fullName = (user.user_metadata?.full_name as string) || '사용자'
  const email = user.email ?? ''
  const provider = (user.app_metadata?.provider as string) || 'google'
  const createdAt = new Date(user.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const infoItems = [
    { icon: Mail, label: '이메일', value: email },
    { icon: Shield, label: '로그인 방식', value: provider },
    { icon: Calendar, label: '가입일', value: createdAt },
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-32">
      {/* 프로필 카드 */}
      <div className="border-surface-700/50 bg-surface-800/80 rounded-3xl border p-8 backdrop-blur-xl">
        {/* 아바타 + 이름 */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="ring-brand-500/30 rounded-full ring-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={80}
                height={80}
                className="border-surface-700 h-20 w-20 rounded-full border-2 object-cover"
              />
            ) : (
              <div className="from-brand-400 to-brand-600 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{fullName}</h1>
            <p className="text-surface-400 mt-1 text-sm">{email}</p>
          </div>
        </div>

        <div className="bg-surface-700/50 mb-6 h-px" />

        {/* 정보 목록 */}
        <div className="space-y-4">
          {infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="bg-surface-700/50 flex h-9 w-9 items-center justify-center rounded-xl">
                <Icon className="text-brand-400 h-4 w-4" />
              </div>
              <div>
                <p className="text-surface-500 text-xs">{label}</p>
                <p className="text-sm font-medium text-white capitalize">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-700/50 my-6 h-px" />

        {/* 로그아웃 버튼 */}
        <button
          onClick={signOut}
          className="group border-surface-600 bg-surface-700/50 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-white transition-all hover:border-red-500/50 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          로그아웃
        </button>
      </div>
    </div>
  )
}
