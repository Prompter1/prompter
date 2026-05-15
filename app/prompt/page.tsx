import Link from 'next/link'
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PromptCard from '@/components/prompt/PromptCard'
import { fetchPromptExplore, type PromptSort } from '@/src/lib/prompt-queries'
import { cn } from '@/src/lib/utils'

type Props = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>

const SORT_OPTIONS: { value: PromptSort; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '판매순' },
  { value: 'views', label: '조회순' },
]

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function PromptIndexPage({ searchParams }: Props) {
  const params = await searchParams
  const q = firstParam(params.q) ?? ''
  const ai = firstParam(params.ai) ?? ''
  const version = firstParam(params.version) ?? ''
  const category = firstParam(params.category) ?? ''
  const sort = (firstParam(params.sort) as PromptSort | undefined) ?? 'latest'
  const verified = firstParam(params.verified) === 'true'

  // 서버에서 ai, version, verified 조건에 맞는 데이터와 '유효한 필터 목록'을 가져옵니다.
  const { prompts, aiRankings, categories, versions } =
    await fetchPromptExplore({
      q,
      ai,
      version,
      category,
      sort,
      verified,
    })

  const makeHref = (
    updates: Record<string, string | boolean | null | undefined>
  ) => {
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    if (ai) next.set('ai', ai)
    if (version) next.set('version', version)
    if (category) next.set('category', category)
    if (sort && sort !== 'latest') next.set('sort', sort)
    if (verified) next.set('verified', 'true')

    // 새로운 업데이트 적용
    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        value === undefined ||
        value === false ||
        value === ''
      ) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    }

    const query = next.toString()
    return query ? `/prompt?${query}` : '/prompt'
  }

  return (
    <>
      <Navbar />
      <main className="bg-surface-900 min-h-screen pt-24 pb-20 text-white">
        {/* 상단 검색 영역 */}
        <section className="border-surface-700/40 border-b px-1 py-10 sm:px-6 lg:py-14">
          <div className="mx-auto grid w-8/12 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
            <div>
              <div className="border-brand-500/25 bg-brand-500/10 text-brand-300 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                프롬프트 탐색
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                필요한 AI 워크플로우를 빠르게 찾기
              </h1>
              <p className="text-surface-300 mt-4 max-w-2xl text-sm leading-6 sm:text-base">
                원하는 AI 도구와 버전을 선택하면 최적화된 프롬프트를
                찾아드립니다.
              </p>
            </div>

            <form
              action="/prompt"
              className="border-surface-700/60 bg-surface-800/50 flex rounded-full border p-2"
            >
              <label className="flex min-w-0 flex-1 items-center gap-2 px-4">
                <Search className="text-surface-300 h-4 w-4 shrink-0" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="키워드, 프롬프트"
                  className="placeholder:text-surface-300 min-w-0 flex-1 bg-transparent pr-[15%] text-lg text-white outline-none"
                />
              </label>
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-400 rounded-xl px-4 py-2.5 text-lg font-semibold text-white transition-colors"
              >
                검색
              </button>
            </form>
          </div>
        </section>

        {/* 메인 콘텐츠 영역 */}
        <section className="mx-auto grid w-8/12 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* AI 종류 선택 (Sidebar) */}
            <div className="border-surface-700/60 bg-surface-800/40 rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="text-brand-400 h-4 w-4" />
                <h2 className="text-lg font-semibold">AI 종류</h2>
              </div>
              <div className="space-y-2">
                <Link
                  href={makeHref({ ai: null, version: null })} // AI 초기화 시 버전도 초기화
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2 text-lg transition-colors',
                    !ai
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700'
                  )}
                >
                  전체 AI
                </Link>
                {aiRankings.map((tool) => (
                  <Link
                    key={tool.name}
                    href={makeHref({ ai: tool.name, version: null })} // 💡 핵심: AI 종류가 바뀌면 기존 버전 필터는 해제함
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-2 text-lg transition-colors',
                      ai === tool.name
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700'
                    )}
                  >
                    <span className="truncate">{tool.name}</span>
                    <span className="text-xs opacity-60">{tool.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* 상단 칩 필터 영역 */}
            <div className="mb-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* 💡 인증 버튼: 보라색(Violet) 테마 적용 */}
                <Link
                  href={makeHref({ verified: verified ? null : true })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-lg font-semibold transition-colors',
                    verified
                      ? 'border-violet-400/40 bg-violet-500/15 text-violet-300'
                      : 'border-surface-700 bg-surface-800/50 text-surface-300 hover:border-violet-400/40'
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  인증됨
                </Link>

                {/* 카테고리 필터 */}
                {categories.map((item) => (
                  <Link
                    key={item.name}
                    href={makeHref({
                      category: category === item.name ? null : item.name,
                    })}
                    className={cn(
                      'rounded-full border px-4 py-2 text-lg font-medium transition-colors',
                      category === item.name
                        ? 'border-brand-400/50 bg-brand-500/15 text-brand-300'
                        : 'border-surface-700 bg-surface-800/50 text-surface-300 hover:border-surface-500'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* 💡 버전 필터: 선택된 AI가 있을 때만 혹은 해당 AI의 버전만 표시 */}
              {versions.length > 0 && (
                <div className="border-surface-700/40 flex flex-wrap items-center gap-2 border-t pt-4">
                  <span className="text-surface-500 mr-2 text-sm font-medium">
                    버전:
                  </span>
                  {versions.map((item) => (
                    <Link
                      key={item.name}
                      href={makeHref({
                        version: version === item.name ? null : item.name,
                      })}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-base font-medium transition-colors',
                        version === item.name
                          ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                          : 'border-surface-700 bg-surface-800/50 text-surface-300 hover:border-surface-500'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 결과 요약 및 리스트 */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-surface-300 text-lg">
                총{' '}
                <span className="font-semibold text-white">
                  {prompts.length}
                </span>
                개 결과
              </p>
              {(q || ai || version || category || verified) && (
                <Link
                  href="/prompt"
                  className="text-brand-400 hover:text-brand-300 text-sm font-medium underline underline-offset-4"
                >
                  필터 모두 초기화
                </Link>
              )}
            </div>

            {prompts.length === 0 ? (
              <div className="border-surface-700/70 bg-surface-800/30 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
                <Sparkles className="text-surface-600 mb-4 h-10 w-10" />
                <h2 className="text-lg font-semibold text-white">
                  검색 결과가 없습니다
                </h2>
                <p className="text-surface-400 mt-2 max-w-md text-lg leading-6">
                  키워드나 필터를 조금 넓혀보세요. 새로운 AI 도구나 카테고리가
                  필요하면 업로드 화면에서 직접 추가할 수 있습니다.
                </p>
                <Link
                  href="/upload"
                  className="bg-brand-500 hover:bg-brand-400 mt-6 rounded-xl px-5 py-2.5 text-lg font-semibold text-white transition-colors"
                >
                  프롬프트 등록하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
