'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Loader2,
  Percent,
  Receipt,
  Save,
  ShieldCheck,
  TrendingUp,
  User,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/src/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BusinessProfileForm } from '@/components/mypage/settlement/BusinessProfileForm'
import { cn, formatKRW } from '@/src/lib/utils'

// ─── Constants ───────────────────────────────────────────────────────────────

const INDIVIDUAL_FEE_RATE = 0.20
const BUSINESS_FEE_RATE = 0.15
const PROMO_FEE_RATE = 0.05
const WITHHOLDING_RATE = 0.033
const MONTHLY_LIMIT = 500_000

// ─── Types ───────────────────────────────────────────────────────────────────

type SellerType = 'individual' | 'business' | null
type SettlementStatus =
  | 'pending'
  | 'ready'
  | 'paid'
  | 'limited'
  | 'business_required'

interface MemberInfo {
  seller_type: SellerType
  settlement_status: SettlementStatus
  total_revenue: number
  monthly_gross: number
}

interface Settlement {
  id: number
  period_start: string
  period_end: string
  seller_type: string
  gross_amount: number
  fee_amount: number
  withholding_tax: number
  net_amount: number
  status: string
  paid_at: string | null
  invoice_submitted: boolean
  is_promotion: boolean
}

// ─── 정산 정책 헬퍼 ──────────────────────────────────────────────────────────

/**
 * verified=true  사업자 → 원천징수 없음 (0%)
 * verified=false 사업자 → 이번 달 정산 보류 (deferred) — 이 함수에서는 쓰지 않음
 * individual/null        → 원천징수 3.3%
 */
function applyWithholding(sellerType: SellerType, verified: boolean): boolean {
  if (sellerType === 'business' && verified) return false
  return true
}

function calcExample(gross: number, sellerType: SellerType, verified: boolean, isPromotion = false) {
  const feeRate =
    sellerType === 'business'
      ? isPromotion ? PROMO_FEE_RATE : BUSINESS_FEE_RATE
      : INDIVIDUAL_FEE_RATE
  const fee = Math.floor(gross * feeRate)
  const afterFee = gross - fee
  const withhold = applyWithholding(sellerType, verified)
    ? Math.floor(afterFee * WITHHOLDING_RATE)
    : 0
  const net = afterFee - withhold
  return { fee, feeRate, withhold, net }
}

function periodLabel(start: string, end: string) {
  const s = new Date(start),
    e = new Date(end)
  return `${s.getFullYear()}년 ${s.getMonth() + 1}월 ${s.getDate()}일 ~ ${e.getMonth() + 1}월 ${e.getDate()}일`
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

function InfoBox({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode
  variant?: 'blue' | 'amber' | 'red' | 'green'
}) {
  const style: Record<string, string> = {
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-200/80',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200/80',
    red: 'border-red-500/20 bg-red-500/5 text-red-200/80',
    green: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200/80',
  }
  const icon: Record<string, React.ReactNode> = {
    blue: <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />,
    amber: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />,
    red: <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />,
    green: (
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
    ),
  }
  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border p-4 text-sm',
        style[variant]
      )}
    >
      {icon[variant]}
      <div>{children}</div>
    </div>
  )
}

function SectionCard({
  icon: Icon,
  title,
  accent = false,
  children,
}: {
  icon: React.ElementType
  title: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border p-6 sm:p-8',
        accent
          ? 'border-brand-500/20 bg-brand-500/5'
          : 'border-surface-700/50 bg-surface-800/20'
      )}
    >
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
        <Icon
          className={cn(
            'h-5 w-5',
            accent ? 'text-brand-400' : 'text-surface-300'
          )}
        />
        {title}
      </h2>
      {children}
    </div>
  )
}

// ─── 상태 배너 ────────────────────────────────────────────────────────────────

