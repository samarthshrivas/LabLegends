"use client";

import { CircleCheck, Lightbulb, Lock } from "lucide-react";
import { TextAreaField } from "@/components/ui/field";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { Mission } from "@/types/domain";

export function HypothesisPanel({
  mission,
  prediction,
  justification,
  onPredictionChange,
  onJustificationChange,
  locked,
}: {
  mission: Mission;
  prediction: string;
  justification: string;
  onPredictionChange: (value: string) => void;
  onJustificationChange: (value: string) => void;
  locked: boolean;
}) {
  const predictionReady = prediction.trim().length >= 8;
  const justificationReady = justification.trim().length >= 8;
  const ready = predictionReady && justificationReady;

  return (
    <Panel className="p-5 sm:p-6">
      <PanelHeader
        eyebrow="Step 1 · Hypothesis"
        title="Predict before you test"
        description={mission.hypothesisPrompt}
      />

      <div className="mt-5 space-y-4">
        <TextAreaField
          label="My prediction"
          value={prediction}
          onChange={onPredictionChange}
          disabled={locked}
          rows={3}
          maxLength={400}
          placeholder="If I change …, then I expect … because …"
          hint="State the variable you will change and the direction of the outcome."
          error={!predictionReady && prediction.length > 0 ? "Add a little more detail so the prediction is testable." : undefined}
        />
        <TextAreaField
          label="My reasoning"
          value={justification}
          onChange={onJustificationChange}
          disabled={locked}
          rows={3}
          maxLength={500}
          placeholder="I expect this because the relationship between … and … means …"
          hint="Name the scientific relationship you are using."
          error={!justificationReady && justification.length > 0 ? "Explain why you expect that outcome." : undefined}
        />

        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
            ready
              ? "border-positive/30 bg-positive-soft/50 text-ink-soft"
              : "border-line bg-panel-soft text-ink-faint"
          }`}
          aria-live="polite"
        >
          {ready ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden="true" />
          ) : (
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
          )}
          <span>
            {locked
              ? "Your hypothesis is locked because runs have already been recorded. You can still revise your conclusion."
              : ready
                ? "Hypothesis ready. You can now run the decisive experiment."
                : "Write at least a short prediction and reason to unlock the Run button."}
          </span>
        </div>

        {locked ? (
          <p className="flex items-center gap-1.5 text-[0.6875rem] text-ink-faint">
            <Lock className="size-3" aria-hidden="true" />
            Locked after the first run — this keeps your prediction honest.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
