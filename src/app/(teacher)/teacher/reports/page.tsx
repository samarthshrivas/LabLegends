"use client";

import Link from "next/link";
import { Download, FileBarChart, Info, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { DEMO_CLASSES, DEMO_MISCONCEPTIONS, DEMO_ROSTER } from "@/data/demo";
import { MISSIONS, SUBJECT_META } from "@/data/missions";
import { useDemoStore } from "@/lib/demo-store";
import { cn, formatValue } from "@/lib/utils";
import type { Subject } from "@/types/domain";

const BASELINE = [72, 64, 58, 69, 61];

export default function ReportsPage() {
  const { state } = useDemoStore();
  const criteria = MISSIONS[0].rubric.map((criterion, index) => ({
    ...criterion,
    average: BASELINE[index] ?? 60,
  }));

  const subjectRows = (["physics", "chemistry", "biology"] as Subject[]).map((subject, index) => ({
    subject,
    mastery: [68, 61, 57][index],
    attempts: [42, 31, 24][index],
  }));

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Type", "Name", "Context", "Value", "Detail"],
      ...DEMO_CLASSES.map((item) => ["Class", item.name, item.code, item.avgMastery, `${item.studentCount} students`]),
      ...Object.entries(DEMO_ROSTER).flatMap(([classId, roster]) =>
        roster.map((student) => ["Student", student.displayName, classId, student.mastery, student.misconception]),
      ),
      ...state.attempts.map((attempt) => [
        "Attempt",
        attempt.missionId,
        attempt.id,
        attempt.evaluation?.total ?? "in progress",
        `${attempt.runs.length} runs, ${attempt.hintsUsed} hints`,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lablegends-demo-report.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Reports"
        title="Evidence across the cohort"
        description="Aggregate views combine synthetic class data with your local demo attempts."
        actions={
          <button type="button" onClick={exportCsv} className={buttonStyles("primary", "md")}>
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary-soft/40 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-ink-soft">
          These figures are illustrative demo data, not validated learning outcomes. LabLegends does not claim
          proven score improvement. In production, reports would be computed server-side from persisted attempts
          with row-level security.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            eyebrow="Rubric signal"
            title="Where reasoning is strongest"
            description="Average criterion performance across the synthetic cohort."
          />
          <ul className="mt-5 space-y-4">
            {criteria.map((criterion) => (
              <li key={criterion.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{criterion.label}</p>
                  <p className="numeric text-xs text-ink-faint">{criterion.average}% · {criterion.weight}% weight</p>
                </div>
                <Progress
                  value={criterion.average}
                  label={`${criterion.label} cohort average`}
                  tone={criterion.average >= 70 ? "positive" : criterion.average >= 60 ? "primary" : "gold"}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Subjects" title="Mastery by subject" />
            <ul className="mt-5 space-y-4">
              {subjectRows.map((row) => (
                <li key={row.subject} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink-soft">{SUBJECT_META[row.subject].label}</span>
                    <span className="numeric text-xs text-ink-faint">{row.mastery}% · {row.attempts} attempts</span>
                  </div>
                  <Progress
                    value={row.mastery}
                    label={`${SUBJECT_META[row.subject].label} mastery`}
                    tone={row.subject}
                    size="sm"
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Coverage" title="What the report includes" />
            <ul className="mt-4 space-y-2 text-xs leading-relaxed text-ink-soft">
              <li className="flex gap-2"><FileBarChart className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />Rubric criterion averages, not just totals.</li>
              <li className="flex gap-2"><FileBarChart className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />Misconception patterns from reasoning text.</li>
              <li className="flex gap-2"><FileBarChart className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />Attempt counts and hint use, never time-on-task rankings.</li>
            </ul>
          </Panel>
        </div>
      </div>

      <Panel className="p-5 sm:p-6">
        <PanelHeader eyebrow="Misconceptions" title="Trend detail" description="Direction is relative to the previous demo cohort snapshot." />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-xs">
            <caption className="sr-only">Misconception trends</caption>
            <thead>
              <tr className="border-b border-line text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
                <th scope="col" className="py-2 pr-3 font-medium">Pattern</th>
                <th scope="col" className="px-2 py-2 font-medium">Subject</th>
                <th scope="col" className="px-2 py-2 font-medium">Students</th>
                <th scope="col" className="py-2 pl-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_MISCONCEPTIONS.map((item) => (
                <tr key={item.label} className="border-b border-line/60 last:border-0">
                  <td className="py-3 pr-3 text-ink">{item.label}</td>
                  <td className="px-2 py-3 text-ink-soft">{item.subject}</td>
                  <td className="numeric px-2 py-3 text-ink">{item.students}</td>
                  <td className="py-3 pl-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.625rem]",
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="numeric mt-4 text-[0.6875rem] text-ink-faint">
          {formatValue(state.attempts.length, 0)} local demo attempts included in the export.
        </p>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <Link href="/teacher" className={buttonStyles("outline", "md")}>Back to teacher workspace</Link>
        <Link href="/progress" className={buttonStyles("ghost", "md")}>View your own progress</Link>
      </div>
    </div>
  );
}
