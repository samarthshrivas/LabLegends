import { describe, expect, it } from "vitest";
import { evaluateAttempt } from "@/domain/evaluation/rubric";
import { MISSIONS } from "@/data/missions";
import type { ExperimentRun } from "@/types/domain";

const mission = MISSIONS[0];

function run(id: string, resistance: number, current: number): ExperimentRun {
  return {
    id,
    runNumber: Number(id.replace("r", "")),
    parameters: { voltage: 12, resistance },
    observations: [
      { id: "voltage", label: "Supply voltage", value: 12, unit: "V", description: "" },
      { id: "resistance", label: "Resistance", value: resistance, unit: "Ω", description: "" },
      { id: "current", label: "Current", value: current, unit: "A", description: "" },
    ],
    warnings: [],
    createdAt: "2026-11-25T09:00:00.000Z",
  };
}

const runs = [run("r1", 12, 1), run("r2", 6, 2), run("r3", 4, 3)];

const strongSubmission = {
  prediction: "If resistance decreases from 12 to 6 ohms, current will increase from 1.00 A to 2.00 A.",
  justification: "Because V = IR, current is inversely proportional to resistance when voltage is held constant.",
  conclusion:
    "The evidence shows current increased from 1.00 A to 2.00 A when resistance halved, because voltage was held constant and current is inversely proportional to resistance. This supports my prediction.",
  runs,
};

const options = {
  rubric: mission.rubric,
  masteryThreshold: mission.masteryThreshold,
  concepts: mission.concepts,
  subject: mission.subject,
};

describe("Deterministic rubric evaluation", () => {
  it("awards mastery for a testable, evidence-backed investigation", () => {
    const evaluation = evaluateAttempt(strongSubmission, options);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.total).toBeGreaterThanOrEqual(mission.masteryThreshold);
    expect(evaluation.criteria).toHaveLength(mission.rubric.length);
    expect(evaluation.criteria.every((criterion) => criterion.score === 4)).toBe(true);
  });

  it("does not reward an unsupported guess", () => {
    const evaluation = evaluateAttempt(
      {
        prediction: "maybe something happens",
        justification: "I don't know",
        conclusion: "I think it was right",
        runs: [],
      },
      options,
    );
    expect(evaluation.passed).toBe(false);
    expect(evaluation.total).toBeLessThan(mission.masteryThreshold);
    expect(evaluation.nextSteps.length).toBeGreaterThan(0);
  });

  it("ignores time and rewards controlled comparisons", () => {
    const slow = evaluateAttempt(strongSubmission, options);
    const fast = evaluateAttempt(
      { ...strongSubmission, runs: runs.map((item) => ({ ...item, createdAt: "2026-11-26T09:00:00.000Z" })) },
      options,
    );
    expect(fast.total).toBe(slow.total);
    expect(JSON.stringify(fast)).not.toMatch(/speed|duration|elapsed/i);
  });

  it("uses the mission rubric weights", () => {
    const evaluation = evaluateAttempt(strongSubmission, options);
    const weightSum = evaluation.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    expect(weightSum).toBe(100);
  });
});
