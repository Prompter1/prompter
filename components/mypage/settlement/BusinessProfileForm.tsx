'use client'

import { useEffect, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Save,
  X,
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { cn } from '@/src/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BusinessProfile {
  id: number
  member_id: string
  business_number: string
  company_name: string
  ceo_name: string
  business_address: string
  email: string
  verified: boolean
  created_at: string
  updated_at: string
}

interface FormState {
  business_number: string
  company_name: string
  ceo_name: string
  business_address: string
  email: string
}

interface Props {
  userId: string
  /** 등록/수정 완료 시 부모에게 알림 */
  onSaved?: (profile: BusinessProfile) => void
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** 사업자등록번호 형식 검증: 000-00-00000 */
function isValidBusinessNumber(v: string) {
  return /^\d{3}-\d{2}-\d{5}$/.test(v)
}

/** 숫자 입력 → 000-00-00000 자동 포맷 */
function formatBusinessNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

const EMPTY_FORM: FormState = {
  business_number: '',
  company_name: '',
  ceo_name: '',
  business_address: '',
  email: '',
}

// ─── Input 공통 컴포넌트 ─────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-surface-300 flex items-center gap-1 text-sm font-medium">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  disabled,
  hasError,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full rounded-xl border px-4 py-2.5 text-sm text-white transition-colors outline-none',
        'bg-surface-800/60 placeholder:text-surface-500',
        hasError
          ? 'border-red-500/60 focus:border-red-400'
          : 'border-surface-700/60 focus:border-brand-400',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    />
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function BusinessProfileForm({ userId, onSaved }: Readonly<Props>) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // ── 기존 프로필 로드 ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select(
          'id, member_id, business_number, company_name, ceo_name, business_address, email, verified, created_at, updated_at'
        )
        .eq('member_id', userId)
        .maybeSingle()

      if (cancelled) return
      if (error) {
        setLoadError('사업자 정보를 불러오지 못했습니다.')
        return
      }
      if (data) {
        setProfile(data as BusinessProfile)
        setForm({
          business_number: data.business_number,
          company_name: data.company_name,
          ceo_name: data.ceo_name,
          business_address: data.business_address,
          email: data.email,
        })
      } else {
        // 미등록 → 바로 입력 폼 열기
        setIsEditing(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  // ── 유효성 검사 ─────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Partial<FormState> = {}
    if (!form.business_number.trim()) {
      errs.business_number = '사업자등록번호를 입력해주세요.'
    } else if (!isValidBusinessNumber(form.business_number)) {
      errs.business_number = '형식: 000-00-00000'
    }
    if (!form.company_name.trim()) errs.company_name = '상호명을 입력해주세요.'
    if (!form.ceo_name.trim()) errs.ceo_name = '대표자명을 입력해주세요.'
    if (!form.business_address.trim())
      errs.business_address = '사업장 주소를 입력해주세요.'
    if (!form.email.trim()) {
      errs.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = '올바른 이메일 형식이 아닙니다.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── 저장 ────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)

    try {
      let result: BusinessProfile

      if (profile) {
        // UPDATE
        const { data, error } = await supabase
          .from('business_profiles')
          .update({
            ...form,
            verified: false, // 수정 시 재검토 필요
            updated_at: new Date().toISOString(),
          })
          .eq('member_id', userId)
          .select()
          .single()

        if (error) throw new Error(error.message)
        result = data as BusinessProfile
      } else {
        // INSERT
        const { data, error } = await supabase
          .from('business_profiles')
          .insert({ ...form, member_id: userId })
          .select()
          .single()

        if (error) throw new Error(error.message)
        result = data as BusinessProfile
      }

      // members.seller_type = 'business' 로 업데이트
      await supabase
        .from('members')
        .update({ seller_type: 'business' })
        .eq('id', userId)

      setProfile(result)
      setIsEditing(false)
      onSaved?.(result)
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (profile) {
      setForm({
        business_number: profile.business_number,
        company_name: profile.company_name,
        ceo_name: profile.ceo_name,
        business_address: profile.business_address,
        email: profile.email,
      })
      setIsEditing(false)
    }
    setErrors({})
    setSubmitError(null)
  }

  // ─── 렌더 ────────────────────────────────────────────────────────────────

  if (loadError) {
    return <p className="text-sm text-red-400">{loadError}</p>
  }

  return (
    <div className="border-surface-700/50 rounded-2xl border bg-black/20">
      {/* 헤더 */}
      <div className="border-surface-700/50 flex items-center justify-between gap-4 border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="text-brand-400 h-4 w-4" />
          <span className="text-surface-100 text-sm font-semibold">
            사업자 정보
          </span>
          {profile && (
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                profile.verified
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-amber-500/15 text-amber-400'
              )}
            >
              {profile.verified ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  확인 완료
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  검토 중
                </>
              )}
            </span>
          )}
        </div>

        {/* 편집 토글 (등록된 경우만, verified=false일 때만 수정 가능) */}
        {profile && !profile.verified && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-surface-400 hover:text-surface-200 flex items-center gap-1.5 text-xs transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            수정
          </button>
        )}
      </div>

      {/* 본문 */}
      <div className="p-5">
        {/* 미등록 안내 */}
        {!profile && !isEditing && (
          <p className="text-surface-400 text-sm">
            사업자 정보를 등록하면 사업자 판매자로 전환됩니다.
          </p>
        )}

        {/* 등록됨 + 읽기 모드 */}
        {profile && !isEditing && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: '사업자등록번호', value: profile.business_number },
              { label: '상호명', value: profile.company_name },
              { label: '대표자명', value: profile.ceo_name },
              { label: '세금계산서 이메일', value: profile.email },
              {
                label: '사업장 주소',
                value: profile.business_address,
                full: true,
              },
            ].map(({ label, value, full }) => (
              <div key={label} className={full ? 'sm:col-span-2' : ''}>
                <dt className="text-surface-500 text-xs">{label}</dt>
                <dd className="text-surface-100 mt-0.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* 편집 폼 */}
        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="사업자등록번호"
                required
                error={errors.business_number}
              >
                <Input
                  value={form.business_number}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      business_number: formatBusinessNumber(v),
                    }))
                  }
                  placeholder="000-00-00000"
                  hasError={!!errors.business_number}
                  disabled={saving}
                />
              </Field>

              <Field label="상호명" required error={errors.company_name}>
                <Input
                  value={form.company_name}
                  onChange={(v) => setForm((f) => ({ ...f, company_name: v }))}
                  placeholder="예: 주식회사 프롬프터"
                  hasError={!!errors.company_name}
                  disabled={saving}
                />
              </Field>

              <Field label="대표자명" required error={errors.ceo_name}>
                <Input
                  value={form.ceo_name}
                  onChange={(v) => setForm((f) => ({ ...f, ceo_name: v }))}
                  placeholder="예: 홍길동"
                  hasError={!!errors.ceo_name}
                  disabled={saving}
                />
              </Field>

              <Field
                label="세금계산서 수신 이메일"
                required
                error={errors.email}
              >
                <Input
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="tax@example.com"
                  hasError={!!errors.email}
                  disabled={saving}
                />
              </Field>
            </div>

            <Field label="사업장 주소" required error={errors.business_address}>
              <Input
                value={form.business_address}
                onChange={(v) =>
                  setForm((f) => ({ ...f, business_address: v }))
                }
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                hasError={!!errors.business_address}
                disabled={saving}
              />
            </Field>

            <p className="text-surface-500 text-xs leading-relaxed">
              * 등록 후 관리자 확인이 완료되면 사업자 판매자로 전환됩니다. 수정
              시 재검토가 진행됩니다.
            </p>

            {submitError && (
              <p className="text-xs text-red-400">{submitError}</p>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {profile ? '수정 저장' : '등록하기'}
              </button>

              {profile && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-surface-600 bg-surface-800 hover:bg-surface-700 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  취소
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
