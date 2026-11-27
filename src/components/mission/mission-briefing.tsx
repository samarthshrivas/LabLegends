"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  Clock,
  FlaskConical,
  Info,
  Lightbulb,
  ListChecks,
  Play,
  ShieldCheck,
  Target,
  Octagon,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { SubjectIcon } from "@/components/ui/subject-icon";
import { useDemoStore } from "@/lib/demo-store";
import type { Mission } from "@/types/domain";

export function MissionBriefing({ mission }: { mission: Mission }) {
  const router = useRouter();
  const { startAttempt, state } = useDemoStore();
  const completed = state.completedMissionIds.includes(mission.id);
  const attempts = state.attempts.filter((attempt) => attempt.missionId === mission.id);

  const begin = () => {
    startAttempt(mission.id);
    router.push(`/lab/${mission.id}`);
  };

  return (
    <div className="space-y-7">
      <PageHeader
        backHref="/missions"
        backLabel="All missions"
        eyebrow={mission.codename}
        title={mission.title}
        description={mission.hook}
        actions={
          <>
            <Chip tone={mission.subject}>{mission.subject}</Chip>
            <Chip tone="neutral">{mission.difficulty}</Chip>
            {completed ? <Chip tone="positive">Mastered</Chip> : null}
          </>
        }
      />

      <section className="panel relative overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start gap-5">
          <SubjectIcon subject={mission.subject} size="lg" />
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                The briefing
              </p>
              <div className="mt-3 max-w-3xl space-y-3">
                {mission.briefing.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-ink-soft sm:text-[0.9375rem]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-primary/25 bg-primary-soft/40 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <Target className="size-3.5" aria-hidden="true" />
                Your objective
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{mission.objective}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={begin} className={buttonStyles("primary", "lg")}>
                <Play className="size-4" aria-hidden="true" />
                Start investigation
              </button>
              <span className="flex items-center gap-1.5 text-xs text-ink-faint">
                <ShieldCheck className="size-3.5 text-positive" aria-hidden="true" />
                Simulated experiment · no real equipment
              </span>
            </div>
          </div>
        </div>
      </section>

      {mission.reviewStatus === "pending-subject-review" ? (
        <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-gold/30 bg-gold-soft/40 p-4">
          <Octagon className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-ink">Conceptual model — pending subject review</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              The biology model uses relative units and has not yet been approved by a subject reviewer. Treat
              feedback from this mission as formative, not as assessed scientific fact.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Before you begin"
              title="What you will do"
              description="The lab keeps you inside this sequence. You cannot run the decisive experiment before recording a prediction."
            />
            <ol className="mt-5 space-y-3">
              {mission.objectives.map((objective, index) => (
                <li key={objective} className="flex items-start gap-3">
                  <span className="numeric grid size-7 shrink-0 place-items-center rounded-full border border-line bg-panel-soft text-[0.6875rem] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{objective}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Concepts" title="What this mission is really about" />
            <div className="mt-4 flex flex-wrap gap-2">
              {mission.concepts.map((concept) => (
                <span key={concept} className="rounded-full border border-line bg-panel-soft px-3 py-1.5 text-xs text-ink-soft">
                  {concept}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-line pt-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">
                <Lightbulb className="size-3.5 text-gold" aria-hidden="true" />
                Misconceptions this mission targets
              </p>
              {mission.misconceptions.map((item) => (
                <p key={item} className="text-sm text-ink-soft">
                  {item}
                </p>
              ))}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Apparatus" title="Your virtual bench" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {mission.apparatus.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl border border-line bg-panel-soft px-3 py-2.5 text-xs leading-relaxed text-ink-soft">
                  <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Mission data" title="At a glance" />
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { icon: Clock, label: "Estimated effort", value: `${mission.estimatedMinutes} minutes` },
                { icon: Zap, label: "Base reward", value: `${mission.baseXp} XP` },
                { icon: Target, label: "Mastery threshold", value: `${mission.masteryThreshold} / 100` },
                { icon: ListChecks, label: "Rubric criteria", value: `${mission.rubric.length} weighted criteria` },
                { icon: BookOpen, label: "Grade band", value: `Grades ${mission.gradeBand}` },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="flex items-center gap-2 text-ink-faint">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {row.label}
                    </dt>
                    <dd className="numeric text-right font-medium text-ink">{row.value}</dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-4">
              <Progress
                value={mission.masteryThreshold}
                label="Mastery threshold"
                tone="primary"
                size="sm"
                showValue
              />
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Scoring" title="How you will be evaluated" />
            <ul className="mt-4 space-y-2.5">
              {mission.rubric.map((criterion) => (
                <li key={criterion.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{criterion.label}</p>
                    <p className="mt-0.5 text-[0.6875rem] leading-snug text-ink-faint">{criterion.description}</p>
                  </div>
                  <span className="numeric shrink-0 text-xs font-semibold text-primary">{criterion.weight}%</span>
                </li>
              ))}
            </ul>
          </Panel>

          <details className="panel group p-5 sm:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
              <span className="flex items-center gap-2">
                <Info className="size-4 text-accent" aria-hidden="true" />
                Model assumptions & sources
              </span>
              <span className="text-ink-faint transition-transform group-open:rotate-90">→</span>
            </summary>
            <div className="mt-4 space-y-3 border-t border-line pt-4">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">Limitations</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{mission.limitations}</p>
              </div>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">References</p>
                <ul className="mt-1 space-y-1">
                  {mission.references.map((reference) => (
                    <li key={reference} className="flex gap-2 text-xs leading-relaxed text-ink-soft">
                      <CircleCheck className="mt-0.5 size-3 shrink-0 text-positive" aria-hidden="true" />
                      {reference}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex items-start gap-2 text-[0.6875rem] leading-relaxed text-ink-faint">
                <ShieldCheck className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                This is an idealised teaching simulation, not a measurement or a real-world procedure.
              </p>
            </div>
          </details>

          {attempts.length > 0 ? (
            <Link href="/progress" className="panel flex items-center justify-between gap-3 p-4 transition-colors hover:border-line-strong">
              <span className="text-sm text-ink-soft">
                {attempts.length} previous attempt{attempts.length === 1 ? "" : "s"} recorded
              </span>
              <ArrowRight className="size-4 text-primary" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

