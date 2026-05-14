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

const rotatingWords = ['구매', '판매', '탐색', '발견', '공유']

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
    <section className="hero-wrap relative isolate overflow-hidden border-b border-white/10 bg-[#05060a] px-6 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-vignette" />
        <div className="hero-noise" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-sweep" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-center">
        <div>
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-surface-200 text-sm font-medium">
              AI 도구·버전·콘텐츠별 프롬프트 마켓
            </span>
            <ArrowRight className="h-4 w-4 text-white/50" />
          </div>

          <h1 className="hero-title animate-fade-in-up max-w-3xl text-4xl font-black tracking-[-0.07em] text-balance text-white [word-spacing:1rem] sm:text-6xl lg:text-[4.7rem] lg:leading-[0.9]">
            <span className="block">검증된 프롬프트를</span>

            <span className="mt-1 block">
              <span className="hero-word-slot relative inline-block align-baseline">
                <span className="invisible">{rotatingWords[0]}</span>
                {rotatingWords.map((word, index) => (
                  <span
                    key={word}
                    className="hero-word"
                    style={{ animationDelay: `${index * 1.44}s` }}
                  >
                    {word}
                  </span>
                ))}
              </span>

              <span className="inline-block bg-gradient-to-r from-white via-white to-white/65 bg-clip-text text-transparent">
                하세요
              </span>
            </span>
          </h1>

          <p className="animate-fade-in-up stagger-2 mt-8 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl">
            검증된 크리에이터들의 프롬프트를 탐색하고, 당신만의 프롬프트로
            수익을 창출하세요.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/prompt"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_14px_60px_rgba(255,255,255,0.08)] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
            >
              <Play className="h-5 w-5" />
              <span className="relative z-10">프롬프트 탐색하기</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="/upload"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/18 hover:bg-white/8"
            >
              내 프롬프트 판매하기
            </a>
          </div>

          <div className="animate-fade-in-up stagger-4 mt-9 flex flex-wrap gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors duration-200 hover:bg-white/8"
              >
                <feature.icon className="text-brand-400 h-4 w-4" />
                <span className="text-sm text-white/68">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium animate-fade-in-up stagger-5 relative rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="card-glow card-glow-1" />
            <div className="card-glow card-glow-2" />
          </div>

          <div className="relative flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.26em] text-white/35 uppercase">
                Live Market
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                AI별 프롬프트 순위
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-300">
              Ready
            </span>
          </div>

          <div className="relative grid grid-cols-3 gap-3 py-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/8 bg-black/20 p-3"
              >
                <stat.icon className={`mb-2 h-4 w-4 ${stat.color}`} />
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] text-white/42">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="relative space-y-3">
            {workflowRows.map((row, index) => (
              <a
                key={row.label}
                href={`/prompt?ai=${encodeURIComponent(
                  row.label.split(' ')[0]
                )}`}
                className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 p-3 transition-all duration-300 hover:border-white/14 hover:bg-white/8"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/7 text-sm font-bold text-white/85 transition-transform duration-300 group-hover:scale-105">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/95">
                    {row.label}
                  </p>
                  <p className="text-xs text-white/42">{row.value}</p>
                </div>

                <span className="text-xs font-semibold text-emerald-300">
                  {row.delta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-title {
          text-shadow: 0 0 28px rgba(255, 255, 255, 0.06);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05), transparent 34%),
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.09), transparent 26%),
            radial-gradient(circle at 80% 25%, rgba(34, 197, 94, 0.08), transparent 24%),
            linear-gradient(to bottom, rgba(5, 6, 10, 0.22), rgba(5, 6, 10, 0.92));
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 140px 140px;
          mask-image: radial-gradient(circle at center, black 35%, transparent 100%);
          animation: noiseDrift 12s linear infinite;
        }

        .hero-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.6;
          transform: translate3d(0, 0, 0);
          will-change: transform, opacity;
        }

        .hero-orb-1 {
          width: 560px;
          height: 560px;
          left: -140px;
          top: -120px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.28) 0%, rgba(34, 197, 94, 0.12) 28%, transparent 72%);
          animation: driftA 8s ease-in-out infinite;
        }

        .hero-orb-2 {
          width: 480px;
          height: 480px;
          right: 6%;
          top: 8%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.1) 26%, transparent 74%);
          animation: driftB 9s ease-in-out infinite;
          animation-delay: -2s;
        }

        .hero-orb-3 {
          width: 440px;
          height: 440px;
          left: 38%;
          bottom: -180px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0.08) 30%, transparent 72%);
          animation: driftC 10s ease-in-out infinite;
          animation-delay: -4s;
        }

        .hero-sweep {
          position: absolute;
          inset: -30% -20%;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.05) 44%,
            rgba(255, 255, 255, 0.02) 50%,
            transparent 62%
          );
          transform: translateX(-22%);
          animation: sweep 7s ease-in-out infinite;
          mix-blend-mode: screen;
          opacity: 0.75;
        }

        .hero-word-slot {
          height: 1em;
        }

        .hero-word {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.84),
            rgba(255, 255, 255, 0.58)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wordCycle 7.2s infinite;
          will-change: opacity, transform, filter;
        }

        .card-premium {
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 30px 90px rgba(0, 0, 0, 0.45);
        }

        .card-glow {
          position: absolute;
          border-radius: 9999px;
          filter: blur(28px);
          opacity: 0.4;
        }

        .card-glow-1 {
          width: 180px;
          height: 180px;
          left: -30px;
          top: -30px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.22), transparent 70%);
          animation: glowFloat 5s ease-in-out infinite;
        }

        .card-glow-2 {
          width: 220px;
          height: 220px;
          right: -60px;
          bottom: -70px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 72%);
          animation: glowFloat 6s ease-in-out infinite;
          animation-delay: -1.5s;
        }

        @keyframes driftA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(24px, 18px, 0) scale(1.08);
          }
        }

        @keyframes driftB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-22px, 20px, 0) scale(1.06);
          }
        }

        @keyframes driftC {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(18px, -16px, 0) scale(1.07);
          }
        }

        @keyframes sweep {
          0%,
          100% {
            transform: translateX(-18%);
            opacity: 0.35;
          }
          50% {
            transform: translateX(10%);
            opacity: 0.75;
          }
        }

        @keyframes wordCycle {
          0%,
          100% {
            opacity: 0;
            transform: translateY(14px) scale(0.99);
            filter: blur(10px);
          }
          8%,
          22% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          30% {
            opacity: 0;
            transform: translateY(-10px) scale(0.99);
            filter: blur(8px);
          }
        }

        @keyframes noiseDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-2%, 1%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes glowFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -10px, 0) scale(1.06);
          }
        }
      `}</style>
    </section>
  )
}
