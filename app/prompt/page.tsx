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
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
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

  const supabase = await createSupabaseServerClient()

  // 현재 로그인 유저 + 성인인증 여부 조회
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdultVerified = false
  let isLoggedIn = false

  if (user) {
    isLoggedIn = true
    const { data: member } = await supabase
      .from('members')
      .select('adult_verified')
      .eq('id', user.id)
      .maybeSingle()
    isAdultVerified = Boolean(member?.adult_verified)
  }

  const [exploreData] = await Promise.all([
    fetchPromptExplore({ q, ai, version, category, sort, verified }),
  ])

  const { prompts, aiRankings, categories } = exploreData

  // AI 선택 시 해당 AI의 버전만, 미선택 시 전체 버전 목록
  let filteredVersions: { name: string; count: number }[] = []
  if (ai) {
    const { data: versionRows } = await supabase
      .from('ai_version_catalog')
      .select('version_name')
      .eq('ai_name', ai)
      .order('created_at', { ascending: true })

    filteredVersions = (versionRows ?? []).map((r) => ({
      name: r.version_name,
      count: 0,
    }))
  } else {
    filteredVersions = exploreData.versions
  }

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
        <section className="border-surface-700/40 border-b px-4 py-10 sm:px-6 lg:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
            <div>
              <div className="border-brand-500/25 bg-brand-500/10 text-brand-300 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                프롬프트 탐색
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                필요한 AI 워크플로우를 빠르게 찾기
              </h1>
              <p className="text-surface-400 mt-4 max-w-2xl text-sm leading-6 sm:text-base">
                AI 도구, 버전, 콘텐츠 분야, 검증 여부를 조합해 검색하세요.
              </p>
            </div>

            <form
              action="/prompt"
              className="border-surface-700/60 bg-surface-800/50 flex rounded-2xl border p-2"
            >
              {ai && <input type="hidden" name="ai" value={ai} />}
              {version && (
                <input type="hidden" name="version" value={version} />
              )}
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              {sort !== 'latest' && (
                <input type="hidden" name="sort" value={sort} />
              )}
              {verified && <input type="hidden" name="verified" value="true" />}
              <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
                <Search className="text-surface-500 h-4 w-4 shrink-0" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="키워드, 프롬프트 내용 검색"
                  className="placeholder:text-surface-500 min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                />
              </label>
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                검색
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* 정렬 */}
            <div className="border-surface-700/60 bg-surface-800/40 rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal className="text-brand-400 h-4 w-4" />
                <h2 className="text-sm font-semibold">정렬</h2>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    href={makeHref({
                      sort: option.value === 'latest' ? null : option.value,
                    })}
                    className={cn(
                      'rounded-xl px-3 py-2 text-center text-xs font-semibold transition-colors lg:text-left',
                      sort === option.value
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700'
                    )}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* AI 순위 */}
            <div className="border-surface-700/60 bg-surface-800/40 rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="text-brand-400 h-4 w-4" />
                <h2 className="text-sm font-semibold">AI 필터</h2>
              </div>
              <div className="space-y-2">
                <Link
                  href={makeHref({ ai: null, version: null })}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                    !ai
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700'
                  )}
                >
                  전체 AI
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                {aiRankings.slice(0, 10).map((tool, index) => (
                  <Link
                    key={tool.name}
                    href={makeHref({ ai: tool.name, version: null })}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                      ai === tool.name
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700'
                    )}
                  >
                    <span className="text-surface-500 w-5 text-xs font-bold">
                      #{index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{tool.name}</span>
                    <span className="text-xs opacity-70">{tool.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* 카테고리 + 버전 필터 */}
            <div className="mb-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={makeHref({ verified: verified ? null : true })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    verified
                      ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-surface-700 bg-surface-800/50 text-surface-300 hover:border-emerald-400/40'
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  인증된 게시물만
                </Link>

                {categories.slice(0, 12).map((item) => (
                  <Link
                    key={item.name}
                    href={makeHref({
                      category: category === item.name ? null : item.name,
                    })}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      category === item.name
                        ? 'border-brand-400/50 bg-brand-500/15 text-brand-300'
                        : 'border-surface-700 bg-surface-800/50 text-surface-300 hover:border-surface-500'
                    )}
                  >
                    {item.name} {item.count}
                  </Link>
                ))}
              </div>

              {filteredVersions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {ai && (
                    <span className="text-surface-500 text-xs font-medium">
                      {ai} 버전:
                    </span>
                  )}
                  {filteredVersions.slice(0, 15).map((item) => (
                    <Link
                      key={item.name}
                      href={makeHref({
                        version: version === item.name ? null : item.name,
                      })}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
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

            <div className="mb-5 flex items-center justify-between">
              <p className="text-surface-400 text-sm">
                총{' '}
                <span className="font-semibold text-white">
                  {prompts.length}
                </span>
                개 결과
                {ai && (
                  <span className="text-brand-400 ml-2 text-xs">
                    · {ai}
                    {version ? ` ${version}` : ''}
                  </span>
                )}
              </p>
              {(q ||
                ai ||
                version ||
                category ||
                verified ||
                sort !== 'latest') && (
                <Link
                  href="/prompt"
                  className="text-surface-400 text-sm transition-colors hover:text-white"
                >
                  필터 초기화
                </Link>
              )}
            </div>

            {prompts.length === 0 ? (
              <div className="border-surface-700/70 bg-surface-800/30 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
                <Sparkles className="text-surface-600 mb-4 h-10 w-10" />
                <h2 className="text-lg font-semibold text-white">
                  검색 결과가 없습니다
                </h2>
                <p className="text-surface-400 mt-2 max-w-md text-sm leading-6">
                  키워드나 필터를 조금 넓혀보세요.
                </p>
                <Link
                  href="/upload"
                  className="bg-brand-500 hover:bg-brand-400 mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  프롬프트 등록하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isLoggedIn={isLoggedIn}
                    isAdultVerified={isAdultVerified}
                  />
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
