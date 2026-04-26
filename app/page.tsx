import { ArrowRight, Bot, Zap, Image as ImageIcon } from 'lucide-react'

// 샘플 카테고리 데이터 (나중에 DB에서 가져올 것입니다)
const categories = [
  {
    name: 'Midjourney',
    icon: ImageIcon,
    prompts: 1205,
    color: '--color-brand-500',
  },
  {
    name: 'Stable Diffusion',
    icon: ImageIcon,
    prompts: 840,
    color: '--color-blue-500',
  },
  { name: 'LLM Agents', icon: Bot, prompts: 2150, color: '--color-green-500' },
  {
    name: 'Video Prompts',
    icon: Zap,
    prompts: 560,
    color: '--color-yellow-500',
  },
]

export default function Home() {
  return (
    <main className="bg-surface-50 text-surface-900 dark:bg-surface-900 dark:text-surface-50 min-h-screen">
      {/* 1. Hero Section (강력한 시각적 인트로) */}
      <section className="bg-surface-900 relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-20">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[64rem] w-full [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-600"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M130 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl">
            PROMPTER
            <br />
            <span className="text-brand-400">AI 프롬프트 거래 사이트 111</span>
          </h1>
          <p className="text-surface-300 mx-auto mt-6 max-w-2xl text-lg">
            검증되고 인증된 최고의 프롬프트를 둘러보거나 당신만의 프롬프트를 전
            세계에 판매하세요. AI 창작의 효율과 신뢰를 높입니다.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="bg-brand-500 hover:bg-brand-600 focus-visible:outline-brand-600 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              프롬프트 탐색하기
            </a>
            <a href="#" className="group text-sm font-semibold text-white">
              내 프롬프트 판매{' '}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Categories Section (깔끔한 탐색) */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-surface-900 text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
            다양한 생성형 AI 프롬프트
          </h2>
          <p className="text-surface-600 dark:text-surface-300 mt-6 text-lg">
            Midjourney부터 최신 비디오 생성 모델까지, 필요한 모든 프롬프트를
            한눈에 탐색하세요.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-surface-100 dark:bg-surface-800 relative overflow-hidden rounded-3xl p-8 shadow-inner transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <category.icon
                  className={`text-brand-500 h-10 w-10`}
                  style={{ color: `var(${category.color})` }}
                />
                <ArrowRight className="text-surface-400 dark:text-surface-600 h-6 w-6" />
              </div>
              <h3 className="text-surface-900 mt-6 text-xl font-semibold dark:text-white">
                {category.name}
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mt-2 text-sm">
                {category.prompts.toLocaleString()}개 이상의 프롬프트
              </p>
              <a href="#" className="absolute inset-0">
                <span className="sr-only">{category.name} 탐색</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Prompts / Feature Section (실제 콘텐츠 showcase) */}
      <section className="bg-surface-100 dark:bg-surface-800/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between gap-x-6">
            <h2 className="text-surface-900 text-3xl font-bold tracking-tight dark:text-white">
              최고의 인기를 누리는 프롬프트
            </h2>
            <a
              href="#"
              className="text-brand-500 hover:text-brand-600 text-sm font-semibold"
            >
              더 많은 프롬프트 보기 →
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="group dark:bg-surface-800 rounded-3xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
              >
                <div className="bg-surface-100 dark:bg-surface-700 aspect-[16/9] w-full overflow-hidden rounded-2xl">
                  {/* 프롬프트 결과 이미지/영상을 여기에 표시합니다 */}
                </div>
                <div className="mt-6">
                  <h3 className="text-surface-900 text-lg font-semibold dark:text-white">
                    {`최고의 생성물 프롬프트 ${i}`}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mt-2 line-clamp-2 text-sm">
                    Midjourney에서 가장 아름다운 풍경을 생성하는 비밀 프롬프트를
                    공개합니다...
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                      <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                        Verified
                      </span>
                      <p className="text-surface-400 text-xs">Author</p>
                    </div>
                    <p className="text-surface-900 text-lg font-bold dark:text-white">
                      Free
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer Section (간단한 정보 및 링크) */}
      <footer className="bg-surface-900 mt-12 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-surface-400">
            © 2026 Prompter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
