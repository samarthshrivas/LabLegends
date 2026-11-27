import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  label: string;
  tone?: "primary" | "accent" | "gold" | "positive" | "physics" | "chemistry" | "biology";
  size?: "sm" | "md";
  className?: string;
  showValue?: boolean;
}

const TONE_BAR: Record<NonNullable<ProgressProps["tone"]>, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  gold: "bg-gold",
  positive: "bg-positive",
  physics: "bg-physics",
  chemistry: "bg-chemistry",
  biology: "bg-biology",
};

export function Progress({
  value,
  max = 100,
  label,
  tone = "primary",
  size = "md",
  className,
  showValue = false,
}: ProgressProps) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const pct = (clamped / safeMax) * 100;

  return (
    <div className={cn("space-y-1.5", className)}>
      {showValue ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-medium text-ink-soft">{label}</span>
          <span className="numeric text-xs text-ink-faint">
            {Math.round(clamped)} / {Math.round(safeMax)}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(safeMax)}
        aria-valuenow={Math.round(clamped)}
        className={cn(
          "w-full overflow-hidden rounded-full bg-panel-strong ring-1 ring-inset ring-line",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-soft", TONE_BAR[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
