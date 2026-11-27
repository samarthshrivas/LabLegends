import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-line bg-panel-soft text-primary">
        <Compass className="size-6" aria-hidden="true" />
      </span>
      <p className="numeric text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">404 · Off the map</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">This route has no signal</h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        The page you were looking for does not exist in this demo. Head back to the mission catalogue and pick a
        new investigation.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link href="/missions" className={buttonStyles("primary", "md")}>Browse missions</Link>
        <Link href="/" className={buttonStyles("outline", "md")}>Go home</Link>
      </div>
    </main>
  );
}
