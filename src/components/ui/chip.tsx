import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ChipTone =
  | "neutral"
  | "primary"
  | "accent"
  | "gold"
  | "positive"
  | "negative"
  | "physics"
  | "chemistry"
  | "biology";

const TONES: Record<ChipTone, string> = {
  neutral: "border-line bg-panel-soft text-ink-soft",
  primary: "border-primary/30 bg-primary-soft text-primary",
  accent: "border-accent/30 bg-accent-soft text-accent",
  gold: "border-gold/30 bg-gold-soft text-gold",
  positive: "border-positive/30 bg-positive-soft text-positive",
  negative: "border-negative/30 bg-negative-soft text-negative",
  physics: "border-physics/30 bg-physics/10 text-physics",
  chemistry: "border-chemistry/30 bg-chemistry/10 text-chemistry",
  biology: "border-biology/30 bg-biology/10 text-biology",
};

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
}

export function Chip({ tone = "neutral", className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em]",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

export const SUBJECT_TONE: Record<"physics" | "chemistry" | "biology", ChipTone> = {
  physics: "physics",
  chemistry: "chemistry",
  biology: "biology",
};
