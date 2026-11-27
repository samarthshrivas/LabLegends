import type {
  Attempt,
  DemoState,
  Evaluation,
  ExperimentRun,
} from "@/types/domain";
import { getMission } from "@/data/missions";
import { requireExperimentModel } from "@/domain/experiments";
import { evaluateAttempt, RUBRIC_VERSION } from "@/domain/evaluation/rubric";


/**
 * Synthetic demo data. No real learner information is used anywhere in this
 * project; every name here is invented for interface demonstration.
 */

const DAY = 86_400_000;

/**
 * Fixed anchor used for the first server render so markup is deterministic.
 * The client re-seeds with a live anchor once it has mounted.
 */
export const SEED_ANCHOR = Date.parse("2026-11-25T09:00:00.000Z");

function isoDaysAgo(anchorMs: number, days: number, hours = 0): string {
  return new Date(anchorMs - days * DAY - hours * 3_600_000).toISOString();
}

function buildRun(
  missionId: string,
  parameters: Record<string, number>,
  runNumber: number,
  createdAt: string,
): ExperimentRun {
  const mission = getMission(missionId);
  if (!mission) throw new Error(`Unknown mission ${missionId}`);
  const model = requireExperimentModel(mission.experimentModelId);
  const result = model.run({ parameters });
  return {
    id: `run_${missionId}_seed_${runNumber}`,
    runNumber,
    parameters,
    observations: result.observations,
    warnings: result.warnings,
    createdAt,
  };
}

function buildEvaluation(missionId: string, attempt: Attempt): Evaluation {
  const mission = getMission(missionId);
  if (!mission) throw new Error(`Unknown mission ${missionId}`);
  return evaluateAttempt(
    {
      prediction: attempt.prediction,
      justification: attempt.justification,
      conclusion: attempt.conclusion,
      runs: attempt.runs,
    },
    {
      rubric: mission.rubric,
      masteryThreshold: mission.masteryThreshold,
      concepts: mission.concepts,
      subject: mission.subject,
    },
  );
}

function buildAttempt(config: {
  missionId: string;
  anchorMs: number;
  daysAgo: number;
  prediction: string;
  justification: string;
  conclusion: string;
  parameterSets: Record<string, number>[];
  status: Attempt["status"];
  xpAwarded: number;
}): Attempt {
  const mission = getMission(config.missionId);
  if (!mission) throw new Error(`Unknown mission ${config.missionId}`);
  const startedAt = isoDaysAgo(config.anchorMs, config.daysAgo, 2);
  const runs = config.parameterSets.map((parameters, index) =>
    buildRun(
      config.missionId,
      parameters,
      index + 1,
      isoDaysAgo(config.anchorMs, config.daysAgo, 1.5 - index * 0.2),
    ),
  );
  const draft: Attempt = {
    id: `attempt_${config.missionId}_seed`,
    missionId: config.missionId,
    missionVersion: mission.version,
    status: config.status,
    prediction: config.prediction,
    justification: config.justification,
    conclusion: config.conclusion,
    runs,
    hintsUsed: 0,
    revealedHintIds: [],
    evaluation: null,
    xpAwarded: config.xpAwarded,
    startedAt,
    completedAt: config.status === "completed" ? isoDaysAgo(config.anchorMs, config.daysAgo, 0.5) : null,
  };
  draft.evaluation = buildEvaluation(config.missionId, draft);
  return draft;
}

