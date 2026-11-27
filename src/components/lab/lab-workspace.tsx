"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleCheck,
  FlaskConical,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ExperimentStage } from "@/components/lab/experiment-stage";
import { HintPanel } from "@/components/lab/hint-panel";
import { HypothesisPanel } from "@/components/lab/hypothesis-panel";
import { ModelChart } from "@/components/lab/model-chart";
import { ObservationPanel } from "@/components/lab/observation-panel";
import { RenderCapabilityChip } from "@/components/lab/render-capability-chip";
import { RunHistory } from "@/components/lab/run-history";
import { Button, buttonStyles } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { SliderField } from "@/components/ui/slider-field";
import { TextAreaField } from "@/components/ui/field";
import { requireExperimentModel } from "@/domain/experiments";
import { evaluateAttempt } from "@/domain/evaluation/rubric";
import { calculateXp, evaluateBadges } from "@/domain/rewards/rewards";
import { useDemoStore } from "@/lib/demo-store";
import { cn, createId } from "@/lib/utils";
import type { Attempt, ExperimentRun, Mission } from "@/types/domain";

function defaultParameters(mission: Mission): Record<string, number> {
  return Object.fromEntries(mission.parameters.map((spec) => [spec.id, spec.defaultValue]));
}

const OUTPUT_META: Record<Mission["subject"], { key: string; label: string; unit: string; parameters: string[] }> = {
  physics: { key: "current", label: "Current", unit: "A", parameters: ["voltage", "resistance"] },
  chemistry: { key: "finalConcentration", label: "Final conc.", unit: "mol/L", parameters: ["initialConcentration", "initialVolume", "finalVolume"] },
  biology: { key: "rate", label: "Relative rate", unit: "%", parameters: ["light", "co2"] },
};

