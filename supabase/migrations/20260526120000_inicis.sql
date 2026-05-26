-- KG이니시스 결제 요청 임시 저장 테이블
-- sign 생성 시 buyer_id·post_id·amount 를 서버에 저장, confirm 콜백에서 조회
create table if not exists public.inicis_pending_orders (
  id         bigint generated always as identity primary key,
  order_id   text not null unique,
  buyer_id   uuid not null references auth.users(id) on delete cascade,
  post_id    bigint not null,
  amount     integer not null,
  status     text not null default 'pending'
             check (status in ('pending', 'confirmed', 'failed')),
  tid        text,
  created_at timestamptz not null default now()
);

alter table public.inicis_pending_orders enable row level security;
-- 사용자 직접 접근 없음 (서비스 롤 전용)

-- ── 서비스 롤 전용 구매 처리 함수 ────────────────────────────────────────────
-- P_NEXT_URL 서버 콜백에서 서비스 롤 Supabase 클라이언트로 호출
create or replace function public.purchase_prompt_by_admin(
  p_buyer_id uuid,
  p_post_id  bigint,
  p_order_id text,
  p_tid      text,
  p_amount   integer,
  p_fee_rate numeric default 0.2
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  prompt_row    record;
  fee_amount    integer;
  payout_amount integer;
  tx_id         bigint;
begin
  select id, price, author_id
  into prompt_row
  from public.prompt_posts
  where id = p_post_id
  for update;

  if not found then
    raise exception '프롬프트를 찾을 수 없습니다.' using errcode = 'P0001';
  end if;

  if prompt_row.price != p_amount then
    raise exception '결제 금액이 일치하지 않습니다.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.transactions
    where prompt_post_id = p_post_id and buyer_id = p_buyer_id
  ) then
    raise exception '이미 구매한 프롬프트입니다.' using errcode = 'P0001';
  end if;

  fee_amount    := floor(p_amount * p_fee_rate);
  payout_amount := p_amount - fee_amount;

  update public.members
  set total_revenue = coalesce(total_revenue, 0) + payout_amount
  where id = prompt_row.author_id;

  insert into public.transactions (
    prompt_post_id, buyer_id, seller_id, amount, fee, seller_revenue
  ) values (
    p_post_id, p_buyer_id, prompt_row.author_id,
    p_amount, fee_amount, payout_amount
  ) returning id into tx_id;

  update public.prompt_posts
  set sales_count = coalesce(sales_count, 0) + 1
  where id = p_post_id;

  return tx_id;
end;
$$;

-- 일반 인증 사용자는 직접 호출 불가 (서비스 롤만 호출 가능)
revoke execute
  on function public.purchase_prompt_by_admin(uuid, bigint, text, text, integer, numeric)
  from anon, authenticated;
