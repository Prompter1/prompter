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
import PromptCard from '@/components/prompt/PromptCard' // 프롬프트 카드 컴포넌트 임포트

type TabType = 'myPrompts' | 'stats' | 'purchases'

interface PromptPost {
  id: number
  title: string
  content: string
  price: number
  ai_types: string[]
  categories: string[]
  author: {
    id: string
    nickname: string
    avatar_url: string
    points: number
    is_sponsor: boolean
  }
}

export function MyPageContent() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabType>('myPrompts')
  const [memberData, setMemberData] = useState<{
    nickname: string
    points: number
    is_sponsor: boolean
  } | null>(null)

  // 추가: 내가 올린 프롬프트 상태
  const [myPrompts, setMyPrompts] = useState<PromptPost[]>([])

  const [isFetchingPrompts, setIsFetchingPrompts] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
      return
    }

    const fetchData = async () => {
      if (user) {
        // 1. 사용자 정보 가져오기
        const { data: member } = await supabase
          .from('members')
          .select('nickname, points, is_sponsor')
          .eq('id', user.id)
          .single()

        if (member) setMemberData(member)

        // 2. 내가 올린 프롬프트 가져오기 (작성자 정보 포함)
        setIsFetchingPrompts(true)
        const { data: prompts } = await supabase
          .from('prompt_posts')
          .select(
            `
            *,
            author:members(nickname, avatar_url, points, is_sponsor)
          `
          )
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })

        if (prompts) setMyPrompts(prompts)
        setIsFetchingPrompts(false)
      }
    }

    fetchData()
  }, [user, isLoading, router])

  if (isLoading) return <LoadingState /> // 로딩 컴포넌트 분리 권장
  if (!user) return null

  // 사용자 정보 파싱 로직 (기존 유지)
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
      {/* 1. 상단 프로필 영역 (기존 코드 유지) */}
      <header className="border-surface-700/50 bg-surface-800/80 mb-12 rounded-3xl border p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
            <div className="ring-brand-500/30 rounded-full ring-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl || '/images/default-avatar.png'}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="border-surface-700 h-24 w-24 rounded-full border-2 object-cover"
                  priority
                />
              ) : (
                <div className="from-brand-400 to-brand-600 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                {memberData?.is_sponsor && (
                  <span className="bg-brand-500/10 text-brand-400 border-brand-500/20 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase">
                    Sponsor
                  </span>
                )}
              </div>
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
          {/* 포인트 & 로그아웃 영역 (기존 유지) */}
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
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />{' '}
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 2. 탭 네비게이션 (기존 유지) */}
      <div className="border-surface-700/50 mb-8 flex space-x-2 overflow-x-auto border-b pb-px">
        {[
          { id: 'myPrompts', label: '내가 올린 프롬프트', icon: FileText },
          { id: 'stats', label: '사용 통계 및 수익', icon: BarChart },
          { id: 'purchases', label: '구매 및 사용 내역', icon: ShoppingBag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-brand-400 text-brand-400'
                : 'text-surface-400 hover:text-surface-200 border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. 데이터 연동된 컨텐츠 영역 */}
      <main className="min-h-100">
        {activeTab === 'myPrompts' && (
          <>
            {isFetchingPrompts ? (
              <div className="flex h-64 items-center justify-center">
                <Sparkles className="text-surface-600 h-8 w-8 animate-spin" />
              </div>
            ) : myPrompts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {myPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="border-surface-700 bg-surface-800/30 text-surface-400 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
                <FileText className="text-surface-600 mb-4 h-8 w-8" />
                <p>아직 등록한 프롬프트가 없습니다.</p>
                <button className="bg-brand-500 hover:bg-brand-600 mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white">
                  새 프롬프트 등록하기
                </button>
              </div>
            )}
          </>
        )}
        {}
      </main>
    </div>
  )
}

function LoadingState() {
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
