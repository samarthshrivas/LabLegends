"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  FlaskConical,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { SliderField } from "@/components/ui/slider-field";
import { calculateCurrent } from "@/domain/experiments/physics/ohms-law";
import { formatValue } from "@/lib/utils";
import type { ParameterSpec } from "@/types/domain";

const LOOP = ["Observe", "Question", "Hypothesize", "Experiment", "Analyze", "Reward", "Observe"];

const STEPS = [
  {
    title: "Pick a mystery",
    body: "Open the mission catalogue and choose a story that interests you. You do not need to be an expert — the mission teaches you what you need.",
    action: "Go to missions",
    href: "/missions",
  },
  {
    title: "Read the briefing",
    body: "The briefing gives you the story, the objective and the model's limits. Look for the question you are trying to answer.",
  },
  {
    title: "Write a prediction first",
    body: "Before you run anything, say what you expect and why. A good prediction names the variable you will change and the direction of the outcome.",
  },
  {
    title: "Change one thing at a time",
    body: "Use the sliders to set up a run. Change one variable, press Run experiment, then compare it with a previous run. That is a fair test.",
  },
  {
    title: "Explain with evidence",
    body: "In your conclusion, quote at least one number from your observations and say whether your prediction was supported.",
  },
  {
    title: "Read feedback and retry",
    body: "Feedback is rule-based and immediate. It shows strengths and next steps. Retries are always allowed and never cost XP.",
    action: "See your progress",
    href: "/progress",
  },
];

const RESISTANCE_SPEC: ParameterSpec = {
  id: "resistance",
  label: "Resistance",
  symbol: "R",
  unit: "Ω",
  min: 1,
  max: 100,
  step: 1,
  defaultValue: 20,
  decimals: 0,
  help: "Drag the slider, then predict what will happen to the current.",
};

type Prediction = "increase" | "decrease" | "same" | null;

export default function TutorialPage() {
  const [resistance, setResistance] = useState(20);
  const [prediction, setPrediction] = useState<Prediction>(null);
  const [revealed, setRevealed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const current = calculateCurrent(12, resistance);
  const correct = prediction === "decrease";

  const run = () => {
    if (prediction === null) return;
    if (correct) {
      setRevealed(true);
    } else {
      setHintShown(true);
    }
  };

  const reset = () => {
    setResistance(20);
    setPrediction(null);
    setRevealed(false);
    setHintShown(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="First-timer guide"
        title="How to use LabLegends"
        description="A three-minute tour of the investigation loop, followed by a tiny experiment you can try right here."
        actions={
          <Link href="/missions" className={buttonStyles("primary", "md")}>
            Skip to missions
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <section className="panel overflow-hidden p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {LOOP.map((label, index) => (
            <span key={`${label}-${index}`} className="flex items-center gap-2">
              <Chip tone={index === 0 || index === LOOP.length - 1 ? "primary" : "neutral"}>{label}</Chip>
              {index < LOOP.length - 1 ? <ArrowRight className="size-3 text-ink-faint" aria-hidden="true" /> : null}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Every mission follows this loop. You will be asked to think before you act, and the lab will keep your
          earlier attempts so you can compare them.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STEPS.map((step, index) => (
          <Panel key={step.title} className="flex flex-col gap-3 p-5">
            <span className="numeric grid size-9 place-items-center rounded-xl border border-primary/25 bg-primary-soft text-sm font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-base font-semibold text-ink">{step.title}</h2>
            <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
            {step.action && step.href ? (
              <Link href={step.href} className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                {step.action}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </Panel>
        ))}
      </section>

      <Panel className="p-5 sm:p-7">
        <PanelHeader
          eyebrow="Try it now"
          title="A 30-second practice run"
          description="The supply is fixed at 12 V. Change the resistance, make a prediction, then run the model."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <SliderField
              spec={RESISTANCE_SPEC}
              value={resistance}
              onChange={(value) => {
                setResistance(value);
                setRevealed(false);
                setHintShown(false);
              }}
            />

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-ink">
                If resistance increases, what happens to current?
              </legend>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "increase", label: "It increases" },
                  { id: "decrease", label: "It decreases" },
                  { id: "same", label: "It stays the same" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={prediction === option.id}
                    onClick={() => {
                      setPrediction(option.id as Prediction);
                      setRevealed(false);
                      setHintShown(false);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      prediction === option.id
                        ? "border-primary/50 bg-primary-soft text-primary"
                        : "border-line bg-panel-soft text-ink-soft hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={run} disabled={prediction === null}>
                <Play className="size-4" aria-hidden="true" />
                Run model
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-3" aria-live="polite">
            {prediction === null ? (
              <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-faint">
                Choose a prediction to unlock the model.
              </p>
            ) : null}

            {hintShown && !revealed ? (
              <div className="rounded-xl border border-gold/30 bg-gold-soft/40 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
                  <Lightbulb className="size-3.5" aria-hidden="true" />
                  A hint first
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Look at the relationship I = V ÷ R. The voltage is fixed, so the only thing changing is the
                  denominator. What happens to the result when the denominator gets larger?
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setRevealed(true)}>
                  Show the result
                </Button>
              </div>
            ) : null}

            {revealed ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-positive/30 bg-positive-soft/40 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-positive">
                    <CircleCheck className="size-3.5" aria-hidden="true" />
                    Model result
                  </p>
                  <p className="numeric mt-2 text-2xl font-semibold text-ink">
                    {formatValue(current, 3)} A
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    At {resistance} Ω with 12 V, current = 12 ÷ {resistance} = {formatValue(current, 3)} A.
                    {correct
                      ? " Your prediction matched the model."
                      : " A larger resistance reduces the current for the same voltage."}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-ink-faint">
                  This is the same rule the real lab uses. In a full mission you would record this as evidence and
                  cite it in your conclusion.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            eyebrow="What counts"
            title="Good reasoning looks like this"
            description="The rubric rewards these habits, not speed."
          />
          <ul className="mt-5 space-y-3">
            {[
              "A prediction that names a variable and a direction.",
              "A reason that uses a scientific relationship.",
              "Two runs that differ by only one variable.",
              "A conclusion that quotes a recorded number.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader eyebrow="Good to know" title="Common questions" />
          <div className="mt-4 space-y-3">
            {[
              { q: "Do hints cost XP?", a: "No. Hints are support, not penalties." },
              { q: "Can I retry a mission?", a: "Yes. Retries are always allowed and never reduce XP." },
              { q: "Is this real equipment?", a: "No. Every experiment is a labelled virtual simulation." },
              { q: "Where is my work saved?", a: "In this browser's local demo storage. Clearing site data resets it." },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-line bg-panel-soft px-3.5 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-ink">
                  {item.q}
                  <span className="text-ink-faint transition-transform group-open:rotate-90">→</span>
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </Panel>
      </div>

      <section className="panel flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <FlaskConical className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">Ready for a real mission?</h2>
            <p className="mt-1 text-sm text-ink-soft">The catalogue has three investigations waiting for you.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/student" className={buttonStyles("outline", "md")}>Back to home</Link>
          <Link href="/missions" className={buttonStyles("primary", "md")}>
            <Sparkles className="size-4" aria-hidden="true" />
            Choose a mission
          </Link>
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 text-xs text-ink-faint">
        <BookOpen className="size-3.5" aria-hidden="true" />
        You can revisit this guide any time from the sidebar.
      </p>
    </div>
  );
}
