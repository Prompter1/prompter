'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, BarChart2, ShoppingBag, Sparkles } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/src/lib/supabase'
import { ProfileCard } from '@/components/mypage/ProfileCard'
import { MyPromptsTab } from '@/components/mypage/tabs/MyPromptsTab'
import { StatsTab } from '@/components/mypage/tabs/StatsTab'
import { PurchasesTab } from '@/components/mypage/tabs/PurchasesTab'
import { PromptPost } from '@/types/index'
type TabType = 'myPrompts' | 'stats' | 'purchases'

interface MemberData {
  nickname: string
  points: number
  is_sponsor: boolean
}

const TABS = [
  { id: 'myPrompts' as TabType, label: '내가 올린 프롬프트', icon: FileText },
  { id: 'stats' as TabType, label: '사용 통계 및 수익', icon: BarChart2 },
  { id: 'purchases' as TabType, label: '구매 및 사용 내역', icon: ShoppingBag },
]

export function MyPageContent() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabType>('myPrompts')
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [myPrompts, setMyPrompts] = useState<PromptPost[]>([])
  const [isFetchingData, setIsFetchingData] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
      return
    }

    if (!user) return

    const fetchData = async () => {
      setIsFetchingData(true)
      try {
        // 병렬로 멤버 정보 + 프롬프트 동시 조회
        const [{ data: member }, { data: prompts }] = await Promise.all([
          supabase
            .from('members')
            .select('nickname, points, is_sponsor')
            .eq('id', user.id)
            .single(),
          supabase
            .from('prompt_posts')
            .select(
              `
              id, title, content, price, ai_types, categories,
              author:members!author_id(id, nickname, avatar_url, points, is_sponsor),is_verified, result_media
            `
            )
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),
        ])

        if (member) setMemberData(member)
        if (prompts) setMyPrompts(prompts as unknown as PromptPost[])
      } finally {
        setIsFetchingData(false)
      }
    }

    fetchData()
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
    <div className="mx-auto max-w-5xl px-4 py-28">
      {/* 프로필 카드 */}
      <ProfileCard
        fullName={fullName}
        email={email}
        provider={provider}
        createdAt={createdAt}
        avatarUrl={avatarUrl}
        points={memberData?.points ?? 0}
        isSponsor={memberData?.is_sponsor ?? false}
        onSignOut={signOut}
      />

      {/* 탭 네비게이션 */}
      <div className="border-surface-700/50 mb-8 flex space-x-1 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-brand-400 text-brand-400'
                : 'text-surface-400 hover:text-surface-200 border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <main className="min-h-64">
        {activeTab === 'myPrompts' && (
          <MyPromptsTab prompts={myPrompts} isLoading={isFetchingData} />
        )}
        {activeTab === 'stats' && (
          <StatsTab prompts={myPrompts} isLoading={isFetchingData} />
        )}
        {activeTab === 'purchases' && <PurchasesTab />}
      </main>
    </div>
  )
}
