import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DemoBanner } from "@/components/layout/demo-banner";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <DemoBanner />
        <div className="container-page flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/missions"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-soft px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Exit lab
            </Link>
            <span className="hidden text-xs text-ink-faint sm:block">
              Focused workspace <span className="mx-2 text-line-strong">/</span> one variable at a time
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BrandMark compact className="sm:hidden" />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main-content" className="container-page py-5 lg:py-7">
        {children}
      </main>
    </div>
  );
}
