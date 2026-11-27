# Data Model

This is the implemented Supabase/Postgres foundation, not a schema specified by the invention disclosure. It supports the deterministic learning loop while the UI remains in demo mode.

## Implemented tables

### profiles
- `id` UUID, primary key, FK to `auth.users`
- `role` enum: `student | teacher`
- `display_name` text, 1–80 characters
- `grade_band` enum: `6-8 | 9-10 | 11-12 | undergrad`
- `created_at`, `updated_at`, `last_seen_at`
- A trigger on `auth.users` creates the matching profile on signup.

### classes
- `id` UUID
- `teacher_id` FK `profiles`
- `name` text
- `join_code` text, unique, 6–12 uppercase alphanumeric characters
- `created_at`, `updated_at`, `archived_at`
- Join-code hashing and a secure join RPC are still pending.

### class_members
- `class_id` FK `classes`
- `user_id` FK `profiles`
- `role` enum: `student | teacher`
- `joined_at`
- primary key `(class_id, user_id)`

### missions
- composite primary key `(id, version)`
- `title`, `codename`, `subject`, `grade_band`, `difficulty`
- `estimated_minutes`, `base_xp`, `hook`
- `definition` JSONB containing the full mission payload used by the app
- `review_status`: `reviewed | pending-subject-review`
- `is_published`, `created_at`, `updated_at`
- The three current missions and five badges are seeded from typed app data.

### mission_assignments
- `id` UUID
- `class_id` FK `classes`
- `(mission_id, mission_version)` FK `missions`
- `assigned_by` FK `profiles`
- `due_at` nullable, `instructions` nullable, `is_active`
- unique `(class_id, mission_id, mission_version)`

### mission_attempts
- `id` UUID
- `student_id` FK `profiles`
- `class_id` FK `classes` nullable
- `(mission_id, mission_version)` FK `missions`
- `status`: `in_progress | retry | completed`
- current `prediction`, `justification`, `conclusion`
- `hints_used`, `revealed_hint_ids`, `xp_awarded`
- `started_at`, `completed_at`, `created_at`, `updated_at`
- one active attempt per student/mission/version

### experiment_runs
- `id` UUID
- `attempt_id` FK `mission_attempts`
- `run_number`, unique per attempt
- `parameters` JSONB, `observations` JSONB, `warnings` text[]
- `model_version`, `created_at`

### hypotheses
- `id` UUID
- `attempt_id` FK `mission_attempts`
- `revision`, unique per attempt
- `prediction`, `justification`, `created_at`

### evaluations
- `id` UUID
- `attempt_id` FK `mission_attempts`, unique
- `criteria` JSONB, `total`, `mastery_threshold`, `passed`
- `headline`, `summary`, `strengths`, `next_steps`
- `rubric_version`, `created_at`
- No client write policy; evaluations are intended to be inserted by trusted server code.

### badges
- `id` text primary key
- `name`, `description`, `icon`, `tone`, `created_at`

### student_badges
- `student_id` FK `profiles`
- `badge_id` FK `badges`
- `attempt_id` FK `mission_attempts` nullable
- `awarded_at`
- primary key `(student_id, badge_id)`

### xp_ledger
- `id` UUID
- `student_id` FK `profiles`
- `attempt_id` FK `mission_attempts` nullable
- `amount`, `reason`, `created_at`
- append-only: clients have read-only access; updates/deletes are blocked by a trigger
- unique attempt award prevents duplicate grants

## Security and RLS

- RLS is enabled on every public table.
- Students can read/update only their own profile; role escalation is blocked by column-level grants.
- Students can read published missions and badges, and their own attempts, runs, hypotheses, evaluations, badges and XP ledger.
- Teachers can read student records only for classes they own.
- Teachers can manage only their own classes and assignments.
- Mission publishing, evaluation inserts, badge awards and XP grants are trusted-server operations; clients have no write grant.
- Sensitive attempt fields such as `student_id`, `mission_id`, `mission_version`, `class_id` and `xp_awarded` are not client-updatable.
- Published catalog rows are readable anonymously; private learning records are not.

## Data minimization

Use display names or pseudonyms in classroom views. Do not collect birth dates, home addresses, phone numbers or unnecessary sensitive information. Seeds contain catalog content only; no student or personal data is seeded.

## Current status — 2026-11-27

- [x] Postgres tables, enums, indexes and migration added.
- [x] RLS policies and column-level write restrictions added.
- [x] Published mission and badge catalog seeded.
- [x] Generated TypeScript database types added.
- [x] Supabase browser/server clients and Next.js `proxy.ts` session refresh added.
- [ ] Auth screens and session-aware routing are not wired to Supabase yet.
- [ ] Server actions/RPCs for attempt submission, deterministic evaluation and XP grants are not implemented yet.
- [ ] Join-code hashing and a secure class-join RPC are not implemented yet.
- [ ] The UI still persists demo state in `localStorage` under `lablegends.demo.v1`.
