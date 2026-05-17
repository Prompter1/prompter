import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategoriesSection'
import { FeaturedPromptsSection } from '@/components/home/FeaturedPromptsSection'
import TrendingSection from '@/components/home/TrendingSection'
import CtaSection from '@/components/home/CtaSection'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

// 섹션 스켈레톤 (Suspense fallback)
function SectionSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse rounded-2xl bg-white/3`} />
  )
}

export default function Home() {
  return (
    <main className="bg-surface-800 text-surface-50 min-h-screen">
      <Navbar />
      {/* HeroSection — 즉시 렌더 (최상단, LCP 대상) */}
      <ErrorBoundary section="Hero">
        <HeroSection />
      </ErrorBoundary>

      {/* 이하 섹션은 Suspense + ErrorBoundary 조합으로 독립 렌더 */}
      <ErrorBoundary section="카테고리">
        <CategorySection />
      </ErrorBoundary>

      <ErrorBoundary section="인기 프롬프트">
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <FeaturedPromptsSection />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary section="트렌딩">
        <Suspense fallback={<SectionSkeleton height="h-72" />}>
          <TrendingSection />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary section="CTA">
        <CtaSection />
      </ErrorBoundary>
      <Footer />
    </main>
  )
}
