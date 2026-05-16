import Link from 'next/link'
import Image from 'next/image'
import { Shield, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'
import { fetchFeaturedPrompts } from '@/src/lib/home-queries'

export async function FeaturedPromptsSection() {
  const prompts = await fetchFeaturedPrompts()

  return (
    <section className="relative border-y border-white/10 py-24">
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
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {prompts.map((prompt, index) => {
              const lastMedia =
                prompt.result_media && prompt.result_media.length > 0
                  ? prompt.result_media[prompt.result_media.length - 1]
                  : null

              return (
                <Reveal
                  key={prompt.id}
                  variant={index % 2 === 0 ? 'scale' : 'up'}
                  delay={index * 80}
                  distance={20}
                  duration={650}
                  className="h-full"
                >
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-4xl border border-white/10 bg-white/3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                  >
                    {/* overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/3 via-transparent to-white/1" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
                    <div className="from-brand-500/0 to-brand-600/0 pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                    {/* 미디어 영역 */}
                    <div className="from-surface-800 to-surface-900 relative aspect-16/10 w-full bg-linear-to-br">
                      {/* 인증 뱃지 (overlay) */}
                      {prompt.is_verified && (
                        <div className="bg-surface-900/50 absolute top-0 left-3 z-10 mt-4 flex items-center rounded-full backdrop-blur-sm">
                          <Badge variant="verified">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              인증됨
                            </span>
                          </Badge>
                        </div>
                      )}

                      {lastMedia ? (
                        /\.(mp4|webm)$/i.test(lastMedia) ? (
                          <video
                            src={lastMedia}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={lastMedia}
                            alt={prompt.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles className="text-surface-600 h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* 텍스트 영역 */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* 제목 (항상 상단) */}
                      <h3 className="group-hover:text-brand-300 line-clamp-2 min-h-[3.5rem] font-semibold text-white transition-colors">
                        {prompt.title}
                      </h3>

                      {/* 작성자 / 가격 (항상 하단) */}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <span className="text-surface-300 text-xs">
                          by {prompt.author.nickname}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            prompt.price === 0
                              ? 'text-emerald-400'
                              : 'text-brand-400'
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
        )}
      </div>
    </section>
  )
}
