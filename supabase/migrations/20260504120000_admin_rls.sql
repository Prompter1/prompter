-- 관리자(is_admin)용 RLS 및 members 컬럼
-- Supabase SQL Editor에서 실행

alter table public.members
  add column if not exists is_admin boolean not null default false;

comment on column public.members.is_admin is 'true인 계정만 /admin 및 검수 API 사용';

-- ─── verification_requests: 관리자 전체 조회·수정 ───
create policy "verification_select_admin"
  on public.verification_requests
  for select
  to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

create policy "verification_update_admin"
  on public.verification_requests
  for update
  to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  )
  with check (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

-- ─── prompt_posts: 관리자 조회·수정 (검수 승인 시 is_verified) ───
create policy "prompt_posts_select_admin"
  on public.prompt_posts
  for select
  to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

create policy "prompt_posts_update_admin"
  on public.prompt_posts
  for update
  to authenticated
  using (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  )
  with check (
    exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );

-- ─── Storage: admin-storage 읽기 (증빙 검토) ───
-- 버킷 id가 다르면 bucket_id 조건을 수정하세요.
create policy "admin_storage_select_for_admins"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'admin-storage'
    and exists (
      select 1 from public.members m
      where m.id = auth.uid()
        and coalesce(m.is_admin, false) = true
    )
  );
