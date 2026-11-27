import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getSupabaseEnv,
  isSupabaseConfigured,
  requireSupabaseEnv,
} from "@/lib/supabase/config";

const ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof ENV_KEYS)[number], string | undefined>;

beforeEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("Supabase environment config", () => {
  it("returns null when the project is not configured", () => {
    expect(getSupabaseEnv()).toBeNull();
    expect(isSupabaseConfigured()).toBe(false);
    expect(() => requireSupabaseEnv()).toThrow("Supabase is not configured");
  });

  it("reads the publishable key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";

    expect(getSupabaseEnv()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_test",
    });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("falls back to the legacy anon key when needed", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "legacy-anon-key";

    expect(requireSupabaseEnv().publishableKey).toBe("legacy-anon-key");
  });

  it("rejects an invalid project URL", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-url";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";

    expect(() => getSupabaseEnv()).toThrow("invalid");
  });
});
