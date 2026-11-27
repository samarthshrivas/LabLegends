"use client";

import { useEffect } from "react";

/** Registers the offline service worker after the page has loaded. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    // Avoid stale caches during development; offline support is for built output.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Offline support is progressive enhancement; the app works without it.
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