export function LabWorkspace({ mission }: { mission: Mission }) {
  const router = useRouter();
  const { state, startAttempt, patchAttempt, addRun, revealHint, completeAttempt } = useDemoStore();
  const [parameterOverride, setParameterOverride] = useState<Record<string, number> | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const attempt = state.attempts.find(
    (item) => item.missionId === mission.id && item.status !== "completed",
  );
  const runs = attempt?.runs ?? [];
  const prediction = attempt?.prediction ?? "";
  const justification = attempt?.justification ?? "";
  const conclusion = attempt?.conclusion ?? "";
  const latestRun = runs[runs.length - 1];
  const parameters = parameterOverride ?? latestRun?.parameters ?? defaultParameters(mission);

  const model = useMemo(() => requireExperimentModel(mission.experimentModelId), [mission.experimentModelId]);
  const output = OUTPUT_META[mission.subject];
  const selectedRun = runs.find((run) => run.id === selectedRunId) ?? latestRun;
  const explanation = selectedRun
    ? model.run({ parameters: selectedRun.parameters }).explanation
    : undefined;

  const hypothesisReady = prediction.trim().length >= 8 && justification.trim().length >= 8;
  const conclusionReady = conclusion.trim().length >= 10;
  const locked = runs.length > 0;
  const step = runs.length === 0 ? 0 : conclusionReady ? 2 : 1;

  /** Creates the attempt on the first interaction, so no setState-in-effect is needed. */
  const ensureAttempt = (): Attempt => attempt ?? startAttempt(mission.id);

  const updateField = (field: "prediction" | "justification" | "conclusion", value: string) => {
    const current = ensureAttempt();
    patchAttempt(current.id, { [field]: value });
    if (field === "conclusion") setSubmitError(null);
  };

  const handleRun = () => {
    const current = ensureAttempt();
    const validation = model.validate({ parameters });
    if (!validation.isValid) {
      setRunError(validation.errors.join(" "));
      return;
    }
    const result = model.run({ parameters });
    const run: ExperimentRun = {
      id: createId("run"),
      runNumber: current.runs.length + 1,
      parameters: { ...parameters },
      observations: result.observations,
      warnings: result.warnings,
      createdAt: new Date().toISOString(),
    };
    addRun(current.id, run);
    setSelectedRunId(run.id);
    setParameterOverride(null);
    setRunError(null);
  };

  const handleSubmit = () => {
    const current = ensureAttempt();
    if (!conclusionReady) {
      setSubmitError("Write a conclusion of at least 10 characters before submitting.");
      return;
    }
    const submission = { prediction, justification, conclusion, runs: current.runs };
    const evaluation = evaluateAttempt(submission, {
      rubric: mission.rubric,
      masteryThreshold: mission.masteryThreshold,
      concepts: mission.concepts,
      subject: mission.subject,
    });
    const xp = calculateXp(mission.baseXp, evaluation, current).xp;
    const badges = evaluateBadges({ ...current, prediction, justification, conclusion }, evaluation);
    completeAttempt(current.id, evaluation, xp, badges);
    router.push(`/results/${current.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Link
            href={`/missions/${mission.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Mission briefing
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={mission.subject}>{mission.subject}</Chip>
            <Chip tone="neutral">{mission.codename}</Chip>
            <Chip tone="positive">
              <ShieldCheck className="size-3" aria-hidden="true" />
              Simulated
            </Chip>
            <RenderCapabilityChip />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{mission.title}</h1>
        </div>
        <ol className="flex items-center gap-1.5" aria-label="Investigation progress">
          {["Hypothesis", "Experiment", "Conclusion"].map((label, index) => (
            <li key={label} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "numeric inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium",
                  index === step
                    ? "border-primary/50 bg-primary-soft text-primary"
                    : index < step
                      ? "border-positive/40 bg-positive-soft/50 text-positive"
                      : "border-line bg-panel-soft text-ink-faint",
                )}
                aria-current={index === step ? "step" : undefined}
              >
                {index < step ? <CircleCheck className="size-3" aria-hidden="true" /> : null}
                {index + 1}. {label}
              </span>
              {index < 2 ? <span className="h-px w-3 bg-line" aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="space-y-5">
          <Panel className="overflow-hidden p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <PanelHeader
                eyebrow="Virtual apparatus"
                title="Experiment stage"
                description="Change the controls, then run the model. Nothing here uses real equipment."
              />
              <Chip tone="neutral">model v{model.version}</Chip>
            </div>
            <div className="rounded-2xl border border-line bg-panel-soft/60 p-2">
              <ExperimentStage
                subject={mission.subject}
                parameters={parameters}
                observations={selectedRun?.observations ?? []}
                specs={mission.parameters}
                onParameterChange={(id, value) =>
                  setParameterOverride((current) => ({ ...(current ?? parameters), [id]: value }))
                }
              />
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Controls"
              title="Set up your run"
              description="Change one variable at a time to create a fair test."
            />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {mission.parameters.map((spec) => (
                <SliderField
                  key={spec.id}
                  spec={spec}
                  value={parameters[spec.id] ?? spec.defaultValue}
                  onChange={(value) =>
                    setParameterOverride((current) => ({ ...(current ?? parameters), [spec.id]: value }))
                  }
                />
              ))}
            </div>

            {runError ? (
              <p role="alert" className="mt-4 rounded-xl border border-negative/30 bg-negative-soft/50 p-3 text-xs text-negative">
                {runError}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
              <Button onClick={handleRun} disabled={!hypothesisReady} size="md">
                <Play className="size-4" aria-hidden="true" />
                Run experiment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setParameterOverride(defaultParameters(mission));
                  setRunError(null);
                }}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset controls
              </Button>
              {!hypothesisReady ? (
                <span className="text-xs text-ink-faint">Complete your hypothesis first.</span>
              ) : (
                <span className="text-xs text-positive">Hypothesis ready — run the model.</span>
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Observations"
              title={selectedRun ? `Run #${selectedRun.runNumber} readings` : "No readings yet"}
              description="Values come from the deterministic model, not from a live sensor."
            />
            <div className="mt-4">
              <ObservationPanel
                observations={selectedRun?.observations ?? []}
                warnings={selectedRun?.warnings ?? []}
                explanation={explanation}
              />
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Model behaviour"
              title="How the model responds"
              description="The highlighted point marks your current settings."
            />
            <div className="mt-4">
              <ModelChart subject={mission.subject} parameters={parameters} />
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Run log"
              title="Your experiment history"
              description="Select a row to inspect its observations above."
            />
            <div className="mt-4">
              <RunHistory
                runs={runs}
                selectedRunId={selectedRun?.id ?? null}
                onSelect={setSelectedRunId}
                parameterKeys={output.parameters}
                outputKey={output.key}
                outputLabel={output.label}
                outputUnit={output.unit}
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <HypothesisPanel
            mission={mission}
            prediction={prediction}
            justification={justification}
            onPredictionChange={(value) => updateField("prediction", value)}
            onJustificationChange={(value) => updateField("justification", value)}
            locked={locked}
          />

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              eyebrow="Step 3 · Conclusion"
              title="Make sense of the evidence"
              description={mission.conclusionPrompt}
            />
            <div className="mt-4">
              <TextAreaField
                label="My conclusion"
                value={conclusion}
                onChange={(value) => updateField("conclusion", value)}
                rows={5}
                maxLength={700}
                placeholder="The evidence shows … because … This supports / changes my prediction because …"
                hint="Cite at least one recorded value and say whether your prediction was supported."
                error={submitError ?? undefined}
              />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <Button onClick={handleSubmit} disabled={!conclusionReady || runs.length === 0} className="w-full">
                <Send className="size-4" aria-hidden="true" />
                Submit for feedback
              </Button>
              <p className="mt-2 text-center text-[0.6875rem] text-ink-faint">
                Feedback is rule-based and immediate. Retries are always allowed and never cost XP.
              </p>
            </div>
          </Panel>

          <HintPanel
            hints={mission.hints}
            revealedIds={attempt?.revealedHintIds ?? []}
            onReveal={(hintId) => revealHint(ensureAttempt().id, hintId)}
          />

          <div className="rounded-2xl border border-line bg-panel-soft/50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FlaskConical className="size-3.5 text-primary" aria-hidden="true" />
              Model note
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-faint">{mission.limitations}</p>
            <Link href={`/missions/${mission.id}`} className={buttonStyles("ghost", "sm", "mt-2 -ml-3.5")}>
              <Sparkles className="size-3.5" aria-hidden="true" />
              Full assumptions & sources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
