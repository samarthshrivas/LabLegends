# Test Plan

## Unit tests
- Ohm's Law: known values, zero/negative resistance rejected, unit/range validation.
- Dilution: conserved solute amount, larger final volume lowers concentration, invalid volumes rejected.
- Biology conceptual model: bounded output, monotonicity in unsaturated region, saturation/limiting-factor behaviour; test only after model review.
- Mission state machine: valid transitions only; retry preserves prior run.
- Evaluator: criterion scores, partial credit, evidence matching, incorrect prediction with sound reasoning, lucky guess with no justification.
- Rewards: no speed bonus, XP idempotency, retry bonus cap, no duplicate badge grant.
- Authorization: student cannot access another student's attempts; teacher cannot access another teacher's class.

## Integration tests
- Sign in/demo mode and role-aware navigation.
- Load mission definition and validate schema.
- Submit prediction, run experiment, record observations and submit conclusion.
- Evaluate attempt and persist rubric feedback.
- Retry and verify prior run remains.
- Complete mission and unlock next mission.
- Teacher assignment and authorized analytics query.

## End-to-end tests
1. Student completes Physics mission from briefing through reward.
2. Student gets a hint, retries and completes mission.
3. Student refreshes mid-mission and resumes safely.
4. Teacher assigns mission and sees class completion update.
5. Mobile viewport can complete the mission using touch and keyboard-accessible controls.
6. Offline app shell opens and communicates offline status.

## Quality gates
- Typecheck and lint clean.
- No critical console errors.
- No inert buttons or dead routes.
- Domain tests pass.
- Basic keyboard and screen-reader labels verified.
- Responsive at phone, tablet and desktop widths.

## Coverage status — 2026-11-27

### Unit tests
- [x] Ohm's Law known values, zero/negative resistance rejected, unit/range validation.
- [x] Dilution conserved solute, larger final volume lowers concentration, invalid volumes rejected.
- [x] Biology conceptual model bounded output, monotonicity in unsaturated region and saturation behaviour (model still pending subject review).
- [ ] Mission state machine transition tests (pure state module not implemented).
- [x] Evaluator criterion scores, partial credit, evidence matching, unsupported guess and no speed term.
- [x] Rewards no speed bonus, capped persistence bonus, badge behaviour and level progress.
- [ ] XP idempotency and immutable ledger tests (server-side ledger not implemented).
- [ ] Authorization tests (backend not implemented).
- [x] PWA cache policy allowlist tests.

### Integration tests
- [ ] No integration test runner is configured yet; all integration scenarios above remain pending.

### End-to-end tests
- [ ] Playwright is not configured yet; all E2E scenarios above remain pending.

### Quality gates
- [x] Typecheck and lint clean.
- [x] Domain tests pass.
- [x] Build succeeds and route smoke tests return expected status codes.
- [ ] No critical console errors (browser console audit not yet performed).
- [ ] Basic keyboard and screen-reader labels verified (manual audit pending).
- [ ] Responsive at phone, tablet and desktop widths (manual audit pending).
