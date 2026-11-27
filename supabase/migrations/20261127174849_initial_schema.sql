-- LabLegends initial schema.
-- Server-authoritative learning records with RLS. No real student data is seeded.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'teacher');
  end if;
  if not exists (select 1 from pg_type where typname = 'grade_band') then
    create type public.grade_band as enum ('6-8', '9-10', '11-12', 'undergrad');
  end if;
  if not exists (select 1 from pg_type where typname = 'subject') then
    create type public.subject as enum ('physics', 'chemistry', 'biology');
  end if;
  if not exists (select 1 from pg_type where typname = 'difficulty') then
    create type public.difficulty as enum ('starter', 'core', 'challenge');
  end if;
  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type public.review_status as enum ('reviewed', 'pending-subject-review');
  end if;
  if not exists (select 1 from pg_type where typname = 'attempt_status') then
    create type public.attempt_status as enum ('in_progress', 'retry', 'completed');
  end if;
  if not exists (select 1 from pg_type where typname = 'badge_icon') then
    create type public.badge_icon as enum ('eye', 'sliders', 'search', 'flask', 'trophy', 'spark');
  end if;
  if not exists (select 1 from pg_type where typname = 'badge_tone') then
    create type public.badge_tone as enum ('primary', 'accent', 'gold', 'positive');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  display_name text not null check (char_length(display_name) between 1 and 80),
  grade_band public.grade_band not null default '9-10',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  join_code text not null unique check (join_code ~ '^[A-Z0-9]{6,12}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.user_role not null default 'student',
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

create table if not exists public.missions (
  id text not null,
  version integer not null default 1 check (version > 0),
  title text not null,
  codename text not null,
  subject public.subject not null,
  grade_band public.grade_band not null,
  difficulty public.difficulty not null,
  estimated_minutes integer not null check (estimated_minutes > 0),
  base_xp integer not null check (base_xp >= 0),
  hook text not null,
  definition jsonb not null,
  review_status public.review_status not null default 'pending-subject-review',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id, version)
);

create table if not exists public.mission_assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  mission_id text not null,
  mission_version integer not null,
  assigned_by uuid not null references public.profiles (id) on delete cascade,
  due_at timestamptz,
  instructions text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (class_id, mission_id, mission_version),
  foreign key (mission_id, mission_version) references public.missions (id, version) on delete cascade
);

create table if not exists public.mission_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid references public.classes (id) on delete set null,
  mission_id text not null,
  mission_version integer not null,
  status public.attempt_status not null default 'in_progress',
  prediction text not null default '',
  justification text not null default '',
  conclusion text not null default '',
  hints_used integer not null default 0 check (hints_used >= 0),
  revealed_hint_ids text[] not null default '{}',
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (mission_id, mission_version) references public.missions (id, version) on delete restrict
);

create table if not exists public.experiment_runs (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mission_attempts (id) on delete cascade,
  run_number integer not null check (run_number > 0),
  parameters jsonb not null,
  observations jsonb not null,
  warnings text[] not null default '{}',
  model_version text,
  created_at timestamptz not null default now(),
  unique (attempt_id, run_number)
);

create table if not exists public.hypotheses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mission_attempts (id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  prediction text not null,
  justification text not null,
  created_at timestamptz not null default now(),
  unique (attempt_id, revision)
);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mission_attempts (id) on delete cascade,
  criteria jsonb not null,
  total integer not null check (total between 0 and 100),
  mastery_threshold integer not null check (mastery_threshold between 0 and 100),
  passed boolean not null,
  headline text not null,
  summary text not null,
  strengths text[] not null default '{}',
  next_steps text[] not null default '{}',
  rubric_version text not null,
  created_at timestamptz not null default now(),
  unique (attempt_id)
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon public.badge_icon not null,
  tone public.badge_tone not null,
  created_at timestamptz not null default now()
);

create table if not exists public.student_badges (
  student_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  attempt_id uuid references public.mission_attempts (id) on delete set null,
  awarded_at timestamptz not null default now(),
  primary key (student_id, badge_id)
);

