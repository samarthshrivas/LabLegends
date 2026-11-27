"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, X } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

const STORAGE_KEY = "lablegends.tutorial.seen";
const EVENT_NAME = "lablegends:tutorial-seen";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT_NAME, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT_NAME, onChange);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

/** One-time, dismissible invitation for students who have not seen the guide. */
export function FirstTimerBanner() {
  const seen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (seen) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage may be blocked; hiding for this session is still fine.
    }
    window.dispatchEvent(new Event(EVENT_NAME));
  };

  return (
    <section className="panel relative overflow-hidden border-primary/25 p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tutorial invitation"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-panel-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      <div className="relative flex flex-wrap items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <BookOpen className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary">New to LabLegends?</p>
          <h2 className="mt-1 text-base font-semibold text-ink">Take the three-minute tour</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Learn the investigation loop, then try a tiny experiment before starting a mission.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/tutorial" className={buttonStyles("primary", "md")}>
            Start tutorial
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={dismiss} className={buttonStyles("ghost", "md")}>
            Maybe later
          </button>
        </div>
      </div>
    </section>
  );
}
