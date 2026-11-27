import type {
  CriterionId,
  CriterionScore,
  Evaluation,
  ExperimentRun,
  Mission,
  Observation,
  RubricCriterion,
} from "@/types/domain";
import { round } from "@/lib/utils";

export const RUBRIC_VERSION = "1.0.0";

export interface HypothesisSubmission {
  prediction: string;
  justification: string;
  conclusion: string;
  runs: ExperimentRun[];
}

export interface EvaluateOptions {
  rubric: RubricCriterion[];
  masteryThreshold: number;
  concepts: string[];
  subject: Mission["subject"];
}

const DIRECTIONAL_TERMS = [
  "increase",
  "increases",
  "increased",
  "decrease",
  "decreases",
  "decreased",
  "rise",
  "rises",
  "fall",
  "falls",
  "drop",
  "drops",
  "higher",
  "lower",
  "bigger",
  "smaller",
  "double",
  "halve",
  "stay",
  "stays",
  "same",
  "constant",
  "remain",
  "remains",
];

const CAUSAL_TERMS = ["because", "since", "so", "therefore", "which means", "as a result", "due to"];

const EVIDENCE_TERMS = ["run", "runs", "trial", "trials", "observation", "observations", "data", "reading", "result", "results"];

const RELATIONSHIP_TERMS = [
  "inverse",
  "inversely",
  "proportional",
  "directly proportional",
  "divide",
  "divided",
  "ratio",
  "per",
  "conserved",
  "constant",
  "limiting",
  "saturate",
  "saturation",
  "plateau",
  "ohm",
  "v = ir",
  "v=ir",
  "c1v1",
  "c1 v1",
];

const SUBJECT_CONCEPTS: Record<Mission["subject"], string[]> = {
  physics: ["voltage", "current", "resistance", "ohm", "charge", "circuit"],
  chemistry: ["concentration", "solute", "solvent", "volume", "dilution", "mole", "solution"],
  biology: ["light", "co2", "carbon dioxide", "photosynthesis", "rate", "limiting", "saturat"],
};

function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function countMatches(text: string, terms: string[]): number {
  return terms.reduce((total, term) => (text.includes(term) ? total + 1 : total), 0);
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(4, score));
}

function scorePrediction(text: string): number {
  const value = normalise(text);
  if (wordCount(value) < 2) return 0;
  const directional = countMatches(value, DIRECTIONAL_TERMS) > 0;
  const specific = countMatches(value, ["current", "concentration", "rate", "volume", "resistance", "light", "co2"]) > 0;
  const numeric = /\d/.test(value);

  if (directional && specific && (numeric || wordCount(value) >= 6)) return 4;
  if (directional && specific) return 3;
  if (directional) return 2;
  return 1;
}

function scoreJustification(text: string, concepts: string[], subject: Mission["subject"]): number {
  const value = normalise(text);
  if (wordCount(value) < 3) return 0;
  const conceptHits = countMatches(value, [...concepts.map(normalise), ...SUBJECT_CONCEPTS[subject]]);
  const relationshipHits = countMatches(value, RELATIONSHIP_TERMS);
  const causal = countMatches(value, CAUSAL_TERMS) > 0;

  if (conceptHits >= 2 && relationshipHits >= 1) return 4;
  if (conceptHits >= 1 && (relationshipHits >= 1 || causal)) return 3;
  if (conceptHits >= 1 || causal) return 2;
  return 1;
}

function hasControlledPair(runs: ExperimentRun[]): boolean {
  for (let i = 0; i < runs.length; i += 1) {
    for (let j = i + 1; j < runs.length; j += 1) {
      const a = runs[i].parameters;
      const b = runs[j].parameters;
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      let changed = 0;
      let unchanged = 0;
      keys.forEach((key) => {
        if (Math.abs((a[key] ?? 0) - (b[key] ?? 0)) > 1e-9) changed += 1;
        else unchanged += 1;
      });
      if (changed === 1 && unchanged >= 1) return true;
    }
  }
  return false;
}

function scoreControl(runs: ExperimentRun[]): number {
  if (runs.length === 0) return 0;
  const controlled = hasControlledPair(runs);
  if (runs.length >= 3 && controlled) return 4;
  if (runs.length >= 2 && controlled) return 3;
  if (runs.length >= 2) return 2;
  return 1;
}

function observationNumbers(runs: ExperimentRun[]): number[] {
  return runs
    .flatMap((run) => run.observations)
    .filter((observation): observation is Observation & { value: number } => typeof observation.value === "number")
    .map((observation) => observation.value)
    .filter((value) => Number.isFinite(value));
}

function scoreEvidence(text: string, runs: ExperimentRun[]): number {
  const value = normalise(text);
  if (value.length === 0 || runs.length === 0) return 0;

  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const candidates = observationNumbers(runs);
  const citesValue = numbers.some((number) =>
    candidates.some((candidate) => Math.abs(candidate - number) <= Math.max(0.02, Math.abs(candidate) * 0.03)),
  );

  if (citesValue) return 4;
  const labels = runs.flatMap((run) => run.observations.map((observation) => normalise(observation.label)));
  if (labels.some((label) => value.includes(label))) return 3;
  if (countMatches(value, EVIDENCE_TERMS) > 0) return 2;
  return 1;
}

