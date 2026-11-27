"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowRight, GraduationCap, House, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { useDemoStore } from "@/lib/demo-store";
import type { Role } from "@/types/domain";
import { cn } from "@/lib/utils";

const nameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters.")
    .max(32, "Keep the display name under 32 characters."),
});

const ROLES: { id: Role; title: string; description: string; icon: typeof House }[] = [
  {
    id: "student",
    title: "Student",
    description: "Run missions, collect evidence and earn badges.",
    icon: House,
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "View class progress, misconceptions and reports.",
    icon: GraduationCap,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useDemoStore();
  const [role, setRole] = useState<Role>("student");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const enter = (nextRole: Role, name: string) => {
    signIn(nextRole, name);
    router.push(nextRole === "teacher" ? "/teacher" : "/student");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = nameSchema.safeParse({ displayName });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check your display name.");
      return;
    }
    setError(null);
    enter(role, result.data.displayName);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
      <div className="relative flex flex-col">
        <div className="pointer-events-none absolute inset-0 starfield opacity-40" aria-hidden="true" />
        <header className="relative container-page flex h-16 items-center justify-between">
          <BrandMark />
          <ThemeToggle />
        </header>

        <main className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md space-y-7">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Demo entry
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Choose your workspace
              </h1>
              <p className="text-sm leading-relaxed text-ink-soft">
                No password, no personal data. Pick a role and a display name to explore the full interface.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="panel space-y-5 p-5 sm:p-6" noValidate>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-ink">I am a…</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ROLES.map((option) => {
                    const Icon = option.icon;
                    const selected = role === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setRole(option.id)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                          selected
                            ? "border-primary/50 bg-primary-soft"
                            : "border-line bg-panel-soft hover:border-line-strong",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-lg border",
                            selected ? "border-primary/40 bg-primary/15 text-primary" : "border-line text-ink-faint",
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-ink">{option.title}</span>
                          <span className="mt-0.5 block text-[0.6875rem] leading-snug text-ink-faint">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <TextField
                label="Display name"
                value={displayName}
                onChange={(value) => {
                  setDisplayName(value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Ava"
                hint="A pseudonym is fine. Real student details are never collected."
                autoComplete="nickname"
              />

              {error ? (
                <p role="alert" className="rounded-lg border border-negative/30 bg-negative-soft px-3 py-2 text-xs text-negative">
                  {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="w-full">
                Enter {role === "teacher" ? "teacher" : "student"} workspace
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              or jump straight in
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={() => enter("student", "Ava Chen")}>
                Continue as Ava
              </Button>
              <Button variant="outline" onClick={() => enter("teacher", "Ms. Rivera")}>
                Teacher preview
              </Button>
            </div>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-positive" aria-hidden="true" />
              Demo progress is saved to this browser only. Clearing site data resets it. No account is created and
              nothing is sent to a server.
            </p>
          </div>
        </main>

        <footer className="relative container-page flex flex-wrap items-center justify-between gap-2 pb-6 text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">
            ← Back to overview
          </Link>
          <span>Prototype · synthetic data only</span>
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-line bg-canvas-deep lg:block">
        <div className="pointer-events-none absolute inset-0 grid-veil opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[110px]" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-center gap-10 p-12 xl:p-16">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
              The defining workflow
            </p>
            <p className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink xl:text-4xl">
              Observe → Question → Hypothesize → Experiment → Analyze → Reward → Observe
            </p>
          </div>
          <ol className="space-y-4">
            {[
              "Change one variable. Hold another steady.",
              "Commit to a prediction before the decisive run.",
              "Cite the observation that settles the claim.",
              "Get criterion-level feedback, then retry freely.",
            ].map((item, index) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                <span className="numeric grid size-7 shrink-0 place-items-center rounded-full border border-line bg-panel-soft text-[0.6875rem] text-primary">
                  0{index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="max-w-sm text-xs leading-relaxed text-ink-faint">
            Simulations are idealised teaching models with documented assumptions. They are not measurements and
            the prototype makes no claim of validated learning outcomes.
          </p>
        </div>
      </aside>
    </div>
  );
}
