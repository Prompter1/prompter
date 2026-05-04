import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { fetchPendingVerifications } from '@/src/lib/admin-queries'

export default async function AdminDashboardPage() {
  const rows = await fetchPendingVerifications()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">검수 대기 목록</h1>
        <p className="text-surface-400 mt-1 text-sm">
          유료 판매 증빙이 제출되어 PENDING 상태인 요청입니다.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="border-surface-700/50 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
          <ClipboardList className="text-surface-600 mb-3 h-10 w-10" />
          <p className="text-surface-400 text-sm">
            대기 중인 검수 요청이 없습니다.
          </p>
        </div>
      ) : (
        <div className="border-surface-700/50 overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead>
                <tr className="border-surface-700/50 bg-surface-800/50 border-b">
                  <th className="text-surface-400 px-4 py-3 font-medium">ID</th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    게시물
                  </th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    가격
                  </th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    작성자 ID
                  </th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    증빙 수
                  </th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    신청일
                  </th>
                  <th className="text-surface-400 px-4 py-3 font-medium">
                    동작
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const post = r.prompt_posts
                  const evidenceCount = Array.isArray(r.evidence_paths)
                    ? r.evidence_paths.length
                    : 0
                  const created = r.created_at
                    ? new Date(r.created_at).toLocaleString('ko-KR')
                    : '—'

                  return (
                    <tr
                      key={r.id}
                      className="border-surface-700/40 hover:bg-surface-800/30 border-b transition-colors"
                    >
                      <td className="text-surface-300 px-4 py-3 font-mono text-xs">
                        #{r.id}
                      </td>
                      <td className="max-w-60 px-4 py-3">
                        <span className="line-clamp-2 text-white">
                          {post?.title ?? '(게시물 없음)'}
                        </span>
                        {post && (
                          <span className="text-surface-500 mt-0.5 block text-xs">
                            post #{post.id}
                          </span>
                        )}
                      </td>
                      <td className="text-surface-200 px-4 py-3 whitespace-nowrap">
                        {post == null
                          ? '—'
                          : post.price === 0
                            ? '무료'
                            : `${post.price.toLocaleString()}원`}
                      </td>
                      <td className="text-surface-500 px-4 py-3 font-mono text-xs">
                        {r.author_id.slice(0, 8)}…
                      </td>
                      <td className="text-surface-300 px-4 py-3">
                        {evidenceCount}
                      </td>
                      <td className="text-surface-400 px-4 py-3 text-xs whitespace-nowrap">
                        {created}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/review/${r.id}`}
                          className="bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 inline-flex rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        >
                          검토
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
