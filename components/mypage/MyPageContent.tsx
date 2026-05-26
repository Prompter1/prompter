'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, BarChart2, ShoppingBag, Sparkles } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/src/lib/supabase'
import { ProfileCard } from '@/components/mypage/ProfileCard'
import { MyPromptsTab } from '@/components/mypage/tabs/MyPromptsTab'
import { StatsTab } from '@/components/mypage/StatsTab'
import { PurchasesTab } from '@/components/mypage/tabs/PurchasesTab'
import type { PromptPost } from '@/types'

type TabType = 'myPrompts' | 'stats' | 'purchases'

interface MemberData {
  nickname: string
  points: number
  is_sponsor: boolean
  total_revenue: number
}

export interface PurchaseTransaction {
  id: number
  prompt_post_id: number
  amount: number
  fee: number
  seller_revenue: number
  created_at: string
  prompt_post: { title: string } | null
}

// 구매자 목록 타입
export interface BuyerRecord {
  id: number
  amount: number
  created_at: string
  buyer: {
    id: string
    nickname: string
    avatar_url: string | null
  } | null
  prompt: {
    id: number
    title: string
    price: number
  } | null
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
  const [purchases, setPurchases] = useState<PurchaseTransaction[]>([])
  const [buyers, setBuyers] = useState<BuyerRecord[]>([])

  // 탭별 로딩/완료 상태 분리 — 불필요한 중복 요청 방지
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set())
  const [loadingTab, setLoadingTab] = useState<TabType | null>(null)

  // ── 초기 로드: 프로필 + 내 프롬프트만 ──────────────────────────────────
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
      return
    }
    if (!user) return
    if (loadedTabs.has('myPrompts')) return

    let cancelled = false

    const fetchInitial = async () => {
      setLoadingTab('myPrompts')
      try {
        const [{ data: member }, { data: prompts }] = await Promise.all([
          supabase
            .from('members')
            .select('nickname, points, is_sponsor, total_revenue')
            .eq('id', user.id)
            .single(),
          supabase
            .from('prompt_posts')
            .select(
              `id, title, content, price, ai_types, ai_versions, categories,
               view_count, sales_count, is_verified, result_media,
               author:members!author_id(id, nickname, avatar_url, points, is_sponsor)`
            )
            .eq('author_id', user.id)
            .order('created_at', { ascending: false }),
        ])

        if (cancelled) return
        if (member) setMemberData(member)
        setMyPrompts((prompts as unknown as PromptPost[]) ?? [])
        setLoadedTabs((prev) => new Set(prev).add('myPrompts'))
      } finally {
        if (!cancelled) setLoadingTab(null)
      }
    }

    fetchInitial()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading])

  // ── 구매 내역: 탭 첫 진입 시 1회만 로드 ────────────────────────────────
  const fetchPurchases = useCallback(async () => {
    if (!user || loadedTabs.has('purchases')) return
    setLoadingTab('purchases')
    try {
      const { data: txs } = await supabase
        .from('transactions')
        .select('id, prompt_post_id, amount, fee, seller_revenue, created_at, prompt_post:prompt_posts!prompt_post_id(title)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

      setPurchases((txs as PurchaseTransaction[]) ?? [])
      setLoadedTabs((prev) => new Set(prev).add('purchases'))
    } finally {
      setLoadingTab(null)
    }
  }, [user, loadedTabs])

  // ── 구매자 목록: stats 탭 첫 진입 시 1회만 로드 ─────────────────────────
  const fetchBuyers = useCallback(async () => {
    if (!user || loadedTabs.has('stats')) return
    setLoadingTab('stats')
    try {
      const { data: txs } = await supabase
        .from('transactions')
        .select(
          `id, amount, created_at,
           buyer:members!buyer_id(id, nickname, avatar_url),
           prompt:prompt_posts!prompt_post_id(id, title, price)`
        )
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      setBuyers((txs as unknown as BuyerRecord[]) ?? [])
      setLoadedTabs((prev) => new Set(prev).add('stats'))
    } finally {
      setLoadingTab(null)
    }
  }, [user, loadedTabs])

  const handleNicknameChange = async (nickname: string) => {
    if (!user) return
    const { error } = await supabase
      .from('members')
      .update({ nickname })
      .eq('id', user.id)
    if (error) throw new Error(error.message)
    setMemberData((prev) => (prev ? { ...prev, nickname } : prev))
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'purchases') fetchPurchases()
    if (tab === 'stats') fetchBuyers()
  }

  // ── 로딩 스피너 ─────────────────────────────────────────────────────────
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
      <ProfileCard
        fullName={fullName}
        email={email}
        provider={provider}
        createdAt={createdAt}
        avatarUrl={avatarUrl}
        points={memberData?.points ?? 0}
        isSponsor={memberData?.is_sponsor ?? false}
        onSignOut={signOut}
        onNicknameChange={handleNicknameChange}
      />

      {/* 탭 네비게이션 */}
      <div className="border-surface-700/50 mb-8 flex space-x-1 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={[
              'flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'border-brand-400 text-brand-400'
                : 'text-surface-400 hover:text-surface-200 border-transparent',
            ].join(' ')}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <main className="min-h-64">
        {activeTab === 'myPrompts' && (
          <MyPromptsTab
            prompts={myPrompts}
            isLoading={loadingTab === 'myPrompts'}
          />
        )}
        {activeTab === 'stats' && (
          <StatsTab
            prompts={myPrompts}
            isLoading={loadingTab === 'stats'}
            totalRevenue={memberData?.total_revenue ?? 0}
            buyers={buyers}
          />
        )}
        {activeTab === 'purchases' && (
          <PurchasesTab
            purchases={purchases}
            isLoading={loadingTab === 'purchases'}
          />
        )}
      </main>
    </div>
  )
}
