-- ─────────────────────────────────────────────────────────────────────────────
-- 1. members: 프로모션 사업자 플래그
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.members
  add column if not exists is_promotion boolean not null default false;

comment on column public.members.is_promotion is
  '프로모션 적용 사업자 (사업자 선착순 100명). true이면 수수료 5%, false이면 일반 15%';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. settlements: 세금계산서 발행 여부 + 프로모션 여부 기록
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.settlements
  add column if not exists invoice_submitted boolean not null default false,
  add column if not exists is_promotion       boolean not null default false;

comment on column public.settlements.invoice_submitted is
  '사업자 판매자가 플랫폼 앞으로 세금계산서를 발행했는지 여부 (관리자 확인 후 true)';
comment on column public.settlements.is_promotion is
  '해당 정산 시점의 프로모션 적용 여부 스냅샷';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. run_monthly_settlement 함수 업데이트
--    - 사업자 정산 시 is_promotion 스냅샷 저장
--    - invoice_submitted = false 로 초기화 (재집계 시 미제출 상태 유지)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.run_monthly_settlement(
  target_year  integer default null,
  target_month integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year         integer;
  v_month        integer;
  v_period_start timestamptz;
  v_period_end   timestamptz;
  v_prev         date;
  rec            record;
  v_seller_type  text;
  v_verified     boolean;
  v_is_promo     boolean;
  v_gross        integer;
  v_fee          integer;
  v_after_fee    integer;
  v_withholding  integer;
  v_net          integer;
  v_status       text;
  v_count        integer := 0;
  v_deferred     integer := 0;
begin
  -- 1. 대상 연/월 확정 (null → 직전 달)
  if target_year is null or target_month is null then
    v_prev  := date_trunc('month', now()) - interval '1 month';
    v_year  := extract(year  from v_prev)::integer;
    v_month := extract(month from v_prev)::integer;
  else
    v_year  := target_year;
    v_month := target_month;
  end if;

  v_period_start := make_timestamptz(v_year, v_month, 1, 0, 0, 0, 'UTC');
  v_period_end   := (v_period_start + interval '1 month') - interval '1 millisecond';

  -- 2. 기간 내 DONE 트랜잭션 판매자별 집계
  for rec in
    select
      t.seller_id,
      sum(t.amount)::integer         as gross,
      sum(t.fee)::integer            as fee_sum,
      sum(t.seller_revenue)::integer as after_fee
    from   public.transactions t
    where  t.status = 'DONE'
      and  t.created_at >= v_period_start
      and  t.created_at <= v_period_end
    group  by t.seller_id
  loop
    v_gross     := rec.gross;
    v_fee       := rec.fee_sum;
    v_after_fee := rec.after_fee;

    -- 3. 판매자 유형 + 프로모션 여부 조회
    select m.seller_type, coalesce(m.is_promotion, false)
    into   v_seller_type, v_is_promo
    from   public.members m
    where  m.id = rec.seller_id;

    -- 4. 사업자 인증 여부 조회
    select coalesce(bp.verified, false)
    into   v_verified
    from   public.business_profiles bp
    where  bp.member_id = rec.seller_id
    limit  1;

    v_verified := coalesce(v_verified, false);
    v_is_promo := coalesce(v_is_promo, false);

    -- 5. status / withholding_tax 결정
    case v_seller_type
      when 'individual' then
        if v_gross > 500000 then
          v_withholding := 0;
          v_status      := 'business_required';
        else
          v_withholding := floor(v_after_fee * 0.033)::integer;
          v_status      := 'ready';
        end if;

      when 'business' then
        v_withholding := 0;
        -- 미승인 사업자 → 이월, 승인 사업자 → 세금계산서 대기(ready)
        if v_verified then
          v_status   := 'ready';
          v_deferred := v_deferred; -- no change
        else
          v_status   := 'deferred';
          v_deferred := v_deferred + 1;
        end if;

      else
        v_withholding := 0;
        v_status      := 'pending';
    end case;

    v_net := v_after_fee - v_withholding;

    -- 6. settlements UPSERT (지급 완료 행 제외)
    --    사업자 재집계 시 invoice_submitted 초기화하지 않음 (이미 발행된 세금계산서 보호)
    insert into public.settlements (
      seller_id,       period_start,    period_end,
      seller_type,     gross_amount,    fee_amount,
      withholding_tax, net_amount,      status,
      is_promotion,    invoice_submitted
    )
    values (
      rec.seller_id,                        v_period_start,  v_period_end,
      coalesce(v_seller_type, 'individual'), v_gross,         v_fee,
      v_withholding,                         v_net,           v_status,
      v_is_promo,                            false
    )
    on conflict (seller_id, period_start) do update
      set seller_type     = excluded.seller_type,
          gross_amount    = excluded.gross_amount,
          fee_amount      = excluded.fee_amount,
          withholding_tax = excluded.withholding_tax,
          net_amount      = excluded.net_amount,
          status          = excluded.status,
          is_promotion    = excluded.is_promotion
          -- invoice_submitted 은 업데이트하지 않음 (이미 발행된 경우 보호)
      where settlements.status <> 'paid';

    -- 7. members 요약 갱신
    update public.members
    set    settlement_status = v_status,
           monthly_gross     = v_gross
    where  id = rec.seller_id
      and  settlement_status <> 'paid';

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object(
    'period',            format('%s-%s', v_year, lpad(v_month::text, 2, '0')),
    'processed_sellers', v_count,
    'deferred',          v_deferred
  );
end;
$$;

-- service role 전용 유지
revoke execute on function public.run_monthly_settlement(integer, integer)
  from public, authenticated, anon;

comment on function public.run_monthly_settlement is
  '월 정산 집계. API route에서 service role key로만 호출. target_year/month 생략 시 직전 달 집계. 프로모션 사업자(is_promotion=true)는 수수료 5% 적용(트랜잭션 시점에 이미 반영됨).';
