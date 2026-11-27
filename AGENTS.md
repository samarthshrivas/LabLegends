# Instructions for OpenCode

## Mission
Implement LabLegends as a maintainable, usable educational product. The defining workflow is:
**Observe → Question → Hypothesize → Experiment → Analyze → Reward → Observe.**

## Mandatory working rules
1. Read `README.md` and every file in `docs/` before substantial implementation.
2. Inspect the repository before changing files. Preserve working code and existing conventions.
3. Build in roadmap order. Prefer a working vertical slice over broad scaffolding.
4. Use strict TypeScript. Avoid `any`; explain unavoidable exceptions.
5. Keep domain logic (simulation, mission rules, evaluation, XP) outside React components.
6. Never use an LLM as the sole authority for scientific correctness or student scoring. Deterministic rules are the source of truth. If an LLM explanation adapter is later added, label it as assistive, validate output, and never let it change experiment facts or score.
7. Every experiment must document its model, assumptions, units, valid ranges and limitations. Do not invent scientific formulas. Add tests against known cases and sanity properties.
8. Never reward speed above reasoning quality. Do not penalize students for taking time or retrying.
9. Feedback must be constructive, age-appropriate and specific. Do not reveal the answer immediately when a useful hint can guide another attempt.
10. Use accessible semantic HTML, keyboard support, visible focus, sufficient contrast, reduced-motion support and responsive layouts.
11. Handle loading, empty, error and offline states. Never leave a visible control inert.
12. Validate all user input with Zod (or equivalent). Enforce authorization in server/database policies, not only in the UI.
13. Do not expose secrets in client code. Use environment variables and provide `.env.example` with placeholders only.
14. Do not add real student personal information from the invention disclosure. Use synthetic demo users and data.
15. Do not claim the platform is certified, scientifically validated, patent-approved or proven to improve scores.
16. Run `lint`, `typecheck`, unit tests and relevant end-to-end tests after changes. Report actual results; never claim a command passed if it was not run.
17. Update `docs/STATUS.md` and `docs/ROADMAP.md` as implementation changes.

## Architecture expectations
- UI: Next.js App Router, React, TypeScript.
- Styling: Tailwind CSS; build a cohesive visual system.
- 2D scenes: Phaser, loaded only on the client when needed.
- 3D: optional Three.js scenes behind capability checks; provide 2D fallback.
- Data: Supabase/Postgres with RLS. Keep a local demo mode if credentials are absent.
- Domain modules: pure functions for experiment models, hypothesis evaluation, reward calculation and mission state transitions.
- PWA: cache shell and explicitly cacheable learning content; do not cache private account data in shared caches.

## Definition of done for a feature
- User can complete the intended flow without developer intervention.
- Data is validated and persisted (or clearly handled in demo mode).
- Responsive and keyboard-usable.
- Unit tests cover domain logic and edge cases.
- Loading/error/empty states exist where relevant.
- No console errors or broken navigation.
- Documentation updated.
