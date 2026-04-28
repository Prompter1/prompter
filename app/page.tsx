import {
  ArrowRight,
  Bot,
  Zap,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Midjourney',
    icon: ImageIcon,
    prompts: 1205,
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Stable Diffusion',
    icon: ImageIcon,
    prompts: 840,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'LLM Agents',
    icon: Bot,
    prompts: 2150,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Video Prompts',
    icon: Zap,
    prompts: 560,
    gradient: 'from-amber-500 to-orange-600',
  },
]

const stats = [
  { label: '등록된 프롬프트', value: '12,000+', icon: Sparkles },
  { label: '활성 사용자', value: '5,000+', icon: Users },
  { label: '거래 완료', value: '8,500+', icon: TrendingUp },
]

const featuredPrompts = [
  {
    id: 1,
    title: '시네마틱 영화 포스터 생성',
    category: 'Midjourney',
    price: 0,
    verified: true,
  },
  {
    id: 2,
    title: '코드 리뷰 자동화 에이전트',
    category: 'LLM Agents',
    price: 5000,
    verified: true,
  },
  {
    id: 3,
    title: '아이소메트릭 게임 에셋',
    category: 'Stable Diffusion',
    price: 3000,
    verified: false,
  },
  {
    id: 4,
    title: '유튜브 썸네일 최적화',
    category: 'Midjourney',
    price: 0,
    verified: true,
  },
  {
    id: 5,
    title: 'SEO 콘텐츠 작성 봇',
    category: 'LLM Agents',
    price: 8000,
    verified: true,
  },
  {
    id: 6,
    title: '제품 목업 생성기',
    category: 'Stable Diffusion',
    price: 4500,
    verified: false,
  },
  {
    id: 7,
    title: '인스타그램 릴스 스크립트',
    category: 'Video Prompts',
    price: 2000,
    verified: true,
  },
  {
    id: 8,
    title: '3D 캐릭터 컨셉아트',
    category: 'Midjourney',
    price: 6000,
    verified: true,
  },
]

export default function Home() {
  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      {/* Navigation */}
      <nav className="border-surface-700/50 bg-surface-900/80 fixed top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="from-brand-400 to-brand-600 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PROMPTER</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className="text-surface-300 text-sm transition-colors hover:text-white"
            >
              탐색
            </a>
            <a
              href="#"
              className="text-surface-300 text-sm transition-colors hover:text-white"
            >
              랭킹
            </a>
            <a
              href="#"
              className="text-surface-300 text-sm transition-colors hover:text-white"
            >
              커뮤니티
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-surface-300 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:text-white"
            >
              로그인
            </Link>
            <Link
              href="/login"
              className="bg-brand-500 hover:bg-brand-600 hover:shadow-brand-500/25 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-brand-500/20 absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="border-brand-500/30 bg-brand-500/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="bg-brand-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-brand-500 relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-brand-400 text-sm font-medium">
              새로운 프롬프트가 매일 업데이트됩니다
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">
            AI 프롬프트의
            <br />
            <span className="text-gradient">새로운 기준</span>
          </h1>

          <p className="text-surface-400 mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
            검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로
            수익을 창출하세요. AI 창작의 효율과 신뢰를 높이는
            마켓플레이스입니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="group bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 hover:shadow-brand-500/30 flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
            >
              프롬프트 탐색하기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="group border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800 flex items-center gap-2 rounded-2xl border px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all"
            >
              내 프롬프트 판매하기
            </a>
          </div>

          {/* Stats */}
          <div className="border-surface-700/50 mt-16 grid grid-cols-3 gap-8 border-t pt-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon className="text-brand-400 h-5 w-5" />
                <span className="text-3xl font-bold text-white">
                  {stat.value}
                </span>
                <span className="text-surface-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              카테고리별 탐색
            </h2>
            <p className="text-surface-400 mt-3">
              다양한 AI 도구에 최적화된 프롬프트를 찾아보세요
            </p>
          </div>
          <a
            href="#"
            className="text-brand-400 hover:text-brand-300 hidden items-center gap-1 text-sm font-medium transition-colors sm:flex"
          >
            전체 카테고리 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="group border-surface-700/50 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800 relative overflow-hidden rounded-2xl border p-6 backdrop-blur transition-all"
            >
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${category.gradient} p-3`}
              >
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {category.name}
              </h3>
              <p className="text-surface-400 mt-1 text-sm">
                {category.prompts.toLocaleString()}개의 프롬프트
              </p>
              <ArrowRight className="text-surface-600 group-hover:text-surface-400 absolute right-6 bottom-6 h-5 w-5 transition-all group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </section>

      {/* Featured Prompts Section */}
      <section className="border-surface-700/50 bg-surface-800/30 border-y py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                인기 프롬프트
              </h2>
              <p className="text-surface-400 mt-3">
                커뮤니티에서 가장 사랑받는 프롬프트들
              </p>
            </div>
            <a
              href="#"
              className="text-brand-400 hover:text-brand-300 hidden items-center gap-1 text-sm font-medium transition-colors sm:flex"
            >
              더 많은 프롬프트 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPrompts.map((prompt) => (
              <article
                key={prompt.id}
                className="group border-surface-700/50 bg-surface-800/80 hover:border-brand-500/50 hover:shadow-brand-500/5 relative overflow-hidden rounded-2xl border backdrop-blur transition-all hover:shadow-lg"
              >
                {/* Thumbnail placeholder */}
                <div className="from-surface-700 to-surface-800 aspect-[16/10] w-full bg-gradient-to-br">
                  <div className="flex h-full items-center justify-center">
                    <Sparkles className="text-surface-600 h-8 w-8" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="bg-surface-700 text-surface-300 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {prompt.category}
                    </span>
                    {prompt.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <Shield className="h-3 w-3" />
                        인증됨
                      </span>
                    )}
                  </div>

                  <h3 className="group-hover:text-brand-400 line-clamp-2 font-semibold text-white transition-colors">
                    {prompt.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-surface-500 text-xs">by Creator</span>
                    <span
                      className={`text-sm font-bold ${prompt.price === 0 ? 'text-emerald-400' : 'text-white'}`}
                    >
                      {prompt.price === 0
                        ? '무료'
                        : `${prompt.price.toLocaleString()}원`}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="text-surface-400 mx-auto mt-4 max-w-xl">
            무료로 가입하고 다양한 AI 프롬프트를 탐색하거나, 당신만의 프롬프트로
            수익을 창출해 보세요.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-surface-700/50 border-t py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="from-brand-400 to-brand-600 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">PROMPTER</span>
            </div>
            <p className="text-surface-500 text-sm">
              © 2026 Prompter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
