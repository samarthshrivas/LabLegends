/**
 * Shared domain types. These mirror `docs/ARCHITECTURE.md` and are intentionally
 * free of React so the simulation, evaluation and reward layers stay testable.
 */

export type Subject = "physics" | "chemistry" | "biology";

export type GradeBand = "6-8" | "9-10" | "11-12" | "undergrad";

export type Difficulty = "starter" | "core" | "challenge";

export type ParameterValue = number | string | boolean;

export interface ExperimentInput {
  parameters: Record<string, ParameterValue>;
  seed?: number;
}

export interface Observation {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ExperimentResult {
  observations: Observation[];
  explanation: string;
  modelVersion: string;
  warnings: string[];
}

export interface ExperimentModel {
  id: string;
  version: string;
  validate(input: ExperimentInput): ValidationResult;
  run(input: ExperimentInput): ExperimentResult;
}

export interface ParameterSpec {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  decimals: number;
  help: string;
}

export interface MissionHint {
  id: string;
  title: string;
  body: string;
}

export interface RubricCriterion {
  id: CriterionId;
  label: string;
  weight: number;
  description: string;
}

export type CriterionId =
  | "prediction"
  | "justification"
  | "control"
  | "evidence"
  | "conclusion";

export interface Mission {
  id: string;
  version: number;
  title: string;
  codename: string;
  subject: Subject;
  gradeBand: GradeBand;
  difficulty: Difficulty;
  estimatedMinutes: number;
  baseXp: number;
  hook: string;
  briefing: string[];
  objective: string;
  objectives: string[];
  concepts: string[];
  misconceptions: string[];
  apparatus: string[];
  experimentModelId: string;
  parameters: ParameterSpec[];
  hypothesisPrompt: string;
  conclusionPrompt: string;
  hints: MissionHint[];
  rubric: RubricCriterion[];
  masteryThreshold: number;
  limitations: string;
  references: string[];
  simulated: true;
  available: boolean;
  reviewStatus: "reviewed" | "pending-subject-review";
}

export interface ExperimentRun {
  id: string;
  runNumber: number;
  parameters: Record<string, number>;
  observations: Observation[];
  warnings: string[];
  createdAt: string;
}

export interface CriterionScore {
  id: CriterionId;
  label: string;
  weight: number;
  score: number;
  maxScore: number;
  strength: string;
  nextStep: string;
}

export interface Evaluation {
  criteria: CriterionScore[];
  total: number;
  masteryThreshold: number;
  passed: boolean;
  headline: string;
  summary: string;
  strengths: string[];
  nextSteps: string[];
  rubricVersion: string;
  createdAt: string;
}

export type AttemptStatus = "in_progress" | "retry" | "completed";

export interface Attempt {
  id: string;
  missionId: string;
  missionVersion: number;
  status: AttemptStatus;
  prediction: string;
  justification: string;
  conclusion: string;
  runs: ExperimentRun[];
  hintsUsed: number;
  revealedHintIds: string[];
  evaluation: Evaluation | null;
  xpAwarded: number;
  startedAt: string;
  completedAt: string | null;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: "eye" | "sliders" | "search" | "flask" | "trophy" | "spark";
  tone: "primary" | "accent" | "gold" | "positive";
}

export interface StudentProfile {
  displayName: string;
  gradeBand: GradeBand;
  xp: number;
  streak: number;
  badgeIds: string[];
}

export type Role = "student" | "teacher";

export interface DemoState {
  role: Role | null;
  student: StudentProfile;
  attempts: Attempt[];
  completedMissionIds: string[];
  lastVisitedAt: string | null;
}
