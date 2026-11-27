# Technical Architecture

## 1. High-level design

```text
Browser / PWA
  ├── Next.js UI (student, teacher)
  ├── Mission player
  │    ├── Mission state machine
   │    ├── SVG 2D renderer (Phaser optional future)
   │    └── WebGL capability check (Three.js optional future)
  └── Domain client
       ├── Experiment model functions
       ├── Hypothesis evaluator
       └── Reward calculator
             |
             v
       Next.js server actions / route handlers
             |
       Supabase Auth + Postgres + Storage
             |
       Analytics queries / CSV export
```

## 2. Architectural rules
- Simulation math is pure TypeScript and has no dependency on React, Phaser or Three.js.
- Renderer consumes simulation state and emits user actions; it does not own scientific calculations.
- Mission definitions are data-driven and versioned.
- Mission progression is a validated state machine, not a collection of unrelated booleans.
- Server verifies attempt submissions, scoring and reward grants. Never trust client-supplied XP.
- Database access is scoped by authenticated user and role using RLS.
- Demo mode must use synthetic data and a local persistence adapter; it must be clearly labelled.

## 3. Suggested source layout

```text
src/
  app/
    (marketing)/
    (auth)/
    (student)/
    (teacher)/
    api/
  components/
    layout/
    mission/
    lab/
    charts/
    ui/
  features/
    auth/
    missions/
    attempts/
    progress/
    teacher/
  domain/
    experiments/
      physics/
      chemistry/
      biology/
    evaluation/
    rewards/
    mission-state/
  data/
    missions/
    badges/
  lib/
    supabase/
    validation/
    analytics/
  styles/
  types/
supabase/
  migrations/
  seed.sql
tests/
  unit/
  e2e/
```

Adapt this layout to the actual repository rather than forcing it if an existing structure is already sound.

## 4. Mission definition contract
Each mission should include:
- stable `id`, `version`, `title`, `subject`, `gradeBand`, `difficulty`;
- story briefing and learning objectives;
- concepts and misconceptions targeted;
- experiment model identifier and parameter schema;
- variable ranges, defaults and units;
- observable outputs and expected evidence;
- hypothesis prompt and rubric criteria;
- hint ladder;
- mastery threshold and reward definition;
- accessibility text and offline availability flag;
- citations/references for scientific models.

Keep mission content separate from UI. Validate mission definitions at build time.

## 5. Simulation interface

```ts
type ParameterValue = number | string | boolean;

interface ExperimentInput {
  parameters: Record<string, ParameterValue>;
  seed?: number;
}

interface Observation {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  description: string;
}

interface ExperimentResult {
  observations: Observation[];
  explanation: string;
  modelVersion: string;
  warnings: string[];
}

interface ExperimentModel {
  id: string;
  version: string;
  validate(input: ExperimentInput): ValidationResult;
  run(input: ExperimentInput): ExperimentResult;
}
```

Use a discriminated union and Zod schemas in implementation. Avoid unsafe generic parameter casting.

## 6. Mission state machine
`briefing → prediction → experiment → analysis → evaluation → (retry | completed)`

Rules:
- A student must submit a prediction before the first decisive run. Allow edits before the run.
- Store each run as an immutable observation snapshot.
- A retry creates a new run/attempt event; do not overwrite evidence.
- Evaluation references the exact hypothesis and run snapshot.
- Mission completion is determined server-side from rubric thresholds.
- Hints are progressively revealed and recorded for analytics.

## 7. Rendering and performance
- Default to responsive 2D. Use Phaser for interactive scenes where it adds value.
- Load Three.js only for experiments needing 3D spatial understanding.
- Detect WebGL support and provide a meaningful 2D fallback.
- Respect reduced-motion preferences.
- Avoid loading large 3D assets on the initial dashboard.
- Target usable performance on low-end Android phones and modest laptops; measure actual performance.

## 8. Offline/PWA
- Cache app shell, static assets and explicitly marked public mission definitions.
- Queue non-sensitive attempt events for later sync only if conflict handling is implemented.
- Do not cache auth tokens or private class/student data in a shared service-worker cache.
- Display offline state and sync status honestly.

## Current implementation notes — 2026-11-27
- UI is Next.js App Router + Tailwind v4; experiment scenes are accessible SVG, not Phaser/Three.js yet.
- WebGL capability detection lives in `src/lib/use-webgl-support.ts` and is surfaced as a 2D fallback chip; no 3D scenes are loaded.
- Domain logic lives in `src/domain/**` and is pure. Mission definitions are typed in `src/data/missions.ts` but are not runtime-validated with Zod yet.
- Demo persistence uses `localStorage` via `src/lib/demo-store.tsx`; Supabase/Postgres/RLS, server actions and server-side scoring are not implemented.
- The PWA service worker caches only the public shell and explicitly public mission content; private routes are excluded.
- The suggested source layout above is aspirational; the actual repo uses route groups `(auth)`, `(student)`, `(teacher)` and `(lab)`, plus `src/components/pwa`.
