"use client";

import { Info, Octagon } from "lucide-react";
import type { Observation } from "@/types/domain";
import { formatValue } from "@/lib/utils";

function displayValue(observation: Observation): string {
  if (typeof observation.value === "number") {
    return `${formatValue(observation.value, 3)} ${observation.unit ?? ""}`.trim();
  }
  return String(observation.value);
}

export function ObservationPanel({
  observations,
  warnings,
  explanation,
  emptyLabel = "Run the experiment to record observations.",
}: {
  observations: Observation[];
  warnings: string[];
  explanation?: string;
  emptyLabel?: string;
}) {
  return (
    <div className="space-y-3">
      {observations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-faint">
          {emptyLabel}
        </p>
      ) : (
        <dl className="grid gap-2 sm:grid-cols-2">
          {observations.map((observation) => (
            <div key={observation.id} className="rounded-xl border border-line bg-panel-soft p-3">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink-faint">
                {observation.label}
              </dt>
              <dd className="numeric mt-1 text-lg font-semibold text-ink">{displayValue(observation)}</dd>
              <p className="mt-1 text-[0.6875rem] leading-snug text-ink-faint">{observation.description}</p>
            </div>
          ))}
        </dl>
      )}

      {explanation ? (
        <div className="flex gap-2.5 rounded-xl border border-primary/25 bg-primary-soft/40 p-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-ink-soft">{explanation}</p>
        </div>
      ) : null}

      {warnings.map((warning) => (
        <div key={warning} className="flex gap-2.5 rounded-xl border border-gold/25 bg-gold-soft/40 p-3.5">
          <Octagon className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-ink-soft">{warning}</p>
        </div>
      ))}
    </div>
  );
}
