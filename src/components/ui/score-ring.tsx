import { cn } from "@/lib/utils";

export interface ScoreRingProps {
  value: number;
  max?: number;
  label: string;
  caption?: string;
  tone?: "primary" | "accent" | "gold" | "positive";
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const TONE_TEXT: Record<NonNullable<ScoreRingProps["tone"]>, string> = {
  primary: "text-primary",
  accent: "text-accent",
  gold: "text-gold",
  positive: "text-positive",
};

export function ScoreRing({
  value,
  max = 100,
  label,
  caption,
  tone = "primary",
  size = 168,
  strokeWidth = 10,
  className,
}: ScoreRingProps) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / safeMax);
  const centre = size / 2;

  return (
    <figure className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", TONE_TEXT[tone])} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${Math.round(clamped)} out of ${Math.round(safeMax)}`}
        >
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${centre} ${centre})`}
            className="transition-[stroke-dashoffset] duration-1000 ease-soft"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="numeric text-3xl font-semibold text-ink">{Math.round(clamped)}</span>
          <span className="numeric text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
            / {Math.round(safeMax)}
          </span>
        </div>
      </div>
      <figcaption className="text-center">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {caption ? <span className="mt-0.5 block text-xs text-ink-faint">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
