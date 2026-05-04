import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { fetchVerificationReviewBundle } from '@/src/lib/admin-queries'
import { VerificationReviewActions } from '@/components/admin/VerificationReviewActions'

type Props = Readonly<{
  params: Promise<{ requestId: string }>
}>

// UUID v4 형식 검증
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isVideoPath(path: string): boolean {
  return /\.(mp4|webm)$/i.test(path)
}

export default async function AdminReviewPage({ params }: Props) {
  const { requestId } = await params

  // ✅ parseInt 없이 UUID 그대로 사용 — 형식만 검증
  if (!UUID_REGEX.test(requestId)) notFound()

  const bundle = await fetchVerificationReviewBundle(requestId)
  if (!bundle) notFound()

  const { request, prompt, submitter, evidenceSignedUrls } = bundle
  const canResolve = request.status === 'PENDING'

  return (
    <div>
      <Link
        href="/admin"
        className="text-surface-400 hover:text-surface-200 mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        대기 목록으로
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              검수 #{request.id}
            </h1>
            <span
              className={
                request.status === 'PENDING'
                  ? 'rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400'
                  : request.status === 'APPROVED'
                    ? 'rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400'
                    : 'rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400'
              }
            >
              {request.status}
            </span>
          </div>
          <p className="text-surface-500 text-sm">
            게시물 #{request.prompt_post_id}
            {submitter && (
              <>
                {' · '}
                {submitter.nickname ?? '이름 없음'}
                {submitter.email ? ` (${submitter.email})` : ''}
              </>
            )}
          </p>
        </div>
        <VerificationReviewActions
          requestId={request.id}
          canResolve={canResolve}
        />
      </div>

      {prompt ? (
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <section className="border-surface-700/50 bg-surface-800/20 flex flex-col rounded-2xl border">
            <div className="border-surface-700/50 border-b px-4 py-3">
              <h2 className="text-surface-100 text-sm font-semibold">
                증빙 스크린샷 · 영상
              </h2>
              <p className="text-surface-500 mt-0.5 text-xs">
                비공개 스토리지 서명 URL (1시간 유효)
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {evidenceSignedUrls.length === 0 ? (
                <p className="text-surface-500 text-sm">
                  첨부된 증빙이 없습니다.
                </p>
              ) : (
                evidenceSignedUrls.map(({ path, url }) => (
                  <div
                    key={path}
                    className="border-surface-700/50 overflow-hidden rounded-xl border bg-black/40"
                  >
                    <p className="text-surface-500 truncate px-2 py-1 font-mono text-[10px]">
                      {path}
                    </p>
                    {url ? (
                      isVideoPath(path) ? (
                        <video
                          src={url}
                          controls
                          playsInline
                          className="max-h-[min(70vh,520px)] w-full object-contain"
                        />
                      ) : (
                        <img
                          src={url}
                          alt="증빙"
                          className="max-h-[min(70vh,520px)] w-full object-contain"
                        />
                      )
                    ) : (
                      <p className="text-surface-500 p-4 text-xs">
                        서명 URL 생성 실패 (경로·Storage 정책 확인)
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="border-surface-700/50 bg-surface-800/20 flex flex-col rounded-2xl border">
            <div className="border-surface-700/50 border-b px-4 py-3">
              <h2 className="text-surface-100 text-sm font-semibold">
                프롬프트 본문 (대조)
              </h2>
              <p className="text-surface-500 mt-0.5 text-xs">{prompt.title}</p>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {(prompt.ai_types ?? []).map((t) => (
                  <span
                    key={t}
                    className="bg-surface-700/50 text-surface-300 rounded-full px-2.5 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
                <span
                  className={
                    prompt.is_verified
                      ? 'rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-400'
                      : 'bg-surface-700/50 text-surface-400 rounded-full px-2.5 py-0.5 text-xs'
                  }
                >
                  {prompt.is_verified ? 'Verified' : '미인증'}
                </span>
                <span className="text-brand-400 text-xs font-semibold">
                  {prompt.price === 0
                    ? '무료'
                    : `${prompt.price.toLocaleString()}원`}
                </span>
              </div>
              <pre className="text-surface-200 max-h-[min(75vh,640px)] flex-1 overflow-auto rounded-xl bg-black/25 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {prompt.content}
              </pre>
            </div>
          </section>
        </div>
      ) : (
        <p className="text-surface-400 text-sm">
          연결된 게시물을 찾을 수 없습니다.
        </p>
      )}
    </div>
  )
}
