'use client'

import AuthNavbar from '@/components/layout/AuthNavbar'
import Footer from '@/components/layout/Footer'
import { MyPageContent } from '@/components/mypage/MyPageContent'

// Mock user - 실제로는 서버/클라이언트에서 인증 상태를 확인
const mockUser = {
  nickname: 'PromptMaster',
  avatar_url: '/placeholder-user.jpg',
}

export default function MyPage() {
  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <AuthNavbar user={mockUser} />
      <MyPageContent />
      <Footer />
    </main>
  )
}
