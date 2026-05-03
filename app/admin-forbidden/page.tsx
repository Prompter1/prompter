import Link from 'next/link'
import { ShieldOff, Home, ArrowLeft } from 'lucide-react'

export default function AdminForbiddenPage() {
  return (
    <main className="bg-surface-900 flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="border-surface-700/50 bg-surface-800/40 max-w-md rounded-2xl border p-8 text-center">
        <div className="bg-surface-700/50 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
          <ShieldOff className="text-surface-400 h-7 w-7" />
        </div>
        <h1 className="text-surface-50 mb-2 text-xl font-bold">
          관리자만 접근할 수 있습니다
        </h1>
        <p className="text-surface-400 mb-6 text-sm leading-relaxed">
          로그인은 되어 있지만, 이 계정에는{' '}
          <code className="text-brand-400 bg-surface-900/80 rounded px-1 py-0.5 text-xs">
            members.is_admin = true
          </code>{' '}
          가 설정되어 있지 않습니다. Supabase에서 해당 사용자의 members 행을 확인해
          주세요.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="border-surface-600 bg-surface-800 hover:bg-surface-700 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            홈으로
          </Link>
          <Link
            href="/mypage"
            className="bg-brand-500 hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            마이페이지
          </Link>
        </div>
        <Link
          href="/login?next=/admin"
          className="text-surface-500 hover:text-surface-300 mt-6 inline-flex items-center gap-1 text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          다른 계정으로 로그인
        </Link>
      </div>
    </main>
  )
}
