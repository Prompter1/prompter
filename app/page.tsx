import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategoriesSection'
import { FeaturedPromptsSection } from '@/components/home/FeaturedPromptsSection'
import TrendingSection from '@/components/home/TrendingSection'
import CtaSection from '@/components/home/CtaSection'

export default function Home() {
  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedPromptsSection />
      <TrendingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
