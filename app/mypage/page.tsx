'use client'

import Footer from '@/components/layout/Footer'
import { MyPageContent } from '@/components/mypage/MyPageContent'
import AuthNavbar from '@/components/layout/AuthNavbar'
import { useAuth } from '@/providers/auth-provider'

export default function MyPage() {
  const { user } = useAuth()
  const defaultAvatar = '@/public/images/default-avatar.png'
  // AuthNavbar가 원하는 형태로 데이터를 가공합니다.
  const mappedUser = user
    ? {
        ...user, // 기존 Supabase User 정보 복사
        nickname: user.user_metadata?.full_name || '사용자',
        avatar_url: user.user_metadata?.avatar_url || defaultAvatar,
      }
    : null

  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      {/* 가공된 mappedUser를 전달합니다 */}
      {mappedUser ? <AuthNavbar user={mappedUser} /> : <button>로그인</button>}
      <MyPageContent />
      <Footer />
    </main>
  )
}
