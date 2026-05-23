'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  AlertTriangle,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { BusinessProfileActions } from '@/components/admin/BusinessProfileActions'
import { cn, formatKRW } from '@/src/lib/utils'
import { buildPeriodOptions } from '@/src/lib/settlement-utils'

interface Stats {
  totalGross: number
  totalSellers: number
  businessRequired: number
  pendingProfiles: number
}

interface BusinessProfile {
  id: number
  member_id: string
  business_number: string
  company_name: string
  ceo_name: string
  email: string
  verified: boolean
  created_at: string
  member: {
    nickname: string | null
    email: string | null
    settlement_status: string | null
    monthly_gross: number
    is_promotion?: boolean
  } | null
}

interface SettlementRow {
  id: number
  seller_id: string
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
  member: { nickname: string | null; email: string | null; is_promotion?: boolean } | null
}

type RawBP = Omit<BusinessProfile, 'member'>
type RawSettlement = Omit<SettlementRow, 'member'>
type MemberRow = { id: string; nickname: string | null; email: string | null; settlement_status: string | null; monthly_gross: number; is_promotion?: boolean }
type SellerRow = { id: string; nickname: string | null; email: string | null; is_promotion?: boolean }

const PERIOD_OPTIONS = buildPeriodOptions()

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: '정산 대기', cls: 'bg-surface-700/50 text-surface-300' },
  ready: { label: '준비', cls: 'bg-blue-500/15 text-blue-400' },
  paid: { label: '지급완료', cls: 'bg-emerald-500/15 text-emerald-400' },
  limited: { label: '제한', cls: 'bg-amber-500/15 text-amber-400' },
  business_required: { label: '보류', cls: 'bg-red-500/15 text-red-400' },
  deferred: { label: '이월', cls: 'bg-purple-500/15 text-purple-400' },
}

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_BADGE[status ?? 'pending'] ?? STATUS_BADGE.pending
  return (
    <span
      className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', s.cls)}
    >
      {s.label}
    </span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
  bg: string
}) {
  return (
    <div className="border-surface-700/50 bg-surface-800/60 rounded-2xl border p-5">
      <div className={cn('mb-3 inline-flex rounded-xl p-2.5', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className="text-surface-400 text-xs font-medium">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', color)}>{value}</p>
    </div>
  )
}

export default function AdminSettlementPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [pendingProfiles, setPendingProfiles] = useState<BusinessProfile[]>([])
  const [settlements, setSettlements] = useState<SettlementRow[]>([])
  const [loading, setLoading] = useState(true)

  // 집계 실행 상태
  const [runLoading, setRunLoading] = useState(false)
  const [runResult, setRunResult] = useState<{
    total: number
    individualCount: number
    businessCount: number
  } | null>(null)
  const [runError, setRunError] = useState<string | null>(null)

  // 정산 목록 필터
  const [filterPeriod, setFilterPeriod] = useState(0) // 0 = 전체

  const loadData = useCallback(async () => {
    setLoading(true)

    const now = new Date()
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString()

    const [
      { data: grossData },
      { count: totalSellers },
      { count: businessRequired },
      { count: pendingCount },
      { data: bpData },
      { data: settleData },
    ] = await Promise.all([
      supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', monthStart),
      supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('monthly_gross', 0),
      supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .eq('settlement_status', 'business_required'),
      supabase
        .from('business_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('verified', false),
      supabase
        .from('business_profiles')
        .select(
          'id, member_id, business_number, company_name, ceo_name, email, verified, created_at'
        )
        .eq('verified', false)
        .order('created_at', { ascending: true }),
      supabase
        .from('settlements')
        .select(
          'id, seller_id, period_start, period_end, seller_type, gross_amount, fee_amount, withholding_tax, net_amount, status, paid_at, invoice_submitted, is_promotion'
        )
        .order('period_start', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100),
    ])

    const totalGross = (grossData ?? []).reduce(
      (s: number, t: { amount: number }) => s + (t.amount ?? 0),
      0
    )
    setStats({
      totalGross,
      totalSellers: totalSellers ?? 0,
      businessRequired: businessRequired ?? 0,
      pendingProfiles: pendingCount ?? 0,
    })

    const rawBPs = (bpData ?? []) as RawBP[]
    const rawSettlements = (settleData ?? []) as RawSettlement[]
    const memberIds = [...new Set(rawBPs.map((b) => b.member_id))]
    const sellerIds = [...new Set(rawSettlements.map((s) => s.seller_id))]

    const [memberRes, sellerRes] = await Promise.all([
      memberIds.length > 0
        ? supabase
            .from('members')
            .select('id, nickname, email, settlement_status, monthly_gross, is_promotion')
            .in('id', memberIds)
        : Promise.resolve({ data: [] }),
      sellerIds.length > 0
        ? supabase
            .from('members')
            .select('id, nickname, email, is_promotion')
            .in('id', sellerIds)
        : Promise.resolve({ data: [] }),
    ])

    const memberMap = new Map(
      (memberRes.data as MemberRow[] ?? []).map((m) => [m.id, m])
    )
    const sellerMap = new Map(
      (sellerRes.data as SellerRow[] ?? []).map((m) => [
        m.id,
        { nickname: m.nickname, email: m.email, is_promotion: m.is_promotion },
      ])
    )

    setPendingProfiles(
      rawBPs.map((bp) => ({ ...bp, member: memberMap.get(bp.member_id) ?? null }))
    )
    setSettlements(
      rawSettlements.map((s) => ({ ...s, member: sellerMap.get(s.seller_id) ?? null }))
    )

    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleRun() {
    setRunLoading(true)
    setRunResult(null)
    setRunError(null)

    try {
      // status = 'ready'인 전체 미정산 목록 조회
      const { data, error } = await supabase
        .from('settlements')
        .select('seller_type, net_amount, invoice_submitted')
        .eq('status', 'ready')

      if (error) throw error

      const rows = data ?? []
      // 개인: 전체 포함 / 사업자: 세금계산서 제출된 것만
      const eligible = rows.filter(
        (s: { seller_type: string; invoice_submitted: boolean }) =>
          s.seller_type === 'individual' ||
          (s.seller_type === 'business' && s.invoice_submitted)
      )
      const total = eligible.reduce(
        (sum: number, s: { net_amount: number }) => sum + (s.net_amount ?? 0),
        0
      )
      const individualCount = eligible.filter(
        (s: { seller_type: string }) => s.seller_type === 'individual'
      ).length
      const businessCount = eligible.filter(
        (s: { seller_type: string }) => s.seller_type === 'business'
      ).length

      setRunResult({ total, individualCount, businessCount })
    } catch {
      setRunError('조회 중 오류가 발생했습니다.')
    } finally {
      setRunLoading(false)
    }
  }

  async function handleInvoiceToggle(settlementId: number, current: boolean) {
    const res = await fetch(`/api/admin/settlement/${settlementId}/invoice`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submitted: !current }),
    })
    if (res.ok) {
      setSettlements((prev) =>
        prev.map((s) =>
          s.id === settlementId ? { ...s, invoice_submitted: !current } : s
        )
      )
    }
  }

  async function handlePromotionToggle(memberId: string, current: boolean) {
    const res = await fetch(`/api/admin/members/${memberId}/promotion`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_promotion: !current }),
    })
    if (res.ok) {
      setPendingProfiles((prev) =>
        prev.map((bp) =>
          bp.member_id === memberId
            ? {
                ...bp,
                member: bp.member
                  ? { ...bp.member, is_promotion: !current }
                  : null,
              }
            : bp
        )
      )
    }
  }

  const filteredSettlements =
    filterPeriod === 0
      ? settlements
      : settlements.filter((s) => {
          const opt = PERIOD_OPTIONS[filterPeriod - 1]
          const d = new Date(s.period_start)
          return d.getFullYear() === opt.year && d.getMonth() + 1 === opt.month
        })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">정산 관리</h1>
          <p className="text-surface-400 mt-1 text-sm">
            사업자 정보 검토, 정산 현황 및 월별 정산 집계 실행
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="border-surface-700/50 hover:bg-surface-800 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          새로고침
        </button>
      </div>

      {/* ── 이번 달 현황 ── */}
      {stats && (
        <section>
          <h2 className="text-surface-400 mb-4 text-xs font-semibold tracking-wider uppercase">
            이번 달 현황
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label="이번 달 총 매출"
              value={formatKRW(stats.totalGross)}
              color="text-brand-400"
              bg="bg-brand-500/10"
            />
            <StatCard
              icon={Users}
              label="매출 발생 판매자"
              value={`${stats.totalSellers}명`}
              color="text-emerald-400"
              bg="bg-emerald-500/10"
            />
            <StatCard
              icon={AlertTriangle}
              label="사업자 등록 필요"
              value={`${stats.businessRequired}명`}
              color="text-amber-400"
              bg="bg-amber-500/10"
            />
            <StatCard
              icon={ClipboardList}
              label="사업자 검토 대기"
              value={`${stats.pendingProfiles}건`}
              color="text-indigo-400"
              bg="bg-indigo-500/10"
            />
          </div>
        </section>
      )}

      {/* ── 사업자 정보 검토 ── */}
      <section>
        <h2 className="text-surface-400 mb-4 text-xs font-semibold tracking-wider uppercase">
          사업자 정보 검토 대기
        </h2>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-brand-400 h-6 w-6 animate-spin" />
          </div>
        ) : pendingProfiles.length === 0 ? (
          <div className="border-surface-700/50 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12">
            <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-600" />
            <p className="text-surface-400 text-sm">
              검토 대기 중인 사업자 정보가 없습니다.
            </p>
          </div>
        ) : (
          <div className="border-surface-700/50 overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-surface-700/50 bg-surface-800/50 border-b">
                    {[
                      '판매자',
                      '상호명',
                      '사업자번호',
                      '대표자',
                      '이메일',
                      '정산 상태',
                      '등록일',
                      '프로모션',
                      '동작',
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
                  {pendingProfiles.map((bp) => (
                    <tr
                      key={bp.id}
                      className="border-surface-700/40 hover:bg-surface-800/30 border-b transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-surface-100 text-sm font-medium">
                          {bp.member?.nickname ?? '—'}
                        </p>
                        <p className="text-surface-500 text-xs">
                          {bp.member?.email ?? bp.member_id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="text-surface-400 h-3.5 w-3.5 shrink-0" />
                          <span className="text-white">{bp.company_name}</span>
                        </div>
                      </td>
                      <td className="text-surface-300 px-4 py-3 font-mono text-xs">
                        {bp.business_number}
                      </td>
                      <td className="text-surface-200 px-4 py-3">
                        {bp.ceo_name}
                      </td>
                      <td className="text-surface-300 px-4 py-3 text-xs">
                        {bp.email}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={bp.member?.settlement_status ?? null}
                        />
                      </td>
                      <td className="text-surface-500 px-4 py-3 text-xs">
                        {new Date(bp.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            handlePromotionToggle(
                              bp.member_id,
                              Boolean(bp.member?.is_promotion)
                            )
                          }
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                            bp.member?.is_promotion
                              ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                              : 'bg-surface-700/50 text-surface-400 hover:bg-surface-700'
                          )}
                        >
                          {bp.member?.is_promotion ? '🎉 프로모션' : '일반'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <BusinessProfileActions
                          profileId={bp.id}
                          onDone={loadData}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── 지급 예정 금액 집계 ── */}
      <section>
        <h2 className="text-surface-400 mb-4 text-xs font-semibold tracking-wider uppercase">
          지급 예정 금액 집계
        </h2>
        <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border p-6">
          <p className="text-surface-400 mb-4 text-xs">
            status = ready 중 — 개인 전체 + 사업자(세금계산서 제출 완료)의 실지급 합계
          </p>

          <button
            type="button"
            onClick={handleRun}
            disabled={runLoading}
            className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {runLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarClock className="h-4 w-4" />
            )}
            {runLoading ? '조회 중...' : '정산 집계 실행'}
          </button>

          {runResult && (
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-xs font-medium text-emerald-400">지급 예정 합계</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {formatKRW(runResult.total)}
              </p>
              <p className="text-emerald-200/60 mt-2 text-xs">
                개인 <strong className="text-emerald-200">{runResult.individualCount}건</strong>
                {' + '}
                사업자(세금계산서 확인){' '}
                <strong className="text-emerald-200">{runResult.businessCount}건</strong>
              </p>
            </div>
          )}

          {runError && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs text-red-200/70">{runError}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 정산 목록 ── */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-surface-400 text-xs font-semibold tracking-wider uppercase">
            정산 목록
            {filteredSettlements.length > 0 && (
              <span className="text-surface-500 ml-2 normal-case">
                ({filteredSettlements.length}건)
              </span>
            )}
          </h2>
          {/* 기간 필터 */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(Number(e.target.value))}
            className="border-surface-700/60 bg-surface-800/80 focus:border-brand-400 rounded-xl border px-3 py-1.5 text-xs text-white outline-none"
          >
            <option value={0}>전체 기간</option>
            {PERIOD_OPTIONS.map((opt, i) => (
              <option key={opt.label} value={i + 1}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-brand-400 h-6 w-6 animate-spin" />
          </div>
        ) : filteredSettlements.length === 0 ? (
          <div className="border-surface-700/50 bg-surface-800/30 flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
            <Banknote className="text-surface-600 mb-3 h-8 w-8" />
            <p className="text-surface-400 text-sm">정산 내역이 없습니다.</p>
            <p className="text-surface-500 mt-1 text-xs">
              집계 실행 후 목록이 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="border-surface-700/50 overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-surface-700/50 bg-surface-800/50 border-b">
                    {[
                      '판매자',
                      '기간',
                      '유형',
                      '총 매출',
                      '수수료',
                      '원천징수',
                      '실지급',
                      '상태',
                      '지급일',
                      '세금계산서',
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
                  {filteredSettlements.map((s) => {
                    const st = STATUS_BADGE[s.status] ?? STATUS_BADGE.pending
                    const period = `${new Date(s.period_start).getFullYear()}년 ${new Date(s.period_start).getMonth() + 1}월`
                    return (
                      <tr
                        key={s.id}
                        className="border-surface-700/40 hover:bg-surface-800/30 border-b transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="text-surface-100 text-sm font-medium">
                            {s.member?.nickname ?? '—'}
                          </p>
                          <p className="text-surface-500 text-xs">
                            {s.member?.email ?? s.seller_id.slice(0, 8)}
                          </p>
                        </td>
                        <td className="text-surface-300 px-4 py-3 text-xs">
                          {period}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-xs font-medium',
                                s.seller_type === 'business'
                                  ? 'bg-blue-500/15 text-blue-400'
                                  : 'bg-surface-700/50 text-surface-300'
                              )}
                            >
                              {s.seller_type === 'business' ? '사업자' : '개인'}
                            </span>
                            {s.is_promotion && (
                              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                                🎉 프로모션
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white">
                          {formatKRW(s.gross_amount)}
                        </td>
                        <td className="text-surface-400 px-4 py-3">
                          −{formatKRW(s.fee_amount)}
                        </td>
                        <td className="text-surface-400 px-4 py-3">
                          {s.withholding_tax > 0
                            ? `−${formatKRW(s.withholding_tax)}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-emerald-400">
                          {formatKRW(s.net_amount)}
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
                        <td className="text-surface-500 px-4 py-3 text-xs">
                          {s.paid_at
                            ? new Date(s.paid_at).toLocaleDateString('ko-KR')
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {s.seller_type === 'business' ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleInvoiceToggle(s.id, s.invoice_submitted)
                              }
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                                s.invoice_submitted
                                  ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                  : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                              )}
                            >
                              {s.invoice_submitted ? '제출됨' : '미제출'}
                            </button>
                          ) : (
                            <span className="text-surface-600 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── 정책 요약 ── */}
      <section>
        <h2 className="text-surface-400 mb-4 text-xs font-semibold tracking-wider uppercase">
          정산 정책 요약
        </h2>
        <div className="border-surface-700/50 bg-surface-800/20 rounded-2xl border p-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: '개인 판매자 수수료', value: '20% (VAT 포함)' },
              { label: '사업자 판매자 수수료', value: '15% (VAT 별도)' },
              { label: '초기 프로모션 수수료', value: '5% (사업자 선착순 100명, VAT 별도)' },
              {
                label: '개인 원천징수',
                value: '3.3% (소득세 3% + 지방소득세 0.3%)',
              },
              {
                label: '개인 월 한도',
                value: '50만원 초과 시 사업자 전환 필요',
              },
              { label: '정산 주기', value: '매월 1일~말일 → 익월 10일 지급' },
              {
                label: '사업자 조건',
                value: '세금계산서 발행 확인 후 정산 진행',
              },
              {
                label: 'Cron 권장',
                value: '매월 1일 01:00 UTC — run_monthly_settlement()',
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-surface-500 text-xs">{label}</dt>
                <dd className="text-surface-100 mt-0.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
