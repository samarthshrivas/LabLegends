import type { Attempt, BadgeDefinition, Evaluation } from "@/types/domain";
import { clamp, round } from "@/lib/utils";

/**
 * Rewards are deterministic and server-authoritative in production. In demo
 * mode the same pure functions run in the browser. No speed bonus exists, and
 * retries never reduce XP — persistence is capped so it cannot be farmed.
 */

export const XP_RULES = {
  minimumFactor: 0.25,
  persistenceCap: 20,
  runsBonus: 8,
  evidenceBonus: 6,
} as const;

export const LEVEL_XP = 500;

export function xpFactor(totalScore: number): number {
  const normalised = clamp(totalScore, 0, 100) / 100;
  return round(XP_RULES.minimumFactor + (1 - XP_RULES.minimumFactor) * normalised, 3);
}

export interface XpBreakdownItem {
  label: string;
  amount: number;
}

export interface XpResult {
  xp: number;
  factor: number;
  breakdown: XpBreakdownItem[];
}

export function calculateXp(
  baseXp: number,
  evaluation: Evaluation,
  attempt: Pick<Attempt, "runs">,
): XpResult {
  const factor = xpFactor(evaluation.total);
  const reasoningXp = Math.round(baseXp * factor);

  const persistence = Math.min(
    XP_RULES.persistenceCap,
    (attempt.runs.length >= 3 ? XP_RULES.runsBonus : 0) +
      (evaluation.criteria.find((criterion) => criterion.id === "evidence")?.score === 4
        ? XP_RULES.evidenceBonus
        : 0),
  );

  const breakdown: XpBreakdownItem[] = [
    { label: "Reasoning score", amount: reasoningXp },
  ];
  if (persistence > 0) {
    breakdown.push({ label: "Evidence & persistence bonus", amount: persistence });
  }

  return { xp: reasoningXp + persistence, factor, breakdown };
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / LEVEL_XP) + 1;
}

export function levelProgress(xp: number): { level: number; intoLevel: number; required: number; percent: number } {
  const level = levelFromXp(xp);
  const intoLevel = xp % LEVEL_XP;
  return {
    level,
    intoLevel,
    required: LEVEL_XP,
    percent: clamp((intoLevel / LEVEL_XP) * 100, 0, 100),
  };
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "hypothesis-builder",
    name: "Hypothesis Builder",
    description: "Submitted a testable prediction with a scientific justification.",
    icon: "flask",
    tone: "primary",
  },
  {
    id: "careful-observer",
    name: "Careful Observer",
    description: "Recorded observations across at least three experiment runs.",
    icon: "eye",
    tone: "accent",
  },
  {
    id: "variable-controller",
    name: "Variable Controller",
    description: "Ran a fair test — one variable changed while another stayed constant.",
    icon: "sliders",
    tone: "positive",
  },
  {
    id: "evidence-detective",
    name: "Evidence Detective",
    description: "Cited a recorded observation to support a conclusion.",
    icon: "search",
    tone: "gold",
  },
  {
    id: "mission-solver",
    name: "Mission Solver",
    description: "Reached the mastery threshold on a mystery mission.",
    icon: "trophy",
    tone: "gold",
  },
];

export function badgeById(id: string): BadgeDefinition | undefined {
  return BADGES.find((badge) => badge.id === id);
}

function hasControlledPair(attempt: Attempt): boolean {
  const runs = attempt.runs;
  for (let i = 0; i < runs.length; i += 1) {
    for (let j = i + 1; j < runs.length; j += 1) {
      const keys = new Set([...Object.keys(runs[i].parameters), ...Object.keys(runs[j].parameters)]);
      let changed = 0;
      let unchanged = 0;
      keys.forEach((key) => {
        if (Math.abs((runs[i].parameters[key] ?? 0) - (runs[j].parameters[key] ?? 0)) > 1e-9) changed += 1;
        else unchanged += 1;
      });
      if (changed === 1 && unchanged >= 1) return true;
    }
  }
  return false;
}

export function evaluateBadges(attempt: Attempt, evaluation: Evaluation): string[] {
  const earned: string[] = [];

  if (attempt.prediction.trim().length > 12 && attempt.justification.trim().length > 12) {
    earned.push("hypothesis-builder");
  }
  if (attempt.runs.length >= 3) {
    earned.push("careful-observer");
  }
  if (hasControlledPair(attempt)) {
    earned.push("variable-controller");
  }
  if ((evaluation.criteria.find((criterion) => criterion.id === "evidence")?.score ?? 0) >= 3) {
    earned.push("evidence-detective");
  }
  if (evaluation.passed) {
    earned.push("mission-solver");
  }

  return earned;
}
