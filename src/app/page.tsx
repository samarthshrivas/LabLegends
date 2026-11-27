import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  ChartLine,
  CircleCheck,
  Compass,
  Eye,
  FlaskConical,
  Lightbulb,
  Repeat2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { HeroConsole } from "@/components/marketing/hero-console";
import { buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section";
import { SubjectIcon } from "@/components/ui/subject-icon";
import { MISSIONS, SUBJECT_META, UPCOMING_MISSIONS } from "@/data/missions";
import type { Subject } from "@/types/domain";

const SUBJECTS: Subject[] = ["physics", "chemistry", "biology"];

const LOOP_STEPS = [
  { n: "01", title: "Observe", body: "Read the telemetry and notice what is strange.", icon: Eye },
  { n: "02", title: "Question", body: "Turn the anomaly into a question you can test.", icon: Search },
  { n: "03", title: "Hypothesize", body: "Predict a direction and justify it before running.", icon: Lightbulb },
  { n: "04", title: "Experiment", body: "Change one variable, hold another steady, run again.", icon: FlaskConical },
  { n: "05", title: "Analyze", body: "Compare runs and cite the observation that decides it.", icon: ChartLine },
  { n: "06", title: "Reward", body: "Earn XP and badges for reasoning quality, not speed.", icon: Award },
  { n: "07", title: "Observe again", body: "A new clue opens the next mission in the story.", icon: Repeat2 },
];

function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandMark />
        <nav aria-label="Marketing" className="hidden items-center gap-7 md:flex">
          <Link href="#how-it-works" className="text-sm text-ink-soft transition-colors hover:text-ink">
            How it works
          </Link>
          <Link href="#subjects" className="text-sm text-ink-soft transition-colors hover:text-ink">
            Subjects
          </Link>
          <Link href="#teachers" className="text-sm text-ink-soft transition-colors hover:text-ink">
            For teachers
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonStyles("primary", "sm", "hidden sm:inline-flex")}>
            Enter the lab
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link href="/login" className={buttonStyles("primary", "sm", "sm:hidden")}>
            Enter
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 starfield opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 grid-veil opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-[-18rem] size-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-10rem] top-40 size-[28rem] rounded-full bg-accent/10 blur-[120px]" aria-hidden="true" />

      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="animate-rise space-y-7">
          <Chip tone="primary" className="w-fit">
            <Sparkles className="size-3" aria-hidden="true" />
            Grades 6–12 · Physics · Chemistry · Biology
          </Chip>

          <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.25rem]">
            Science is a mystery.
            <br />
            <span className="text-gradient">Solve it.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            LabLegends turns students into investigators. They manipulate virtual experiments, commit to a
            hypothesis, defend it with evidence, and earn rewards for the quality of their reasoning — not for
            guessing fast.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login" className={buttonStyles("primary", "lg")}>
              Start investigating
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/missions" className={buttonStyles("outline", "lg")}>
              Browse missions
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/tutorial" className={buttonStyles("ghost", "lg")}>
              <BookOpen className="size-4" aria-hidden="true" />
              How it works
            </Link>
          </div>

          <p className="flex items-center gap-2 text-xs text-ink-faint">
            <ShieldCheck className="size-3.5 text-positive" aria-hidden="true" />
            Demo mode needs no account. All data is synthetic and stays in your browser.
          </p>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <HeroConsole />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "3", label: "science subjects" },
    { value: "∞", label: "retries, no penalty" },
    { value: "0", label: "speed bonuses" },
    { value: "5", label: "reasoning criteria" },
  ];
  return (
    <section className="border-y border-line bg-panel-soft/40">
      <div className="container-page grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="numeric text-2xl font-semibold text-primary sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-faint">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoopSection() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-20 py-20 lg:py-28">
      <SectionHeading
        eyebrow="The learning loop"
        title="One investigation, seven deliberate moves"
        description="Every mission follows the same scientific arc. The interface keeps students inside it — so the habit becomes automatic."
      />
      <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LOOP_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.n}
              className="panel group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong"
            >
              <span className="numeric absolute right-4 top-3 text-4xl font-semibold text-line-strong/60">
                {step.n}
              </span>
              <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary-soft text-primary">
                <Icon className="size-[1.1rem]" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          );
        })}
        <li className="panel flex flex-col justify-center border-primary/30 bg-primary-soft/40 p-5">
          <RotateCcw className="size-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-ink">Then the loop begins again.</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Each completed mission unlocks a new clue — and a new question.
          </p>
        </li>
      </ol>
    </section>
  );
}

