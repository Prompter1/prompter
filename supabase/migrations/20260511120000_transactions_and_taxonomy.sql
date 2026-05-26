-- 결제/구매/정산 및 탐색 분류 확장
-- Supabase SQL Editor 또는 CLI로 적용하세요.

alter table public.members
  add column if not exists total_revenue integer not null default 0;

alter table public.prompt_posts
  add column if not exists ai_versions text[] not null default '{}',
  add column if not exists view_count integer not null default 0,
  add column if not exists sales_count integer not null default 0;

create table if not exists public.payment_orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id text not null unique,
  payment_key text not null unique,
  amount integer not null check (amount > 0),
  points integer not null check (points > 0),
  status text not null default 'DONE' check (status in ('READY', 'DONE', 'FAILED', 'CANCELED')),
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id bigint generated always as identity primary key,
  prompt_post_id bigint not null references public.prompt_posts (id) on delete cascade,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null check (amount > 0),
  fee integer not null default 0 check (fee >= 0),
  seller_revenue integer not null check (seller_revenue >= 0),
  status text not null default 'DONE' check (status in ('DONE', 'REFUNDED', 'CANCELED')),
  created_at timestamptz not null default now(),
  unique (prompt_post_id, buyer_id)
);

create index if not exists transactions_buyer_id_idx
  on public.transactions (buyer_id, created_at desc);

create index if not exists transactions_seller_id_idx
  on public.transactions (seller_id, created_at desc);

create index if not exists transactions_prompt_post_id_idx
  on public.transactions (prompt_post_id);

create index if not exists payment_orders_user_id_idx
  on public.payment_orders (user_id, created_at desc);

alter table public.payment_orders enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "payment_orders_select_own" on public.payment_orders;
create policy "payment_orders_select_own"
  on public.payment_orders
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "transactions_select_related" on public.transactions;
create policy "transactions_select_related"
  on public.transactions
  for select
  to authenticated
  using (buyer_id = auth.uid() or seller_id = auth.uid());

create or replace function public.increment_sales_count(post_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.prompt_posts
  set sales_count = coalesce(sales_count, 0) + 1
  where id = post_id;
$$;

create or replace function public.increment_view_count(post_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.prompt_posts
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
$$;

create or replace function public.purchase_prompt_with_credits(
  post_id bigint,
  platform_fee_rate numeric default 0.1
)
returns table (
  transaction_id bigint,
  remaining_points integer,
  seller_revenue integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  buyer uuid := auth.uid();
  prompt_row record;
  buyer_points integer;
  fee_amount integer;
  payout_amount integer;
  tx_id bigint;
begin
  if buyer is null then
    raise exception '로그인이 필요합니다.' using errcode = 'P0001';
  end if;

  select id, price, author_id
  into prompt_row
  from public.prompt_posts
  where id = post_id
  for update;

  if not found then
    raise exception '프롬프트를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;

  if prompt_row.price <= 0 then
    raise exception '무료 프롬프트입니다.' using errcode = 'P0001';
  end if;

  if prompt_row.author_id = buyer then
    raise exception '본인의 프롬프트는 구매할 수 없습니다.' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.transactions
    where prompt_post_id = post_id
      and buyer_id = buyer
  ) then
    raise exception '이미 구매한 프롬프트입니다.' using errcode = 'P0001';
  end if;

  select points
  into buyer_points
  from public.members
  where id = buyer
  for update;

  if not found then
    raise exception '사용자 정보를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;

  if buyer_points < prompt_row.price then
    raise exception '잔고가 부족합니다.' using errcode = 'P0001';
  end if;

  fee_amount := floor(prompt_row.price * platform_fee_rate);
  payout_amount := prompt_row.price - fee_amount;

  update public.members
  set points = points - prompt_row.price
  where id = buyer;

  update public.members
  set total_revenue = coalesce(total_revenue, 0) + payout_amount
  where id = prompt_row.author_id;

  insert into public.transactions (
    prompt_post_id,
    buyer_id,
    seller_id,
    amount,
    fee,
    seller_revenue
  )
  values (
    post_id,
    buyer,
    prompt_row.author_id,
    prompt_row.price,
    fee_amount,
    payout_amount
  )
  returning id into tx_id;

  update public.prompt_posts
  set sales_count = coalesce(sales_count, 0) + 1
  where id = post_id;

  return query
  select tx_id, buyer_points - prompt_row.price, payout_amount;
end;
$$;

create or replace function public.confirm_credit_charge(
  order_id text,
  payment_key text,
  charge_amount integer,
  charge_points integer,
  toss_payload jsonb default '{}'::jsonb
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  updated_points integer;
begin
  if current_user_id is null then
    raise exception '로그인이 필요합니다.' using errcode = 'P0001';
  end if;

  if charge_amount <= 0 or charge_points <= 0 then
    raise exception '충전 금액이 올바르지 않습니다.' using errcode = 'P0001';
  end if;

  insert into public.payment_orders (
    user_id,
    order_id,
    payment_key,
    amount,
    points,
    status,
    raw
  )
  values (
    current_user_id,
    order_id,
    payment_key,
    charge_amount,
    charge_points,
    'DONE',
    coalesce(toss_payload, '{}'::jsonb)
  );

  update public.members
  set points = coalesce(points, 0) + charge_points
  where id = current_user_id
  returning points into updated_points;

  if updated_points is null then
    raise exception '유저 정보를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;

  return updated_points;
exception
  when unique_violation then
    raise exception '이미 처리된 주문입니다.' using errcode = 'P0001';
end;
$$;

grant execute on function public.increment_sales_count(bigint) to authenticated;
grant execute on function public.increment_view_count(bigint) to authenticated;
grant execute on function public.purchase_prompt_with_credits(bigint, numeric) to authenticated;
grant execute on function public.confirm_credit_charge(text, text, integer, integer, jsonb) to authenticated;

comment on table public.transactions is '프롬프트 구매 및 판매자 정산 이력';
comment on table public.payment_orders is '토스페이먼츠 승인 이력';
comment on column public.prompt_posts.ai_versions is 'AI 도구 버전 태그. 예: Midjourney v6.1, GPT-4o';
