"use client";

import { useState } from "react";
import { Info, RotateCcw } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";

export function DemoBanner() {
  const { resetDemo } = useDemoStore();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="border-b border-line bg-panel-soft/70">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-1.5">
        <p className="flex items-center gap-2 text-[0.6875rem] text-ink-faint">
          <Info className="size-3.5 text-primary" aria-hidden="true" />
          <span>
            <span className="font-semibold uppercase tracking-[0.12em] text-ink-soft">Demo mode</span>
            <span className="mx-1.5 text-line-strong">·</span>
            synthetic data, stored only in this browser
          </span>
        </p>
        {confirming ? (
          <span className="flex items-center gap-2">
            <span className="text-[0.6875rem] text-ink-faint">Erase local progress?</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                resetDemo();
                setConfirming(false);
              }}
            >
              Yes, reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.6875rem] font-medium text-ink-faint transition-colors hover:text-ink"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Reset demo data
          </button>
        )}
      </div>
    </div>
  );
}
