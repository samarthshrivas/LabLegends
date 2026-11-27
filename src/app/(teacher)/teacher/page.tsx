"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  FileBarChart,
  Layers3,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { DEMO_ACTIVITY, DEMO_CLASSES, DEMO_MISCONCEPTIONS } from "@/data/demo";
import { cn } from "@/lib/utils";

export default function TeacherPage() {
  const totalStudents = DEMO_CLASSES.reduce((sum, item) => sum + item.studentCount, 0);
  const averageMastery = Math.round(
    DEMO_CLASSES.reduce((sum, item) => sum + item.avgMastery, 0) / DEMO_CLASSES.length,
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Teacher workspace"
        title="See the thinking, not just the score"
        description="Class-level signals, misconception patterns and evidence trails — built from synthetic demo data."
        actions={
          <Link href="/teacher/reports" className={buttonStyles("primary", "md")}>
            <FileBarChart className="size-4" aria-hidden="true" />
            View reports
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Layers3, label: "Active classes", value: DEMO_CLASSES.length, sub: "demo cohort" },
          { icon: Users, label: "Students", value: totalStudents, sub: "synthetic records" },
          { icon: TrendingUp, label: "Average mastery", value: `${averageMastery}%`, sub: "across classes" },
          { icon: BookOpen, label: "Missions assigned", value: 6, sub: "3 subjects" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="panel flex items-start gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary-soft text-primary">
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

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">Your classes</h2>
            <p className="text-sm text-ink-soft">Open a class to inspect its roster and evidence.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEMO_CLASSES.map((item) => (
            <Link
              key={item.id}
              href={`/teacher/class/${item.id}`}
              className="panel group space-y-4 p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="numeric text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">{item.code}</p>
                  <h3 className="mt-1 text-base font-semibold text-ink">{item.name}</h3>
                </div>
                <ChevronRight className="size-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip tone="neutral">{item.subjectFocus}</Chip>
                <Chip tone="primary">{item.studentCount} students</Chip>
              </div>
              <div className="space-y-3">
                <Progress value={item.avgCompletion} label="Average completion" tone="primary" size="sm" showValue />
                <Progress value={item.avgMastery} label="Average mastery" tone="gold" size="sm" showValue />
              </div>
              <p className="flex items-center gap-1.5 border-t border-line pt-3 text-[0.6875rem] text-ink-faint">
                <Clock className="size-3.5" aria-hidden="true" />
                Active {item.lastActive.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            eyebrow="Misconception watch"
            title="Patterns worth a conversation"
            description="Detected from reasoning text and run structure — never from a single score."
          />
          <ul className="mt-5 space-y-3">
            {DEMO_MISCONCEPTIONS.map((item) => (
              <li key={item.label} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm text-ink">{item.label}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-ink-faint">{item.subject} · {item.students} students</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.625rem] font-medium",
                    item.trend === "down"
                      ? "border-positive/30 bg-positive-soft/50 text-positive"
                      : item.trend === "up"
                        ? "border-accent/30 bg-accent-soft/50 text-accent"
                        : "border-line bg-panel-soft text-ink-faint",
                  )}
                >
                  {item.trend === "down" ? <TrendingDown className="size-3" aria-hidden="true" /> : null}
                  {item.trend === "up" ? <TrendingUp className="size-3" aria-hidden="true" /> : null}
                  {item.trend}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="Live feed" title="Recent student activity" description="Synthetic events from the demo cohort." />
          <ul className="mt-5 space-y-3">
            {DEMO_ACTIVITY.map((item) => (
              <li key={item.id} className="flex items-start gap-3 rounded-xl border border-line bg-panel-soft p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Eye className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink">
                    <span className="font-semibold">{item.student}</span> · {item.action.toLowerCase()}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6875rem] text-ink-faint">{item.mission}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="numeric text-xs font-medium text-ink">{item.score === null ? "—" : `${item.score}%`}</p>
                  <p className="text-[0.625rem] text-ink-faint">{item.when}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/teacher/reports" className={buttonStyles("ghost", "sm", "mt-4 -ml-3.5")}>
            Open full report
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Panel>
      </div>
    </div>
  );
}
