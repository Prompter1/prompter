import Link from 'next/link'
import { Flag, ExternalLink } from 'lucide-react'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'
import { ReportStatusActions } from '@/components/admin/ReportStatusActions'

type ReportRow = {
  id: number
  content: string
  status: string
  created_at: string
  reporter: { id: string; nickname: string } | null
  post: { id: number; title: string } | null
}

async function fetchReports(): Promise<ReportRow[]> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('reports')
    .select(
      `id, content, status, created_at,
       reporter:members!reporter_id(id, nickname),
       post:prompt_posts!post_id(id, title)`
    )
    .order('created_at', { ascending: false })
  return (data as unknown as ReportRow[]) ?? []
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  reviewed: '검토완료',
  dismissed: '기각',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  reviewed: 'bg-emerald-500/15 text-emerald-400',
  dismissed: 'bg-surface-700 text-surface-400',
}

export default async function AdminReportsPage() {
  const rows = await fetchReports()

  const pending = rows.filter((r) => r.status === 'pending')
  const rest = rows.filter((r) => r.status !== 'pending')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">신고 관리</h2>
        <p className="text-surface-400 mt-1 text-sm">
          사용자가 접수한 게시물 신고 목록입니다.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="border-surface-700/50 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
          <Flag className="text-surface-600 mb-3 h-9 w-9" />
          <p className="text-surface-400 text-sm">접수된 신고가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 대기 중 */}
          {pending.length > 0 && (
            <section>
              <h3 className="text-surface-300 mb-3 text-sm font-semibold">
                대기 중 ({pending.length})
              </h3>
              <ReportTable rows={pending} />
            </section>
          )}

          {/* 처리 완료 */}
          {rest.length > 0 && (
            <section>
              <h3 className="text-surface-400 mb-3 text-sm font-semibold">
                처리 완료 ({rest.length})
              </h3>
              <ReportTable rows={rest} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function ReportTable({ rows }: Readonly<{ rows: ReportRow[] }>) {
  return (
    <div className="border-surface-700/50 overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="border-surface-700/50 bg-surface-800/50 border-b">
              <th className="text-surface-400 px-4 py-3 font-medium">ID</th>
              <th className="text-surface-400 px-4 py-3 font-medium">게시물</th>
              <th className="text-surface-400 px-4 py-3 font-medium">신고자</th>
              <th className="text-surface-400 px-4 py-3 font-medium">내용</th>
              <th className="text-surface-400 px-4 py-3 font-medium">상태</th>
              <th className="text-surface-400 px-4 py-3 font-medium">접수일</th>
              <th className="text-surface-400 px-4 py-3 font-medium">처리</th>
            </tr>
          </thead>
          <tbody className="divide-surface-700/50 divide-y">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-800/40 transition-colors">
                <td className="text-surface-500 px-4 py-3 text-xs">#{row.id}</td>
                <td className="px-4 py-3">
                  {row.post ? (
                    <Link
                      href={`/prompt/${row.post.id}`}
                      target="_blank"
                      className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-xs transition-colors"
                    >
                      {row.post.title.length > 30
                        ? `${row.post.title.slice(0, 30)}…`
                        : row.post.title}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </Link>
                  ) : (
                    <span className="text-surface-500 text-xs">삭제된 게시물</span>
                  )}
                </td>
                <td className="text-surface-300 px-4 py-3 text-xs">
                  {row.reporter?.nickname ?? '알 수 없음'}
                </td>
                <td className="px-4 py-3">
                  <p className="text-surface-300 max-w-xs text-xs leading-relaxed">
                    {row.content.length > 80
                      ? `${row.content.slice(0, 80)}…`
                      : row.content}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[row.status] ?? STATUS_COLOR.dismissed}`}
                  >
                    {STATUS_LABEL[row.status] ?? row.status}
                  </span>
                </td>
                <td className="text-surface-400 px-4 py-3 text-xs">
                  {new Date(row.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <ReportStatusActions reportId={row.id} currentStatus={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
