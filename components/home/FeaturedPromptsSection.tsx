import Link from 'next/link'
import Image from 'next/image'
import { Shield, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { fetchFeaturedPrompts } from '@/src/lib/home-queries'

export async function FeaturedPromptsSection() {
  const prompts = await fetchFeaturedPrompts()

  return (
    <section className="border-surface-700/50 bg-surface-800/30 border-y py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          title="인기 프롬프트"
          subtitle="커뮤니티에서 가장 사랑받는 프롬프트들"
          linkLabel="더 많은 프롬프트 보기"
          linkHref="/prompt?sort=popular"
        />

        {prompts.length === 0 ? (
          <div className="border-surface-700/50 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
            <Sparkles className="text-surface-600 mb-3 h-10 w-10" />
            <p className="text-surface-400 text-sm">
              등록된 프롬프트가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prompts.map((prompt) => {
              const firstMedia = prompt.result_media?.[0] ?? null
              return (
                <Link
                  key={prompt.id}
                  href={`/prompt/${prompt.id}`}
                  className="group border-surface-700/50 bg-surface-800/80 hover:border-brand-500/50 hover:shadow-brand-500/5 relative block overflow-hidden rounded-2xl border backdrop-blur transition-all hover:shadow-lg"
                >
                  {/* 썸네일 */}
                  <div className="from-surface-700 to-surface-800 relative aspect-16/10 w-full bg-linear-to-br">
                    {firstMedia ? (
                      /\.(mp4|webm)$/i.test(firstMedia) ? (
                        <video
                          src={firstMedia}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={firstMedia}
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

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      {prompt.ai_types?.[0] && (
                        <Badge>{prompt.ai_types[0]}</Badge>
                      )}
                      {prompt.is_verified && (
                        <Badge variant="verified">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            인증됨
                          </span>
                        </Badge>
                      )}
                    </div>

                    <h3 className="group-hover:text-brand-400 line-clamp-2 font-semibold text-white transition-colors">
                      {prompt.title}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-surface-500 text-xs">
                        by {prompt.author.nickname}
                      </span>
                      <span
                        className={`text-sm font-bold ${prompt.price === 0 ? 'text-emerald-400' : 'text-brand-400'}`}
                      >
                        {prompt.price === 0
                          ? '무료'
                          : `${prompt.price.toLocaleString()}P`}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
