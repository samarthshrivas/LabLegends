"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Octagon } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LabLegends route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-gold/30 bg-gold-soft text-gold">
        <Octagon className="size-6" aria-hidden="true" />
      </span>
      <p className="numeric text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold">Something interrupted the experiment</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">This view could not load</h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        Your demo progress is stored locally and has not been deleted. Try again, or return to your dashboard.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button type="button" onClick={reset} className={buttonStyles("primary", "md")}>Try again</button>
        <Link href="/student" className={buttonStyles("outline", "md")}>Student home</Link>
      </div>
    </main>
  );
}
