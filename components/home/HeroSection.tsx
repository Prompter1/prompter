import {
  ArrowRight,
  Play,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react'

const stats = [
  {
    label: '등록된 프롬프트',
    value: '12,000+',
    icon: Sparkles,
    color: 'text-brand-400',
  },
  {
    label: '활성 사용자',
    value: '5,000+',
    icon: Users,
    color: 'text-emerald-400',
  },
  {
    label: '거래 완료',
    value: '8,500+',
    icon: TrendingUp,
    color: 'text-amber-400',
  },
]

const features = [
  { icon: Shield, title: '검증된 품질' },
  { icon: Zap, title: '즉시 사용' },
  { icon: TrendingUp, title: '수익 창출' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-brand-500/20 absolute -top-40 left-1/2 h-150 w-225 -translate-x-1/2 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-100 w-125 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-100 w-125 rounded-full bg-pink-500/10 blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_70%)] bg-size-[72px_72px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="border-brand-500/30 bg-brand-500/10 mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="bg-brand-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-brand-500 relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-brand-400 text-sm font-medium">
            v2.0 업데이트: AI 에이전트 마켓 오픈
          </span>
          <ArrowRight className="text-brand-400 h-4 w-4" />
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl">
          AI 프롬프트의
          <br />
          <span className="text-gradient">새로운 기준</span>
        </h1>

        <p className="text-surface-400 mx-auto mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
          검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로 수익을
          창출하세요.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/explore"
            className="group bg-brand-500 shadow-brand-500/25 hover:bg-brand-600 hover:shadow-brand-500/30 flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
          >
            <Play className="h-5 w-5" />
            프롬프트 탐색하기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/sell"
            className="group border-surface-700 bg-surface-800/50 hover:border-surface-600 hover:bg-surface-800 flex items-center gap-2 rounded-2xl border px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all"
          >
            내 프롬프트 판매하기
          </a>
        </div>

        {/* Features Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-surface-700/50 bg-surface-800/30 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
            >
              <feature.icon className="text-brand-400 h-4 w-4" />
              <span className="text-surface-300 text-sm">{feature.title}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="border-surface-700/50 bg-surface-800/30 grid grid-cols-3 gap-8 rounded-3xl border p-8 backdrop-blur">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </span>
                <span className="text-surface-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
