# Mapping to the Invention Disclosure

Source: supplied `Patent Cap.docx`, titled **LabLegends – Gamified Virtual Science (VR) Laboratory with Hypothesis-Driven Mission Engine and Reasoning-Based Reward System**.

| Disclosure content | Location in source | Project implementation |
|---|---|---|
| Grades 6–12 and first-year undergraduate audience; Physics, Chemistry, Biology | Page 3, description | Product audience and three subject catalogue |
| Adjustable variables and browser simulations | Page 3 | Experiment model interface and interactive lab |
| Mystery missions and modular mission templates | Page 3 | Data-driven mission engine and starter mission catalogue |
| Prediction plus justification; evaluate reasoning | Page 3 | Hypothesis workflow and transparent rubric |
| XP, badges, levels, streaks, leaderboards, unlockable labs | Page 3 | Reward system, with student-safety constraints |
| Adaptive hints and feedback | Page 3 | Hint ladder and retry flow |
| Teacher analytics, assignments, misconception heat-maps, reports | Page 3 | Teacher dashboard and analytics |
| Impossible Labs for hazardous/expensive/impractical topics | Page 3 | Virtual-only future mission catalogue |
| Observe → Question → Hypothesize → Experiment → Analyze → Reward | Page 4 and page 7 | Core learning loop |
| Student selects mission, changes variables, runs, hypothesizes, receives feedback or reward | Page 7 and process diagram on page 10 | Mission state machine |
| React, Three.js/Phaser, WebGL; Node/Python; SQL/NoSQL options; PWA | Page 8 | Suggested implementation stack; selected choices are project decisions |
| Low-end device, offline and 2D fallback | Pages 4 and 8 | PWA/performance roadmap |
| Target metrics: >70% completion, satisfaction >4/5, 20–30% pre/post gain | Pages 5 and 9 | Pilot metrics only; not represented as achieved outcomes |

## Important interpretation notes
- Page 10's process diagram shows the central loop: login → select subject/mission → read briefing → set/change variables → run simulation/observe → hypothesis decision → feedback/retry or XP/badge/mission solved → unlock next mission.
- The disclosure does not provide exact implementation equations, scoring weights, database schema, user-interface layouts or a fully specified AI model. Those are explicitly proposed engineering decisions in this package.
- The source's keyword line on page 12 appears unrelated to the LabLegends description (it lists AI-based dropout prediction, student counselling, learning analytics, explainable AI, federated learning and real-time intervention). Do not silently implement these as LabLegends requirements; confirm with the inventors whether that line is a template error.
- The invention disclosure contains personal contact and registration details. They are intentionally excluded from this project package and must not be copied into app code, seed data or public documentation.

## Current implementation notes — 2026-11-27
- [x] Core loop, three subjects, mission engine, rubric, rewards, hints, teacher demo analytics, PWA foundations and 2D fallback are represented in the current build.
- [ ] Target metrics remain unmeasured; no pilot instrumentation or pre/post assessment workflow exists yet.
- [ ] The page 12 keyword line still needs inventor confirmation before any related feature is implemented.
- [ ] Impossible Labs and the broader future mission ideas remain roadmap ideas, not implemented missions.
