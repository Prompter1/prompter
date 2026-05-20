'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import {
  Mail,
  Shield,
  Calendar,
  LogOut,
  User,
  Crown,
  Pencil,
  Check,
  X,
  Loader2,
} from 'lucide-react'

interface ProfileCardProps {
  fullName: string
  email: string
  provider: string
  createdAt: string
  avatarUrl?: string
  points: number
  isSponsor: boolean
  onSignOut: () => void
  onNicknameChange?: (nickname: string) => Promise<void>
}

export function ProfileCard({
  fullName,
  email,
  provider,
  createdAt,
  avatarUrl,
  points,
  isSponsor,
  onSignOut,
  onNicknameChange,
}: Readonly<ProfileCardProps>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(fullName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) setEditValue(fullName)
  }, [fullName, isEditing])

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (!trimmed) {
      setError('닉네임을 입력해주세요.')
      return
    }
    if (trimmed.length < 2) {
      setError('2자 이상 입력해주세요.')
      return
    }
    if (trimmed === fullName) {
      setIsEditing(false)
      return
    }
    setSaving(true)
    setError('')
    try {
      await onNicknameChange?.(trimmed)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(fullName)
    setError('')
  }

  return (
    <header className="border-surface-700/50 bg-surface-800/80 mb-10 rounded-3xl border p-8 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        {/* 아바타 + 기본 정보 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          <div className="ring-brand-500/30 rounded-full ring-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                width={96}
                height={96}
                className="border-surface-700 h-24 w-24 rounded-full border-2 object-cover"
                priority
              />
            ) : (
              <div className="from-brand-400 to-brand-600 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            {/* 닉네임 영역 */}
            {isEditing ? (
              <div className="flex flex-col items-center gap-2 md:items-start">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave()
                      if (e.key === 'Escape') handleCancel()
                    }}
                    maxLength={20}
                    className="border-brand-500/60 bg-surface-700 focus:ring-brand-500/30 w-44 rounded-xl border px-3 py-1.5 text-xl font-bold text-white outline-none focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-500 hover:bg-brand-400 flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="border-surface-600 bg-surface-700 hover:bg-surface-600 flex h-8 w-8 items-center justify-center rounded-lg border text-white transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                {isSponsor && (
                  <span className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase">
                    <Crown className="h-3 w-3" />
                    Sponsor
                  </span>
                )}
                {onNicknameChange && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-surface-500 hover:text-surface-300 rounded-lg p-1 transition-colors"
                    title="닉네임 변경"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </span>
              <span className="text-surface-400 flex items-center gap-1.5 text-sm capitalize">
                <Shield className="h-3.5 w-3.5" />
                {provider}
              </span>
              <span className="text-surface-400 flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-end">
          <button
            onClick={onSignOut}
            className="group border-surface-600 bg-surface-700/50 text-surface-300 flex items-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-medium transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
