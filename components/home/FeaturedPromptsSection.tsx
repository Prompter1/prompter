import { Shield, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { FEATURED_PROMPTS } from '@/data/constants'

export function FeaturedPromptsSection() {
  return (
    <section className="border-surface-700/50 bg-surface-800/30 border-y py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          title="인기 프롬프트"
          subtitle="커뮤니티에서 가장 사랑받는 프롬프트들"
          linkLabel="더 많은 프롬프트 보기"
          linkHref="#"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PROMPTS.map((prompt) => (
            <article
              key={prompt.id}
              className="group border-surface-700/50 bg-surface-800/80 hover:border-brand-500/50 hover:shadow-brand-500/5 relative overflow-hidden rounded-2xl border backdrop-blur transition-all hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="from-surface-700 to-surface-800 aspect-[16/10] w-full bg-gradient-to-br">
                <div className="flex h-full items-center justify-center">
                  <Sparkles className="text-surface-600 h-8 w-8" />
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Badge>{prompt.category}</Badge>
                  {prompt.verified && (
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
                  <span className="text-surface-500 text-xs">by Creator</span>
                  <span
                    className={`text-sm font-bold ${prompt.price === 0 ? 'text-emerald-400' : 'text-white'}`}
                  >
                    {prompt.price === 0 ? '무료' : `${prompt.price.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
