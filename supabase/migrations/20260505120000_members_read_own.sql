-- 본인 members 행 조회 (is_admin, Navbar 등)
-- 기존 정책과 겹치면 Supabase에서 조정하세요.

drop policy if exists "members_select_own" on public.members;

create policy "members_select_own"
  on public.members
  for select
  to authenticated
  using (id = auth.uid());
