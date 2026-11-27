"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  Eye,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/section";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { getMission } from "@/data/missions";
import { badgeById } from "@/domain/rewards/rewards";
import { useDemoStore } from "@/lib/demo-store";
import { formatValue } from "@/lib/utils";
import type { BadgeDefinition } from "@/types/domain";

const BADGE_ICONS = {
  eye: Eye,
  sliders: SlidersHorizontal,
  search: Search,
  flask: FlaskConical,
  trophy: Trophy,
  spark: Sparkles,
} as const;

function BadgeCard({ badge }: { badge: BadgeDefinition }) {
  const Icon = BADGE_ICONS[badge.icon];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-panel-soft p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{badge.name}</p>
        <p className="mt-0.5 text-[0.6875rem] leading-snug text-ink-faint">{badge.description}</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const { state, restartAttempt } = useDemoStore();
  const attempt = state.attempts.find((item) => item.id === params.attemptId);
  const mission = attempt ? getMission(attempt.missionId) : undefined;

  if (!attempt || !mission || !attempt.evaluation) {
    return (
      <EmptyState
        icon={Search}
        title="No feedback for this attempt"
        description="This result may have been reset, or the link may be incomplete. Start a mission to generate feedback."
        action={
          <Link href="/missions" className={buttonStyles("primary", "md")}>
            Browse missions
          </Link>
        }
      />
    );
  }

  const evaluation = attempt.evaluation;
  const badges = attempt.evaluation && state.student.badgeIds.length > 0
    ? (["hypothesis-builder", "careful-observer", "variable-controller", "evidence-detective", "mission-solver"] as const)
        .map(badgeById)
        .filter((badge): badge is BadgeDefinition => Boolean(badge))
        .filter((badge) => state.student.badgeIds.includes(badge.id))
    : [];

  const retry = () => {
    const next = restartAttempt(mission.id);
    router.push(`/lab/${mission.id}?attempt=${next.id}`);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Link href="/progress" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint hover:text-primary">
            ← Your progress
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={mission.subject}>{mission.subject}</Chip>
            <Chip tone={evaluation.passed ? "positive" : "gold"}>
              {evaluation.passed ? "Mastered" : "Keep going"}
            </Chip>
            <Chip tone="neutral">rubric v{evaluation.rubricVersion}</Chip>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{evaluation.headline}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">{evaluation.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={retry} className={buttonStyles("outline", "md")}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
          <Link href="/missions" className={buttonStyles("primary", "md")}>
            Next mission
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <section className="panel grid gap-6 p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center">
        <ScoreRing
          value={evaluation.total}
          max={100}
          label="Reasoning score"
          caption={`Mastery at ${evaluation.masteryThreshold}`}
          tone={evaluation.passed ? "positive" : "primary"}
          size={176}
        />
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Zap, label: "XP awarded", value: `+${attempt.xpAwarded}` },
              { icon: FlaskConical, label: "Runs recorded", value: String(attempt.runs.length) },
              { icon: Lightbulb, label: "Hints used", value: String(attempt.hintsUsed) },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-line bg-panel-soft p-3.5">
                  <p className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-faint">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {item.label}
                  </p>
                  <p className="numeric mt-1.5 text-xl font-semibold text-ink">{item.value}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed text-ink-faint">
            XP rewards reasoning quality, evidence and persistence. It never rewards speed, and retries never
            reduce what you earned.
          </p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            eyebrow="Rubric breakdown"
            title="How each criterion scored"
            description="Every score comes from deterministic rules applied to what you wrote and ran."
          />
          <ul className="mt-5 space-y-4">
            {evaluation.criteria.map((criterion) => (
              <li key={criterion.id} className="space-y-2 border-b border-line pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{criterion.label}</p>
                  <p className="numeric text-xs text-ink-faint">
                    {criterion.score}/{criterion.maxScore} · {criterion.weight}% of total
                  </p>
                </div>
                <Progress
                  value={(criterion.score / criterion.maxScore) * 100}
                  label={`${criterion.label} score`}
                  tone={criterion.score >= 3 ? "positive" : "gold"}
                  size="sm"
                />
                <p className="text-xs leading-relaxed text-ink-soft">{criterion.strength}</p>
                <p className="flex items-start gap-1.5 text-[0.6875rem] leading-relaxed text-ink-faint">
                  <Lightbulb className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                  {criterion.nextStep}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="What worked" title="Your strengths" />
            <ul className="mt-4 space-y-2.5">
              {evaluation.strengths.length > 0 ? (
                evaluation.strengths.map((strength) => (
                  <li key={strength} className="flex gap-2.5 text-xs leading-relaxed text-ink-soft">
                    <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-positive" aria-hidden="true" />
                    {strength}
                  </li>
                ))
              ) : (
                <li className="text-xs text-ink-faint">Every criterion has a next step — that is normal on a first attempt.</li>
              )}
            </ul>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Next attempt" title="Sharpen your reasoning" />
            <ol className="mt-4 space-y-2.5">
              {evaluation.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-2.5 text-xs leading-relaxed text-ink-soft">
                  <span className="numeric grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[0.625rem] text-primary">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Recognition" title="Badges earned" />
            <div className="mt-4 space-y-2">
              {badges.length > 0 ? (
                badges.map((badge) => <BadgeCard key={badge.id} badge={badge} />)
              ) : (
                <p className="text-xs text-ink-faint">Badges appear as you build habits across missions.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="p-5 sm:p-6">
        <PanelHeader
          eyebrow="Evidence trail"
          title="What you submitted"
          description="Your work is kept in demo mode so you can compare attempts."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            { label: "Prediction", value: attempt.prediction },
            { label: "Reasoning", value: attempt.justification },
            { label: "Conclusion", value: attempt.conclusion },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-panel-soft p-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">{item.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.value || "—"}</p>
            </div>
          ))}
        </div>
        <p className="numeric mt-4 text-xs text-ink-faint">
          {attempt.runs.length} run{attempt.runs.length === 1 ? "" : "s"} · final score {formatValue(evaluation.total, 1)} / 100
        </p>
      </Panel>
    </div>
  );
}
