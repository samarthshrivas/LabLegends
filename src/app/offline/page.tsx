"use client";

import Link from "next/link";
import { CloudOff, Home, RefreshCw } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-line bg-panel-soft text-primary">
        <CloudOff className="size-6" aria-hidden="true" />
      </span>
      <p className="numeric text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">Offline mode</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">You are disconnected</h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        The app shell and public mission catalogue are cached, so you can keep reading briefings. Your lab work is
        stored locally on this device and will still be here when you return. Private dashboards are not cached.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link href="/missions" className={buttonStyles("primary", "md")}>
          Open cached missions
        </Link>
        <button type="button" onClick={() => window.location.reload()} className={buttonStyles("outline", "md")}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </button>
        <Link href="/" className={buttonStyles("ghost", "md")}>
          <Home className="size-4" aria-hidden="true" />
          Home
        </Link>
      </div>
    </main>
  );
}
