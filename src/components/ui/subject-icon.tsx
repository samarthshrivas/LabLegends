import { Atom, FlaskConical, Leaf } from "lucide-react";
import type { Subject } from "@/types/domain";
import { SUBJECT_META } from "@/data/missions";
import { cn } from "@/lib/utils";

const ICONS = { atom: Atom, flask: FlaskConical, leaf: Leaf } as const;

const TONE: Record<Subject, string> = {
  physics: "text-physics",
  chemistry: "text-chemistry",
  biology: "text-biology",
};

const TILE: Record<Subject, string> = {
  physics: "border-physics/25 bg-physics/10",
  chemistry: "border-chemistry/25 bg-chemistry/10",
  biology: "border-biology/25 bg-biology/10",
};

export function SubjectIcon({
  subject,
  size = "md",
  withTile = true,
  className,
}: {
  subject: Subject;
  size?: "sm" | "md" | "lg";
  withTile?: boolean;
  className?: string;
}) {
  const Icon = ICONS[SUBJECT_META[subject].icon];
  const iconSize = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  const tileSize = size === "sm" ? "size-8 rounded-lg" : size === "lg" ? "size-14 rounded-2xl" : "size-10 rounded-xl";

  if (!withTile) {
    return <Icon className={cn(iconSize, TONE[subject], className)} aria-hidden="true" />;
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center border",
        tileSize,
        TILE[subject],
        TONE[subject],
        className,
      )}
    >
      <Icon className={iconSize} aria-hidden="true" />
    </span>
  );
}

export function SubjectLabel({ subject, className }: { subject: Subject; className?: string }) {
  return <span className={cn("font-medium", TONE[subject], className)}>{SUBJECT_META[subject].label}</span>;
}
