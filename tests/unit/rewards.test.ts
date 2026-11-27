import { describe, expect, it } from "vitest";
import {
  BADGES,
  calculateXp,
  evaluateBadges,
  levelProgress,
  xpFactor,
} from "@/domain/rewards/rewards";
import { evaluateAttempt } from "@/domain/evaluation/rubric";
import { MISSIONS } from "@/data/missions";
import type { Attempt, Evaluation, ExperimentRun } from "@/types/domain";

const mission = MISSIONS[0];

const runs: ExperimentRun[] = [1, 2, 3].map((index) => ({
  id: `r${index}`,
  runNumber: index,
  parameters: { voltage: 12, resistance: 12 / index },
  observations: [
    { id: "current", label: "Current", value: index, unit: "A", description: "" },
  ],
  warnings: [],
  createdAt: "2026-11-25T09:00:00.000Z",
}));

const evaluation: Evaluation = {
  criteria: mission.rubric.map((criterion) => ({
    id: criterion.id,
    label: criterion.label,
    weight: criterion.weight,
    score: 4,
    maxScore: 4,
    strength: "Strong",
    nextStep: "Keep going",
  })),
  total: 100,
  masteryThreshold: mission.masteryThreshold,
  passed: true,
  headline: "Outstanding investigation",
  summary: "Mastered",
  strengths: [],
  nextSteps: [],
  rubricVersion: "1.0.0",
  createdAt: "2026-11-25T09:00:00.000Z",
};

const attempt: Attempt = {
  id: "attempt_test",
  missionId: mission.id,
  missionVersion: 1,
  status: "completed",
  prediction: "If resistance falls, current rises because V = IR.",
  justification: "Current is inversely proportional to resistance at constant voltage.",
  conclusion: "The evidence shows current rose from 1 A to 3 A because voltage was constant.",
  runs,
  hintsUsed: 0,
  revealedHintIds: [],
  evaluation,
  xpAwarded: 0,
  startedAt: "2026-11-25T09:00:00.000Z",
  completedAt: "2026-11-25T09:05:00.000Z",
};

describe("Rewards", () => {
  it("maps reasoning score to a bounded XP factor", () => {
    expect(xpFactor(0)).toBe(0.25);
    expect(xpFactor(100)).toBe(1);
    expect(xpFactor(150)).toBe(1);
    expect(xpFactor(50)).toBeGreaterThan(xpFactor(25));
  });

  it("awards reasoning XP plus a capped persistence bonus", () => {
    const result = calculateXp(mission.baseXp, evaluation, attempt);
    expect(result.factor).toBe(1);
    expect(result.xp).toBe(mission.baseXp + 14);
    expect(result.breakdown.map((item) => item.label)).toEqual([
      "Reasoning score",
      "Evidence & persistence bonus",
    ]);
  });

  it("never includes a speed term", () => {
    const result = calculateXp(mission.baseXp, evaluation, { runs: [] });
    expect(JSON.stringify(result)).not.toMatch(/speed|time|duration/i);
    expect(result.xp).toBe(mission.baseXp + 6);
  });

  it("computes level progress", () => {
    expect(levelProgress(0)).toMatchObject({ level: 1, intoLevel: 0, percent: 0 });
    expect(levelProgress(500)).toMatchObject({ level: 2, intoLevel: 0, percent: 0 });
    expect(levelProgress(750)).toMatchObject({ level: 2, intoLevel: 250, percent: 50 });
  });

  it("earns badges from behaviours, not from speed", () => {
    const earned = evaluateBadges(attempt, evaluation);
    expect(earned).toEqual(BADGES.map((badge) => badge.id));
    expect(evaluateBadges({ ...attempt, runs: [] }, evaluation)).not.toContain("careful-observer");
  });

  it("stays consistent with the rubric evaluator", () => {
    const evaluated = evaluateAttempt(
      {
        prediction: attempt.prediction,
        justification: attempt.justification,
        conclusion: attempt.conclusion,
        runs,
      },
      {
        rubric: mission.rubric,
        masteryThreshold: mission.masteryThreshold,
        concepts: mission.concepts,
        subject: mission.subject,
      },
    );
    expect(evaluated.passed).toBe(true);
  });
});
