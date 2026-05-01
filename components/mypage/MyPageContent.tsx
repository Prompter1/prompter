'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail,
  User,
  Calendar,
  Shield,
  LogOut,
  Sparkles,
  Coins,
  FileText,
  BarChart,
  ShoppingBag,
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/src/lib/supabase'

type TabType = 'myPrompts' | 'stats' | 'purchases'

export function MyPageContent() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  // 탭 및 사용자 DB 데이터 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('myPrompts')
  const [memberData, setMemberData] = useState<{
    nickname: string
    points: number
  } | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
      return
    }

    const fetchMemberData = async () => {
      if (user) {
        // 따로 생성할 필요 없이 이미 export된 supabase 객체를 바로 사용합니다.
        const { data, error } = await supabase
          .from('members')
          .select('nickname, points')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setMemberData(data)
        }
      }
    }

    fetchMemberData()
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="from-brand-400 to-brand-600 flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-surface-400 text-sm">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // 사용자 정보 파싱
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const fullName =
    memberData?.nickname ||
    (user.user_metadata?.full_name as string) ||
    '사용자'
  const email = user.email ?? ''
  const provider = (user.app_metadata?.provider as string) || 'google'
  const createdAt = new Date(user.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      {/* 1. 상단: 프로필 및 보유 크레딧 카드 */}
      <div className="border-surface-700/50 bg-surface-800/80 mb-12 rounded-3xl border p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* 좌측: 프로필 정보 */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
            <div className="ring-brand-500/30 rounded-full ring-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="border-surface-700 h-24 w-24 rounded-full border-2 object-cover"
                />
              ) : (
                <div className="from-brand-400 to-brand-600 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                  <Mail className="h-4 w-4" /> {email}
                </span>
                <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                  <Shield className="h-4 w-4" /> {provider}
                </span>
                <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                  <Calendar className="h-4 w-4" /> {createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* 우측: 보유 크레딧 & 로그아웃 */}
          <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-end">
            <div className="border-surface-700/50 bg-surface-900/50 w-full rounded-2xl border p-6 text-center md:w-64 md:text-right">
              <div className="text-surface-400 flex items-center justify-center gap-2 md:justify-end">
                <Coins className="h-4 w-4" />
                <p className="text-sm font-medium">보유 크레딧</p>
              </div>
              <p className="text-brand-400 mt-2 text-3xl font-bold">
                {memberData?.points?.toLocaleString() || 0}{' '}
                <span className="text-surface-500 text-xl">P</span>
              </p>
            </div>

            <button
              onClick={signOut}
              className="group border-surface-600 bg-surface-700/50 text-surface-300 flex items-center justify-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-medium transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 2. 하단: 탭 네비게이션 */}
      <div className="border-surface-700/50 mb-8 flex space-x-2 overflow-x-auto border-b pb-px">
        {[
          { id: 'myPrompts', label: '내가 올린 프롬프트', icon: FileText },
          { id: 'stats', label: '사용 통계 및 수익', icon: BarChart },
          { id: 'purchases', label: '구매 및 사용 내역', icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-brand-400 text-brand-400'
                  : 'text-surface-400 hover:text-surface-200 border-transparent'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 3. 탭별 컨텐츠 렌더링 영역 */}
      <div className="min-h-[400px]">
        {activeTab === 'myPrompts' && (
          <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
            <FileText className="text-surface-600 mb-4 h-8 w-8" />
            <p>아직 등록한 프롬프트가 없습니다.</p>
            <button className="bg-brand-500 hover:bg-brand-600 mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white">
              새 프롬프트 등록하기
            </button>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
            <BarChart className="text-surface-600 mb-4 h-8 w-8" />
            <p>통계 데이터가 충분하지 않습니다.</p>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
            <ShoppingBag className="text-surface-600 mb-4 h-8 w-8" />
            <p>구매 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
