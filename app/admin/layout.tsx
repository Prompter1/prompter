import Link from 'next/link'
import { LayoutDashboard, Home } from 'lucide-react'
import { requireAdmin } from '@/src/lib/admin-auth'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAdmin()

  return (
    <div className="bg-surface-900 min-h-screen text-white">
      <header className="border-surface-700/50 bg-surface-900/95 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-brand-400 flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <LayoutDashboard className="h-4 w-4" />
              관리자
            </Link>
            <nav className="hidden items-center gap-4 sm:flex">
              <Link
                href="/admin"
                className="text-surface-400 hover:text-surface-100 text-sm transition-colors"
              >
                검수 대기
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-surface-400 hover:text-surface-200 flex items-center gap-1.5 text-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            사이트 홈
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}
