"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CircleCheck, Eye, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/section";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { DEMO_CLASSES, DEMO_ROSTER } from "@/data/demo";
import { MISSIONS } from "@/data/missions";
import { cn } from "@/lib/utils";

export function ClassDetail({ classId }: { classId: string }) {
  const demoClass = DEMO_CLASSES.find((item) => item.id === classId);
  const roster = DEMO_ROSTER[classId] ?? [];

  if (!demoClass) {
    return (
      <EmptyState
        icon={Eye}
        title="Class not found"
        description="This demo class does not exist. Return to the teacher workspace to choose another."
        action={<Link href="/teacher" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">Back to classes</Link>}
      />
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        backHref="/teacher"
        backLabel="All classes"
        eyebrow={demoClass.code}
        title={demoClass.name}
        description="Roster view with synthetic students. No real student information is used."
        actions={<Chip tone="primary">{demoClass.subjectFocus}</Chip>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users, label: "Students", value: demoClass.studentCount, sub: "enrolled" },
          { icon: BookOpen, label: "Assigned missions", value: demoClass.assignedMissions, sub: "active" },
          { icon: CircleCheck, label: "Avg completion", value: `${demoClass.avgCompletion}%`, sub: "of assigned work" },
          { icon: Eye, label: "Avg mastery", value: `${demoClass.avgMastery}%`, sub: "reasoning score" },
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

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="Roster" title="Student progress" description="Mastery is an average of reasoning scores, not completion speed." />
          {roster.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-xs">
                <caption className="sr-only">Class roster</caption>
                <thead>
                  <tr className="border-b border-line text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
                    <th scope="col" className="py-2 pr-3 font-medium">Student</th>
                    <th scope="col" className="px-2 py-2 font-medium">Mastery</th>
                    <th scope="col" className="px-2 py-2 font-medium">Completed</th>
                    <th scope="col" className="px-2 py-2 font-medium">Attempts</th>
                    <th scope="col" className="py-2 pl-2 font-medium">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((student) => (
                    <tr key={student.id} className="border-b border-line/60 last:border-0">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-ink">{student.displayName}</p>
                        <p className="mt-0.5 text-[0.625rem] text-ink-faint">Active {student.lastActive.toLowerCase()}</p>
                      </td>
                      <td className="w-40 px-2 py-3">
                        <Progress
                          value={student.mastery}
                          label={`${student.displayName} mastery`}
                          tone={student.mastery >= 75 ? "positive" : student.mastery >= 50 ? "primary" : "gold"}
                          size="sm"
                          showValue
                        />
                      </td>
                      <td className="numeric px-2 py-3 text-ink">{student.completed}</td>
                      <td className="numeric px-2 py-3 text-ink">{student.attempts}</td>
                      <td className="py-3 pl-2">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2 py-1 text-[0.625rem]",
                            student.misconception === "None flagged"
                              ? "border-positive/30 bg-positive-soft/50 text-positive"
                              : "border-gold/30 bg-gold-soft/50 text-gold",
                          )}
                        >
                          {student.misconception}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState icon={Users} title="No roster data" description="This class has no synthetic student records yet." />
            </div>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Assignments" title="Missions in this class" />
            <ul className="mt-4 space-y-2">
              {MISSIONS.slice(0, demoClass.assignedMissions).map((mission) => (
                <li key={mission.id}>
                  <Link
                    href={`/missions/${mission.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-panel-soft p-3 transition-colors hover:border-primary/50"
                  >
                    <div>
                      <p className="text-xs font-medium text-ink">{mission.title}</p>
                      <p className="mt-0.5 text-[0.625rem] capitalize text-ink-faint">{mission.subject} · {mission.difficulty}</p>
                    </div>
                    <ArrowLeft className="size-3.5 rotate-180 text-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader eyebrow="Teaching note" title="Use flags as prompts" />
            <p className="mt-4 text-xs leading-relaxed text-ink-soft">
              Flags are generated from patterns in reasoning text and variable control. They are conversation
              starters, not labels. A wrong-but-testable prediction is a useful teaching moment.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
