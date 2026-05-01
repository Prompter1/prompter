import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MyPageContent } from '@/components/mypage/MyPageContent'

export default function MyPage() {
  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <Navbar />
      <MyPageContent />
      <Footer />
    </main>
  )
}
