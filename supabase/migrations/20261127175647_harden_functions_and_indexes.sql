-- Harden helper functions and policies, and add covering indexes flagged by advisors.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_xp_ledger_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  -- Allow cascades from profile deletion, but never client or direct mutation.
  if tg_op = 'DELETE' and pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception 'xp_ledger is append-only';
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

revoke all on function public.current_user_role() from public, anon;
grant execute on function public.current_user_role() to authenticated;

revoke all on function public.is_class_teacher(uuid) from public, anon;
grant execute on function public.is_class_teacher(uuid) to authenticated;

revoke all on function public.is_class_member(uuid) from public, anon;
grant execute on function public.is_class_member(uuid) to authenticated;

revoke all on function public.can_access_student(uuid) from public, anon;
grant execute on function public.can_access_student(uuid) to authenticated;

revoke all on function public.mission_is_published(text, integer) from public, anon;
grant execute on function public.mission_is_published(text, integer) to authenticated;

revoke all on function public.owns_attempt(uuid) from public, anon;
grant execute on function public.owns_attempt(uuid) to authenticated;

revoke all on function public.can_access_attempt(uuid) from public, anon;
grant execute on function public.can_access_attempt(uuid) to authenticated;

-- Anonymous visitors only need published missions. Teacher visibility is authenticated-only.
drop policy if exists "missions_select_published_or_teacher" on public.missions;
drop policy if exists "missions_select_published" on public.missions;
create policy "missions_select_published" on public.missions
  for select to anon
  using (is_published);
create policy "missions_select_published_or_teacher" on public.missions
  for select to authenticated
  using (is_published or public.current_user_role() = 'teacher');

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "classes_insert_teacher" on public.classes;
create policy "classes_insert_teacher" on public.classes
  for insert to authenticated
  with check (
    teacher_id = (select auth.uid())
    and public.current_user_role() = 'teacher'
  );

drop policy if exists "classes_update_teacher" on public.classes;
create policy "classes_update_teacher" on public.classes
  for update to authenticated
  using (teacher_id = (select auth.uid()))
  with check (teacher_id = (select auth.uid()));

drop policy if exists "classes_delete_teacher" on public.classes;
create policy "classes_delete_teacher" on public.classes
  for delete to authenticated
  using (teacher_id = (select auth.uid()));

drop policy if exists "class_members_select_member_or_teacher" on public.class_members;
create policy "class_members_select_member_or_teacher" on public.class_members
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_class_teacher(class_id)
  );

drop policy if exists "class_members_delete_self_or_teacher" on public.class_members;
create policy "class_members_delete_self_or_teacher" on public.class_members
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_class_teacher(class_id)
  );

drop policy if exists "mission_assignments_insert_teacher" on public.mission_assignments;
create policy "mission_assignments_insert_teacher" on public.mission_assignments
  for insert to authenticated
  with check (
    public.is_class_teacher(class_id)
    and assigned_by = (select auth.uid())
  );

drop policy if exists "mission_attempts_insert_own" on public.mission_attempts;
create policy "mission_attempts_insert_own" on public.mission_attempts
  for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and public.mission_is_published(mission_id, mission_version)
  );

drop policy if exists "mission_attempts_update_own" on public.mission_attempts;
create policy "mission_attempts_update_own" on public.mission_attempts
  for update to authenticated
  using (student_id = (select auth.uid()))
  with check (
    student_id = (select auth.uid())
    and public.mission_is_published(mission_id, mission_version)
  );

drop policy if exists "mission_attempts_delete_own" on public.mission_attempts;
create policy "mission_attempts_delete_own" on public.mission_attempts
  for delete to authenticated
  using (student_id = (select auth.uid()));

create index if not exists mission_assignments_assigned_by_idx
  on public.mission_assignments (assigned_by);
create index if not exists mission_assignments_mission_idx
  on public.mission_assignments (mission_id, mission_version);
create index if not exists mission_attempts_class_idx
  on public.mission_attempts (class_id);
create index if not exists student_badges_attempt_idx
  on public.student_badges (attempt_id);
create index if not exists student_badges_badge_idx
  on public.student_badges (badge_id);
