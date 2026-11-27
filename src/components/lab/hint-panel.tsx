"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { MissionHint } from "@/types/domain";

export function HintPanel({
  hints,
  revealedIds,
  onReveal,
}: {
  hints: MissionHint[];
  revealedIds: string[];
  onReveal: (hintId: string) => void;
}) {
  const revealed = hints.filter((hint) => revealedIds.includes(hint.id));
  const next = hints.find((hint) => !revealedIds.includes(hint.id));

  return (
    <Panel className="p-5 sm:p-6">
      <PanelHeader
        eyebrow="Support"
        title="Stuck? Take a hint"
        description="Hints are progressive and never reduce your XP."
      />
      <div className="mt-4 space-y-3">
        {revealed.map((hint, index) => (
          <div key={hint.id} className="rounded-xl border border-gold/25 bg-gold-soft/30 p-3.5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
              <Lightbulb className="size-3.5" aria-hidden="true" />
              Hint {index + 1} · {hint.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{hint.body}</p>
          </div>
        ))}

        {next ? (
          <Button variant="ghost" size="sm" onClick={() => onReveal(next.id)} className="w-full">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Reveal hint {revealed.length + 1} of {hints.length}
          </Button>
        ) : (
          <p className="text-xs text-ink-faint">You have seen every hint for this mission.</p>
        )}
      </div>
    </Panel>
  );
}
