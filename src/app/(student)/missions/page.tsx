"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Search, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MissionCard } from "@/components/mission/mission-card";
import { Button, buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/section";
import { MISSIONS, SUBJECT_META, UPCOMING_MISSIONS } from "@/data/missions";
import { useDemoStore } from "@/lib/demo-store";
import type { Difficulty, Subject } from "@/types/domain";
import { cn } from "@/lib/utils";

type SubjectFilter = Subject | "all";
type DifficultyFilter = Difficulty | "all";

const SUBJECT_FILTERS: { id: SubjectFilter; label: string }[] = [
  { id: "all", label: "All subjects" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
];

const DIFFICULTY_FILTERS: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "Any level" },
  { id: "starter", label: "Starter" },
  { id: "core", label: "Core" },
  { id: "challenge", label: "Challenge" },
];

export default function MissionsPage() {
  const { state } = useDemoStore();
  const [subject, setSubject] = useState<SubjectFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return MISSIONS.filter((mission) => {
      if (subject !== "all" && mission.subject !== subject) return false;
      if (difficulty !== "all" && mission.difficulty !== difficulty) return false;
      if (!needle) return true;
      return [mission.title, mission.hook, mission.objective, ...mission.concepts]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [subject, difficulty, query]);

  const hasFilters = subject !== "all" || difficulty !== "all" || query.trim().length > 0;

  const clearFilters = () => {
    setSubject("all");
    setDifficulty("all");
    setQuery("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mission catalogue"
        title="Choose your next mystery"
        description="Each mission is a complete investigation: briefing, prediction, experiment, evidence and feedback."
        actions={
          <Link href="/student" className={buttonStyles("outline", "md")}>
            Back to home
          </Link>
        }
      />

      <section className="panel space-y-4 p-4 sm:p-5" aria-label="Mission filters">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <label htmlFor="mission-search" className="sr-only">
              Search missions
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              id="mission-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, concept or question…"
              className="h-11 w-full rounded-xl border border-line bg-panel-soft pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint/70 focus:border-primary focus:outline-none"
            />
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-full border border-line px-3 text-xs text-ink-soft hover:border-line-strong hover:text-ink"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">Subject</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by subject">
              {SUBJECT_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={subject === filter.id}
                  onClick={() => setSubject(filter.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    subject === filter.id
                      ? "border-primary/50 bg-primary-soft text-primary"
                      : "border-line bg-panel-soft text-ink-soft hover:border-line-strong hover:text-ink",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-ink-faint" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by difficulty">
              {DIFFICULTY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={difficulty === filter.id}
                  onClick={() => setDifficulty(filter.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    difficulty === filter.id
                      ? "border-accent/50 bg-accent-soft text-accent"
                      : "border-line bg-panel-soft text-ink-soft hover:border-line-strong hover:text-ink",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          <span className="numeric font-semibold text-ink">{filtered.length}</span> mission
          {filtered.length === 1 ? "" : "s"} available
        </p>
        <p className="hidden text-xs text-ink-faint sm:block">All experiments are virtual and simulated.</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={state.completedMissionIds.includes(mission.id)}
              attempts={state.attempts.filter((attempt) => attempt.missionId === mission.id).length}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No missions match those filters"
          description="Try a different subject, difficulty or search term. Every mission stays available — nothing is locked by level."
          action={
            <Button onClick={clearFilters} variant="outline">
              Reset filters
            </Button>
          }
        />
      )}

      <section className="space-y-4 border-t border-line pt-8">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-ink">In development</h2>
          <p className="text-sm text-ink-soft">
            Planned missions from the concept. These are not playable yet and are shown for roadmap transparency.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {UPCOMING_MISSIONS.map((mission) => (
            <div key={mission.id} className="rounded-2xl border border-dashed border-line-strong p-4">
              <div className="flex items-center justify-between gap-2">
                <Chip tone="neutral">{SUBJECT_META[mission.subject].label}</Chip>
                <span className="text-[0.625rem] uppercase tracking-wider text-ink-faint">{mission.tag}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{mission.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">{mission.teaser}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