export function createSeedState(anchorMs: number = SEED_ANCHOR): DemoState {
  const physicsAttempt = buildAttempt({
    missionId: "satellite-went-dark",
    anchorMs,
    daysAgo: 2,
    prediction:
      "If resistance goes up and voltage stays at 12 V, the current will go down.",
    justification:
      "Current is voltage divided by resistance, so a larger resistance means a smaller current.",
    conclusion:
      "The evidence shows the current fell from 1.20 A at 10 Ω to 0.60 A at 20 Ω while voltage stayed at 12 V. That matches I = V / R because doubling the resistance halved the current.",
    parameterSets: [
      { voltage: 12, resistance: 10 },
      { voltage: 12, resistance: 20 },
      { voltage: 12, resistance: 40 },
    ],
    status: "completed",
    xpAwarded: 132,
  });

  const chemistryAttempt = buildAttempt({
    missionId: "mystery-of-concentration",
    anchorMs,
    daysAgo: 1,
    prediction: "The concentration will go up when more water is added.",
    justification: "More liquid usually means a stronger solution.",
    conclusion: "The reading changed but I think the report is still confusing.",
    parameterSets: [
      { initialConcentration: 1, initialVolume: 50, finalVolume: 100 },
      { initialConcentration: 1, initialVolume: 50, finalVolume: 250 },
    ],
    status: "retry",
    xpAwarded: 0,
  });

  return {
    role: null,
    student: {
      displayName: "Ava Chen",
      gradeBand: "9-10",
      xp: 1240,
      streak: 4,
      badgeIds: ["careful-observer", "hypothesis-builder", "variable-controller"],
    },
    attempts: [physicsAttempt, chemistryAttempt],
    completedMissionIds: ["satellite-went-dark"],
    lastVisitedAt: isoDaysAgo(anchorMs, 0, 3),
  };
}

/* -------------------------------------------------------------------------- */
/* Teacher demo data                                                          */
/* -------------------------------------------------------------------------- */

export interface DemoClass {
  id: string;
  name: string;
  code: string;
  subjectFocus: string;
  studentCount: number;
  assignedMissions: number;
  avgCompletion: number;
  avgMastery: number;
  lastActive: string;
}

export const DEMO_CLASSES: DemoClass[] = [
  {
    id: "class-9b",
    name: "Grade 9B · Integrated Science",
    code: "KESTREL-9B",
    subjectFocus: "All subjects",
    studentCount: 28,
    assignedMissions: 3,
    avgCompletion: 71,
    avgMastery: 68,
    lastActive: "12 minutes ago",
  },
  {
    id: "class-10a",
    name: "Grade 10A · Physics",
    code: "ORBIT-10A",
    subjectFocus: "Physics",
    studentCount: 24,
    assignedMissions: 2,
    avgCompletion: 83,
    avgMastery: 76,
    lastActive: "1 hour ago",
  },
  {
    id: "class-11c",
    name: "Grade 11C · Chemistry",
    code: "SOLUTE-11C",
    subjectFocus: "Chemistry",
    studentCount: 19,
    assignedMissions: 1,
    avgCompletion: 58,
    avgMastery: 61,
    lastActive: "Yesterday",
  },
];

export interface DemoStudentRow {
  id: string;
  displayName: string;
  completed: number;
  attempts: number;
  mastery: number;
  misconception: string;
  lastActive: string;
}

