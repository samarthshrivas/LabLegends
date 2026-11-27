import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "soft" | "raised";
  interactive?: boolean;
}

export function Panel({ tone = "default", interactive = false, className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        tone === "soft" ? "panel-flat" : "panel",
        tone === "raised" && "shadow-float",
        interactive &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description ? <p className="max-w-prose text-sm text-ink-soft">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
