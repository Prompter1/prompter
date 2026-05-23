import Link from 'next/link'
import Image from 'next/image'
import { Shield, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import { fetchFeaturedPrompts } from '@/src/lib/home-queries'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const AI_GRADIENTS: Record<string, string> = {
  Midjourney: 'from-violet-600 via-purple-600 to-indigo-700',
  'Stable Diffusion': 'from-pink-600 via-rose-500 to-orange-500',
  ChatGPT: 'from-emerald-500 via-teal-500 to-cyan-600',
  Claude: 'from-amber-500 via-orange-500 to-rose-500',
  'LLM Agents': 'from-cyan-500 via-blue-500 to-indigo-600',
  'Video Prompts': 'from-orange-500 via-amber-500 to-yellow-500',
  'DALL-E': 'from-blue-500 via-indigo-500 to-violet-600',
  Runway: 'from-fuchsia-500 via-pink-500 to-rose-500',
  Sora: 'from-sky-500 via-blue-600 to-indigo-700',
}

const AI_BORDER_HOVER: Record<string, string> = {
  Midjourney: 'hover:border-violet-500/60',
  'Stable Diffusion': 'hover:border-pink-500/60',
  ChatGPT: 'hover:border-emerald-500/60',
  Claude: 'hover:border-amber-500/60',
  'LLM Agents': 'hover:border-cyan-500/60',
  'Video Prompts': 'hover:border-orange-500/60',
  'DALL-E': 'hover:border-blue-500/60',
  Runway: 'hover:border-fuchsia-500/60',
  Sora: 'hover:border-sky-500/60',
}

function getGradient(aiTypes: string[]): string {
  for (const t of aiTypes) {
    if (AI_GRADIENTS[t]) return AI_GRADIENTS[t]
  }
  return 'from-brand-500 via-violet-500 to-indigo-600'
}

function getHoverBorder(aiTypes: string[]): string {
  for (const t of aiTypes) {
    if (AI_BORDER_HOVER[t]) return AI_BORDER_HOVER[t]
  }
  return 'hover:border-brand-500/50'
}

export async function FeaturedPromptsSection() {
  const supabase = await createSupabaseServerClient()

  // 현재 로그인 유저 + 성인인증 여부
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdultVerified = false
  const isLoggedIn = !!user

  if (user) {
    const { data: member } = await supabase
      .from('members')
      .select('adult_verified')
      .eq('id', user.id)
      .maybeSingle()
    isAdultVerified = Boolean(member?.adult_verified)
  }

  const prompts = await fetchFeaturedPrompts()

  return (
    <section className="relative border-y border-white/10 py-12 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal variant="up" distance={18} duration={650}>
          <SectionHeader
            title="인기 프롬프트"
            subtitle="커뮤니티에서 가장 사랑받는 프롬프트들"
            linkLabel="더 많은 프롬프트 보기"
            linkHref="/prompt?sort=popular"
          />
        </Reveal>

        {prompts.length === 0 ? (
          <Reveal variant="blur" delay={120} distance={18} duration={650}>
            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-white/10 bg-white/3 py-20 backdrop-blur-xl">
              <Sparkles className="text-surface-500 mb-3 h-10 w-10" />
              <p className="text-surface-300 text-sm">
                등록된 프롬프트가 없습니다.
              </p>
            </div>
          </Reveal>
        ) : (() => {
          const NUM_COLS = 4
          // 행 우선 분배: rank1→열0, rank2→열1, rank3→열2, rank4→열3, rank5→열0 ...
          const cols = Array.from({ length: NUM_COLS }, (_, ci) =>
            prompts.filter((_, i) => i % NUM_COLS === ci)
          )

          return (
            <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-row lg:items-start lg:gap-5">
              {cols.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-3 lg:flex-1 lg:gap-5">
                  {col.map((prompt, inColIdx) => {
                    const index = ci + inColIdx * NUM_COLS
                    const isAdult = Boolean((prompt as any).is_adult)
                    const shouldBlur = isAdult && !isAdultVerified
                    const lastMedia =
                      prompt.result_media && prompt.result_media.length > 0
                        ? prompt.result_media.at(-1)
                        : null

                    const hoverBorder = getHoverBorder(prompt.ai_types ?? [])
                    const gradient = getGradient(prompt.ai_types ?? [])

                    return (
                      <Reveal
                        key={prompt.id}
                        variant="up"
                        delay={index * 60}
                        duration={500}
                      >
                        <Link
                          href={`/prompt/${prompt.id}`}
                          className={`group relative block w-full overflow-hidden rounded-4xl border border-white/10 bg-white/3 backdrop-blur-xl transition-all duration-300 hover:bg-white/5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${hoverBorder}`}
                        >
                          <div className="relative w-full overflow-hidden">
                            {prompt.is_verified && (
                              <div className="absolute top-3 left-3 z-10">
                                <Badge variant="verified">
                                  <Shield className="h-3 w-3" />
                                  검증됨
                                </Badge>
                              </div>
                            )}

                            {lastMedia ? (
                              /\.(mp4|webm)$/i.test(lastMedia) ? (
                                <div className="relative max-h-48 w-full overflow-hidden lg:max-h-80">
                                  <video
                                    src={lastMedia}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full object-cover"
                                    style={
                                      shouldBlur
                                        ? { filter: 'blur(24px)', transform: 'scale(1.12)' }
                                        : undefined
                                    }
                                  />
                                  {shouldBlur && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
                                      <span className="text-2xl">🔞</span>
                                      <span className="text-xs font-bold text-white">19+ 인증 필요</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="relative max-h-48 w-full overflow-hidden lg:max-h-80">
                                  <Image
                                    src={lastMedia}
                                    alt={prompt.title}
                                    width={500}
                                    height={300}
                                    className="w-full object-cover"
                                    style={
                                      shouldBlur
                                        ? { filter: 'blur(24px)', transform: 'scale(1.12)' }
                                        : undefined
                                    }
                                  />
                                  {shouldBlur && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
                                      <span className="text-2xl">🔞</span>
                                      <span className="text-xs font-bold text-white">19+ 인증 필요</span>
                                    </div>
                                  )}
                                </div>
                              )
                            ) : (
                              <div className={`relative flex h-36 items-center justify-center bg-linear-to-br lg:h-50 ${gradient} opacity-90`}>
                                <div className="flex flex-col items-center gap-2">
                                  <Sparkles className="h-8 w-8 text-white/60" strokeWidth={1.5} />
                                  {prompt.ai_types?.[0] && (
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                                      {prompt.ai_types[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-linear-to-t from-black/60 to-transparent" />
                          </div>

                          <div className="p-3 lg:p-4">
                            {prompt.ai_types?.[0] && (
                              <span className="bg-surface-700/50 text-surface-300 mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
                                {prompt.ai_types[0]}
                              </span>
                            )}
                            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
                              {prompt.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-surface-300 text-xs">
                                by {prompt.author.nickname}
                              </span>
                              <span
                                className={`text-xs font-bold ${
                                  prompt.price === 0 ? 'text-emerald-400' : 'text-brand-400'
                                }`}
                              >
                                {prompt.price === 0
                                  ? '무료'
                                  : `${prompt.price.toLocaleString()}P`}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </section>
  )
}
