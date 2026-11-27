import Link from "next/link";
import { ArrowUpRight, Clock, Flame, Layers3, Zap } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { SubjectIcon } from "@/components/ui/subject-icon";
import { SUBJECT_META } from "@/data/missions";
import type { Mission } from "@/types/domain";
import { cn } from "@/lib/utils";

const DIFFICULTY_TONE = {
  starter: "positive",
  core: "primary",
  challenge: "gold",
} as const;

export function MissionCard({
  mission,
  completed = false,
  attempts = 0,
  className,
}: {
  mission: Mission;
  completed?: boolean;
  attempts?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/missions/${mission.id}`}
      className={cn(
        "panel group flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-float",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SubjectIcon subject={mission.subject} />
        <ArrowUpRight
          className="size-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={mission.subject}>{SUBJECT_META[mission.subject].label}</Chip>
          <Chip tone={DIFFICULTY_TONE[mission.difficulty]}>{mission.difficulty}</Chip>
          {completed ? <Chip tone="positive">Mastered</Chip> : null}
        </div>
        <p className="numeric text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {mission.codename}
        </p>
        <h3 className="text-lg font-semibold leading-tight text-ink">{mission.title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{mission.hook}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mission.concepts.slice(0, 3).map((concept) => (
          <span key={concept} className="rounded-full border border-line bg-panel-soft px-2 py-0.5 text-[0.625rem] text-ink-faint">
            {concept}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-4 text-[0.6875rem] text-ink-faint">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {mission.estimatedMinutes} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Zap className="size-3.5 text-gold" aria-hidden="true" />
          {mission.baseXp} XP
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="size-3.5" aria-hidden="true" />
          {mission.rubric.length} criteria
        </span>
        {attempts > 0 ? (
          <span className="ml-auto inline-flex items-center gap-1.5 text-primary">
            <Flame className="size-3.5" aria-hidden="true" />
            {attempts} attempt{attempts === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
