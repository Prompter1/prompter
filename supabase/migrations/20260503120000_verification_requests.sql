-- 검수 요청 테이블 (유료 판매 증빙)
-- Supabase SQL Editor에서 실행하거나 CLI로 마이그레이션 적용

create table if not exists public.verification_requests (
  id bigint generated always as identity primary key,
  prompt_post_id bigint not null references public.prompt_posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  evidence_paths text[] not null default '{}',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists verification_requests_prompt_post_id_idx
  on public.verification_requests (prompt_post_id);

create index if not exists verification_requests_author_id_idx
  on public.verification_requests (author_id);

create index if not exists verification_requests_status_idx
  on public.verification_requests (status);

alter table public.verification_requests enable row level security;

-- 본인이 올린 검수 요청만 조회
create policy "verification_select_own"
  on public.verification_requests
  for select
  to authenticated
  using (author_id = auth.uid());

-- 본인 프롬프트에 대해서만 검수 요청 생성 (prompt_posts.author_id 와 일치)
create policy "verification_insert_own_prompt"
  on public.verification_requests
  for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.prompt_posts p
      where p.id = prompt_post_id
        and p.author_id = auth.uid()
    )
  );

-- 일반 사용자는 수정/삭제 없음 (관리자는 service role 또는 별도 정책)

comment on table public.verification_requests is '유료 프롬프트 판매 증빙 검수 큐';

-- ─── Storage: admin-storage (또는 NEXT_PUBLIC_SUPABASE_ADMIN_EVIDENCE_BUCKET) ───
-- 버킷이 private인 경우 예시 정책 (경로: {auth.uid()}/verification/...)
-- [ ] Storage → Policies에서 버킷 이름에 맞게 적용
--
-- insert (authenticated):
--   bucket_id = 'admin-storage'
--   AND (storage.foldername(name))[1] = auth.uid()::text
--
-- select (authenticated, 본인만):
--   동일 조건
--
-- 관리자 콘솔 다운로드는 service role 키 사용
