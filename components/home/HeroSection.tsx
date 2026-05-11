'use client'

import { ArrowRight, Play, Sparkles, Zap, ShieldCheck, Trophy } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/src/lib/navigation'

const stats = [
  { label: 'Active prompts', value: '3,500+', icon: Sparkles },
  { label: 'Verified uptime', value: '99.7%', icon: ShieldCheck },
  { label: 'Execution latency', value: '<50ms', icon: Zap },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#050505] pt-32 pb-20 sm:pt-48 sm:pb-32">
      {/* 배경 그리드 및 라이트 효과 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      
      <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 bg-white/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* 상단 배지 */}
        <div className="mb-12 inline-flex items-center gap-3">
          <div className="h-px w-8 bg-zinc-800" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            The platform for modern creators
          </span>
          <div className="h-px w-8 bg-zinc-800" />
        </div>

        {/* 메인 타이틀 - 압도적인 크기와 폰트 웨이트 */}
        <h1 className="mx-auto max-w-5xl text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl lg:leading-[0.9]">
          The platform <br />
          <span className="relative">
            to build
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-white/10" />
          </span>
        </h1>

        <p className="mx-auto mt-12 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 sm:text-xl">
          Your toolkit to stop configuring and start innovating. <br className="hidden sm:block" />
          Securely build, deploy, and scale the best experiences.
        </p>

        {/* CTA 버튼 - 레퍼런스 스타일 */}
        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ROUTES.HOME}
            className="group flex h-14 items-center gap-3 rounded-full bg-white px-8 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200 active:scale-95"
          >
            Start free trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/demo"
            className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
          >
            Watch demo
          </Link>
        </div>

        {/* 통계 섹션 - 하단에 배치된 미니멀한 스타일 */}
        <div className="mt-32 grid grid-cols-1 gap-12 border-t border-white/5 pt-16 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
                {stat.value}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
