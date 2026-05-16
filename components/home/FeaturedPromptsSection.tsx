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
          /* 🔥 Masonry layout */
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
            {prompts.map((prompt, index) => {
              const lastMedia =
                prompt.result_media && prompt.result_media.length > 0
                  ? prompt.result_media[prompt.result_media.length - 1]
                  : null

              return (
                <Reveal
                  key={prompt.id}
                  variant="up"
                  delay={index * 60}
                  duration={500}
                  className="mb-5 break-inside-avoid"
                >
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="group relative block w-full overflow-hidden rounded-4xl border border-white/10 bg-white/3 backdrop-blur-xl transition-all duration-300 hover:bg-white/5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                  >
                    {/* 이미지 영역 */}
                    <div className="relative w-full overflow-hidden">
                      {/* 인증 뱃지 */}
                      {prompt.is_verified && (
                        <div className="bg-surface-800/60 absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur">
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
                          <div className="relative max-h-[320px] w-full overflow-hidden">
                            <video
                              src={lastMedia}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative max-h-[320px] w-full overflow-hidden">
                            <Image
                              src={lastMedia}
                              alt={prompt.title}
                              width={500}
                              height={300}
                              className="w-full object-cover"
                            />
                          </div>
                        )
                      ) : (
                        <div className="bg-surface-800 flex h-[200px] items-center justify-center">
                          <Sparkles className="text-surface-600 h-8 w-8" />
                        </div>
                      )}

                      {/* 하단 그라데이션 (가독성용) */}
                      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* 텍스트 */}
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-white">
                        {prompt.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-surface-300 text-xs">
                          by {prompt.author.nickname}
                        </span>
                        <span
                          className={`text-xs font-bold ${
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