function StatusBanner({
  status,
  sellerType,
  verified,
  monthlyGross,
  isPromotion,
}: {
  status: SettlementStatus
  sellerType: SellerType
  verified: boolean
  monthlyGross: number
  isPromotion: boolean
}) {
  if (status === 'business_required')
    return (
      <InfoBox variant="red">
        <p className="font-semibold">사업자 등록이 필요합니다</p>
        <p className="mt-1 text-xs">
          이번 달 매출이 기준({formatKRW(MONTHLY_LIMIT)})을 초과하여 정산이 보류
          중입니다. 사업자 정보를 등록하면 정산이 재개됩니다.
        </p>
      </InfoBox>
    )

  if (status === 'limited')
    return (
      <InfoBox variant="amber">
        <p className="font-semibold">정산이 일시 제한되었습니다</p>
        <p className="mt-1 text-xs">
          정책 위반 또는 관리자 검토로 인해 보류 중입니다.
        </p>
      </InfoBox>
    )

  // 미승인 사업자 → 이번 달 보류
  if (sellerType === 'business' && !verified)
    return (
      <InfoBox variant="amber">
        <p className="font-semibold">사업자 정보 검토 중 — 이번 달 정산 보류</p>
        <p className="mt-1 text-xs leading-relaxed">
          관리자 승인이 완료되지 않아{' '}
          <strong>이번 달 정산은 다음 달로 이월</strong>됩니다. 익월 1일까지
          승인이 완료되면 다음 달 정산에 포함됩니다. 승인 전 발생한 매출에 대한
          세무 책임은 판매자에게 있습니다.
        </p>
      </InfoBox>
    )

  // 승인된 사업자
  if (sellerType === 'business' && verified)
    return (
      <InfoBox variant="green">
        <p className="font-semibold">
          사업자 판매자 — 수수료 {isPromotion ? '5% (프로모션)' : '15%'} 공제, 원천징수 없음
        </p>
        <p className="mt-1 text-xs">
          익월 1일 정산 예정 금액 안내 후, 세금계산서 발행 확인 시 익월 10일 지급됩니다.
        </p>
      </InfoBox>
    )

  // 개인
  if (sellerType === 'individual') {
    const remaining = MONTHLY_LIMIT - monthlyGross
    const pct = Math.min((monthlyGross / MONTHLY_LIMIT) * 100, 100)
    const isNear = remaining > 0 && remaining < 100_000
    return (
      <InfoBox variant={isNear ? 'amber' : 'green'}>
        <p className="font-semibold">
          {isNear
            ? '곧 사업자 등록이 필요합니다'
            : '현재 개인 판매자로 정산이 진행됩니다.'}
        </p>
        <p className="mt-1 text-xs">
          이번 달 매출: <strong>{formatKRW(monthlyGross)}</strong> / 기준{' '}
          {formatKRW(MONTHLY_LIMIT)}
          {remaining > 0 && ` (${formatKRW(remaining)} 남음)`}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isNear ? 'bg-amber-400' : 'bg-emerald-400'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </InfoBox>
    )
  }

  return (
    <InfoBox variant="blue">
      <p className="font-semibold">판매자 유형을 설정해 주세요</p>
      <p className="mt-1 text-xs">
        아래에서 개인 또는 사업자 유형을 선택하면 정산이 시작됩니다.
      </p>
    </InfoBox>
  )
}

// ─── 정산 상태 라벨 ──────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-surface-700/50 text-surface-300' },
  ready: { label: '준비', cls: 'bg-blue-500/15 text-blue-400' },
  paid: { label: '지급완료', cls: 'bg-emerald-500/15 text-emerald-400' },
  limited: { label: '제한', cls: 'bg-amber-500/15 text-amber-400' },
  business_required: { label: '보류', cls: 'bg-red-500/15 text-red-400' },
  deferred: { label: '이월', cls: 'bg-purple-500/15 text-purple-400' },
}

