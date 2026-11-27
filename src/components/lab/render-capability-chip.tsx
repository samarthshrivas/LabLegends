"use client";

import { Monitor } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { useWebGLSupport } from "@/lib/use-webgl-support";

/** Shows that the 2D scene is intentional, with an honest capability note. */
export function RenderCapabilityChip() {
  const webgl = useWebGLSupport();
  return (
    <Chip
      tone="neutral"
      title={
        webgl
          ? "WebGL is available. This MVP intentionally uses the accessible 2D scene."
          : "WebGL is unavailable. The accessible 2D fallback is active."
      }
    >
      <Monitor className="size-3" aria-hidden="true" />
      2D {webgl ? "ready" : "fallback"}
    </Chip>
  );
}