function scoreConclusion(text: string, runs: ExperimentRun[]): number {
  const value = normalise(text);
  const words = wordCount(value);
  if (words === 0) return 0;
  const causal = countMatches(value, CAUSAL_TERMS) > 0;
  const evidence = scoreEvidence(value, runs) >= 3;
  if (words >= 12 && causal && evidence) return 4;
  if (words >= 8 && (causal || evidence)) return 3;
  if (words >= 4) return 2;
  return 1;
}

const STRENGTH_COPY: Record<CriterionId, { strong: string; partial: string }> = {
  prediction: {
    strong: "Your prediction is testable and clearly states a direction of change.",
    partial: "You made a prediction — naming the variable and the expected direction will make it testable.",
  },
  justification: {
    strong: "You justified the prediction with a relevant scientific relationship.",
    partial: "Your reasoning is a start — connect it to the relationship between the variables.",
  },
  control: {
    strong: "You ran a fair test: one variable changed while another was held constant.",
    partial: "You collected more than one run — try changing only one variable at a time.",
  },
  evidence: {
    strong: "You cited actual recorded observations rather than a general impression.",
    partial: "Point at a specific value or observation label from your run history.",
  },
  conclusion: {
    strong: "Your conclusion follows from the evidence and explains why.",
    partial: "Say what the evidence shows and whether it matched your prediction.",
  },
};

const NEXT_STEP_COPY: Record<CriterionId, string> = {
  prediction: "State the variable you will change and whether the outcome will rise, fall or stay the same.",
  justification: "Name the rule or relationship, then explain how it produces your prediction.",
  control: "Run two trials that differ by exactly one variable so the comparison is fair.",
  evidence: "Quote a number from your observations, e.g. “current fell from 1.20 A to 0.60 A”.",
  conclusion: "Finish with a sentence that starts “The evidence shows… because…”.",
};

const PUSH_FURTHER_COPY: Record<CriterionId, string> = {
  prediction: "Add the size of the change you expect, so the prediction could be measured.",
  justification: "Link your reasoning to a second trial where the other variable was held constant.",
  control: "Keep a control run in your log so the comparison is visible to a reader.",
  evidence: "Tie each piece of evidence back to the claim it supports.",
  conclusion: "Say explicitly whether your prediction was supported, revised or rejected.",
};

function scoreFor(
  id: CriterionId,
  submission: HypothesisSubmission,
  options: EvaluateOptions,
): number {
  switch (id) {
    case "prediction":
      return scorePrediction(submission.prediction);
    case "justification":
      return scoreJustification(submission.justification, options.concepts, options.subject);
    case "control":
      return scoreControl(submission.runs);
    case "evidence":
      return scoreEvidence(submission.conclusion, submission.runs);
    case "conclusion":
      return scoreConclusion(submission.conclusion, submission.runs);
    default:
      return 0;
  }
}

function headlineFor(total: number): string {
  if (total >= 90) return "Outstanding investigation";
  if (total >= 75) return "Strong scientific reasoning";
  if (total >= 60) return "Solid investigation";
  if (total >= 40) return "Promising start";
  return "Keep investigating";
}

function summaryFor(total: number, threshold: number, passed: boolean): string {
  if (passed) {
    return total >= 90
      ? "You predicted, controlled variables, cited evidence and explained the mechanism. That is the full scientific loop."
      : "You met the mastery threshold. Your reasoning is evidence-backed — check the next steps to sharpen it further.";
  }
  return `You are ${Math.max(0, threshold - total)} points from mastery. Nothing is lost: adjust your conclusion and retry — retries never cost XP.`;
}

/**
 * Deterministic, transparent rubric evaluation.
 *
 * The score is computed from structure and concept keywords only. It never
 * rewards speed, never punishes a wrong-but-testable prediction, and never
 * grants full marks for an unsupported correct guess. Mission-specific rubric
 * weights come from the mission definition so scoring stays configurable.
 */
export function evaluateAttempt(
  submission: HypothesisSubmission,
  options: EvaluateOptions,
): Evaluation {
  const criteria: CriterionScore[] = options.rubric.map((criterion) => {
    const score = clampScore(scoreFor(criterion.id, submission, options));
    const strong = score >= 3;
    return {
      id: criterion.id,
      label: criterion.label,
      weight: criterion.weight,
      score,
      maxScore: 4,
      strength: strong ? STRENGTH_COPY[criterion.id].strong : STRENGTH_COPY[criterion.id].partial,
      nextStep: strong ? PUSH_FURTHER_COPY[criterion.id] : NEXT_STEP_COPY[criterion.id],
    };
  });

  const total = round(
    criteria.reduce((sum, criterion) => sum + (criterion.score / criterion.maxScore) * criterion.weight, 0),
    1,
  );
  const passed = total >= options.masteryThreshold;

  return {
    criteria,
    total,
    masteryThreshold: options.masteryThreshold,
    passed,
    headline: headlineFor(total),
    summary: summaryFor(total, options.masteryThreshold, passed),
    strengths: criteria.filter((criterion) => criterion.score >= 3).map((criterion) => criterion.strength),
    nextSteps: criteria
      .filter((criterion) => criterion.score < 4)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((criterion) => criterion.nextStep),
    rubricVersion: RUBRIC_VERSION,
    createdAt: new Date().toISOString(),
  };
}
