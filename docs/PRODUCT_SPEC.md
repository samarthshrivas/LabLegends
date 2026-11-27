# Product Specification

## 1. Product vision
LabLegends turns science learning from passive memorisation into active investigation. Students enter mystery missions, operate virtual experiments, make predictions, justify them with evidence, and receive feedback and rewards for scientific reasoning.

## 2. Audience and roles
- **Student:** explores subjects, performs experiments, records hypotheses, receives feedback and tracks progress.
- **Teacher:** creates/assigns classes and missions, reviews progress and misconception trends, exports reports.
- **Admin:** manages users, mission catalogue and platform configuration.

For the MVP, implement student and teacher experiences. Admin can be a protected placeholder only if needed for content management; do not build a large admin suite prematurely.

## 3. Core user journey
1. Student signs in or enters clearly labelled demo mode.
2. Student chooses Physics, Chemistry or Biology.
3. Student selects an available mission and reads the mystery briefing.
4. Student inspects experiment objective, apparatus and safety/context notes.
5. Student records a prediction and a short justification before running the decisive experiment.
6. Student changes allowed variables and runs the simulation.
7. The simulator presents observable results and records an experiment log.
8. Student compares evidence with the prediction and submits a conclusion.
9. Evaluator returns criterion-level feedback and a score breakdown.
10. Student may retry with hints; retries are unlimited.
11. On meeting mission mastery criteria, award XP/badge and unlock the next mission.
12. Progress and reasoning traces appear in student and teacher analytics.

## 4. MVP pages
- `/` — product landing page and role-aware entry.
- `/login` — sign-in and demo entry.
- `/student` — student home, level, XP, streak, recent missions.
- `/missions` — subject filters and mission catalogue.
- `/missions/[missionId]` — mission briefing and objectives.
- `/lab/[missionId]` — interactive experiment workspace.
- `/results/[attemptId]` — reasoning feedback, observations and retry/continue.
- `/progress` — student progress and badges.
- `/teacher` — class overview, assignment and analytics.
- `/teacher/class/[classId]` — roster and class performance.
- `/teacher/reports` — exportable report view.
- `/tutorial` — first-timer guide and practice run.
- `/offline` — offline status and cached-content entry.

Use route guards and role-aware navigation.

## 5. Experience principles
- Curiosity first: missions start with a compelling question, not a lecture.
- Evidence before answer: encourage observation and variable control.
- Reasoning over guessing: reward prediction, justification, fair testing, evidence and conclusion.
- Safe experimentation: virtual-only simulations, especially for hazardous or impractical scenarios.
- Retry without shame: mistakes trigger useful hints, not punitive loss.
- Accessibility: readable language, keyboard controls, captions/text alternatives, reduced motion and 2D fallback.
- Scientific integrity: show model assumptions and distinguish simulation from real-world measurements.

## 6. Gamification
- XP for reasoning criteria, evidence use, controlled experimentation, reflection and persistence.
- Badges for demonstrated skills (e.g. Careful Observer, Evidence Detective, Variable Controller).
- Levels unlock content, not academic advantage.
- Streaks should encourage regular practice without harsh resets.
- Leaderboards are optional and should be disabled by default for minors; never expose private student data.
- No pay-to-win mechanics and no reward based solely on speed.

## 7. Teacher capabilities
- Create/manage a class and invite students using safe, non-public codes.
- Assign missions and due dates.
- View completion, attempts, concept mastery and common misconception categories.
- Inspect individual reasoning traces only for students in their authorized class.
- Export CSV reports.
- Use aggregated analytics; avoid public rankings of children.

## 8. Non-goals for MVP
- Full immersive headset VR.
- Real chemistry lab control or connection to physical hazardous equipment.
- Automated high-stakes grading.
- Social chat, public profiles or open messaging.
- Marketplace and paid subscriptions.
- AI-generated scientific facts without review.

## 9. Success metrics to instrument
Measure, do not assume:
- mission start and completion rates;
- retry and hint usage;
- hypothesis completeness;
- evidence references and variable-control behaviour;
- pre-test/post-test results for pilot cohorts;
- student and teacher satisfaction;
- performance on low-end devices and offline reopen.

The disclosure mentions target outcomes of >70% mission completion, satisfaction >4/5 and 20–30% pre/post score improvement. These are pilot targets, not established results.

## Implementation status — 2026-11-27
- [x] All MVP pages above are implemented, including `/tutorial` and `/offline`; route smoke tests returned expected status codes.
- [x] Demo role selection routes to student or teacher workspace; navigation is path-aware, not yet role-guarded.
- [x] Prediction/justification before run, run history, evidence recap, rubric feedback, XP and badges work in demo mode.
- [x] CSV export is implemented in `/teacher/reports`.
- [x] Streak is displayed from synthetic demo data; no date-based streak logic exists yet.
- [ ] Teacher assignment mutations, mission unlock/gating, Supabase persistence, server authorization, pilot metrics instrumentation and pre/post assessment workflow are not implemented yet.
