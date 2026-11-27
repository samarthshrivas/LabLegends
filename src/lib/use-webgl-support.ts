"use client";

import { useSyncExternalStore } from "react";

let cachedSupport: boolean | null = null;

function subscribe(): () => void {
  return () => undefined;
}

function getSnapshot(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Detects WebGL without hydration drift; 2D scenes remain the default. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
