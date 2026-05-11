import {
  ArrowRight,
  Play,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react'
import { fetchHeroStats } from '@/src/lib/home-queries'

const features = [
  { icon: Shield, title: '검증된 품질' },
  { icon: Zap, title: '즉시 사용' },
  { icon: TrendingUp, title: '수익 창출' },
]

function formatStat(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + '만+'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K+'
  return num.toLocaleString() + '+'
}

export default async function HeroSection() {
  const { promptCount, memberCount, transactionCount } = await fetchHeroStats()

  const stats = [
    {
      label: '등록된 프롬프트',
      value: formatStat(promptCount),
      icon: Sparkles,
      color: 'text-brand-400',
    },
    {
      label: '활성 사용자',
      value: formatStat(memberCount),
      icon: Users,
      color: 'text-emerald-400',
    },
    {
      label: '거래 완료',
      value: formatStat(transactionCount),
      icon: TrendingUp,
      color: 'text-amber-400',
    },
  ]

  return (
    <section className="relative overflow-hidden px-6 pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Background Effects - Enhanced */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow */}
        <div className="bg-brand-500/15 absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[150px]" />
        {/* Secondary accents */}
        <div className="absolute bottom-0 left-0 h-[400px] w-[500px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[500px] rounded-full bg-pink-500/8 blur-[120px]" />
        {/* Subtle top gradient */}
        <div className="via-brand-500/20 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Announcement badge */}
        <div className="animate-fade-in border-brand-500/30 bg-brand-500/10 mb-10 inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="bg-brand-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-brand-500 relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span className="text-brand-300 text-sm font-medium">
            v2.0 업데이트: AI 에이전트 마켓 오픈
          </span>
          <ArrowRight className="text-brand-400 h-4 w-4" />
        </div>

        {/* Main headline */}
        <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl">
          <span className="text-foreground">AI 프롬프트의</span>
          <br />
          <span className="text-gradient">새로운 기준</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up stagger-2 text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
          검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로 수익을
          창출하세요.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-in-up stagger-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/explore"
            className="group from-brand-500 to-brand-600 shadow-brand-500/25 hover:shadow-brand-500/35 relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
          >
            <Play className="h-5 w-5" />
            <span className="relative z-10">프롬프트 탐색하기</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
          </a>
          <a
            href="/sell"
            className="group border-border/60 bg-surface-800/50 text-foreground hover:border-border hover:bg-surface-700/70 flex items-center gap-2 rounded-2xl border px-8 py-4 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
          >
            내 프롬프트 판매하기
          </a>
        </div>

        {/* Feature pills */}
        <div className="animate-fade-in-up stagger-4 mt-12 flex flex-wrap justify-center gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-border/40 bg-surface-800/40 hover:border-border/60 hover:bg-surface-800/60 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-all duration-200"
            >
              <feature.icon className="text-brand-400 h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="animate-fade-in-up stagger-5 mx-auto mt-20 max-w-3xl">
          <div className="card-premium grid grid-cols-3 gap-6 rounded-3xl p-8 sm:gap-8 sm:p-10">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-3 ${idx !== stats.length - 1 ? 'border-border/30 border-r' : ''} pr-4 sm:pr-6`}
              >
                <div className="bg-surface-700/50 flex h-12 w-12 items-center justify-center rounded-xl">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-foreground text-3xl font-bold sm:text-4xl">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