function SaveTypeButton({
  saving,
  saved,
  sellerType,
  disabled,
  onClick,
}: {
  saving: boolean
  saved: boolean
  sellerType: 'individual' | 'business'
  disabled: boolean
  onClick: () => void
}) {
  let icon = <Save className="h-4 w-4" />
  if (saving) icon = <Loader2 className="h-4 w-4 animate-spin" />
  else if (saved) icon = <CheckCircle2 className="h-4 w-4" />

  let label = `${sellerType === 'individual' ? '개인' : '사업자'} 판매자로 설정하기`
  if (saving) label = '저장 중...'
  else if (saved) label = '저장 완료!'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving || disabled}
      className="bg-brand-500 hover:bg-brand-400 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettlementPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)
  const [verified, setVerified] = useState(false)
  const [isPromotion, setIsPromotion] = useState(false)
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [pendingAmount, setPendingAmount] = useState(0)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<SellerType>(null)
  const [savingType, setSavingType] = useState(false)
  const [typeSaved, setTypeSaved] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login?next=/mypage/settlement')
  }, [user, isLoading, router])

  useEffect(() => {
    if (!typeSaved) return
    const id = setTimeout(() => setTypeSaved(false), 2500)
    return () => clearTimeout(id)
  }, [typeSaved])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const load = async () => {
      setDataLoading(true)
      const now = new Date()
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString()

      const [{ data: member }, { data: txs }, { data: settles }, { data: bp }] =
        await Promise.all([
          supabase
            .from('members')
            .select(
              'seller_type, settlement_status, total_revenue, monthly_gross, is_promotion'
            )
            .eq('id', user.id)
            .single(),
          supabase
            .from('transactions')
            .select('seller_revenue')
            .eq('seller_id', user.id)
            .gte('created_at', monthStart),
          supabase
            .from('settlements')
            .select(
              'id, period_start, period_end, seller_type, gross_amount, fee_amount, withholding_tax, net_amount, status, paid_at, invoice_submitted, is_promotion'
            )
            .eq('seller_id', user.id)
            .order('period_start', { ascending: false })
            .limit(12),
          supabase
            .from('business_profiles')
            .select('verified')
            .eq('member_id', user.id)
            .maybeSingle(),
        ])

      if (cancelled) return
      if (member) {
        setMemberInfo(member as MemberInfo)
        setSelectedType((member as MemberInfo).seller_type ?? null)
        setIsPromotion(Boolean((member as any).is_promotion))
      }
      setVerified(bp?.verified ?? false)
      setPendingAmount(
        (txs ?? []).reduce(
          (s: number, t: { seller_revenue: number | null }) =>
            s + (t.seller_revenue ?? 0),
          0
        )
      )
      setSettlements((settles as Settlement[]) ?? [])
      setDataLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  async function saveSellerType() {
    if (!user || !selectedType) return
    setSavingType(true)
    setTypeSaved(false)
    const { error } = await supabase
      .from('members')
      .update({ seller_type: selectedType })
      .eq('id', user.id)
    if (!error) {
      setMemberInfo((p) => (p ? { ...p, seller_type: selectedType } : p))
      setTypeSaved(true)
    }
    setSavingType(false)
  }

  if (isLoading || dataLoading)
    return (
      <main className="bg-surface-900 min-h-screen">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="text-brand-400 h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </main>
    )

  const status = (memberInfo?.settlement_status ??
    'pending') as SettlementStatus
  const sellerType = memberInfo?.seller_type ?? null
  const totalRev = memberInfo?.total_revenue ?? 0
  const monthly = memberInfo?.monthly_gross ?? 0
  const isBlocked = status === 'business_required' || status === 'limited'
  const typeChanged = selectedType !== sellerType
  const hasWithhold = settlements.some((s) => s.withholding_tax > 0)

  // 수수료 예시 (이번 달 매출 또는 10,000원)
  // selectedType 기준으로 계산 — 저장 전 미리보기 역할
  // 아직 저장 안 된 유형으로 바꿨을 때는 verified = true 로 가정
  const exGross = monthly > 0 ? monthly : 10_000
  const previewVerified = selectedType !== sellerType ? true : verified
  const {
    fee: exFee,
    feeRate: exFeeRate,
    withhold: exWithhold,
    net: exNet,
  } = calcExample(exGross, selectedType, previewVerified, isPromotion)

  const faqs = [
    {
      q: '정산은 언제 받나요?',
      a: '매월 1일~말일 판매분을 익월 10일 지정 계좌로 지급합니다.',
    },
    {
      q: '원천징수 3.3%란?',
      a: '소득세 3% + 지방소득세 0.3%입니다. 플랫폼이 납부하고 지급명세서를 제출합니다.',
    },
    {
      q: '사업자 승인 전이면?',
      a: '이번 달 정산이 다음 달로 이월됩니다. 승인 완료 후 다음 집계에 포함됩니다.',
    },
    {
      q: '사업자 승인 후 세금계산서는?',
      a: '등록하신 이메일로 익월 10일 정산 시 발송됩니다.',
    },
    {
      q: '월 50만원 초과 시?',
      a: '개인 판매자가 월 50만원을 초과하면 정산이 보류되고 사업자 등록이 요청됩니다.',
    },
    {
      q: '수수료에 무엇이 포함되나요?',
      a: 'PG 수수료, 서버 인프라 유지비, 플랫폼 운영비가 포함됩니다. 개인 판매자 20%는 부가가치세까지 포함된 금액이며, 사업자 판매자 15%(프로모션 5%)는 부가가치세가 별도입니다.',
    },
  ]

  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-12 pb-24">
        <Link
          href="/mypage"
          className="text-surface-400 hover:text-surface-200 mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          마이페이지로 돌아가기
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-brand-500/20 rounded-xl p-2.5">
              <Banknote className="text-brand-400 h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              수익 정산
            </h1>
          </div>
          <p className="text-surface-400 text-sm">
            투명하고 합리적인 Prompter 정산 시스템
          </p>
        </div>

        <div className="mb-8">
          <StatusBanner
            status={status}
            sellerType={sellerType}
            verified={verified}
            monthlyGross={monthly}
            isPromotion={isPromotion}
          />
        </div>

        <div className="space-y-6">
          {/* 수익 요약 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border p-5">
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span className="text-surface-400 text-xs font-medium">
                  누적 정산 수익
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {totalRev > 0 ? formatKRW(totalRev) : '—'}
              </p>
              <p className="text-surface-500 mt-1 text-xs">수수료 공제 후</p>
            </div>
            <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border p-5">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-surface-400 text-xs font-medium">
                  이번 달 정산 예정
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-400">
                {sellerType === 'business' && !verified
                  ? '보류'
                  : pendingAmount > 0
                    ? formatKRW(pendingAmount)
                    : '—'}
              </p>
              <p className="text-surface-500 mt-1 text-xs">
                {sellerType === 'business' && !verified
                  ? '승인 후 다음 달 집계'
                  : '익월 10일 지급'}
              </p>
            </div>
          </div>

          {/* 판매자 유형 */}
          <SectionCard icon={User} title="판매자 유형">
            <div className="space-y-4">
              {sellerType && (
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-surface-300">
                    현재 설정:{' '}
                    <strong className="text-white">
                      {sellerType === 'individual'
                        ? '개인 판매자'
                        : '사업자 판매자'}
                    </strong>
                    {sellerType === 'business' && (
                      <span
                        className={cn(
                          'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
                          verified
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-amber-500/15 text-amber-400'
                        )}
                      >
                        {verified ? '승인 완료' : '검토 중'}
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    type: 'individual' as const,
                    icon: User,
                    label: '개인 판매자',
                    desc: '원천징수 3.3% · 월 50만원 한도',
                  },
                  {
                    type: 'business' as const,
                    icon: Building2,
                    label: '사업자 판매자',
                    desc: '승인 완료 시 원천징수 없음 · 한도 없음',
                  },
                ].map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    type="button"
                    disabled={savingType || isBlocked}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                      selectedType === type
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-surface-700/50 bg-surface-800/40 hover:border-surface-600',
                      (savingType || isBlocked) &&
                        'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 rounded-lg p-1.5',
                        selectedType === type
                          ? 'bg-brand-500/20'
                          : 'bg-surface-700/50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          selectedType === type
                            ? 'text-brand-400'
                            : 'text-surface-400'
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          selectedType === type
                            ? 'text-white'
                            : 'text-surface-200'
                        )}
                      >
                        {label}
                      </p>
                      <p className="text-surface-400 mt-0.5 text-xs">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedType && (typeChanged || !sellerType) && (
                <SaveTypeButton
                  saving={savingType}
                  saved={typeSaved}
                  sellerType={selectedType}
                  disabled={isBlocked}
                  onClick={saveSellerType}
                />
              )}

              {typeSaved && (
                <InfoBox variant="green">판매자 유형이 저장되었습니다.</InfoBox>
              )}

              {sellerType === 'business' && !typeChanged && user && (
                <BusinessProfileForm
                  userId={user.id}
                  onSaved={() =>
                    setMemberInfo((p) =>
                      p ? { ...p, seller_type: 'business' } : p
                    )
                  }
                />
              )}
            </div>
          </SectionCard>

          {/* 수수료 안내 */}
          <SectionCard icon={Percent} title="중개 수수료" accent>
            <div className="space-y-3">
              <div className="border-surface-700/50 bg-surface-900/60 flex items-center justify-between rounded-2xl border px-5 py-4">
                <div>
                  <span className="text-surface-200 font-medium">
                    플랫폼 중개 수수료
                  </span>
                  {selectedType === null && (
                    <p className="text-surface-500 mt-0.5 text-xs">개인 20% / 사업자 15%</p>
                  )}
                </div>
                <span className="text-brand-400 text-xl font-bold">
                  {selectedType === 'business'
                    ? isPromotion ? '5% 🎉' : '15%'
                    : selectedType === 'individual'
                      ? '20%'
                      : '15~20%'}
                </span>
              </div>
              <p className="text-surface-400 text-xs">
                * PG 수수료, 서버 인프라 유지비, 플랫폼 운영비 포함
                {selectedType === 'individual' && ' / 개인 판매자는 VAT 포함'}
                {selectedType === 'business' && ' / 사업자 판매자는 VAT 별도'}
              </p>

              <div className="space-y-2 pt-1">
                <p className="text-surface-500 text-xs">
                  {monthly > 0
                    ? `이번 달 매출 기준 (${formatKRW(monthly)})`
                    : '예시 (10,000원 기준)'}
                  {selectedType === 'business' && sellerType === 'business' && !verified && (
                    <span className="ml-2 text-amber-400">
                      · 승인 대기 — 이번 달 보류
                    </span>
                  )}
                </p>

                {selectedType === 'business' && sellerType === 'business' && !verified ? (
                  // 저장된 유형이 사업자이고 아직 미승인 — 예시 표시 불가
                  <div className="bg-surface-900/40 rounded-xl px-4 py-3 text-sm text-amber-200/70">
                    사업자 승인 완료 후 정산 금액이 확정됩니다.
                  </div>
                ) : (
                  [
                    {
                      label: monthly > 0 ? '이번 달 매출' : '판매가 예시',
                      value: formatKRW(exGross),
                    },
                    {
                      label: `수수료 −${Math.round(exFeeRate * 100)}%`,
                      value: `−${formatKRW(exFee)}`,
                      muted: true,
                    },
                    ...(exWithhold > 0
                      ? [
                          {
                            label: '원천징수 −3.3%',
                            value: `−${formatKRW(exWithhold)}`,
                            muted: true,
                          },
                        ]
                      : []),
                    {
                      label: '실수령 예상',
                      value: formatKRW(exNet),
                      highlight: true,
                    },
                  ].map(({ label, value, muted, highlight }) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-2.5 text-sm',
                        highlight ? 'bg-emerald-500/10' : 'bg-surface-900/40'
                      )}
                    >
                      <span
                        className={
                          muted ? 'text-surface-400' : 'text-surface-200'
                        }
                      >
                        {label}
                      </span>
                      <span
                        className={cn(
                          'font-semibold',
                          highlight ? 'text-emerald-400' : 'text-white'
                        )}
                      >
                        {value}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>

          {/* 사업자 판매자 정산 플로우 */}
          {sellerType === 'business' && verified && (
            <SectionCard icon={FileText} title="사업자 정산 진행 절차">
              <ol className="space-y-3">
                {[
                  { step: 1, label: '매출 집계', desc: '매월 1일~말일 판매 확정 금액을 자동 집계합니다.' },
                  { step: 2, label: '정산 예정 금액 안내', desc: '익월 1일 정산 예정 금액(수수료 제외)이 이 페이지에 표시됩니다.' },
                  { step: 3, label: '세금계산서 발행', desc: '정산 금액(수수료 제외)에 대해 플랫폼 앞으로 세금계산서를 발행해 주세요. 미발행 시 지급이 보류됩니다.' },
                  { step: 4, label: '플랫폼 확인', desc: '관리자가 세금계산서 발행 여부 및 금액을 확인합니다.' },
                  { step: 5, label: '정산 지급', desc: '이상이 없는 경우 익월 10일에 지급됩니다.' },
                ].map(({ step, label, desc }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="bg-brand-500/20 text-brand-400 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-surface-400 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* 이번 달 세금계산서 상태 */}
              {settlements.length > 0 && settlements[0].status === 'ready' && (
                <div className={cn(
                  'mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm',
                  settlements[0].invoice_submitted
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200/80'
                    : 'border-amber-500/20 bg-amber-500/5 text-amber-200/80'
                )}>
                  {settlements[0].invoice_submitted ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {settlements[0].invoice_submitted
                        ? '세금계산서 발행 확인 완료 — 익월 10일 지급 예정'
                        : '세금계산서 발행 대기 중'}
                    </p>
                    {!settlements[0].invoice_submitted && (
                      <p className="mt-0.5 text-xs">
                        정산 금액({formatKRW(settlements[0].net_amount)})에 대해 플랫폼(Prompter) 앞으로 세금계산서를 발행한 후 관리자에게 알려주세요.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* 정산 이력 */}
          <SectionCard icon={TrendingUp} title="정산 이력">
            {settlements.length === 0 ? (
              <div className="border-surface-700/50 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12">
                <Receipt className="text-surface-600 mb-3 h-8 w-8" />
                <p className="text-surface-400 text-sm">정산 이력이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-surface-700/50 border-b">
                      {[
                        '기간',
                        '총 매출',
                        '수수료',
                        ...(hasWithhold ? ['원천징수'] : []),
                        '실지급',
                        '상태',
                        ...(sellerType === 'business' ? ['세금계산서'] : []),
                        '지급일',
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-surface-400 px-4 py-3 font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((s) => {
                      const st = STATUS_LABEL[s.status] ?? STATUS_LABEL.pending
                      const isDeferred = s.status === 'deferred'
                      return (
                        <tr
                          key={s.id}
                          className="border-surface-700/40 hover:bg-surface-800/30 border-b transition-colors"
                        >
                          <td className="text-surface-300 px-4 py-3 text-xs">
                            {periodLabel(s.period_start, s.period_end)}
                          </td>
                          <td className="px-4 py-3 text-white">
                            {formatKRW(s.gross_amount)}
                          </td>
                          <td className="text-surface-400 px-4 py-3">
                            {isDeferred ? '—' : `−${formatKRW(s.fee_amount)}`}
                          </td>
                          {hasWithhold && (
                            <td className="text-surface-400 px-4 py-3">
                              {s.withholding_tax > 0
                                ? `−${formatKRW(s.withholding_tax)}`
                                : '—'}
                            </td>
                          )}
                          <td
                            className={cn(
                              'px-4 py-3 font-semibold',
                              isDeferred
                                ? 'text-purple-400'
                                : 'text-emerald-400'
                            )}
                          >
                            {isDeferred ? '이월' : formatKRW(s.net_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                st.cls
                              )}
                            >
                              {st.label}
                            </span>
                          </td>
                          {sellerType === 'business' && (
                            <td className="px-4 py-3">
                              {s.seller_type === 'business' ? (
                                <span className={cn(
                                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                  s.invoice_submitted
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                )}>
                                  {s.invoice_submitted ? '발행 확인' : '미확인'}
                                </span>
                              ) : '—'}
                            </td>
                          )}
                          <td className="text-surface-500 px-4 py-3 text-xs">
                            {s.paid_at
                              ? new Date(s.paid_at).toLocaleDateString('ko-KR')
                              : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* 금지 행위 */}
          <SectionCard icon={ShieldCheck} title="금지 행위">
            <ul className="space-y-2">
              {[
                '욕설, 비방, 음란성, 범죄 유도 목적 등 사회 미풍양속을 해치는 프롬프트 등록',
                '구매자를 외부 직거래로 유도하는 행위 (연락처, 개인 결제 링크 기재 등)',
                '동일하거나 유사한 프롬프트를 가격만 바꾸어 중복 등록하는 도배 행위',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-red-200/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* FAQ */}
          <SectionCard icon={FileText} title="자주 묻는 질문">
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className="border-surface-700/50 overflow-hidden rounded-2xl border"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="hover:bg-surface-800/60 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                  >
                    <span className="text-surface-100 text-sm font-medium">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        'text-surface-400 h-4 w-4 shrink-0 transition-transform',
                        faqOpen === i && 'rotate-180'
                      )}
                    />
                  </button>
                  {faqOpen === i && (
                    <div className="border-surface-700/50 border-t px-5 py-4">
                      <p className="text-surface-400 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="text-center">
            <Link
              href="/footer/seller-policy"
              className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              전체 판매자 정책 보기
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
