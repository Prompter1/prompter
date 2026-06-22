'use client'

import { useState } from 'react'
import { Landmark, Pencil, Check, X, Loader2 } from 'lucide-react'

const BANKS = [
  '국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행',
  'NH농협은행', '카카오뱅크', '토스뱅크', '케이뱅크', '씨티은행',
  'SC제일은행', '광주은행', '전북은행', '경남은행', '부산은행',
  '대구은행', '수협은행', '우체국', '저축은행', '기타',
]

interface BankAccountFormProps {
  initialBankName: string
  initialAccountNumber: string
  initialAccountHolder: string
  onSave: (data: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }) => Promise<void>
}

export function BankAccountForm({
  initialBankName,
  initialAccountNumber,
  initialAccountHolder,
  onSave,
}: Readonly<BankAccountFormProps>) {
  const [isEditing, setIsEditing] = useState(false)
  const [bankName, setBankName] = useState(initialBankName)
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber)
  const [accountHolder, setAccountHolder] = useState(initialAccountHolder)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const hasAccount = Boolean(initialBankName && initialAccountNumber)

  const handleSave = async () => {
    if (!bankName || !accountNumber.trim() || !accountHolder.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ bankName, accountNumber: accountNumber.trim(), accountHolder: accountHolder.trim() })
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setBankName(initialBankName)
    setAccountNumber(initialAccountNumber)
    setAccountHolder(initialAccountHolder)
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="border-surface-700/50 bg-surface-800/50 rounded-2xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="text-brand-400 h-4 w-4" />
          <h3 className="text-sm font-semibold text-white">정산 계좌</h3>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-surface-400 hover:text-surface-200 flex items-center gap-1.5 rounded-lg p-1.5 text-xs transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            {hasAccount ? '수정' : '등록'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-surface-400 mb-1.5 block text-xs">은행</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="border-surface-700/50 bg-surface-900/50 w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/60"
            >
              <option value="">은행 선택</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-surface-400 mb-1.5 block text-xs">계좌번호</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9-]/g, ''))}
              placeholder="'-' 없이 숫자만 입력"
              className="border-surface-700/50 bg-surface-900/50 placeholder-surface-500 w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/60"
            />
          </div>
          <div>
            <label className="text-surface-400 mb-1.5 block text-xs">예금주</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="예금주명"
              className="border-surface-700/50 bg-surface-900/50 placeholder-surface-500 w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/60"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-500 hover:bg-brand-400 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="border-surface-600 bg-surface-700 hover:bg-surface-600 flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold text-surface-300 transition-colors disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              취소
            </button>
          </div>
        </div>
      ) : hasAccount ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-surface-500 text-xs">은행</span>
            <span className="text-surface-200 text-sm">{initialBankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-500 text-xs">계좌번호</span>
            <span className="text-surface-200 text-sm">{initialAccountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-500 text-xs">예금주</span>
            <span className="text-surface-200 text-sm">{initialAccountHolder}</span>
          </div>
        </div>
      ) : (
        <p className="text-surface-500 text-sm">
          등록된 계좌가 없습니다. 수익 정산을 위해 계좌를 등록해주세요.
        </p>
      )}
    </div>
  )
}
