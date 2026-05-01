'use client'

import { ShoppingBag, Clock } from 'lucide-react'

export function PurchasesTab() {
  return (
    <div className="border-surface-700 bg-surface-800/30 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
      <div className="bg-surface-700/50 mb-4 rounded-2xl p-4">
        <ShoppingBag className="text-surface-500 h-8 w-8" />
      </div>
      <p className="font-medium text-white">구매 내역</p>
      <p className="text-surface-400 mt-1.5 flex items-center gap-1.5 text-sm">
        <Clock className="h-3.5 w-3.5" />
        결제 시스템 연동 후 표시됩니다.
      </p>
    </div>
  )
}
