# Implementation Roadmap

> Legend: `[x]` implemented and verified in the current demo build; `[ ]` not implemented or not yet verified. Notes explain partial work.

## Phase 0 — Repository inspection and foundation
- [x] Inspect existing repository and report current stack/state.
- [x] Create or adapt Next.js + TypeScript app.
- [x] Add lint, typecheck, test scripts and `.env.example`.
- [x] Establish design tokens, responsive layout and route structure.
- [x] Add demo mode using synthetic data.

**Exit:** app runs locally; quality scripts work; no secrets committed. ✅ Verified 2026-11-27.

## Phase 1 — Student shell and mission catalogue
- [x] Student home and subject/mission catalogue.
- [x] Mission briefing page.
- [x] Typed mission definitions.
- [ ] Runtime schema validation of mission definitions (Zod or equivalent).
- [x] Responsive navigation and loading/empty/error states.

**Exit:** learner can discover and open a mission. ✅

## Phase 2 — Playable Physics vertical slice
- [x] Pure Ohm's Law model with tests.
- [x] Interactive circuit UI with voltage/resistance controls.
- [x] Prediction and justification captured before run.
- [x] Observation history and evidence comparison.
- [x] Rule-based rubric evaluator and criterion feedback.
- [x] Retry/hints and in-app mission progression.
- [ ] Pure mission-state module with transition tests.
- [x] XP calculation and badge awards in demo store.
- [ ] Immutable server-side XP ledger and idempotent reward grant.
- [ ] Mission unlock/gating to the next mission.

**Exit:** a student can complete the entire Physics mission and see persisted results (or clearly labelled demo persistence). ✅ Demo persistence via `localStorage`.

## Phase 3 — Chemistry and Biology
- [x] Dilution simulation and tests.
- [x] Photosynthesis conceptual model, subject review gate and tests.
- [x] Add the two corresponding story missions.
- [x] Ensure each subject has distinct visual identity but consistent controls.

**Exit:** one complete mission in each subject. ✅ Biology remains explicitly pending subject review.

## Phase 4 — Progress and teacher dashboard
- [x] Student progress, XP, badges and mission history.
- [x] Teacher class overview and assignment preview (demo read-only views).
- [ ] Teacher assignment mutations.
- [x] Completion and misconception analytics.
- [x] CSV report export.
- [ ] Role-based access and RLS tests.

**Exit:** teacher can assign a mission and inspect only authorized class analytics. ⚠️ Demo analytics complete; assignment mutations, authorization/RLS still require backend work.

## Phase 5 — Persistence, PWA and resilience
- [ ] Supabase Auth and migrations.
- [ ] RLS policies and server-side reward calculation.
- [x] PWA manifest, icons and app-shell offline support (production service worker, strict public cache allowlist; browser install prompt not yet verified).
- [x] Offline indicator and cached-content page.
- [ ] Background sync/retry queue for authenticated actions.
- [x] WebGL capability detection and 2D fallback status chip.
- [ ] Runtime input validation with Zod or equivalent (currently only the demo login display name).

**Exit:** deployed test environment with documented setup and security review checklist.

## Phase 6 — Polish and pilot readiness
- [x] First-timer tutorial with guided entry points and interactive practice run.
- [x] Interactive hotspots and richer reduced-motion-aware animations in the experiment stage.
- [ ] Accessibility audit and fixes.
- [ ] Low-end device performance pass.
- [ ] Content review by Physics, Chemistry and Biology subject experts.
- [ ] Instrument pilot metrics and pre/post assessment workflow.
- [ ] Privacy notice, consent and institutional review before real student use.

**Exit:** pilot-ready build; no claims of measured impact until data exists.

## Working status
Update `STATUS.md` after each implementation session. Do not mark a phase complete until its exit criteria are verified.

## Verification record — 2026-11-27
- `npm run lint` — clean.
- `npm run typecheck` — clean.
- `npm run test -- --run` — 6 files, 28 tests passed.
- `npm run build` — successful; 16 routes generated, including `/tutorial`, `/offline`, `/manifest.webmanifest` and `/icon.svg`.
- Dev server smoke test — `/`, `/tutorial`, `/offline`, `/manifest.webmanifest`, `/sw.js`, `/missions`, `/student`, `/lab/satellite-went-dark` all returned HTTP 200; earlier smoke test covered login, briefing, results, progress and teacher routes.
- Documentation audit — all Markdown files reviewed; checkboxes reconciled with implemented code and status notes added to planning docs.
