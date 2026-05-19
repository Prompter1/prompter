-- 정산 시스템: business_profiles, settlements 테이블 + run_monthly_settlement 함수

-- ── members 컬럼 추가 ─────────────────────────────────────────────────────────
alter table public.members
  add column if not exists seller_type text
    check (seller_type in ('individual', 'business')),
  add column if not exists settlement_status text not null default 'pending'
    check (settlement_status in ('pending', 'ready', 'paid', 'limited', 'business_required', 'deferred')),
  add column if not exists monthly_gross integer not null default 0;

-- ── business_profiles ────────────────────────────────────────────────────────
create table if not exists public.business_profiles (
  id               bigint generated always as identity primary key,
  member_id        uuid not null unique references auth.users (id) on delete cascade,
  business_number  text not null,
  company_name     text not null,
  ceo_name         text not null,
  business_address text not null default '',
  email            text not null,
  verified         boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

create policy "business_profiles_select_own"
  on public.business_profiles for select to authenticated
  using (member_id = auth.uid());

create policy "business_profiles_insert_own"
  on public.business_profiles for insert to authenticated
  with check (member_id = auth.uid());

create policy "business_profiles_update_own"
  on public.business_profiles for update to authenticated
  using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- ── settlements ───────────────────────────────────────────────────────────────
create table if not exists public.settlements (
  id              bigint generated always as identity primary key,
  seller_id       uuid not null references auth.users (id) on delete cascade,
  period_start    timestamptz not null,
  period_end      timestamptz not null,
  seller_type     text not null default 'individual',
  gross_amount    integer not null default 0,
  fee_amount      integer not null default 0,
  withholding_tax integer not null default 0,
  net_amount      integer not null default 0,
  status          text not null default 'pending'
    check (status in ('pending', 'ready', 'paid', 'limited', 'business_required', 'deferred')),
  paid_at         timestamptz,
  created_at      timestamptz not null default now(),
  unique (seller_id, period_start)
);

create index if not exists settlements_seller_id_idx
  on public.settlements (seller_id, period_start desc);

create index if not exists settlements_status_idx
  on public.settlements (status);

alter table public.settlements enable row level security;

-- 판매자 본인 조회
create policy "settlements_select_own"
  on public.settlements for select to authenticated
  using (seller_id = auth.uid());

-- 관리자 전체 조회
create policy "settlements_select_admin"
  on public.settlements for select to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

-- 관리자 수정 (paid_at, status 업데이트용)
create policy "settlements_update_admin"
  on public.settlements for update to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

-- business_profiles 관리자 전체 조회/수정
create policy "business_profiles_select_admin"
  on public.business_profiles for select to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

create policy "business_profiles_update_admin"
  on public.business_profiles for update to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

create policy "business_profiles_delete_admin"
  on public.business_profiles for delete to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

-- ── run_monthly_settlement ────────────────────────────────────────────────────
--
-- 동작:
--   1. target_year/month 기간의 DONE 트랜잭션을 판매자별로 집계
--   2. seller_type + business_profiles.verified 로 status / 원천징수 결정
--   3. settlements UPSERT (already paid 행 제외)
--   4. members.settlement_status, monthly_gross 갱신
--
-- 수수료 정책:
--   플랫폼 수수료 15% → transactions.fee 에 이미 기록된 값 사용
--   개인 판매자 원천징수 3.3% → after_fee(= seller_revenue 합계)에 적용
--   월 gross 500,000원 초과 개인 → business_required 보류
--
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
  v_gross        integer;
  v_fee          integer;
  v_after_fee    integer;
  v_withholding  integer;
  v_net          integer;
  v_status       text;
  v_count        integer := 0;
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

    -- 3. 판매자 유형 조회
    select m.seller_type
    into   v_seller_type
    from   public.members m
    where  m.id = rec.seller_id;

    -- 4. 사업자 인증 여부 조회 (없으면 false)
    select coalesce(bp.verified, false)
    into   v_verified
    from   public.business_profiles bp
    where  bp.member_id = rec.seller_id
    limit  1;

    v_verified := coalesce(v_verified, false);

    -- 5. status / withholding_tax 결정
    case v_seller_type
      when 'individual' then
        if v_gross > 500000 then
          -- 월 50만원 초과 → 사업자 등록 요구, 이번 달 정산 보류
          v_withholding := 0;
          v_status      := 'business_required';
        else
          v_withholding := floor(v_after_fee * 0.033)::integer;
          v_status      := 'ready';
        end if;

      when 'business' then
        v_withholding := 0;
        -- 검수 완료 사업자만 지급 가능
        v_status := case when v_verified then 'ready' else 'deferred' end;

      else
        -- seller_type 미설정
        v_withholding := 0;
        v_status      := 'pending';
    end case;

    v_net := v_after_fee - v_withholding;

    -- 6. settlements UPSERT (이미 지급 완료된 행은 변경하지 않음)
    insert into public.settlements (
      seller_id,       period_start,    period_end,
      seller_type,     gross_amount,    fee_amount,
      withholding_tax, net_amount,      status
    )
    values (
      rec.seller_id,                        v_period_start,  v_period_end,
      coalesce(v_seller_type, 'individual'), v_gross,         v_fee,
      v_withholding,                         v_net,           v_status
    )
    on conflict (seller_id, period_start) do update
      set seller_type     = excluded.seller_type,
          gross_amount    = excluded.gross_amount,
          fee_amount      = excluded.fee_amount,
          withholding_tax = excluded.withholding_tax,
          net_amount      = excluded.net_amount,
          status          = excluded.status
      where settlements.status <> 'paid';

    -- 7. members 요약 컬럼 갱신 (이미 지급 완료된 경우 제외)
    update public.members
    set    settlement_status = v_status,
           monthly_gross     = v_gross
    where  id = rec.seller_id
      and  settlement_status <> 'paid';

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object(
    'period',            format('%s-%s', v_year, lpad(v_month::text, 2, '0')),
    'processed_sellers', v_count
  );
end;
$$;

-- service role 전용 (authenticated / anon 직접 호출 차단)
revoke execute on function public.run_monthly_settlement(integer, integer)
  from public, authenticated, anon;

comment on function public.run_monthly_settlement is
  '월 정산 집계. API route에서 service role key로만 호출. target_year/month 생략 시 직전 달 집계.';