function SubjectsSection() {
  return (
    <section id="subjects" className="scroll-mt-20 border-y border-line bg-panel-soft/30">
      <div className="container-page py-20 lg:py-28">
        <SectionHeading
          eyebrow="Three labs, one method"
          title="Pick a subject. Keep the reasoning."
          description="Each lab has its own visual identity and model, but the same fair-testing workflow and transparent rubric."
          action={
            <Link href="/missions" className={buttonStyles("outline", "md")}>
              See all missions
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {SUBJECTS.map((subject) => {
            const meta = SUBJECT_META[subject];
            const count = MISSIONS.filter((mission) => mission.subject === subject).length;
            return (
              <Link
                key={subject}
                href="/missions"
                className="panel group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-float"
              >
                <div className="flex items-start justify-between gap-3">
                  <SubjectIcon subject={subject} size="lg" />
                  <ArrowUpRight className="size-4 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ink">{meta.label}</h3>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
                    {meta.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{meta.blurb}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs text-ink-faint">
                  <span>{count} playable mission{count === 1 ? "" : "s"}</span>
                  <span className="font-medium text-ink-soft">Open catalogue →</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">In development</span>
          {UPCOMING_MISSIONS.map((mission) => (
            <span
              key={mission.id}
              className="rounded-full border border-line bg-panel-soft px-3 py-1.5 text-xs text-ink-faint"
              title={mission.teaser}
            >
              {mission.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasoningSection() {
  const criteria = [
    { label: "Prediction clarity", weight: "20%" },
    { label: "Scientific justification", weight: "25%" },
    { label: "Experimental control", weight: "20%" },
    { label: "Evidence use", weight: "20%" },
    { label: "Conclusion & reflection", weight: "15%" },
  ];

  return (
    <section className="container-page py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Reasoning over guessing"
            title="A correct answer is not the same as a good investigation"
            description="Feedback is deterministic, criterion by criterion. Students see what they did well and one concrete next step — never a shame label."
          />
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-ink-soft">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden="true" />
              A wrong-but-testable prediction never loses points for being wrong.
            </li>
            <li className="flex gap-3 text-sm text-ink-soft">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden="true" />
              A lucky correct guess with no evidence cannot earn full marks.
            </li>
            <li className="flex gap-3 text-sm text-ink-soft">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden="true" />
              Retries and hints are recorded for learning, never punished.
            </li>
          </ul>
        </div>

        <div className="panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink">Rubric breakdown</span>
            </div>
            <Chip tone="neutral">Version 1.0</Chip>
          </div>
          <ul className="mt-4 space-y-3">
            {criteria.map((criterion) => (
              <li key={criterion.label} className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-soft">{criterion.label}</span>
                <span className="numeric text-xs font-medium text-primary">{criterion.weight}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary-soft/50 p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
              Example feedback
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              “You held voltage at 12 V while changing resistance — that is a fair test. Next, quote one current
              value from your run history to support the claim.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeacherSection() {
  return (
    <section id="teachers" className="scroll-mt-20 border-y border-line bg-panel-soft/30">
      <div className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="For teachers"
            title="See the thinking, not just the score"
            description="Class views surface completion, mastery and common misconceptions. Student-level detail is restricted to classes you own."
          />
          <Link href="/teacher" className={buttonStyles("primary", "md")}>
            Open teacher demo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Users, label: "Class overview", value: "3 classes · 71 learners" },
            { icon: ChartLine, label: "Average mastery", value: "68%" },
            { icon: Compass, label: "Misconception trends", value: "5 tracked patterns" },
            { icon: Award, label: "Exportable reports", value: "CSV, aggregate-first" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="panel p-4">
                <Icon className="size-4 text-accent" aria-hidden="true" />
                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-ink-faint">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <BrandMark />
        <p className="max-w-xl text-xs leading-relaxed text-ink-faint">
          Prototype build. Simulations are idealised teaching models; no validated learning outcomes,
          certification or patent approval is claimed. All demo people and data are synthetic.
        </p>
        <Link href="/login" className="text-xs font-medium text-ink-soft hover:text-ink">
          Enter demo →
        </Link>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <LoopSection />
        <SubjectsSection />
        <ReasoningSection />
        <TeacherSection />
      </main>
      <SiteFooter />
    </div>
  );
}
