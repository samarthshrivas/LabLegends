# Mission Content Format and Starter Missions

## Mission template
Each mission definition should contain:
- identity/version, title, subject, grade band and difficulty;
- story hook and briefing;
- learning objectives and prerequisite concepts;
- target misconceptions;
- apparatus and variable controls;
- hypothesis prompt;
- experiment model and allowed parameter ranges;
- expected observations and evidence identifiers;
- rubric criteria and feedback rules;
- hint ladder;
- mastery threshold and reward;
- accessibility narration/text;
- scientific references and model limitations.

## Starter mission 1 — The Satellite That Went Dark
- Subject: Physics
- Concept: voltage, resistance and current (Ohm's Law)
- Story: A research satellite's power subsystem is behaving unexpectedly. The learner investigates a simplified virtual circuit to determine how resistance and supply voltage affect current.
- Objective: predict and test the effect of changing voltage and resistance.
- Experiment: Ohm's Law circuit model.
- Hypothesis prompt: “If resistance increases while voltage stays the same, what will happen to current? Explain why.”
- Evidence: voltage, resistance and current values from each run.
- Misconception: “More resistance always means more current.”
- Hint ladder: identify the fixed variable → inspect the relationship `I = V/R` → compare two runs with equal voltage.
- Completion: evidence-backed conclusion and minimum rubric score.

## Starter mission 2 — The Mystery of the Concentration
- Subject: Chemistry
- Concept: concentration and dilution
- Story: A fictional lab report contains inconsistent concentration readings. Learner uses a virtual dilution model to reason about how adding solvent changes concentration.
- Objective: predict final concentration when volume changes while solute amount remains constant.
- Experiment: dilution equation model.
- Hypothesis prompt: “What happens to concentration when the same amount of solute is spread through a larger volume?”
- Evidence: initial/final volume and concentration.
- Misconception: “Adding water increases the amount of solute.”
- Hint ladder: distinguish solute from solution volume → compare total solute amount → use `C1V1 = C2V2`.
- Safety: virtual-only; no chemical handling directions.

## Starter mission 3 — The Greenhouse Signal
- Subject: Biology
- Concept: photosynthesis and limiting factors
- Story: A greenhouse's plant growth indicators have changed. Learner investigates how light and CO₂ availability affect a conceptual photosynthesis-rate model.
- Objective: identify a limiting factor and explain saturation.
- Experiment: reviewed conceptual model, clearly labelled as simulated.
- Hypothesis prompt: “If light intensity rises while CO₂ stays low, will the modelled rate keep rising without limit? Explain.”
- Evidence: input levels and relative model output.
- Misconception: “Increasing any one factor always increases the rate indefinitely.”
- Hint ladder: compare low and high light at fixed CO₂ → inspect saturation → identify the limiting factor.
- Release gate: a biology subject reviewer must approve the model and its parameters.

## Content quality
Write for the learner's grade band. Do not use the same text for every age. Provide glossary definitions and optional “learn the concept” panels. All story details are fictional and must not obscure the scientific task.

## Implementation status — 2026-11-27
- [x] All three starter missions are defined in `src/data/missions.ts` and playable through the shared lab shell.
- [x] Each mission includes briefing, objectives, concepts, misconceptions, parameter ranges, rubric criteria, hints, mastery threshold, limitations and references.
- [x] Biology mission is explicitly gated as `pending-subject-review`.
- [ ] Glossary definitions, “learn the concept” panels, accessibility narration fields and offline availability flags are not implemented yet.
