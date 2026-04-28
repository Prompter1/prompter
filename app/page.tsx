import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FeaturedPromptsSection } from '@/components/home/FeaturedPromptsSection'
import { CtaSection } from '@/components/home/CtaSection'

export default function Home() {
  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedPromptsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
