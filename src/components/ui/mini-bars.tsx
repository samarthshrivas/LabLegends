import { cn } from "@/lib/utils";

export interface MiniBarDatum {
  label: string;
  value: number;
  muted?: boolean;
}

export function MiniBars({
  data,
  tone = "primary",
  label,
  unit = "min",
  className,
}: {
  data: MiniBarDatum[];
  tone?: "primary" | "accent" | "gold";
  label: string;
  unit?: string;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((datum) => datum.value));
  const toneClass = tone === "primary" ? "bg-primary" : tone === "accent" ? "bg-accent" : "bg-gold";

  return (
    <div className={className}>
      <div className="flex h-24 items-end gap-2" role="img" aria-label={label}>
        {data.map((datum) => {
          const height = Math.max(4, (datum.value / max) * 100);
          return (
            <div key={datum.label} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="numeric text-[0.625rem] text-ink-faint">{datum.value > 0 ? datum.value : ""}</span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-700 ease-soft",
                    datum.value === 0 ? "bg-line" : toneClass,
                    datum.muted && "opacity-40",
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 text-center text-[0.625rem] uppercase tracking-wider text-ink-faint">
            {datum.label}
          </span>
        ))}
      </div>
      <p className="sr-only">{label} measured in {unit}.</p>
    </div>
  );
}
