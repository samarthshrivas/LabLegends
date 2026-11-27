"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  CircleCheck,
  Clock,
  Eye,
  FlaskConical,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/section";
import { MiniBars } from "@/components/ui/mini-bars";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { DEMO_WEEKLY_ACTIVITY } from "@/data/demo";
import { MISSIONS, SUBJECT_META, getMission } from "@/data/missions";
import { BADGES, levelProgress } from "@/domain/rewards/rewards";
import { useDemoStore } from "@/lib/demo-store";
import { cn, formatValue } from "@/lib/utils";
import type { BadgeDefinition, Subject } from "@/types/domain";

const BADGE_ICONS = {
  eye: Eye,
  sliders: SlidersHorizontal,
  search: Search,
  flask: FlaskConical,
  trophy: Trophy,
  spark: Sparkles,
} as const;

export default function ProgressPage() {
  const router = useRouter();
  const { state, resetDemo } = useDemoStore();
  const level = levelProgress(state.student.xp);
  const attempts = [...state.attempts].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
  const scored = attempts.filter((attempt) => attempt.evaluation);
  const average = scored.length > 0
    ? scored.reduce((sum, attempt) => sum + (attempt.evaluation?.total ?? 0), 0) / scored.length
    : 0;

  const subjectAverages = (["physics", "chemistry", "biology"] as Subject[]).map((subject) => {
    const relevant = scored.filter((attempt) => getMission(attempt.missionId)?.subject === subject);
    return {
      subject,
      value: relevant.length > 0
        ? relevant.reduce((sum, attempt) => sum + (attempt.evaluation?.total ?? 0), 0) / relevant.length
        : 0,
      count: relevant.length,
    };
  });

  const earnedBadges: BadgeDefinition[] = BADGES.filter((badge) => state.student.badgeIds.includes(badge.id));

  const handleReset = () => {
    if (!window.confirm("Reset all demo progress? This cannot be undone.")) return;
    resetDemo();
    router.push("/student");
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Learning record"
        title="Your progress"
        description="A transparent view of what you have practised, what you have mastered and what to try next."
        actions={
          <button type="button" onClick={handleReset} className={buttonStyles("ghost", "sm")}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset demo
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Zap, label: "Total XP", value: state.student.xp, sub: `Level ${level.level}`, tone: "gold" as const },
          { icon: CircleCheck, label: "Missions mastered", value: state.completedMissionIds.length, sub: `of ${MISSIONS.length} available`, tone: "primary" as const },
          { icon: Award, label: "Badges earned", value: earnedBadges.length, sub: `of ${BADGES.length} possible`, tone: "primary" as const },
          { icon: Clock, label: "Average reasoning", value: formatValue(average, 0), sub: "across submitted attempts", tone: "primary" as const },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="panel flex items-start gap-3 p-4">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl border",
                  stat.tone === "gold" ? "border-gold/25 bg-gold-soft text-gold" : "border-primary/25 bg-primary-soft text-primary",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">{stat.label}</p>
                <p className="numeric mt-1 text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="Level" title={`Level ${level.level}`} description={`${level.required - level.intoLevel} XP until the next level.`} />
          <div className="mt-5">
            <Progress
              value={level.intoLevel}
              max={level.required}
              label="Level progress"
              tone="gold"
              showValue
            />
          </div>
          <div className="mt-6 flex items-center gap-5 border-t border-line pt-5">
            <ScoreRing value={average} label="Average score" caption="all attempts" tone="primary" size={120} strokeWidth={8} />
            <p className="text-xs leading-relaxed text-ink-soft">
              Scores measure the quality of your reasoning: prediction, fair testing, evidence and explanation.
              Time taken and retries never lower a score.
            </p>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="This week" title="Learning time" description="Minutes spent investigating in the demo record." />
          <div className="mt-5">
            <MiniBars
              data={DEMO_WEEKLY_ACTIVITY.map((day) => ({ label: day.day, value: day.minutes }))}
              label="Minutes spent learning this week"
              tone="accent"
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="Attempt history" title="Every investigation, recorded" />
          {attempts.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <caption className="sr-only">Attempt history</caption>
                <thead>
                  <tr className="border-b border-line text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
                    <th scope="col" className="py-2 pr-3 font-medium">Mission</th>
                    <th scope="col" className="px-2 py-2 font-medium">Status</th>
                    <th scope="col" className="px-2 py-2 font-medium">Score</th>
                    <th scope="col" className="px-2 py-2 font-medium">XP</th>
                    <th scope="col" className="px-2 py-2 font-medium">Started</th>
                    <th scope="col" className="py-2 pl-2 font-medium"><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const mission = getMission(attempt.missionId);
                    return (
                      <tr key={attempt.id} className="border-b border-line/60 last:border-0">
                        <td className="py-3 pr-3">
                          <p className="font-medium text-ink">{mission?.title ?? attempt.missionId}</p>
                          <p className="mt-0.5 text-[0.625rem] text-ink-faint">{attempt.runs.length} runs · {attempt.hintsUsed} hints</p>
                        </td>
                        <td className="px-2 py-3">
                          <Chip tone={attempt.status === "completed" ? "positive" : attempt.status === "retry" ? "gold" : "neutral"}>
                            {attempt.status === "completed" ? "Mastered" : attempt.status === "retry" ? "Retry" : "In progress"}
                          </Chip>
                        </td>
                        <td className="numeric px-2 py-3 text-ink">{attempt.evaluation ? formatValue(attempt.evaluation.total, 0) : "—"}</td>
                        <td className="numeric px-2 py-3 text-ink">{attempt.xpAwarded > 0 ? `+${attempt.xpAwarded}` : "—"}</td>
                        <td className="numeric px-2 py-3 text-ink-faint">
                          {new Date(attempt.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </td>
                        <td className="py-3 pl-2">
                          {attempt.evaluation ? (
                            <Link href={`/results/${attempt.id}`} className="text-primary hover:underline" aria-label={`Open feedback for ${mission?.title ?? "attempt"}`}>
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          ) : (
                            <Link href={`/lab/${attempt.missionId}`} className="text-primary hover:underline" aria-label={`Resume ${mission?.title ?? "mission"}`}>
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={FlaskConical}
                title="No attempts yet"
                description="Choose a mission and run your first investigation to start your record."
                action={<Link href="/missions" className={buttonStyles("primary", "md")}>Browse missions</Link>}
              />
            </div>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="By subject" title="Reasoning strength" description="Average score across submitted attempts." />
            <div className="mt-5 space-y-4">
              {subjectAverages.map((row) => (
                <div key={row.subject} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          row.subject === "physics" && "bg-physics",
                          row.subject === "chemistry" && "bg-chemistry",
                          row.subject === "biology" && "bg-biology",
                        )}
                        aria-hidden="true"
                      />
                      {SUBJECT_META[row.subject].label}
                    </span>
                    <span className="numeric text-xs text-ink-faint">
                      {row.count > 0 ? formatValue(row.value, 0) : "—"}
                    </span>
                  </div>
                  <Progress
                    value={row.value}
                    label={`${SUBJECT_META[row.subject].label} average`}
                    tone={row.subject}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Badges" title="Habits you have built" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {earnedBadges.length > 0 ? (
                earnedBadges.map((badge) => {
                  const Icon = BADGE_ICONS[badge.icon];
                  return (
                    <div key={badge.id} className="flex items-start gap-2.5 rounded-xl border border-line bg-panel-soft p-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-medium text-ink">{badge.name}</p>
                        <p className="mt-0.5 text-[0.625rem] leading-snug text-ink-faint">{badge.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-ink-faint">Complete an investigation to earn your first badge.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
