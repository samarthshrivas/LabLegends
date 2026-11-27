import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
  href = "/",
}: {
  className?: string;
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label="LabLegends home"
    >
      <span className="relative grid size-9 place-items-center rounded-xl border border-primary/30 bg-primary-soft text-primary transition-colors group-hover:border-primary/60">
        <FlaskConical className="size-[1.05rem]" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
      </span>
      {compact ? null : (
        <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-ink">
          Lab<span className="text-primary">Legends</span>
        </span>
      )}
    </Link>
  );
}
