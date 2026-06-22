'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCheck, XCircle, Loader2 } from 'lucide-react'

interface ReportStatusActionsProps {
  reportId: number
  currentStatus: string
}

export function ReportStatusActions({
  reportId,
  currentStatus,
}: Readonly<ReportStatusActionsProps>) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  if (currentStatus !== 'pending') return null

  async function updateStatus(status: 'reviewed' | 'dismissed') {
    setLoading(status)
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => updateStatus('reviewed')}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
        title="검토 완료"
      >
        {loading === 'reviewed' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCheck className="h-3.5 w-3.5" />
        )}
        완료
      </button>
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => updateStatus('dismissed')}
        className="inline-flex items-center gap-1 rounded-lg bg-surface-700 px-2.5 py-1.5 text-xs font-semibold text-surface-400 transition-colors hover:bg-surface-600 disabled:opacity-50"
        title="기각"
      >
        {loading === 'dismissed' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        기각
      </button>
    </div>
  )
}