create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  attempt_id uuid references public.mission_attempts (id) on delete set null,
  amount integer not null check (amount > 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists classes_teacher_idx on public.classes (teacher_id);
create index if not exists class_members_user_idx on public.class_members (user_id);
create index if not exists mission_assignments_class_idx on public.mission_assignments (class_id);
create index if not exists mission_attempts_student_idx on public.mission_attempts (student_id);
create index if not exists mission_attempts_mission_idx on public.mission_attempts (mission_id, mission_version);
create index if not exists experiment_runs_attempt_idx on public.experiment_runs (attempt_id);
create index if not exists hypotheses_attempt_idx on public.hypotheses (attempt_id);
create index if not exists evaluations_attempt_idx on public.evaluations (attempt_id);
create index if not exists student_badges_student_idx on public.student_badges (student_id);
create index if not exists xp_ledger_student_idx on public.xp_ledger (student_id);
create unique index if not exists mission_attempts_one_active_idx
  on public.mission_attempts (student_id, mission_id, mission_version)
  where status = 'in_progress';
create unique index if not exists xp_ledger_attempt_once_idx
  on public.xp_ledger (attempt_id)
  where attempt_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_class_teacher(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = target_class_id
      and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = target_class_id
      and c.teacher_id = auth.uid()
  ) or exists (
    select 1
    from public.class_members m
    where m.class_id = target_class_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.can_access_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select target_student_id = auth.uid()
  or exists (
    select 1
    from public.class_members m
    join public.classes c on c.id = m.class_id
    where m.user_id = target_student_id
      and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.mission_is_published(target_id text, target_version integer)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.missions m
    where m.id = target_id
      and m.version = target_version
      and m.is_published
  );
$$;

create or replace function public.owns_attempt(target_attempt_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.mission_attempts a
    where a.id = target_attempt_id
      and a.student_id = auth.uid()
  );
$$;

create or replace function public.can_access_attempt(target_attempt_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.mission_attempts a
    where a.id = target_attempt_id
      and public.can_access_student(a.student_id)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  metadata_role text := new.raw_user_meta_data ->> 'role';
  metadata_grade text := new.raw_user_meta_data ->> 'grade_band';
  metadata_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
  fallback_name text := nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), '');
begin
  insert into public.profiles (id, role, display_name, grade_band)
  values (
    new.id,
    case when metadata_role in ('student', 'teacher') then metadata_role::public.user_role else 'student'::public.user_role end,
    left(coalesce(metadata_name, fallback_name, 'Learner'), 80),
    case when metadata_grade in ('6-8', '9-10', '11-12', 'undergrad') then metadata_grade::public.grade_band else '9-10'::public.grade_band end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.prevent_xp_ledger_mutation()
returns trigger
language plpgsql
as $$
begin
  -- Allow cascades from profile deletion, but never client or direct mutation.
  if tg_op = 'DELETE' and pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception 'xp_ledger is append-only';
end;
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.missions enable row level security;
alter table public.mission_assignments enable row level security;
alter table public.mission_attempts enable row level security;
alter table public.experiment_runs enable row level security;
alter table public.hypotheses enable row level security;
alter table public.evaluations enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.xp_ledger enable row level security;

drop policy if exists "profiles_select_accessible" on public.profiles;
create policy "profiles_select_accessible" on public.profiles
  for select to authenticated
  using (public.can_access_student(id));

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "classes_select_member" on public.classes;
create policy "classes_select_member" on public.classes
  for select to authenticated
  using (public.is_class_member(id));

drop policy if exists "classes_insert_teacher" on public.classes;
create policy "classes_insert_teacher" on public.classes
  for insert to authenticated
  with check (teacher_id = auth.uid() and public.current_user_role() = 'teacher');

drop policy if exists "classes_update_teacher" on public.classes;
create policy "classes_update_teacher" on public.classes
  for update to authenticated
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

drop policy if exists "classes_delete_teacher" on public.classes;
create policy "classes_delete_teacher" on public.classes
  for delete to authenticated
  using (teacher_id = auth.uid());

drop policy if exists "class_members_select_member_or_teacher" on public.class_members;
create policy "class_members_select_member_or_teacher" on public.class_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_class_teacher(class_id));

drop policy if exists "class_members_insert_teacher" on public.class_members;
create policy "class_members_insert_teacher" on public.class_members
  for insert to authenticated
  with check (public.is_class_teacher(class_id));

drop policy if exists "class_members_update_teacher" on public.class_members;
create policy "class_members_update_teacher" on public.class_members
  for update to authenticated
  using (public.is_class_teacher(class_id))
  with check (public.is_class_teacher(class_id));

drop policy if exists "class_members_delete_self_or_teacher" on public.class_members;
create policy "class_members_delete_self_or_teacher" on public.class_members
  for delete to authenticated
  using (user_id = auth.uid() or public.is_class_teacher(class_id));

drop policy if exists "missions_select_published_or_teacher" on public.missions;
create policy "missions_select_published_or_teacher" on public.missions
  for select to anon, authenticated
  using (is_published or public.current_user_role() = 'teacher');

drop policy if exists "mission_assignments_select_member" on public.mission_assignments;
create policy "mission_assignments_select_member" on public.mission_assignments
  for select to authenticated
  using (public.is_class_member(class_id));

drop policy if exists "mission_assignments_insert_teacher" on public.mission_assignments;
create policy "mission_assignments_insert_teacher" on public.mission_assignments
  for insert to authenticated
  with check (public.is_class_teacher(class_id) and assigned_by = auth.uid());

drop policy if exists "mission_assignments_update_teacher" on public.mission_assignments;
create policy "mission_assignments_update_teacher" on public.mission_assignments
  for update to authenticated
  using (public.is_class_teacher(class_id))
  with check (public.is_class_teacher(class_id));

drop policy if exists "mission_assignments_delete_teacher" on public.mission_assignments;
create policy "mission_assignments_delete_teacher" on public.mission_assignments
  for delete to authenticated
  using (public.is_class_teacher(class_id));

drop policy if exists "mission_attempts_select_accessible" on public.mission_attempts;
create policy "mission_attempts_select_accessible" on public.mission_attempts
  for select to authenticated
  using (public.can_access_student(student_id));

drop policy if exists "mission_attempts_insert_own" on public.mission_attempts;
create policy "mission_attempts_insert_own" on public.mission_attempts
  for insert to authenticated
  with check (
    student_id = auth.uid()
    and public.mission_is_published(mission_id, mission_version)
  );

drop policy if exists "mission_attempts_update_own" on public.mission_attempts;
create policy "mission_attempts_update_own" on public.mission_attempts
  for update to authenticated
  using (student_id = auth.uid())
  with check (
    student_id = auth.uid()
    and public.mission_is_published(mission_id, mission_version)
  );

drop policy if exists "mission_attempts_delete_own" on public.mission_attempts;
create policy "mission_attempts_delete_own" on public.mission_attempts
  for delete to authenticated
  using (student_id = auth.uid());

drop policy if exists "experiment_runs_select_accessible" on public.experiment_runs;
create policy "experiment_runs_select_accessible" on public.experiment_runs
  for select to authenticated
  using (public.can_access_attempt(attempt_id));

drop policy if exists "experiment_runs_insert_own" on public.experiment_runs;
create policy "experiment_runs_insert_own" on public.experiment_runs
  for insert to authenticated
  with check (public.owns_attempt(attempt_id));

drop policy if exists "experiment_runs_update_own" on public.experiment_runs;
create policy "experiment_runs_update_own" on public.experiment_runs
  for update to authenticated
  using (public.owns_attempt(attempt_id))
  with check (public.owns_attempt(attempt_id));

drop policy if exists "experiment_runs_delete_own" on public.experiment_runs;
create policy "experiment_runs_delete_own" on public.experiment_runs
  for delete to authenticated
  using (public.owns_attempt(attempt_id));

drop policy if exists "hypotheses_select_accessible" on public.hypotheses;
create policy "hypotheses_select_accessible" on public.hypotheses
  for select to authenticated
  using (public.can_access_attempt(attempt_id));

drop policy if exists "hypotheses_insert_own" on public.hypotheses;
create policy "hypotheses_insert_own" on public.hypotheses
  for insert to authenticated
  with check (public.owns_attempt(attempt_id));

drop policy if exists "hypotheses_update_own" on public.hypotheses;
create policy "hypotheses_update_own" on public.hypotheses
  for update to authenticated
  using (public.owns_attempt(attempt_id))
  with check (public.owns_attempt(attempt_id));

drop policy if exists "hypotheses_delete_own" on public.hypotheses;
create policy "hypotheses_delete_own" on public.hypotheses
  for delete to authenticated
  using (public.owns_attempt(attempt_id));

drop policy if exists "evaluations_select_accessible" on public.evaluations;
create policy "evaluations_select_accessible" on public.evaluations
  for select to authenticated
  using (public.can_access_attempt(attempt_id));

drop policy if exists "badges_select_all" on public.badges;
create policy "badges_select_all" on public.badges
  for select to anon, authenticated
  using (true);

drop policy if exists "student_badges_select_accessible" on public.student_badges;
create policy "student_badges_select_accessible" on public.student_badges
  for select to authenticated
  using (public.can_access_student(student_id));

drop policy if exists "xp_ledger_select_accessible" on public.xp_ledger;
create policy "xp_ledger_select_accessible" on public.xp_ledger
  for select to authenticated
  using (public.can_access_student(student_id));

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists classes_set_updated_at on public.classes;
create trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

drop trigger if exists missions_set_updated_at on public.missions;
create trigger missions_set_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

drop trigger if exists mission_attempts_set_updated_at on public.mission_attempts;
create trigger mission_attempts_set_updated_at
  before update on public.mission_attempts
  for each row execute function public.set_updated_at();

drop trigger if exists xp_ledger_prevent_mutation on public.xp_ledger;
create trigger xp_ledger_prevent_mutation
  before update or delete on public.xp_ledger
  for each row execute function public.prevent_xp_ledger_mutation();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on public.missions, public.badges from anon, authenticated;
revoke all on public.profiles, public.classes, public.class_members,
  public.mission_assignments, public.mission_attempts, public.experiment_runs,
  public.hypotheses, public.evaluations, public.student_badges, public.xp_ledger
  from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.missions, public.badges to anon, authenticated;
grant select on public.profiles, public.classes, public.class_members,
  public.mission_assignments, public.mission_attempts, public.experiment_runs,
  public.hypotheses, public.evaluations, public.student_badges, public.xp_ledger
  to authenticated;

grant insert (id, display_name, grade_band) on public.profiles to authenticated;
grant update (display_name, grade_band, last_seen_at) on public.profiles to authenticated;

grant insert (teacher_id, name, join_code) on public.classes to authenticated;
grant update (name, join_code, archived_at) on public.classes to authenticated;
grant delete on public.classes to authenticated;

grant insert (class_id, user_id, role) on public.class_members to authenticated;
grant update (role) on public.class_members to authenticated;
grant delete on public.class_members to authenticated;

grant insert (class_id, mission_id, mission_version, assigned_by, due_at, instructions, is_active)
  on public.mission_assignments to authenticated;
grant update (due_at, instructions, is_active) on public.mission_assignments to authenticated;
grant delete on public.mission_assignments to authenticated;

grant insert (student_id, class_id, mission_id, mission_version)
  on public.mission_attempts to authenticated;
grant update (prediction, justification, conclusion, hints_used, revealed_hint_ids, status, completed_at)
  on public.mission_attempts to authenticated;
grant delete on public.mission_attempts to authenticated;

grant insert (attempt_id, run_number, parameters, observations, warnings, model_version)
  on public.experiment_runs to authenticated;
grant update (parameters, observations, warnings, model_version)
  on public.experiment_runs to authenticated;
grant delete on public.experiment_runs to authenticated;

grant insert (attempt_id, revision, prediction, justification)
  on public.hypotheses to authenticated;
grant update (prediction, justification) on public.hypotheses to authenticated;
grant delete on public.hypotheses to authenticated;

comment on table public.xp_ledger is 'Append-only XP ledger. Clients may read their own rows; only trusted server code should append.';
comment on table public.missions is 'Published mission catalog. definition stores the full mission payload used by the app.';
