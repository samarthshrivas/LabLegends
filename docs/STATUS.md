# Project Status

## Current state
- Next.js 16 App Router + TypeScript + Tailwind v4 application scaffolded and implemented in the repository root.
- Full UI-first demo is playable: landing, demo login, student home, mission catalogue, mission briefing, lab workspace, results feedback, student progress, teacher workspace, class detail and reports.
- Three deterministic experiment models are implemented and unit-tested: Ohm's Law, dilution and a conceptual photosynthesis limiting-factors model.
- Rule-based rubric evaluation, XP and badge logic live in pure domain modules outside React.
- Demo state persists to `localStorage` with synthetic users and data; no real student information is used.
- PWA manifest, generated 192/512 icons, production-only service worker with a strict public-cache allowlist, offline page and offline indicator added. Private student/teacher/lab/results/API routes are never cached. Browser install prompt not yet verified.
- First-timer tutorial added at `/tutorial`, with a one-time banner on student home, sidebar and landing-page entry points, and a small interactive Ohm's Law practice run.
- Experiment stage is now interactive: clickable `+` hotspots adjust voltage, resistance, final volume, light and CO₂; richer CSS/SMIL animations include flowing charge, liquid waves/droplets, pulsing components and leaf motion, all respecting reduced-motion preferences.
- WebGL capability detection added with an honest 2D fallback chip; 2D remains the default rendering path.
- Zod is used for demo login display-name validation; mission definitions are typed but not runtime-validated yet.
- Verification run on 2026-11-27: `npm run lint` clean, `npm run typecheck` clean, `npm run test -- --run` 28/28 passing, `npm run build` successful with 16 routes, and all primary plus new routes returned HTTP 200 from the dev server.

## Decisions
- Browser-first PWA direction retained; 2D-first MVP with SVG apparatus and charts, no 3D dependency added yet. The service worker registers only in production builds to avoid stale caches during development.
- Science models and evaluation remain deterministic, testable and separate from UI components.
- Started with the Physics vertical slice, then added Chemistry and Biology missions using the same lab shell.
- Biology photosynthesis model is explicitly labelled conceptual, uses relative units and is gated as `pending-subject-review`; it must not be used for assessed scoring until reviewed.
- Synthetic demo data only; Supabase/Postgres, RLS and server-side reward calculation remain future work.
- Hints never reduce XP; retries are always allowed; no speed bonus exists anywhere in the reward logic.
- Navigation is path-aware in the demo shell; role-aware route guards and server authorization are not implemented yet.

## Known gaps
- No Supabase Auth/Postgres/RLS, server-side scoring, immutable XP ledger or idempotent reward grant yet.
- No runtime Zod validation for mission definitions or experiment submissions; only the demo login name is validated.
- No route guards, teacher assignment mutations or mission unlock/gating yet.
- No Playwright integration/E2E tests, formal accessibility audit, screen-reader pass or low-end device performance pass yet.
- Biology model still pending subject review; no pilot metrics are instrumented and no learning-outcome claims are made.

## Open decisions
- Confirm whether Supabase is the preferred backend or an existing backend must be retained.
- Confirm exact target grade bands for the first pilot.
- Obtain subject-expert review and references for each released simulation, especially the biology model.
- Decide whether 3D is necessary for any MVP mission after testing the 2D experience.
- Choose whether demo `localStorage` state should be migrated into authenticated accounts when backend work starts.

## Session log
- Initial project brief and implementation documentation created.
- Repository inspected; Next.js 16 + TypeScript + Tailwind v4 scaffold copied into root without overwriting existing docs.
- Design system, route group shells, demo store and domain layer implemented.
- Student flow, lab workspace, results, progress and teacher dashboards implemented.
- Unit tests added for all three models, rubric evaluation and rewards.
- Lint/typecheck issues fixed by removing setState-in-effect patterns in favour of event-driven state and `useSyncExternalStore`.
- Full verification suite passed; dev server left running at `http://localhost:3000`.
- Added PWA manifest/icons, safe service worker cache policy, offline page/indicator and cache-policy tests.
- Added first-timer tutorial, guided entry points and interactive practice run.
- Added interactive hotspots and richer reduced-motion-aware animations to all three experiment stages.
- Added WebGL capability detection with a 2D fallback status chip.
- Audited all Markdown files and reconciled checkboxes/status notes with the implemented code.
