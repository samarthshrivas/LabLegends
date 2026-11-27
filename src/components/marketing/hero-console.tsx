import { Gauge, Radio, ShieldCheck } from "lucide-react";
import { Chip } from "@/components/ui/chip";

/** Decorative, non-interactive telemetry preview for the landing hero. */
export function HeroConsole() {
  return (
    <div className="panel relative overflow-hidden p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" aria-hidden="true" />
          <span className="numeric text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Live telemetry · Kestrel-7
          </span>
        </div>
        <Chip tone="positive">Simulated</Chip>
      </div>

      <div className="relative mt-4 rounded-xl border border-line bg-canvas-deep/60 p-3">
        <svg
          viewBox="0 0 420 210"
          role="img"
          aria-label="Schematic of a simple circuit with a 12 volt supply, a 10 ohm resistor and a current readout of 1.20 amps"
          className="h-auto w-full"
        >
          <g stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 6">
            <line x1="0" y1="42" x2="420" y2="42" />
            <line x1="0" y1="84" x2="420" y2="84" />
            <line x1="0" y1="126" x2="420" y2="126" />
            <line x1="0" y1="168" x2="420" y2="168" />
          </g>

          <path
            d="M 70 150 L 70 60 L 150 60"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 270 60 L 350 60 L 350 150 L 270 150"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Battery */}
          <line x1="112" y1="60" x2="112" y2="42" stroke="var(--primary)" strokeWidth="2" />
          <line x1="112" y1="78" x2="112" y2="60" stroke="var(--primary)" strokeWidth="2" />
          <line x1="104" y1="46" x2="120" y2="46" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <line x1="107" y1="56" x2="117" y2="56" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <text x="112" y="100" textAnchor="middle" fontSize="11" fill="var(--ink-faint)" className="numeric">
            12 V
          </text>

          {/* Resistor */}
          <path
            d="M 150 60 L 162 60 L 170 46 L 182 74 L 194 46 L 206 74 L 218 46 L 230 74 L 242 60 L 270 60"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text x="210" y="100" textAnchor="middle" fontSize="11" fill="var(--accent)" className="numeric">
            R = 10 Ω
          </text>

          {/* Ammeter */}
          <circle cx="310" cy="150" r="26" fill="var(--panel-strong)" stroke="var(--primary)" strokeWidth="2" />
          <line x1="310" y1="150" x2="325" y2="136" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="310" cy="150" r="3" fill="var(--primary)" />
          <text x="310" y="192" textAnchor="middle" fontSize="11" fill="var(--ink-faint)" className="numeric">
            A
          </text>

          {/* Charge flow */}
          <circle r="3.5" fill="var(--gold)">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M 70 150 L 70 60 L 150 60 L 270 60 L 350 60 L 350 150 L 270 150" />
          </circle>
          <circle r="3.5" fill="var(--gold)" opacity="0.6">
            <animateMotion begin="1.1s" dur="3.2s" repeatCount="indefinite" path="M 70 150 L 70 60 L 150 60 L 270 60 L 350 60 L 350 150 L 270 150" />
          </circle>
        </svg>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Voltage", value: "12.0", unit: "V", tone: "text-primary" },
          { label: "Resistance", value: "10", unit: "Ω", tone: "text-accent" },
          { label: "Current", value: "1.20", unit: "A", tone: "text-gold" },
        ].map((readout) => (
          <div key={readout.label} className="rounded-xl border border-line bg-panel-soft px-3 py-2.5">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">{readout.label}</p>
            <p className={`numeric mt-1 text-lg font-semibold ${readout.tone}`}>
              {readout.value} <span className="text-xs text-ink-faint">{readout.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.6875rem] text-ink-faint">
        <span className="inline-flex items-center gap-1.5">
          <Gauge className="size-3.5 text-primary" aria-hidden="true" />
          I = V ÷ R
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-positive" aria-hidden="true" />
          Voltage held constant
        </span>
      </div>
    </div>
  );
}
