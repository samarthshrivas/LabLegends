"use client";

import { useSyncExternalStore } from "react";
import { CloudOff } from "lucide-react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

/** Visible, non-blocking notice that explains what still works offline. */
export function OfflineIndicator() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (online) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[90] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-gold/30 bg-canvas-deep/95 px-4 py-2 text-xs text-ink-soft shadow-float backdrop-blur"
    >
      <CloudOff className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
      Offline — cached missions and your local progress still work.
    </div>
  );
}
