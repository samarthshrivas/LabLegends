import { describe, expect, it } from "vitest";
import { isCacheablePath, isPrivatePath, shouldCacheResponse } from "@/lib/pwa/cache-policy";

describe("PWA cache policy", () => {
  it("never treats private routes as cacheable", () => {
    for (const path of ["/student", "/student/x", "/teacher", "/teacher/class/class-9b", "/progress", "/results/r1", "/lab/m1", "/api/x"]) {
      expect(isPrivatePath(path)).toBe(true);
      expect(isCacheablePath(path)).toBe(false);
    }
  });

  it("allows only the app shell and public learning content", () => {
    for (const path of ["/", "/login", "/missions", "/missions/satellite-went-dark", "/offline", "/manifest.webmanifest", "/icons/icon-192.png", "/_next/static/chunk.js"]) {
      expect(isCacheablePath(path)).toBe(true);
    }
    expect(isCacheablePath("/unknown-public-page")).toBe(false);
  });

  it("rejects failed, private and cookie-bearing responses", () => {
    expect(shouldCacheResponse(new Response("ok", { status: 200 }))).toBe(true);
    expect(shouldCacheResponse(new Response("bad", { status: 500 }))).toBe(false);
    expect(shouldCacheResponse(new Response("ok", { headers: { "set-cookie": "session=1" } }))).toBe(false);
    expect(shouldCacheResponse(new Response("ok", { headers: { "cache-control": "no-store" } }))).toBe(false);
    expect(shouldCacheResponse(new Response("ok", { headers: { "cache-control": "private, max-age=60" } }))).toBe(false);
  });
});
