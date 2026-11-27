"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  Eye,
  Flame,
  FlaskConical,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FirstTimerBanner } from "@/components/layout/first-timer-banner";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MiniBars } from "@/components/ui/mini-bars";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { SubjectIcon } from "@/components/ui/subject-icon";
import { DEMO_WEEKLY_ACTIVITY } from "@/data/demo";
import { getMission, MISSIONS, SUBJECT_META } from "@/data/missions";
import { levelProgress } from "@/domain/rewards/rewards";
import { useDemoStore } from "@/lib/demo-store";
import type { BadgeDefinition, Subject } from "@/types/domain";

const BADGE_ICONS: Record<BadgeDefinition["icon"], typeof Eye> = {
  eye: Eye,
  sliders: SlidersHorizontal,
  search: Search,
  flask: FlaskConical,
  trophy: Trophy,
  spark: Sparkles,
};

const SUBJECTS: Subject[] = ["physics", "chemistry", "biology"];

export default function StudentHomePage() {
  const { state } = useDemoStore();
  const progress = levelProgress(state.student.xp);
  const activeAttempt = [...state.attempts]
    .filter((attempt) => attempt.status !== "completed")
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  const continueMission = getMission(activeAttempt?.missionId ?? "") ?? MISSIONS[0];
  const earnedBadges = state.student.badgeIds
    .map((id) => BADGE_ICONS[id as BadgeDefinition["icon"]] ?? BADGE_ICONS.spark)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mission control"
        title={`Good to see you, ${state.student.displayName.split(" ")[0]}.`}
        description="Every investigation starts with a question. Pick up where you left off, or open a new mystery."
        actions={
          <Link href="/missions" className={buttonStyles("outline", "md")}>
            Browse all missions
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <FirstTimerBanner />

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Panel className="relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <Chip tone="primary">
              <Play className="size-3" aria-hidden="true" />
              {activeAttempt ? "Continue investigation" : "Start your first investigation"}
            </Chip>
            <span className="text-xs text-ink-faint">
              {activeAttempt ? `${activeAttempt.runs.length} run${activeAttempt.runs.length === 1 ? "" : "s"} recorded` : "15–20 min"}
            </span>
          </div>

          <div className="relative mt-6 flex flex-wrap items-start gap-4">
            <SubjectIcon subject={continueMission.subject} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                {continueMission.codename}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">{continueMission.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{continueMission.hook}</p>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <div className="flex flex-wrap gap-2">
              {continueMission.concepts.slice(0, 3).map((concept) => (
                <span key={concept} className="rounded-full border border-line bg-panel-soft px-2.5 py-1 text-[0.6875rem] text-ink-soft">
                  {concept}
                </span>
              ))}
            </div>
            <Link href={`/lab/${continueMission.id}`} className={buttonStyles("primary", "md")}>
              {activeAttempt ? "Resume mission" : "Start investigation"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Panel>

        <Panel className="flex flex-col items-center justify-center gap-5 p-5 sm:p-6">
          <ScoreRing
            value={progress.intoLevel}
            max={progress.required}
            label={`Level ${progress.level}`}
            caption={`${progress.required - progress.intoLevel} XP to level ${progress.level + 1}`}
            size={148}
          />
          <div className="grid w-full grid-cols-3 gap-2 border-t border-line pt-4 text-center">
            <div>
              <p className="numeric text-lg font-semibold text-ink">{state.student.xp.toLocaleString()}</p>
              <p className="text-[0.625rem] uppercase tracking-wider text-ink-faint">Total XP</p>
            </div>
            <div>
              <p className="numeric flex items-center justify-center gap-1 text-lg font-semibold text-ink">
                <Flame className="size-4 text-gold" aria-hidden="true" />
                {state.student.streak}
              </p>
              <p className="text-[0.625rem] uppercase tracking-wider text-ink-faint">Day streak</p>
            </div>
            <div>
              <p className="numeric text-lg font-semibold text-ink">{state.student.badgeIds.length}</p>
              <p className="text-[0.625rem] uppercase tracking-wider text-ink-faint">Badges</p>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            eyebrow="Choose a lab"
            title="Your subjects"
            description="Three ways to practise the same evidence-first method."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {SUBJECTS.map((subject) => {
              const missions = MISSIONS.filter((mission) => mission.subject === subject);
              const completed = missions.filter((mission) => state.completedMissionIds.includes(mission.id)).length;
              return (
                <Link
                  key={subject}
                  href="/missions"
                  className="group rounded-2xl border border-line bg-panel-soft p-4 transition-colors hover:border-line-strong"
                >
                  <SubjectIcon subject={subject} />
                  <p className="mt-3 text-sm font-semibold text-ink">{SUBJECT_META[subject].label}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-ink-faint">{SUBJECT_META[subject].tagline}</p>
                  <Progress
                    value={completed}
                    max={missions.length}
                    label={`${subject} missions completed`}
                    tone={subject}
                    size="sm"
                    className="mt-4"
                  />
                  <p className="numeric mt-1.5 text-[0.625rem] text-ink-faint">
                    {completed} / {missions.length} complete
                  </p>
                </Link>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="This week" title="Time in the lab" />
            <MiniBars
              data={DEMO_WEEKLY_ACTIVITY.map((day) => ({ label: day.day, value: day.minutes }))}
              label="Minutes spent investigating this week"
              className="mt-5"
            />
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Recognition"
              title="Recent badges"
              action={
                <Link href="/progress" className="text-xs font-medium text-primary hover:underline">
                  View all
                </Link>
              }
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {earnedBadges.map((Icon, index) => (
                <span
                  key={index}
                  className="grid size-10 place-items-center rounded-xl border border-gold/25 bg-gold-soft text-gold"
                  title="Earned badge"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
              <Zap className="size-3.5 text-primary" aria-hidden="true" />
              Badges recognise reasoning skills, not speed.
            </p>
          </Panel>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Next investigations</h2>
          <Link href="/missions" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Full catalogue
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {MISSIONS.filter((mission) => mission.id !== continueMission.id).map((mission) => {
            const done = state.completedMissionIds.includes(mission.id);
            return (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="panel group flex items-start gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong"
              >
                <SubjectIcon subject={mission.subject} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                      {mission.codename}
                    </p>
                    {done ? <Chip tone="positive">Mastered</Chip> : null}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-ink">{mission.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{mission.hook}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs text-ink-faint">
        <Award className="size-3.5 text-gold" aria-hidden="true" />
        Demo profile: {state.student.displayName} · {state.student.gradeBand} · synthetic data
      </p>
    </div>
  );
}
