# Hypothesis Evaluation and Reward System

## Core principle
Score the quality of the scientific process, not just the final answer. Evaluation must be explainable, deterministic and versioned.

## Hypothesis submission
Before the decisive experiment, collect:
- **Prediction:** what the student expects to happen.
- **Justification:** why they expect it, ideally referring to a scientific relationship or concept.
After experimentation, collect:
- **Evidence:** which observation(s) support the claim.
- **Conclusion:** what the student concludes and whether evidence changed their initial view.

## Proposed rubric (0–4 per criterion)
These weights are an initial product decision and must be configurable per mission.

| Criterion | What is evaluated | Initial weight |
|---|---|---:|
| Prediction clarity | A testable, directional prediction | 20% |
| Scientific justification | Relevant concept or relationship | 25% |
| Experimental control | Changes one variable while considering controls | 20% |
| Evidence use | References actual recorded observations | 20% |
| Conclusion/reflection | Conclusion matches evidence and acknowledges revision where appropriate | 15% |

Normalize to 0–100. Store criterion-level scores and feedback, not only a total.

## Evaluator implementation
- Start with mission-specific deterministic checks: required concepts, directional prediction, parameter changes, evidence IDs/values and consistency with model output.
- Use structured answer choices and short text fields where appropriate for Grades 6–12.
- Use keyword/concept matching only as a transparent baseline; do not pretend it understands all equivalent wording.
- For free text, an optional semantic/LLM assist may suggest feedback, but a deterministic rubric and teacher override remain authoritative.
- Handle spelling, language variation and partial credit fairly.
- Never penalize a learner simply for an incorrect initial prediction if it was testable and justified.
- Never award full marks for a lucky correct guess with no reasoning.
- Version rubrics and keep evaluation snapshots reproducible.

## Feedback format
For each criterion:
- score / maximum;
- what the student did well;
- one specific next step;
- optional hint to retry.

Feedback tone: encouraging, plain language, age-appropriate. Do not shame or label students.

## XP and badges
Proposed MVP XP formula:
- XP = base mission XP × normalized reasoning score factor.
- Add a small persistence bonus for thoughtful retries or use of evidence, capped to prevent farming.
- No speed bonus.
- Recompute and grant rewards server-side exactly once per qualifying completion.
- Maintain an immutable XP ledger.

Example badge criteria:
- Careful Observer: records observations in at least three runs.
- Variable Controller: performs a fair test by changing one variable while holding another constant.
- Evidence Detective: cites a recorded observation in a conclusion.
- Hypothesis Builder: submits a testable prediction and relevant justification.

Make exact thresholds configurable and test anti-farming/idempotency.

## Implementation status — 2026-11-27
- [x] Deterministic rubric evaluator with criterion scores, strengths, next steps and mastery threshold.
- [x] XP factor, capped persistence bonus, badge evaluation and no speed term in pure domain modules.
- [x] Hint ladder and retry flow in demo mode; hints never reduce XP and retries are always allowed.
- [x] Unit tests cover strong reasoning, unsupported guesses, controlled comparisons and no speed term.
- [ ] Server-authoritative scoring, immutable XP ledger, idempotent reward grants and configurable rubric version snapshots are not implemented yet.
