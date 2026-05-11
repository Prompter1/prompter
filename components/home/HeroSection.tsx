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

const workflowRows = [
  { label: 'Midjourney v6.1', value: '아트워크', delta: '+18%' },
  { label: 'Runway Gen-4', value: '영상', delta: '+12%' },
  { label: 'ChatGPT GPT-4.1', value: '기획', delta: '+9%' },
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
    <section className="relative overflow-hidden border-b border-white/10 px-6 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center">
        <div>
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-surface-200 text-sm font-medium">
              AI 도구·버전·콘텐츠별 프롬프트 마켓
            </span>
            <ArrowRight className="text-surface-400 h-4 w-4" />
          </div>

          <h1 className="animate-fade-in-up max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-7xl">
            <span className="text-foreground">검증된 프롬프트를</span>
            <br />
            <span className="text-gradient-subtle">찾고, 사고, 판매하세요</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 text-muted-foreground mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl">
            검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로
            수익을 창출하세요.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/prompt"
              className="group bg-foreground text-background relative flex items-center justify-center gap-3 overflow-hidden rounded-xl px-7 py-4 text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="h-5 w-5" />
              <span className="relative z-10">프롬프트 탐색하기</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="/upload"
              className="group border-border/60 bg-surface-800/50 text-foreground hover:border-border hover:bg-surface-700/70 flex items-center justify-center gap-2 rounded-xl border px-7 py-4 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
            >
              내 프롬프트 판매하기
            </a>
          </div>

          <div className="animate-fade-in-up stagger-4 mt-9 flex flex-wrap gap-3">
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
        </div>

        <div className="card-premium animate-fade-in-up stagger-5 rounded-2xl p-5">
          <div className="border-border/40 flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-surface-500 text-xs font-semibold uppercase">
                Live Market
              </p>
              <h2 className="mt-1 text-lg font-bold">AI별 프롬프트 순위</h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-900/60 rounded-xl p-3"
              >
                <stat.icon className={`mb-2 h-4 w-4 ${stat.color}`} />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-surface-500 mt-1 text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {workflowRows.map((row, index) => (
              <a
                key={row.label}
                href={`/prompt?ai=${encodeURIComponent(row.label.split(' ')[0])}`}
                className="border-surface-700/70 bg-surface-900/50 hover:border-surface-500 flex items-center gap-3 rounded-xl border p-3 transition-colors"
              >
                <span className="bg-surface-700/60 text-surface-300 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{row.label}</p>
                  <p className="text-surface-500 text-xs">{row.value}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-300">
                  {row.delta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
