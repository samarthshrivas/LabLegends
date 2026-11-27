"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ExperimentRun } from "@/types/domain";
import { cn, formatValue } from "@/lib/utils";

function valueOf(run: ExperimentRun, key: string): number | undefined {
  const parameter = run.parameters[key];
  if (typeof parameter === "number") return parameter;
  const observation = run.observations.find((item) => item.id === key);
  return typeof observation?.value === "number" ? observation.value : undefined;
}

export function RunHistory({
  runs,
  selectedRunId,
  onSelect,
  parameterKeys,
  outputKey,
  outputLabel,
  outputUnit,
}: {
  runs: ExperimentRun[];
  selectedRunId: string | null;
  onSelect: (runId: string) => void;
  parameterKeys: string[];
  outputKey: string;
  outputLabel: string;
  outputUnit: string;
}) {
  if (runs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-faint">
        No runs yet. Your first run will appear here with the exact settings used.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-xs">
        <caption className="sr-only">Experiment run history</caption>
        <thead>
          <tr className="border-b border-line text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
            <th scope="col" className="px-2 py-2 font-medium">Run</th>
            {parameterKeys.map((key) => (
              <th key={key} scope="col" className="px-2 py-2 font-medium">{key.replace(/([A-Z])/g, " $1")}</th>
            ))}
            <th scope="col" className="px-2 py-2 font-medium">{outputLabel}</th>
            <th scope="col" className="px-2 py-2 font-medium">Δ output</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run, index) => {
            const output = valueOf(run, outputKey);
            const previous = index > 0 ? valueOf(runs[index - 1], outputKey) : undefined;
            const delta = output !== undefined && previous !== undefined ? output - previous : undefined;
            const selected = selectedRunId === run.id;
            return (
              <tr
                key={run.id}
                onClick={() => onSelect(run.id)}
                className={cn(
                  "cursor-pointer border-b border-line/60 transition-colors last:border-0",
                  selected ? "bg-primary-soft/60" : "hover:bg-panel-soft",
                )}
              >
                <td className="numeric px-2 py-2.5 font-semibold text-primary">#{run.runNumber}</td>
                {parameterKeys.map((key) => (
                  <td key={key} className="numeric px-2 py-2.5 text-ink-soft">
                    {formatValue(valueOf(run, key) ?? 0, 2)}
                  </td>
                ))}
                <td className="numeric px-2 py-2.5 font-semibold text-ink">
                  {formatValue(output ?? 0, 3)} <span className="font-normal text-ink-faint">{outputUnit}</span>
                </td>
                <td className="numeric px-2 py-2.5">
                  {delta === undefined ? (
                    <span className="text-ink-faint">—</span>
                  ) : Math.abs(delta) < 1e-9 ? (
                    <Minus className="size-3.5 text-ink-faint" aria-label="no change" />
                  ) : delta > 0 ? (
                    <span className="inline-flex items-center gap-1 text-positive">
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />+{formatValue(delta, 3)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-accent">
                      <ArrowDownRight className="size-3.5" aria-hidden="true" />{formatValue(delta, 3)}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
