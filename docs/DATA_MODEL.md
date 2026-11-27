# Data Model (Proposed)

This is an implementation proposal, not a schema specified by the invention disclosure.

## Entities

### profiles
- `id` UUID, primary key and FK to auth user
- `display_name` text
- `role` enum: `student | teacher | admin`
- `grade_band` text nullable
- `created_at`, `updated_at`

### classes
- `id` UUID
- `teacher_id` FK profiles
- `name` text
- `join_code_hash` text (store a hash, not raw code)
- `created_at`

### class_members
- `class_id` FK classes
- `student_id` FK profiles
- `joined_at`
- unique `(class_id, student_id)`

### missions
- `id` text primary key
- `version` integer
- `title`, `subject`, `grade_band`, `difficulty`
- `briefing` JSONB
- `learning_objectives` JSONB
- `experiment_model_id` text
- `parameter_schema` JSONB
- `rubric` JSONB
- `hints` JSONB
- `reward_config` JSONB
- `is_published` boolean
- `created_at`, `updated_at`

### mission_assignments
- `id` UUID
- `class_id` FK classes
- `mission_id` FK missions
- `assigned_by` FK profiles
- `due_at` timestamp nullable
- `created_at`

### mission_attempts
- `id` UUID
- `student_id` FK profiles
- `mission_id` FK missions
- `mission_version` integer
- `status` enum: `in_progress | retry | completed`
- `started_at`, `completed_at`
- `score` numeric nullable
- `xp_awarded` integer default 0
- `hints_used` integer default 0

### experiment_runs
- `id` UUID
- `attempt_id` FK mission_attempts
- `run_number` integer
- `parameters` JSONB
- `observations` JSONB
- `model_version` text
- `created_at`

### hypotheses
- `id` UUID
- `attempt_id` FK mission_attempts
- `run_id` FK experiment_runs nullable
- `prediction` text
- `justification` text
- `conclusion` text nullable
- `created_at`

### evaluations
- `id` UUID
- `attempt_id` FK mission_attempts
- `hypothesis_id` FK hypotheses
- `rubric_version` text
- `criterion_scores` JSONB
- `feedback` JSONB
- `total_score` numeric
- `created_at`

### badges
- `id` text primary key
- `name`, `description`, `icon_key`
- `criteria` JSONB

### student_badges
- `student_id` FK profiles
- `badge_id` FK badges
- `awarded_at`
- unique `(student_id, badge_id)`

### xp_ledger
- `id` UUID
- `student_id` FK profiles
- `attempt_id` FK mission_attempts nullable
- `reason` text
- `amount` integer
- `created_at`
- immutable ledger; server-only insert

## Security and RLS
- Students can read/update only their own profile (with restricted editable fields).
- Students can read published missions and their own attempts/runs/hypotheses/evaluations.
- Students can read their own XP ledger and badges.
- Teachers can read student records only for members of classes they own.
- Teachers can manage only their own classes and assignments.
- Mission publishing and reward grants are server/admin-only.
- Do not expose join-code hashes.
- Add indexes for class membership, mission attempts by student, and runs by attempt.
- Use database constraints for uniqueness and valid status transitions where practical.

## Data minimization
Use display names or pseudonyms in classroom views. Do not collect birth dates, home addresses, phone numbers or unnecessary sensitive information.

## Current status — 2026-11-27
- This schema is a proposal, not an implemented database. Demo mode persists a smaller typed shape defined in `src/types/domain.ts` via `localStorage` key `lablegends.demo.v1`.
- [x] Typed demo entities for student, attempts, runs, evaluations, XP and badges.
- [ ] Postgres tables, migrations, RLS policies, join-code hashing, server-side XP ledger and immutable evaluation snapshots are not implemented yet.
