"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  ChartLine,
  ChevronRight,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  House,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DemoBanner } from "@/components/layout/demo-banner";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/lib/demo-store";
import { levelProgress } from "@/domain/rewards/rewards";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const STUDENT_NAV: NavItem[] = [
  { href: "/student", label: "Home", icon: House, description: "Your mission control" },
  { href: "/missions", label: "Missions", icon: Compass, description: "Browse investigations" },
  { href: "/progress", label: "Progress", icon: Award, description: "XP, badges and history" },
  { href: "/tutorial", label: "How it works", icon: BookOpen, description: "First-timer guide" },
];

const TEACHER_NAV: NavItem[] = [
  { href: "/teacher", label: "Overview", icon: ChartLine, description: "Class analytics" },
  { href: "/teacher/reports", label: "Reports", icon: FileText, description: "Exportable summaries" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/teacher") return pathname === "/teacher" || pathname.startsWith("/teacher/class");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary-soft text-ink ring-1 ring-inset ring-primary/25"
                : "text-ink-soft hover:bg-panel-soft hover:text-ink",
            )}
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg border transition-colors",
                active
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-line bg-panel-soft text-ink-faint group-hover:text-ink-soft",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium leading-tight">{item.label}</span>
              <span className="block truncate text-[0.6875rem] text-ink-faint">{item.description}</span>
            </span>
            {active ? <ChevronRight className="size-3.5 text-primary" aria-hidden="true" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function ProfileCard() {
  const { state } = useDemoStore();
  const progress = levelProgress(state.student.xp);
  const initials = state.student.displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="rounded-2xl border border-line bg-panel-soft p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
          {initials || "LL"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{state.student.displayName}</p>
          <p className="text-[0.6875rem] text-ink-faint">
            Level {progress.level} · {state.student.xp.toLocaleString()} XP
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-1 text-[0.625rem] font-semibold text-gold">
          <Flame className="size-3" aria-hidden="true" />
          {state.student.streak}
        </span>
      </div>
      <Progress
        value={progress.intoLevel}
        max={progress.required}
        label={`Progress to level ${progress.level + 1}`}
        size="sm"
        className="mt-3"
      />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useDemoStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isTeacher = pathname.startsWith("/teacher");
  const navItems = isTeacher ? TEACHER_NAV : STUDENT_NAV;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  const sidebarInner = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <BrandMark />
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="grid size-9 place-items-center rounded-full border border-line text-ink-soft"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <ProfileCard />

      <div className="flex-1 space-y-5 overflow-y-auto">
        <div>
          <p className="mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {isTeacher ? "Teaching" : "Investigating"}
          </p>
          <NavLinks items={navItems} onNavigate={onNavigate} />
        </div>

        <div>
          <p className="mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Switch workspace
          </p>
          <Link
            href={isTeacher ? "/student" : "/teacher"}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-panel-soft hover:text-ink"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-line bg-panel-soft text-ink-faint">
              {isTeacher ? (
                <House className="size-4" aria-hidden="true" />
              ) : (
                <GraduationCap className="size-4" aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium leading-tight">
                {isTeacher ? "Student view" : "Teacher view"}
              </span>
              <span className="block text-[0.6875rem] text-ink-faint">
                {isTeacher ? "Return to missions" : "Class analytics demo"}
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="space-y-2 border-t border-line pt-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[0.6875rem] text-ink-faint">Appearance</span>
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-panel-soft hover:text-ink"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-ink"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] border-r border-line bg-canvas-deep/80 backdrop-blur-xl lg:flex lg:flex-col">
        {sidebarInner()}
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-canvas-deep/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[18rem] max-w-[85vw] border-r border-line bg-canvas-deep shadow-float">
            {sidebarInner(() => setMenuOpen(false))}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
          <DemoBanner />
          <div className="container-page flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                className="grid size-10 place-items-center rounded-full border border-line bg-panel-soft text-ink-soft lg:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
              <span className="hidden text-xs text-ink-faint sm:block">
                {isTeacher ? "Teacher workspace" : "Student workspace"}
                <span className="mx-2 text-line-strong">/</span>
                <span className="text-ink-soft">
                  {isTeacher ? "Class analytics" : "Hypothesis-driven science"}
                </span>
              </span>
              <BrandMark compact className="lg:hidden" />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:grid" />
            </div>
          </div>
        </header>

        <main id="main-content" className="container-page py-6 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
