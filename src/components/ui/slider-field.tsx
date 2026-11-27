"use client";

import { useId, useState, type CSSProperties } from "react";
import type { ParameterSpec } from "@/types/domain";
import { clamp, cn, formatValue } from "@/lib/utils";

export interface SliderFieldProps {
  spec: ParameterSpec;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function SliderField({ spec, value, onChange, disabled = false, className }: SliderFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const fill = ((value - spec.min) / (spec.max - spec.min)) * 100;
  const describedBy = `${id}-help`;
  const display = focused ? draft : String(value);

  const commit = (raw: string) => {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) onChange(clamp(parsed, spec.min, spec.max));
    setFocused(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={`${id}-range`} className="text-sm font-medium text-ink">
          {spec.label}
          <span className="ml-2 numeric text-xs text-ink-faint">
            {spec.symbol} · {spec.unit}
          </span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            aria-label={`${spec.label} numeric input`}
            value={display}
            min={spec.min}
            max={spec.max}
            step={spec.step}
            disabled={disabled}
            onFocus={() => {
              setDraft(String(value));
              setFocused(true);
            }}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={(event) => commit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit((event.target as HTMLInputElement).value);
                event.currentTarget.blur();
              }
            }}
            className={cn(
              "numeric h-9 w-24 rounded-lg border border-line bg-panel-soft px-2.5 text-right text-sm text-ink",
              "transition-colors focus:border-primary focus:outline-none",
              "disabled:opacity-50",
            )}
          />
          <span className="w-16 text-xs text-ink-faint">{spec.unit}</span>
        </div>
      </div>

      <input
        id={`${id}-range`}
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-valuetext={`${formatValue(value, spec.decimals)} ${spec.unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--fill": `${fill}%` } as CSSProperties}
        className={cn(disabled && "cursor-not-allowed opacity-50")}
      />

      <div className="flex items-center justify-between text-[0.6875rem] text-ink-faint">
        <span className="numeric">
          {formatValue(spec.min, spec.decimals)} {spec.unit}
        </span>
        <span className="numeric">
          {formatValue(spec.max, spec.decimals)} {spec.unit}
        </span>
      </div>
      <p id={describedBy} className="text-xs leading-relaxed text-ink-faint">
        {spec.help}
      </p>
    </div>
  );
}