export const DEMO_ROSTER: Record<string, DemoStudentRow[]> = {
  "class-9b": [
    { id: "s1", displayName: "Ava C.", completed: 2, attempts: 3, mastery: 84, misconception: "None flagged", lastActive: "Today" },
    { id: "s2", displayName: "Noah R.", completed: 1, attempts: 4, mastery: 62, misconception: "More resistance → more current", lastActive: "Today" },
    { id: "s3", displayName: "Mira K.", completed: 2, attempts: 2, mastery: 91, misconception: "None flagged", lastActive: "Yesterday" },
    { id: "s4", displayName: "Jonah P.", completed: 0, attempts: 2, mastery: 38, misconception: "Adds water → adds solute", lastActive: "2 days ago" },
    { id: "s5", displayName: "Lena S.", completed: 1, attempts: 3, mastery: 71, misconception: "Light always limits rate", lastActive: "Today" },
    { id: "s6", displayName: "Theo M.", completed: 1, attempts: 1, mastery: 66, misconception: "None flagged", lastActive: "3 days ago" },
    { id: "s7", displayName: "Priya D.", completed: 2, attempts: 3, mastery: 88, misconception: "None flagged", lastActive: "Today" },
    { id: "s8", displayName: "Sam O.", completed: 0, attempts: 1, mastery: 24, misconception: "Guessing without evidence", lastActive: "4 days ago" },
  ],
  "class-10a": [
    { id: "s9", displayName: "Iris W.", completed: 2, attempts: 2, mastery: 89, misconception: "None flagged", lastActive: "Today" },
    { id: "s10", displayName: "Kai L.", completed: 2, attempts: 4, mastery: 74, misconception: "More resistance → more current", lastActive: "Today" },
    { id: "s11", displayName: "Nadia F.", completed: 1, attempts: 3, mastery: 68, misconception: "Current is used up", lastActive: "Yesterday" },
    { id: "s12", displayName: "Owen B.", completed: 0, attempts: 2, mastery: 41, misconception: "Changing two variables at once", lastActive: "2 days ago" },
  ],
  "class-11c": [
    { id: "s13", displayName: "Hana T.", completed: 1, attempts: 2, mastery: 78, misconception: "None flagged", lastActive: "Today" },
    { id: "s14", displayName: "Diego V.", completed: 0, attempts: 3, mastery: 52, misconception: "Adds water → adds solute", lastActive: "Yesterday" },
    { id: "s15", displayName: "Amara N.", completed: 1, attempts: 1, mastery: 81, misconception: "None flagged", lastActive: "2 days ago" },
    { id: "s16", displayName: "Felix H.", completed: 0, attempts: 1, mastery: 33, misconception: "Concentration unaffected by volume", lastActive: "5 days ago" },
  ],
};

export interface MisconceptionRow {
  label: string;
  subject: string;
  students: number;
  trend: "down" | "flat" | "up";
}

export const DEMO_MISCONCEPTIONS: MisconceptionRow[] = [
  { label: "More resistance always means more current", subject: "Physics", students: 7, trend: "down" },
  { label: "Adding water increases the amount of solute", subject: "Chemistry", students: 5, trend: "flat" },
  { label: "Increasing any one factor raises the rate without limit", subject: "Biology", students: 6, trend: "down" },
  { label: "Changing two variables at once is a fair test", subject: "Cross-subject", students: 4, trend: "up" },
  { label: "A correct guess deserves full marks", subject: "Cross-subject", students: 3, trend: "flat" },
];

export interface ActivityItem {
  id: string;
  student: string;
  action: string;
  mission: string;
  when: string;
  score: number | null;
}

export const DEMO_ACTIVITY: ActivityItem[] = [
  { id: "a1", student: "Ava C.", action: "Completed mission", mission: "The Satellite That Went Dark", when: "12 min ago", score: 84 },
  { id: "a2", student: "Noah R.", action: "Retried with hints", mission: "The Satellite That Went Dark", when: "26 min ago", score: null },
  { id: "a3", student: "Mira K.", action: "Submitted hypothesis", mission: "The Mystery of the Concentration", when: "48 min ago", score: null },
  { id: "a4", student: "Lena S.", action: "Completed mission", mission: "The Greenhouse Signal", when: "1 hr ago", score: 77 },
  { id: "a5", student: "Jonah P.", action: "Started mission", mission: "The Mystery of the Concentration", when: "2 hr ago", score: null },
];

export const DEMO_WEEKLY_ACTIVITY = [
  { day: "Mon", minutes: 18 },
  { day: "Tue", minutes: 32 },
  { day: "Wed", minutes: 12 },
  { day: "Thu", minutes: 45 },
  { day: "Fri", minutes: 28 },
  { day: "Sat", minutes: 0 },
  { day: "Sun", minutes: 22 },
];

export const DEMO_RUBRIC_VERSION = RUBRIC_VERSION;

