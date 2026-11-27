# LabLegends

LabLegends is a browser-first, gamified virtual science laboratory where students investigate mystery missions in Physics, Chemistry and Biology. Learners manipulate experiment variables, record predictions and evidence, and receive transparent, rule-based feedback on the quality of their scientific reasoning.

> **Early demo:** This repository contains a working MVP demo, not a validated educational intervention. LabLegends is not certified, scientifically validated, patent-approved, or proven to improve scores. The biology model is conceptual and pending subject review. All users and data are synthetic.

## Features

- **Three playable missions**
  - Physics: *The Satellite That Went Dark* — Ohm's Law (`I = V / R`)
  - Chemistry: *The Mystery of the Concentration* — dilution (`C1V1 = C2V2`)
  - Biology: *The Greenhouse Signal* — conceptual photosynthesis limiting factors, explicitly gated as `pending-subject-review`
- **Reasoning-first learning loop**
  - Observe → Question → Hypothesize → Experiment → Analyze → Reward → Observe
  - Prediction and justification are captured before the decisive run
  - Run history, evidence comparison, hint ladders and unlimited retries
- **Deterministic evaluation**
  - Pure TypeScript rubric with criterion-level scores and constructive feedback
  - XP and badges reward reasoning, evidence use and persistence
  - No speed bonus; hints and retries never reduce XP
- **Accessible 2D lab**
  - Interactive SVG apparatus with keyboard-operable hotspots and sliders
  - Reduced-motion-aware animations and visible focus styles
  - WebGL capability detection with an honest 2D fallback chip; no 3D dependency is loaded
- **Student and teacher demo flows**
  - Student home, mission catalogue, briefing, lab, results and progress
  - Teacher workspace, class detail, misconception analytics and CSV report export
- **PWA foundations**
  - Web manifest, generated 192/512 icons, offline page and offline indicator
  - Production-only service worker with a strict public-cache allowlist
  - Private student, teacher, lab, results and API routes are never cached
- **First-timer tutorial**
  - Guided six-step introduction at `/tutorial`
  - One-time banner on the student home and a small interactive Ohm's Law practice run
- **Local demo persistence**
  - Attempts, XP and badges persist in `localStorage` under `lablegends.demo.v1`
  - No backend, real accounts or personal student data are required

## Current status

| Area | Status |
|---|---|
| Playable student and teacher demo | Implemented |
| Three deterministic experiment models | Implemented and unit-tested |
| Rule-based rubric, XP and badges | Implemented in pure domain modules |
| PWA manifest, icons, offline page and safe cache policy | Implemented |
| First-timer tutorial and interactive 2D stage | Implemented |
| Supabase Auth, Postgres and RLS | Not implemented |
| Server-authoritative scoring and immutable XP ledger | Not implemented |
| Runtime Zod validation for mission definitions | Not implemented; only demo login name is validated |
| Playwright E2E and formal accessibility audit | Not implemented |
| Subject-expert review and pilot instrumentation | Not implemented |

See [`docs/STATUS.md`](docs/STATUS.md) for the detailed verified checklist and [`docs/ROADMAP.md`](docs/ROADMAP.md) for remaining work.

## Installation

Prerequisites:

- Node.js 20.9+ (validated on `v22.13.0`)
- npm 10+ (validated on `10.9.2`)

```bash
git clone https://github.com/samarthshrivas/LabLegends.git
cd LabLegends
npm install
```

The app runs fully in demo mode with no environment variables. To configure optional values, copy the template and edit it locally:

```bash
cp .env.example .env.local
```

`.env.example` contains placeholders only. Never commit real credentials.

## Quick start

```bash
npm run dev
```

Open <http://localhost:3000>.

A typical first run:

1. Choose **Enter demo mode** on the landing page.
2. Select the student flow and open `/tutorial` if prompted.
3. Browse `/missions`, open a mission briefing and start the lab.
4. Submit a prediction, adjust variables, run the simulation and compare evidence.
5. Review criterion-level feedback, XP and badges on the results page.
6. Check `/progress` for history, or switch to the teacher demo from the role selector.

The service worker registers only in production builds. To test PWA/offline behaviour locally:

```bash
npm run build
npm start
```

## Usage

### Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript with `--noEmit` |
| `npm run test` | Run Vitest unit tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run verify` | Run lint, typecheck and unit tests |

### Main routes

| Route | Purpose |
|---|---|
| `/` | Landing page and demo entry |
| `/login` | Demo role selection and display-name entry |
| `/tutorial` | First-timer guide and practice run |
| `/student` | Student home |
| `/missions` | Subject and mission catalogue |
| `/missions/[missionId]` | Mission briefing |
| `/lab/[missionId]` | Interactive experiment workspace |
| `/results/[attemptId]` | Reasoning feedback and evidence recap |
| `/progress` | Student XP, badges and attempt history |
| `/teacher` | Teacher class overview |
| `/teacher/class/[classId]` | Class roster and performance |
| `/teacher/reports` | CSV report export |
| `/offline` | Offline status and cached-content entry |

## Architecture

- **UI:** Next.js App Router, React 19, TypeScript and Tailwind CSS v4.
- **Domain logic:** Pure functions in `src/domain/**` for experiment models, rubric evaluation and rewards. React components consume state; they do not own scientific calculations.
- **Demo persistence:** `src/lib/demo-store.tsx` stores a typed demo shape in `localStorage`.
- **Validation:** Zod validates the demo login display name. Mission definitions are currently typed, not runtime-validated.
- **Rendering:** Accessible SVG is the default 2D renderer. Phaser and Three.js are future options, not current dependencies.
- **PWA:** `public/sw.js` caches only explicitly public shell/content paths. Private routes are excluded from shared caches.

```text
src/
  app/                 App Router pages and route groups
  components/          Layout, lab, mission, chart and PWA components
  data/                Mission catalogue and synthetic demo data
  domain/              Pure experiment, evaluation and reward modules
  lib/                 Demo store, cache policy and capability helpers
  types/               Shared domain types
docs/                  Product, architecture, test and science notes
public/                Icons and service worker
tests/unit/            Vitest unit tests
```

## Documentation

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) — product vision, audience, journey and MVP scope
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — architecture rules and current implementation notes
- [`docs/EXPERIMENTS.md`](docs/EXPERIMENTS.md) — model assumptions, units, ranges and limitations
- [`docs/MISSIONS.md`](docs/MISSIONS.md) — starter mission content and release gates
- [`docs/REASONING_AND_REWARDS.md`](docs/REASONING_AND_REWARDS.md) — rubric and reward design
- [`docs/UX_AND_DESIGN.md`](docs/UX_AND_DESIGN.md) — visual and accessibility direction
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — unit, integration, E2E and quality gates
- [`docs/SECURITY_PRIVACY.md`](docs/SECURITY_PRIVACY.md) — student safety and privacy constraints
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — proposed database schema, not yet implemented
- [`docs/SOURCE_MAPPING.md`](docs/SOURCE_MAPPING.md) — mapping to the invention disclosure and interpretation notes
- [`docs/STATUS.md`](docs/STATUS.md) — current verified state
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — implemented and pending work

## Verification

Last verified 2026-11-27:

```text
npm run lint        clean
npm run typecheck   clean
npm run test        6 files, 28 tests passed
npm run build       successful; 16 routes generated
```

Route smoke tests returned HTTP 200 for the main student, teacher, tutorial, offline, manifest and service-worker routes. Browser install prompt, Playwright E2E, formal accessibility audit and low-end device performance pass are not yet verified.

## Security and privacy

- Demo users, classes and attempts are synthetic; no real student information is used.
- No inventor personal or contact details are included in code, seeds or documentation.
- Secrets are not placed in client code; `.env.example` contains placeholders only.
- Private routes are excluded from the service-worker cache.
- Real student use would require backend authorization, RLS, privacy notice, guardian/school consent and institutional review. This demo does not claim legal compliance.

## Contributing

Contributions are welcome. Before opening a pull request:

1. Read [`AGENTS.md`](AGENTS.md) and the relevant files in `docs/`.
2. Keep domain logic outside React components.
3. Preserve deterministic scoring and student-safety constraints.
4. Run `npm run verify` and `npm run build`.
5. Update `docs/STATUS.md` and `docs/ROADMAP.md` when implementation changes.

Please open an issue for larger changes or scope decisions, especially anything involving scientific models, scoring, student data or backend authorization.

## API reference

Not applicable yet. The current demo has no public API; all persistence is local and all evaluation runs in deterministic client-side domain modules.

## License

License not yet specified. No `LICENSE` file is included, so treat the code as unlicensed/all rights reserved until a license is chosen and added.
