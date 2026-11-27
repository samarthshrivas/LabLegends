import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("space-y-2", align === "center" && "max-w-2xl")}>
        {eyebrow ? (
          <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <span aria-hidden="true" className="h-px w-6 bg-primary/60" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "gold";
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {Icon ? (
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border",
            tone === "primary" && "border-primary/25 bg-primary-soft text-primary",
            tone === "gold" && "border-gold/25 bg-gold-soft text-gold",
            tone === "default" && "border-line bg-panel-soft text-ink-soft",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
        <p className="numeric mt-0.5 text-xl font-semibold text-ink">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-ink-faint">{sub}</p> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl border border-line bg-panel-soft text-ink-faint">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
