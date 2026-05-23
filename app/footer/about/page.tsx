import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Target,
  Heart,
} from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: '검증된 품질',
    desc: '모든 유료 프롬프트는 관리자 심사를 거칩니다. 검증됨(Verified) 뱃지는 실제 AI 결과물이 확인된 프롬프트에만 부여됩니다.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: '공정한 수익 분배',
    desc: '프롬프트 크리에이터가 직접 가격을 설정하고 투명한 수수료 정책 아래 수익을 가져갑니다. 개인·사업자 모두를 위한 정산 시스템을 갖췄습니다.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    icon: Zap,
    title: '즉시 활용 가능',
    desc: '구매 즉시 복사해서 ChatGPT, Claude, Midjourney 등 원하는 AI 서비스에 바로 붙여넣을 수 있습니다. 별도 설치나 설정이 필요 없습니다.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Users,
    title: '다양한 AI 지원',
    desc: 'ChatGPT, Claude, Midjourney, Stable Diffusion, Runway 등 주요 AI 도구를 모두 커버합니다. AI별·버전별로 최적화된 프롬프트를 탐색할 수 있습니다.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
]

const timeline = [
  {
    year: '2025',
    title: 'Prompter 시작',
    desc: '국내 첫 AI 프롬프트 전문 마켓플레이스를 구상하고 개발을 시작했습니다.',
  },
  {
    year: '2026.01',
    title: '베타 오픈',
    desc: '유료 프롬프트 거래·정산 시스템, 판매자 인증 프로세스를 갖추고 베타 서비스를 시작했습니다.',
  },
  {
    year: '2026.05',
    title: '정식 서비스',
    desc: '성인 인증, 사업자 정산(세금계산서·프로모션), 랭킹 시스템을 추가하며 정식 서비스로 전환했습니다.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      {/* ── 히어로 ── */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-brand-500/8 absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-80 w-80 translate-x-1/2 rounded-full bg-violet-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="border-brand-500/20 bg-brand-500/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Sparkles className="text-brand-400 h-4 w-4" />
            <span className="text-brand-400 text-sm font-medium">
              About Prompter
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl">
            AI 프롬프트의 가치를
            <br />
            <span className="from-brand-400 bg-gradient-to-r via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              제대로 거래하다
            </span>
          </h1>
          <p className="text-surface-300 mx-auto mt-6 max-w-2xl text-lg leading-8">
            Prompter는 AI 프롬프트 크리에이터와 사용자를 잇는 국내 최초의 전문
            마켓플레이스입니다. 좋은 프롬프트 하나가 업무 생산성과 창작의 질을
            완전히 바꿀 수 있다고 믿습니다.
          </p>
        </div>
      </section>

      {/* ── 왜 만들었나 ── */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex items-center gap-2">
            <Target className="text-brand-400 h-5 w-5" />
            <span className="text-brand-400 text-sm font-semibold tracking-wider uppercase">
              Why We Built This
            </span>
          </div>
          <h2 className="mb-8 text-2xl font-bold text-white lg:text-3xl">
            왜 Prompter를 만들었나요?
          </h2>
          <div className="text-surface-300 space-y-5 text-base leading-8 lg:text-lg">
            <p>
              AI 도구가 급속히 대중화되면서 "어떻게 쓰느냐"가 곧 경쟁력이 되는
              시대가 왔습니다. 하지만 잘 만들어진 프롬프트는 커뮤니티 곳곳에
              분산되어 있고, 품질 검증도 어렵고, 만든 사람이 정당한 보상을 받을
              방법도 없었습니다.
            </p>
            <p>
              수개월간 프롬프트를 연구하고 다듬어온 크리에이터들의 노하우가
              <strong className="text-white">
                {' '}
                단순한 무료 공유로 소비되는 것
              </strong>
              이 아깝다고 느꼈습니다. 동시에 AI를 처음 접하는 사용자들은 "어디서
              좋은 프롬프트를 구하나"를 여전히 모르고 있었고요.
            </p>
            <p>
              그래서 Prompter를 만들었습니다.{' '}
              <strong className="text-white">
                크리에이터는 자신의 프롬프트로 수익을 창출
              </strong>
              하고, 사용자는{' '}
              <strong className="text-white">
                검증된 프롬프트를 바로 활용
              </strong>
              할 수 있는 공간. AI 생태계의 새로운 직업군인 "프롬프트 엔지니어"가
              지속 가능하게 활동할 수 있는 플랫폼을 목표로 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 핵심 가치 ── */}
      <section className="border-y border-white/10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 flex items-center gap-2">
            <Heart className="text-brand-400 h-5 w-5" />
            <span className="text-brand-400 text-sm font-semibold tracking-wider uppercase">
              Core Values
            </span>
          </div>
          <h2 className="mb-12 text-2xl font-bold text-white lg:text-3xl">
            Prompter가 지키는 것들
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="border-surface-700/50 bg-surface-800/30 rounded-3xl border p-6"
              >
                <div className={`mb-4 inline-flex rounded-xl p-2.5 ${v.bg}`}>
                  <v.icon className={`h-5 w-5 ${v.color}`} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {v.title}
                </h3>
                <p className="text-surface-400 text-sm leading-7">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/10 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
            함께 만들어 가요
          </h2>
          <p className="text-surface-400 mb-10 leading-7">
            Prompter는 크리에이터와 사용자가 함께 성장하는 플랫폼입니다. 지금
            바로 참여해 AI 활용의 새로운 가능성을 열어보세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/prompt"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              프롬프트 탐색하기
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/8"
            >
              내 프롬프트 판매하기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
